/**
 * F-011 source-strip audit
 *
 * Walks every publication's Lexical content (VI + EN), strips inline
 * `type: 'link'` nodes whose host is NOT on the allowlist, and drops
 * paragraphs that start with /^(Nguồn|Source):\s/i.
 *
 * Allowlist (Mr Hien 2026-05-04 + 2026-05-11):
 *   - *.gov.vn (any subdomain)
 *   - vbpl.vn
 *   - internal Apolo ecosystem domains
 *
 * Usage:
 *   node scripts/audit-source-strip.mjs            # dry-run, prints report
 *   node scripts/audit-source-strip.mjs --apply    # actually PATCH the DB
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

// ─── Allowlist ──────────────────────────────────────────────────────────
const INTERNAL_HOSTS = new Set([
  'vothienhien.com',
  'www.vothienhien.com',
  'law.org.vn',
  'www.law.org.vn',
  'law.pro.vn',
  'www.law.pro.vn',
  'lawyer.id.vn',
  'www.lawyer.id.vn',
  'luatsutructuyen.net',
  'www.luatsutructuyen.net',
  'apolo.com.vn',
  'www.apolo.com.vn',
  'apololawyers.com',
  'www.apololawyers.com',
  'apololegal.com',
  'www.apololegal.com',
  'lawyersinvietnam.com',
  'www.lawyersinvietnam.com',
]);

function isAllowedHost(rawUrl) {
  let host;
  try {
    host = new URL(rawUrl).hostname.toLowerCase();
  } catch {
    // Relative URLs, mailto:, tel: — treat as allowed (not 3rd-party publisher refs)
    return true;
  }
  if (INTERNAL_HOSTS.has(host)) return true;
  if (host === 'vbpl.vn' || host === 'www.vbpl.vn') return true;
  // *.gov.vn allowlist — any subdomain
  if (host === 'gov.vn' || host.endsWith('.gov.vn')) return true;
  return false;
}

// ─── Lexical walker ─────────────────────────────────────────────────────
function getTextOfNode(node) {
  if (!node) return '';
  if (typeof node.text === 'string') return node.text;
  if (Array.isArray(node.children)) {
    return node.children.map(getTextOfNode).join('');
  }
  return '';
}

const SOURCE_LINE_RE = /^(Nguồn|Source)\s*:?\s+/i;
const TRAILING_SOURCE_PARAGRAPH_RE = /^(Nguồn|Source)\s*:/i;

/**
 * Walk + transform a Lexical root tree.
 * Returns { newRoot, changes: { linksStripped, paragraphsDropped, linkHosts: Map } }.
 */
function transformContent(content) {
  const changes = {
    linksStripped: 0,
    paragraphsDropped: 0,
    linkHosts: new Map(), // host -> count of strips
    keptHosts: new Map(),
  };

  if (!content || !content.root || !Array.isArray(content.root.children)) {
    return { newContent: content, changes };
  }

  function transformChildren(children) {
    const out = [];
    for (const child of children) {
      // 1. Drop paragraphs whose text starts with "Nguồn:" / "Source:"
      if (child?.type === 'paragraph') {
        const text = getTextOfNode(child).trim();
        if (TRAILING_SOURCE_PARAGRAPH_RE.test(text)) {
          changes.paragraphsDropped++;
          continue;
        }
      }

      // 2. Strip non-allowlist link nodes — keep their inline children
      if (child?.type === 'link') {
        const url = child.fields?.url || child.url || '';
        if (!isAllowedHost(url)) {
          let host = '<no-host>';
          try { host = new URL(url).hostname.toLowerCase(); } catch {}
          changes.linkHosts.set(host, (changes.linkHosts.get(host) || 0) + 1);
          changes.linksStripped++;
          // Spread the link's children up to the parent paragraph
          if (Array.isArray(child.children)) {
            for (const grand of child.children) out.push(grand);
          }
          continue;
        } else {
          let host = '';
          try { host = new URL(url).hostname.toLowerCase(); } catch {}
          if (host) changes.keptHosts.set(host, (changes.keptHosts.get(host) || 0) + 1);
        }
      }

      // 3. Recurse into containers
      if (Array.isArray(child?.children)) {
        out.push({ ...child, children: transformChildren(child.children) });
      } else {
        out.push(child);
      }
    }
    return out;
  }

  const newRootChildren = transformChildren(content.root.children);
  const newContent = {
    ...content,
    root: { ...content.root, children: newRootChildren },
  };
  return { newContent, changes };
}

