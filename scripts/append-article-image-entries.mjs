/**
 * Build image-generator-ui manifest entries for every Publication so the
 * batch UI can produce featured images for the 58-article corpus (F022
 * blocker: all articles currently lack a `featuredImage`).
 *
 * Approach:
 *   1. Read both VI and EN locales of every publication via Payload REST.
 *   2. For each article, synthesize an image prompt rooted in the most
 *      descriptive title (EN if present, VI otherwise), the excerpt, and
 *      a "professional editorial law-firm photography" stylistic spine.
 *   3. Skip articles whose `id` (article-{slug}) is already in
 *      image-assets.json — idempotent re-runs are safe.
 *   4. Append the new entries with `category: "blog"`, `aspect: "16:9"`,
 *      `width: 1200`, `style: "editorial"`, `status: "pending"`.
 *   5. Print the manifest delta — operator opens
 *      tools/image-generator-ui /batch, picks vothienhien.com, and runs
 *      Test → Approve → Generate → Upload through the existing pipeline.
 *
 * Usage:
 *   AUDIT_BASE_URL=http://localhost:3000 node scripts/append-article-image-entries.mjs            # dry-run
 *   AUDIT_BASE_URL=http://localhost:3000 node scripts/append-article-image-entries.mjs --apply    # mutate manifest
 */
import dns from 'dns';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dns.setDefaultResultOrder('ipv4first');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST = path.join(__dirname, '..', 'image-assets.json');

const BASE_URL = process.env.AUDIT_BASE_URL || 'http://localhost:3000';
const APPLY = process.argv.includes('--apply');

// Topical buckets keyed off slug substrings — lets the prompt prefer
// scene categories the existing visual library is already tuned for
// (mirrors the `slugImageMap` heuristic in bai-viet-chuyen-mon/[slug]/page.tsx).
const TOPIC_HINTS = [
  { match: /land|dat-dai|real-estate|bat-dong-san/i, hint: 'land registry documents and property keys on a polished wooden desk' },
  { match: /corporate|doanh-nghiep|enterprise|m&a|m-and-a|ma-/i, hint: 'a quiet corporate boardroom with closed signing folders and a fountain pen' },
  { match: /labor|lao-dong|employee|employment|work-permit/i, hint: 'a labour-rights consultation: open employment contract and a hard hat resting on a glass table' },
  { match: /criminal|hinh-su|defense|defence/i, hint: 'a defence binder, gavel and statute books on a dark wood courtroom desk' },
  { match: /family|hon-nhan|ly-hon|divorce|inherit/i, hint: 'two stacked family-law dossiers, a marriage certificate folder and warm window light' },
  { match: /invest|dau-tu|fdi|foreign-investor/i, hint: 'a Vietnam business-license folder, a passport and an investment prospectus in soft daylight' },
  { match: /tax|thue|finance|banking|ngan-hang/i, hint: 'tax-code volumes, a ledger and a calculator on a marble desk' },
  { match: /arbitration|trong-tai|viac/i, hint: 'a sealed arbitration panel folder beside an empty water carafe in a grey hearing room' },
  { match: /court|toa-an|litigation|tranh-tung/i, hint: 'a courtroom desk in low natural light with statute books and a quill pen' },
  { match: /contract|hop-dong/i, hint: 'two open contract sheaves with a fountain pen mid-signature on a leather desk pad' },
  { match: /intellectual|so-huu-tri-tue|patent|trademark/i, hint: 'a patent application binder, magnifying glass and minimalist desk lamp' },
  { match: /environment|moi-truong|esg/i, hint: 'a green compliance manual on a desk with a single small plant and natural light' },
];

const DEFAULT_HINT = 'a quiet, professional law-firm desk scene: open legal volumes, a fountain pen and warm side lighting on dark wood';

const STYLE_SPINE = 'Editorial photography, 16:9, soft natural daylight, restrained color palette (deep navy, warm wood, brushed gold accents), shallow depth of field, no people, no text overlays, no logos. Refined, calm, premium-law-firm aesthetic suitable as an article hero.';

