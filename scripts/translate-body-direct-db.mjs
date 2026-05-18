/**
 * Direct-DB apply for the 24 prepared VI body translations — bypasses
 * Next.js dev / Payload init entirely. Talks to Supabase via the existing
 * DATABASE_URI from .env using the `pg` driver that's already vendored
 * with @payloadcms/db-postgres.
 *
 * For each slug:
 *   1. Look up publications.id by slug (from publications table directly).
 *   2. Read the EN-locale content from publications_locales.
 *   3. Walk the Lexical JSON, replace text nodes with VI translations.
 *   4. UPSERT the VI-locale row in publications_locales.
 *
 * Run:  node scripts/translate-body-direct-db.mjs
 */
import 'dotenv/config';
import dns from 'dns';
import fs from 'fs';
import path from 'path';
import pkg from 'pg';
const { Client } = pkg;

dns.setDefaultResultOrder('ipv4first');

const TMP = 'C:/Users/thach/AppData/Local/Temp';
const TRANSLATABLE_TYPES = new Set(['paragraph', 'heading', 'quote', 'listitem']);

const SLUGS = [
  'getting-divorced-vietnam-foreigner-guide',
  'inheritance-law-vietnam-rights-foreign-heirs',
  'vietnam-real-estate-purchase-agreement-foreign-buyers',
  'buying-property-vietnam-foreigner-legal-rights-restrictions-process',
  'understanding-vietnam-labor-law-guide-foreign-employers',
  'employment-law-vietnam-guide-foreign-employers-employees',
  'setting-up-business-vietnam-foreign-investors-guide-2026',
  'joint-ventures-vietnam-legal-structure-governance-exit',
  'vietnam-ma-guide-legal-framework-due-diligence-deal-structures',
  'vietnam-franchise-law-foreign-franchisors',
  'tax-obligations-foreign-companies-operating-vietnam',
  'banking-finance-regulations-vietnam-foreign-investors',
  'protecting-intellectual-property-vietnam-practical-legal-guide',
  'protecting-trade-secrets-vietnam-legal-framework',
  'data-privacy-law-vietnam-pdpd-compliance-guide',
  'vietnam-e-commerce-regulations-legal-compliance',
  'environmental-law-compliance-vietnam-industrial-projects',
  'work-permit-requirements-vietnam-complete-guide',
  'resolving-commercial-disputes-vietnam-litigation-vs-arbitration',
  'dispute-resolution-vietnam-litigation-arbitration-mediation',
  'how-to-enforce-foreign-court-judgment-in-vietnam',
  'how-to-choose-lawyer-vietnam-guide-international-clients',
  'criminal-law-vietnam-what-foreign-nationals-need-to-know',
  'vietnam-construction-law-permits-contracts-disputes',
];

function applyTranslations(content, translations) {
  let i = 0;
  function walk(node) {
    if (!node) return;
    if (node.type && TRANSLATABLE_TYPES.has(node.type)) {
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

async function main() {
  const uri = process.env.DATABASE_URI;
  if (!uri) throw new Error('DATABASE_URI missing from .env');
  const client = new Client({ connectionString: uri });
  await client.connect();
  console.log('Connected. Probing schema…');

  // Discover the locales-table column names. Payload v3 with postgres adapter
  // typically uses publications_locales with columns: _parent_id, _locale, content.
  const cols = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'publications_locales' ORDER BY ordinal_position
  `);
  console.log('publications_locales columns:', cols.rows.map((r) => r.column_name).join(', '));

  let ok = 0, failed = 0, skipped = 0;
  for (const slug of SLUGS) {
    const file = path.join(TMP, `${slug}-vi.json`);
    if (!fs.existsSync(file)) { console.log(`  - ${slug}: no VI JSON, skip`); skipped++; continue; }
    try {
      const translations = JSON.parse(fs.readFileSync(file, 'utf8')).paragraphs;

      const idRes = await client.query('SELECT id FROM publications WHERE slug = $1 LIMIT 1', [slug]);
      if (idRes.rowCount === 0) { console.log(`  ✗ ${slug}: not in publications`); failed++; continue; }
      const id = idRes.rows[0].id;

      const enRes = await client.query(
        `SELECT content FROM publications_locales WHERE _parent_id = $1 AND _locale = 'en' LIMIT 1`,
        [id]
      );
      if (enRes.rowCount === 0) { console.log(`  ✗ ${slug}: no EN locale row`); failed++; continue; }

      const enContent = enRes.rows[0].content;
      const content = JSON.parse(JSON.stringify(enContent));
      const replaced = applyTranslations(content, translations);

      // Upsert VI locale row.
      const upd = await client.query(
        `UPDATE publications_locales SET content = $1 WHERE _parent_id = $2 AND _locale = 'vi'`,
        [content, id]
      );
      if (upd.rowCount === 0) {
        // No VI row yet — insert.
        await client.query(
          `INSERT INTO publications_locales (_parent_id, _locale, content) VALUES ($1, 'vi', $2)`,
          [id, content]
        );
      }
      ok++;
      console.log(`  ✓ ${slug}: ${replaced}/${translations.length} units`);
    } catch (e) {
      failed++;
      console.log(`  ✗ ${slug}: ${String(e).slice(0, 200)}`);
    }
  }
  await client.end();
  console.log(`\n═══ Done — ok: ${ok}, failed: ${failed}, skipped: ${skipped} ═══`);
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
