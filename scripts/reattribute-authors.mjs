/**
 * F-012 bulk reattribute
 *
 * Per Mr Hien (relayed 2026-05-11): every imported SEO publication is
 * authored by "Apolo Editorial Team". Mr Hien's personal byline is reserved
 * for articles he wrote himself — none in the current 58-article corpus.
 *
 * Reads an optional Hien-authored allowlist from HIEN_AUTHORED_SLUGS env
 * (comma-separated slugs); empty default = ALL articles go to editorial-team.
 *
 * Usage:
 *   AUDIT_BASE_URL=http://localhost:3000 node scripts/reattribute-authors.mjs            # dry-run
 *   AUDIT_BASE_URL=http://localhost:3000 node scripts/reattribute-authors.mjs --apply    # PATCH
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

const HIEN_ALLOWLIST = new Set(
  (process.env.HIEN_AUTHORED_SLUGS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
);

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

async function findAuthorIdBySlug(token, slug) {
  const res = await fetch(
    `${BASE_URL}/api/authors?where[slug][equals]=${encodeURIComponent(slug)}&depth=0`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const data = await res.json();
  return data?.docs?.[0]?.id ?? null;
}

async function listPubs(token) {
  const out = [];
  let page = 1;
  for (;;) {
    const res = await fetch(`${BASE_URL}/api/publications?limit=100&page=${page}&depth=0`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.docs?.length) break;
    for (const d of data.docs) out.push(d);
    if (!data.hasNextPage) break;
    page++;
  }
  return out;
}

async function patchAuthor(token, id, authorId) {
  // First try the default-locale PATCH. If validation fails because the VI
  // title is empty (EN-only article), retry with ?locale=en so validation
  // checks the EN locale (which DOES have a title).
  let res = await fetch(`${BASE_URL}/api/publications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ author: authorId }),
  });
  let data = await res.json();
  if (data?.errors?.some((e) => JSON.stringify(e).includes('Title'))) {
    res = await fetch(`${BASE_URL}/api/publications/${id}?locale=en`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ author: authorId }),
    });
    data = await res.json();
  }
  return data;
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log(`F-012 bulk reattribute — mode: ${APPLY ? 'APPLY' : 'DRY-RUN'}`);
  console.log(`Hien-authored allowlist (${HIEN_ALLOWLIST.size} slugs):`, [...HIEN_ALLOWLIST]);

  const token = await login();
  const editorialId = await findAuthorIdBySlug(token, 'editorial-team');
  const hienId = await findAuthorIdBySlug(token, 'vo-thien-hien');
  if (!editorialId || !hienId) {
    throw new Error(`Author records missing — editorial=${editorialId}, hien=${hienId}. Run scripts/bootstrap-authors.mjs first.`);
  }
  console.log(`✓ editorial-team id=${editorialId}, vo-thien-hien id=${hienId}`);

  const pubs = await listPubs(token);
  console.log(`Scanning ${pubs.length} publications…\n`);

  const plan = { toEditorial: [], toHien: [], alreadyCorrect: [] };
  for (const p of pubs) {
    const targetId = HIEN_ALLOWLIST.has(p.slug) ? hienId : editorialId;
    const targetSlug = HIEN_ALLOWLIST.has(p.slug) ? 'vo-thien-hien' : 'editorial-team';
    const currentId = typeof p.author === 'object' ? p.author?.id : p.author;
    if (currentId === targetId) {
      plan.alreadyCorrect.push(p.slug);
      continue;
    }
    if (targetSlug === 'vo-thien-hien') plan.toHien.push({ id: p.id, slug: p.slug, targetId });
    else plan.toEditorial.push({ id: p.id, slug: p.slug, targetId });
  }

  console.log(`Plan:`);
  console.log(`  → editorial-team: ${plan.toEditorial.length}`);
  console.log(`  → vo-thien-hien:  ${plan.toHien.length}`);
  console.log(`  already correct:  ${plan.alreadyCorrect.length}\n`);

  if (!APPLY) {
    console.log('Dry-run complete. Re-run with --apply to PATCH.');
    return;
  }

  let ok = 0;
  let failed = 0;
  for (const item of [...plan.toEditorial, ...plan.toHien]) {
    const res = await patchAuthor(token, item.id, item.targetId);
    if (res?.doc) {
      ok++;
      console.log(`  ✓ ${item.slug}`);
    } else {
      failed++;
      console.log(`  ✗ ${item.slug}:`, JSON.stringify(res).slice(0, 200));
    }
    await delay(120);
  }

  console.log(`\n═══ Done ═══`);
  console.log(`Patched OK: ${ok}`);
  console.log(`Failed:     ${failed}`);

  // Persist report
  fs.writeFileSync(
    path.join(__dirname, '..', `F012-report-${APPLY ? 'apply' : 'dryrun'}.json`),
    JSON.stringify(
      {
        mode: APPLY ? 'apply' : 'dry-run',
        timestamp: new Date().toISOString(),
        hienAllowlist: [...HIEN_ALLOWLIST],
        editorialId,
        hienId,
        toEditorial: plan.toEditorial.map((x) => x.slug),
        toHien: plan.toHien.map((x) => x.slug),
        alreadyCorrect: plan.alreadyCorrect,
        ok,
        failed,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
