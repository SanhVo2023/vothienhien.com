/**
 * Direct database seed — inserts into PayloadCMS tables with locale support
 * Run: node scripts/seed-db.mjs
 */
import dns from 'dns';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

dns.setDefaultResultOrder('ipv4first');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env
const envLines = fs.readFileSync(path.resolve(__dirname, '..', '.env'), 'utf-8').split('\n');
for (const line of envLines) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i === -1) continue;
  if (!process.env[t.substring(0, i)]) process.env[t.substring(0, i)] = t.substring(i + 1);
}

const viArticles = JSON.parse(fs.readFileSync(path.join(__dirname, 'seo-articles-vi.json'), 'utf-8'));
const enArticles = JSON.parse(fs.readFileSync(path.join(__dirname, 'seo-articles-en.json'), 'utf-8'));

const client = new pg.Client({ connectionString: process.env.DATABASE_URI, ssl: { rejectUnauthorized: false } });

async function insertWithLocale(table, baseData, localeData) {
  const id = baseData.id || Math.floor(Math.random() * 900000) + 100000;
  const baseCols = Object.keys(baseData).filter(k => k !== 'id');
  const baseVals = baseCols.map(k => baseData[k]);
  const quotedCols = baseCols.map(c => `"${c}"`);

  try {
    await client.query(
      `INSERT INTO ${table} (id, ${quotedCols.join(', ')}, updated_at, created_at) VALUES ($1, ${baseCols.map((_, i) => `$${i + 2}`).join(', ')}, NOW(), NOW())`,
      [id, ...baseVals]
    );
  } catch (e) {
    if (e.message.includes('duplicate')) return null;
    throw e;
  }

  // Insert locale rows
  for (const [locale, fields] of Object.entries(localeData)) {
    const localeCols = Object.keys(fields);
    const localeVals = localeCols.map(k => fields[k]);
    const localeId = Math.floor(Math.random() * 900000) + 100000;
    try {
      await client.query(
        `INSERT INTO ${table}_locales (id, _locale, _parent_id, ${localeCols.join(', ')}) VALUES ($1, $2, $3, ${localeCols.map((_, i) => `$${i + 4}`).join(', ')})`,
        [localeId, locale, id, ...localeVals]
      );
    } catch (e) {
      if (!e.message.includes('duplicate')) console.log(`    Locale ${locale} error: ${e.message.substring(0, 80)}`);
    }
  }

  return id;
}

