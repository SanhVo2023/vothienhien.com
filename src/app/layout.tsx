import type { Metadata, Viewport } from 'next';

// Absolute base for every canonical / OG / hreflang URL the app emits. Without
// this, Next leaves relative `alternates.canonical: '/vi/...'` unresolved and
// warns at build. In production NEXT_PUBLIC_SITE_URL is the live domain; locally
// it is localhost (fine for dev).
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vothienhien.com';
const OG_IMAGE =
  'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/og/og-default-a229973b.webp';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Luật sư Võ Thiện Hiển | Vo Thien Hien — Managing Partner, Apolo Lawyers',
    template: '%s | Võ Thiện Hiển — Apolo Lawyers',
  },
  description:
    'Luật sư Võ Thiện Hiển (Vo Thien Hien) - Managing Partner tại Apolo Lawyers. Chuyên gia tranh tụng, tư vấn pháp lý doanh nghiệp và giải quyết tranh chấp tại TP. Hồ Chí Minh.',
  applicationName: 'Võ Thiện Hiển — Apolo Lawyers',
  authors: [{ name: 'Vo Thien Hien' }],
  creator: 'Apolo Lawyers',
  publisher: 'Apolo Lawyers',
  keywords: [
    'Võ Thiện Hiển', 'Vo Thien Hien', 'Henry Vo', 'luật sư Apolo Lawyers',
    'luật sư tranh tụng', 'trọng tài thương mại', 'giải quyết tranh chấp',
    'attorney Vietnam', 'litigation lawyer Vietnam', 'arbitration', 'Apolo Lawyers',
  ],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Võ Thiện Hiển — Apolo Lawyers',
    locale: 'vi_VN',
    alternateLocale: ['en_US'],
    url: '/',
    title: 'Luật sư Võ Thiện Hiển | Vo Thien Hien — Managing Partner, Apolo Lawyers',
    description:
      'Hơn 20 năm kinh nghiệm trong tố tụng, trọng tài và giải quyết tranh chấp tại Việt Nam.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Võ Thiện Hiển — Apolo Lawyers' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luật sư Võ Thiện Hiển — Managing Partner, Apolo Lawyers',
    description:
      'Hơn 20 năm kinh nghiệm trong tố tụng, trọng tài và giải quyết tranh chấp tại Việt Nam.',
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No <html>/<body> here — each route group provides its own.
  // (payload) group: PayloadCMS RootLayout renders <html>
  // [locale] group: our layout renders <html> with fonts
  return children;
}
