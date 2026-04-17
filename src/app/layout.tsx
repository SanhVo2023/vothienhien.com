import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luật sư Võ Thiện Hiển | Vo Thien Hien - Managing Partner',
  description:
    'Luật sư Võ Thiện Hiển (Vo Thien Hien) - Managing Partner tại Apolo Lawyers. Chuyên gia tranh tụng, tư vấn pháp lý doanh nghiệp và giải quyết tranh chấp tại TP.HCM.',
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
  // No <html>/<body> here — each route group provides its own.
  // (payload) group: PayloadCMS RootLayout renders <html>
  // [locale] group: our layout renders <html> with fonts
  return children;
}
