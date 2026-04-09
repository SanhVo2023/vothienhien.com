import type { Metadata } from 'next';

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
      siteName: 'Võ Thiện Hiển - Attorney at Law',
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
  return {
    '@context': 'https://schema.org',
    '@type': ['Person', 'Attorney'],
    name: locale === 'vi' ? 'Võ Thiện Hiển' : 'Henry Vo',
    jobTitle: locale === 'vi' ? 'Luật sư Điều hành' : 'Managing Partner',
    worksFor: {
      '@type': 'LegalService',
      name: 'Apolo Lawyers',
      url: 'https://apololawyers.com',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '108 Trần Đình Xu, Phường Nguyễn Cư Trinh',
      addressLocality: 'Quận 1, TP. Hồ Chí Minh',
      addressCountry: 'VN',
    },
    telephone: '+84903419479',
    email: 'contact@apolo.com.vn',
    url: siteUrl,
    sameAs: ['https://apololawyers.com'],
  };
}
