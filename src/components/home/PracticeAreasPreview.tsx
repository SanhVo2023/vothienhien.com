'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';
import SectionHeading from '@/components/ui/SectionHeading';

const practiceAreas = [
  { key: 'civil', image: IMAGES.practiceCivil, slug: 'tranh-chap-dan-su' },
  { key: 'land', image: IMAGES.practiceLand, slug: 'tranh-chap-dat-dai' },
  { key: 'family', image: IMAGES.practiceFamily, slug: 'hon-nhan-gia-dinh' },
  { key: 'corporate', image: IMAGES.practiceCorporate, slug: 'luat-doanh-nghiep' },
  { key: 'labor', image: IMAGES.practiceLabor, slug: 'tranh-chap-lao-dong' },
  { key: 'criminal', image: IMAGES.practiceCriminal, slug: 'luat-hinh-su' },
] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function PracticeAreasPreview() {
  const t = useTranslations('practiceAreas');
  const ts = useTranslations('sections');

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <SectionHeading
          subtitle={ts('practiceAreasSubtitle')}
          title={ts('practiceAreas')}
          description={ts('practiceAreasDescription')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-16">
          {practiceAreas.map((area, index) => (
            <Link
              key={area.key}
              href={{ pathname: '/linh-vuc-hanh-nghe/[slug]', params: { slug: area.slug } }}
              className="group block"
            >
              <motion.div
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="relative bg-background border border-border-gold/30 hover:border-accent/60 hover:bg-secondary hover:text-white transition-all duration-500 overflow-hidden h-full"
              >
                {/* Gold top border slides in on hover */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10" />

                {/* Practice area image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={area.image.cdn}
                    alt={area.image.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/10 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-semibold text-primary mb-3 group-hover:text-white transition-colors duration-500">
                    {t(area.key)}
                  </h3>
                  <p className="text-text-secondary text-sm md:text-base leading-relaxed group-hover:text-white/70 transition-colors duration-500">
                    {t(`${area.key}Desc`)}
                  </p>
                </div>

                {/* Gold arrow appears on hover */}
                <div className="absolute bottom-6 right-6">
                  <svg
                    className="w-5 h-5 text-accent opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>

                {/* Gold bottom border on hover */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-14">
          <Link
            href="/linh-vuc-hanh-nghe"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-secondary text-sm uppercase tracking-[0.15em] font-medium transition-colors duration-300 group"
          >
            {t('viewAll')}
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
