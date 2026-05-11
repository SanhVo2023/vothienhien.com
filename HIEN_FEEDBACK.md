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
- **Status**: fixed
- **Applied in**: `src/payload.config.ts` — replaced `editor: lexicalEditor()` with the canonical feature set from `PAYLOAD_SETUP_SPEC.md` §1: Heading (h1-h4), Blockquote, Link (pages collection), UnorderedList, OrderedList, Bold, Italic, Underline, Strikethrough, InlineCode, HorizontalRule, Upload (media collection with empty `fields: []` required by the v3 type), FixedToolbar. Admin richText fields (Publications.content, PracticeAreas.description, etc.) now render a full toolbar instead of plaintext. `UploadFeature` requires `fields` (not just `{}`) — TS2741 was caught by type-check. `npx payload generate:importmap` CLI fails with ERR_MODULE_NOT_FOUND (known TS-import issue outside Next.js context, same problem as F-001 seed script) — but `npx next build` regenerates the importmap correctly. Verified: `npx tsc --noEmit` clean, `npx next build` compiles the /admin route.
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
- **Status**: superseded by F-010 (Mr Hien rejected letter-based direction after seeing generated variants)
- **Artifact**: `image-assets-v4-logo.json` (4 letter-based variations — obsolete; kept for reference)
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

---

## F-009: English lawyer-related terminology must be consistent site-wide

- **Date**: 2026-04-20
- **Source**: Thach relaying Mr Hien (Vietnamese message to PM, 2026-04-20)
- **Severity**: high
- **Category**: copy tone
- **Feedback (verbatim, translated if needed)**:
  > "Anh muốn các từ Tiếng Anh về luật sư phải consistant kiểu như xưng là gì thì cả cái web phải xài từ đó."
  >
  > Translation: "I want the English lawyer-related terms to be consistent — whatever term is used to refer to him, the whole site must use that term."
- **Evidence / reproduction**: F-003 already standardized the proper name ("Vo Thien Hien"). This feedback is broader — it targets the *profession noun / honorific / title / practice-area phrase* too. Likely inconsistencies to audit across `messages/en.json`, `src/**/*.{ts,tsx}`, `src/lib/metadata.ts`, SEO JSON-LD, and frontend copy:
  - "Attorney" vs "Lawyer" vs "Counsel" (US-English canonical = **Attorney**)
  - Honorific: "Attorney Vo Thien Hien" (canonical per F-003) vs bare "Mr Vo Thien Hien"
  - "Managing Partner" (canonical per F-003) vs "Senior Partner" / "Managing Lawyer"
  - "practice areas" vs "areas of practice" vs "specialties"
  - "law firm" vs "law office" vs "legal practice"
  - "clients" vs "customers" vs "matters"
- **Proposed fix**: Two-step.
  1. Write `TERMINOLOGY_GLOSSARY.md` in the site root — one canonical English term per concept, with banned synonyms listed. Thach/PM confirms the canonical list before step 2.
  2. Builder agent does a site-wide audit: grep for each banned synonym, replace with the canonical form, run `npx tsc --noEmit`, spot-check `/admin` and key pages. Add a CI-style check (lint rule or simple grep script) that fails build if a banned synonym shows up in shipped copy.
- **Status**: open — awaiting canonical glossary from Thach/Mr Hien
- **Generalizable?**: yes — every EN or VN+EN site in the ecosystem needs a `TERMINOLOGY_GLOSSARY.md`. The glossary file format and audit script should ship as a template in `shared-assets/`. Add a "Terminology Consistency" section to `CLAUDE_TEMPLATE.md`.
- **PM action on sign-off**: _(PM fills)_

---

## F-010: Logo direction pivot — symbolic imagery (not letters), strong/sturdy, transparent background

- **Date**: 2026-04-20
- **Source**: Thach relaying Mr Hien after he reviewed the 4 letter-based variants from F-004 (screenshot shared; Messenger quote below)
- **Severity**: high
- **Category**: design
- **Feedback (verbatim, translated if needed)**:
  > Mr Hien: "Logo khoẻ mạnh, cứng cáp cho nghề luật sư"
  > Thach/PM paraphrase: "Not letter-based — wants a set of logos using **hình tượng tượng trưng cho nghề luật sư** (symbolic imagery representing the legal profession). And transparent background."
  >
  > Translation of key phrase: "Strong, sturdy/firm logo for the legal profession."
