import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { spring } from './anim';

// A button/link that leans toward the cursor (magnetic) and springs on hover.
export default function MagneticButton({
  as = 'a',
  children,
  className = '',
  strength = 0.35,
  ...rest
}) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    setPos({ x, y });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  const MotionTag = motion[as] || motion.a;

  return (
    <MotionTag
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={spring}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
