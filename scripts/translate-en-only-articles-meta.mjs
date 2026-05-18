/**
 * Translate the 24 EN-only Publications (per F022) — VI title + excerpt.
 *
 * Why only title + excerpt: those are what surfaces on listing pages,
 * search, and OG cards, so this unblocks VN-side discoverability
 * immediately. Full body translation is a separate, larger job tracked
 * in translate-en-only-articles-body.mjs (Gemini-driven).
 *
 * The translations below are in-context, hand-tuned legal Vietnamese
 * mirroring the EN source. Re-running is safe (PATCHes are idempotent).
 *
 * Usage:
 *   AUDIT_BASE_URL=http://localhost:3000 node scripts/translate-en-only-articles-meta.mjs            # dry-run
 *   AUDIT_BASE_URL=http://localhost:3000 node scripts/translate-en-only-articles-meta.mjs --apply    # PATCH
 */
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const BASE_URL = process.env.AUDIT_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'thachsanhoracle@gmail.com';
const ADMIN_PASSWORD = 'Vlts@860096';
const APPLY = process.argv.includes('--apply');

/** Keyed by slug. ID lookup happens at runtime to keep the table portable. */
const VI = {
  'work-permit-requirements-vietnam-complete-guide': {
    title: 'Quy định về Giấy phép Lao động tại Việt Nam: Hướng dẫn Đầy đủ cho Người sử dụng Lao động',
    excerpt: 'Hướng dẫn từng bước về thủ tục cấp giấy phép lao động tại Việt Nam: điều kiện, quy trình nộp hồ sơ, các trường hợp miễn trừ, gia hạn và những lỗi thường gặp.',
  },
  'banking-finance-regulations-vietnam-foreign-investors': {
    title: 'Quy định về Ngân hàng và Tài chính tại Việt Nam: Hướng dẫn cho Nhà Đầu tư Nước ngoài',
    excerpt: 'Tổng quan về quy định ngân hàng và tài chính tại Việt Nam: đầu tư nước ngoài vào ngân hàng, hạn chế cho vay, kiểm soát ngoại hối và cấp phép fintech.',
  },
  'environmental-law-compliance-vietnam-industrial-projects': {
    title: 'Tuân thủ Luật Môi trường tại Việt Nam: Yêu cầu đối với Dự án Công nghiệp',
    excerpt: 'Hướng dẫn tuân thủ pháp luật môi trường đối với các dự án công nghiệp tại Việt Nam: yêu cầu đánh giá tác động môi trường (ĐTM), giấy phép, quản lý chất thải và xu hướng kiểm tra xử phạt.',
  },
  'vietnam-e-commerce-regulations-legal-compliance': {
    title: 'Quy định về Thương mại Điện tử tại Việt Nam: Tuân thủ Pháp lý cho Doanh nghiệp Trực tuyến',
    excerpt: 'Hướng dẫn pháp luật thương mại điện tử Việt Nam: yêu cầu đăng ký, bảo vệ người tiêu dùng, hợp đồng điện tử, xử lý thanh toán và bán hàng xuyên biên giới.',
  },
  'joint-ventures-vietnam-legal-structure-governance-exit': {
    title: 'Liên doanh tại Việt Nam: Cấu trúc Pháp lý, Quản trị và Chiến lược Thoái vốn',
    excerpt: 'Hướng dẫn toàn diện về thành lập và quản lý liên doanh tại Việt Nam: cấu trúc pháp lý, quản trị, phân chia lợi nhuận, giải quyết bế tắc và thoái vốn.',
  },
  'inheritance-law-vietnam-rights-foreign-heirs': {
    title: 'Luật Thừa kế tại Việt Nam: Quyền của Người Thừa kế Nước ngoài',
    excerpt: 'Hướng dẫn dành cho người nước ngoài thừa kế tài sản tại Việt Nam: khung pháp lý, quyền thừa kế, hạn chế về tài sản và thủ tục thực hiện.',
  },
  'data-privacy-law-vietnam-pdpd-compliance-guide': {
    title: 'Luật Bảo vệ Dữ liệu Cá nhân tại Việt Nam: Hướng dẫn Tuân thủ Nghị định PDPD',
    excerpt: 'Hướng dẫn toàn diện về Nghị định Bảo vệ Dữ liệu Cá nhân Việt Nam: phạm vi áp dụng, yêu cầu về sự đồng ý, quyền của chủ thể dữ liệu và quy định chuyển dữ liệu xuyên biên giới.',
  },
  'vietnam-construction-law-permits-contracts-disputes': {
    title: 'Luật Xây dựng tại Việt Nam: Giấy phép, Hợp đồng và Giải quyết Tranh chấp',
    excerpt: 'Hướng dẫn pháp luật xây dựng Việt Nam dành cho chủ đầu tư và nhà thầu: giấy phép xây dựng, hợp đồng EPC, vận dụng mẫu FIDIC và giải quyết tranh chấp.',
  },
  'protecting-trade-secrets-vietnam-legal-framework': {
    title: 'Bảo vệ Bí mật Kinh doanh tại Việt Nam: Khung Pháp lý và Thực tiễn Tốt nhất',
    excerpt: 'Cách bảo vệ bí mật kinh doanh tại Việt Nam theo Luật Sở hữu trí tuệ: yêu cầu pháp lý, thi hành thỏa thuận bảo mật (NDA), nghĩa vụ của người lao động và biện pháp xử lý hành vi xâm phạm.',
  },
  'tax-obligations-foreign-companies-operating-vietnam': {
    title: 'Nghĩa vụ Thuế của Doanh nghiệp Nước ngoài Hoạt động tại Việt Nam',
    excerpt: 'Hướng dẫn thiết yếu về nghĩa vụ thuế tại Việt Nam đối với doanh nghiệp nước ngoài: thuế TNDN, thuế GTGT, thuế TNCN, thuế nhà thầu nước ngoài, chuyển giá và ưu đãi thuế.',
  },
  'vietnam-franchise-law-foreign-franchisors': {
    title: 'Luật Nhượng quyền Thương mại Việt Nam: Yêu cầu Pháp lý đối với Bên Nhượng quyền Nước ngoài',
    excerpt: 'Hướng dẫn đầy đủ về nhượng quyền thương mại tại Việt Nam: yêu cầu đăng ký, công bố thông tin nhượng quyền, bảo vệ quyền sở hữu trí tuệ và tuân thủ pháp luật.',
  },
  'dispute-resolution-vietnam-litigation-arbitration-mediation': {
    title: 'Giải quyết Tranh chấp tại Việt Nam: Tòa án, Trọng tài và Hòa giải',
    excerpt: 'So sánh ba phương thức giải quyết tranh chấp tại Việt Nam: tố tụng tại tòa án, trọng tài thương mại và hòa giải — chi phí, thời gian và trường hợp sử dụng phù hợp.',
  },
  'understanding-vietnam-labor-law-guide-foreign-employers': {
    title: 'Hiểu về Luật Lao động Việt Nam: Hướng dẫn cho Người sử dụng Lao động Nước ngoài',
    excerpt: 'Hướng dẫn thiết yếu về Bộ luật Lao động 2019 dành cho người sử dụng lao động nước ngoài: hợp đồng lao động, giờ làm việc, quy định chấm dứt hợp đồng và tuân thủ pháp luật.',
  },
  'vietnam-real-estate-purchase-agreement-foreign-buyers': {
    title: 'Hợp đồng Mua bán Bất động sản tại Việt Nam: Điều khoản Thiết yếu cho Người mua Nước ngoài',
    excerpt: 'Hướng dẫn toàn diện về các điều khoản thiết yếu trong hợp đồng mua bán bất động sản Việt Nam và những lỗi thường gặp mà người mua nước ngoài cần tránh.',
  },
  'how-to-choose-lawyer-vietnam-guide-international-clients': {
    title: 'Cách Lựa chọn Luật sư tại Việt Nam: Hướng dẫn Thực tiễn cho Khách hàng Quốc tế',
    excerpt: 'Hướng dẫn thực tiễn dành cho khách hàng quốc tế trong việc tìm và lựa chọn luật sư tại Việt Nam, bao gồm hệ thống đoàn luật sư, cơ cấu phí, kỳ vọng giao tiếp, dấu hiệu cảnh báo và những điều cần chú ý.',
  },
  'criminal-law-vietnam-what-foreign-nationals-need-to-know': {
    title: 'Luật Hình sự Việt Nam: Những Điều Người Nước ngoài Cần Biết',
    excerpt: 'Hướng dẫn thiết yếu cho người nước ngoài về hệ thống pháp luật hình sự Việt Nam, bao gồm các tội danh phổ biến, quyền khi bị tạm giữ, quyền có luật sư, tiếp xúc lãnh sự, bảo lãnh, thủ tục xét xử và mức hình phạt có thể.',
  },
  'how-to-enforce-foreign-court-judgment-in-vietnam': {
    title: 'Cách Thi hành Bản án của Tòa án Nước ngoài tại Việt Nam',
    excerpt: 'Hướng dẫn chi tiết về công nhận và thi hành bản án của tòa án nước ngoài tại Việt Nam, bao gồm yêu cầu pháp lý, khung hiệp định song phương, thủ tục, thời gian và những khó khăn thực tiễn.',
  },
  'resolving-commercial-disputes-vietnam-litigation-vs-arbitration': {
    title: 'Giải quyết Tranh chấp Thương mại tại Việt Nam: Tòa án so với Trọng tài',
    excerpt: 'Phân tích chuyên sâu so sánh giữa tố tụng tại tòa án và trọng tài trong giải quyết tranh chấp thương mại tại Việt Nam, bao gồm hệ thống tòa án, trọng tài VIAC, thi hành phán quyết nước ngoài và chiến lược thực tiễn.',
  },
  'employment-law-vietnam-guide-foreign-employers-employees': {
    title: 'Luật Việc làm tại Việt Nam: Hướng dẫn cho Người sử dụng Lao động và Người Lao động Nước ngoài',
    excerpt: 'Hướng dẫn thiết yếu về pháp luật lao động Việt Nam dành cho người nước ngoài, bao gồm giấy phép lao động, hợp đồng lao động, quy định chấm dứt hợp đồng, nghĩa vụ bảo hiểm xã hội và thủ tục giải quyết tranh chấp.',
  },
  'buying-property-vietnam-foreigner-legal-rights-restrictions-process': {
    title: 'Mua Bất động sản tại Việt Nam khi là Người Nước ngoài: Quyền lợi, Hạn chế và Quy trình Pháp lý',
    excerpt: 'Hướng dẫn thiết yếu cho người nước ngoài về quyền sở hữu bất động sản tại Việt Nam, bao gồm mua căn hộ, hạn chế về quyền sử dụng đất, cấu trúc qua công ty, các bước thẩm định pháp lý và những điểm lưu ý về hợp đồng.',
  },
  'getting-divorced-vietnam-foreigner-guide': {
    title: 'Ly hôn tại Việt Nam khi là Người Nước ngoài: Mọi Điều Bạn Cần Biết',
    excerpt: 'Hướng dẫn toàn diện cho người nước ngoài về thủ tục ly hôn tại Việt Nam, bao gồm thẩm quyền, luật áp dụng, phân chia tài sản, quyền nuôi con, thủ tục tại tòa án Việt Nam và việc thi hành xuyên biên giới.',
  },
  'protecting-intellectual-property-vietnam-practical-legal-guide': {
    title: 'Bảo vệ Quyền Sở hữu Trí tuệ tại Việt Nam: Hướng dẫn Pháp lý Thực tiễn',
    excerpt: 'Hướng dẫn thực tiễn về bảo vệ sở hữu trí tuệ tại Việt Nam, bao gồm đăng ký nhãn hiệu, sáng chế, bí mật kinh doanh, chiến lược thực thi và chống xâm phạm trực tuyến cho doanh nghiệp quốc tế.',
  },
  'vietnam-ma-guide-legal-framework-due-diligence-deal-structures': {
    title: 'Hướng dẫn M&A tại Việt Nam: Khung Pháp lý, Thẩm định và Cấu trúc Giao dịch',
    excerpt: 'Hướng dẫn chuyên sâu về mua bán và sáp nhập doanh nghiệp tại Việt Nam, bao gồm cấu trúc giao dịch, giới hạn sở hữu nước ngoài, kiểm tra cạnh tranh, các yếu tố thẩm định pháp lý và tác động thuế đối với giao dịch xuyên biên giới.',
  },
  'setting-up-business-vietnam-foreign-investors-guide-2026': {
    title: 'Thành lập Doanh nghiệp tại Việt Nam: Hướng dẫn Pháp lý Đầy đủ cho Nhà Đầu tư Nước ngoài 2026',
    excerpt: 'Hướng dẫn pháp lý toàn diện cho nhà đầu tư nước ngoài muốn thành lập doanh nghiệp tại Việt Nam, bao gồm các loại hình doanh nghiệp, quy định về sở hữu, cấp phép và quy trình thành lập từng bước.',
  },
};

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

