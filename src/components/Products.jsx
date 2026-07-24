import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';
import Modal from './Modal';
import ProjectCover from './ProjectCover';
import TechIcon, { TechPill } from './TechIcon';
import { techEntry } from '../lib/techIcons';
import MachineCosmos from './backgrounds/MachineCosmos';
import { ouraniex, enterprise, STATUS_LABEL } from '../data/projects';
import { stagger, rise, inView, spring } from './anim';

const STATUS_TONE = {
  live: { dot: '#34d399', text: 'text-emerald-300' },
  beta: { dot: '#fbbf24', text: 'text-amber-300' },
  poc: { dot: '#ff5a86', text: 'text-accent' },
};

function StatusChip({ status }) {
  const tone = STATUS_TONE[status] || STATUS_TONE.poc;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${tone.text}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone.dot }} />
      {STATUS_LABEL[status] || status}
    </span>
  );
}

/* ---------------- Ouraniex card ---------------- */
function ProductCard({ p, onOpen, featured }) {
  return (
    <motion.button
      variants={rise}
      onClick={onOpen}
      whileHover={{ y: -8 }}
      transition={spring}
      className={`group relative flex flex-col overflow-hidden rounded-3xl bg-surface text-left shadow-neu transition-shadow hover:shadow-neu-glow ${
        featured ? 'sm:col-span-2' : ''
      }`}
    >
      {/* generated cover */}
      <div className={`relative overflow-hidden ${featured ? 'h-48 sm:h-56' : 'h-40'}`}>
        <ProjectCover kind={p.cover} seed={p.id} />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/25 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-lightn/85 backdrop-blur">
          {p.category}
        </span>
        <span className="absolute bottom-4 left-4">
          <StatusChip status={p.status} />
        </span>
        <span className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-ink/70 text-lightn/70 transition-colors group-hover:text-accent">
          <Icon name="arrow-up-right" size={15} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          Ouraniex · {p.period}
        </p>
        <h3 className="mt-2 text-xl font-bold text-white">
          {p.name} <span className="font-normal text-lightn/70">— {p.title}</span>
        </h3>
        <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-body">{p.summary}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {(p.stack.length ? p.stack : p.tags).slice(0, 4).map((t) => {
            const { color } = techEntry(t);
            return (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium text-lightn/80"
                style={{ background: `${color}18`, boxShadow: `inset 0 0 0 1px ${color}33` }}
              >
                <TechIcon name={t} size={12} />
                {t}
              </span>
            );
          })}
        </div>
      </div>
    </motion.button>
  );
}

/* ---------------- Enterprise card ---------------- */
function WorkCard({ p, onOpen, index }) {
  return (
    <motion.button
      variants={rise}
      onClick={onOpen}
      whileHover={{ y: -6 }}
      transition={spring}
      className="group relative overflow-hidden rounded-2xl bg-surface/70 p-6 text-left shadow-neu-sm transition-shadow hover:shadow-neu"
    >
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-accent/10 blur-3xl transition-opacity duration-500 group-hover:bg-accent/20" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono text-xs text-body">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink/60 text-lightn/60 transition-colors group-hover:text-accent">
            <Icon name="arrow-up-right" size={14} />
          </span>
        </div>

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          {p.org} · {p.period}
        </p>
        <h3 className="mt-1.5 text-lg font-bold text-white">{p.name}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-body">{p.summary}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.stack.slice(0, 4).map((t) => {
            const { color } = techEntry(t);
            return (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium text-lightn/80"
                style={{ background: `${color}18`, boxShadow: `inset 0 0 0 1px ${color}33` }}
              >
                <TechIcon name={t} size={12} />
                {t}
              </span>
            );
          })}
        </div>
      </div>
    </motion.button>
  );
}

