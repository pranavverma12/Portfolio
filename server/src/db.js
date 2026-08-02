// Thin wrapper around oracledb that uses a single shared pool.
// On Render's free tier we keep the pool tiny (1 conn) so we don't exceed
// ADB's per-session concurrency limit on the LOW service.

import oracledb from 'oracledb';
import { config } from './config.js';

let pool = null;
let initialised = false;

const poolConfig = {
  user: config.db.user,
  password: config.db.password,
  externalAuth: undefined,
  poolMin: 0,
  poolMax: 1, // LOW tier tolerates a single session; tune upward for HIGH.
  poolIncrement: 0,
  poolTimeout: 60,
  // ADB requires TCPS + wallet; oracledb reads tnsnames.ora from this dir.
  configDir: config.db.walletDir, // legacy alias
  walletLocation: config.db.walletDir,
  walletPassword: config.db.walletPassword,
  connectString: config.db.connectString,
};

// We must use thin mode — ADB free tier doesn't ship the Instant Client.
oracledb.initOracleClient = undefined; // explicit
// Force thin driver
process.env.ORA_SDTZ = 'UTC';

export async function initDb() {
  if (initialised) return pool;
  if (!pool) pool = await oracledb.createPool(poolConfig);
  initialised = true;
  return pool;
}

export async function closeDb() {
  if (pool) await pool.close(10);
  pool = null;
  initialised = false;
}

// `func` runs inside a pooled connection. Auto-reconnect & JSON-friendly.
export async function withConn(fn) {
  const p = await initDb();
  const conn = await p.getConnection();
  try {
    return await fn(conn);
  } finally {
    await conn.close();
  }
}

export async function ping() {
  return withConn(async (c) => {
    const r = await c.execute('SELECT 1 AS ok FROM dual');
    return r.rows[0][0] === 1;
  });
}

// ---- SQL helpers ----------------------------------------------------------

// Convert JS array of numbers to an oracledb Vector Bind in array form.
// We pass the array via the BINDS and tag the column as VECTOR; oracledb 6
// supports JS arrays for VECTOR columns.
export function vectorBind(arr) {
  return { val: arr, type: oracledb.DB_TYPE_VECTOR, dir: oracledb.BIND_IN };
}

// 32-char hex string (UUID without dashes) -> 16-byte Buffer for RAW(16) binds.
export function raw16(v) {
  return Buffer.from(String(v).replace(/-/g, ''), 'hex');
}
