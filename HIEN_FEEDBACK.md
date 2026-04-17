# Owner Feedback — vothienhien.com

**Review cycle**: 2026-04 (site 90% built, first owner review)
**Reviewer**: Mr Hien (Võ Thiện Hiển, Managing Partner)
**Builder agent session**: 2026-04-17

> Instructions: See `../../shared-assets/HIEN_FEEDBACK_PROTOCOL.md` for format. Log each feedback item as a `## F-NNN` section before fixing. Do not silently fix.
>
> Builder agent: start by interviewing the user (Thach) to collect Mr Hien's feedback so far. Ask category-by-category (design, content, legal accuracy, UX, performance, SEO, copy tone, bilingual, contact strategy). Log verbatim where possible.

---

## F-001: Publications `content` field was NULL in DB — no body text rendered

- **Date**: 2026-04-17
- **Source**: PM relay (known concern listed in CLAUDE.md PM NOTICE)
- **Severity**: blocker
- **Category**: content
- **Feedback (verbatim, translated if needed)**:
  > PM flagged: "Publications `content` field: confirm it's Lexical JSON in DB, not markdown string. Spot-check one article in `/admin` and on the frontend."
- **Evidence / reproduction**: Query `SELECT content FROM publications_locales LIMIT 1` → before fix returned NULL for all 20 rows. Seed script `scripts/seed-db.mjs` only inserted title/slug/excerpt/category, never the `content` field. Documented as known bug in `../../shared-assets/SITE_BUILD_FEEDBACK.md` Issue 2.
- **Proposed fix**: Built `scripts/import-seo-content.mjs` with a `markdownToLexical()` converter per `../../shared-assets/LEXICAL_FORMAT_REFERENCE.md` and `CONTENT_GENERATION_GUIDE.md`. Script uses REST API (login → POST/PATCH) to populate content for existing 20 articles and creates 38 new articles (24 VI + 14 EN). Verified post-fix: 58/58 publications have Lexical JSON in `content`, column type `jsonb`, root structure valid, first block has `version: 1`.
- **Status**: fixed
- **Generalizable?**: yes — every bilingual authority/SEO site in the ecosystem will hit this if they reuse `seed-db.mjs`. The seed script pattern must either (a) include the `content` field, or (b) be paired with an API-based content importer that handles markdown→Lexical conversion. Already documented in `../../shared-assets/SITE_BUILD_FEEDBACK.md` Issue 2 and `CONTENT_GENERATION_GUIDE.md`.
- **PM action on sign-off**: _(PM fills)_

---

## F-002: `lexicalEditor()` called with no features — admin authoring produces plaintext-only richText

- **Date**: 2026-04-17
- **Source**: PM relay (known concern listed in CLAUDE.md PM NOTICE)
- **Severity**: medium
- **Category**: UX
- **Feedback (verbatim, translated if needed)**:
  > PM flagged: "`lexicalEditor()` is called with no features — authoring new richText from the admin yields limited formatting. Consider upgrading per `PAYLOAD_SETUP_SPEC.md` §1."
- **Evidence / reproduction**: `src/payload.config.ts:80` — `editor: lexicalEditor(),` is called with no argument. PayloadCMS falls back to a minimal default feature set. When Mr Hien or his team open `/admin` → Publications → Edit → `content` field, they get a plaintext-feeling editor: no heading dropdown, no list buttons, no link/quote toolbar items. Our import script bypasses this (writes Lexical JSON directly), so already-imported articles display correctly on frontend — but any new article authored in admin will be underformatted.
- **Proposed fix**: Per `../../shared-assets/PAYLOAD_SETUP_SPEC.md` §1, upgrade to `lexicalEditor({ features: ({ defaultFeatures }) => [...defaultFeatures, HeadingFeature({...}), LinkFeature({...}), UnorderedListFeature(), OrderedListFeature(), BlockquoteFeature(), HorizontalRuleFeature(), ...] })`. Apply once, run `npx payload generate:types`, spot-check the admin editor.
- **Status**: open
- **Generalizable?**: yes — every site using PayloadCMS v3 Lexical editor needs the feature set configured. Should be the canonical snippet in `PAYLOAD_SETUP_SPEC.md` §1 and in `CLAUDE_TEMPLATE.md` Payload Setup section so new sites ship with it from day one.
- **PM action on sign-off**: _(PM fills)_

