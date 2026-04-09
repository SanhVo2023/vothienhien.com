# vothienhien.com — CMS Setup & Content Import Guide

This guide is for the Claude Code agent running in this site folder. Follow these steps to get the CMS running with Supabase and import SEO content.

---

## Step 1: Configure Supabase Database

Update `.env` with the Supabase connection string:

```env
# Supabase Project: "Apolo lawyer's Project"
# Region: ap-northeast-2 (Seoul)
# Ref: vvzpvkjlkmjjnhapsrxq

# For PayloadCMS (uses connection pooler on port 6543)
DATABASE_URI=postgresql://postgres.vvzpvkjlkmjjnhapsrxq:C9n_4JAP%26zkSpwj@db.vvzpvkjlkmjjnhapsrxq.supabase.co:6543/postgres?pgbouncer=true

# PayloadCMS secret (generate a random one for production)
PAYLOAD_SECRET=apolo-vothienhien-secret-2026-change-in-prod

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=vi

# Supabase (for direct client usage if needed)
NEXT_PUBLIC_SUPABASE_URL=https://vvzpvkjlkmjjnhapsrxq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2enB2a2psa21qam5oYXBzcnhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjUzMDksImV4cCI6MjA5MTE0MTMwOX0.0-sN1B7U1EV5TtlE4hj2cdlPGaHdampta_yD0n0YBak
```

**NOTE**: The `.env` file is already configured with the correct Supabase connection string. No changes needed — just run migrations.

For the direct connection (migrations), use port 5432 instead of 6543 and remove `?pgbouncer=true`.

---

## Step 2: Run Database Migration

```bash
# Generate PayloadCMS types first
npx payload generate:types

# Create and run migration
npx payload migrate
```

This creates all PayloadCMS tables in Supabase (users, media, pages, practice-areas, publications, perspectives, etc.).

---

## Step 3: Create Admin User

Start the dev server:
```bash
npm run dev
```

Go to http://localhost:3000/admin and create the first admin user:
- Email: admin@apololaw.vn
- Password: (choose a strong one)

---

## Step 4: Import SEO Content

SEO articles are pre-generated as JSON files in:
```
../../tools/seo-content-writer/output/vothienhien.com/
```

### Available articles:
1. `ho-so-luat-su-vo-thien-hien.json` — Lawyer profile (bilingual)
2. `kinh-nghiem-xu-ly-tranh-chap-thuong-mai-quoc-te.json` — International commercial disputes
3. `tai-sao-doanh-nghiep-can-luat-su-tranh-tung-chuyen-nghiep.json` — Why businesses need litigation lawyers
4. `tu-van-ly-hon-co-yeu-to-nuoc-ngoai-tai-viet-nam.json` — Foreign divorce consultation
5. `xu-huong-tranh-chap-bat-dong-san-tai-tphcm-2025-2026.json` — HCMC real estate dispute trends

### Import via PayloadCMS REST API:

Once the CMS is running, import articles with:

```bash
# First, get an auth token by logging in
TOKEN=$(curl -s -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@apololaw.vn","password":"YOUR_PASSWORD"}' \
  | python -c "import sys,json; print(json.load(sys.stdin)['token'])")

# Then import each article
# The JSON files have fields: title_vi, title_en, slug, category, content_vi, content_en, etc.
# Map them to your PayloadCMS collection fields (Publications or Perspectives)
```

### Mapping JSON fields to CMS collections:

| JSON field | CMS Collection | CMS Field |
|-----------|---------------|-----------|
| `title_vi` | Publications | `title` (vi locale) |
| `title_en` | Publications | `title` (en locale) |
| `slug` | Publications | `slug` |
| `content_vi` | Publications | `content` (vi locale, rich text) |
| `content_en` | Publications | `content` (en locale, rich text) |
| `excerpt_vi` | Publications | `excerpt` (vi locale) |
| `excerpt_en` | Publications | `excerpt` (en locale) |
| `seo.title_vi` | Publications | `meta.title` (vi locale) |
| `seo.title_en` | Publications | `meta.title` (en locale) |
| `seo.description_vi` | Publications | `meta.description` (vi locale) |
| `category` | Publications | `category` |

### Or create a bulk import script:

Create `scripts/import-content.ts`:
```typescript
import payload from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'

async function importContent() {
  await payload.init({ config })

  const contentDir = path.resolve(__dirname, '../../tools/seo-content-writer/output/vothienhien.com')
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'))

  for (const file of files) {
    const article = JSON.parse(fs.readFileSync(path.join(contentDir, file), 'utf-8'))

    await payload.create({
      collection: 'publications',
      locale: 'vi',
      data: {
        title: article.title_vi,
        slug: article.slug,
        excerpt: article.excerpt_vi,
        content: article.content_vi, // Note: may need Lexical format conversion
        category: article.category,
        publishedAt: new Date().toISOString(),
        _status: 'published',
      },
    })

    // Update English locale
    // Find the doc first, then update with locale: 'en'
    console.log(`Imported: ${article.slug}`)
  }

  process.exit(0)
}

importContent()
```

---

## Step 5: Generate & Upload Images

Image assets are defined in `image-assets.json` in this directory.

Use the Image Generator UI at `../../tools/image-generator-ui/`:
```bash
cd ../../tools/image-generator-ui
npm run dev
# Open http://localhost:3333/batch
# Select vothienhien.com manifest
# Test → Approve → Generate & Upload
```

**3 images need Mr. Hien's portrait photo** placed at:
```
./references/mr-hien-portrait.jpg
```

### R2 CDN Credentials (for image uploads):
- **Account ID**: d7f47f0c70712c6934b79a0745c94ca1
- **Bucket**: apolowebsite
- **Endpoint**: https://d7f47f0c70712c6934b79a0745c94ca1.r2.cloudflarestorage.com

Images upload to: `https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev/vothienhien.com/{category}/{filename}.webp`

---

## Step 6: Verify Everything

1. **CMS Admin**: http://localhost:3000/admin — all collections populated
2. **Frontend**: http://localhost:3000 — pages render with CMS data
3. **SEO Check**: View source on any page — confirm `<title>`, `<meta>`, JSON-LD present
4. **Bilingual**: Switch language — both VI and EN content renders
5. **Images**: All images load from R2 CDN URLs

---

## Credentials Summary

| Service | Value |
|---------|-------|
| Supabase Project | vvzpvkjlkmjjnhapsrxq |
| Supabase URL | https://vvzpvkjlkmjjnhapsrxq.supabase.co |
| Supabase Anon Key | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2enB2a2psa21qam5oYXBzcnhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjUzMDksImV4cCI6MjA5MTE0MTMwOX0.0-sN1B7U1EV5TtlE4hj2cdlPGaHdampta_yD0n0YBak |
| DB Host | db.vvzpvkjlkmjjnhapsrxq.supabase.co |
| DB Port (pooler) | 6543 |
| DB Port (direct) | 5432 |
| R2 Account | d7f47f0c70712c6934b79a0745c94ca1 |
| R2 Bucket | apolowebsite |
| R2 Public URL | https://pub-d7f47f0c70712c6934b79a0745c94ca1.r2.dev |

**DB Password**: Already configured in `.env` file
