'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';
import SectionHeading from '@/components/ui/SectionHeading';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const articleImages = [
  IMAGES.articleLandDispute,
  IMAGES.articleCorporateLaw,
  IMAGES.articleLaborRights,
];

export default function PublicationsPreview() {
  const t = useTranslations('publications');
  const ts = useTranslations('sections');
  const tc = useTranslations('common');

  const articles = [
    { category: t('category1'), title: t('title1'), excerpt: t('excerpt1'), date: t('date1'), slug: 'phan-tich-luat-dat-dai-2024' },
    { category: t('category2'), title: t('title2'), excerpt: t('excerpt2'), date: t('date2'), slug: 'huong-dan-thanh-lap-doanh-nghiep' },
    { category: t('category3'), title: t('title3'), excerpt: t('excerpt3'), date: t('date3'), slug: 'quyen-loi-nguoi-lao-dong-nghi-viec' },
  ];

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <SectionHeading
          subtitle={ts('latestPublicationsSubtitle')}
          title={ts('latestPublications')}
          description={ts('latestPublicationsDescription')}
        />

        <div className="mt-16 space-y-8">
          {/* Featured first article - horizontal layout on large screens */}
          <Link
            href={{ pathname: '/bai-viet-chuyen-mon/[slug]', params: { slug: articles[0].slug } }}
            className="group block"
          >
            <motion.article
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={cardVariants}
              className="bg-background border border-border-gold/20 hover:shadow-lg transition-shadow duration-500 grid grid-cols-1 lg:grid-cols-2"
            >
              {/* Article image */}
              <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden img-zoom">
                <Image
                  src={articleImages[0].cdn}
                  alt={articleImages[0].alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
              </div>

              <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                <span className="inline-block text-xs uppercase tracking-[0.15em] text-accent font-medium mb-3 border border-accent/40 px-3 py-1 rounded-full w-fit">
                  {articles[0].category}
                </span>
                <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl lg:text-3xl font-semibold text-primary mb-4 leading-snug group-hover:text-accent-secondary transition-colors duration-300 title-underline">
                  {articles[0].title}
                </h3>
                <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
                  {articles[0].excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border-gold/20">
                  <time className="text-text-secondary/40 text-xs uppercase tracking-wider italic">
                    {articles[0].date}
                  </time>
                  <span className="text-accent text-xs uppercase tracking-[0.1em] font-medium group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center gap-1">
                    {tc('readMore')}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.article>
          </Link>

          {/* Remaining articles side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.slice(1).map((article, index) => (
              <Link
                key={index + 1}
                href={{ pathname: '/bai-viet-chuyen-mon/[slug]', params: { slug: article.slug } }}
                className="group block"
              >
                <motion.article
                  custom={index + 1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={cardVariants}
                  className="bg-background border border-border-gold/20 hover:shadow-lg transition-shadow duration-500 h-full"
                >
                  {/* Article image */}
                  <div className="relative aspect-[16/10] overflow-hidden img-zoom">
                    <Image
                      src={articleImages[index + 1].cdn}
                      alt={articleImages[index + 1].alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                  </div>

                  <div className="p-6 md:p-8">
                    <span className="inline-block text-xs uppercase tracking-[0.15em] text-accent font-medium mb-3 border border-accent/40 px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                    <h3 className="font-[family-name:var(--font-heading)] text-lg md:text-xl font-semibold text-primary mb-3 leading-snug group-hover:text-accent-secondary transition-colors duration-300 title-underline">
                      {article.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border-gold/20">
                      <time className="text-text-secondary/40 text-xs uppercase tracking-wider italic">
                        {article.date}
                      </time>
                      <span className="text-accent text-xs uppercase tracking-[0.1em] font-medium group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center gap-1">
                        {tc('readMore')}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-14">
          <Link
            href="/bai-viet-chuyen-mon"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-secondary text-sm uppercase tracking-[0.15em] font-medium transition-colors duration-300 group"
          >
            {t('viewAll')}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
