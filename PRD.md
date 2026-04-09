# PRD: vothienhien.com -- Managing Partner Personal Authority Site

**Document Version**: 1.0
**Created**: 2026-04-03
**Project Owner**: Apolo Lawyers (CONG TY LUAT APOLO LAWYERS)
**Managing Partner**: Luat su Vo Thien Hien (Henry Vo)
**Status**: Phase 1

---

## 1. Project Overview

| Field | Detail |
|---|---|
| **Domain** | vothienhien.com |
| **Role in Ecosystem** | Personal Authority -- Managing Partner brand site |
| **Language** | Bilingual: Vietnamese + English |
| **Target Audience** | High-value prospective clients, international clients, corporate executives, foreign nationals needing legal representation in Vietnam, media/press, potential referral partners |
| **Core Function** | Personal brand site for Luat su Vo Thien Hien (Henry Vo). Professional profile, practice focus, representative matters, publications, speaking engagements, credentials, and direct contact for high-value engagements. |
| **CMS** | Independent PayloadCMS v3 instance |
| **Database** | Supabase PostgreSQL |
| **Tech Stack** | Next.js 15 (App Router) + PayloadCMS v3 + Supabase PostgreSQL + Tailwind CSS v4 + GSAP + Framer Motion |
| **Content Target** | 100 SEO-optimized content pages |

### Strategic Purpose

vothienhien.com is the personal trust engine for the firm's managing partner. In Vietnam's legal market, clients hire lawyers -- not firms. This site:

1. Builds personal authority and trust for Luat su Vo Thien Hien / Henry Vo
2. Captures high-value international and domestic clients searching for a specific, reputable lawyer
3. Serves as a credibility proof point when shared in business development contexts
4. Links authority to apololawyers.com, lawyersinvietnam.com, and apololegal.com

---

## 2. Design Direction

### Visual Identity: "Executive Luxury Portfolio"

The design should feel like stepping into the office of a distinguished, internationally-minded Vietnamese lawyer. Think **Tom Ford brand site meets top-tier management consultant portfolio meets luxury hotel website** -- restrained elegance, commanding presence, and meticulous attention to detail. Every pixel should whisper success and trustworthiness.

### Color Palette

| Role | Color | Hex |
|---|---|---|
| Primary | Rich Black | #0A0A0A |
| Secondary | Deep Charcoal | #1A1A1A |
| Accent | Muted Gold | #C5A55A |
| Accent Secondary | Warm Brass | #B8924C |
| Background | Pure White | #FFFFFF |
| Surface | Warm Off-White | #FAFAF8 |
| Text Primary | Near-Black | #111111 |
| Text Secondary | Sophisticated Gray | #666666 |
| Border | Subtle Gold Line | #E5D5B0 |

### Typography

- **Name/Logo**: Custom lettering or Didot -- high-fashion authority
- **Headings**: Playfair Display or Cormorant -- elegant serif with presence
- **Body**: Inter or DM Sans -- clean, modern, international readability
- **Accent text**: Cormorant Garamond Italic -- for quotes, testimonial excerpts
- **Numbers/Stats**: Tabular figures in Inter -- for experience stats and case numbers

### Mood & Tone

- Premium, exclusive, aspirational
- Confident but never boastful
- Personal warmth balanced with professional gravitas
- International sophistication -- reads equally well to Vietnamese executives and foreign business leaders
- Sparse content with high impact -- quality over quantity on every page

### Key Design Elements

- **Full-viewport hero** with professional portrait, name in elegant typography, and single-line descriptor
- **Generous white space** -- 40%+ of viewport should be breathing room
- **Gold accent lines** as section dividers (thin, precise)
- **Large-scale professional photography** -- hero shots, environmental portraits
- **Stat counters** with elegant animations: years of experience, cases handled, jurisdictions
- **Testimonial carousel** with attribution (if approved by clients)
- **Timeline/milestone section** for career progression
- **Publication cards** with cover images and excerpts
- **"Currently accepting new matters"** -- subtle availability indicator
- **Parallax sections** -- slow, deliberate, luxurious scroll experience
- **No clutter** -- maximum 3-4 elements visible at any scroll position

### Animations

