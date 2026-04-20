import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';
import Button from '@/components/ui/Button';

export default async function CTASection() {
  const t = await getTranslations('cta');

  return (
    <section className="relative py-28 md:py-36 overflow-hidden border-t border-accent/30">
      {/* Skyline background */}
      <Image
        src={IMAGES.bgSkyline.cdn}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        aria-hidden="true"
      />
      {/* Reduced dark overlay — let the photo breathe */}
      <div className="absolute inset-0 bg-primary/60" />
      {/* Stronger radial gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(197,165,90,0.25) 0%, transparent 70%)',
        }}
      />

      {/* Logo 1 (Bold Scales) — large low-opacity decorative emblem */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] md:w-[680px] opacity-[0.05] pointer-events-none">
        <Image
          src={IMAGES.logoSymbolic1Scales.cdn}
          alt=""
          width={680}
          height={680}
          aria-hidden="true"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        {/* Decorative ornament — Logo 4 laurel mark */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <div className="w-16 h-px bg-accent/40" />
          <Image
            src={IMAGES.logoSymbolic4LaurelScales.cdn}
            alt=""
            width={32}
            height={32}
            className="opacity-60"
            aria-hidden="true"
          />
          <div className="w-16 h-px bg-accent/40" />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6">
            {t('heading')}
          </h2>

          <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-12">
            {t('description')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Button variant="primary" size="lg" href="/lien-he" className="btn-shimmer">
              {t('contact')}
            </Button>
            <div className="whatsapp-pulse relative z-10">
              <Button
                variant="outline"
                size="lg"
                href="https://wa.me/84913479179"
                className="border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
              >
                {t('whatsapp')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
