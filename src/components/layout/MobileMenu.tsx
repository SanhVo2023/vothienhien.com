'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

type NavItem = {
  readonly key: string;
  readonly href: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  navItems: readonly NavItem[];
};

export default function MobileMenu({ isOpen, onClose, locale, navItems }: Props) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const switchLocale = (newLocale: 'vi' | 'en') => {
    router.replace(pathname as '/', { locale: newLocale });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-primary/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-sm bg-white shadow-2xl"
          >
            <div className="flex h-full flex-col px-8 py-6">
              {/* Close button */}
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center text-text-secondary transition-colors hover:text-accent"
                  aria-label="Close menu"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <line x1="4" y1="4" x2="16" y2="16" />
                    <line x1="16" y1="4" x2="4" y2="16" />
                  </svg>
                </button>
              </div>

              {/* Logo */}
              <div className="mt-6 mb-12">
                <span className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[0.15em] text-accent">
                  VO THIEN HIEN
                </span>
                <div className="mt-1 h-px w-12 bg-accent/40" />
              </div>

              {/* Navigation */}
              <nav className="flex flex-1 flex-col gap-1">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        href={item.href as '/'}
                        onClick={onClose}
                        className={`flex items-center py-3.5 font-[family-name:var(--font-inter)] text-sm font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                          isActive
                            ? 'text-accent'
                            : 'text-text-primary hover:text-accent'
                        }`}
                      >
                        {isActive && (
                          <span className="mr-3 inline-block h-px w-4 bg-accent" />
                        )}
                        {t(item.key as 'home')}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Bottom section */}
              <div className="border-t border-border-gold/30 pt-6">
                {/* Language Switcher */}
                <div className="flex items-center gap-4">
                  <span className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                    {locale === 'vi' ? 'Ngôn ngữ' : 'Language'}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => switchLocale('vi')}
                      className={`font-[family-name:var(--font-inter)] text-sm font-medium tracking-wider transition-colors ${
                        locale === 'vi' ? 'text-accent' : 'text-text-secondary hover:text-accent'
                      }`}
                    >
                      VI
                    </button>
                    <span className="text-border-gold">|</span>
                    <button
                      onClick={() => switchLocale('en')}
                      className={`font-[family-name:var(--font-inter)] text-sm font-medium tracking-wider transition-colors ${
                        locale === 'en' ? 'text-accent' : 'text-text-secondary hover:text-accent'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
