'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

// Background that scrolls slower than the page (parallax). Honors
// prefers-reduced-motion (renders without the transform).
interface Props {
  children: ReactNode;
  /** px of travel across the scroll range; default 60. */
  distance?: number;
  className?: string;
}

export default function ParallaxSection({ children, distance = 60, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-distance}px`, `${distance}px`]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
