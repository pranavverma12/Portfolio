import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion';
import Icon from './Icon';
import TrainIcon from './TrainIcon';
import { experience } from '../data/content';
import { spring } from './anim';

export default function Experience() {
  const wrapRef = useRef(null);
  const [active, setActive] = useState(0);
  const n = experience.length;

  // Drive the journey off this section's scroll position.
  // Computed manually (rather than useScroll's target tracking) so it stays
  // accurate through re-mounts and late layout shifts.
  const rawProgress = useMotionValue(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let frame = 0;
    let visible = false;

    const update = () => {
      const rect = el.getBoundingClientRect();
      // Distance the section travels while its sticky child stays pinned.
      const travel = rect.height - window.innerHeight;
      if (travel > 0) {
        const p = Math.min(1, Math.max(0, -rect.top / travel));
        rawProgress.set(p);
        setActive(Math.min(n - 1, Math.max(0, Math.round(p * (n - 1)))));
      }
      // Poll while the section is on screen. This is independent of scroll
      // events, so it also survives smooth-scrolling and nested scrollers.
      if (visible) frame = requestAnimationFrame(update);
      else frame = 0;
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
  }, [n, rawProgress]);

  // Smooth the train motion so it glides between stations.
  const progress = useSpring(rawProgress, { stiffness: 90, damping: 20, mass: 0.4 });
  const trainLeft = useTransform(progress, [0, 1], ['0%', '100%']);
  const railFill = useTransform(progress, [0, 1], ['0%', '100%']);

  const station = experience[active];

  return (
    <section
      id="experience"
      ref={wrapRef}
      className="relative border-t border-white/5"
      style={{ height: `${n * 90}vh` }}
    >
      {/* Sticky viewport — the journey plays out here while the section scrolls. */}
      {/* pt-24 keeps the heading clear of the fixed navbar on short viewports */}
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pb-10 pt-24">
        {/* faint starry backdrop to tie into the universe theme */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-nebula-fade opacity-60" />

        <div className="container-px w-full">
          {/* Heading */}
          <div className="mb-10 text-center">
            <span className="section-eyebrow">7.5+ years · the journey</span>
            <h2 className="mt-3 text-fluid-h2 font-bold">Experience Line</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-body">
              Keep scrolling — the train rolls from station to station through my career.
            </p>
          </div>

          {/* ---- The railway ---- */}
          {/* md:px-24 leaves room for the half-width station boards that
              overhang the first and last stations. */}
          <div className="relative mx-auto mt-16 max-w-5xl px-6 sm:px-10 md:mt-24 md:px-24">
            {/* inner track area (pins + train align to this) */}
            <div className="relative h-px">
              {/* base rail */}
              <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/10" />
              {/* railway ties */}
              <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 [background:repeating-linear-gradient(90deg,rgba(255,255,255,0.12)_0_2px,transparent_2px_16px)]" />
              {/* travelled fill */}
              <motion.div
                style={{ width: railFill }}
                className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-accent-gradient shadow-glow"
              />

              {/* Stations */}
              {experience.map((s, i) => {
                const left = `${(i / (n - 1)) * 100}%`;
                const passed = i <= active;
                const above = i % 2 === 0;
                return (
                  <div
                    key={s.code}
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ left }}
                  >
                    {/* Station board (hidden on small screens to avoid overlap) */}
                    {/* x:'-50%' must live in Framer's animate (not a Tailwind
                        -translate-x-1/2 class) because Framer's transform for
                        `y` would otherwise overwrite the class. */}
                    <motion.div
                      initial={{ x: '-50%' }}
                      animate={{
                        x: '-50%',
                        opacity: passed ? 1 : 0.45,
                        y: active === i ? (above ? -6 : 6) : 0,
                      }}
                      transition={spring}
                      className={`absolute left-1/2 hidden md:block ${
                        above ? 'bottom-8' : 'top-8'
                      }`}
                    >
                      <div
                        className={`w-40 rounded-lg px-3 py-2 text-center shadow-neu-sm transition-colors ${
                          active === i
                            ? 'bg-surface ring-1 ring-accent/60'
                            : 'bg-surface/80'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-accent">
                            {s.code}
                          </span>
                          <span className="truncate text-xs font-semibold text-white">{s.org}</span>
                        </div>
                        <div className="mt-1 text-[10px] text-body">{s.period}</div>
                      </div>
                      {/* little post connecting board to rail */}
                      <div
                        className={`absolute left-1/2 h-8 w-px -translate-x-1/2 bg-white/15 ${
                          above ? 'top-full' : 'bottom-full'
                        }`}
                      />
                    </motion.div>

                    {/* Station pin on the rail */}
                    <motion.div
                      animate={{ scale: active === i ? 1.35 : 1 }}
                      transition={spring}
                      className={`relative grid h-5 w-5 place-items-center rounded-full ${
                        passed ? 'bg-accent shadow-glow' : 'bg-surface ring-1 ring-white/15'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${passed ? 'bg-white' : 'bg-white/30'}`} />
                    </motion.div>

                    {/* code label under pin on mobile */}
                    <span className="absolute left-1/2 top-7 -translate-x-1/2 font-mono text-[9px] font-bold text-accent md:hidden">
                      {s.code}
                    </span>
                  </div>
                );
              })}

              {/* The train */}
              <motion.div
                style={{ left: trainLeft }}
                className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-[85%]"
              >
                <motion.div
                  animate={{ y: [0, -1.5, 0] }}
                  transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <TrainIcon className="h-9 w-auto drop-shadow-[0_6px_14px_rgba(255,1,79,0.5)] sm:h-11" />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* ---- Active station detail card ---- */}
          <div className="mx-auto mt-14 max-w-2xl md:mt-24">
            <AnimatePresence mode="wait">
              <motion.article
                key={station.code}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={spring}
                className="neu-card p-7 sm:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    <Icon name="map-pin" size={13} /> {station.location}
                  </span>
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-body">
                    <Icon name="clock" size={13} /> {station.period}
                    {station.current && (
                      <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-semibold text-green-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Current
                      </span>
                    )}
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-bold text-white">{station.role}</h3>
                <p className="mt-1 text-lg font-semibold text-accent-2">{station.org}</p>
                <p className="mt-4 leading-relaxed text-body">{station.desc}</p>

                {/* progress dots */}
                <div className="mt-6 flex items-center gap-1.5">
                  {experience.map((s, i) => (
                    <span
                      key={s.code}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === active ? 'w-6 bg-accent' : 'w-1.5 bg-white/15'
                      }`}
                    />
                  ))}
                  <span className="ml-auto font-mono text-xs text-body">
                    {active + 1} / {n}
                  </span>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
