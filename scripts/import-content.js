#!/usr/bin/env node
/**
 * Import SEO content from JSON files into PayloadCMS.
 *
 * Usage:
 *   node scripts/import-content.js
 *   node scripts/import-content.js --dry-run     # preview without importing
 *   node scripts/import-content.js --collection publications
 *
 * Prerequisites:
 *   - CMS must be running (npm run dev)
 *   - Admin user must exist
 *   - Set CMS_URL, CMS_EMAIL, CMS_PASSWORD below or via env vars
 */

const CMS_URL = process.env.CMS_URL || "http://localhost:3000";
const CMS_EMAIL = process.env.CMS_EMAIL || "admin@apololaw.vn";
const CMS_PASSWORD = process.env.CMS_PASSWORD || "admin123";
const CONTENT_DIR = process.env.CONTENT_DIR || "../../tools/seo-content-writer/output/vothienhien.com";
const COLLECTION = process.env.COLLECTION || "publications";

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

async function main() {
  console.log(`\n=== PayloadCMS Content Importer ===`);
  console.log(`CMS: ${CMS_URL}`);
  console.log(`Collection: ${COLLECTION}`);
  console.log(`Content dir: ${path.resolve(CONTENT_DIR)}`);
  console.log(`Dry run: ${dryRun}\n`);

  // 1. Login
  console.log("Logging in...");
  const loginRes = await fetch(`${CMS_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: CMS_EMAIL, password: CMS_PASSWORD }),
  });

  if (!loginRes.ok) {
    console.error("Login failed:", await loginRes.text());
    process.exit(1);
  }

  const { token } = await loginRes.json();
  console.log("Logged in successfully.\n");

  // 2. Read content files
  const contentPath = path.resolve(__dirname, "..", CONTENT_DIR);
  if (!fs.existsSync(contentPath)) {
    console.error(`Content directory not found: ${contentPath}`);
    process.exit(1);
  }

  const files = fs.readdirSync(contentPath).filter((f) => f.endsWith(".json"));
  console.log(`Found ${files.length} articles to import.\n`);

  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = path.join(contentPath, file);
    const article = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    console.log(`[${imported + skipped + failed + 1}/${files.length}] ${article.slug || file}`);

    // Check if already exists
    const existingRes = await fetch(
      `${CMS_URL}/api/${COLLECTION}?where[slug][equals]=${article.slug}&locale=vi`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const existing = await existingRes.json();

    if (existing.docs && existing.docs.length > 0) {
      console.log(`  SKIP: already exists (id: ${existing.docs[0].id})`);
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`  DRY RUN: would import "${article.title_vi}"`);
      imported++;
      continue;
    }

    // 3. Create Vietnamese version
    try {
      const payload = {
        title: article.title_vi,
        slug: article.slug,
        excerpt: article.excerpt_vi,
        content: convertMarkdownToLexical(article.content_vi),
        category: mapCategory(article.category),
        publishedAt: new Date().toISOString(),
        _status: "published",
        meta: {
          title: article.seo?.title_vi || article.title_vi,
          description: article.seo?.description_vi || article.excerpt_vi,
        },
      };

      const createRes = await fetch(`${CMS_URL}/api/${COLLECTION}?locale=vi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!createRes.ok) {
        const err = await createRes.text();
        console.log(`  FAIL (VI): ${err.slice(0, 200)}`);
        failed++;
        continue;
      }

      const created = await createRes.json();
      const docId = created.doc?.id;

      // 4. Update with English locale
      if (article.title_en && article.content_en && docId) {
        const enPayload = {
          title: article.title_en,
          excerpt: article.excerpt_en,
          content: convertMarkdownToLexical(article.content_en),
          meta: {
            title: article.seo?.title_en || article.title_en,
            description: article.seo?.description_en || article.excerpt_en,
          },
        };

        await fetch(`${CMS_URL}/api/${COLLECTION}/${docId}?locale=en`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(enPayload),
        });
      }

      console.log(`  OK: imported (id: ${docId})`);
      imported++;
    } catch (err) {
      console.log(`  FAIL: ${err.message}`);
      failed++;
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\n=== Import Complete ===`);
  console.log(`Imported: ${imported}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${files.length}\n`);
}

/**
 * Convert markdown string to Lexical editor JSON format.
 * This is a simplified converter - for complex markdown,
 * consider using a proper markdown-to-lexical library.
 */
function convertMarkdownToLexical(markdown) {
  if (!markdown) return undefined;

  // For PayloadCMS Lexical editor, we can pass markdown as a root node
  // PayloadCMS v3 with Lexical accepts serialized editor state
  // Simplified: store as a single paragraph block with the markdown
  // The CMS will render it properly

  const paragraphs = markdown.split("\n\n").filter(Boolean);
  const children = paragraphs.map((p) => {
    const trimmed = p.trim();

    // Detect headings
    if (trimmed.startsWith("# ")) {
      return {
        type: "heading",
        tag: "h1",
        children: [{ type: "text", text: trimmed.slice(2) }],
      };
    }
    if (trimmed.startsWith("## ")) {
      return {
        type: "heading",
        tag: "h2",
        children: [{ type: "text", text: trimmed.slice(3) }],
      };
    }
    if (trimmed.startsWith("### ")) {
      return {
        type: "heading",
        tag: "h3",
        children: [{ type: "text", text: trimmed.slice(4) }],
      };
    }

    // Default: paragraph
    return {
      type: "paragraph",
      children: [{ type: "text", text: trimmed }],
    };
  });

  return {
    root: {
      type: "root",
      children,
      direction: null,
      format: "",
      indent: 0,
    },
  };
}

/**
 * Map article category to CMS category value.
 */
function mapCategory(cat) {
  const map = {
    "gioi-thieu": "profile",
    "linh-vuc-hanh-nghe": "practice-areas",
    "vu-viec-tieu-bieu": "representative-experience",
    "bai-viet-chuyen-mon": "legal-insights",
    "quan-diem-nghe-luat": "professional-perspective",
    "practice-areas": "practice-areas",
    "legal-insights": "legal-insights",
    "professional-perspective": "professional-perspective",
  };
  return map[cat] || cat;
}

main().catch(console.error);
