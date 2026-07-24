import { motion } from 'framer-motion';
import Icon from './Icon';
import SectionTitle from './SectionTitle';
import AtelierPages from './backgrounds/AtelierPages';
import { education } from '../data/content';
import { stagger, rise, inView, spring } from './anim';

export default function Education() {
  return (
    <section id="education" className="relative overflow-hidden border-t border-white/5 py-24 sm:py-28">
      <AtelierPages intensity={0.7} />
      <div className="container-px relative">
        <SectionTitle eyebrow="Where it started" title="Education" />

        <motion.div variants={stagger(0.14)} {...inView} className="mt-14 grid gap-6 md:grid-cols-2">
          {education.map((e) => (
            <motion.article
              key={e.degree}
              variants={rise}
              whileHover={{ y: -6 }}
              transition={spring}
              className="group relative overflow-hidden rounded-3xl bg-surface shadow-neu transition-shadow hover:shadow-neu-glow"
            >
              {/* left accent spine */}
              <span className="absolute inset-y-0 left-0 w-1.5 bg-accent-gradient" />
              {/* notches, like a boarding pass */}
              <span className="absolute -left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-ink" />
              <span className="absolute -right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-ink" />

              <div className="p-8 pl-10">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
                    <Icon name={e.icon} size={22} />
                  </span>
                  <span className="rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-bold text-accent">
                    {e.grade}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold leading-snug text-white">{e.degree}</h3>
                <p className="mt-2 font-medium text-lightn/80">{e.school}</p>

                {/* dashed divider */}
                <div className="my-5 border-t border-dashed border-white/10" />

                <div className="flex items-center justify-between text-sm text-body">
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="map-pin" size={14} className="text-accent" /> {e.location}
                  </span>
                  <span className="font-mono">{e.period}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
