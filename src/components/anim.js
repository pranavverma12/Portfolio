// Shared Framer Motion variants and the spring the whole site uses.
export const spring = { type: 'spring', stiffness: 100, damping: 16 };
export const springSoft = { type: 'spring', stiffness: 120, damping: 20 };

// Container that staggers its children on reveal.
export const stagger = (staggerChildren = 0.12, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

// Standard "rise + fade" item — matches the hero spec (y: 20 -> 0, opacity 0 -> 1).
export const rise = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: spring },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
};

// Timeline items slide in from a side.
export const slideFrom = (dir = 'left') => ({
  hidden: { x: dir === 'left' ? -60 : 60, opacity: 0 },
  show: { x: 0, opacity: 1, transition: spring },
});

// Common whileInView props so cards reveal once when scrolled into view.
export const inView = {
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, amount: 0.25 },
};
