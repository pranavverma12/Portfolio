import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import { profile, footerColumns } from '../data/content';
import { stagger, rise, inView, spring } from './anim';

export default function Footer() {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setShow(y > 600));

  const connect = [
    { label: 'Email', href: `mailto:${profile.email}` },
    { label: 'GitHub', href: profile.socials[0].href },
    { label: 'LinkedIn', href: profile.socials[1].href },
    { label: 'Resume', href: profile.cv },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/5 pt-20">
      {/* nebula wash */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-nebula-fade" />

      {/* Giant watermark name */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 select-none text-center text-fluid-watermark font-extrabold leading-[0.78] tracking-tight text-white/[0.035]"
      >
        {profile.handle}
      </span>

      <motion.div variants={stagger(0.1)} {...inView} className="container-px relative">
        <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand block */}
          <motion.div variants={rise} className="lg:pr-8">
            <span className="font-mono text-xl font-semibold text-white">
              &lt;{profile.handle}/&gt;
            </span>
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-body">
              I build intelligent systems — at the intersection of data science, GenAI and elegant
              engineering.
            </p>

            {/* socials */}
            <div className="mt-6 flex gap-3">
              {profile.socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  whileHover={{ y: -3, scale: 1.08 }}
                  transition={spring}
                  className="grid h-11 w-11 place-items-center rounded-full bg-surface text-lightn/80 shadow-neu-sm hover:text-accent"
                >
                  <Icon name={s.icon} size={18} />
                </motion.a>
              ))}
              <motion.a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                whileHover={{ y: -3, scale: 1.08 }}
                transition={spring}
                className="grid h-11 w-11 place-items-center rounded-full bg-surface text-lightn/80 shadow-neu-sm hover:text-accent"
              >
                <Icon name="mail" size={18} />
              </motion.a>
            </div>

            {/* availability pill */}
            <div className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-surface px-4 py-2.5 shadow-neu-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
              </span>
              <span className="whitespace-nowrap text-sm text-lightn/85">
                Available for new projects
              </span>
            </div>
          </motion.div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <motion.div key={col.heading} variants={rise}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-body">
                {col.heading}
              </h4>
              <ul className="mt-6 flex flex-col gap-3.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[15px] text-lightn/70 transition-colors hover:text-accent"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Connect column */}
          <motion.div variants={rise}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-body">Connect</h4>
            <ul className="mt-6 flex flex-col gap-3.5">
              {connect.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 text-[15px] text-lightn/70 transition-colors hover:text-accent"
                  >
                    {l.label}
                    <Icon
                      name="arrow-up-right"
                      size={13}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* bottom bar */}
        <motion.div
          variants={rise}
          className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-7 text-sm text-body sm:flex-row"
        >
          <p>
            © {new Date().getFullYear()} {profile.name}. Crafted with intent.
          </p>
          <p className="inline-flex items-center gap-1.5">
            <Icon name="map-pin" size={14} className="text-accent" />
            {profile.location}
          </p>
        </motion.div>
      </motion.div>

      {/* Back to top */}
      <AnimatePresence>
        {show && (
          <motion.a
            href="#home"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            whileHover={{ y: -4 }}
            transition={spring}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-accent-gradient text-white shadow-glow"
          >
            <Icon name="arrow-right" size={20} className="-rotate-90" />
          </motion.a>
        )}
      </AnimatePresence>
    </footer>
  );
}
