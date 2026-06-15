'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Career moment showcase — an editorial mosaic of Mr Hien's check-in / career
 * photos with a keyboard-navigable lightbox.
 *
 * ── HOW TO ADD THE REAL PHOTOS ──────────────────────────────────────────────
 *   1. Drop the files into  /public/images/career/  (see README there).
 *   2. Set each item's `image` to e.g. '/images/career/01.webp'.
 *   3. Replace the `vi` / `en` caption with the real place / event, and set
 *      `year` if known.
 * Until `image` is set, an on-brand placeholder tile renders in its place, so
 * the layout previews correctly with no photos yet. Local /public paths need no
 * next.config change; R2 CDN URLs under /vothienhien.com/** are also allowed.
 */

type Moment = {
  id: number;
  /** Set to a real path to show a photo, e.g. '/images/career/01.webp'. */
  image?: string;
  vi: string;
  en: string;
  year?: string;
};

// Mr Hien's profile portraits (AI-generated from his photo, on R2) interleaved
// originals in /assets/About). Captions come from the source filenames.
const MOMENTS: Moment[] = [
  { id: 1, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-01-5bb7790d.webp', vi: 'Luật sư Võ Thiện Hiển', en: 'Attorney Vo Thien Hien' },
  { id: 2, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-02-626d5850.webp', vi: 'Tại văn phòng', en: 'At the Office' },
  { id: 3, image: '/images/career/01.webp', vi: 'Chân dung', en: 'Portrait' },
  { id: 4, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-03-c9686043.webp', vi: 'Chân dung chuyên nghiệp', en: 'Professional Portrait' },
  { id: 5, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-04-d4d69a69.webp', vi: 'Tư vấn pháp lý', en: 'Legal Counsel' },
  { id: 6, image: '/images/career/07.webp', vi: 'Trung tâm Trọng tài Quốc tế Việt Nam (VIAC)', en: 'Vietnam International Arbitration Centre (VIAC)' },
  { id: 7, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-05-c9129090.webp', vi: 'Tại thư viện luật', en: 'In the Law Library' },
  { id: 8, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-06-01bfcccc.webp', vi: 'Phòng họp', en: 'Meeting Room' },
  { id: 9, image: '/images/career/10.webp', vi: 'Tại phiên tòa', en: 'At a Court Hearing' },
  { id: 10, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-07-b94766e4.webp', vi: 'Luật sư Võ Thiện Hiển', en: 'Attorney Vo Thien Hien' },
  { id: 11, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-08-f77a3a7d.webp', vi: 'Tại văn phòng', en: 'At the Office' },
  { id: 12, image: '/images/career/09.webp', vi: 'Phát biểu tại tọa đàm', en: 'Speaking at a Roundtable' },
  { id: 13, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-09-4186d466.webp', vi: 'Chân dung chuyên nghiệp', en: 'Professional Portrait' },
  { id: 14, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-10-24675d36.webp', vi: 'Tư vấn pháp lý', en: 'Legal Counsel' },
  { id: 15, image: '/images/career/12.webp', vi: 'Sự kiện M&A', en: 'M&A Event' },
  { id: 16, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-11-688f8a2e.webp', vi: 'Tại thư viện luật', en: 'In the Law Library' },
  { id: 17, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-12-de53e11e.webp', vi: 'Phòng họp', en: 'Meeting Room' },
  { id: 18, image: '/images/career/13.webp', vi: 'Nhận hoa chúc mừng', en: 'Receiving Congratulations' },
  { id: 19, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-13-b0f09e90.webp', vi: 'Luật sư Võ Thiện Hiển', en: 'Attorney Vo Thien Hien' },
  { id: 20, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-14-6476ee0a.webp', vi: 'Tại văn phòng', en: 'At the Office' },
  { id: 21, image: '/images/career/14.webp', vi: 'Lễ vinh danh', en: 'Recognition Ceremony' },
  { id: 22, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-15-cdb4e94a.webp', vi: 'Chân dung chuyên nghiệp', en: 'Professional Portrait' },
  { id: 23, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-16-f10cdd2b.webp', vi: 'Tư vấn pháp lý', en: 'Legal Counsel' },
  { id: 24, image: '/images/career/16.webp', vi: 'Trước trụ sở tòa án', en: 'Outside the Courthouse' },
  { id: 25, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-17-061f48f4.webp', vi: 'Tại thư viện luật', en: 'In the Law Library' },
  { id: 26, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-18-16a2e1ec.webp', vi: 'Phòng họp', en: 'Meeting Room' },
  { id: 27, image: '/images/career/17.webp', vi: 'Trước trụ sở tòa án', en: 'Outside the Courthouse' },
  { id: 28, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-19-32856afb.webp', vi: 'Luật sư Võ Thiện Hiển', en: 'Attorney Vo Thien Hien' },
  { id: 29, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-20-681a0ca4.webp', vi: 'Tại văn phòng', en: 'At the Office' },
  { id: 30, image: '/images/career/18.webp', vi: 'Tại văn phòng', en: 'At the Office' },
  { id: 31, image: 'https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/vothienhien.com/profile/hien-21-19140394.webp', vi: 'Chân dung chuyên nghiệp', en: 'Professional Portrait' },
  { id: 32, image: '/images/career/02.webp', vi: 'Tại văn phòng Apolo Lawyers', en: 'At the Apolo Lawyers Office' },
  { id: 33, image: '/images/career/08.webp', vi: 'Buổi tọa đàm pháp lý', en: 'Legal Roundtable' },
];

// Deterministic mosaic rhythm, matched to each photo's orientation so portraits
// get tall tiles and landscapes get wide ones. Mobile stays a clean 2-col grid;
// spans only kick in at sm/lg so the layout never breaks.
const SPAN: Record<number, string> = {
  3: 'sm:row-span-2',
  8: 'lg:col-span-2',
  12: 'sm:row-span-2',
  14: 'lg:col-span-2',
  21: 'sm:row-span-2',
  26: 'lg:col-span-2',
  29: 'lg:col-span-2',
  30: 'sm:row-span-2',
  32: 'lg:col-span-2',
};

function PinIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function ExpandIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Tile({
  moment,
  index,
  isVi,
  onOpen,
}: {
  moment: Moment;
  index: number;
  isVi: boolean;
  onOpen: () => void;
}) {
  const caption = isVi ? moment.vi : moment.en;
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      className={`group relative overflow-hidden bg-secondary ring-1 ring-border-gold/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${SPAN[index] ?? ''}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      aria-label={`${caption}${moment.year ? ` — ${moment.year}` : ''}`}
    >
      {moment.image ? (
        <Image
          src={moment.image}
          alt={caption}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          // Bias the crop toward the upper third so faces stay in frame on the
          // taller/wider mosaic tiles (object-cover otherwise center-crops heads).
          className="object-cover object-[center_28%] transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      ) : (
        // On-brand placeholder until the real photo is wired in.
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-gradient-to-br from-secondary via-primary to-black px-4 text-center">
          <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_50%_38%,rgba(197,165,90,0.16),transparent_60%)]" />
          <span className="pointer-events-none absolute right-3 top-2 font-[family-name:var(--font-inter)] text-5xl font-light leading-none text-white/[0.06]">
            {String(moment.id).padStart(2, '0')}
          </span>
          <PinIcon className="relative h-7 w-7 text-accent/55" />
          <span className="relative font-heading text-sm leading-snug text-white/85">{caption}</span>
          {moment.year && <span className="relative text-xs text-accent/70">{moment.year}</span>}
        </div>
      )}

      {/* Hover / focus caption overlay */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
        <div className="translate-y-3 transition-transform duration-500 group-hover:translate-y-0 group-focus-visible:translate-y-0">
          <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-accent">
            <PinIcon className="h-3.5 w-3.5" />
            {moment.year ?? (isVi ? 'Khoảnh khắc' : 'Moment')}
          </span>
          <span className="mt-1 block font-heading text-base font-medium text-white">{caption}</span>
        </div>
      </div>

      <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/90 opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
        <ExpandIcon className="h-4 w-4" />
      </span>
    </motion.button>
  );
}

export default function CareerGallery({ locale }: { locale: string }) {
  const isVi = locale === 'vi';
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const go = useCallback(
    (dir: 1 | -1) =>
      setActive((cur) => (cur === null ? cur : (cur + dir + MOMENTS.length) % MOMENTS.length)),
    [],
  );

  // Keyboard nav + body scroll lock while the lightbox is open.
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, close, go]);

  const current = active === null ? null : MOMENTS[active];
  const currentCaption = current ? (isVi ? current.vi : current.en) : '';

  return (
    <>
      <div className="grid grid-flow-row-dense auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[185px] sm:grid-cols-3 md:gap-4 lg:auto-rows-[210px] lg:grid-cols-4">
        {MOMENTS.map((m, i) => (
          <Tile key={m.id} moment={m} index={i} isVi={isVi} onOpen={() => setActive(i)} />
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-text-secondary/70">
        {isVi
          ? 'Bộ sưu tập khoảnh khắc trong hành trình hành nghề — đang được cập nhật.'
          : 'A collection of moments across a career in practice — continually updated.'}
      </p>

      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={currentCaption}
          >
            {/* Close */}
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label={isVi ? 'Đóng' : 'Close'}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            {/* Prev / Next */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-accent md:left-6"
              aria-label={isVi ? 'Trước' : 'Previous'}
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); go(1); }}
              className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-accent md:right-6"
              aria-label={isVi ? 'Tiếp' : 'Next'}
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <motion.figure
              key={current.id}
              className="relative flex max-h-full w-full max-w-4xl flex-col items-center"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden ring-1 ring-white/10">
                {current.image ? (
                  <Image src={current.image} alt={currentCaption} fill sizes="100vw" className="object-contain" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-secondary via-primary to-black">
                    <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_50%_40%,rgba(197,165,90,0.18),transparent_62%)]" />
                    <PinIcon className="relative h-12 w-12 text-accent/55" />
                    <span className="relative font-heading text-2xl text-white/90">{currentCaption}</span>
                    <span className="relative text-xs uppercase tracking-[0.25em] text-white/40">
                      {isVi ? 'Hình ảnh sắp cập nhật' : 'Photo coming soon'}
                    </span>
                  </div>
                )}
              </div>
              <figcaption className="mt-4 flex items-center gap-2 text-center text-white/80">
                <PinIcon className="h-4 w-4 text-accent" />
                <span className="font-heading text-lg">{currentCaption}</span>
                {current.year && <span className="text-accent/80">· {current.year}</span>}
                <span className="ml-2 font-[family-name:var(--font-inter)] text-sm text-white/40">
                  {String((active ?? 0) + 1).padStart(2, '0')} / {String(MOMENTS.length).padStart(2, '0')}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
