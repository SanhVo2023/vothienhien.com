import '../globals.css';
import type { Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { beVietnamPro, inter, playfairDisplay, cormorantGaramond } from '@/lib/fonts';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BrowserCompat from '@/components/BrowserCompat';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

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
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
