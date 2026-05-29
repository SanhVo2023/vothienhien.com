import dns from 'node:dns';
import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';
import createNextIntlPlugin from 'next-intl/plugin';

// Force IPv4 first — fixes Supabase IPv6-only DNS resolution on some networks
dns.setDefaultResultOrder('ipv4first');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Security headers applied site-wide. CSP is intentionally omitted — the
// embedded Payload admin and Next inline runtime would need a carefully tuned
// policy; these headers harden the public site without that risk.
const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev',
        pathname: '/vothienhien.com/**',
      },
    ],
  },
  async rewrites() {
    // Serve the internal staff guide at /admin/help while the actual page lives
    // OUTSIDE the Payload route group (so it never depends on Payload init / DB).
    // beforeFiles runs before filesystem routes, so this wins over Payload's
    // /admin/[[...segments]] catch-all.
    return {
      beforeFiles: [{ source: '/admin/help', destination: '/staff-help' }],
    };
  },
  async headers() {
    return [
      { source: '/:path*', headers: SECURITY_HEADERS },
      // Fingerprint-free static assets in /public — safe to cache hard.
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/asset/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:file(favicon.ico|icon.png|apple-touch-icon.png|icon-192.png|icon-512.png|site.webmanifest)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800' }],
      },
    ];
  },
};

export default withPayload(withNextIntl(nextConfig));
