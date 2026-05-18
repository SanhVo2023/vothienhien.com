/**
 * Refresh the `vo-thien-hien` Authors record (created in F-012) with the
 * new bio text from the 17/05/2026 client review (R24).
 *
 * The bio is reserved for publications Mr Hien personally authored — none
 * in the current 58-article corpus — but the record should still carry the
 * up-to-date text in case it's promoted later.
 *
 * Usage: AUDIT_BASE_URL=http://localhost:3000 node scripts/rewrite-hien-author-bio.mjs
 */
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const BASE_URL = process.env.AUDIT_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'thachsanhoracle@gmail.com';
const ADMIN_PASSWORD = 'Vlts@860096';

const VI_BIO = `Luật sư Võ Thiện Hiển, tên tiếng Anh là Henry Vo, là luật sư Việt Nam có hơn 20 năm kinh nghiệm hành nghề trong lĩnh vực tố tụng, trọng tài, giải quyết tranh chấp và tư vấn pháp lý tại Việt Nam. Từ năm 2018, ông giữ vai trò Luật sư Điều hành tại Apolo Lawyers, phụ trách định hướng chuyên môn và trực tiếp tham gia xử lý các vụ việc có yếu tố trong nước và nước ngoài. Hơn 500 vụ việc tại Tòa án, hơn 100 vụ việc trọng tài và hơn 300 hồ sơ tư vấn, hỗ trợ giải quyết tranh chấp.`;

const EN_BIO = `Attorney Vo Thien Hien, also known as Henry Vo, is a Vietnamese attorney with more than 20 years of legal practice experience in litigation, arbitration, dispute resolution and legal advisory work in Vietnam. Since 2018, he has served as the Managing Partner of Apolo Lawyers. Involved in more than 500 court cases, more than 100 arbitration matters and more than 300 advisory and dispute resolution matters.`;

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

async function findId(token, slug) {
  const res = await fetch(`${BASE_URL}/api/authors?where[slug][equals]=${encodeURIComponent(slug)}&depth=0`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return (await res.json())?.docs?.[0]?.id ?? null;
}

async function patchLocale(token, id, locale, patch) {
  const res = await fetch(`${BASE_URL}/api/authors/${id}?locale=${locale}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(patch),
  });
  return res.json();
}

async function main() {
  const token = await login();
  const id = await findId(token, 'vo-thien-hien');
  if (!id) throw new Error('vo-thien-hien author missing — run scripts/bootstrap-authors.mjs first.');
  console.log(`Patching author id=${id}`);
  const vi = await patchLocale(token, id, 'vi', { bio: VI_BIO });
  console.log(`  VI ${vi?.doc ? '✓' : '✗'} ${vi?.errors ? JSON.stringify(vi.errors).slice(0, 200) : ''}`);
  const en = await patchLocale(token, id, 'en', { bio: EN_BIO });
  console.log(`  EN ${en?.doc ? '✓' : '✗'} ${en?.errors ? JSON.stringify(en.errors).slice(0, 200) : ''}`);
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
