import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import PracticeAreasPreview from '@/components/home/PracticeAreasPreview';
import PublicationsPreview from '@/components/home/PublicationsPreview';
import TestimonialSection from '@/components/home/TestimonialSection';
import CTASection from '@/components/home/CTASection';
import JsonLd from '@/components/JsonLd';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('defaultTitle'),
    description: t('defaultDescription'),
    alternates: {
      canonical: 'https://vothienhien.com',
      languages: {
        vi: 'https://vothienhien.com/vi',
        en: 'https://vothienhien.com/en',
      },
    },
    openGraph: {
      title: t('defaultTitle'),
      description: t('defaultDescription'),
      url: 'https://vothienhien.com',
      siteName: 'Vo Thien Hien - Attorney at Law',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      type: 'website',
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Vo Thien Hien - Managing Partner',
      alternateName: 'Luật sư Võ Thiện Hiển',
      url: 'https://vothienhien.com',
      inLanguage: ['vi', 'en'],
      publisher: {
        '@type': 'Person',
        name: 'Vo Thien Hien',
        alternateName: 'Võ Thiện Hiển',
        jobTitle: 'Managing Partner',
        worksFor: {
          '@type': 'LegalService',
          name: 'Apolo Lawyers',
          url: 'https://apololawyers.com',
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: locale === 'vi' ? 'Trang chủ' : 'Home',
          item: 'https://vothienhien.com',
        },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <HeroSection />
      <StatsSection />
      <PracticeAreasPreview />
      <PublicationsPreview />
      <TestimonialSection />
      <CTASection />
    </>
  );
}