- GSAP: Hero text reveal (letter-by-letter or word-by-word), parallax scrolling on hero portrait, gold line drawing animations on section transitions, stat counter animations (count up from 0)
- Framer Motion: Page transitions with elegant fade/slide, card hover effects with subtle lift and shadow, navigation menu reveal, image zoom on scroll
- Scroll-triggered animations should feel slow and deliberate -- no quick snaps
- Loading screen: minimal, elegant spinner or name reveal

### Reference Sites

- mckinsey.com/our-people -- executive profile design
- tomford.com -- luxury brand restraint
- frfrancis.com -- personal brand lawyer site (if exists, use concept)
- carlicklin.com -- premium portfolio design patterns
- marriott.com/edition-hotels -- luxury hospitality restraint and elegance
- apple.com (product pages) -- masterful use of white space and scroll animations

---

## 3. Sitemap & Page Structure

### Vietnamese Routes (/vi/)

| URL | Page | Purpose |
|---|---|---|
| `/vi/` | Trang chu | Homepage: hero portrait, brief intro, key stats, practice areas preview, featured publications |
| `/vi/gioi-thieu-luat-su` | Gioi thieu Luat su | Full professional biography, education, credentials, career timeline |
| `/vi/linh-vuc-hanh-nghe` | Linh vuc hanh nghe | Practice areas overview with descriptions |
| `/vi/linh-vuc-hanh-nghe/tranh-chap-dan-su` | Tranh chap dan su | Civil disputes practice area detail |
| `/vi/linh-vuc-hanh-nghe/tranh-chap-dat-dai` | Tranh chap dat dai | Land disputes detail |
| `/vi/linh-vuc-hanh-nghe/hon-nhan-gia-dinh` | Hon nhan gia dinh | Family law / divorce detail |
| `/vi/linh-vuc-hanh-nghe/luat-doanh-nghiep` | Luat doanh nghiep | Corporate law detail |
| `/vi/linh-vuc-hanh-nghe/tranh-chap-lao-dong` | Tranh chap lao dong | Labor disputes detail |
| `/vi/linh-vuc-hanh-nghe/luat-hinh-su` | Luat hinh su | Criminal law detail |
| `/vi/vu-viec-tieu-bieu` | Vu viec tieu bieu | Representative matters overview |
| `/vi/vu-viec-tieu-bieu/[slug]` | Chi tiet vu viec | Individual case studies (anonymized) |
| `/vi/bai-viet-chuyen-mon` | Bai viet chuyen mon | Professional publications hub |
| `/vi/bai-viet-chuyen-mon/[slug]` | Bai viet chi tiet | Individual publication/article |
| `/vi/quan-diem-nghe-luat` | Quan diem nghe luat | Professional perspectives/opinions hub |
| `/vi/quan-diem-nghe-luat/[slug]` | Quan diem chi tiet | Individual perspective piece |
| `/vi/lien-he` | Lien he | Contact page with form |

### English Routes (/en/)

| URL | Page | Purpose |
|---|---|---|
| `/en/` | Home | English homepage |
| `/en/lawyer-profile` | Lawyer Profile | Full English biography |
| `/en/practice-areas` | Practice Areas | Practice areas overview |
| `/en/practice-areas/civil-disputes` | Civil Disputes | Detail |
| `/en/practice-areas/land-disputes` | Land Disputes | Detail |
| `/en/practice-areas/family-law` | Family Law & Divorce | Detail -- key for "foreign divorce lawyer Vietnam" |
| `/en/practice-areas/corporate-law` | Corporate Law | Detail |
| `/en/practice-areas/labor-disputes` | Labor Disputes | Detail |
| `/en/practice-areas/criminal-defense` | Criminal Defense | Detail |
| `/en/representative-experience` | Representative Experience | Matters overview |
| `/en/representative-experience/[slug]` | Case Detail | Individual case studies |
| `/en/legal-insights` | Legal Insights | Publications hub |
| `/en/legal-insights/[slug]` | Article | Individual publication |
| `/en/professional-perspective` | Professional Perspective | Perspectives hub |
| `/en/professional-perspective/[slug]` | Perspective | Individual perspective |
| `/en/contact` | Contact | Contact page |

### Utility Pages

