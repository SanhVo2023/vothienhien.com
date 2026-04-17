'use client';

import { useRef, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';

type Testimonial = {
  quote: string;
  author: string;
  initials: string;
  role: string;
};

export default function TestimonialSection() {
  const t = useTranslations('testimonials');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // next-intl v3 returns arrays via t.raw()
  const items = t.raw('items') as Testimonial[];
  const [index, setIndex] = useState(0);

  // Auto-rotate every 7s once visible
  useEffect(() => {
    if (!isInView || items.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 7000);
    return () => clearInterval(id);
  }, [isInView, items.length]);

  const active = items[index];

  return (
    <section
      ref={sectionRef}
      className="relative bg-secondary py-20 md:py-28 lg:py-36 overflow-hidden"
    >
      {/* Gold brushstroke decorative accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] opacity-[0.04] pointer-events-none rotate-[-8deg]">
        <Image
          src={IMAGES.accentGoldStroke.cdn}
          alt=""
          width={800}
          height={450}
          aria-hidden="true"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Decorative quote marks */}
          <motion.div
            className="text-accent/20 font-[family-name:var(--font-heading)] text-[10rem] md:text-[14rem] leading-none select-none absolute top-4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: 'easeOut' }}
            aria-hidden="true"
          >
            &ldquo;
          </motion.div>

          {/* Section label */}
          <motion.p
            className="text-xs uppercase tracking-[0.3em] text-accent/70 font-medium mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {t('sectionLabel')}
          </motion.p>

          {/* Gold stars */}
          <motion.div
            className="flex items-center justify-center gap-1 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-accent" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </motion.div>

          {/* Rotating quote */}
          <div className="relative min-h-[240px] md:min-h-[260px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-[family-name:var(--font-accent)] italic text-2xl md:text-3xl lg:text-4xl text-white/90 leading-relaxed md:leading-relaxed">
                  &ldquo;{active.quote}&rdquo;
                </p>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <motion.div
            className="mt-10 flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="w-12 h-px bg-accent mb-6" />
            <AnimatePresence mode="wait">
              <motion.div
                key={`cite-${index}`}
                className="inline-flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-accent text-xs font-semibold tracking-wide">
                    {active.initials}
                  </span>
                </div>
                <cite className="not-italic text-left">
                  <span className="block text-white font-medium text-base tracking-wide">
                    {active.author}
                  </span>
                  <span className="block text-white/50 text-sm">{active.role}</span>
                </cite>
              </motion.div>
            </AnimatePresence>

            {/* Navigation dots */}
            <div className="flex items-center justify-center gap-2 mt-6" role="tablist">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Testimonial ${i + 1}`}
                  aria-selected={i === index}
                  onClick={() => setIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === index
                      ? 'w-2.5 h-2.5 bg-accent'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