function pickHint(slug) {
  for (const t of TOPIC_HINTS) if (t.match.test(slug)) return t.hint;
  return DEFAULT_HINT;
}

function buildPrompt({ title, excerpt, slug }) {
  const hint = pickHint(slug);
  // The article title and a one-sentence excerpt let the model anchor on
  // subject matter; the topical hint guarantees a coherent "scene".
  const topicLine = title ? `Article topic: "${title}".` : '';
  const excerptLine = excerpt ? ` Editorial gist: ${excerpt.slice(0, 280).trim()}` : '';
  return `${topicLine}${excerptLine} Composition: ${hint}. ${STYLE_SPINE}`.trim();
}

function shortName(title, slug) {
  const base = (title || slug).trim();
  return base.length <= 60 ? base : base.slice(0, 57) + '…';
}

async function fetchPubs(locale) {
  const out = [];
  let page = 1;
  for (;;) {
    const res = await fetch(`${BASE_URL}/api/publications?limit=100&page=${page}&depth=0&locale=${locale}`);
    if (!res.ok) throw new Error(`fetch ${locale} p${page} failed: ${res.status}`);
    const data = await res.json();
    if (!data.docs?.length) break;
    out.push(...data.docs);
    if (!data.hasNextPage) break;
    page++;
  }
  return out;
}

async function main() {
  console.log(`append-article-image-entries — mode: ${APPLY ? 'APPLY' : 'DRY-RUN'}`);

  const [vi, en] = await Promise.all([fetchPubs('vi'), fetchPubs('en')]);
  console.log(`  Fetched: ${vi.length} VI rows, ${en.length} EN rows`);

  const enById = new Map(en.map((d) => [d.id, d]));
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const existingIds = new Set(manifest.images.map((i) => i.id));

  const toAdd = [];
  for (const p of vi) {
    const id = `article-${p.slug}`;
    if (existingIds.has(id)) continue;
    const enRow = enById.get(p.id);
    // Prefer the locale with a real title — typically EN for the EN-only
    // imports, VI for the rest. Prompt language doesn't matter to Nano
    // Banana, only the descriptive content.
    const title = (enRow?.title?.trim() || p.title?.trim() || '').replace(/\s+/g, ' ');
    const excerpt = (enRow?.excerpt?.trim() || p.excerpt?.trim() || '').replace(/\s+/g, ' ');
    if (!title) continue; // skip ghost rows with no usable content
    toAdd.push({
      id,
      name: shortName(title, p.slug),
      type: 'text-to-image',
      prompt: buildPrompt({ title, excerpt, slug: p.slug }),
      style: 'editorial',
      category: 'blog',
      aspect: '16:9',
      width: 1200,
      priority: 'normal',
      status: 'pending',
    });
  }

  console.log(`  ${toAdd.length} new entries to append (out of ${vi.length} publications)`);
  console.log(`  ${vi.length - toAdd.length} skipped (already in manifest or missing title)`);

  if (!APPLY) {
    console.log('\n  Dry-run. Sample entry:');
    if (toAdd[0]) console.log('  ' + JSON.stringify(toAdd[0], null, 2).split('\n').join('\n  '));
    console.log('\n  Re-run with --apply to mutate image-assets.json');
    return;
  }

  // Backup before mutate.
  const backup = MANIFEST.replace(/\.json$/, `.backup-before-articles-${Date.now()}.json`);
  fs.writeFileSync(backup, JSON.stringify(manifest, null, 2));
  console.log(`  Backup written: ${path.basename(backup)}`);

  manifest.images.push(...toAdd);
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`  Wrote ${manifest.images.length} total entries (${toAdd.length} new) to image-assets.json`);
  console.log('\n  Next: cd tools/image-generator-ui && npm run dev — open /batch, select vothienhien.com.');
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
