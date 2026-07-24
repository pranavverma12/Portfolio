import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Icon from './Icon';
import { navLinks, profile } from '../data/content';
import { spring } from './anim';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40));

  // Lock body scroll when the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [open]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...spring, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center"
    >
      <motion.nav
        animate={{
          width: scrolled ? '92%' : '100%',
          marginTop: scrolled ? 12 : 0,
          borderRadius: scrolled ? 18 : 0,
          paddingTop: scrolled ? 10 : 18,
          paddingBottom: scrolled ? 10 : 18,
        }}
        transition={spring}
        className={`container-px flex max-w-6xl items-center justify-between ${
          scrolled ? 'glass shadow-card' : 'border-b border-white/5 bg-ink/40 backdrop-blur-md'
        }`}
      >
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2">
          <img
            src="/images/logo/pvlogo.png"
            alt="Pranav Verma"
            className="h-9 w-auto object-contain brightness-0 invert"
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="link-underline text-sm font-medium text-lightn/80 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <motion.a
            href={profile.cv}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={spring}
            className="hidden items-center gap-2 rounded-full bg-accent-gradient px-5 py-2 text-sm font-semibold text-white shadow-glow sm:inline-flex"
          >
            <Icon name="download" size={16} />
            Resume
          </motion.a>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-full bg-surface text-white shadow-neu-sm md:hidden"
          >
            <Icon name={open ? 'x' : 'menu'} size={20} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-0 z-40 flex flex-col bg-ink/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <img src="/images/logo/pvlogo.png" alt="logo" className="h-9 brightness-0 invert" />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full bg-surface text-white shadow-neu-sm"
              >
                <Icon name="x" size={20} />
              </button>
            </div>
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.07 } } }}
              className="flex flex-1 flex-col items-center justify-center gap-6"
            >
              {navLinks.map((l) => (
                <motion.li
                  key={l.href}
                  variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-2xl font-semibold text-white"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <motion.a
                variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                href={profile.cv}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-gradient px-6 py-3 font-semibold text-white shadow-glow"
              >
                <Icon name="download" size={18} /> Download Resume
              </motion.a>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
