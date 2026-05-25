import type { MetadataRoute } from 'next';

// Regenerate at runtime (ISR). At build time no server is listening on
// NEXT_PUBLIC_SITE_URL, so the publication fetch returns nothing and the
// sitemap ships with only the static routes; the first request after deploy
// (live server reachable) rebuilds it with the article URLs included.
export const revalidate = 3600;

// Paired VN ↔ EN slugs for practice areas. Order matters — pairing is by
// index. When a new practice area is added it must be appended to BOTH
// arrays at the same position; if there's no EN equivalent yet, push the
// VN slug into both arrays.
const PRACTICE_AREA_SLUGS = [
  { vi: 'tranh-chap-dan-su', en: 'civil-disputes' },
  { vi: 'tranh-chap-thuong-mai', en: 'commercial-disputes' },
  { vi: 'tranh-chap-dat-dai', en: 'land-disputes' },
  { vi: 'hon-nhan-gia-dinh', en: 'family-law' },
  { vi: 'luat-doanh-nghiep', en: 'corporate-law' },
  { vi: 'tranh-chap-lao-dong', en: 'labor-disputes' },
  { vi: 'luat-hinh-su', en: 'criminal-defense' },
  { vi: 'tranh-tung-tai-toa-an', en: 'court-litigation' },
  { vi: 'trong-tai-thuong-mai', en: 'commercial-arbitration' },
] as const;

// Top-level static routes, paired VN ↔ EN (matches src/i18n/routing.ts).
const STATIC_ROUTES = [
  { vi: '/vi', en: '/en', priority: 1.0 },
  { vi: '/vi/gioi-thieu-luat-su', en: '/en/lawyer-profile', priority: 0.9 },
  { vi: '/vi/linh-vuc-hanh-nghe', en: '/en/practice-areas', priority: 0.8 },
  { vi: '/vi/vu-viec-tieu-bieu', en: '/en/representative-experience', priority: 0.7 },
  { vi: '/vi/bai-viet-chuyen-mon', en: '/en/legal-insights', priority: 0.7 },
  { vi: '/vi/quan-diem-nghe-luat', en: '/en/professional-perspective', priority: 0.6 },
  { vi: '/vi/lien-he', en: '/en/contact', priority: 0.8 },
] as const;

async function fetchPublicationSlugs(siteUrl: string): Promise<string[]> {
  // REST fetch against the embedded Payload — works in build, dev and prod
  // without the local-API schema-pull race that hits getPayload() in dev.
  // Try the configured site URL first; in local dev fall back to localhost.
  // Each attempt is hard-capped by a timeout — at build time the target port
  // has no listener, and without this the request can stall the export past
  // Next's 60s page-build limit instead of failing fast.
  const candidates = [siteUrl, 'http://localhost:3000', 'http://localhost:3001'];
  for (const base of candidates) {
    try {
      const res = await fetch(`${base}/api/publications?limit=500&depth=0`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(6000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const slugs = (data?.docs ?? []).map((d: { slug?: string }) => d.slug).filter(Boolean) as string[];
      if (slugs.length > 0) return slugs;
    } catch {
      // try next candidate
    }
  }
  console.warn('[sitemap] no publication slugs resolved — sitemap will omit article pages');
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vothienhien.com';
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static routes — emit one entry per locale with alternates pointing both ways.
  for (const route of STATIC_ROUTES) {
    const changeFrequency: 'weekly' | 'monthly' = route.priority >= 0.8 ? 'weekly' : 'monthly';
    const alternates = {
      languages: {
        vi: `${siteUrl}${route.vi}`,
        en: `${siteUrl}${route.en}`,
      },
    };
    entries.push({ url: `${siteUrl}${route.vi}`, lastModified: now, changeFrequency, priority: route.priority, alternates });
    entries.push({ url: `${siteUrl}${route.en}`, lastModified: now, changeFrequency, priority: route.priority, alternates });
  }

  // Practice area detail pages.
  for (const pair of PRACTICE_AREA_SLUGS) {
    const alternates = {
      languages: {
        vi: `${siteUrl}/vi/linh-vuc-hanh-nghe/${pair.vi}`,
        en: `${siteUrl}/en/practice-areas/${pair.en}`,
      },
    };
    entries.push({ url: `${siteUrl}/vi/linh-vuc-hanh-nghe/${pair.vi}`, lastModified: now, changeFrequency: 'monthly', priority: 0.8, alternates });
    entries.push({ url: `${siteUrl}/en/practice-areas/${pair.en}`, lastModified: now, changeFrequency: 'monthly', priority: 0.8, alternates });
  }

  // Publication articles — single slug shared between VN/EN routes.
  const pubSlugs = await fetchPublicationSlugs(siteUrl);
  for (const slug of pubSlugs) {
    const alternates = {
      languages: {
        vi: `${siteUrl}/vi/bai-viet-chuyen-mon/${slug}`,
        en: `${siteUrl}/en/legal-insights/${slug}`,
      },
    };
    entries.push({ url: `${siteUrl}/vi/bai-viet-chuyen-mon/${slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.6, alternates });
    entries.push({ url: `${siteUrl}/en/legal-insights/${slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.6, alternates });
  }

  return entries;
}