/* ---------------- Modal body ---------------- */
function ProductDetail({ p }) {
  if (!p) return null;
  const isOuraniex = !p.org;
  return (
    <>
      <div className="relative h-44 overflow-hidden rounded-t-3xl sm:h-52">
        <ProjectCover kind={p.cover} seed={p.id} />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        <div className="absolute bottom-4 left-6 flex items-center gap-2">
          <StatusChip status={p.status} />
          <span className="rounded-full bg-ink/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-lightn/85">
            {p.category}
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          {isOuraniex ? 'Ouraniex' : p.org} · {p.period}
        </p>
        <h3 id="product-modal-title" className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          {p.name}
        </h3>
        <p className="mt-1 text-lg text-lightn/70">{p.title}</p>

        <p className="mt-5 leading-relaxed text-body">{p.summary}</p>
        <p className="mt-4 leading-relaxed text-body">{p.detail}</p>

        {/* etymology (Ouraniex) or headline metric (work) */}
        {p.etymology && (
          <div className="mt-6 rounded-2xl bg-ink/50 p-5 shadow-neu-inset">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Etymology
            </p>
            <p className="mt-2 text-[15px] italic leading-relaxed text-lightn/80">{p.etymology}</p>
          </div>
        )}
        {p.metric && (
          <div className="mt-6 rounded-2xl bg-ink/50 p-5 shadow-neu-inset">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Impact</p>
            <p className="mt-2 text-[15px] font-medium leading-relaxed text-white">{p.metric}</p>
          </div>
        )}

        {p.stack?.length > 0 && (
          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-body">
              Stack
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.stack.map((t) => (
                <TechPill key={t} name={t} size={14} className="!px-3 !py-1.5 !text-xs" />
              ))}
            </div>
          </div>
        )}

        {p.learned?.length > 0 && (
          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-body">
              What it taught me
            </p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {p.learned.map((l) => (
                <li key={l} className="flex gap-3 text-[15px] leading-relaxed text-body">
                  <Icon name="check" size={16} className="mt-1 shrink-0 text-accent" />
                  {l}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

/* ---------------- Section ---------------- */
export default function Products() {
  const [active, setActive] = useState(null);

  return (
    <section id="projects" className="relative overflow-hidden border-t border-white/5 py-24 sm:py-28">
      <MachineCosmos />

      <div className="container-px relative">
        {/* --- Ouraniex --- */}
        <motion.div variants={stagger(0.1)} {...inView} className="flex flex-col items-center text-center">
          <motion.span variants={rise} className="section-eyebrow">
            Self-initiated · Ouraniex
          </motion.span>
          <motion.h2 variants={rise} className="mt-3 text-fluid-h2 font-bold leading-tight tracking-tight">
            Things I&apos;ve built
          </motion.h2>
          <motion.p variants={rise} className="mt-3 max-w-xl text-body">
            A product portfolio with a naming constitution — Greek and Latin roots, one rule per name.
          </motion.p>
          <motion.div variants={rise} className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent-gradient" />
        </motion.div>

        <motion.div
          variants={stagger(0.09)}
          {...inView}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ouraniex.map((p) => (
            <ProductCard key={p.id} p={p} featured={p.featured} onOpen={() => setActive(p)} />
          ))}
        </motion.div>

        {/* --- Enterprise --- */}
        <motion.div
          variants={stagger(0.1)}
          {...inView}
          className="mt-28 flex flex-col items-center text-center"
        >
          <motion.span variants={rise} className="section-eyebrow">
            Professional
          </motion.span>
          <motion.h2 variants={rise} className="mt-3 text-fluid-h2 font-bold leading-tight tracking-tight">
            Shipped at companies
          </motion.h2>
          <motion.div variants={rise} className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent-gradient" />
        </motion.div>

        <motion.div
          variants={stagger(0.07)}
          {...inView}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {enterprise.map((p, i) => (
            <WorkCard key={p.id} p={p} index={i} onOpen={() => setActive(p)} />
          ))}
        </motion.div>
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} labelledBy="product-modal-title">
        <ProductDetail p={active} />
      </Modal>
    </section>
  );
}
