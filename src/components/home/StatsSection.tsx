'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';

interface StatItemProps {
  value: string;
  label: string;
  suffix?: string;
  isInView: boolean;
}

function StatItem({ value, label, suffix = '+', isInView }: StatItemProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const targetValue = parseInt(value, 10) || 0;
  const hasAnimated = useRef(false);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!isInView || hasAnimated.current || targetValue === 0) return;
    hasAnimated.current = true;

    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * targetValue));

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isInView, targetValue]);

  // Fallback: if still 0 after 4s, force the final value (handles edge cases)
  useEffect(() => {
    if (targetValue === 0) return;
    const timeout = setTimeout(() => {
      if (displayValue === 0) {
        setDisplayValue(targetValue);
        hasAnimated.current = true;
      }
    }, 4000);
    return () => clearTimeout(timeout);
  }, [targetValue, displayValue]);

  return (
    <div className="flex flex-col items-center gap-3 px-6 md:px-10">
      <span className="font-[family-name:var(--font-inter)] text-5xl md:text-6xl lg:text-7xl font-light text-white tabular-nums tracking-tight">
        {displayValue}
        <span className="text-accent">{suffix}</span>
      </span>
      <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-white/60 font-medium text-center">
        {label}
      </span>
    </div>
  );
}

export default function StatsSection() {
  const t = useTranslations('stats');
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) {
      setIsInView(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '50px',
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection]);

  const stats = [
    { value: t('yearsExperience'), label: t('yearsExperienceLabel'), suffix: '+' },
    { value: t('casesHandled'), label: t('casesHandledLabel'), suffix: '+' },
    { value: t('jurisdictions'), label: t('jurisdictionsLabel'), suffix: '' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative bg-primary py-20 md:py-28 overflow-hidden"
    >
      {/* Marble texture background */}
      <Image
        src={IMAGES.bgMarble.cdn}
        alt=""
        fill
        className="object-cover opacity-[0.12] pointer-events-none"
        sizes="100vw"
        aria-hidden="true"
      />

      {/* Decorative horizontal gold line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-accent/10" />

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center">
              <StatItem
                value={stat.value}
                label={stat.label}
                suffix={stat.suffix}
                isInView={isInView}
              />
              {index < stats.length - 1 && (
                <div className="hidden md:block w-px h-20 bg-accent/50 ml-10 md:ml-12 lg:ml-16" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