- **Evidence / reproduction**: F-004 delivered 4 letter-based monograms (VH / VTH ligature, copperplate, enclosed, single-curve). Mr Hien's Messenger reply indicates the letter direction is not the final answer. He wants:
  1. **Symbolic imagery** — scales of justice, classical pillar, gavel + book, laurel wreath, etc. No letters, no VH/VTH monograms.
  2. **Strong / sturdy** (khoẻ mạnh, cứng cáp) — weighty proportions, confident lines, heraldic gravitas. This flips F-004's "gentle curves, elegant" direction.
  3. **Transparent background** — PNG with alpha, so the logo reads on header (dark navy), footer (gold accent), social avatars, and print collateral without a solid box.
- **Proposed fix**: Wrote `image-assets-v5-logo-symbolic.json` with 4 new prompts:
  1. `logo-symbolic-1-scales` — bold scales of justice, weighty beam, broad pans, solid base
  2. `logo-symbolic-2-pillar` — single classical column (Doric/Corinthian), sturdy proportions
  3. `logo-symbolic-3-gavel-book` — gavel resting on open law book, heraldic crest silhouette
  4. `logo-symbolic-4-laurel-scales` — laurel wreath encircling small stylized scales
  All four specify: solid antique gold, flat vector aesthetic, NO letters, NO text, fully transparent PNG with alpha channel, 1024×1024, category=icon. Merged into `image-assets.json` in place of the 4 obsolete `logo-variation-*` letter entries.
- **Status**: prompts ready — user generating in image-generator-ui `/batch`, awaiting Mr Hien's selection of winner(s)
- **Artifact**: `image-assets-v5-logo-symbolic.json` (reference); 4 entries live in `image-assets.json` with status=pending
- **Generalizable?**: partial — the specific symbols are personal-brand, but two patterns generalize:
  1. For "legal profession" visual language across the ecosystem, prefer symbolic marks (scales, pillar, gavel, laurel) over letter monograms, unless the site explicitly calls for a Western-style initials mark. Add to `shared-assets/brand-guidelines/`.
  2. All new logo/icon generations should specify "transparent PNG, alpha channel, no background" in the prompt so the output works on any surface. Update `IMAGE_MANIFEST_SCHEMA.md` with a note.
- **PM action on sign-off**: _(PM fills)_

---

## F-011: Remove 3rd-party publisher sources/credits from articles (govt sources OK)

- **Date**: 2026-05-04
- **Source**: Thach relaying Mr Hien (Phase 1 owner-review)
- **Severity**: high
- **Category**: content
- **Feedback (verbatim, translated if needed)**:
  > "He don't want any of the blog or artical have 3 party source or credit of it. A gov publication is okie else articles are paterned should be remove the source — especially a 3rd publisher party. Keep the post but don't mention the source."
- **Evidence / reproduction**: Articles imported via `scripts/import-seo-content.mjs` from `seo-articles-vi.json` / `seo-articles-en.json` may contain inline citation links / footer "Nguồn:" lines. Initial grep found no `Nguồn:` / `Source:` matches in vothienhien.com content scripts — so most likely clean, but a full audit of every article body's Lexical content is needed (some 3rd-party hyperlinks may exist inline). 100 articles to audit.
- **Proposed fix**: Three-step audit:
  1. Query Payload `publications` collection (both VI + EN locales) → dump `content` JSON
  2. Walk every Lexical node tree looking for `type: 'link'` whose `fields.url` host is NOT `*.gov.vn` / `*.chinhphu.vn` / `vbpl.vn` / `quochoi.vn` / `toaan.gov.vn` (and similar official Vietnamese govt domains). Also scan text content for "Nguồn:" / "Source:" / "Theo [publisher]" patterns.
  3. For each non-govt source: strip the inline link (keep the surrounding text) and remove any trailing "Nguồn: ..." line. Re-PATCH the article via REST.