| URL | Purpose |
|---|---|
| `/sitemap.xml` | SEO sitemap |
| `/robots.txt` | Crawl rules |

---

## 4. SEO Strategy

### Primary Keywords

| Keyword | Language | Search Intent | Target Page |
|---|---|---|---|
| Vo Thien Hien luat su | VI | Navigational | /vi/ |
| Henry Vo lawyer Vietnam | EN | Navigational | /en/ |
| luat su tranh chap dan su TPHCM | VI | Commercial | /vi/linh-vuc-hanh-nghe/tranh-chap-dan-su |
| Vietnam dispute lawyer | EN | Commercial | /en/practice-areas/civil-disputes |
| luat su ly hon nguoi nuoc ngoai | VI | Commercial | /vi/linh-vuc-hanh-nghe/hon-nhan-gia-dinh |
| foreign divorce lawyer Vietnam | EN | Commercial | /en/practice-areas/family-law |
| luat su dat dai Sai Gon | VI | Commercial | /vi/linh-vuc-hanh-nghe/tranh-chap-dat-dai |
| land dispute lawyer Ho Chi Minh City | EN | Commercial | /en/practice-areas/land-disputes |

### Secondary Keywords

- luat su gioi tai TPHCM / best lawyer in Ho Chi Minh City
- luat su tranh tung gioi / top litigation lawyer Vietnam
- luat su tu van doanh nghiep / corporate legal counsel Vietnam
- international lawyer Ho Chi Minh City
- Vietnam litigation expert
- cross-border divorce Vietnam
- luat su bao chua hinh su / criminal defense lawyer Vietnam
- luat su lao dong / employment lawyer Vietnam

### Schema.org Markup

| Page Type | Schema Types |
|---|---|
| Homepage | WebSite, Person (attorney), Attorney |
| Profile page | Person, Attorney, ProfilePage |
| Practice area pages | Service, LegalService, BreadcrumbList |
| Case studies | Article, CreativeWork |
| Publications | Article, ScholarlyArticle, Person (author) |
| Contact page | ContactPage, Person, PostalAddress |
| All pages | BreadcrumbList, Person |

### Local SEO

- Google Business Profile optimization (linked from site)
- Local business schema with office addresses
- NAP consistency across all ecosystem sites
- Target "luat su + [location]" keywords

---

## 5. Content Plan for 100 SEO Pages

### Content Distribution

| Category | Vietnamese | English | Total |
|---|---|---|---|
| Profile & Bio (evergreen) | 2 | 2 | 4 |
| Practice Areas | 7 | 7 | 14 |
| Representative Matters | 8 | 8 | 16 |
| Professional Publications | 14 | 14 | 28 |
| Professional Perspectives | 10 | 10 | 20 |
| Hub/Index pages | 4 | 4 | 8 |
| Contact & Utility | 5 | 5 | 10 |
| **Total** | **50** | **50** | **100** |

### Practice Areas (14 pages)

1. Tranh chap dan su tong quat / Civil Dispute Resolution Overview
2. Tranh chap hop dong thuong mai / Commercial Contract Disputes
3. Tranh chap dat dai va bat dong san / Land and Real Estate Disputes
4. Ly hon co yeu to nuoc ngoai / International Divorce and Family Law
5. Tranh chap lao dong / Labor and Employment Disputes
6. Tu van phap luat doanh nghiep / Corporate Legal Advisory
7. Bao chua hinh su / Criminal Defense
(x2 for Vietnamese and English = 14 pages)

### Representative Matters (16 pages -- anonymized case studies)

8. Vu tranh chap hop dong 50 ty / Major Commercial Contract Dispute
9. Vu ly hon quoc te phuc tap / Complex International Divorce Case
10. Dai dien tranh chap dat dai tai Quan 2 / Land Dispute Representation in Thu Duc
11. Tu van M&A cho doanh nghiep FDI / M&A Advisory for Foreign-Invested Enterprise
12. Bao chua thanh cong vu an hinh su / Successful Criminal Defense
13. Giai quyet tranh chap lao dong tap the / Collective Labor Dispute Resolution
14. Dai dien tranh chap xay dung / Construction Dispute Representation
15. Vu tranh chap thua ke co yeu to nuoc ngoai / Cross-Border Inheritance Dispute
(x2 for Vietnamese and English = 16 pages)

