import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import SectionTitle from './SectionTitle';
import TechIcon from './TechIcon';
import ConstellationField from './backgrounds/ConstellationField';
import { techEntry } from '../lib/techIcons';
import { skillCategories } from '../data/content';
import { inView, rise, stagger, spring } from './anim';

export default function Skills() {
  const [active, setActive] = useState(0);
  const cat = skillCategories[active];

  return (
    <section id="skills" className="relative overflow-hidden border-t border-white/5 py-24 sm:py-28">
      <ConstellationField />
      <div className="container-px relative">
        <SectionTitle eyebrow="Tools of the trade" title="Skills & Stack" />

        <div className="mt-14 grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Category selector */}
          <motion.div variants={stagger(0.07)} {...inView} className="flex flex-col gap-2.5">
            {skillCategories.map((c, i) => {
              const on = i === active;
              return (
                <motion.button
                  key={c.title}
                  variants={rise}
                  onClick={() => setActive(i)}
                  whileHover={{ x: 5 }}
                  transition={spring}
                  className={`relative flex items-center gap-3 rounded-2xl px-5 py-4 text-left transition-colors ${
                    on ? 'bg-surface shadow-neu' : 'bg-surface/50 shadow-neu-sm hover:bg-surface'
                  }`}
                >
                  {/* active accent bar */}
                  {on && (
                    <motion.span
                      layoutId="skill-bar"
                      transition={spring}
                      className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-accent-gradient"
                    />
                  )}
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${
                      on ? 'bg-accent/15 text-accent' : 'bg-white/[0.04] text-body'
                    }`}
                  >
                    <Icon name={c.icon} size={19} />
                  </span>
                  <span className="flex-1">
                    <span
                      className={`block text-sm font-semibold ${on ? 'text-white' : 'text-lightn/70'}`}
                    >
                      {c.title}
                    </span>
                    <span className="text-xs text-body">{c.items.length} skills</span>
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Chips panel */}
          <motion.div variants={rise} {...inView} className="neu-card relative overflow-hidden p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-accent/10 blur-3xl" />
            <AnimatePresence mode="wait">
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={spring}
                className="relative"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent">
                    <Icon name={cat.icon} size={21} />
                  </span>
                  <h3 className="text-xl font-bold text-white">{cat.title}</h3>
                </div>

                <motion.div
                  variants={stagger(0.045)}
                  initial="hidden"
                  animate="show"
                  className="mt-7 flex flex-wrap gap-2.5"
                >
                  {cat.items.map((s) => {
                    const { color } = techEntry(s);
                    return (
                      <motion.span
                        key={s}
                        variants={rise}
                        whileHover={{ scale: 1.06, y: -3 }}
                        transition={spring}
                        className="inline-flex cursor-default items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-lightn/85"
                        style={{
                          background: `linear-gradient(180deg, ${color}1f, ${color}0b)`,
                          boxShadow: `inset 0 0 0 1px ${color}40`,
                        }}
                      >
                        <TechIcon name={s} size={17} />
                        {s}
                      </motion.span>
                    );
                  })}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
