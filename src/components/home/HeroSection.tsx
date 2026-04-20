'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className="min-h-screen relative overflow-hidden flex">
      {/* Left dark panel - text side */}
      <div className="relative w-full md:w-[55%] bg-primary flex items-center">
        {/* Marble texture overlay */}
        <div className="absolute inset-0 opacity-[0.06]">
          <Image src={IMAGES.bgMarble.cdn} alt="" fill className="object-cover" aria-hidden="true" />
        </div>

        {/* Gold brushstroke — subtle backdrop behind content, rotated vertical */}
        <div className="pointer-events-none absolute -left-10 top-[18%] w-[420px] opacity-[0.06] rotate-90 origin-top-left hidden md:block">
          <Image
            src={IMAGES.accentGoldStroke.cdn}
            alt=""
            width={800}
            height={450}
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 w-full px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-24 md:py-16 flex flex-col justify-center">
          {/* Mobile-only portrait — small screens only */}
          <div className="flex justify-center mb-10 md:hidden hero-fade" style={{ animationDelay: '0.1s' }}>
            <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-accent/40 shadow-[0_0_40px_rgba(197,165,90,0.15)]">
              <Image
                src={IMAGES.heroPortrait.cdn}
                alt={t('name')}
                width={400}
                height={400}
                className="object-cover object-top w-full h-full"
                priority
              />
            </div>
          </div>

          {/* Subtitle / eyebrow */}
          <span
            className="hero-fade inline-flex items-center gap-3 text-[11px] md:text-xs uppercase tracking-[0.28em] text-accent font-medium font-[family-name:var(--font-inter)]"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="w-8 h-px bg-accent" />
            {t('subtitle')}
          </span>

          {/* Name — single animated block, balanced wrapping, sized to fit */}
          <h1
            className="hero-fade-up font-[family-name:var(--font-heading)] font-semibold text-white mt-7 md:mt-8 leading-[1.02] tracking-tight text-balance text-5xl sm:text-6xl md:text-[3.75rem] lg:text-[4.5rem] xl:text-[5.25rem] 2xl:text-[6rem] max-w-[14ch]"
            style={{
              animationDelay: '0.35s',
              textShadow: '0 2px 40px rgba(197,165,90,0.12)',
            }}
          >
            {t('name')}
          </h1>

          {/* Gold rule under name */}
          <div
            className="hero-scale-x w-24 h-[2px] bg-accent origin-left mt-6"
            style={{ animationDelay: '0.7s' }}
          />

          {/* Tagline */}
          <p
            className="hero-fade text-white/65 text-base md:text-lg lg:text-[1.125rem] max-w-md leading-relaxed mt-6 font-light"
            style={{ animationDelay: '0.85s' }}
          >
            {t('tagline')}
          </p>

          {/* CTA */}
          <div className="hero-fade pt-10" style={{ animationDelay: '1s' }}>
            <Link href="/lien-he">
              <Button variant="primary" size="lg" className="btn-shimmer">
                {t('cta')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="hero-fade absolute bottom-8 left-1/2 -translate-x-1/2 md:left-12 lg:left-16 xl:left-20 md:translate-x-0 flex flex-col items-center gap-2 scroll-indicator"
          style={{ animationDelay: '1.3s' }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent/50 font-[family-name:var(--font-inter)]">
            Scroll
          </span>
          <svg className="w-4 h-4 text-accent/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </div>
      </div>

      {/* Right panel - portrait (tablet + desktop) */}
      <div className="hidden md:block w-[45%] min-h-screen relative">
        <div className="absolute inset-0 img-zoom hero-fade" style={{ animationDelay: '0.3s' }}>
          <Image
            src={IMAGES.heroPortrait.cdn}
            alt={t('name')}
            fill
            className="object-cover object-top"
            sizes="(min-width: 768px) 45vw, 0px"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-primary/70 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-primary/30 to-transparent" />
        </div>

        {/* Gold inset frame */}
        <div className="absolute top-6 left-6 right-6 bottom-6 md:top-8 md:left-8 md:right-8 md:bottom-8 border border-accent/15 pointer-events-none z-10" />
        <div className="absolute top-3 left-3 md:top-4 md:left-4 w-10 h-10 md:w-12 md:h-12 border-t-2 border-l-2 border-accent/40 pointer-events-none z-10" />
        <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-10 h-10 md:w-12 md:h-12 border-b-2 border-r-2 border-accent/40 pointer-events-none z-10" />

        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 text-right z-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-[family-name:var(--font-inter)]">
            Managing Partner
          </span>
          <div className="w-8 h-px bg-accent/40 ml-auto mt-2" />
        </div>
      </div>
    </section>
  );
}