---

<!-- Builder agent: log F-003, F-004, ... below this line as Thach relays Mr Hien's feedback -->

## F-003: English copy is inconsistent — drop "Henry Vo", use "Vo Thien Hien" + US English job title everywhere

- **Date**: 2026-04-17
- **Source**: Thach relaying Mr Hien verbally
- **Severity**: high
- **Category**: copy tone
- **Feedback (verbatim, translated if needed)**:
  > "Mostly literature [issues]. You have to be consistent when using English here. Use US English for calling Mr Hiển's job title. This should be consistent across all the website. … Please always refer to him as Vo Thien Hien."
- **Evidence / reproduction**: Grep across the repo shows both "Henry Vo" and "Vo Thien Hien" mixed throughout — `messages/en.json:15` (`nameEn: "Henry Vo"`), `messages/vi.json:14` (same), `src/app/layout.tsx:4,6`, `src/app/[locale]/page.tsx:54`, `src/app/[locale]/gioi-thieu-luat-su/page.tsx:98,164`, `src/app/[locale]/lien-he/page.tsx:132`, `src/lib/metadata.ts:75`. Job title in EN uses "Managing Partner" (OK — that's US English) but the VN bio on `/gioi-thieu-luat-su` uses "Luật sư Thành viên Điều hành" which doesn't map cleanly — the rest of the site uses "Luật sư Điều hành". So two issues: (a) mixed EN name forms, (b) inconsistent VN title.
- **Proposed fix**: Single canonical name in EN = "Vo Thien Hien"; drop "Henry Vo" entirely from site copy, metadata, JSON-LD `alternateName`, and messages files. Canonical VN name = "Võ Thiện Hiển". Canonical titles: EN "Managing Partner" (US English), VN "Luật sư Điều hành". Will leave PRD.md and seo-articles-*.json untouched since those are reference artifacts, not shipped copy.
- **Status**: fixed
- **Applied in**: `messages/en.json`, `messages/vi.json`, `src/app/layout.tsx`, `src/lib/metadata.ts`, `src/app/[locale]/page.tsx`, `src/app/[locale]/gioi-thieu-luat-su/page.tsx`, `src/app/[locale]/lien-he/page.tsx`, `src/app/[locale]/bai-viet-chuyen-mon/[slug]/page.tsx`, `src/app/[locale]/linh-vuc-hanh-nghe/[slug]/page.tsx`, `src/app/[locale]/quan-diem-nghe-luat/[slug]/page.tsx`. Also removed `nameEn` key + the italic "Henry Vo" subtitle block in `HeroSection.tsx`, and standardized the VN title variant "Luật sư Thành viên Điều hành" → "Luật sư Điều hành" site-wide. `Attorney Hien` → `Attorney Vo Thien Hien` word-boundary replacement. Grep for `Henry Vo` across `src/**/*.{ts,tsx,json}` returns zero matches. `npx tsc --noEmit` passes.
- **Generalizable?**: yes — rule for all personal-authority sites in the ecosystem: choose ONE canonical name per locale and enforce it via a single source (messages JSON + metadata helper). No "Anglicized nickname" duplication unless the owner explicitly requests it. Should land in `CLAUDE_TEMPLATE.md` Content Strategy section.
- **PM action on sign-off**: _(PM fills)_

---

## F-004: Personal logo needs redesign — gentler curves, more elegant

- **Date**: 2026-04-17
- **Source**: Thach relaying Mr Hien verbally
- **Severity**: medium
- **Category**: design
- **Feedback (verbatim, translated if needed)**:
  > "You should start remake the logo for Mr Hiển. He tell the logo should have some gentle curve and elegant. Please make me a couple of variations."
- **Evidence / reproduction**: Current VH monogram in the header (rounded-square with sharp geometric letterforms) does not convey the luxury/elegance positioning. Mr Hien wants something softer — gentle curves, elegant, still a monogram based on "VH" or "VTH". Image generation is out-of-process (CLAUDE.md § Tech Stack: "AI Images: Generated with Nano Banana 2 (Google Gemini 3.1 Flash Image)") so the builder agent produces prompt specs, user runs generation, then user drops files into R2.
- **Proposed fix**: Write 3–4 variation prompts into `image-assets-v4-logo.json` following the prompt schema used in `image-assets-v3.json`. Each variation should specify: color (gold on dark / dark on cream), line weight, curve treatment (calligraphic, art-deco, serif-derived flourish), negative space handling, SVG-friendly simplicity, social-avatar and header-sized legibility. Defer integration to a follow-up F-NNN after user selects a winner.
- **Status**: prompts ready — awaiting owner selection
- **Artifact**: `image-assets-v4-logo.json` (4 variations written)
- **Generalizable?**: no — specific to Mr Hien's personal brand mark.
- **PM action on sign-off**: _(PM fills)_

---

## F-005: Footer institutional logos — swap Apolo logo (user-provided) + CCBE name in Vietnamese on VN locale

- **Date**: 2026-04-17
- **Source**: Thach relaying Mr Hien verbally
- **Severity**: medium
- **Category**: design (bilingual cross-cutting)
- **Feedback (verbatim, translated if needed)**:
  > "You will change the logo at the footer, I will give you a new logo. If the logo have [text], only the EU association need its name appear in Vietnamese version."
- **Evidence / reproduction**: `src/components/layout/Footer.tsx` renders transparent Apolo Lawyers logo + institution logos (Liên đoàn LSVN + CCBE). User will hand-deliver new Apolo footer logo asset. CCBE logo currently shows the English abbreviation / name regardless of locale — Mr Hien wants the CCBE name in Vietnamese ("Hiệp hội Luật sư Châu Âu" or similar — Thach to confirm exact form) on the VN locale, English on the EN locale. Liên đoàn LSVN is already a VN organization so its name stays Vietnamese.
- **Proposed fix**: (a) Add a slot in Footer.tsx for the new Apolo logo (keep path parameterized via `IMAGES` map so the swap is a one-line change once the asset lands). (b) Render CCBE mark with a locale-conditional label underneath — VN label vs EN label. Confirm the exact Vietnamese form with Thach before shipping.
- **Status**: partially fixed — CCBE label is already locale-conditional (VN: "Hiệp hội Luật sư Châu Âu" / "Hiệp hội LS Châu Âu" caption; EN: "European Bar Association"). Liên đoàn LSVN is locale-conditional too. Awaiting new Apolo Lawyers firm logo asset from owner — see `src/components/layout/Footer.tsx` comment at `/public/asset/logo-transparent.png`. Confirm with Thach whether CCBE full Vietnamese form should read "Hội đồng Luật sư Châu Âu" (direct translation of "Council of Bars and Law Societies of Europe") instead.
- **Generalizable?**: partial — "institutional logos in the footer should render their names in the viewing locale" is a reusable rule for all bilingual sites in the ecosystem. Update the footer spec in the site template.
- **PM action on sign-off**: _(PM fills)_

---

## F-006: Home page practice list — 7 cards breaks the grid; cap at 6 + "See more" link

- **Date**: 2026-04-17
- **Source**: Thach relaying Mr Hien verbally
- **Severity**: high
- **Category**: design
- **Feedback (verbatim, translated if needed)**:
  > "The practice list on the main page, only show 6 practices, and a see more. The 7 practices break the format."
- **Evidence / reproduction**: After F-001 session added "Tranh Chấp Thương Mại" (Commercial Disputes) as the 7th practice area, `src/components/home/PracticeAreasPreview.tsx` renders all 7 on the home page, breaking the 2×3 or 3×2 grid layout. The full listing page at `/vi/linh-vuc-hanh-nghe` should still show all 7.
- **Proposed fix**: Slice to first 6 in the home-page preview component (`.slice(0, 6)`) and append a "Xem tất cả lĩnh vực / See all practice areas" CTA linking to the full listing. Keep the 7-area ordering in the data so product can reshuffle which 6 are featured without touching the component.
- **Status**: fixed
- **Applied in**: `src/components/home/PracticeAreasPreview.tsx`. Added `FEATURED_COUNT = 6` constant, `.slice(0, FEATURED_COUNT)` on the map, inline comment explaining reorder semantics. Reordered the array so Commercial Disputes (newly added, important for firm's commercial-law positioning) is surfaced in the top 6; Criminal Defense is the one pushed to the full listing page. "View all practice areas" link already existed below the grid.
- **Generalizable?**: yes — any home-page preview of CMS-driven lists should be capped at a grid-friendly count with an explicit "see all" link, not open-ended. Update the component-patterns section of the template.
- **PM action on sign-off**: _(PM fills)_

---

## F-007: Testimonial section — 5 per language, synthetic individual sources (not Samsung-tier corporates)

- **Date**: 2026-04-17
- **Source**: Thach relaying Mr Hien verbally
- **Severity**: high
- **Category**: content
- **Feedback (verbatim, translated if needed)**:
  > "For the testimonial section make me 5 feedback for each language. Synthetic the source, they shouldn't be very big and famous like Samsung, just variable in person."
- **Evidence / reproduction**: `src/components/home/TestimonialSection.tsx` currently carousels a small set (need to re-read — at most 2–3) and prior drafts featured corporate-brand testimonials. Mr Hien wants regular individuals — small-business owners, expat clients, families, maybe a mid-size local entrepreneur — NOT multinationals. 5 per locale (VI + EN), rotating.
- **Proposed fix**: Write 5 Vietnamese and 5 English testimonials with realistic individual personas (varied: expat needing divorce help, small-business owner facing commercial dispute, family in land dispute, property buyer, employee in unfair dismissal case, etc.). Each has: quote (1–3 sentences), name (plausible, locale-appropriate), role/context, initial-based avatar. Extend the existing navigation-dot carousel in TestimonialSection to 5 slides.
- **Status**: fixed
- **Applied in**: `messages/en.json` + `messages/vi.json` (new `testimonials.items` array with 5 per locale — personas: small distribution-firm owner, American expat divorce, Nordic consultant buying an apartment, Vietnamese-Australian on family estate, Italian F&B FDI owner on the EN side; small-business owner in a commercial arbitration, software engineer's divorce, Bình Dương family in a land boundary dispute, furniture shop owner in a labor claim, first-time apartment buyer on the VN side — all individuals, no corporates). `src/components/home/TestimonialSection.tsx` rewritten to read `t.raw('items')`, maintain a local `index` state, auto-rotate every 7s once in view, render 5 working nav dots with keyboard-clickable selection. No Samsung/Vingroup/etc.
- **Generalizable?**: yes — ecosystem rule: testimonials on authority sites should be individuals in plausible scenarios matching the site's practice areas, not Samsung/Vingroup/etc. This de-risks the "can we verify this quote" problem and reads more authentic. Add to `CLAUDE_TEMPLATE.md`.
- **PM action on sign-off**: _(PM fills)_

---

## F-008: Remove "Currently accepting new matters" availability tag

- **Date**: 2026-04-17
- **Source**: Thach relaying Mr Hien verbally
- **Severity**: medium
- **Category**: copy tone
- **Feedback (verbatim, translated if needed)**:
  > "Remove the text 'Currently accepting new matters'."
- **Evidence / reproduction**: `messages/en.json:74` — `"accepting": "Currently accepting new matters"`. The PRD.md:82 also lists this as a hero microtext element. Mr Hien does not want a subtle availability indicator on his personal site — presumably because a Managing Partner doesn't advertise capacity publicly.
- **Proposed fix**: Delete the `accepting` key from `messages/en.json` and its VI counterpart; remove the component usage site (HeroSection or similar). Leave PRD.md alone (it's an archived spec), but noting the contradiction for PM.
- **Status**: fixed
- **Applied in**: `messages/en.json` + `messages/vi.json` (key removed). `src/components/home/TestimonialSection.tsx` — removed the `{t('accepting')}` render block that used to sit below the testimonial citation. PRD.md left intact per plan.
- **Generalizable?**: partial — sites in the "luxury / authority" tier should NOT display availability indicators. Sites in the "funnel / conversion" tier MAY want them. This is a per-tier rule. Note it against the site tiering in the template.
- **PM action on sign-off**: _(PM fills)_
