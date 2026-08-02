// Floating chat button — sits directly above the existing back-to-top
// rounded button in the footer.
//
// Theming: same neumorphic surface + accent gradient as the rest of the site.
// Sparkles icon implies "AI conversation". A soft ping dot nudges visitors
// toward it without being noisy.
//
// On hover (after a short delay) a neumorphic "Discuss About Pranav"
// tooltip fades in to the LEFT of the button. The tooltip hides while the
// dialog is open so it doesn't fight the panel.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import { spring } from './anim';

const TOOLTIP_DELAY_MS = 350;

export default function ChatButton({ onClick, hasUnread = false, questionsLeft, open = false }) {
  // Hover-after-delay tooltip visibility.
  const [hovered, setHovered] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    if (!hovered || open) {
      setShowTip(false);
      return;
    }
    const t = setTimeout(() => setShowTip(true), TOOLTIP_DELAY_MS);
    return () => clearTimeout(t);
  }, [hovered, open]);

  return (
    <div
      className="fixed bottom-[88px] right-6 z-40"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {/* Tooltip — neumorphic pill, sits to the left of the button (Tidio-style) */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            key="tip"
            role="tooltip"
            initial={{ opacity: 0, x: 6, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 4, scale: 0.98 }}
            transition={spring}
            className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-surface px-4 py-2 text-[12.5px] font-medium text-white shadow-neu-sm ring-1 ring-white/[0.08]"
          >
            Discuss About Pranav
            {/* caret pointing right toward the button */}
            <span
              aria-hidden
              className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-surface ring-1 ring-white/[0.08]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={onClick}
        aria-label="Open chat with Pranav's assistant"
        initial={{ opacity: 0, scale: 0.6, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.6, y: 12 }}
        whileHover={{ y: -4 }}
        transition={spring}
        className="group grid h-12 w-12 origin-bottom-right place-items-center rounded-full bg-accent-gradient text-white shadow-glow"
      >
        <Icon name="sparkles" size={20} />

        {/* Counter pill (visible while session has questions) */}
        <AnimatePresence>
          {typeof questionsLeft === 'number' && questionsLeft > 0 && (
            <motion.span
              key="counter"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={spring}
              className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1.5 text-[10px] font-semibold tabular-nums text-white ring-2 ring-surface"
            >
              {questionsLeft}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread ping */}
        <AnimatePresence>
          {hasUnread && (
            <motion.span
              key="ping"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: [0.5, 1.2, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute -top-1.5 -left-1.5 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-surface"
              aria-hidden
            />
          )}
        </AnimatePresence>

        <span className="sr-only">Open chat with Pranav's assistant</span>
      </motion.button>
    </div>
  );
}