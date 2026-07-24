import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import SectionTitle from './SectionTitle';
import { hobbies } from '../data/content';
import { rise, inView, spring } from './anim';

const variants = {
  enter: (dir) => ({ x: dir > 0 ? 320 : -320, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir > 0 ? -320 : 320, opacity: 0, scale: 0.95 }),
};

export default function Hobbies() {
  const [[index, dir], setState] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const n = hobbies.length;

  const go = useCallback(
    (step) => setState(([i]) => [(i + step + n) % n, step]),
    [n]
  );
  const goTo = (i) => setState(([cur]) => [i, i > cur ? 1 : -1]);

  // Autoplay, paused on hover.
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), 5000);
    return () => clearInterval(id);
  }, [paused, go]);

  const h = hobbies[index];

  return (
    <section id="hobbies" className="border-t border-white/5 py-24 sm:py-28">
      <div className="container-px">
        <SectionTitle eyebrow="What I do in my free time" title="Hobbies" />

        <motion.div
          variants={rise}
          {...inView}
          className="relative mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Slide viewport */}
          <div className="relative overflow-hidden rounded-3xl bg-surface shadow-neu">
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={h.title}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={spring}
                className="grid gap-0 md:grid-cols-2"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden md:h-[420px]">
                  <img
                    src={h.image}
                    alt={h.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent md:bg-gradient-to-r" />
                  <span className="absolute left-5 top-5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-bold text-white shadow-glow">
                    {h.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <span className="font-mono text-sm text-accent">
                    0{index + 1} <span className="text-body">/ 0{n}</span>
                  </span>
                  <h3 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{h.title}</h3>
                  <div className="mt-4 h-1 w-14 rounded-full bg-accent-gradient" />
                  <p className="mt-5 text-fluid-lead leading-relaxed text-body">{h.desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-7 flex items-center justify-between gap-4">
            {/* dots */}
            <div className="flex items-center gap-2">
              {hobbies.map((item, i) => (
                <button
                  key={item.title}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${item.title}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? 'w-8 bg-accent' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            {/* arrows */}
            <div className="flex gap-3">
              <motion.button
                onClick={() => go(-1)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={spring}
                aria-label="Previous hobby"
                className="grid h-11 w-11 place-items-center rounded-full bg-surface text-lightn shadow-neu-sm hover:text-accent"
              >
                <Icon name="arrow-right" size={18} className="rotate-180" />
              </motion.button>
              <motion.button
                onClick={() => go(1)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={spring}
                aria-label="Next hobby"
                className="grid h-11 w-11 place-items-center rounded-full bg-accent-gradient text-white shadow-glow"
              >
                <Icon name="arrow-right" size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
