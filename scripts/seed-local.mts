/**
 * Seed script using PayloadCMS Local API (no HTTP server needed)
 * Run: npx tsx scripts/seed-local.mts
 */
import dns from 'dns';
import fs from 'fs';
import path from 'path';
dns.setDefaultResultOrder('ipv4first');

// Load .env manually
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.substring(0, eqIdx);
    const val = trimmed.substring(eqIdx + 1);
    if (!process.env[key]) process.env[key] = val;
  }
}

import { getPayload } from 'payload';
import config from '../src/payload.config';

import viArticles from './seo-articles-vi.json' with { type: 'json' };
import enArticles from './seo-articles-en.json' with { type: 'json' };

async function seed() {
  console.log('\n=== Seeding PayloadCMS via Local API ===\n');

  const payload = await getPayload({ config });
  console.log('PayloadCMS initialized!\n');

  // Seed Practice Areas
  console.log('--- Practice Areas ---');
  const practiceAreas = [
    { title: 'Tranh Chấp Dân Sự', slug: 'tranh-chap-dan-su', order: 1, icon: 'scale' },
    { title: 'Tranh Chấp Đất Đai', slug: 'tranh-chap-dat-dai', order: 2, icon: 'building' },
    { title: 'Hôn Nhân & Gia Đình', slug: 'hon-nhan-gia-dinh', order: 3, icon: 'heart' },
    { title: 'Pháp Luật Doanh Nghiệp', slug: 'luat-doanh-nghiep', order: 4, icon: 'briefcase' },
    { title: 'Tranh Chấp Lao Động', slug: 'tranh-chap-lao-dong', order: 5, icon: 'users' },
    { title: 'Bào Chữa Hình Sự', slug: 'luat-hinh-su', order: 6, icon: 'shield' },
  ];

  for (const pa of practiceAreas) {
    try {
      await payload.create({ collection: 'practice-areas', data: pa });
      console.log(`  Created: ${pa.title}`);
    } catch (e: any) {
      console.log(`  Skip (exists?): ${pa.title} - ${e.message?.substring(0, 60)}`);
    }
  }

  // Seed Vietnamese Publications
  console.log('\n--- Vietnamese Publications ---');
  for (const article of viArticles) {
    try {
      await payload.create({
        collection: 'publications',
        locale: 'vi',
        data: {
          title: article.title,
          slug: article.slug,
          category: article.category,
          excerpt: article.excerpt,
          publishedDate: article.publishedDate,
        },
      });
      console.log(`  Created: ${article.slug}`);
    } catch (e: any) {
      console.log(`  Skip: ${article.slug} - ${e.message?.substring(0, 60)}`);
    }
  }

  // Seed English Publications
  console.log('\n--- English Publications ---');
  for (const article of enArticles) {
    try {
      await payload.create({
        collection: 'publications',
        locale: 'en',
        data: {
          title: article.title,
          slug: article.slug,
          category: article.category,
          excerpt: article.excerpt,
          publishedDate: article.publishedDate,
        },
      });
      console.log(`  Created: ${article.slug}`);
    } catch (e: any) {
      console.log(`  Skip: ${article.slug} - ${e.message?.substring(0, 60)}`);
    }
  }

  // Seed Credentials
  console.log('\n--- Credentials ---');
  const credentials = [
    { type: 'education', title: 'Cử nhân Luật', institution: 'Đại học Luật TP. Hồ Chí Minh', year: 2005, order: 1 },
    { type: 'education', title: 'Thạc sĩ Luật Kinh tế', institution: 'Đại học Luật TP. Hồ Chí Minh', year: 2010, order: 2 },
    { type: 'certification', title: 'Chứng chỉ Hành nghề Luật sư', institution: 'Bộ Tư pháp Việt Nam', year: 2006, order: 3 },
    { type: 'membership', title: 'Thành viên Đoàn Luật sư TP.HCM', institution: 'Đoàn Luật sư TP. Hồ Chí Minh', year: 2006, order: 4 },
  ];
  for (const c of credentials) {
    try {
      await payload.create({ collection: 'credentials', data: c });
      console.log(`  Created: ${c.title}`);
    } catch (e: any) {
      console.log(`  Skip: ${c.title}`);
    }
  }

  // Seed Timeline Events
  console.log('\n--- Timeline Events ---');
  const events = [
    { year: 2005, title: 'Tốt nghiệp Cử nhân Luật', type: 'career', order: 1 },
    { year: 2006, title: 'Bắt đầu hành nghề Luật sư', type: 'career', order: 2 },
    { year: 2010, title: 'Hoàn thành Thạc sĩ Luật Kinh tế', type: 'achievement', order: 3 },
    { year: 2015, title: 'Thành lập Apolo Lawyers', type: 'career', order: 4 },
    { year: 2020, title: 'Mở rộng văn phòng chi nhánh', type: 'career', order: 5 },
    { year: 2023, title: 'Đạt mốc 500 vụ việc', type: 'achievement', order: 6 },
  ];
  for (const e of events) {
    try {
      await payload.create({ collection: 'timeline-events', data: e });
      console.log(`  Created: ${e.title}`);
    } catch (err: any) {
      console.log(`  Skip: ${e.title}`);
    }
  }

  // Seed Perspectives
  console.log('\n--- Perspectives ---');
  const perspectives = [
    { title: 'Đạo Đức Nghề Luật Sư Trong Thực Tiễn', slug: 'dao-duc-nghe-luat-su', excerpt: 'Suy ngẫm về đạo đức nghề nghiệp và trách nhiệm của luật sư.', publishedDate: '2026-03-01' },
    { title: 'Luật Sư Và Công Lý Xã Hội', slug: 'luat-su-va-cong-ly-xa-hoi', excerpt: 'Vai trò của luật sư trong việc bảo vệ công lý.', publishedDate: '2026-02-15' },
    { title: 'Tương Lai Nghề Luật Tại Việt Nam', slug: 'tuong-lai-nghe-luat-viet-nam', excerpt: 'Xu hướng phát triển của nghề luật tại Việt Nam.', publishedDate: '2026-01-10' },
    { title: 'Tại Sao Tôi Chọn Nghề Luật', slug: 'tai-sao-toi-chon-nghe-luat', excerpt: 'Chia sẻ hành trình trở thành luật sư.', publishedDate: '2025-12-20' },
  ];
  for (const p of perspectives) {
    try {
      await payload.create({ collection: 'perspectives', data: p });
      console.log(`  Created: ${p.slug}`);
    } catch (e: any) {
      console.log(`  Skip: ${p.slug}`);
    }
  }

  console.log('\n=== Seeding Complete! ===');
  console.log(`  ${practiceAreas.length} Practice Areas`);
  console.log(`  ${viArticles.length} Vietnamese Publications`);
  console.log(`  ${enArticles.length} English Publications`);
  console.log(`  ${perspectives.length} Perspectives`);
  console.log(`  ${credentials.length} Credentials`);
  console.log(`  ${events.length} Timeline Events`);

  process.exit(0);
}

seed().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
