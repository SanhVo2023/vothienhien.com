/**
 * Apolo Lawyers — Official Address & Contact (Single Source of Truth)
 *
 * All values are mirrored VERBATIM from the workspace-root file `address.txt`
 * (Mr Hien, 2026-05-11 post-merger). DO NOT edit values without re-reading
 * that file. No abbreviation drift, no formatting drift, no paraphrasing.
 *
 * Cross-link rule (Issue 13): VN content links to apolo.com.vn ONLY;
 * EN content links to apololawyers.com ONLY. Never cross.
 */

// ─── Company name ──────────────────────────────────────────────────────────
export const COMPANY_NAME_VN =
  'Công ty Luật Apolo Lawyers, thuộc Đoàn Luật sư TP. Hồ Chí Minh, trực thuộc Liên đoàn Luật sư Việt Nam';
export const COMPANY_NAME_EN =
  'APOLO LAWYERS - Solicitors & Litigators, a law practice organization belonging to the Ho Chi Minh City Bar Association, under the Vietnam Bar Federation';

export const SHORT_NAME_VN = 'Công ty Luật Apolo Lawyers';
export const SHORT_NAME_EN = 'APOLO LAWYERS - Solicitors & Litigators';

type OfficeBlock = {
  readonly name: string;
  readonly address: string;
  readonly phones: readonly string[];
  readonly hotline?: string;
};

// ─── Main office (rendered on both VN and EN, locale-specific text) ────────
export const MAIN_OFFICE: { vi: OfficeBlock; en: OfficeBlock } = {
  vi: {
    name: 'Văn phòng chính',
    address: '108 Trần Đình Xu, Phường Cầu Ông Lãnh, TP. Hồ Chí Minh',
    phones: ['(028) 66.701.709', '0908.043.086'],
  },
  en: {
    name: 'Main Office',
    address: '108 Tran Dinh Xu Street, Cau Ong Lanh Ward, Ho Chi Minh City, Vietnam',
    phones: ['(+8428) 66.701.709', '(+84) 908.043.086'],
    hotline: '(+84) 903.600.347',
  },
};

// ─── East Saigon branch (EN-only — surfaced on EN locale only per Mr Hien) ─
export const EAST_SAIGON_BRANCH_EN = {
  name: 'EAST SAI GON BRANCH - APOLO LAWYERS LAWFIRM',
  address:
    '9th/F, Tower K&M Building, 33 Ung Van Khiem Street, Thanh My Tay Ward, Ho Chi Minh City, Vietnam',
  phones: ['(+8428) 35.059.349', '(+84) 908.097.068'],
  hotline: '(+84) 979.48.98.79',
} as const;

// ─── Shared (identical on VN + EN) ─────────────────────────────────────────
export const EMAIL = 'contact@apolo.com.vn';

// Call-center / Tổng đài tư vấn pháp luật
export const CALL_CENTER = {
  vi: '0903.419.479',
  en: '(+84) 903.419.479',
} as const;

// E.164 form for tel:/wa.me/ links (strip dots, spaces, parens; one canonical
// number for all locales since wa.me/tel resolve to the same digits).
export const CALL_CENTER_E164 = '+84903419479';
export const CALL_CENTER_WA = '84903419479';

// ─── Parent brand cross-link rule (Issue 13) ───────────────────────────────
export const PARENT_BRAND = {
  vi: 'https://www.apolo.com.vn',
  en: 'https://www.apololawyers.com',
} as const;

/**
 * Pick the correct parent-brand URL for a given locale.
 * Use this everywhere a JSON-LD `url` / `sameAs` / footer ecosystem link
 * references the firm. NEVER hardcode either URL directly in a component.
 */
export function parentBrandUrl(locale: string): string {
  return locale === 'vi' ? PARENT_BRAND.vi : PARENT_BRAND.en;
}

// ─── Postal address structured (for JSON-LD PostalAddress nodes) ───────────
export const POSTAL_ADDRESS = {
  vi: {
    streetAddress: '108 Trần Đình Xu',
    addressLocality: 'Phường Cầu Ông Lãnh, TP. Hồ Chí Minh',
    addressCountry: 'VN',
  },
  en: {
    streetAddress: '108 Tran Dinh Xu Street',
    addressLocality: 'Cau Ong Lanh Ward, Ho Chi Minh City',
    addressCountry: 'VN',
  },
} as const;