### Professional Publications (28 pages)

16-29. Articles on legal topics within practice areas -- each a 1,500-2,500 word analysis piece showing expertise. Topics include:
- Xu huong giai quyet tranh chap dat dai 2026
- Practical Guide to Foreign Divorce in Vietnam
- Understanding Vietnam's New Land Law: Key Changes
- How Foreign Investors Can Protect Their Rights in Vietnam
- Navigating Labor Disputes as a Foreign Employer in Vietnam
- Vietnam Civil Procedure: What International Clients Need to Know
- Luat su va ban an: nhin tu goc do nguoi hanh nghe
- And 7 additional publication topics per language

### Professional Perspectives (20 pages)

30-39. Opinion and thought leadership pieces:
- Nghe luat su tai Viet Nam: tu goc nhin cua toi / The Legal Profession: A Personal Perspective
- Tai sao toi chon nghe luat / Why I Chose the Legal Profession
- Lam viec voi khach hang quoc te / Working with International Clients
- Dao duc nghe nghiep trong thuc tien / Professional Ethics in Practice
- Tuong lai nghe luat tai Viet Nam / The Future of Law Practice in Vietnam
(x2 for Vietnamese and English = 20 pages)

### Content Types

- **Profile & Bio**: Comprehensive narrative biography (2,000-3,000 words)
- **Practice Area Descriptions**: Detailed scope with approach philosophy (1,500-2,500 words)
- **Case Studies**: Anonymized narrative with challenge/approach/outcome structure (1,000-2,000 words)
- **Publications**: Expert analysis articles (1,500-2,500 words)
- **Perspective Pieces**: Personal voice thought leadership (1,000-2,000 words)

---

## 6. Contact Strategy

### Approach: Moderate / Premium

Contact should feel like requesting a meeting with a senior executive -- accessible but appropriately gated.

| Element | Included | Notes |
|---|---|---|
| Footer contact info | Yes | Office address, email, phone |
| Contact page form | Yes | Name, email, phone, matter type, brief description |
| Phone number (optional) | Yes | Displayed on contact page, not in header |
| WhatsApp | Yes | International clients prefer WhatsApp -- button on contact page |
| Floating CTA button | No | Breaks premium aesthetic |
| Zalo widget | No | Per specification |
| Email link | Yes | Direct email link on contact page |
| "Schedule a consultation" CTA | Yes | Subtle button on practice area pages, links to contact page |

### Contact Page Design

- Clean, spacious layout
- Professional portrait alongside contact form
- Office address with embedded map
- "Response within 24 business hours" commitment
- Language preference selector on form (Vietnamese / English)
- Matter type dropdown: Civil Disputes, Land Disputes, Family Law, Corporate, Criminal, Other

### Contact Information Displayed

```
Luat su Vo Thien Hien (Henry Vo)
Managing Partner, Apolo Lawyers

Head Office: 108 Tran Dinh Xu, Phuong Nguyen Cu Trinh, Quan 1, TP.HCM
Branch: K&M Tower, 33 Ung Van Khiem, Phuong 25, Quan Binh Thanh, TP.HCM
Phone: 0903 419 479
Email: contact@apolo.com.vn
WhatsApp: +84 903 419 479
```

---

## 7. CMS Collections (PayloadCMS v3)

### Collections

| Collection | Purpose | Key Fields |
|---|---|---|
| `pages` | Static pages (homepage, profile, contact) | title, slug, language, content (rich text), seo, heroImage, layout (flexible blocks) |
| `practice-areas` | Practice area descriptions | title_vi, title_en, slug, description_vi, description_en, icon, featuredImage, keyStats, relatedMatters, seo |
| `representative-matters` | Case studies | title_vi, title_en, slug, practiceArea (relation), challenge, approach, outcome, year, anonymized (boolean), seo |
| `publications` | Professional articles | title, slug, language, content (rich text), excerpt, publishedDate, category, practiceArea (relation), seo, featuredImage |
| `perspectives` | Thought leadership pieces | title, slug, language, content (rich text), excerpt, publishedDate, seo, featuredImage |
| `credentials` | Education, certifications, memberships | type (education/certification/membership), title_vi, title_en, institution, year, description |
| `timeline-events` | Career milestones | year, title_vi, title_en, description_vi, description_en, type (career/achievement/speaking) |
| `media` | Images and files | file, alt_text_vi, alt_text_en, caption |
| `contact-submissions` | Form submissions | name, email, phone, matterType, message, language, submittedAt, status |

