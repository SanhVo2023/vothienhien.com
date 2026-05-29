'use client';

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, type MouseEvent, type ReactNode } from 'react';

// 3D mouse-track tilt for cards (±max°) with an optional gold glare that follows
// the cursor. Honors prefers-reduced-motion (renders a plain container).
interface Props {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}

export default function TiltCard({ children, className = '', max = 7, glare = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });
  const rotateX = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  // Glare position tracks the cursor via a live motion template (not a static .get()).
  const glareBg = useTransform(
    [mx, my],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(197,165,90,0.18) 0%, transparent 55%)`,
  );

  if (reduce) return <div className={className}>{children}</div>;

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const handleLeave = () => { mx.set(0.5); my.set(0.5); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 1000 }}
      className={`group/tilt relative ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
}
