import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Icon from './Icon';
import SectionTitle from './SectionTitle';
import { expertise } from '../data/content';
import { stagger, rise, inView, spring } from './anim';

function TiltCard({ item }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 150, damping: 15 });
  const glowX = useTransform(mx, [0, 1], ['0%', '100%']);
  const glowY = useTransform(my, [0, 1], ['0%', '100%']);
  const glow = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(240px circle at ${x} ${y}, rgba(255,1,79,0.18), transparent 70%)`
  );

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.article
      ref={ref}
      variants={rise}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={{ y: -6 }}
      transition={spring}
      className="group relative overflow-hidden rounded-2xl bg-surface p-7 shadow-neu transition-shadow duration-300 hover:shadow-neu-glow [transform-style:preserve-3d]"
    >
      {/* Cursor-following glow */}
      <motion.div
        aria-hidden
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative" style={{ transform: 'translateZ(40px)' }}>
        <div className="grid h-14 w-14 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/25 transition-shadow group-hover:shadow-glow">
          <Icon name={item.icon} size={24} />
        </div>
        <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-body">{item.desc}</p>
      </div>
    </motion.article>
  );
}

export default function Expertise() {
  return (
    <section id="expertise" className="border-t border-white/5 py-24 sm:py-28">
      <div className="container-px">
        <SectionTitle eyebrow="Features" title="What I Do" />
        <motion.div
          variants={stagger(0.1)}
          {...inView}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {expertise.map((item) => (
            <TiltCard key={item.title} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
