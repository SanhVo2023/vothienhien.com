/**
 * R22 — multi-pass publications quality check.
 *
 * Per 17/05/2026 client review: cross-check every publication for
 * VN↔EN title alignment, body↔featured-image presence, excerpt presence,
 * author attribution, content depth, and diacritic residuals. Auto-PATCHes
 * the unambiguous issues; flags judgment calls into F022-report.json for
 * Mr Hien.
 *
 * Auto-fixes (with --apply):
 *   - Empty `excerpt` on either locale → derive from the first ~220 chars
 *     of the locale's Lexical content (first paragraph text).
 *
 * Audit-only flags (reported, never auto-fixed):
 *   - Missing featuredImage
 *   - Missing author (should be `editorial-team` per F-012)
 *   - VN title without EN translation (or vice versa)
 *   - Suspicious content length (< 500 words)
 *   - Any remaining old-form diacritics (sanity backstop after R7-R11)
 *
 * Usage:
 *   AUDIT_BASE_URL=http://localhost:3000 node scripts/publications-quality-audit.mjs            # dry-run + report
 *   AUDIT_BASE_URL=http://localhost:3000 node scripts/publications-quality-audit.mjs --apply    # PATCH excerpts
 */
import dns from 'dns';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dns.setDefaultResultOrder('ipv4first');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = process.env.AUDIT_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'thachsanhoracle@gmail.com';
const ADMIN_PASSWORD = 'Vlts@860096';
const APPLY = process.argv.includes('--apply');

// Backstop diacritic check — should already be clean post R7-R11.
const OLD_DIACRITICS = /\b(hoá|toà|hoà|hòan|tòan|Hoá|Toà|Hoà|Hòan|Tòan)\b/g;

function flattenLexicalText(node, acc = []) {
  if (!node || typeof node !== 'object') return acc;
  if (typeof node.text === 'string') acc.push(node.text);
  if (Array.isArray(node.children)) node.children.forEach((c) => flattenLexicalText(c, acc));
  if (node.root) flattenLexicalText(node.root, acc);
  return acc;
}

function deriveExcerpt(content, maxLen = 220) {
  const text = flattenLexicalText(content).join(' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLen) return text;
  // Cut at the nearest sentence boundary before maxLen so we don't strand a half-word.
  const cut = text.slice(0, maxLen);
  const lastPeriod = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  return (lastPeriod > maxLen * 0.6 ? cut.slice(0, lastPeriod + 1) : cut.replace(/\s+\S*$/, '')) + '…';
}

function wordCount(content) {
  return flattenLexicalText(content).join(' ').split(/\s+/).filter(Boolean).length;
}

async function login() {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const data = await res.json();
  if (!data.token) throw new Error('Login failed: ' + JSON.stringify(data));
  return data.token;
}

async function listPubs(token, locale) {
  const out = [];
  let page = 1;
  for (;;) {
    const res = await fetch(`${BASE_URL}/api/publications?limit=100&page=${page}&depth=0&locale=${locale}&draft=true`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.docs?.length) break;
    out.push(...data.docs);
    if (!data.hasNextPage) break;
    page++;
  }
  return out;
}

async function patchLocale(token, id, locale, patch) {
  const res = await fetch(`${BASE_URL}/api/publications/${id}?locale=${locale}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(patch),
  });
  return res.json();
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log(`publications-quality-audit — mode: ${APPLY ? 'APPLY' : 'DRY-RUN'}`);
  const token = await login();

  const vi = await listPubs(token, 'vi');
  const en = await listPubs(token, 'en');
  console.log(`  VI rows: ${vi.length}    EN rows: ${en.length}`);

  // Index EN by id for cross-reference.
  const enById = new Map(en.map((d) => [d.id, d]));

  const report = {
    timestamp: new Date().toISOString(),
    mode: APPLY ? 'apply' : 'dry-run',
    totals: { vi: vi.length, en: en.length },
    autoFixed: [],
    manualReview: [],
  };

  let patched = 0;
  for (const p of vi) {
    const enRow = enById.get(p.id);
    const issues = [];

    if (!p.featuredImage) issues.push('missing-featuredImage');
    if (!p.author) issues.push('missing-author');
    if (!p.title || !p.title.trim()) issues.push('vi-title-empty');
    if (enRow && (!enRow.title || !enRow.title.trim())) issues.push('en-title-empty');
    if (p.content && wordCount(p.content) < 500) issues.push(`vi-short-content(${wordCount(p.content)}w)`);
    if (enRow?.content && wordCount(enRow.content) < 500) issues.push(`en-short-content(${wordCount(enRow.content)}w)`);

    const viText = flattenLexicalText(p.content).join(' ');
    const enText = enRow ? flattenLexicalText(enRow.content).join(' ') : '';
    if (OLD_DIACRITICS.test(viText)) { issues.push('vi-old-diacritics'); OLD_DIACRITICS.lastIndex = 0; }
    if (OLD_DIACRITICS.test(enText)) { issues.push('en-old-diacritics'); OLD_DIACRITICS.lastIndex = 0; }

    // Auto-fix: derive missing excerpts from content.
    const fixes = [];
    if (!p.excerpt || !p.excerpt.trim()) {
      if (p.content) {
        const ex = deriveExcerpt(p.content);
        if (ex.length > 20) {
          fixes.push({ locale: 'vi', field: 'excerpt', value: ex });
        } else {
          issues.push('vi-excerpt-cannot-derive');
        }
      } else {
        issues.push('vi-excerpt-missing-no-content');
      }
    }
    if (enRow && (!enRow.excerpt || !enRow.excerpt.trim())) {
      if (enRow.content) {
        const ex = deriveExcerpt(enRow.content);
        if (ex.length > 20) {
          fixes.push({ locale: 'en', field: 'excerpt', value: ex });
        } else {
          issues.push('en-excerpt-cannot-derive');
        }
      } else {
        issues.push('en-excerpt-missing-no-content');
      }
    }

    if (fixes.length > 0) {
      if (APPLY) {
        for (const f of fixes) {
          const r = await patchLocale(token, p.id, f.locale, { [f.field]: f.value });
          if (r?.doc) {
            patched++;
            console.log(`  ✓ ${p.slug} → ${f.locale}.${f.field} derived (${f.value.length} chars)`);
          } else {
            console.log(`  ✗ ${p.slug} → ${f.locale}.${f.field}: ${JSON.stringify(r).slice(0, 160)}`);
          }
          await delay(120);
        }
      }
      report.autoFixed.push({ id: p.id, slug: p.slug, fixes: fixes.map((f) => `${f.locale}.${f.field}`) });
    }

    if (issues.length > 0) {
      report.manualReview.push({ id: p.id, slug: p.slug, issues });
    }
  }

  console.log(`\n═══ Done ═══`);
  console.log(`  auto-fixable rows: ${report.autoFixed.length}`);
  console.log(`  rows needing manual review: ${report.manualReview.length}`);
  console.log(`  PATCH writes applied: ${APPLY ? patched : 0}`);

  fs.writeFileSync(
    path.join(__dirname, '..', `F022-report-${APPLY ? 'apply' : 'dryrun'}.json`),
    JSON.stringify(report, null, 2),
  );
  console.log(`Report written: F022-report-${APPLY ? 'apply' : 'dryrun'}.json`);
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
