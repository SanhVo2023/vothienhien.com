import type { Metadata } from 'next';
import { beVietnamPro, inter, playfairDisplay, cormorantGaramond } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Luật sư Võ Thiện Hiển | Henry Vo - Managing Partner',
  description:
    'Luật sư Võ Thiện Hiển (Henry Vo) - Managing Partner tại Apolo Lawyers. Chuyên gia tranh tụng, tư vấn pháp lý doanh nghiệp và giải quyết tranh chấp tại TP.HCM.',
  icons: {
    icon: '/images/icon/favicon-vh.webp',
    apple: '/images/icon/favicon-vh.webp',
  },
  openGraph: {
    images: [{
      url: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/og/og-default-a229973b.webp',
      width: 1200,
      height: 630,
    }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${beVietnamPro.variable} ${inter.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
