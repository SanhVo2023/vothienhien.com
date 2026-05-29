'use client';

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, type MouseEvent, type ReactNode } from 'react';

// A wrapper that drifts toward the cursor on hover (magnetic effect). Use
// sparingly — one primary CTA. Honors prefers-reduced-motion (static span).
interface Props {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticButton({ children, className = '', strength = 0.4 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });
  const scale = useTransform([springX, springY], (vals) => {
    const [vx, vy] = vals as [number, number];
    return 1 + Math.min(Math.sqrt(vx * vx + vy * vy) / 1000, 0.05);
  });

  if (reduce) return <span className={`inline-block ${className}`}>{children}</span>;

  const handleMove = (e: MouseEvent<HTMLSpanElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY, scale }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}