### Globals

| Global | Purpose |
|---|---|
| `site-settings` | Site config, default SEO, analytics, availability status |
| `profile` | Core profile data: name, titles, tagline, key stats (years, cases, etc.) |
| `footer` | Footer content, ecosystem links |
| `header` | Navigation, language switcher |

---

## 8. AI Image Asset List (Nano Banana 2)

### Hero & Portrait Images

| ID | Prompt | Usage | Size |
|---|---|---|---|
| IMG-001 | "Professional male Vietnamese lawyer in premium dark suit, standing confidently in modern high-rise office, floor-to-ceiling windows with Ho Chi Minh City skyline, golden hour light, shallow depth of field, executive portrait style, 35mm lens feel" | Homepage hero (placeholder -- real photo preferred) | 1920x1200 |
| IMG-002 | "Same lawyer seated at premium dark wood executive desk, legal books and documents visible, warm desk lamp lighting, thoughtful expression, environmental portrait, luxury office setting" | Profile page hero | 1600x1000 |
| IMG-003 | "Close-up of lawyer's hands in premium suit cuffs reviewing a legal document with gold pen, marble desk surface, shallow depth of field, detail shot, luxury feel" | Detail/accent image | 1200x800 |

### Practice Area Images

| ID | Prompt | Usage | Size |
|---|---|---|---|
| IMG-004 | "Abstract representation of civil justice, modern minimalist, intertwined gold lines forming scales on black background, luxury brand aesthetic" | Civil Disputes practice area | 1200x800 |
| IMG-005 | "Aerial view of Ho Chi Minh City real estate development, modern buildings, golden hour, clean professional photography, warm tones" | Land Disputes practice area | 1200x800 |
| IMG-006 | "Elegant close-up of two wedding rings on a legal document, soft warm lighting, shallow depth of field, emotional yet professional tone, gold and white" | Family Law practice area | 1200x800 |
| IMG-007 | "Modern corporate boardroom in Ho Chi Minh City, long glass table, leather chairs, city view, no people, premium corporate atmosphere" | Corporate Law practice area | 1200x800 |
| IMG-008 | "Abstract minimalist composition of a handshake silhouette formed by gold lines on dark background, professional and warm" | Labor Disputes practice area | 1200x800 |
| IMG-009 | "Dramatic courthouse columns and entrance, looking upward, black and white with gold accent lighting, imposing justice" | Criminal Defense practice area | 1200x800 |

### Atmosphere & Background Images

| ID | Prompt | Usage | Size |
|---|---|---|---|
| IMG-010 | "Premium law office library, dark wood shelves floor to ceiling, leather-bound books, rolling ladder, warm ambient lighting, no people, luxurious scholarly atmosphere" | Publications section background | 1920x1080 |
| IMG-011 | "Ho Chi Minh City skyline at twilight, golden lights reflecting on Saigon River, panoramic view, premium cityscape photography" | Contact page / Footer background | 1920x600 |
| IMG-012 | "Abstract gold brushstroke on pure black background, single elegant stroke, Japanese calligraphy inspiration, luxury brand element" | Decorative accent | 800x400 |
| IMG-013 | "Dark marble texture with subtle gold veining, seamless pattern, luxury surface, suitable as section background" | Background texture | 1920x1080 |
| IMG-014 | "Professional conference or speaking event stage, podium with microphone, warm spotlight, audience in soft bokeh, prestigious atmosphere" | Speaking/Events section | 1200x800 |
| IMG-015 | "Aerial view of District 1 Ho Chi Minh City including Bitexco Tower and Notre Dame Cathedral, clear day, warm tones, establishing shot" | Location/About section | 1600x900 |

**Note**: IMG-001 and IMG-002 are placeholders. Real professional photographs of Luat su Vo Thien Hien should replace these. Nano Banana 2 generates the initial layout comps; final site uses actual photography.

