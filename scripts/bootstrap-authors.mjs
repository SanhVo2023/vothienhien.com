/**
 * F-012 bootstrap — create the two canonical author records.
 *
 *   - editorial-team   → Apolo Editorial Team (default byline)
 *   - vo-thien-hien    → Mr Hien personally (only for articles he authored)
 *
 * Run once. Idempotent: re-creates only if the slug is missing.
 *
 * Usage:
 *   AUDIT_BASE_URL=http://localhost:3000 node scripts/bootstrap-authors.mjs
 */
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const BASE_URL = process.env.AUDIT_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'thachsanhoracle@gmail.com';
const ADMIN_PASSWORD = 'Vlts@860096';

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

async function findBySlug(token, slug) {
  const res = await fetch(
    `${BASE_URL}/api/authors?where[slug][equals]=${encodeURIComponent(slug)}&depth=0&locale=all`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const data = await res.json();
  return data?.docs?.[0] || null;
}

async function createAuthor(token, slug, viFields, enFields) {
  // Step 1: create with VI locale (default)
  const res = await fetch(`${BASE_URL}/api/authors?locale=vi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ slug, ...viFields }),
  });
  const data = await res.json();
  if (!data.doc) {
    console.log(`  ✗ create failed for ${slug}:`, JSON.stringify(data).slice(0, 300));
    return null;
  }
  // Step 2: PATCH EN locale fields
  const pres = await fetch(`${BASE_URL}/api/authors/${data.doc.id}?locale=en`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(enFields),
  });
  const pdata = await pres.json();
  if (!pdata.doc) {
    console.log(`  ⚠ EN PATCH failed for ${slug}:`, JSON.stringify(pdata).slice(0, 300));
  }
  return data.doc;
}

async function main() {
  const token = await login();
  console.log('✓ Logged in');

  // editorial-team
  let editorial = await findBySlug(token, 'editorial-team');
  if (editorial) {
    console.log(`✓ editorial-team already exists (id=${editorial.id}) — skipping create.`);
  } else {
    editorial = await createAuthor(
      token,
      'editorial-team',
      {
        name: 'Apolo Editorial Team',
        role: 'Đội ngũ biên tập Apolo',
        bio: 'Bài viết được biên soạn bởi đội ngũ biên tập của Apolo Lawyers — gồm các luật sư cộng sự và chuyên gia nội dung, được Luật sư Điều hành Võ Thiện Hiển thẩm định nội dung pháp lý trước khi xuất bản.',
      },
      {
        name: 'Apolo Editorial Team',
        role: 'Apolo Editorial Desk',
        bio: 'Articles authored by the Apolo Lawyers editorial team — senior associates and content specialists — with legal content reviewed by Managing Partner Vo Thien Hien before publication.',
      },
    );
    if (editorial) console.log(`✓ Created editorial-team (id=${editorial.id})`);
  }

  // vo-thien-hien
  let hien = await findBySlug(token, 'vo-thien-hien');
  if (hien) {
    console.log(`✓ vo-thien-hien already exists (id=${hien.id}) — skipping create.`);
  } else {
    hien = await createAuthor(
      token,
      'vo-thien-hien',
      {
        name: 'Luật sư Võ Thiện Hiển',
        role: 'Luật sư Điều hành',
        bio: 'Luật sư Võ Thiện Hiển — Luật sư Điều hành tại Công ty Luật Apolo Lawyers, thành viên Đoàn Luật sư TP. Hồ Chí Minh, trực thuộc Liên đoàn Luật sư Việt Nam. Hơn 15 năm kinh nghiệm hành nghề tại các cấp Tòa án Việt Nam và Trung tâm Trọng tài Quốc tế Việt Nam (VIAC).',
      },
      {
        name: 'Vo Thien Hien',
        role: 'Managing Partner',
        bio: 'Attorney Vo Thien Hien — Managing Partner at APOLO LAWYERS - Solicitors & Litigators, member of the Ho Chi Minh City Bar Association under the Vietnam Bar Federation. Over 15 years of practice across Vietnamese courts and at the Vietnam International Arbitration Centre (VIAC).',
      },
    );
    if (hien) console.log(`✓ Created vo-thien-hien (id=${hien.id})`);
  }

  console.log('\n═══ Author bootstrap complete ═══');
  if (editorial) console.log(`editorial-team id: ${editorial.id}`);
  if (hien) console.log(`vo-thien-hien id:  ${hien.id}`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
