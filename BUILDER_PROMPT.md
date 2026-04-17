# Paste this into the vothienhien.com Claude Code builder session

Copy everything inside the fence below and paste as your first message in the builder session.

---

```
Read these three files first, in order:
1. CLAUDE.md (this folder) — note the PM NOTICE block
2. ./HIEN_FEEDBACK.md — it's an empty template; you will fill it
3. ../../shared-assets/HIEN_FEEDBACK_PROTOCOL.md — format, severity, categories

Task: capture Mr Hien's feedback on the 90%-done site into HIEN_FEEDBACK.md,
before fixing anything. Do not silently fix bugs.

Interview the user (Thach) category by category. Ask them in this order:
  - Design (hero, layout, typography, colors, responsive)
  - Content (SEO articles, accuracy, completeness, tone)
  - Legal accuracy (citations, Vietnamese law specifics)
  - UX (nav, CTAs, forms)
  - Performance (LCP, INP, animation, images)
  - SEO (metadata, schema, hreflang, internal linking)
  - Copy tone (voice, formality, brand positioning, VN/EN register)
  - Bilingual (VN/EN translation, switcher, fallback)
  - Contact strategy (phone, WhatsApp, contact form — NO Zalo per CLAUDE.md)

For each thing Thach relays from Mr Hien, create a ## F-NNN section per the
protocol, including severity, category, verbatim quote where possible, and
Generalizable yes/no. Append-only — do not reorganize during the interview.

Separately, verify two known concerns:
  - Publications `content` in DB: is it Lexical JSON or markdown string?
    Run `scripts/import-seo-content.mjs --dry-run` or SELECT one article from
    publications_locales and report the format. If it's markdown, log it as an
    F-NNN item with severity=high and category=content, and reference
    ../../shared-assets/PAYLOAD_SETUP_SPEC.md §4.
  - `lexicalEditor()` in src/payload.config.ts has no features: authoring new
    richText yields limited formatting. Log as an F-NNN with severity=medium.

After the interview pass, send PM a summary of F-NNN items (IDs + one-line titles
+ severities). PM will prioritize before you start fixing.
```
