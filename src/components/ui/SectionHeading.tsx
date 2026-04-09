'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import GoldDivider from './GoldDivider';

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  light?: boolean;
}

export default function SectionHeading({
  subtitle,
  title,
  description,
  align = 'center',
  className = '',
  light = false,
}: SectionHeadingProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div ref={ref} className={`flex flex-col gap-4 ${alignClass} ${className}`}>
      {subtitle && (
        <motion.span
          className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-accent font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="w-8 h-[2px] bg-accent/60" />
          {subtitle}
          <span className="w-8 h-[2px] bg-accent/60" />
        </motion.span>
      )}
      <motion.h2
        className={`text-3xl md:text-4xl lg:text-5xl font-heading font-semibold leading-tight ${light ? 'text-white' : 'text-primary'}`}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        {title}
      </motion.h2>
      <GoldDivider width={align === 'center' ? 'w-20 mx-auto' : 'w-20'} className="mt-2" />
      {description && (
        <motion.p
          className={`text-lg max-w-2xl mt-2 ${light ? 'text-white/70' : 'text-text-secondary'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
