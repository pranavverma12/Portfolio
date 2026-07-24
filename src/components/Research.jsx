import { motion } from 'framer-motion';
import Icon from './Icon';
import SectionTitle from './SectionTitle';
import AtelierPages from './backgrounds/AtelierPages';
import { research } from '../data/content';
import { stagger, rise, inView, spring } from './anim';

function PaperCard({ item }) {
  return (
    <motion.a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      variants={rise}
      whileHover={{ y: -8 }}
      transition={spring}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface shadow-neu transition-shadow hover:shadow-neu-glow"
    >
      {/* Image with zoom-on-hover */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/25 to-transparent" />
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-lightn backdrop-blur">
          <Icon name="clock" size={13} /> {item.readTime}
        </span>
        <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white shadow-glow">
          {item.venue}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-accent-soft bg-accent/[0.05] px-3 py-1 text-xs font-medium text-accent"
            >
              {t}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-semibold leading-snug text-white transition-colors group-hover:text-accent">
          {item.title}
        </h3>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-lightn/70 transition-colors group-hover:text-accent">
          Read paper
          <Icon
            name="arrow-up-right"
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </span>
      </div>
    </motion.a>
  );
}

export default function Research() {
  return (
    <section id="research" className="relative overflow-hidden border-t border-white/5 py-24 sm:py-28">
      <AtelierPages intensity={1} />
      <div className="container-px relative">
        <SectionTitle eyebrow="Peer-reviewed publications" title="Research Papers" />
        <motion.div
          variants={stagger(0.14)}
          {...inView}
          className="mt-14 grid gap-6 sm:grid-cols-2"
        >
          {research.map((item) => (
            <PaperCard key={item.title} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