// ─── REST helpers ───────────────────────────────────────────────────────
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

async function listPublicationIds(token) {
  const out = [];
  let page = 1;
  for (;;) {
    const res = await fetch(`${BASE_URL}/api/publications?limit=100&page=${page}&depth=0`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;
    for (const d of data.docs) out.push({ id: d.id, slug: d.slug });
    if (!data.hasNextPage) break;
    page++;
  }
  return out;
}

async function getPubLocale(token, id, locale) {
  const res = await fetch(`${BASE_URL}/api/publications/${id}?locale=${locale}&depth=0`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

async function patchPubLocale(token, id, locale, content) {
  const res = await fetch(`${BASE_URL}/api/publications/${id}?locale=${locale}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Main ───────────────────────────────────────────────────────────────
async function main() {
  console.log(`F-011 source-strip audit — mode: ${APPLY ? 'APPLY' : 'DRY-RUN'}`);
  const token = await login();
  console.log('✓ Logged in');

  const pubs = await listPublicationIds(token);
  console.log(`Found ${pubs.length} publications. Scanning ${pubs.length * 2} locale entries...\n`);

  const totals = { linksStripped: 0, paragraphsDropped: 0, articlesChanged: 0 };
  const allStrippedHosts = new Map();
  const allKeptHosts = new Map();
  const changedRecords = []; // for the report

  for (const { id, slug } of pubs) {
    for (const locale of ['vi', 'en']) {
      const doc = await getPubLocale(token, id, locale);
      if (!doc?.content) continue;

      const { newContent, changes } = transformContent(doc.content);

      // Tally
      for (const [h, n] of changes.linkHosts) {
        allStrippedHosts.set(h, (allStrippedHosts.get(h) || 0) + n);
      }
      for (const [h, n] of changes.keptHosts) {
        allKeptHosts.set(h, (allKeptHosts.get(h) || 0) + n);
      }

      if (changes.linksStripped > 0 || changes.paragraphsDropped > 0) {
        totals.linksStripped += changes.linksStripped;
        totals.paragraphsDropped += changes.paragraphsDropped;
        totals.articlesChanged++;
        changedRecords.push({ id, slug, locale, changes });

        if (APPLY) {
          const res = await patchPubLocale(token, id, locale, newContent);
          if (res?.errors) {
            console.log(`  ✗ PATCH failed ${locale}:${slug}`, JSON.stringify(res.errors).slice(0, 200));
          } else {
            console.log(`  ✓ ${locale}:${slug} (stripped ${changes.linksStripped} links, dropped ${changes.paragraphsDropped} source paragraphs)`);
          }
          await delay(150);
        } else {
          console.log(`  · ${locale}:${slug} → would strip ${changes.linksStripped} links, drop ${changes.paragraphsDropped} source paragraphs`);
        }
      }
    }
  }

  console.log('\n═══ Report ═══');
  console.log(`Articles flagged for change: ${totals.articlesChanged}`);
  console.log(`Links to strip:             ${totals.linksStripped}`);
  console.log(`Source paragraphs to drop:  ${totals.paragraphsDropped}`);

  if (allStrippedHosts.size > 0) {
    console.log('\nNon-allowlist hosts seen (would-strip):');
    for (const [h, n] of [...allStrippedHosts.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${h}: ${n}`);
    }
  } else {
    console.log('\nNo non-allowlist hosts found in any article body.');
  }

  if (allKeptHosts.size > 0) {
    console.log('\nAllowlist hosts kept:');
    for (const [h, n] of [...allKeptHosts.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${h}: ${n}`);
    }
  }

  if (!APPLY && totals.articlesChanged > 0) {
    console.log('\nRe-run with --apply to PATCH these changes into Payload.');
  }

  // Persist a report file for the audit trail
  const reportPath = path.join(__dirname, '..', `F011-report-${APPLY ? 'apply' : 'dryrun'}.json`);
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        mode: APPLY ? 'apply' : 'dry-run',
        timestamp: new Date().toISOString(),
        totals,
        nonAllowlistHosts: Object.fromEntries(allStrippedHosts),
        allowlistHosts: Object.fromEntries(allKeptHosts),
        changedRecords: changedRecords.map((r) => ({
          id: r.id,
          slug: r.slug,
          locale: r.locale,
          linksStripped: r.changes.linksStripped,
          paragraphsDropped: r.changes.paragraphsDropped,
          hosts: Object.fromEntries(r.changes.linkHosts),
        })),
      },
      null,
      2,
    ),
  );
  console.log(`\nReport: ${reportPath}`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
