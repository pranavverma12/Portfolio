import { useEffect } from 'react';
import { useMotionValue } from 'framer-motion';

/**
 * Progress of an element through the viewport, 0 → 1.
 * 0 when its top first enters the bottom of the viewport, 1 once its bottom
 * has passed the top. Driven by an IntersectionObserver-gated rAF loop, which
 * stays correct through re-mounts, smooth scrolling and nested scrollers.
 */
export function useSectionProgress(ref) {
  const progress = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    let visible = false;

    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = r.height + vh;
      progress.set(Math.min(1, Math.max(0, (vh - r.top) / total)));
      frame = visible ? requestAnimationFrame(update) : 0;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !frame) frame = requestAnimationFrame(update);
      },
      { threshold: 0 }
    );

    io.observe(el);
    update();
    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, progress]);

  return progress;
}
