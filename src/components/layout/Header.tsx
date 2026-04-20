'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import Image from 'next/image';
import MobileMenu from './MobileMenu';
import { IMAGES } from '@/lib/images';

const navItems = [
  { key: 'home' as const, href: '/' as const },
  { key: 'profile' as const, href: '/gioi-thieu-luat-su' as const },
  { key: 'practiceAreas' as const, href: '/linh-vuc-hanh-nghe' as const },
  { key: 'publications' as const, href: '/bai-viet-chuyen-mon' as const },
  { key: 'contact' as const, href: '/lien-he' as const },
] as const;

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = (newLocale: 'vi' | 'en') => {
    router.replace(pathname as '/', { locale: newLocale });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? 'bg-primary/95 backdrop-blur-md border-b border-accent/15'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <Image
                src={IMAGES.logoSymbolic4LaurelScales.cdn}
                alt="Vo Thien Hien — Managing Partner mark"
                width={40}
                height={40}
                className="rounded-full ring-1 ring-accent/20"
              />
              <div className="flex flex-col">
                <span
                  className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-[0.15em] text-accent transition-colors duration-300 group-hover:text-accent-secondary sm:text-xl"
                >
                  VÕ THIỆN HIỂN
                </span>
                <span
                  className={`font-[family-name:var(--font-inter)] text-[10px] font-medium uppercase tracking-[0.3em] transition-colors duration-300 ${
                    scrolled ? 'text-white/60' : 'text-text-secondary/80'
                  }`}
                >
                  <span className={locale === 'vi' ? 'tracking-[0.45em]' : ''}>{locale === 'vi' ? 'LUẬT SƯ' : 'ATTORNEY AT LAW'}</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-10 lg:flex">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`relative font-[family-name:var(--font-inter)] text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                      isActive
                        ? 'text-accent'
                        : scrolled
                          ? 'text-white/80 hover:text-accent'
                          : 'text-text-primary/90 hover:text-accent'
                    }`}
                  >
                    {t(item.key)}
                    {isActive && (
                      <span className="absolute -bottom-1.5 left-0 h-px w-full bg-accent" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right section: Language switcher + Mobile menu */}
            <div className="flex items-center gap-5">
              {/* Language Switcher */}
              <div className="flex items-center font-[family-name:var(--font-inter)] text-xs font-medium tracking-wider">
                <button
                  onClick={() => switchLocale('vi')}
                  className={`px-1.5 py-1 transition-colors duration-300 ${
                    locale === 'vi'
                      ? 'text-accent'
                      : scrolled
                        ? 'text-white/60 hover:text-accent'
                        : 'text-text-secondary/80 hover:text-accent'
                  }`}
                >
                  VI
                </button>
                <span
                  className={`text-[10px] ${
                    scrolled ? 'text-border-gold' : 'text-border-gold/60'
                  }`}
                >
                  |
                </span>
                <button
                  onClick={() => switchLocale('en')}
                  className={`px-1.5 py-1 transition-colors duration-300 ${
                    locale === 'en'
                      ? 'text-accent'
                      : scrolled
                        ? 'text-white/60 hover:text-accent'
                        : 'text-text-secondary/80 hover:text-accent'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
                aria-label="Open menu"
              >
                <span
                  className={`block h-px w-6 transition-colors duration-300 ${
                    scrolled ? 'bg-white/90' : 'bg-text-primary/90'
                  }`}
                />
                <span
                  className={`block h-px w-4 transition-colors duration-300 ${
                    scrolled ? 'bg-accent' : 'bg-accent/80'
                  }`}
                />
                <span
                  className={`block h-px w-6 transition-colors duration-300 ${
                    scrolled ? 'bg-white/90' : 'bg-text-primary/90'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        locale={locale}
        navItems={navItems}
      />
    </>
  );
}
