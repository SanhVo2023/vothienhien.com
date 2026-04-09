'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface GoldDividerProps {
  className?: string;
  width?: string;
}

export default function GoldDivider({ className = '', width = 'w-24' }: GoldDividerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className={`${width} ${className}`}>
      <motion.div
        className="h-px bg-accent"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0 }}
      />
    </div>
  );
}
