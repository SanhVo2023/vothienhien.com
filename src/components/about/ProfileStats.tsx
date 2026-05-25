'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Animated count-up band for the lawyer profile. Figures mirror the numbers
 * already stated in the biography copy (20+ years, 500+ court cases, 100+
 * arbitration matters, 300+ advisory matters) — kept in one place so they stay
 * consistent across the page.
 */

type Stat = { value: number; suffix: string; vi: string; en: string };

const STATS: Stat[] = [
  { value: 20, suffix: '+', vi: 'Năm kinh nghiệm', en: 'Years of Practice' },
  { value: 500, suffix: '+', vi: 'Vụ việc tại Tòa án', en: 'Court Cases' },
  { value: 100, suffix: '+', vi: 'Vụ việc trọng tài', en: 'Arbitration Matters' },
  { value: 300, suffix: '+', vi: 'Hồ sơ tư vấn', en: 'Advisory Matters' },
];

function Counter({ target, suffix, isInView }: { target: number; suffix: string; isInView: boolean }) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;
    const duration = 1800;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target]);

  return (
    <span className="font-[family-name:var(--font-inter)] text-4xl font-light tabular-nums tracking-tight text-white md:text-5xl lg:text-6xl">
      {display}
      <span className="text-accent">{suffix}</span>
    </span>
  );
}

export default function ProfileStats({ locale }: { locale: string }) {
  const isVi = locale === 'vi';
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 divide-y divide-border-gold/15 sm:divide-y-0 md:grid-cols-4 md:divide-x"
    >
      {STATS.map((s, i) => (
        <motion.div
          key={s.en}
          className="flex flex-col items-center gap-3 px-6 py-8 text-center md:py-10"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: i * 0.1 }}
        >
          <Counter target={s.value} suffix={s.suffix} isInView={isInView} />
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/55 md:text-sm">
            {isVi ? s.vi : s.en}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
