/**
 * Lexical-aware body translation helper.
 *
 * Mode 1 — extract:
 *   node scripts/translate-body.mjs extract <slug>
 *   Prints `{ "paragraphs": [<en text>, ...] }` to stdout. Each entry is the
 *   plain-text of one block-level translatable unit (paragraph, heading,
 *   quote, listitem). Order matches the Lexical root.children walk.
 *
 * Mode 2 — apply:
 *   node scripts/translate-body.mjs apply <slug> <translations.json>
 *   Reads `{ "paragraphs": [<vi text>, ...] }`. Walks the EN content
 *   tree, replaces each translatable unit's text children with a single
 *   text node carrying the next VI translation. Preserves block-level
 *   structure (paragraph/heading/quote/list), then PATCHes the VI locale.
 *
 * Inline formatting (bold/italic/links inside a paragraph) is collapsed
 * to plain text — acceptable for the SEO corpus where 95%+ of paragraphs
 * are unformatted prose. Headings stay as headings, lists stay as lists.
 */
import dns from 'dns';
import fs from 'fs';

dns.setDefaultResultOrder('ipv4first');

const BASE_URL = process.env.AUDIT_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'thachsanhoracle@gmail.com';
const ADMIN_PASSWORD = 'Vlts@860096';

const TRANSLATABLE_TYPES = new Set(['paragraph', 'heading', 'quote', 'listitem']);

function flattenText(node) {
  if (!node) return '';
  if (typeof node.text === 'string') return node.text;
  if (Array.isArray(node.children)) return node.children.map(flattenText).join('');
  return '';
}

/** Returns the array of plain-text translatable units in DOM order. */
function extractUnits(content) {
  const units = [];
  function walk(node) {
    if (!node) return;
    if (TRANSLATABLE_TYPES.has(node.type)) {
      const t = flattenText(node).trim();
      if (t) units.push(t);
      return; // do NOT recurse into children of a translatable block
    }
    if (Array.isArray(node.children)) node.children.forEach(walk);
    if (node.root) walk(node.root);
  }
  walk(content);
  return units;
}

/** In-place rewrite: replace text children of each translatable unit with one VI text node. */
function applyTranslations(content, translations) {
  let i = 0;
  function walk(node) {
    if (!node) return;
    if (TRANSLATABLE_TYPES.has(node.type)) {
      if (i < translations.length) {
        node.children = [
          { type: 'text', text: translations[i], detail: 0, format: 0, mode: 'normal', style: '', version: 1 },
        ];
        i++;
      }
      return;
    }
    if (Array.isArray(node.children)) node.children.forEach(walk);
    if (node.root) walk(node.root);
  }
  walk(content);
  return i;
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

async function fetchEn(slug) {
  const res = await fetch(
    `${BASE_URL}/api/publications?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0&locale=en`,
  );
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const doc = (await res.json())?.docs?.[0];
  if (!doc) throw new Error(`slug not found: ${slug}`);
  return doc;
}

async function patchVi(token, id, content) {
  const res = await fetch(`${BASE_URL}/api/publications/${id}?locale=vi`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

async function main() {
  const [, , mode, slug, jsonFile] = process.argv;
  if (mode === 'extract') {
    if (!slug) throw new Error('usage: extract <slug>');
    const doc = await fetchEn(slug);
    const units = extractUnits(doc.content);
    process.stdout.write(JSON.stringify({ slug, id: doc.id, paragraphs: units }, null, 2));
    return;
  }
  if (mode === 'apply') {
    if (!slug || !jsonFile) throw new Error('usage: apply <slug> <translations.json>');
    const payload = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    const translations = payload.paragraphs;
    if (!Array.isArray(translations)) throw new Error('translations.json must have a "paragraphs" array');
    const doc = await fetchEn(slug);
    const units = extractUnits(doc.content);
    if (translations.length !== units.length) {
      console.error(`[warn] expected ${units.length} translations, got ${translations.length} — applying what fits`);
    }
    const replaced = applyTranslations(doc.content, translations);
    const token = await login();
    const r = await patchVi(token, doc.id, doc.content);
    if (r?.doc) {
      console.log(`✓ ${slug} — ${replaced} units replaced, PATCH ok`);
    } else {
      console.error(`✗ ${slug} — PATCH failed: ${JSON.stringify(r).slice(0, 300)}`);
      process.exit(1);
    }
    return;
  }
  console.error('usage: translate-body.mjs <extract|apply> <slug> [translations.json]');
  process.exit(1);
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
