import { motion } from 'framer-motion';
import Icon from './Icon';
import SectionTitle from './SectionTitle';
import AtelierPages from './backgrounds/AtelierPages';
import { certifications } from '../data/content';
import { stagger, rise, inView, spring } from './anim';

// Certificates use a distinct "ticket/badge" style: a compact row with a
// numbered seal on the left and a hairline accent rail — deliberately lighter
// than the Projects and Experience cards.
export default function Certifications() {
  return (
    <section id="certifications" className="relative overflow-hidden border-t border-white/5 py-24 sm:py-28">
      <AtelierPages intensity={0.5} />
      <div className="container-px relative">
        <SectionTitle eyebrow="Certifications achieved" title="My Certifications" />

        <motion.div
          variants={stagger(0.06)}
          {...inView}
          className="mt-14 grid gap-3.5 sm:grid-cols-2"
        >
          {certifications.map((c, i) => (
            <motion.div
              key={c.title + c.date}
              variants={rise}
              whileHover={{ x: 6 }}
              transition={spring}
              className="group relative flex items-center gap-5 overflow-hidden rounded-2xl bg-surface/70 py-4 pl-5 pr-6 shadow-neu-sm transition-shadow hover:shadow-neu"
            >
              {/* accent rail */}
              <span className="absolute inset-y-0 left-0 w-0.5 bg-accent/40 transition-all duration-300 group-hover:w-1 group-hover:bg-accent" />

              {/* numbered seal */}
              <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink/70 shadow-neu-inset">
                <Icon name="award" size={18} className="text-accent" />
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {i + 1}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[15px] font-semibold text-white">{c.title}</h3>
                <p className="mt-0.5 truncate text-sm text-body">{c.issuer}</p>
              </div>

              <span className="shrink-0 font-mono text-xs font-medium text-accent-2">{c.date}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
