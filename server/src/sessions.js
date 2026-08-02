// Session + message persistence on top of Oracle ADB.
// chat_sessions is a JSON Collection (BSON), chat_messages is relational,
// chat_sessions_index is a scalar mirror so we can upsert sessions with
// a unique (fingerprint, ip) constraint.

import { v4 as uuidv4 } from 'uuid';
import oracledb from 'oracledb';
import { withConn, raw16 } from './db.js';
import { config } from './config.js';

// UUID v4 -> 16 byte RAW (stored in JSON as 32-char hex string for readability).
function newSidRaw() {
  return raw16(uuidv4());
}

function sidHex(raw) {
  return Buffer.from(raw).toString('hex');
}

export async function findOrCreateSession({ fingerprint, ip, meta }) {
  return withConn(async (c) => {
    // Try the index side-table first.
    const existing = await c.execute(
      `SELECT session_id FROM chat_sessions_index
        WHERE fingerprint = :fp AND ip = :ip`,
      { fp: fingerprint, ip },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (existing.rows.length) {
      const sidRaw = existing.rows[0].SESSION_ID;
      await c.execute(
        `UPDATE chat_sessions_index SET last_seen_at = SYSTIMESTAMP
           WHERE fingerprint = :fp AND ip = :ip`,
        { fp: fingerprint, ip }
      );
      const doc = await loadSessionDoc(c, sidHex(sidRaw));
      return { sidRaw, doc, created: false };
    }

    // Create new session.
    const sid = newSidRaw();
    const sidHexStr = sidHex(sid);
    const now = Date.now();
    const doc = {
      id: sidHexStr,
      fingerprint,
      ip,
      meta,
      question_count: 0,
      cap: config.chat.cap,
      first_question_at: null,
      last_question_at: null,
      created_at: now,
    };

    // Insert into JSON collection (chat_sessions is JSON COLLECTION, so we
    // pass a single JSON document).
    await c.execute(
      `INSERT INTO chat_sessions (data) VALUES (:1)`,
      [JSON.stringify(doc)],
      { autoCommit: false, bindDefs: [{ type: oracledb.STRING }] }
    );

    // Mirror to the scalar side table (unique fingerprint+ip).
    await c.execute(
      `INSERT INTO chat_sessions_index (fingerprint, ip, session_id)
       VALUES (:fp, :ip, :sid)`,
      { fp: fingerprint, ip, sid }
    );

    await c.commit();
    return { sidRaw: sid, doc, created: true };
  });
}

async function loadSessionDoc(c, idHex) {
  const r = await c.execute(
    `SELECT data FROM chat_sessions
       WHERE JSON_VALUE(data, '$.id') = :id`,
    { id: idHex }
  );
  if (!r.rows.length) return null;
  // data comes back as a JSON object in 23ai.
  return typeof r.rows[0][0] === 'string'
    ? JSON.parse(r.rows[0][0])
    : r.rows[0][0];
}

export async function getSession(sidRaw) {
  return withConn(async (c) => {
    const doc = await loadSessionDoc(c, sidHex(sidRaw));
    return doc ? { sidRaw, doc } : null;
  });
}

export async function incrementQuestion(sidRaw) {
  return withConn(async (c) => {
    const idHex = sidHex(sidRaw);
    // Update JSON document
    const r = await c.execute(
      `UPDATE chat_sessions
          SET data = JSON_MERGEPATCH(
                data,
                JSON_OBJECT(
                  'question_count' VALUE
                    CAST(JSON_VALUE(data, '$.question_count') AS NUMBER) + 1,
                  'last_question_at' VALUE
                    TO_NUMBER(TO_CHAR(SYSTIMESTAMP, 'NNNNFF'))
                )
              ),
              updated_at = SYSTIMESTAMP
        WHERE JSON_VALUE(data, '$.id') = :id`,
      { id: idHex }
    );
    if (!r.rowsAffected) {
      throw new Error('session not found');
    }
    await c.commit();
    const doc = await loadSessionDoc(c, idHex);
    return doc;
  });
}

export async function recordMessage(sidRaw, role, content, { refused, answered }) {
  return withConn(async (c) => {
    const mid = newSidRaw();
    await c.execute(
      `INSERT INTO chat_messages
         (id, session_id, role, content, refused, answered)
       VALUES (:id, :sid, :role, :content, :refused, :answered)`,
      {
        id: mid,
        sid: sidRaw,
        role,
        content,
        refused: refused ? 1 : 0,
        answered: answered ? 1 : 0,
      }
    );
    await c.commit();
  });
}

export async function listMessages(sidRaw) {
  return withConn(async (c) => {
    const r = await c.execute(
      `SELECT role, content, refused, answered, created_at
         FROM chat_messages
        WHERE session_id = :sid
        ORDER BY created_at ASC`,
      { sid: sidRaw }
    );
    return r.rows.map((row) => ({
      role: row[0],
      content: row[1],
      refused: !!row[2],
      answered: !!row[3],
      created_at: row[4],
    }));
  });
}
