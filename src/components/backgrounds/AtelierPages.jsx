import { useRef } from 'react';
import { motion, useTransform, useReducedMotion } from 'framer-motion';
import { useSectionProgress } from '../../lib/useSectionProgress';

/*
 * "An AI reading" — open books and loose pages drifting in zero-g, their text
 * reduced to rule-lines, with a faint reading beam sweeping the lines. Used
 * across Research → Education → Certificates so those three read as one
 * chapter, with the intensity dialled down on the later two.
 */

function Page({ rules = 5, className = '', tone = '#ff5a86', spread = 1 }) {
  return (
    <svg viewBox="0 0 100 74" className={className} aria-hidden="true">
      {/* sheet */}
      <path
        d="M6 6 L94 6 L94 68 L6 68 Z"
        fill="none"
        stroke={tone}
        strokeOpacity={0.22}
        strokeWidth={0.5}
      />
      {/* text rules */}
      {Array.from({ length: rules }, (_, i) => {
        const y = 16 + i * (44 / Math.max(1, rules - 1));
        const w = 54 + ((i * 37) % 30) * spread;
        return (
          <line
            key={i}
            x1={16}
            y1={y}
            x2={16 + w * 0.6}
            y2={y}
            stroke={tone}
            strokeOpacity={0.16}
            strokeWidth={0.5}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function OpenBook({ className = '', tone = '#ff5a86' }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true">
      {/* two leaves meeting at the spine */}
      <path d="M60 18 C46 10, 26 10, 10 16 L10 66 C26 60, 46 60, 60 68 Z" fill="none" stroke={tone} strokeOpacity={0.26} strokeWidth={0.6} />
      <path d="M60 18 C74 10, 94 10, 110 16 L110 66 C94 60, 74 60, 60 68 Z" fill="none" stroke={tone} strokeOpacity={0.26} strokeWidth={0.6} />
      <line x1="60" y1="18" x2="60" y2="68" stroke={tone} strokeOpacity={0.3} strokeWidth={0.6} />

      {/* text rules on both leaves */}
      {[26, 33, 40, 47, 54].map((y, i) => (
        <g key={y}>
          <line x1={18} y1={y} x2={50 - i} y2={y} stroke={tone} strokeOpacity={0.14} strokeWidth={0.5} strokeLinecap="round" />
          <line x1={70} y1={y} x2={102 - i} y2={y} stroke={tone} strokeOpacity={0.14} strokeWidth={0.5} strokeLinecap="round" />
        </g>
      ))}

      {/* the "reading" beam — a highlight travelling down the lines */}
      {!reduce && (
        <motion.rect
          x="14"
          width="92"
          height="3"
          rx="1.5"
          fill={tone}
          fillOpacity={0.14}
          initial={{ y: 24 }}
          animate={{ y: [24, 54, 24] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </svg>
  );
}

/**
 * @param intensity 0–1 — scales the whole layer's opacity so the motif can
 *        lead on Research and recede on Education / Certificates.
 */
export default function AtelierPages({ intensity = 1 }) {
  const ref = useRef(null);
  const progress = useSectionProgress(ref);
  const reduce = useReducedMotion();

  const yA = useTransform(progress, [0, 1], [40, -40]);
  const yB = useTransform(progress, [0, 1], [80, -80]);
  const yC = useTransform(progress, [0, 1], [20, -20]);
  const rotA = useTransform(progress, [0, 1], [-8, 4]);
  const rotB = useTransform(progress, [0, 1], [10, -6]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{ opacity: intensity }}
      aria-hidden="true"
    >
      {/* warm scholarly wash, cooler than the products section */}
      <div className="absolute inset-0 [background:radial-gradient(45%_55%_at_18%_15%,rgba(122,40,180,0.10)_0%,transparent_60%),radial-gradient(45%_55%_at_82%_25%,rgba(255,1,79,0.08)_0%,transparent_60%)]" />

      {/* the reader */}
      <motion.div style={{ y: yA, rotate: rotA }} className="absolute left-[6%] top-[14%] w-[190px] lg:w-[240px]">
        <OpenBook className="h-auto w-full" />
      </motion.div>

      {/* loose pages drifting */}
      <motion.div style={{ y: yB, rotate: rotB }} className="absolute right-[8%] top-[20%] hidden w-[130px] sm:block lg:w-[160px]">
        <Page rules={6} className="h-auto w-full" />
      </motion.div>
      <motion.div style={{ y: yC, rotate: rotA }} className="absolute bottom-[16%] right-[22%] hidden w-[100px] md:block">
        <Page rules={4} spread={0.6} className="h-auto w-full" />
      </motion.div>
      <motion.div style={{ y: yB }} className="absolute bottom-[10%] left-[24%] hidden w-[86px] lg:block">
        <Page rules={3} spread={1.4} className="h-auto w-full" />
      </motion.div>

      {/* faint dust motes, like paper fibres in a light shaft */}
      {!reduce &&
        Array.from({ length: 12 }, (_, i) => (
          <motion.span
            key={i}
            className="absolute h-px w-px rounded-full bg-star"
            style={{ left: `${(i * 8.3 + 6) % 96}%`, top: `${(i * 13.7 + 8) % 88}%`, opacity: 0.5 }}
            animate={{ y: [0, -14, 0], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 6 + (i % 5), repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          />
        ))}

      <div className="absolute inset-0 [background:radial-gradient(56%_46%_at_50%_50%,rgba(13,16,19,0.9)_0%,rgba(13,16,19,0.42)_58%,transparent_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink to-transparent" />
    </div>
  );
}
