'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';

const navItems = [
  { key: 'home' as const, href: '/' as const },
  { key: 'profile' as const, href: '/gioi-thieu-luat-su' as const },
  { key: 'practiceAreas' as const, href: '/linh-vuc-hanh-nghe' as const },
  { key: 'publications' as const, href: '/bai-viet-chuyen-mon' as const },
  { key: 'contact' as const, href: '/lien-he' as const },
] as const;

const ecosystemLinks = [
  { label: 'Apolo Lawyers', href: 'https://apololawyers.com' },
  { label: 'Lawyers in Vietnam', href: 'https://lawyersinvietnam.com' },
  { label: 'Apolo Legal', href: 'https://apololegal.com' },
];

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const tFooter = useTranslations('footer');

  return (
    <footer className="bg-primary text-white">
      {/* Gold horizontal rule */}
      <div className="h-px bg-accent/20" />
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
          {/* Column 1: Logo & Description */}
          <div className="lg:pr-8">
            <div className="flex items-center gap-3">
              <Image
                src={IMAGES.logoSymbolic4LaurelScales.cdn}
                alt="Vo Thien Hien — Managing Partner mark"
                width={44}
                height={44}
                className="rounded-full gold-glow ring-1 ring-accent/25"
              />
              <span className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[0.15em] text-accent">
                VÕ THIỆN HIỂN
              </span>
            </div>
            <div className="mt-3 h-px w-12 bg-accent/40" />
            <p className="mt-5 font-[family-name:var(--font-accent)] text-base leading-relaxed text-white/60 italic">
              {tFooter('managingPartner')}
            </p>
            <p className="mt-1 text-sm text-white/50">
              {tFooter('firmName')}
            </p>

            {/* Firm logo */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">
                {locale === 'vi' ? 'Thành viên của' : 'A member of'}
              </p>
              {/* Apolo Lawyers firm logo. Owner (F-005) will provide a revised asset;
                  drop the new PNG at /public/asset/logo-transparent.png to swap. */}
              <Image
                src="/asset/logo-transparent.png"
                alt="Apolo Lawyers - Solicitors & Litigators"
                width={140}
                height={56}
                className="opacity-60 hover:opacity-90 transition-opacity duration-300"
              />
              {/* Institution logos */}
              <div className="mt-4 flex items-center gap-5">
                <div className="flex flex-col items-center gap-1">
                  <Image
                    src="/asset/logo-lsvn.png"
                    alt={locale === 'vi' ? 'Liên đoàn Luật sư Việt Nam' : 'VN Bar Federation'}
                    width={48}
                    height={36}
                    className="opacity-60 hover:opacity-90 transition-opacity duration-300 object-contain"
                    style={{ height: '36px', width: 'auto' }}
                  />
                  <span className="text-[9px] text-white/30 text-center">
                    {locale === 'vi' ? 'Liên đoàn LSVN' : 'VN Bar Federation'}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Image
                    src="/asset/logo-ccbe.png"
                    alt={locale === 'vi' ? 'Hiệp hội Luật sư Châu Âu' : 'European Bar Association'}
                    width={48}
                    height={36}
                    className="opacity-60 hover:opacity-90 transition-opacity duration-300 object-contain"
                    style={{ height: '36px', width: 'auto' }}
                  />
                  <span className="text-[9px] text-white/30 text-center">
                    {locale === 'vi' ? 'Hiệp hội LS Châu Âu' : 'European Bar Association'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:border-l lg:border-white/10 lg:pl-8">
            <h3 className="font-[family-name:var(--font-inter)] text-[10px] font-semibold uppercase tracking-[0.3em] text-accent/80">
              {locale === 'vi' ? 'Liên kết nhanh' : 'Quick Links'}
            </h3>
            <div className="mt-1.5 h-px w-8 bg-accent/30" />
            <nav className="mt-5 flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="font-[family-name:var(--font-inter)] text-sm tracking-wide text-white/60 transition-colors duration-300 hover:text-accent"
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact Info */}
          <div className="lg:border-l lg:border-white/10 lg:pl-8">
            <h3 className="font-[family-name:var(--font-inter)] text-[10px] font-semibold uppercase tracking-[0.3em] text-accent/80">
              {locale === 'vi' ? 'Liên hệ' : 'Contact'}
            </h3>
            <div className="mt-1.5 h-px w-8 bg-accent/30" />
            <div className="mt-5 flex flex-col gap-4 text-sm text-white/60">
              {/* Address */}
              <div className="flex gap-3">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <span className="leading-relaxed">
                  {locale === 'vi'
                    ? '108 Trần Đình Xu, P. Cầu Ông Lãnh, Q.1, TP.HCM'
                    : '108 Tran Dinh Xu Street, Cau Ong Lanh Ward, Ho Chi Minh City, Vietnam'}
                </span>
              </div>

              {/* Phone */}
              <div className="flex gap-3">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                <a
                  href="tel:+84913479179"
                  className="transition-colors hover:text-accent"
                >0913 479 179</a>
              </div>

              {/* Email */}
              <div className="flex gap-3">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <a
                  href="mailto:hien.vo@apololawyers.com"
                  className="transition-colors hover:text-accent"
                >hien.vo@apololawyers.com</a>
              </div>

              {/* WhatsApp */}
              <div className="flex gap-3">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent/60"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <a
                  href="https://wa.me/84913479179"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ecosystem Links */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            <span className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] text-white/30">
              {locale === 'vi' ? 'Hệ sinh thái' : 'Ecosystem'}
            </span>
            {ecosystemLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-inter)] text-xs tracking-wider text-white/40 transition-colors duration-300 hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="gold-divider mx-6 lg:mx-8" />
      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <p className="text-center font-[family-name:var(--font-inter)] text-xs tracking-wider text-white/30">
          {tFooter('copyright')} &copy; {new Date().getFullYear()} Vo Thien Hien.{' '}
          {tFooter('allRightsReserved')}.
        </p>
      </div>
    </footer>
  );
}
