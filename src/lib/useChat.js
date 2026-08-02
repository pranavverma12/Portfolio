// Chat client + session hook.
// Talks to the chat backend deployed as a separate service.
//
// Identity: a UUID stored in localStorage (the "fingerprint") + the IP which
// the server reads from the request headers. Question cap = 5, enforced
// server-side.

import { useCallback, useEffect, useRef, useState } from 'react';

// Vite-style env. Configure `VITE_CHAT_API` at build time.
const API_BASE = (
  import.meta.env.VITE_CHAT_API ||
  // sensible default for local dev — Render sets this to the chat service URL.
  ''
).replace(/\/+$/, '');

const FP_KEY = 'pv_chat_fp_v1';
const SID_KEY = 'pv_chat_sid_v1';

function uuid() {
  // crypto.randomUUID is available everywhere modern; fallback is good enough.
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getFingerprint() {
  let fp = localStorage.getItem(FP_KEY);
  if (!fp) {
    fp = uuid();
    localStorage.setItem(FP_KEY, fp);
  }
  return fp;
}

function clientMeta() {
  if (typeof window === 'undefined') return {};
  return {
    lang: navigator.language,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    screen: `${screen.width}x${screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  };
}

async function http(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* not JSON */ }
  if (!res.ok) {
    const err = new Error((json && json.error) || `HTTP ${res.status}`);
    err.status = res.status;
    err.payload = json;
    throw err;
  }
  return json;
}

export function useChat() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(null); // {id, questions_used, cap, questions_left}
  const [messages, setMessages] = useState([]); // [{role:'user'|'assistant', content, refused?}]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  // Initialise (or resume) the session on first open.
  const ensureSession = useCallback(async () => {
    if (session) return session;
    const cachedId = localStorage.getItem(SID_KEY);
    if (cachedId) {
      try {
        const data = await http(`/api/session/${cachedId}/messages`, null);
        setSession(data.session);
        setMessages(data.messages || []);
        return data.session;
      } catch {
        // fall through to create new
        localStorage.removeItem(SID_KEY);
      }
    }
    const data = await http('/api/session', {
      fingerprint: getFingerprint(),
      ...clientMeta(),
    });
    localStorage.setItem(SID_KEY, data.session.id);
    setSession(data.session);
    setMessages([]);
    return data.session;
  }, [session]);

  const openChat = useCallback(async () => {
    setOpen(true);
    setError(null);
    try {
      await ensureSession();
    } catch (e) {
      setError('Could not reach the chat service. Please try again later.');
    }
  }, [ensureSession]);

  const closeChat = useCallback(() => setOpen(false), []);

  const send = useCallback(async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    if (!session) {
      setError('No active session.');
      return;
    }
    if (session.questions_left <= 0) {
      setError('You have reached the 5-question limit for this session.');
      return;
    }

    // Optimistic user message + assistant "typing" placeholder
    const userMsg = { role: 'user', content: trimmed, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const data = await http(
        '/api/chat',
        {
          session_id: session.id,
          fingerprint: getFingerprint(),
          text: trimmed,
        },
        { signal: controller.signal }
      );
      const assistantMsg = {
        role: 'assistant',
        content: data.answer,
        refused: !!data.refused,
        ts: Date.now(),
      };
      setMessages((m) => [...m, assistantMsg]);
      setSession((s) =>
        s
          ? {
              ...s,
              questions_used: data.questions_used,
              questions_left: data.questions_left,
              cap: data.cap,
            }
          : s
      );
    } catch (e) {
      const detail =
        e.payload?.detail || e.message || 'Something went wrong. Please retry.';
      const errorMsg = {
        role: 'assistant',
        content: `Sorry — ${detail}`,
        refused: true,
        ts: Date.now(),
      };
      setMessages((m) => [...m, errorMsg]);
      setError(detail);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [session]);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  // Reset = leave (visitors don't get infinite; we just don't retain)
  const reset = useCallback(() => {
    localStorage.removeItem(SID_KEY);
    setSession(null);
    setMessages([]);
  }, []);

  // If 5 questions have been used and the user closes, cap persists
  useEffect(() => {
    if (session && session.questions_left <= 0) {
      // intentionally leave messages in view
    }
  }, [session]);

  return {
    open,
    openChat,
    closeChat,
    session,
    messages,
    loading,
    error,
    send,
    abort,
    reset,
    apiBase: API_BASE,
  };
}

export const __test = { uuid, getFingerprint };
