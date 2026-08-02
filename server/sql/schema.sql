-- ============================================================================
-- Portfolio Chat — Oracle 23ai schema
-- ----------------------------------------------------------------------------
-- Runs on Oracle Autonomous DB (23ai). Uses:
--   * JSON Collections (BSON) as the document store equivalent of MongoDB.
--   * Native VECTOR(384, FLOAT32) for embeddings + VECTOR_INDEX for ANN search.
--
-- Connection (from tnsnames.ora):
--   adb.ap-hyderabad-1.oraclecloud.com:1521/tcps,
--   service_name=gad18bf1b40718f_ouraniexcore_low.adb.oraclecloud.com
--
-- Apply via:
--   sql admin@<service>_low @sql/schema.sql
-- or split into pieces using the helper files in sql/.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. chat_sessions  (JSON Collection — Oracle's "MongoDB-style" NoSQL)
-- ----------------------------------------------------------------------------
-- Oracle 23ai JSON Collections give us BSON-style documents on top of Oracle —
-- the closest equivalent to MongoDB without leaving the Oracle platform.

BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS chat_messages PURGE';
  EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS chat_sessions  PURGE';
  EXECUTE IMMEDIATE 'DROP TABLE IF EXISTS rag_chunks     PURGE';
END;
/

CREATE TABLE chat_sessions
  -- JSON Collection: each row is a BSON document. You can later switch this
  -- to a Mongo-compatible wire protocol using Oracle's MCS or run an
  -- oracledb shim that returns the same JSON shape as our Express API.
  JSON COLLECTION;

-- Helpful scalar side-table for fast lookup without scanning every doc.
-- Mirrors a small set of values out of the JSON for indexed access —
-- equivalent to a secondary index in Mongo.
CREATE TABLE chat_sessions_index (
  fingerprint   VARCHAR2(64)                    NOT NULL,
  ip            VARCHAR2(64)                    NOT NULL,
  session_id    RAW(16)                         NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE        NOT NULL DEFAULT SYSTIMESTAMP,
  last_seen_at  TIMESTAMP WITH TIME ZONE        NOT NULL DEFAULT SYSTIMESTAMP,
  CONSTRAINT chat_sessions_index_pk PRIMARY KEY (fingerprint, ip)
);

CREATE INDEX chat_sessions_index_seen ON chat_sessions_index(last_seen_at);


-- ----------------------------------------------------------------------------
-- 2. chat_messages  (relational, FK -> chat_sessions)
-- ----------------------------------------------------------------------------
-- We keep messages in a table (not a JSON Collection) so we can index/aggregate
-- them in SQL.

CREATE TABLE chat_messages (
  id            RAW(16)                         PRIMARY KEY,
  -- session_id is the BSON _id rendered as a 16-byte UUID inside the JSON
  -- Collection. We keep the FK as a logical reference so the chat thread is
  -- collected with a `DELETE WHERE json_value(doc,'$.id') = :sid` on the
  -- NoSQL side; triggers/cascading deletes are not used here.
  session_id    RAW(16)                         NOT NULL,
  role          VARCHAR2(16)                    NOT NULL
                  CHECK (role IN ('user', 'assistant', 'system')),
  content       CLOB                            NOT NULL,
  -- Did the assistant refuse (off-topic) on this turn?
  refused       NUMBER(1)                       DEFAULT 0
                  CHECK (refused IN (0, 1)),
  -- Did we actually answer (vs. e.g. transport error)?
  answered      NUMBER(1)                       DEFAULT 1
                  CHECK (answered IN (0, 1)),
  created_at    TIMESTAMP WITH TIME ZONE        NOT NULL DEFAULT SYSTIMESTAMP
);

CREATE INDEX chat_messages_session_idx ON chat_messages(session_id, created_at);


-- ----------------------------------------------------------------------------
-- 3. rag_chunks  (VECTOR index)
-- ----------------------------------------------------------------------------
-- Embeddings of the portfolio content (src/data/* core). One row per chunk.

CREATE TABLE rag_chunks (
  id            RAW(16)                         PRIMARY KEY,
  -- Which file/section produced the chunk. Lets us show provenance.
  source        VARCHAR2(64)                    NOT NULL,
  section       VARCHAR2(64)                    NOT NULL,
  -- The chunk payload (text used for context + citation).
  content       CLOB                            NOT NULL,
  -- 384-dim embedding produced by an external embedding model
  -- (consistent with text-embedding-3-small / all-MiniLM-L6-v2 size).
  embedding     VECTOR(384, FLOAT32)            NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE        NOT NULL DEFAULT SYSTIMESTAMP
);

-- Native ANN index — Oracle picks NEIGHBOR GRAPH or IVF behind the scenes.
-- COSINE similarity (most semantic-embedding friendly).
CREATE VECTOR INDEX rag_chunks_vec_idx
  ON rag_chunks (embedding)
  ORGANIZATION INMEMORY NEIGHBOR GRAPH
  DISTANCE COSINE
  WITH TARGET ACCURACY 95;


-- ----------------------------------------------------------------------------
-- Helper view — admin/debug (joins scalar index to the JSON Collection)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_session_overview AS
SELECT
  s.session_id,
  s.fingerprint,
  s.ip,
  JSON_VALUE(d.data, '$.country')                                AS country,
  JSON_VALUE(d.data, '$.city')                                   AS city,
  CAST(JSON_VALUE(d.data, '$.question_count') AS NUMBER)         AS questions_used,
  CAST(JSON_VALUE(d.data, '$.cap') AS NUMBER)                    AS cap,
  s.created_at,
  s.last_seen_at
FROM chat_sessions_index s
JOIN CHAT_SESSIONS d
  ON JSON_VALUE(d.data, '$.id') = RAWTOHEX(s.session_id)
ORDER BY s.last_seen_at DESC;

-- ============================================================================
-- Done. To verify:
--   SELECT object_name, object_type FROM user_objects
--    WHERE object_name IN ('CHAT_SESSIONS','CHAT_MESSAGES','RAG_CHUNKS',
--                          'RAG_CHUNKS_VEC_IDX');
-- ============================================================================
