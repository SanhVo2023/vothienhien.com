import type { Metadata } from 'next';
import { beVietnamPro, playfairDisplay } from '@/lib/fonts';

// Internal staff guide. Lives at /staff-help and is served at /admin/help via a
// beforeFiles rewrite in next.config.ts (kept OUT of the Payload route group so
// it never depends on Payload init / DB connectivity). Self-contained styling —
// it does not import globals.css, so the page carries its own <style>.
// Be Vietnam Pro + Playfair Display (both with the `vietnamese` subset) are
// wired in here so Vietnamese diacritics render correctly — the previous
// Georgia headings lacked Vietnamese glyphs and broke mid-word.
export const metadata: Metadata = {
  title: 'Hướng dẫn sử dụng CMS — Nội bộ',
  description: 'Hướng dẫn đăng bài viết cho nhân sự nội bộ Apolo Lawyers.',
  robots: { index: false, follow: false, nocache: true },
};

export default function StaffHelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${playfairDisplay.variable}`}>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