async function findIdBySlug(token, slug) {
  const res = await fetch(`${BASE_URL}/api/publications?where[slug][equals]=${encodeURIComponent(slug)}&depth=0`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return (await res.json())?.docs?.[0]?.id ?? null;
}

async function patchVi(token, id, patch) {
  const res = await fetch(`${BASE_URL}/api/publications/${id}?locale=vi`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(patch),
  });
  return res.json();
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log(`translate-en-only-articles-meta — mode: ${APPLY ? 'APPLY' : 'DRY-RUN'}`);
  const token = await login();
  const slugs = Object.keys(VI);
  console.log(`  ${slugs.length} EN-only articles queued`);

  let ok = 0;
  let failed = 0;
  for (const slug of slugs) {
    const id = await findIdBySlug(token, slug);
    if (!id) {
      console.log(`  ✗ slug not found: ${slug}`);
      failed++;
      continue;
    }
    const { title, excerpt } = VI[slug];
    if (!APPLY) {
      console.log(`  · #${id} ${slug} → "${title.slice(0, 60)}…"`);
      continue;
    }
    const r = await patchVi(token, id, { title, excerpt });
    if (r?.doc) {
      ok++;
      console.log(`  ✓ #${id} ${slug}`);
    } else {
      failed++;
      console.log(`  ✗ #${id} ${slug}: ${JSON.stringify(r).slice(0, 200)}`);
    }
    await delay(120);
  }
  console.log(`\n═══ Done — ok: ${ok}, failed: ${failed} ═══`);
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
