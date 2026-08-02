// Themed chat panel — anchored bottom-right, Tidio-style.
//
// On `sm+` (≥640px): rounded card sits above the chat button, ~380px wide.
// On `<sm` (mobile): slides up as a bottom sheet, full-width, max 85vh.
//
// Outside-click closes the panel (sm+ only — on mobile the panel covers the
// screen so there is no "outside"). Body scroll is locked while open.
// Esc closes.

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import { spring } from './anim';

// Renders one message bubble; refusals get a different accent strip.
function Message({ role, content, refused }) {
  const isUser = role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed shadow-neu-sm
          ${isUser
            ? 'rounded-br-md bg-accent-gradient text-white'
            : refused
              ? 'rounded-bl-md bg-surface-2 text-body ring-1 ring-accent/30'
              : 'rounded-bl-md bg-surface text-lightn ring-1 ring-white/[0.05]'
          }`}
      >
        {refused && (
          <div className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-accent">
            <Icon name="x" size={11} />
            Off-topic
          </div>
        )}
        {content}
      </div>
    </motion.div>
  );
}

function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="flex justify-start"
    >
      <div className="flex gap-1.5 rounded-2xl rounded-bl-md bg-surface px-4 py-3 shadow-neu-sm ring-1 ring-white/[0.05]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
            className="block h-1.5 w-1.5 rounded-full bg-body"
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function ChatDialog({
  open,
  onClose,
  session,
  messages,
  loading,
  error,
  onSend,
  onReset,
}) {
  const [draft, setDraft] = useState('');
  const scrollerRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll the message list to the bottom on every new entry.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  // Focus the input when the panel opens.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 180);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Body scroll-lock while open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, [open]);

  // Esc closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Suggestion chip clicked → replace textarea contents, focus it, do NOT send.
  const handlePickSuggestion = useCallback((text) => {
    setDraft(text);
    inputRef.current?.focus();
  }, []);

  const cap = session?.cap ?? 5;
  const left = session?.questions_left ?? cap;
  const used = session?.questions_used ?? 0;
  const exhausted = left <= 0;

  const submit = (e) => {
    e?.preventDefault?.();
    const text = draft.trim();
    if (!text || loading || exhausted) return;
    onSend(text);
    setDraft('');
  };

  // Enter to send, Shift+Enter for a newline.
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — hidden on mobile (panel covers the screen); on sm+
              it's transparent so the page stays visible, but it captures
              outside clicks via mouse-down. */}
          <motion.div
            key="backdrop"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
            className="fixed inset-0 z-[80] hidden bg-ink/40 backdrop-blur-[2px] sm:block"
          />

          {/* Panel — anchored bottom-right (Tidio) on sm+, bottom sheet on mobile. */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={spring}
            // Stop mouse-down from bubbling to the backdrop so clicks on the
            // panel don't accidentally close it.
            onMouseDown={(e) => e.stopPropagation()}
            className="fixed z-[81] flex flex-col overflow-hidden bg-surface shadow-neu ring-1 ring-white/[0.08]
              inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl
              sm:inset-auto sm:right-6 sm:bottom-[152px] sm:w-[380px] sm:max-h-[78vh] sm:rounded-2xl"
          >
            {/* ---- Header ---- */}
            <header className="relative flex items-start gap-3 border-b border-white/[0.06] bg-surface-2/60 px-5 py-4 sm:px-6">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-gradient text-white shadow-glow-soft">
                <Icon name="sparkles" size={18} />
              </div>
              <div className="min-w-0 flex-1 pr-8">
                <h2 id="chat-title" className="text-base font-semibold text-white">
                  Ask Pranav
                </h2>
                <p className="mt-0.5 text-[12.5px] text-body">
                  Up to <strong className="text-white">{cap}</strong> questions about his
                  work, skills, experience and projects.
                </p>
              </div>
              {/* Questions-left badge — absolute on mobile to leave room for the X */}
              <div
                className={`absolute right-12 top-4 shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-medium ring-1 sm:static sm:self-center
                  ${
                    exhausted
                      ? 'bg-red-500/10 text-red-400 ring-red-500/20'
                      : left === 1
                        ? 'bg-accent/10 text-accent ring-accent/20'
                        : 'bg-surface text-lightn/80 ring-white/[0.08]'
                  }`}
                aria-live="polite"
              >
                {exhausted ? 'Limit reached' : `${left} of ${cap} left`}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close chat"
                className="absolute right-3 top-3 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink/70 text-lightn/80 shadow-neu-sm transition-colors hover:text-accent"
              >
                <Icon name="x" size={16} />
              </button>
            </header>

            {/* ---- Messages ---- */}
            <div
              ref={scrollerRef}
              className="flex-1 overflow-y-auto overscroll-contain bg-ink-2/40 px-4 py-4 sm:px-6"
            >
              {messages.length === 0 ? (
                <EmptyState onPick={handlePickSuggestion} />
              ) : (
                <div className="flex flex-col gap-3">
                  {messages.map((m, i) => (
                    <Message key={i} {...m} />
                  ))}
                  {loading && <TypingBubble />}
                </div>
              )}
            </div>

            {/* ---- Error toast (in-panel so it doesn't disappear in a stack) ---- */}
            <AnimatePresence>
              {error && (
                <motion.div
                  key="err"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={spring}
                  className="mx-4 mb-1 flex items-start gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-[12.5px] text-red-300 ring-1 ring-red-500/20 sm:mx-6"
                >
                  <Icon name="x" size={13} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ---- Composer ---- */}
            <form
              onSubmit={submit}
              className="border-t border-white/[0.06] bg-ink/60 px-4 py-3 sm:px-6"
            >
              <div
                className={`flex items-end gap-2 rounded-2xl bg-ink-2/70 p-2 pl-4 shadow-neu-inset ring-1 transition
                  ${exhausted ? 'ring-red-500/20' : 'ring-white/[0.04] focus-within:ring-accent/40'}`}
              >
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.slice(0, 1000))}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder={
                    exhausted
                      ? `You used all ${cap} questions. Reset to start over.`
                      : 'Ask about projects, skills, experience…'
                  }
                  disabled={exhausted || loading}
                  aria-label="Type your question"
                  className="max-h-32 w-full flex-1 resize-none bg-transparent py-2 text-[14.5px] text-white outline-none placeholder:text-body/70 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: exhausted || !draft.trim() || loading ? 1 : 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={spring}
                  disabled={exhausted || !draft.trim() || loading}
                  className="grid h-10 w-10 place-items-center rounded-xl bg-accent-gradient text-white shadow-glow-soft transition disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send"
                >
                  <Icon name="arrow-up-right" size={18} />
                </motion.button>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-body/80">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="check" size={11} />
                  Answers stay on-topic — the rest still counts.
                </span>
                {exhausted ? (
                  <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-[11.5px] text-lightn/80 shadow-neu-sm hover:text-accent"
                  >
                    <Icon name="sparkles" size={12} /> Start a new session
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 tabular-nums">
                    <Icon name="clock" size={11} />
                    {Math.max(0, cap - used)} question{cap - used === 1 ? '' : 's'} left after this
                  </span>
                )}
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function EmptyState({ onPick }) {
  const suggestions = [
    'What does Pranav do at Infineon?',
    'Tell me about the Hivemind platform.',
    'Which papers has he published?',
    'What stack did he use for FINRA RAG?',
  ];
  return (
    <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-4 px-1 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-surface shadow-neu text-accent">
        <Icon name="sparkles" size={20} />
      </div>
      <div>
        <h3 className="text-[15px] font-semibold text-white">No questions yet</h3>
        <p className="mx-auto mt-1 max-w-[260px] text-[12.5px] text-body">
          Pick one below or type your own question about the portfolio.
        </p>
      </div>
      <ul className="grid w-full gap-2">
        {suggestions.map((s) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => onPick(s)}
              className="group block w-full rounded-xl bg-surface/70 px-3 py-2 text-left text-[12.5px] text-lightn/90 shadow-neu-sm ring-1 ring-white/[0.04] transition hover:bg-surface hover:text-white hover:ring-accent/30 focus:outline-none focus-visible:ring-accent/60"
            >
              <span className="inline-flex items-center gap-2">
                <Icon
                  name="sparkles"
                  size={11}
                  className="shrink-0 text-accent transition group-hover:rotate-12"
                />
                <span>{s}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}