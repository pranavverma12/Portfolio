import { motion } from 'framer-motion';
import { stagger, rise, inView } from './anim';

export default function SectionTitle({ eyebrow, title, align = 'center' }) {
  return (
    <motion.div
      variants={stagger(0.1)}
      {...inView}
      className={`flex flex-col gap-3 ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}
    >
      {eyebrow && (
        <motion.span variants={rise} className="section-eyebrow">
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        variants={rise}
        className="text-fluid-h2 font-bold leading-tight tracking-tight"
      >
        {title}
      </motion.h2>
      <motion.div
        variants={rise}
        className={`h-1 w-16 rounded-full bg-accent-gradient ${align === 'center' ? 'mx-auto' : ''}`}
      />
    </motion.div>
  );
}
