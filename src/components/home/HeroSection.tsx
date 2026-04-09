'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  const t = useTranslations('hero');
  const nameWords = t('name').split(' ');

  return (
    <section className="min-h-screen relative overflow-hidden flex">
      {/* Left dark panel - text side */}
      <div className="relative w-full lg:w-[55%] bg-primary flex items-center">
        {/* Marble texture overlay */}
        <div className="absolute inset-0 opacity-[0.06]">
          <Image src={IMAGES.bgMarble.cdn} alt="" fill className="object-cover" aria-hidden="true" />
        </div>

        {/* Gold brushstroke decorative */}
        <div className="absolute bottom-16 right-0 w-72 opacity-[0.05] pointer-events-none hidden lg:block">
          <Image src={IMAGES.accentGoldStroke.cdn} alt="" width={800} height={450} aria-hidden="true" />
        </div>

        <div className="relative z-10 w-full px-8 md:px-14 lg:px-20 xl:px-28 py-32 lg:py-20">
          {/* Mobile portrait */}
          <div className="flex justify-center mb-10 lg:hidden hero-fade" style={{ animationDelay: '0.1s' }}>
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-accent/40 shadow-[0_0_40px_rgba(197,165,90,0.15)]">
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

          <span
            className="hero-fade inline-flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-accent font-medium font-[family-name:var(--font-inter)]"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="w-8 h-px bg-accent" />
            {t('subtitle')}
          </span>

          <h1
            className="font-[family-name:var(--font-heading)] font-bold text-white leading-[1.05] mt-8"
            style={{ textShadow: '0 2px 40px rgba(197,165,90,0.12)' }}
          >
            {nameWords.map((word, i) => (
              <span
                key={i}
                className="hero-fade-up inline-block mr-4"
                style={{ animationDelay: `${0.4 + i * 0.15}s` }}
              >
                <span className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl">
                  {word}
                </span>
              </span>
            ))}
          </h1>

          {/* Gold rule under name */}
          <div
            className="hero-scale-x w-28 h-[2px] bg-accent origin-left mt-6"
            style={{ animationDelay: '0.8s' }}
          />

          <p
            className="hero-fade font-[family-name:var(--font-accent)] italic text-3xl md:text-4xl lg:text-5xl text-white/40 mt-5"
            style={{ animationDelay: '0.7s' }}
          >
            {t('nameEn')}
          </p>

          {/* Gold dot divider */}
          <div className="flex items-center gap-3 mt-6">
            <span className="w-1 h-1 rounded-full bg-accent" />
          </div>

          <p
            className="hero-fade text-white/60 text-lg md:text-xl max-w-lg leading-loose mt-4"
            style={{ animationDelay: '0.9s' }}
          >
            {t('tagline')}
          </p>

          <div className="hero-fade pt-8" style={{ animationDelay: '1.1s' }}>
            <Link href="/lien-he">
              <Button variant="primary" size="lg" className="btn-shimmer">
                {t('cta')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="hero-fade absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-20 lg:translate-x-0 flex flex-col items-center gap-2 scroll-indicator"
          style={{ animationDelay: '1.4s' }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent/50 font-[family-name:var(--font-inter)]">
            Scroll
          </span>
          <svg className="w-4 h-4 text-accent/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </div>
      </div>

      {/* Right panel - full-bleed portrait (desktop only) */}
      <div className="hidden lg:block w-[45%] min-h-screen relative">
        <div className="absolute inset-0 img-zoom hero-fade" style={{ animationDelay: '0.3s' }}>
          <Image
            src={IMAGES.heroPortrait.cdn}
            alt={t('name')}
            fill
            className="object-cover object-top"
            sizes="(min-width: 1024px) 45vw, 0px"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-primary/70 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-primary/30 to-transparent" />
        </div>

        <div className="absolute top-8 left-8 right-8 bottom-8 border border-accent/15 pointer-events-none z-10" />
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-accent/40 pointer-events-none z-10" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-accent/40 pointer-events-none z-10" />

        <div className="absolute bottom-12 right-12 text-right z-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-[family-name:var(--font-inter)]">
            Managing Partner
          </span>
          <div className="w-8 h-px bg-accent/30 ml-auto mt-2" />
        </div>
      </div>
    </section>
  );
}