- **Status**: fixed (2026-05-11 — verified clean, no DB changes needed)
- **Applied in**:
  - **New audit infra**: `scripts/audit-source-strip.mjs` — Payload REST walker. Logs into the admin API, paginates through every publication, calls `?locale=vi` + `?locale=en` on each, recursively transforms the Lexical tree: (a) strips `type: 'link'` nodes whose host fails the allowlist (preserves the surrounding inline text), (b) drops `type: 'paragraph'` whose first text token matches `/^(Nguồn|Source)\s*:/i`. Writes a `F011-report-{dryrun|apply}.json` audit trail. Re-runnable with `--apply` for the actual PATCH pass.
  - **Allowlist hardcoded** in the script: `*.gov.vn` (any subdomain) + `vbpl.vn` + internal ecosystem (`vothienhien.com`, `law.org.vn`, `law.pro.vn`, `lawyer.id.vn`, `luatsutructuyen.net`, `apolo.com.vn`, `apololawyers.com`, `apololegal.com`, `lawyersinvietnam.com`) with their `www.` variants. URLs that fail to parse (relative, `mailto:`, `tel:`) treated as allowed (not 3rd-party publisher refs).
  - The "Theo [publisher]" inline heuristic was deliberately skipped per the prompt's "be conservative" instruction — too high false-positive rate on legitimate phrases like "Theo Bộ luật Dân sự 2015" (referring to the Civil Code, not a publisher).
- **Audit result**:
  - Dry-run scanned all 58 publications × 2 locales = 116 entries.
  - **0** non-allowlist hosts found. **0** "Nguồn:"/"Source:" paragraphs found. **0** articles flagged for change.
  - Cross-verified directly against the DB: `SELECT COUNT(*) FROM publications_locales WHERE content::text LIKE '%"type":"link"%'` returns 0; same regex check for `Ngu(o|ô)n\s*:|Source\s*:` token returns 0.
  - Conclusion: my `scripts/import-seo-content.mjs` (used for the 58 articles in F-001) produced source-free content from day one — the articles never contained `[text](url)` markdown links or trailing "Nguồn:" lines. Nothing to strip on this site.
  - Report saved at `F011-report-dryrun.json` for the audit trail.
- **Generalizable?**: yes — same audit script (with the same allowlist) applies to law.org.vn (`thuvienphapluat.vn` references expected), law.pro.vn (25 articles), and any Phase 2+ site with CMS-backed content. lawyer.id.vn uses static TypeScript data files instead of a CMS, so its version of the audit walks `src/data/insights*.ts` directly. Ship `audit-source-strip.mjs` as a template script under `shared-assets/scripts/` and a `audit-source-strip-static.mjs` variant for static-data sites. Per `SITE_BUILD_FEEDBACK.md` Issue 9.
- **PM action on sign-off**: _(PM fills)_

---

## F-012: Articles credited to Mr Hien that he didn't personally write → reattribute to a fictional author

- **Date**: 2026-05-04
- **Source**: Thach relaying Mr Hien (Phase 1 owner-review)
- **Severity**: high
- **Category**: content
- **Feedback (verbatim, translated if needed)**:
  > "All post that have Mr Hiển credit but not him personaly write should be change to other author — make a fictional one."
- **Evidence / reproduction**: This site is Mr Hien's personal brand — by default many imported SEO articles likely show Hien as the author. He only wants HIS name on content he actually authored. `seo-articles-vi.json` doesn't contain `"author"` fields (grep returned 0 hits) — so author assignment likely happens in `import-seo-content.mjs` (default = Hien) or in the Payload `users` / `authors` relation. Need to: (a) identify how many articles are currently credited to Hien, (b) get from Thach which (if any) Hien actually wrote, (c) reattribute the rest to a new fictional author.
- **Proposed fix**:
  1. **Decide fictional author identity** with Thach: name, email (fake), photo (AI-gen via image-generator-ui), short bio. Suggested default: a plausibly-named Apolo senior associate (e.g., "LS. Nguyễn Thanh Hà") or reuse "Apolo Editorial Team" (already exists on law.pro.vn — canonical "team byline" across the ecosystem)
  2. Create the author record in Payload `users` (or `authors`) collection with role `editor` and slug
  3. Bulk PATCH every article whose author == hien AND whose `name` is NOT in Thach's allowlist of "really Hien-authored" → set author = new fictional author
  4. Spot-check 3 articles on the frontend to confirm byline + author bio swapped
