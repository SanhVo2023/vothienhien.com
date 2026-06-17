import '../globals.css';
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { Analytics } from '@vercel/analytics/next';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { beVietnamPro, inter, playfairDisplay, cormorantGaramond } from '@/lib/fonts';
import Header from '@/components/layout/Header';
import Footer, { type FooterData } from '@/components/layout/Footer';
import BrowserCompat from '@/components/BrowserCompat';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Editable footer content from the CMS `footer` global. Same hardened pattern as
// the article fetches: try the site URL then localhost, hard timeout so a dead
// URL can't stall the static export, fall back to null (component uses defaults).
async function fetchFooter(locale: string): Promise<FooterData> {
  const candidates = [process.env.NEXT_PUBLIC_SITE_URL, 'http://localhost:3000', 'http://localhost:3001'].filter(Boolean) as string[];
  for (const base of candidates) {
    try {
      const res = await fetch(`${base}/api/globals/footer?locale=${locale}&depth=0`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(6000),
      });
      if (!res.ok) continue;
      return (await res.json()) as FooterData;
    } catch {
      // try next base
    }
  }
  return null;
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// Locale-aware title template so English pages never carry Vietnamese diacritics
// in the brand suffix ("Vo Thien Hien", not "Võ Thiện Hiển"). Overrides the
// root layout's template for every page under /[locale].
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const brand = isEn ? 'Vo Thien Hien — Apolo Lawyers' : 'Võ Thiện Hiển — Apolo Lawyers';
  return {
    title: {
      template: `%s | ${brand}`,
      default: isEn
        ? 'Vo Thien Hien — Managing Partner, Apolo Lawyers'
        : 'Luật sư Võ Thiện Hiển — Luật sư Điều hành, Apolo Lawyers',
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'vi' | 'en')) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const footerData = await fetchFooter(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <BrowserCompat locale={locale} />
      </head>
      <body
        className={`${beVietnamPro.variable} ${inter.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          <main className="min-h-screen">{children}</main>
          <Footer locale={locale} data={footerData} />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
