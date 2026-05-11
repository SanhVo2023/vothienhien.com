import type { Metadata } from 'next';
import {
  CALL_CENTER_E164,
  EMAIL,
  POSTAL_ADDRESS,
  SHORT_NAME_EN,
  SHORT_NAME_VN,
  parentBrandUrl,
} from '@/lib/address';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vothienhien.com';

interface GeneratePageMetadataParams {
  title: string;
  description: string;
  locale: string;
  path: string;
  alternateLocalePath?: string;
  ogImage?: string;
}

export function generatePageMetadata({
  title,
  description,
  locale,
  path,
  alternateLocalePath,
  ogImage,
}: GeneratePageMetadataParams): Metadata {
  const url = `${siteUrl}/${locale}${path}`;
  const alternateLocale = locale === 'vi' ? 'en' : 'vi';

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: alternateLocalePath
        ? {
            [locale]: url,
            [alternateLocale]: `${siteUrl}/${alternateLocale}${alternateLocalePath}`,
          }
        : undefined,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: locale === 'vi' ? 'Võ Thiện Hiển - Luật sư Điều hành' : 'Vo Thien Hien - Managing Partner',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      type: 'website',
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

export function generatePersonJsonLd(locale: string) {
  const isVi = locale === 'vi';
  const postal = isVi ? POSTAL_ADDRESS.vi : POSTAL_ADDRESS.en;
  const firmName = isVi ? SHORT_NAME_VN : SHORT_NAME_EN;
  const brandUrl = parentBrandUrl(locale);

  return {
    '@context': 'https://schema.org',
    '@type': ['Person', 'Attorney'],
    name: isVi ? 'Võ Thiện Hiển' : 'Vo Thien Hien',
    jobTitle: isVi ? 'Luật sư Điều hành' : 'Managing Partner',
    worksFor: {
      '@type': 'LegalService',
      name: firmName,
      url: brandUrl,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: postal.streetAddress,
      addressLocality: postal.addressLocality,
      addressCountry: postal.addressCountry,
    },
    telephone: CALL_CENTER_E164,
    email: EMAIL,
    url: siteUrl,
    sameAs: [brandUrl],
  };
}
