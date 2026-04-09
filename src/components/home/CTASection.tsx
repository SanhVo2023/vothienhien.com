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

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        {/* Decorative ornament instead of 1px line */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <div className="w-16 h-px bg-accent/40" />
          <Image
            src="/images/icon/favicon-vh.webp"
            alt=""
            width={28}
            height={28}
            className="opacity-50"
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
                href="https://wa.me/84903419479"
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
