// One-shot ingestion: read portfolio data, chunk, embed, and load into
// rag_chunks. Run with: `npm run ingest`.
//
// Sources (per user scope decision):
//   - src/data/content.js
//       profile, about, expertise, skillCategories,
//       experience, projects (flagship), education, certifications, hobbies
//   - src/data/projects.js
//       ouraniex (self-initiated brand), enterprise (work shipped)
//
// INTENTIONALLY EXCLUDED (out of chat scope):
//   - src/data/blog.js          (long-form posts)
//   - the `research` export     (academic papers)

import { v4 as uuidv4 } from 'uuid';
import {
  profile,
  about,
  expertise,
  skillCategories,
  experience,
  projects as flagshipProjects,
  education,
  certifications,
  hobbies,
} from '../../src/data/content.js';
import { ouraniex, enterprise } from '../../src/data/projects.js';
import { withConn, initDb, closeDb } from './db.js';
import { embedBatch } from './embed.js';

// ---------------------------------------------------------------------------
// Chunking
// ---------------------------------------------------------------------------
function chunkText(text, { max = 700, overlap = 80 } = {}) {
  const out = [];
  const t = (text || '').trim();
  if (!t) return out;
  let i = 0;
  while (i < t.length) {
    const end = Math.min(t.length, i + max);
    let cut = end;
    if (end < t.length) {
      const lastDot = t.lastIndexOf('. ', end);
      const lastBreak = Math.max(
        t.lastIndexOf('\n', end),
        t.lastIndexOf(' ', end),
      );
      cut = lastDot > i + max * 0.4
        ? lastDot + 1
        : lastBreak > i + max * 0.4
          ? lastBreak
          : end;
    }
    const piece = t.slice(i, cut).trim();
    if (piece) out.push(piece);
    if (cut >= t.length) break;
    i = Math.max(cut - overlap, i + 1);
  }
  return out;
}

function text(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  try { return JSON.stringify(value, null, 2); } catch { return String(value); }
}

function pushChunks(bucket, source, section, body) {
  const t = text(body);
  if (!t) return;
  chunkText(t).forEach((piece) => bucket.push({ source, section, text: piece }));
}

// ---------------------------------------------------------------------------
// Source adapters
// ---------------------------------------------------------------------------
function buildCorpus() {
  const c = [];

  pushChunks(c, 'profile', 'profile', [
    `Name: ${profile.name}`,
    `Tagline: ${profile.tagline}`,
    `Roles: ${(profile.roles || []).join(', ')}`,
    `Email: ${profile.email}`,
    `Phone: ${profile.phone}`,
    `Location: ${profile.location}`,
  ].join('\n'));

  pushChunks(c, 'about', 'overview', about.body);
  pushChunks(c, 'about', 'stats', text(about.stats));

  expertise.forEach((e, i) => {
    pushChunks(c, 'expertise', e.title || `card-${i + 1}`, e.desc);
  });

  skillCategories.forEach((g) => {
    pushChunks(
      c,
      'skills',
      g.title,
      `${g.title} skills: ${(g.items || []).join(', ')}`
    );
  });

  experience.forEach((e, i) => {
    const body = [
      `${e.role || ''} at ${e.org || ''}${e.location ? `, ${e.location}` : ''}`,
      `Period: ${e.period || ''}`,
      `Summary: ${e.desc || ''}`,
    ].join('\n');
    pushChunks(c, 'experience', e.org || `role-${i + 1}`, body);
  });

  flagshipProjects.forEach((p, i) => {
    const body = [
      `${p.name} — ${p.kind || ''} (${p.org || ''})`,
      p.desc || '',
      `Tags: ${(p.tags || []).join(', ')}`,
      `Metrics: ${text(p.metrics)}`,
    ].join('\n');
    pushChunks(c, 'projects', p.name || `p-${i + 1}`, body);
  });

  ouraniex.forEach((p, i) => {
    const body = [
      `${p.name} (${p.title || ''}) — ${p.period || ''}`,
      p.summary || '',
      p.detail || '',
      p.etymology || '',
      `Tags: ${(p.tags || []).join(', ')}`,
      `Learned: ${text(p.learned)}`,
    ].join('\n');
    pushChunks(c, 'ouraniex', p.name || `o-${i + 1}`, body);
  });

  enterprise.forEach((p, i) => {
    const body = [
      `${p.name} (${p.title || ''}) — ${p.org || ''} · ${p.period || ''}`,
      p.summary || '',
      p.detail || '',
      `Stack: ${(p.stack || []).join(', ')}`,
      `Tags: ${(p.tags || []).join(', ')}`,
      `Metric: ${p.metric || ''}`,
    ].join('\n');
    pushChunks(c, 'enterprise', p.name || `e-${i + 1}`, body);
  });

  education.forEach((ed, i) => {
    const body = [
      `${ed.degree || ''} — ${ed.school || ''}${ed.location ? `, ${ed.location}` : ''}`,
      `Period: ${ed.period || ''} · Grade: ${ed.grade || ''}`,
    ].join('\n');
    pushChunks(c, 'education', ed.school || `e-${i + 1}`, body);
  });

  certifications.forEach((cert, i) => {
    const body = `${cert.title} by ${cert.issuer} (${cert.date})`;
    pushChunks(c, 'certifications', cert.title || `c-${i + 1}`, body);
  });

  hobbies.forEach((h, i) => {
    const body = `${h.title}${h.tag ? ` (${h.tag})` : ''}: ${h.desc || ''}`;
    pushChunks(c, 'hobbies', h.title || `h-${i + 1}`, body);
  });

  return c.filter((r) => r.text.length > 0);
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------
async function clearChunks() {
  return withConn(async (c) => {
    await c.execute('TRUNCATE TABLE rag_chunks');
    await c.commit();
  });
}

async function insertChunks(chunks) {
  return withConn(async (c) => {
    const rows = chunks.map((ch) => ({
      id: Buffer.from(uuidv4().replace(/-/g, ''), 'hex'),
      source: ch.source,
      section: ch.section,
      content: ch.text,
      embedding: ch.embedding,
    }));

    await c.executeMany(
      `INSERT INTO rag_chunks (id, source, section, content, embedding)
       VALUES (:id, :source, :section, :content, :embedding)`,
      rows,
      { autoCommit: true }
    );
  });
}

// ---------------------------------------------------------------------------
// Driver
// ---------------------------------------------------------------------------
async function main() {
  await initDb();
  const corpus = buildCorpus();
  console.log(`[ingest] corpus size: ${corpus.length} chunks`);

  const BATCH = 16;
  const enriched = [];
  for (let i = 0; i < corpus.length; i += BATCH) {
    const slice = corpus.slice(i, i + BATCH);
    const vectors = await embedBatch(slice.map((s) => s.text));
    slice.forEach((s, j) => enriched.push({ ...s, embedding: vectors[j] }));
    console.log(`  embedded ${enriched.length}/${corpus.length}`);
  }

  console.log(`[ingest] clearing existing rag_chunks`);
  await clearChunks();
  console.log(`[ingest] inserting into Oracle`);
  await insertChunks(enriched);
  console.log(`[ingest] done — ${enriched.length} chunks loaded`);

  await closeDb();
}

main().catch((err) => {
  console.error('[ingest] failed', err);
  process.exit(1);
});
