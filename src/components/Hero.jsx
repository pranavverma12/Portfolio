import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import MagneticButton from './MagneticButton';
import UniverseBackground from './UniverseBackground';
import { TechPill } from './TechIcon';
import { profile, skillBadges } from '../data/content';
import { stagger, rise, spring } from './anim';

function RotatingRole({ roles }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, [roles.length]);

  return (
    <span className="relative inline-grid">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[i]}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={spring}
          className="bg-accent-gradient bg-clip-text text-transparent"
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function SkillTicker() {
  // Duplicate the list so the marquee loops seamlessly (-50% translate).
  const items = [...skillBadges, ...skillBadges];
  return (
    <div className="relative mt-10 w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="flex w-max animate-marquee gap-3">
        {items.map((s, idx) => (
          <TechPill key={idx} name={s} />
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      {/* Animated universe backdrop: starfield + constellations + planets */}
      <UniverseBackground />

      <div className="container-px grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left — copy */}
        <motion.div variants={stagger(0.14, 0.1)} initial="hidden" animate="show">
          <motion.span
            variants={rise}
            className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-lightn/80 shadow-neu-sm"
          >
            <span className="h-2 w-2 animate-accent-pulse rounded-full bg-accent" />
            {profile.eyebrow}
          </motion.span>

          <motion.h1
            variants={rise}
            className="mt-6 text-fluid-hero font-extrabold leading-[1.05] tracking-tight text-white"
          >
            Hi, I&apos;m {profile.name}
            <span className="mt-2 block">
              a <RotatingRole roles={profile.roles} />
            </span>
          </motion.h1>

          <motion.p
            variants={rise}
            className="mt-6 max-w-xl text-fluid-lead leading-relaxed text-body"
          >
            {profile.tagline}
          </motion.p>

          <motion.div variants={rise} className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent-gradient px-7 py-3.5 text-base font-semibold text-white shadow-glow"
            >
              Let&apos;s work together
              <Icon name="arrow-right" size={18} />
            </MagneticButton>

            <MagneticButton
              href={profile.cv}
              target="_blank"
              rel="noreferrer"
              strength={0.25}
              className="inline-flex items-center gap-2 rounded-full bg-surface px-7 py-3.5 text-base font-semibold text-white shadow-neu ring-1 ring-accent/20 transition-shadow hover:shadow-neu-glow"
            >
              <Icon name="download" size={18} /> Download CV
            </MagneticButton>
          </motion.div>

          <motion.div variants={rise} className="mt-8 flex items-center gap-4">
            <span className="text-sm uppercase tracking-widest text-body">Find me at</span>
            <div className="flex gap-3">
              {profile.socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  whileHover={{ scale: 1.12, y: -2 }}
                  transition={spring}
                  className="grid h-10 w-10 place-items-center rounded-full bg-surface text-lightn/80 shadow-neu-sm hover:text-accent"
                >
                  <Icon name={s.icon} size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right — portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.2 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-accent/25 blur-3xl" />
            <div className="overflow-hidden rounded-[2rem] bg-surface p-2 shadow-neu-glow">
              <img
                src={profile.photo}
                alt={profile.name}
                className="h-full w-full rounded-[1.6rem] object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="container-px">
        <SkillTicker />
      </div>
    </section>
  );
}