---

## 9. Internal Linking Strategy

### Outbound Links (vothienhien.com links TO)

| Target Site | Link Context | Link Type |
|---|---|---|
| **apololawyers.com** | "Visit Apolo Lawyers" -- firm site link from profile and footer | Footer, profile page |
| **lawyersinvietnam.com** | "International client services" link from EN pages | Contextual in practice areas |
| **apololegal.com** | "Corporate legal services" link from corporate law page | Contextual |

### Inbound Links (sites linking TO vothienhien.com)

| Source Site | Link Context |
|---|---|
| **lawyer.id.vn** | "Full profile" links, "Managing Partner" references |
| **i-lawyers.net** | International lawyer directory linking to profile |

### Internal Cross-Linking Rules

1. Every practice area page links to related representative matters
2. Every representative matter links back to its practice area
3. Publications link to related practice areas and matters
4. Profile page links to all practice area pages
5. Contact page is linked from every practice area and matter page (subtle CTA)
6. Homepage features latest 3 publications with links
7. Vietnamese and English pages cross-link via hreflang and visible language toggle

---

## 10. Conversion Funnel

### Primary Conversion: Visitor to High-Value Consultation Request

```
Stage 1: Discovery
  High-value prospect searches "luat su ly hon quoc te TPHCM"
  or referral partner shares vothienhien.com link
  --> Lands on homepage or practice area page

Stage 2: Impression
  --> Sees premium design, professional portrait, key stats
  --> Immediately perceives credibility and success
  --> Reads practice area relevant to their need (2-3 minutes)

Stage 3: Validation
  --> Reviews representative matters for similar cases
  --> Reads professional profile, credentials, career timeline
  --> Checks publications for expertise depth
  --> Total engagement: 5-10 minutes across 3-5 pages

Stage 4: Contact
  --> Clicks "Schedule a Consultation" or "Contact"
  --> Fills contact form OR clicks WhatsApp (international clients)
  --> Receives response within 24 hours
```

### Conversion Optimization Elements

| Element | Location | Purpose |
|---|---|---|
| Key stats (years, cases) | Homepage, above fold | Immediate credibility |
| Practice area CTAs | Each practice area page | "Discuss your matter" link to contact |
| Representative matters | Proof of capability | Builds confidence in outcome |
| Professional portrait | Homepage hero, profile | Human connection and trust |
| Credentials section | Profile page | Academic and professional authority |
| WhatsApp button | Contact page | Low-friction contact for international clients |
| Language toggle | All pages | Accessibility for international visitors |

### KPIs

| Metric | Target (12 months) |
|---|---|
| Monthly organic sessions | 2,000+ |
| Contact form submissions | 15+ per month |
| WhatsApp inquiries | 10+ per month |
| Average pages per session | 3.5+ |
| Average session duration | 4+ minutes |
| Bounce rate | < 45% |
| Referral traffic to apololawyers.com | 100+ monthly |

### Lead Quality Indicators

- Matters valued at 50M+ VND (high-value civil disputes)
- International clients (foreign divorce, cross-border disputes)
- Corporate clients (FDI, M&A advisory)
- Track lead-to-client conversion rate: target 20%+

---

## Appendix: Technical Notes

### Hero Section Implementation

- Full-viewport hero with professional portrait
- GSAP text reveal animation for name and title
- Parallax scroll effect on hero image
- Responsive: stacks vertically on mobile with adjusted portrait crop

### Image Strategy

- Professional photography session required (separate from Nano Banana 2)
- Environmental portraits: office, courtroom, conference
- Minimum 10 professional photos for site launch
- Nano Banana 2 for all non-portrait imagery (practice areas, backgrounds, decorative)

### Contact Form Security

- reCAPTCHA v3 (invisible) to prevent spam
- Rate limiting: max 5 submissions per IP per hour
- Email notification to designated address on submission
- Auto-response email to submitter confirming receipt

### Performance Targets

- Lighthouse Performance: 95+
- Lighthouse Accessibility: 100
- Core Web Vitals: All green
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s (critical for hero image)
- Hero image: WebP/AVIF with blur placeholder, priority loading
