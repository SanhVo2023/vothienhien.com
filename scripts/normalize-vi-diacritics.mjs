/**
 * Apply Vietnamese diacritic normalization (R7-R11 from 17/05/2026 review)
 * across the Publications CMS corpus.
 *
 * Rules — only the exact 5 substitutions Mr Hien requested, word-boundary
 * aware so we never corrupt correct syllables like "toàn" or "hoàn":
 *
 *   hoá → hóa     (open syllable, no closing consonant)
 *   toà → tòa     ( "                  " )
 *   hoà → hòa     ( "                  " )
 *   hòan → hoàn   (with closing consonant)
 *   tòan → toàn   ( "         " )
 *
 * Applied to every locale of every publication's `title`, `excerpt`, and
 * `content` (Lexical JSON tree).
 *
 * Usage:
 *   AUDIT_BASE_URL=http://localhost:3000 node scripts/normalize-vi-diacritics.mjs            # dry-run
 *   AUDIT_BASE_URL=http://localhost:3000 node scripts/normalize-vi-diacritics.mjs --apply    # PATCH
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

const RULES = [
  [/hoá(?!\p{L})/gu, 'hóa'],
  [/Hoá(?!\p{L})/gu, 'Hóa'],
  [/toà(?!\p{L})/gu, 'tòa'],
  [/Toà(?!\p{L})/gu, 'Tòa'],
  [/hoà(?!\p{L})/gu, 'hòa'],
  [/Hoà(?!\p{L})/gu, 'Hòa'],
  [/hòan\b/gu, 'hoàn'],
  [/Hòan\b/gu, 'Hoàn'],
  [/tòan\b/gu, 'toàn'],
  [/Tòan\b/gu, 'Toàn'],
];

function normalize(text) {
  if (typeof text !== 'string') return { text, changed: false, hits: 0 };
  let out = text;
  let hits = 0;
  for (const [pat, repl] of RULES) {
    out = out.replace(pat, (m) => {
      hits++;
      return repl;
    });
  }
  return { text: out, changed: hits > 0, hits };
}

// Walk a Lexical tree and normalize every text-node string.
function walkLexical(node, stats) {
  if (!node || typeof node !== 'object') return node;
  if (Array.isArray(node)) return node.map((n) => walkLexical(n, stats));
  const out = { ...node };
  if (typeof out.text === 'string') {
    const { text, hits } = normalize(out.text);
    if (hits > 0) {
      stats.hits += hits;
      out.text = text;
    }
  }
  if (Array.isArray(out.children)) {
    out.children = out.children.map((c) => walkLexical(c, stats));
  }
  if (out.root) {
    out.root = walkLexical(out.root, stats);
  }
  return out;
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
    const res = await fetch(
      `${BASE_URL}/api/publications?limit=100&page=${page}&depth=0&locale=${locale}&draft=true`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const data = await res.json();
    if (!data.docs?.length) break;
    for (const d of data.docs) out.push(d);
    if (!data.hasNextPage) break;
    page++;
  }
  return out;
}

async function patchPub(token, id, locale, patch) {
  const res = await fetch(`${BASE_URL}/api/publications/${id}?locale=${locale}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(patch),
  });
  return res.json();
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function processLocale(token, locale, report) {
  console.log(`\n— Locale: ${locale} —`);
  const pubs = await listPubs(token, locale);
  console.log(`  ${pubs.length} publications`);
  for (const p of pubs) {
    const patch = {};
    const stats = { hits: 0 };
    const titleR = normalize(p.title ?? '');
    if (titleR.changed) { patch.title = titleR.text; stats.hits += titleR.hits; }
    const excR = normalize(p.excerpt ?? '');
    if (excR.changed) { patch.excerpt = excR.text; stats.hits += excR.hits; }
    if (p.content) {
      const contentStats = { hits: 0 };
      const newContent = walkLexical(p.content, contentStats);
      if (contentStats.hits > 0) {
        patch.content = newContent;
        stats.hits += contentStats.hits;
      }
    }
    if (stats.hits === 0) continue;
    report.push({ locale, id: p.id, slug: p.slug, hits: stats.hits });
    if (APPLY) {
      const r = await patchPub(token, p.id, locale, patch);
      console.log(`  ${r?.doc ? '✓' : '✗'} ${p.slug} (${stats.hits} hits)`);
      await delay(120);
    } else {
      console.log(`  · ${p.slug} → would fix ${stats.hits} hits`);
    }
  }
}

async function main() {
  console.log(`normalize-vi-diacritics — mode: ${APPLY ? 'APPLY' : 'DRY-RUN'}`);
  const token = await login();
  const report = [];
  for (const locale of ['vi', 'en']) {
    await processLocale(token, locale, report);
  }
  const total = report.reduce((s, r) => s + r.hits, 0);
  console.log(`\n═══ Done — ${total} fixes across ${report.length} (locale, doc) rows ═══`);
  fs.writeFileSync(
    path.join(__dirname, '..', `F007-diacritic-report-${APPLY ? 'apply' : 'dryrun'}.json`),
    JSON.stringify({ mode: APPLY ? 'apply' : 'dry-run', timestamp: new Date().toISOString(), totalHits: total, items: report }, null, 2),
  );
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
