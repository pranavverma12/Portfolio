// Ouraniex SDK gateway wrapper.
// All LLM calls go through this so the portfolio never talks to a provider
// directly (project rule from CLAUDE.md).
//
// The gateway exposes an OpenAI-compatible /v1/embeddings and /v1/chat route
// that maps model aliases (e.g. "ouraniex-embed-384") to the real model the
// user wants us to use.

import { config } from './config.js';

const baseUrl = config.llm.gatewayUrl.replace(/\/+$/, '');

async function gate(path, body) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(config.llm.apiKey ? { Authorization: `Bearer ${config.llm.apiKey}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`gateway ${path} → ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

/**
 * Embed a batch of strings -> array of 384-dim embeddings (Float32 list).
 */
export async function embedBatch(texts) {
  const data = await gate('/v1/embeddings', {
    model: config.llm.embedAlias,
    input: texts,
  });
  return data.data.map((d) => d.embedding);
}

/**
 * Single message chat completion through the gateway. Returns the model's
 * text reply (string).
 */
export async function chatComplete({ system, messages, maxTokens }) {
  const data = await gate('/v1/chat/completions', {
    model: config.llm.chatAlias,
    temperature: 0.4,
    max_tokens: maxTokens ?? config.chat.maxTokens,
    messages: [
      { role: 'system', content: system },
      ...messages,
    ],
  });
  return data.choices?.[0]?.message?.content?.trim() ?? '';
}
