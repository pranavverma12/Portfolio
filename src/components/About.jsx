import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';
import { about } from '../data/content';
import { stagger, rise, inView, spring } from './anim';

export default function About() {
  return (
    <section id="about" className="border-t border-white/5 py-24 sm:py-28">
      <div className="container-px">
        <SectionTitle eyebrow={about.eyebrow} title={about.title} align="left" />

        <motion.p
          variants={rise}
          {...inView}
          className="mt-8 max-w-4xl text-fluid-lead leading-relaxed text-body"
        >
          {about.body}
        </motion.p>

        <motion.div
          variants={stagger(0.1)}
          {...inView}
          className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
        >
          {about.stats.map((s) => (
            <motion.div
              key={s.label}
              variants={rise}
              whileHover={{ y: -6 }}
              transition={spring}
              className="rounded-2xl bg-surface p-6 text-center shadow-neu transition-shadow hover:shadow-neu-glow"
            >
              <div className="bg-accent-gradient bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-body">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
