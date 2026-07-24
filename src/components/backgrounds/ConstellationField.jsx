import { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import StarCanvas from './StarCanvas';
import { useSectionProgress } from '../../lib/useSectionProgress';

/**
 * Quiet starfield for the Skills section — the same universe as the hero, but
 * dialled right down so the colourful tech chips stay the loudest thing here.
 */
export default function ConstellationField() {
  const ref = useRef(null);
  const progress = useSectionProgress(ref);
  const yFar = useTransform(progress, [0, 1], [24, -24]);
  const yNear = useTransform(progress, [0, 1], [60, -60]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <StarCanvas density={11000} maxStars={110} linkDistance={118} speed={0.1} />

      {/* a couple of slow, oversized "anchor" stars for composition */}
      <motion.div
        style={{ y: yNear }}
        className="absolute left-[12%] top-[22%] h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_24px_6px_rgba(255,1,79,0.45)]"
      />
      <motion.div
        style={{ y: yFar }}
        className="absolute right-[18%] top-[62%] h-1 w-1 rounded-full bg-star shadow-[0_0_18px_5px_rgba(231,236,255,0.35)]"
      />

      {/* edge fades so the field never collides with section boundaries */}
      <div className="absolute inset-0 [background:radial-gradient(60%_50%_at_50%_50%,rgba(13,16,19,0.86)_0%,rgba(13,16,19,0.35)_60%,transparent_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink to-transparent" />
    </div>
  );
}