- **Status**: in progress (2026-05-11 — schema + author records ready; blocked on Thach for the Hien-authored allowlist)
- **Infrastructure applied** (safe to land before allowlist arrives):
  - **New collection**: `src/collections/Authors.ts` — public byline records (slug, localized `name`, localized `role`, localized `bio`, optional photo upload). Two canonical slugs in this ecosystem: `editorial-team` and `vo-thien-hien`. Separate from the auth-only `users` collection.
  - **Schema wiring**: `src/payload.config.ts` registers `Authors` in `collections`. `src/collections/Publications.ts` gains a sidebar `author` relationship → `authors`. Schema-push (dev mode) auto-created the `authors` + `authors_locales` tables and the `publications.author_id` column — verified via direct DB query.
  - **Bootstrap script**: `scripts/bootstrap-authors.mjs` — idempotent REST upsert of the two canonical authors. Ran once; results:
    - `editorial-team` (id=1) — VI: "Apolo Editorial Team" / "Đội ngũ biên tập Apolo"; EN: "Apolo Editorial Team" / "Apolo Editorial Desk". Bio explicitly notes that content is reviewed by Managing Partner Vo Thien Hien before publication (so the byline doesn't read as "anonymous AI content").
    - `vo-thien-hien` (id=2) — VI: "Luật sư Võ Thiện Hiển" / "Luật sư Điều hành"; EN: "Vo Thien Hien" / "Managing Partner". Bio mentions his 15+ years of practice, VIAC experience.
- **Still to do** (after Thach delivers the allowlist):
  1. REST PATCH every publication (58 records × 2 locales) → `author = vo-thien-hien` for the slugs in Thach's allowlist; `author = editorial-team` for all others.
  2. Update the hardcoded slug page `src/app/[locale]/bai-viet-chuyen-mon/[slug]/page.tsx`: replace the hardcoded JSON-LD `author.name = 'Vo Thien Hien'` with a per-slug lookup that respects the same allowlist (12 articles on the static slug page).
  3. Add a visible byline strip + author bio card to the article detail page that reads from the author relation.
  4. Spot-check 3 article URLs on the frontend after PATCH lands.
- **Generalizable?**: yes — exact same pattern needed on law.pro.vn (25 articles, the `editorial-team` author already exists per F-000 build state, just needs the bulk PATCH), law.org.vn (100 articles, plus needs the Authors collection added if not present), lawyer.id.vn (insights stored as static TS, edit `author` string fields directly — no DB work). The `Authors` collection schema in this commit should ship as a template under `shared-assets/templates/Authors.ts`. See `SITE_BUILD_FEEDBACK.md` Issue 10.
- **PM action on sign-off**: _(PM fills)_

---

## F-013: Use the official post-merger address word-by-word, site-wide

- **Date**: 2026-05-04
- **Source**: Thach relaying Mr Hien (Phase 1 owner-review)
- **Severity**: high
- **Category**: content (legal accuracy + brand consistency)
- **Feedback (verbatim, translated if needed)**:
  > "In all website this is the official address and make sure it true, word by word, check the file on the root directory name 'address'. Basically he is a lawyer what he want is very consistent highly professional use of words/name."
  >
  > Context: "Sát nhập cơ quan hành chính 2025" — the 2025 Vietnamese administrative merger combined provinces and replaced ~100% of administrative addresses. Old ward/district names are obsolete.
- **Evidence / reproduction**: vothienhien.com renders an address somewhere in `Footer.tsx` / `lien-he/page.tsx` / `metadata.ts` (organization JSON-LD). Current values likely use pre-2025 ward/district nomenclature (e.g., "P. Nguyễn Cư Trinh, Q. 1"). The workspace-root `address.txt` is currently empty — Thach must populate it with the official post-merger text before site-wide sweep can run.
- **Proposed fix**:
  1. Wait for Thach to fill `address.txt` (workspace root) with the official Vietnamese + English address text per Mr Hien
  2. Run word-by-word audit: grep every occurrence of "Trần Đình Xu", "Nguyễn Cư Trinh", "Q. 1", "Quận 1", "108 Trần", "HCM", "Hồ Chí Minh", "TP.HCM" across the site
  3. Replace with the canonical post-merger string from `address.txt`. ZERO formatting drift: same comma placement, same VN diacritics, same VN-format phone, same email.
  4. Touch points: `src/components/layout/Footer.tsx`, `src/app/[locale]/lien-he/page.tsx`, `src/lib/metadata.ts` (Organization schema), `messages/vi.json` + `messages/en.json` if any address strings live there
- **Status**: fixed (2026-05-11)
- **Applied in**:
  - **New SSOT module**: `src/lib/address.ts` — mirrors `address.txt` VERBATIM. Exposes `COMPANY_NAME_VN/EN`, `SHORT_NAME_VN/EN`, `MAIN_OFFICE.{vi,en}` (address + phones + EN hotline), `EAST_SAIGON_BRANCH_EN` (EN-only), `EMAIL`, `CALL_CENTER.{vi,en}`, `CALL_CENTER_E164`, `CALL_CENTER_WA`, `POSTAL_ADDRESS.{vi,en}`, `PARENT_BRAND.{vi,en}`, helper `parentBrandUrl(locale)`. All future edits go through this module — no string-literal addresses anywhere.
  - `src/lib/metadata.ts` — `generatePersonJsonLd()` now pulls postal address + telephone + email + worksFor.{name,url} + sameAs from the SSOT, all locale-aware.
  - `src/components/layout/Footer.tsx` — address, phone, email, WhatsApp link, and the ecosystem block all switched to SSOT. Ecosystem block now splits per Issue 13: VN locale renders `https://www.apolo.com.vn`, EN renders `https://www.apololawyers.com` (the two parent brands never cross-link).
  - `src/app/[locale]/lien-he/page.tsx` — Person + ContactPage JSON-LD, contact card (firm/address/phone/email/WhatsApp), and Office Location block all switched to SSOT. Added EN-only East Saigon branch block below the main HCMC office card per Mr Hien's "branch surfaced on EN only" rule. Added EN hotline rendering (`(+84) 903.600.347`) on the EN locale.
  - `src/app/[locale]/page.tsx` — home-page WebSite JSON-LD `worksFor.{name,url}` now locale-aware via SSOT.
  - `src/app/[locale]/gioi-thieu-luat-su/page.tsx` — Person JSON-LD `worksFor.{name,url}` + `sameAs` switched to SSOT.
  - `src/app/[locale]/bai-viet-chuyen-mon/[slug]/page.tsx` — Article publisher `{name,url}` switched to SSOT.
  - `src/components/home/CTASection.tsx` — WhatsApp `wa.me` link switched to SSOT.
  - `src/app/layout.tsx` — root metadata description `TP.HCM` → `TP. Hồ Chí Minh` (Mr Hien's consistency rule, even in descriptive copy).
  - `src/app/[locale]/linh-vuc-hanh-nghe/[slug]/page.tsx` — two descriptive `TP.HCM` strings → `TP. Hồ Chí Minh`.
- **Verification**:
  - Grep for all stale tokens (`Nguyễn Cư Trinh`, `Q.1`, `Quận 1`, `0913 479 179`, `913479179`, `hien.vo@apololawyers`, `wa.me/84913479179`, `https://apololawyers.com` hardcoded) returns ZERO matches in `src/`.
  - `npx tsc --noEmit` clean. `npx next build` produces 71 static pages.
  - Production-server spot-check (`npx next start -p 3001` then curl): `/vi/lien-he` renders `108 Trần Đình Xu, Phường Cầu Ông Lãnh, TP. Hồ Chí Minh` + phones `(028) 66.701.709`, `0908.043.086`; `/en/contact` renders `108 Tran Dinh Xu Street, Cau Ong Lanh Ward, Ho Chi Minh City, Vietnam` + EN hotline `(+84) 903.600.347` + the EAST SAI GON branch card; `/vi` JSON-LD links to `https://www.apolo.com.vn` (apololawyers.com NOT present on VN home — Issue 13 satisfied).
- **Generalizable?**: yes — applies to ALL 4 Phase 1 sites + every Phase 2+ site. The pattern is: each site exposes a typed `src/lib/address.ts` mirror of workspace-root `address.txt`, and every component imports from there rather than hardcoding. Encode Issue 13 (parent-brand cross-link rule) as a `parentBrandUrl(locale)` helper so it's structurally impossible to cross-link by mistake. Document in `CLAUDE_TEMPLATE.md` and `SITE_BUILD_CHECKLIST.md`.
- **PM action on sign-off**: _(PM fills)_


