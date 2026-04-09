import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vothienhien.com';
  const now = new Date();

  const staticPagesVi = [
    { path: '/vi', priority: 1.0 },
    { path: '/vi/gioi-thieu-luat-su', priority: 0.9 },
    { path: '/vi/linh-vuc-hanh-nghe', priority: 0.8 },
    { path: '/vi/vu-viec-tieu-bieu', priority: 0.7 },
    { path: '/vi/bai-viet-chuyen-mon', priority: 0.7 },
    { path: '/vi/quan-diem-nghe-luat', priority: 0.6 },
    { path: '/vi/lien-he', priority: 0.8 },
  ];

  const staticPagesEn = [
    { path: '/en', priority: 1.0 },
    { path: '/en/lawyer-profile', priority: 0.9 },
    { path: '/en/practice-areas', priority: 0.8 },
    { path: '/en/representative-experience', priority: 0.7 },
    { path: '/en/legal-insights', priority: 0.7 },
    { path: '/en/professional-perspective', priority: 0.6 },
    { path: '/en/contact', priority: 0.8 },
  ];

  const practiceAreaSlugsVi = [
    'tranh-chap-dan-su',
    'tranh-chap-dat-dai',
    'hon-nhan-gia-dinh',
    'luat-doanh-nghiep',
    'tranh-chap-lao-dong',
    'luat-hinh-su',
  ];

  const practiceAreaSlugsEn = [
    'civil-disputes',
    'land-disputes',
    'family-law',
    'corporate-law',
    'labor-disputes',
    'criminal-defense',
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const page of staticPagesVi) {
    const enPage = staticPagesEn.find((_, i) => staticPagesVi[i] === page);
    entries.push({
      url: `${siteUrl}${page.path}`,
      lastModified: now,
      changeFrequency: page.priority >= 0.8 ? 'weekly' : 'monthly',
      priority: page.priority,
      alternates: {
        languages: {
          vi: `${siteUrl}${page.path}`,
          en: enPage ? `${siteUrl}${enPage.path}` : undefined,
        },
      },
    });
  }

  for (const page of staticPagesEn) {
    entries.push({
      url: `${siteUrl}${page.path}`,
      lastModified: now,
      changeFrequency: page.priority >= 0.8 ? 'weekly' : 'monthly',
      priority: page.priority,
    });
  }

  // Practice area pages
  for (let i = 0; i < practiceAreaSlugsVi.length; i++) {
    entries.push({
      url: `${siteUrl}/vi/linh-vuc-hanh-nghe/${practiceAreaSlugsVi[i]}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          vi: `${siteUrl}/vi/linh-vuc-hanh-nghe/${practiceAreaSlugsVi[i]}`,
          en: `${siteUrl}/en/practice-areas/${practiceAreaSlugsEn[i]}`,
        },
      },
    });
    entries.push({
      url: `${siteUrl}/en/practice-areas/${practiceAreaSlugsEn[i]}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  return entries;
}
