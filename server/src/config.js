// Centralised env loading + validation.
// We bail loudly on missing values, but only in production.

import 'dotenv/config';

const required = (key, fallback) => {
  const v = process.env[key] ?? fallback;
  if (v === undefined || v === '') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required env var: ${key}`);
    }
  }
  return v ?? '';
};

const num = (key, fallback) => {
  const v = parseInt(process.env[key], 10);
  return Number.isFinite(v) ? v : fallback;
};

export const config = {
  port: num('PORT', 8787),
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigin: required('ALLOWED_ORIGIN', '*'),
  trustProxy: num('TRUST_PROXY', 1),

  db: {
    user: required('DB_USER'),
    password: process.env.DB_PASSWORD || '',
    walletDir: process.env.DB_WALLET_DIR || '',
    walletPassword: process.env.DB_WALLET_PASSWORD || '',
    // The Hyderabad ADB connect descriptor is committed in code (no secret).
    // Put DB_CONNECT_STRING in .env to override (e.g. to a separate dev DB).
    connectString:
      process.env.DB_CONNECT_STRING ||
      '(description=(retry_count=20)(retry_delay=3)' +
      '(address=(protocol=tcps)(port=1521)(host=adb.ap-hyderabad-1.oraclecloud.com))' +
      '(connect_data=(service_name=gad18bf1b40718f_ouraniexcore_low.adb.oraclecloud.com))' +
      '(security=(ssl_server_dn_match=yes)))',
    tnsName: process.env.DB_TNS_NAME || '',
  },

  llm: {
    gatewayUrl: required('OURANIEX_GATEWAY_URL'),
    apiKey: process.env.OURANIEX_API_KEY || '',
    chatAlias: process.env.CHAT_MODEL_ALIAS || 'ouraniex-chat-small',
    embedAlias: process.env.EMBED_MODEL_ALIAS || 'ouraniex-embed-384',
  },

  chat: {
    cap: num('CHAT_MAX_QUESTIONS', 5),
    maxTokens: num('CHAT_MAX_TOKENS', 400),
    topK: num('CHAT_RETRIEVAL_K', 6),
    refusalHint:
      process.env.CHAT_REFUSAL_HINT ||
      'Try asking about his projects, skills, experience, certifications, education, or hobbies.',
  },
};
