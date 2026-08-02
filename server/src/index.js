// Express entry point.
// Endpoints:
//   GET  /api/health             -> { ok: true, now }
//   POST /api/session            -> { session: { id, questions_used, cap } }
//   GET  /api/session/:id/messages -> { messages: [...] }
//   POST /api/chat               -> { answer, refused, questions_left }
//
// The chat endpoint enforces the 5-question cap, runs RAG + off-topic guard,
// and persists messages + metadata to Oracle ADB.

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { initDb, ping } from './db.js';
import { parseReqMeta, applyGeo } from './meta.js';
import {
  findOrCreateSession,
  getSession,
  incrementQuestion,
  recordMessage,
  listMessages,
} from './sessions.js';
import { embedBatch } from './embed.js';
import { retrieve, answer } from './rag.js';
import { raw16 } from './db.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', config.trustProxy);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(
  cors({
    origin: config.allowedOrigin === '*' ? true : config.allowedOrigin,
    methods: ['GET', 'POST'],
  })
);
app.use(express.json({ limit: '32kb' }));
app.use(morgan('tiny'));

// One shared per-IP limiter (per 5 min window) — protects the LLM gateway.
app.use(
  '/api/',
  rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ---- Health ---------------------------------------------------------------

app.get('/api/health', async (_req, res) => {
  try {
    await ping();
    res.json({ ok: true, now: new Date().toISOString() });
  } catch (e) {
    res.status(503).json({ ok: false, error: e.message });
  }
});

// ---- Sessions -------------------------------------------------------------

app.post('/api/session', async (req, res, next) => {
  try {
    const { fingerprint } = req.body || {};
    if (!fingerprint || typeof fingerprint !== 'string' || fingerprint.length < 8) {
      return res.status(400).json({ error: 'fingerprint required' });
    }
    const baseMeta = parseReqMeta(req, req.body);
    const meta = await applyGeo(baseMeta);

    const { sidRaw, doc } = await findOrCreateSession({
      fingerprint,
      ip: baseMeta.ip,
      meta,
    });

    res.json({
      session: {
        id: doc.id,
        questions_used: doc.question_count,
        cap: doc.cap,
        questions_left: Math.max(0, doc.cap - doc.question_count),
      },
    });
  } catch (e) {
    next(e);
  }
});

app.get('/api/session/:id/messages', async (req, res, next) => {
  try {
    const sidRaw = raw16(req.params.id);
    if (sidRaw.length !== 16) return res.status(400).json({ error: 'bad id' });
    const sess = await getSession(sidRaw);
    if (!sess) return res.status(404).json({ error: 'not found' });
    const messages = await listMessages(sidRaw);
    res.json({
      session: {
        id: sess.doc.id,
        questions_used: sess.doc.question_count,
        cap: sess.doc.cap,
        questions_left: Math.max(0, sess.doc.cap - sess.doc.question_count),
      },
      messages,
    });
  } catch (e) {
    next(e);
  }
});

// ---- Chat -----------------------------------------------------------------

app.post('/api/chat', async (req, res, next) => {
  try {
    const { session_id, fingerprint, text } = req.body || {};
    if (!session_id || !fingerprint || !text) {
      return res.status(400).json({ error: 'session_id, fingerprint, text required' });
    }
    if (text.length > 1000) {
      return res.status(400).json({ error: 'question too long' });
    }

    const sidRaw = raw16(session_id);
    if (sidRaw.length !== 16) return res.status(400).json({ error: 'bad session id' });

    const sess = await getSession(sidRaw);
    if (!sess || sess.doc.fingerprint !== fingerprint) {
      return res.status(403).json({ error: 'session does not match fingerprint' });
    }
    if (sess.doc.question_count >= sess.doc.cap) {
      return res.status(429).json({
        error: 'cap reached',
        questions_left: 0,
        cap: sess.doc.cap,
      });
    }

    // Record the user turn first (so the cap increments even on transport
    // failure after this point).
    await recordMessage(sidRaw, 'user', text, { refused: false, answered: false });
    await incrementQuestion(sidRaw);
    const updated = await getSession(sidRaw);

    // Embed + retrieve + answer.
    const [queryVec] = await embedBatch([text]);
    const chunks = await retrieve(queryVec);
    const result = await answer({ question: text, chunks });

    await recordMessage(sidRaw, 'assistant', result.answer, {
      refused: result.off_topic,
      answered: true,
    });

    res.json({
      answer: result.answer,
      refused: result.off_topic,
      cites: result.cites,
      questions_used: updated.doc.question_count,
      cap: updated.doc.cap,
      questions_left: Math.max(0, updated.doc.cap - updated.doc.question_count),
    });
  } catch (e) {
    next(e);
  }
});

// ---- 404 + error + boot ---------------------------------------------------

app.use('/api/*', (_req, res) => res.status(404).json({ error: 'not found' }));
app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error('[chat]', err);
  res.status(500).json({ error: 'internal', detail: err.message?.slice(0, 200) });
});

(async () => {
  try {
    await initDb();
    app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`[chat] listening on :${config.port} (${config.nodeEnv})`);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[chat] boot failed', e);
    process.exit(1);
  }
})();
