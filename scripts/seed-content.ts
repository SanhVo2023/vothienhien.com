/**
 * Seed script for PayloadCMS - populates initial content
 * Run via: npx tsx scripts/seed-content.ts
 *
 * Requires the dev server running (uses REST API)
 */

const CMS_URL = process.env.CMS_URL || 'http://localhost:3000';

interface SeedData {
  collection: string;
  data: Record<string, unknown>;
  locale?: string;
}

async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${CMS_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!json.token) throw new Error('Login failed: ' + JSON.stringify(json));
  return json.token;
}

async function create(token: string, collection: string, data: Record<string, unknown>, locale?: string): Promise<void> {
  const url = locale
    ? `${CMS_URL}/api/${collection}?locale=${locale}`
    : `${CMS_URL}/api/${collection}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(`  ERROR creating ${collection}:`, json.errors);
  } else {
    console.log(`  Created ${collection}: ${json.doc?.title || json.doc?.name || json.doc?.id}`);
  }
}

async function seed() {
  const email = process.argv[2] || 'admin@apololaw.vn';
  const password = process.argv[3];

  if (!password) {
    console.log('Usage: npx tsx scripts/seed-content.ts <email> <password>');
    console.log('Example: npx tsx scripts/seed-content.ts admin@apololaw.vn MyPassword123');
    process.exit(1);
  }

  console.log('\n=== Seeding PayloadCMS Content ===\n');
  console.log(`Logging in as ${email}...`);
  const token = await login(email, password);
  console.log('Logged in!\n');

  // Seed Practice Areas
  console.log('--- Practice Areas ---');
  const practiceAreas = [
    { title: 'Tranh Chấp Dân Sự', slug: 'tranh-chap-dan-su', order: 1, icon: 'scale', titleEn: 'Civil Disputes' },
    { title: 'Tranh Chấp Đất Đai', slug: 'tranh-chap-dat-dai', order: 2, icon: 'building', titleEn: 'Land & Real Estate Disputes' },
    { title: 'Hôn Nhân & Gia Đình', slug: 'hon-nhan-gia-dinh', order: 3, icon: 'heart', titleEn: 'Family Law & Divorce' },
    { title: 'Pháp Luật Doanh Nghiệp', slug: 'luat-doanh-nghiep', order: 4, icon: 'briefcase', titleEn: 'Corporate Law' },
    { title: 'Tranh Chấp Lao Động', slug: 'tranh-chap-lao-dong', order: 5, icon: 'users', titleEn: 'Labor Disputes' },
    { title: 'Bào Chữa Hình Sự', slug: 'luat-hinh-su', order: 6, icon: 'shield', titleEn: 'Criminal Defense' },
  ];

  for (const pa of practiceAreas) {
    await create(token, 'practice-areas', {
      title: pa.title,
      slug: pa.slug,
      icon: pa.icon,
      order: pa.order,
    });
  }

  // Seed Publications
  console.log('\n--- Publications ---');
  const publications = [
    {
      title: 'Xu Hướng Giải Quyết Tranh Chấp Đất Đai 2026',
      slug: 'phan-tich-luat-dat-dai-2024',
      category: 'analysis',
      excerpt: 'Phân tích các xu hướng mới trong giải quyết tranh chấp đất đai tại Việt Nam năm 2026.',
      publishedDate: '2026-03-15',
    },
    {
      title: 'Hướng Dẫn Thành Lập Doanh Nghiệp Có Vốn Nước Ngoài',
      slug: 'huong-dan-thanh-lap-doanh-nghiep',
      category: 'guide',
      excerpt: 'Hướng dẫn chi tiết quy trình thành lập doanh nghiệp có vốn đầu tư nước ngoài tại Việt Nam.',
      publishedDate: '2026-02-28',
    },
    {
      title: 'Quyền Lợi Người Lao Động Khi Nghỉ Việc',
      slug: 'quyen-loi-nguoi-lao-dong-nghi-viec',
      category: 'guide',
      excerpt: 'Tổng quan về quyền lợi của người lao động khi chấm dứt hợp đồng lao động.',
      publishedDate: '2026-02-10',
    },
    {
      title: 'Tư Vấn Ly Hôn Có Yếu Tố Nước Ngoài',
      slug: 'tu-van-ly-hon-nuoc-ngoai',
      category: 'guide',
      excerpt: 'Quy trình và lưu ý khi ly hôn giữa công dân Việt Nam và người nước ngoài.',
      publishedDate: '2026-01-20',
    },
    {
      title: 'Kinh Nghiệm Xử Lý Tranh Chấp Thương Mại Quốc Tế',
      slug: 'kinh-nghiem-tranh-chap-thuong-mai',
      category: 'analysis',
      excerpt: 'Chia sẻ kinh nghiệm thực tiễn trong giải quyết tranh chấp thương mại có yếu tố quốc tế.',
      publishedDate: '2026-01-05',
    },
    {
      title: 'Những Thay Đổi Quan Trọng Trong Luật Doanh Nghiệp',
      slug: 'thay-doi-luat-doanh-nghiep',
      category: 'analysis',
      excerpt: 'Phân tích các điểm mới đáng chú ý trong Luật Doanh Nghiệp sửa đổi và tác động đến hoạt động kinh doanh.',
      publishedDate: '2025-12-15',
    },
  ];

  for (const pub of publications) {
    await create(token, 'publications', pub);
  }

  // Seed Perspectives
  console.log('\n--- Perspectives ---');
  const perspectives = [
    {
      title: 'Đạo Đức Nghề Luật Sư Trong Thực Tiễn',
      slug: 'dao-duc-nghe-luat-su',
      excerpt: 'Suy ngẫm về đạo đức nghề nghiệp và trách nhiệm của luật sư đối với thân chủ và xã hội.',
      publishedDate: '2026-03-01',
    },
    {
      title: 'Luật Sư Và Công Lý Xã Hội',
      slug: 'luat-su-va-cong-ly-xa-hoi',
      excerpt: 'Vai trò của luật sư trong việc bảo vệ công lý và quyền lợi của người dân.',
      publishedDate: '2026-02-15',
    },
    {
      title: 'Tương Lai Nghề Luật Tại Việt Nam',
      slug: 'tuong-lai-nghe-luat-viet-nam',
      excerpt: 'Nhìn nhận về xu hướng phát triển của nghề luật tại Việt Nam trong bối cảnh hội nhập quốc tế.',
      publishedDate: '2026-01-10',
    },
    {
      title: 'Tại Sao Tôi Chọn Nghề Luật',
      slug: 'tai-sao-toi-chon-nghe-luat',
      excerpt: 'Chia sẻ cá nhân về hành trình trở thành luật sư và động lực theo đuổi nghề.',
      publishedDate: '2025-12-20',
    },
  ];

  for (const p of perspectives) {
    await create(token, 'perspectives', p);
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
    await create(token, 'credentials', c);
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
    await create(token, 'timeline-events', e);
  }

  // Update Profile global
  console.log('\n--- Profile Global ---');
  const profileRes = await fetch(`${CMS_URL}/api/globals/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
    body: JSON.stringify({
      nameVi: 'Võ Thiện Hiển',
      nameEn: 'Henry Vo',
      titleVi: 'Luật sư Thành viên Điều hành',
      titleEn: 'Managing Partner',
      taglineVi: 'Đồng hành pháp lý đáng tin cậy cho doanh nghiệp và cá nhân',
      taglineEn: 'Trusted legal counsel for businesses and individuals',
      yearsExperience: 20,
      casesHandled: 500,
      jurisdictions: 3,
      email: 'contact@apolo.com.vn',
      phone: '0903 419 479',
      whatsapp: '+84903419479',
    }),
  });
  console.log('  Profile updated:', profileRes.status);

  console.log('\n=== Seeding Complete! ===');
  console.log(`\nContent created:`);
  console.log(`  - ${practiceAreas.length} Practice Areas`);
  console.log(`  - ${publications.length} Publications`);
  console.log(`  - ${perspectives.length} Perspectives`);
  console.log(`  - ${credentials.length} Credentials`);
  console.log(`  - ${events.length} Timeline Events`);
  console.log(`  - 1 Profile (global)`);
  console.log(`\nTotal: ${practiceAreas.length + publications.length + perspectives.length + credentials.length + events.length + 1} items`);
}

seed().catch(console.error);