async function seed() {
  console.log('\n=== Seeding PayloadCMS Database ===\n');
  await client.connect();
  console.log('Connected!\n');

  // Practice Areas
  console.log('--- Practice Areas ---');
  const practiceAreas = [
    { slug: 'tranh-chap-dan-su', icon: 'scale', order: 1, titleVi: 'Tranh Chấp Dân Sự', titleEn: 'Civil Disputes' },
    { slug: 'tranh-chap-dat-dai', icon: 'building', order: 2, titleVi: 'Tranh Chấp Đất Đai', titleEn: 'Land & Real Estate Disputes' },
    { slug: 'hon-nhan-gia-dinh', icon: 'heart', order: 3, titleVi: 'Hôn Nhân & Gia Đình', titleEn: 'Family Law & Divorce' },
    { slug: 'luat-doanh-nghiep', icon: 'briefcase', order: 4, titleVi: 'Pháp Luật Doanh Nghiệp', titleEn: 'Corporate Law' },
    { slug: 'tranh-chap-lao-dong', icon: 'users', order: 5, titleVi: 'Tranh Chấp Lao Động', titleEn: 'Labor Disputes' },
    { slug: 'luat-hinh-su', icon: 'shield', order: 6, titleVi: 'Bào Chữa Hình Sự', titleEn: 'Criminal Defense' },
  ];

  for (const pa of practiceAreas) {
    const id = await insertWithLocale('practice_areas',
      { slug: pa.slug, icon: pa.icon, order: pa.order },
      { vi: { title: pa.titleVi }, en: { title: pa.titleEn } }
    );
    console.log(`  ${id ? '✓' : '⊘'} ${pa.titleVi}`);
  }

  // Vietnamese Publications
  console.log('\n--- Vietnamese Publications ---');
  for (const a of viArticles) {
    const id = await insertWithLocale('publications',
      { slug: a.slug, category: a.category, published_date: a.publishedDate },
      { vi: { title: a.title, excerpt: a.excerpt } }
    );
    console.log(`  ${id ? '✓' : '⊘'} ${a.slug}`);
  }

  // English Publications
  console.log('\n--- English Publications ---');
  for (const a of enArticles) {
    const id = await insertWithLocale('publications',
      { slug: a.slug, category: a.category, published_date: a.publishedDate },
      { en: { title: a.title, excerpt: a.excerpt } }
    );
    console.log(`  ${id ? '✓' : '⊘'} ${a.slug}`);
  }

  // Perspectives
  console.log('\n--- Perspectives ---');
  const perspectives = [
    { slug: 'dao-duc-nghe-luat-su', date: '2026-03-01', titleVi: 'Đạo Đức Nghề Luật Sư Trong Thực Tiễn', excerptVi: 'Suy ngẫm về đạo đức nghề nghiệp và trách nhiệm của luật sư đối với thân chủ và xã hội.' },
    { slug: 'luat-su-va-cong-ly-xa-hoi', date: '2026-02-15', titleVi: 'Luật Sư Và Công Lý Xã Hội', excerptVi: 'Vai trò của luật sư trong việc bảo vệ công lý và quyền lợi của người dân.' },
    { slug: 'tuong-lai-nghe-luat-viet-nam', date: '2026-01-10', titleVi: 'Tương Lai Nghề Luật Tại Việt Nam', excerptVi: 'Nhìn nhận về xu hướng phát triển của nghề luật tại Việt Nam trong bối cảnh hội nhập quốc tế.' },
    { slug: 'tai-sao-toi-chon-nghe-luat', date: '2025-12-20', titleVi: 'Tại Sao Tôi Chọn Nghề Luật', excerptVi: 'Chia sẻ cá nhân về hành trình trở thành luật sư và động lực theo đuổi nghề.' },
  ];
  for (const p of perspectives) {
    const id = await insertWithLocale('perspectives',
      { slug: p.slug, published_date: p.date },
      { vi: { title: p.titleVi, excerpt: p.excerptVi } }
    );
    console.log(`  ${id ? '✓' : '⊘'} ${p.slug}`);
  }

  // Credentials
  console.log('\n--- Credentials ---');
  const credentials = [
    { type: 'education', year: 2005, order: 1, titleVi: 'Cử nhân Luật', instVi: 'Đại học Luật TP. Hồ Chí Minh' },
    { type: 'education', year: 2010, order: 2, titleVi: 'Thạc sĩ Luật Kinh tế', instVi: 'Đại học Luật TP. Hồ Chí Minh' },
    { type: 'certification', year: 2006, order: 3, titleVi: 'Chứng chỉ Hành nghề Luật sư', instVi: 'Bộ Tư pháp Việt Nam' },
    { type: 'membership', year: 2006, order: 4, titleVi: 'Thành viên Đoàn Luật sư TP.HCM', instVi: 'Đoàn Luật sư TP. Hồ Chí Minh' },
  ];
  for (const c of credentials) {
    const id = await insertWithLocale('credentials',
      { type: c.type, year: c.year, order: c.order },
      { vi: { title: c.titleVi, institution: c.instVi } }
    );
    console.log(`  ${id ? '✓' : '⊘'} ${c.titleVi}`);
  }

  // Timeline Events
  console.log('\n--- Timeline Events ---');
  const events = [
    { year: 2005, type: 'career', order: 1, titleVi: 'Tốt nghiệp Cử nhân Luật' },
    { year: 2006, type: 'career', order: 2, titleVi: 'Bắt đầu hành nghề Luật sư' },
    { year: 2010, type: 'achievement', order: 3, titleVi: 'Hoàn thành Thạc sĩ Luật Kinh tế' },
    { year: 2015, type: 'career', order: 4, titleVi: 'Thành lập Apolo Lawyers' },
    { year: 2020, type: 'career', order: 5, titleVi: 'Mở rộng văn phòng chi nhánh' },
    { year: 2023, type: 'achievement', order: 6, titleVi: 'Đạt mốc 500 vụ việc' },
  ];
  for (const e of events) {
    const id = await insertWithLocale('timeline_events',
      { year: e.year, type: e.type, order: e.order },
      { vi: { title: e.titleVi } }
    );
    console.log(`  ${id ? '✓' : '⊘'} ${e.titleVi}`);
  }

  const total = practiceAreas.length + viArticles.length + enArticles.length + perspectives.length + credentials.length + events.length;
  console.log(`\n=== Done! ${total} items seeded ===\n`);
  console.log('Go to http://localhost:3000/admin to see the content!\n');

  await client.end();
}

seed().catch(e => { console.error('Seed failed:', e.message); process.exit(1); });
