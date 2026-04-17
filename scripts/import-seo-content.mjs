/**
 * Import SEO content into PayloadCMS via REST API
 * Converts markdown to Lexical JSON and updates/creates publications
 *
 * Usage: node scripts/import-seo-content.mjs
 */
import dns from 'dns';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dns.setDefaultResultOrder('ipv4first');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'thachsanhoracle@gmail.com';
const ADMIN_PASSWORD = 'Vlts@860096';

// ─── Markdown to Lexical JSON Converter ─────────────────────────────────

function textNode(text, format = 0) {
  return { type: 'text', text, format, detail: 0, mode: 'normal', style: '', version: 1 };
}

function parseInline(text) {
  const nodes = [];
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(textNode(text.slice(lastIndex, match.index)));
    }
    if (match[2]) nodes.push(textNode(match[2], 3)); // bold+italic
    else if (match[3]) nodes.push(textNode(match[3], 1)); // bold
    else if (match[4]) nodes.push(textNode(match[4], 2)); // italic
    else if (match[5]) nodes.push(textNode(match[5], 16)); // code
    else if (match[6] && match[7]) {
      nodes.push({
        type: 'link',
        fields: { url: match[7], linkType: 'custom', newTab: false },
        children: [textNode(match[6])],
        direction: null, format: '', indent: 0, version: 3
      });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(textNode(text.slice(lastIndex)));
  }
  return nodes.length > 0 ? nodes : [textNode(text)];
}

function markdownToLexical(markdown) {
  if (!markdown) return undefined;

  // Split by double newlines for blocks, but handle single-newline lists
  const lines = markdown.split('\n');
  const children = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trimEnd();

    // Skip empty lines
    if (!line.trim()) { i++; continue; }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      children.push({
        type: 'heading',
        tag: `h${headingMatch[1].length}`,
        children: parseInline(headingMatch[2]),
        direction: null, format: '', indent: 0, version: 1
      });
      i++;
      continue;
    }

    // Horizontal rule
    if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
      children.push({ type: 'horizontalrule', version: 1 });
      i++;
      continue;
    }

    // Block quote (collect consecutive > lines)
    if (line.trim().startsWith('> ')) {
      let quoteText = '';
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteText += (quoteText ? ' ' : '') + lines[i].trim().slice(2);
        i++;
      }
      children.push({
        type: 'quote',
        children: parseInline(quoteText),
        direction: null, format: '', indent: 0, version: 1
      });
      continue;
    }

    // Unordered list (collect consecutive - or * lines)
    if (line.match(/^\s*[-*]\s/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\s*[-*]\s/)) {
        items.push(lines[i].replace(/^\s*[-*]\s/, '').trim());
        i++;
      }
      children.push({
        type: 'list',
        tag: 'ul',
        listType: 'bullet',
        start: 1,
        children: items.map((item, idx) => ({
          type: 'listitem',
          value: idx + 1,
          children: parseInline(item),
          direction: null, format: '', indent: 0, version: 1
        })),
        direction: null, format: '', indent: 0, version: 1
      });
      continue;
    }

    // Ordered list
    if (line.match(/^\s*\d+\.\s/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\s*\d+\.\s/)) {
        items.push(lines[i].replace(/^\s*\d+\.\s/, '').trim());
        i++;
      }
      children.push({
        type: 'list',
        tag: 'ol',
        listType: 'number',
        start: 1,
        children: items.map((item, idx) => ({
          type: 'listitem',
          value: idx + 1,
          children: parseInline(item),
          direction: null, format: '', indent: 0, version: 1
        })),
        direction: null, format: '', indent: 0, version: 1
      });
      continue;
    }

    // Default: paragraph (collect lines until empty line or block element)
    let paraText = line.trim();
    i++;
    while (i < lines.length) {
      const nextLine = lines[i].trimEnd();
      if (!nextLine.trim() || nextLine.match(/^#{1,6}\s/) || nextLine.match(/^\s*[-*]\s/) ||
          nextLine.match(/^\s*\d+\.\s/) || nextLine.trim().startsWith('> ') ||
          nextLine.trim() === '---' || nextLine.trim() === '***') {
        break;
      }
      paraText += ' ' + nextLine.trim();
      i++;
    }

    children.push({
      type: 'paragraph',
      children: parseInline(paraText),
      direction: null, format: '', indent: 0, version: 1
    });
  }

  return { root: { type: 'root', children, direction: null, format: '', indent: 0, version: 1 } };
}

// ─── API Helpers ─────────────────────────────────────────────────────────

async function login() {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  });
  const data = await res.json();
  if (!data.token) throw new Error('Login failed: ' + JSON.stringify(data));
  console.log('✓ Logged in as', ADMIN_EMAIL);
  return data.token;
}

async function apiGet(path, token, locale = 'vi') {
  const sep = path.includes('?') ? '&' : '?';
  const res = await fetch(`${BASE_URL}/api${path}${sep}locale=${locale}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

async function apiPatch(path, body, token, locale = 'vi') {
  const sep = path.includes('?') ? '&' : '?';
  const res = await fetch(`${BASE_URL}/api${path}${sep}locale=${locale}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function apiPost(path, body, token, locale = 'vi') {
  const sep = path.includes('?') ? '&' : '?';
  const res = await fetch(`${BASE_URL}/api${path}${sep}locale=${locale}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(body)
  });
  return res.json();
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── Main Import Logic ──────────────────────────────────────────────────

async function main() {
  const token = await login();

  // Load article data
  const viArticles = JSON.parse(fs.readFileSync(path.join(__dirname, 'seo-articles-vi.json'), 'utf-8'));
  const enArticles = JSON.parse(fs.readFileSync(path.join(__dirname, 'seo-articles-en.json'), 'utf-8'));

  // ── Step 1: Update existing publications with content ──
  console.log('\n═══ Step 1: Updating existing publications with Lexical content ═══');

  const existingPubs = await apiGet('/publications?limit=100', token);
  console.log(`Found ${existingPubs.docs?.length || 0} existing publications`);

  for (const pub of (existingPubs.docs || [])) {
    // Find matching article in VI or EN
    const viMatch = viArticles.find(a => a.slug === pub.slug);
    const enMatch = enArticles.find(a => a.slug === pub.slug);

    if (viMatch && viMatch.content) {
      const lexical = markdownToLexical(viMatch.content);
      const res = await apiPatch(`/publications/${pub.id}`, { content: lexical }, token, 'vi');
      console.log(`  ✓ VI content → ${pub.slug} (${lexical.root.children.length} blocks)`);
      await delay(200);
    }

    if (enMatch && enMatch.content) {
      const lexical = markdownToLexical(enMatch.content);
      const res = await apiPatch(`/publications/${pub.id}`, { content: lexical }, token, 'en');
      console.log(`  ✓ EN content → ${pub.slug} (${lexical.root.children.length} blocks)`);
      await delay(200);
    }
  }

  // ── Step 2: Generate and import new articles ──
  console.log('\n═══ Step 2: Generating and importing new SEO articles ═══');

  const existingSlugs = new Set((existingPubs.docs || []).map(d => d.slug));

  const newViArticles = generateNewViArticles().filter(a => !existingSlugs.has(a.slug));
  const newEnArticles = generateNewEnArticles().filter(a => !existingSlugs.has(a.slug));

  console.log(`Generating ${newViArticles.length} new VI articles + ${newEnArticles.length} new EN articles`);

  // Import Vietnamese articles
  for (const article of newViArticles) {
    try {
      const lexical = markdownToLexical(article.content);
      const res = await apiPost('/publications', {
        title: article.title,
        slug: article.slug,
        content: lexical,
        excerpt: article.excerpt,
        category: article.category,
        publishedDate: article.publishedDate
      }, token, 'vi');

      if (res.doc) {
        console.log(`  ✓ Created VI: ${article.slug}`);
      } else {
        console.log(`  ✗ Failed VI: ${article.slug}`, res.errors?.[0]?.message || '');
      }
      await delay(250);
    } catch (e) {
      console.log(`  ✗ Error VI: ${article.slug}`, e.message);
    }
  }

  // Import English articles
  for (const article of newEnArticles) {
    try {
      const lexical = markdownToLexical(article.content);
      const res = await apiPost('/publications', {
        title: article.title,
        slug: article.slug,
        content: lexical,
        excerpt: article.excerpt,
        category: article.category,
        publishedDate: article.publishedDate
      }, token, 'en');

      if (res.doc) {
        console.log(`  ✓ Created EN: ${article.slug}`);
      } else {
        console.log(`  ✗ Failed EN: ${article.slug}`, res.errors?.[0]?.message || '');
      }
      await delay(250);
    } catch (e) {
      console.log(`  ✗ Error EN: ${article.slug}`, e.message);
    }
  }

  // ── Step 3: Update practice area descriptions ──
  console.log('\n═══ Step 3: Updating practice area descriptions ═══');

  const practiceAreas = await apiGet('/practice-areas?limit=20', token);

  for (const pa of (practiceAreas.docs || [])) {
    const descVI = getPracticeAreaDescription(pa.slug, 'vi');
    const descEN = getPracticeAreaDescription(pa.slug, 'en');

    if (descVI) {
      await apiPatch(`/practice-areas/${pa.id}`, { description: markdownToLexical(descVI) }, token, 'vi');
      console.log(`  ✓ VI description → ${pa.slug}`);
      await delay(200);
    }
    if (descEN) {
      await apiPatch(`/practice-areas/${pa.id}`, { description: markdownToLexical(descEN) }, token, 'en');
      console.log(`  ✓ EN description → ${pa.slug}`);
      await delay(200);
    }
  }

  // ── Step 4: Add Commercial Disputes practice area if missing ──
  const hasCom = (practiceAreas.docs || []).find(p => p.slug === 'tranh-chap-thuong-mai');
  if (!hasCom) {
    console.log('\n═══ Step 4: Adding Commercial Disputes practice area ═══');
    const comRes = await apiPost('/practice-areas', {
      title: 'Tranh Chấp Thương Mại',
      slug: 'tranh-chap-thuong-mai',
      icon: 'briefcase',
      order: 7,
      description: markdownToLexical(getPracticeAreaDescription('tranh-chap-thuong-mai', 'vi'))
    }, token, 'vi');

    if (comRes.doc) {
      await apiPatch(`/practice-areas/${comRes.doc.id}`, {
        title: 'Commercial Disputes',
        description: markdownToLexical(getPracticeAreaDescription('tranh-chap-thuong-mai', 'en'))
      }, token, 'en');
      console.log('  ✓ Created Commercial Disputes practice area (VI + EN)');
    }
  } else {
    console.log('\n✓ Commercial Disputes already exists');
  }

  // ── Final stats ──
  console.log('\n═══ Final Verification ═══');
  const finalPubs = await apiGet('/publications?limit=0', token);
  const finalPA = await apiGet('/practice-areas?limit=0', token);
  console.log(`Publications: ${finalPubs.totalDocs}`);
  console.log(`Practice Areas: ${finalPA.totalDocs}`);
  console.log('\n✓ Import complete!');
}

// ─── Practice Area Descriptions ──────────────────────────────────────────

function getPracticeAreaDescription(slug, locale) {
  const descriptions = {
    'tranh-chap-dan-su': {
      vi: `## Tư Vấn và Đại Diện Tranh Chấp Dân Sự

Tranh chấp dân sự là một trong những lĩnh vực hành nghề cốt lõi của Luật sư Võ Thiện Hiển và đội ngũ Apolo Lawyers. Với hơn 20 năm kinh nghiệm giải quyết hàng trăm vụ tranh chấp hợp đồng, bồi thường thiệt hại, quyền sở hữu tài sản và các tranh chấp dân sự phức tạp khác, chúng tôi cung cấp dịch vụ pháp lý toàn diện từ tư vấn ban đầu đến đại diện tại tòa án.

### Phạm Vi Dịch Vụ

- Tranh chấp hợp đồng dân sự và thương mại
- Yêu cầu bồi thường thiệt hại ngoài hợp đồng
- Tranh chấp quyền sở hữu, sử dụng tài sản
- Tranh chấp thừa kế tài sản
- Tranh chấp về quyền nhân thân
- Hòa giải và thương lượng ngoài tòa

### Cách Tiếp Cận Của Chúng Tôi

Chúng tôi ưu tiên phương án giải quyết hiệu quả nhất cho thân chủ, kết hợp giữa thương lượng hòa giải và tố tụng khi cần thiết. Mỗi vụ việc được phân tích kỹ lưỡng về rủi ro pháp lý, chi phí và thời gian trước khi đề xuất chiến lược.

**Liên hệ Luật sư Võ Thiện Hiển** để được tư vấn về vụ tranh chấp dân sự của bạn.`,
      en: `## Civil Dispute Advisory and Representation

Civil disputes constitute a core practice area for Attorney Vo Thien Hien and the Apolo Lawyers team. With over 20 years of experience resolving hundreds of contract disputes, damages claims, property rights matters, and other complex civil disputes, we provide comprehensive legal services from initial consultation to court representation.

### Scope of Services

- Civil and commercial contract disputes
- Non-contractual damages claims
- Property ownership and usage rights disputes
- Inheritance and estate disputes
- Personal rights disputes
- Out-of-court mediation and negotiation

### Our Approach

We prioritize the most effective resolution for our clients, combining negotiation and mediation with litigation when necessary. Each case undergoes thorough analysis of legal risks, costs, and timeline before recommending a strategy.

**Contact Attorney Vo Thien Hien** for consultation on your civil dispute matter.`
    },
    'tranh-chap-dat-dai': {
      vi: `## Giải Quyết Tranh Chấp Đất Đai và Bất Động Sản

Tranh chấp đất đai tại Việt Nam luôn phức tạp do hệ thống pháp luật đất đai đặc thù và lịch sử sử dụng đất lâu dài. Luật sư Võ Thiện Hiển có kinh nghiệm sâu rộng trong lĩnh vực này, đặc biệt tại khu vực TP.HCM và các tỉnh phía Nam.

### Phạm Vi Dịch Vụ

- Tranh chấp quyền sử dụng đất
- Tranh chấp hợp đồng mua bán, chuyển nhượng bất động sản
- Tranh chấp ranh giới đất, lối đi chung
- Khiếu nại về bồi thường, hỗ trợ khi thu hồi đất
- Tranh chấp đất đai liên quan đến thừa kế
- Giải quyết tranh chấp về đầu tư bất động sản

### Kinh Nghiệm Nổi Bật

Với hiểu biết sâu về Luật Đất đai 2024 và các văn bản hướng dẫn thi hành, chúng tôi đã thành công đại diện cho nhiều thân chủ trong các vụ tranh chấp đất đai giá trị lớn, bao gồm cả các vụ việc liên quan đến dự án bất động sản và khu công nghiệp.

**Liên hệ ngay** để được tư vấn chuyên sâu về vấn đề đất đai của bạn.`,
      en: `## Land and Real Estate Dispute Resolution

Land disputes in Vietnam are inherently complex due to the unique land law system and long history of land use. Attorney Vo Thien Hien has extensive experience in this field, particularly in the HCMC region and southern provinces.

### Scope of Services

- Land use rights disputes
- Real estate sale and transfer contract disputes
- Boundary and easement disputes
- Compensation claims for land acquisition
- Land disputes related to inheritance
- Real estate investment dispute resolution

### Notable Experience

With deep knowledge of the Land Law 2024 and its implementing regulations, we have successfully represented numerous clients in high-value land disputes, including cases involving real estate development projects and industrial zones.

**Contact us today** for specialized consultation on your land and property matter.`
    },
    'hon-nhan-gia-dinh': {
      vi: `## Tư Vấn Pháp Luật Hôn Nhân và Gia Đình

Các vấn đề hôn nhân gia đình đòi hỏi sự nhạy cảm và chuyên môn pháp lý cao. Luật sư Võ Thiện Hiển và đội ngũ Apolo Lawyers cam kết bảo vệ quyền lợi hợp pháp của thân chủ trong mọi tình huống.

### Phạm Vi Dịch Vụ

- Ly hôn thuận tình và đơn phương
- Phân chia tài sản chung vợ chồng
- Tranh chấp quyền nuôi con, thăm nom con
- Cấp dưỡng cho con sau ly hôn
- Ly hôn có yếu tố nước ngoài
- Xác định cha, mẹ, con
- Tranh chấp tài sản hôn nhân có yếu tố phức tạp

### Đặc Biệt Chuyên Sâu

Chúng tôi đặc biệt có kinh nghiệm trong các vụ ly hôn có yếu tố nước ngoài, phân chia tài sản giá trị lớn và tranh chấp quyền nuôi con phức tạp. Mỗi vụ việc được xử lý với sự tôn trọng và bảo mật tuyệt đối.

**Đặt lịch tư vấn riêng** để thảo luận vấn đề gia đình của bạn.`,
      en: `## Family Law and Marriage Advisory

Family and marriage matters require both legal expertise and sensitivity. Attorney Vo Thien Hien and the Apolo Lawyers team are committed to protecting clients' legitimate rights in every situation.

### Scope of Services

- Consensual and unilateral divorce proceedings
- Marital property division
- Child custody and visitation rights disputes
- Post-divorce child support
- International divorce cases
- Paternity and maternity determination
- Complex marital asset disputes

### Specialized Expertise

We have particular experience in international divorce cases, high-value asset divisions, and complex custody disputes. Every case is handled with respect and absolute confidentiality.

**Schedule a private consultation** to discuss your family matter.`
    },
    'luat-doanh-nghiep': {
      vi: `## Tư Vấn Pháp Luật Doanh Nghiệp

Trong môi trường kinh doanh năng động tại Việt Nam, doanh nghiệp cần đối tác pháp lý hiểu biết sâu về luật doanh nghiệp và đầu tư. Luật sư Võ Thiện Hiển cung cấp dịch vụ tư vấn doanh nghiệp toàn diện cho cả doanh nghiệp trong nước và có vốn đầu tư nước ngoài.

### Phạm Vi Dịch Vụ

- Thành lập doanh nghiệp và lựa chọn hình thức pháp lý
- Quản trị công ty và soạn thảo điều lệ
- Mua bán và sáp nhập doanh nghiệp (M&A)
- Tái cơ cấu doanh nghiệp
- Đầu tư nước ngoài tại Việt Nam
- Soạn thảo và rà soát hợp đồng thương mại
- Tư vấn tuân thủ pháp luật doanh nghiệp

### Kinh Nghiệm Với Nhà Đầu Tư Nước Ngoài

Chúng tôi đã hỗ trợ nhiều doanh nghiệp nước ngoài thành lập và vận hành tại Việt Nam, bao gồm tư vấn giấy phép đầu tư, thủ tục pháp lý và tuân thủ luật pháp Việt Nam.

**Liên hệ chúng tôi** để được tư vấn giải pháp pháp lý cho doanh nghiệp.`,
      en: `## Corporate Law Advisory

In Vietnam's dynamic business environment, enterprises need legal partners with deep understanding of corporate and investment law. Attorney Vo Thien Hien provides comprehensive corporate advisory services for both domestic and foreign-invested enterprises.

### Scope of Services

- Company establishment and legal structure selection
- Corporate governance and charter drafting
- Mergers and acquisitions (M&A)
- Corporate restructuring
- Foreign investment in Vietnam
- Commercial contract drafting and review
- Corporate law compliance advisory

### Experience with Foreign Investors

We have assisted numerous foreign enterprises in establishing and operating in Vietnam, including investment license advisory, legal procedures, and Vietnamese law compliance.

**Contact us** for tailored corporate legal solutions.`
    },
    'tranh-chap-lao-dong': {
      vi: `## Giải Quyết Tranh Chấp Lao Động

Tranh chấp lao động ngày càng phức tạp trong bối cảnh thị trường lao động phát triển nhanh tại Việt Nam. Luật sư Võ Thiện Hiển đại diện cho cả người lao động và người sử dụng lao động trong các tranh chấp lao động.

### Phạm Vi Dịch Vụ

- Tranh chấp về hợp đồng lao động
- Sa thải trái pháp luật và đòi bồi thường
- Tranh chấp về tiền lương, phụ cấp, thưởng
- Bảo hiểm xã hội, y tế, thất nghiệp
- Tranh chấp về quyền lợi khi chấm dứt hợp đồng
- Tư vấn nội quy lao động và chính sách nhân sự
- Đại diện tại Hội đồng trọng tài lao động

### Đại Diện Chuyên Nghiệp

Chúng tôi có kinh nghiệm đại diện tại tòa án và cơ quan hòa giải lao động, đảm bảo quyền lợi hợp pháp của thân chủ được bảo vệ tối đa.

**Liên hệ ngay** nếu bạn đang gặp vấn đề lao động.`,
      en: `## Labor Dispute Resolution

Labor disputes are increasingly complex in Vietnam's rapidly developing labor market. Attorney Vo Thien Hien represents both employees and employers in labor disputes.

### Scope of Services

- Employment contract disputes
- Wrongful termination and compensation claims
- Salary, allowance, and bonus disputes
- Social, health, and unemployment insurance matters
- Contract termination benefit disputes
- Labor regulations and HR policy advisory
- Representation at labor arbitration councils

### Professional Representation

We have experience representing clients at courts and labor mediation bodies, ensuring maximum protection of clients' legitimate rights.

**Contact us immediately** if you are facing a labor issue.`
    },
    'luat-hinh-su': {
      vi: `## Bào Chữa Hình Sự

Bào chữa hình sự đòi hỏi luật sư có kinh nghiệm thực tiễn, am hiểu sâu sắc Bộ luật Hình sự và Tố tụng Hình sự. Luật sư Võ Thiện Hiển cam kết bảo vệ quyền và lợi ích hợp pháp của bị can, bị cáo trong mọi giai đoạn tố tụng.

### Phạm Vi Dịch Vụ

- Bào chữa cho bị can, bị cáo tại cơ quan điều tra và tòa án
- Bảo vệ quyền lợi cho bị hại và nguyên đơn dân sự
- Tư vấn pháp lý cho người bị tạm giữ, tạm giam
- Khiếu nại, kháng cáo bản án hình sự
- Xin bảo lãnh, thay đổi biện pháp ngăn chặn
- Tư vấn về tội phạm kinh tế, tham nhũng
- Bào chữa trong các vụ án có yếu tố nước ngoài

### Cam Kết Của Chúng Tôi

Mỗi bị can, bị cáo đều có quyền được bào chữa đầy đủ. Chúng tôi đảm bảo quá trình tố tụng tuân thủ đúng pháp luật và quyền lợi hợp pháp của thân chủ được bảo vệ tối đa.

**Liên hệ khẩn cấp** nếu bạn hoặc người thân đang cần luật sư bào chữa.`,
      en: `## Criminal Defense

Criminal defense requires attorneys with practical experience and deep knowledge of the Penal Code and Criminal Procedure Code. Attorney Vo Thien Hien is committed to defending the legal rights and interests of suspects and defendants at every stage of proceedings.

### Scope of Services

- Defense of suspects and defendants at investigation agencies and courts
- Protection of victims' and civil plaintiffs' interests
- Legal consultation for detained persons
- Criminal judgment appeals
- Bail applications and preventive measure changes
- Economic crime and corruption advisory
- Defense in cases with foreign elements

### Our Commitment

Every suspect and defendant has the right to full legal defense. We ensure that legal proceedings comply with the law and our clients' rights are maximally protected.

**Contact us urgently** if you or a family member needs a defense attorney.`
    },
    'tranh-chap-thuong-mai': {
      vi: `## Giải Quyết Tranh Chấp Thương Mại

Tranh chấp thương mại trong nền kinh tế hội nhập quốc tế ngày càng phức tạp và đa dạng. Luật sư Võ Thiện Hiển có kinh nghiệm sâu rộng trong giải quyết tranh chấp thương mại tại cả tòa án và trọng tài thương mại.

### Phạm Vi Dịch Vụ

- Tranh chấp hợp đồng thương mại
- Tranh tụng tại tòa án thương mại
- Trọng tài thương mại tại VIAC và quốc tế
- Tranh chấp mua bán hàng hóa quốc tế
- Tranh chấp vận chuyển, logistics
- Tranh chấp bảo hiểm thương mại
- Tranh chấp quyền sở hữu trí tuệ trong thương mại
- Thu hồi nợ thương mại

### Kinh Nghiệm Trọng Tài

Chúng tôi đã đại diện cho nhiều doanh nghiệp tại Trung tâm Trọng tài Quốc tế Việt Nam (VIAC) và các tổ chức trọng tài quốc tế khác, xử lý các tranh chấp thương mại có giá trị lớn và tính chất phức tạp.

### Tại Sao Chọn Trọng Tài?

Trọng tài thương mại mang lại nhiều ưu điểm: thời gian giải quyết nhanh hơn, tính bảo mật cao, phán quyết có giá trị thi hành quốc tế theo Công ước New York 1958.

**Liên hệ Luật sư Võ Thiện Hiển** để được tư vấn về tranh chấp thương mại của bạn.`,
      en: `## Commercial Dispute Resolution

Commercial disputes in today's globalized economy are increasingly complex and diverse. Attorney Vo Thien Hien has extensive experience resolving commercial disputes through both court litigation and commercial arbitration.

### Scope of Services

- Commercial contract disputes
- Commercial court litigation
- Commercial arbitration at VIAC and international institutions
- International trade disputes
- Transportation and logistics disputes
- Commercial insurance disputes
- Intellectual property disputes in commerce
- Commercial debt recovery

### Arbitration Experience

We have represented numerous enterprises at the Vietnam International Arbitration Centre (VIAC) and other international arbitration institutions, handling high-value and complex commercial disputes.

### Why Choose Arbitration?

Commercial arbitration offers significant advantages: faster resolution, high confidentiality, and internationally enforceable awards under the New York Convention 1958.

**Contact Attorney Vo Thien Hien** for consultation on your commercial dispute.`
    }
  };

  return descriptions[slug]?.[locale] || null;
}

// ─── New Article Generators ──────────────────────────────────────────────

function generateNewViArticles() {
  return [
    {
      title: 'Hợp Đồng Mua Bán Nhà Đất: Những Điều Khoản Quan Trọng Cần Lưu Ý',
      slug: 'hop-dong-mua-ban-nha-dat-dieu-khoan-quan-trong',
      category: 'guide',
      publishedDate: '2026-04-01',
      excerpt: 'Phân tích chi tiết các điều khoản không thể thiếu trong hợp đồng mua bán nhà đất và những sai lầm phổ biến cần tránh.',
      content: `# Hợp Đồng Mua Bán Nhà Đất: Những Điều Khoản Quan Trọng Cần Lưu Ý

## Giới Thiệu

Hợp đồng mua bán nhà đất là văn bản pháp lý quan trọng nhất trong giao dịch bất động sản. Một hợp đồng được soạn thảo kỹ lưỡng sẽ bảo vệ quyền lợi của cả người mua và người bán, đồng thời ngăn ngừa tranh chấp phát sinh sau này.

Theo thống kê, hơn 60% tranh chấp bất động sản tại Việt Nam có nguồn gốc từ hợp đồng mua bán không rõ ràng hoặc thiếu các điều khoản quan trọng. Bài viết này của **Luật sư Võ Thiện Hiển** sẽ phân tích chi tiết các điều khoản cần có trong hợp đồng mua bán nhà đất.

## Các Điều Khoản Bắt Buộc

### 1. Thông Tin Về Các Bên

Hợp đồng phải ghi đầy đủ và chính xác thông tin của bên bán và bên mua:

- Họ và tên đầy đủ theo CCCD/CMND
- Số CCCD/CMND, ngày cấp, nơi cấp
- Địa chỉ thường trú
- Số điện thoại liên lạc

### 2. Mô Tả Tài Sản

Thông tin về bất động sản phải chi tiết và khớp với giấy tờ pháp lý:

- Địa chỉ chính xác của bất động sản
- Diện tích đất, diện tích xây dựng
- Số thửa đất, tờ bản đồ
- Thông tin Giấy chứng nhận quyền sử dụng đất
- Mục đích sử dụng đất
- Thời hạn sử dụng đất (nếu có)

### 3. Giá Bán và Phương Thức Thanh Toán

Đây là điều khoản thường gây tranh chấp nhất:

- Tổng giá trị giao dịch bằng số và bằng chữ
- Đồng tiền thanh toán (VNĐ)
- Lịch thanh toán cụ thể (đặt cọc, thanh toán đợt 1, 2, 3...)
- Phương thức thanh toán (chuyển khoản/tiền mặt)
- Tài khoản ngân hàng nhận thanh toán
- Điều kiện thanh toán đợt cuối (sau khi hoàn tất sang tên)

### 4. Thời Hạn và Điều Kiện Giao Nhà

- Ngày giao nhà cụ thể
- Tình trạng nhà khi giao (trống hay có nội thất)
- Trách nhiệm các khoản phí trước và sau thời điểm giao nhà
- Biên bản bàn giao nhà

## Các Điều Khoản Nên Có

### 5. Cam Kết Của Bên Bán

- Nhà đất không có tranh chấp
- Không bị thế chấp, cầm cố
- Không nằm trong quy hoạch giải tỏa
- Thông tin trên giấy tờ là chính xác

### 6. Điều Khoản Phạt Vi Phạm

- Mức phạt khi vi phạm hợp đồng (thường 8-10% giá trị hợp đồng)
- Trường hợp được miễn trách nhiệm
- Quyền đơn phương chấm dứt hợp đồng

### 7. Giải Quyết Tranh Chấp

- Cơ quan giải quyết tranh chấp (tòa án có thẩm quyền)
- Luật áp dụng
- Quy trình thương lượng, hòa giải trước khi khởi kiện

## Những Sai Lầm Phổ Biến

1. **Không công chứng hợp đồng**: Theo Luật Đất đai, hợp đồng chuyển nhượng quyền sử dụng đất phải được công chứng hoặc chứng thực
2. **Ghi giá thấp hơn thực tế**: Rủi ro lớn cho bên mua nếu giao dịch bị hủy
3. **Không kiểm tra tình trạng pháp lý**: Cần xác minh tại Văn phòng Đăng ký đất đai
4. **Thiếu điều khoản về thuế và phí**: Cần quy định rõ ai chịu thuế thu nhập cá nhân, phí trước bạ

## Kết Luận

Một hợp đồng mua bán nhà đất được soạn thảo chuyên nghiệp là đầu tư thông minh nhất để bảo vệ tài sản của bạn. Hãy luôn tham khảo ý kiến luật sư trước khi ký kết bất kỳ hợp đồng bất động sản nào.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn chi tiết về hợp đồng mua bán nhà đất.`
    },
    {
      title: 'Thành Lập Công Ty Có Vốn Đầu Tư Nước Ngoài Tại Việt Nam: Hướng Dẫn Từ A-Z',
      slug: 'thanh-lap-cong-ty-von-dau-tu-nuoc-ngoai-viet-nam',
      category: 'guide',
      publishedDate: '2026-03-28',
      excerpt: 'Hướng dẫn toàn diện quy trình pháp lý thành lập doanh nghiệp FDI tại Việt Nam, từ chuẩn bị hồ sơ đến hoạt động kinh doanh.',
      content: `# Thành Lập Công Ty Có Vốn Đầu Tư Nước Ngoài Tại Việt Nam

## Tổng Quan

Việt Nam tiếp tục là điểm đến đầu tư hấp dẫn cho doanh nghiệp nước ngoài. Theo Bộ Kế hoạch và Đầu tư, năm 2025 ghi nhận hơn 36 tỷ USD vốn FDI đăng ký, tăng 12% so với năm trước. Tuy nhiên, quy trình thành lập doanh nghiệp FDI tại Việt Nam có nhiều bước phức tạp đòi hỏi hiểu biết pháp luật chuyên sâu.

## Bước 1: Xác Định Loại Hình Doanh Nghiệp

Nhà đầu tư nước ngoài có thể lựa chọn các hình thức sau:

- **Công ty TNHH một thành viên**: Phù hợp cho nhà đầu tư đơn lẻ
- **Công ty TNHH hai thành viên trở lên**: Khi có nhiều đối tác
- **Công ty cổ phần**: Phù hợp khi có kế hoạch huy động vốn rộng rãi
- **Công ty hợp danh**: Ít phổ biến với nhà đầu tư nước ngoài

## Bước 2: Kiểm Tra Điều Kiện Đầu Tư

### Ngành nghề được phép

Theo Luật Đầu tư 2020, có ba nhóm:

1. **Ngành nghề cấm đầu tư**: Chất ma túy, hóa chất cấm, mại dâm...
2. **Ngành nghề có điều kiện**: 227 ngành nghề yêu cầu đáp ứng điều kiện cụ thể
3. **Ngành nghề tự do đầu tư**: Tất cả ngành nghề khác

### Tỷ lệ sở hữu nước ngoài

- Một số ngành giới hạn tỷ lệ sở hữu nước ngoài (ví dụ: viễn thông, ngân hàng)
- Kiểm tra cam kết WTO và các FTA mà Việt Nam tham gia
- Một số ngành yêu cầu đối tác Việt Nam

## Bước 3: Chuẩn Bị Hồ Sơ

### Hồ sơ đăng ký đầu tư

- Văn bản đề nghị thực hiện dự án đầu tư
- Giấy tờ chứng minh tư cách pháp lý của nhà đầu tư
- Đề xuất dự án đầu tư
- Báo cáo tài chính 2 năm gần nhất
- Cam kết hỗ trợ tài chính
- Đề xuất nhu cầu sử dụng đất

### Hồ sơ đăng ký doanh nghiệp

- Giấy đề nghị đăng ký doanh nghiệp
- Điều lệ công ty
- Danh sách thành viên/cổ đông
- Quyết định bổ nhiệm người đại diện

## Bước 4: Xin Cấp Giấy Chứng Nhận Đăng Ký Đầu Tư (IRC)

- Nộp hồ sơ tại Sở Kế hoạch và Đầu tư
- Thời gian xử lý: 15-35 ngày làm việc (tùy quy mô dự án)
- Một số dự án cần thêm ý kiến các bộ ngành liên quan

## Bước 5: Đăng Ký Doanh Nghiệp (ERC)

- Nộp hồ sơ tại Sở Kế hoạch và Đầu tư (cùng nơi)
- Thời gian: 3-5 ngày làm việc
- Nhận Giấy chứng nhận đăng ký doanh nghiệp

## Bước 6: Các Thủ Tục Sau Đăng Ký

- Khắc dấu doanh nghiệp
- Đăng ký thuế và mua chữ ký số
- Mở tài khoản ngân hàng (vốn góp và thanh toán)
- Chuyển vốn góp từ nước ngoài
- Đăng ký lao động và bảo hiểm xã hội
- Xin giấy phép kinh doanh (nếu ngành nghề có điều kiện)

## Chi Phí Dự Kiến

| Khoản mục | Chi phí ước tính |
|-----------|-----------------|
| Phí pháp lý | 30-80 triệu VNĐ |
| Phí nhà nước | 5-10 triệu VNĐ |
| Vốn điều lệ tối thiểu | Tùy ngành nghề |
| Thuê văn phòng | 15-50 triệu/tháng |

## Lời Khuyên Từ Luật Sư

Quy trình thành lập doanh nghiệp FDI thường mất từ 1-3 tháng. Sự hỗ trợ của luật sư có kinh nghiệm giúp tiết kiệm thời gian và tránh sai sót tốn kém.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn toàn diện về đầu tư nước ngoài tại Việt Nam.`
    },
    {
      title: 'Quyền Của Người Tiêu Dùng Theo Pháp Luật Việt Nam: Bảo Vệ Và Thực Thi',
      slug: 'quyen-nguoi-tieu-dung-phap-luat-viet-nam',
      category: 'analysis',
      publishedDate: '2026-03-25',
      excerpt: 'Phân tích toàn diện quyền của người tiêu dùng theo Luật Bảo vệ quyền lợi người tiêu dùng và cách thức bảo vệ khi bị xâm phạm.',
      content: `# Quyền Của Người Tiêu Dùng Theo Pháp Luật Việt Nam

## Giới Thiệu

Bảo vệ quyền lợi người tiêu dùng là một trong những ưu tiên của hệ thống pháp luật Việt Nam. Luật Bảo vệ quyền lợi người tiêu dùng 2023 (có hiệu lực từ 01/7/2024) đã đánh dấu bước tiến quan trọng trong việc nâng cao quyền của người tiêu dùng.

## Các Quyền Cơ Bản

### 1. Quyền được an toàn

Người tiêu dùng có quyền được bảo đảm an toàn tính mạng, sức khỏe, tài sản khi sử dụng hàng hóa, dịch vụ.

### 2. Quyền được thông tin

- Thông tin chính xác về hàng hóa, dịch vụ
- Xuất xứ, thành phần, hướng dẫn sử dụng
- Điều kiện giao dịch, bảo hành

### 3. Quyền được lựa chọn

Người tiêu dùng có quyền tự do lựa chọn hàng hóa, dịch vụ mà không bị ép buộc.

### 4. Quyền được khiếu nại, tố cáo

Khi quyền lợi bị xâm phạm, người tiêu dùng có thể:

- Khiếu nại trực tiếp đến tổ chức kinh doanh
- Khiếu nại đến cơ quan bảo vệ người tiêu dùng
- Khởi kiện tại tòa án
- Yêu cầu tổ chức xã hội bảo vệ quyền lợi

### 5. Quyền được bồi thường thiệt hại

Người tiêu dùng được bồi thường khi hàng hóa, dịch vụ không đúng tiêu chuẩn, gây thiệt hại.

## Cơ Chế Bảo Vệ

### Hòa giải

Bước đầu tiên và thường hiệu quả nhất. Người tiêu dùng thương lượng trực tiếp với doanh nghiệp hoặc thông qua cơ quan hòa giải.

### Khiếu nại hành chính

Gửi đơn đến Cục Quản lý cạnh tranh và Bảo vệ người tiêu dùng (Bộ Công Thương).

### Khởi kiện tại tòa

Phương án cuối cùng nhưng hiệu quả nhất khi các phương thức khác không thành công.

## Những Điểm Mới Của Luật 2023

1. **Mở rộng phạm vi bảo vệ** cho giao dịch thương mại điện tử
2. **Tăng cường trách nhiệm** của nền tảng trung gian
3. **Quy định về hợp đồng theo mẫu** chặt chẽ hơn
4. **Cơ chế giải quyết tranh chấp trực tuyến** (ODR)

## Kết Luận

Hiểu rõ quyền của mình là bước đầu tiên để bảo vệ bản thân. Khi gặp tranh chấp tiêu dùng, hãy liên hệ luật sư để được tư vấn giải pháp phù hợp nhất.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn bảo vệ quyền lợi người tiêu dùng.`
    },
    {
      title: 'Giải Quyết Tranh Chấp Thừa Kế Tài Sản: Quy Trình và Kinh Nghiệm Thực Tiễn',
      slug: 'giai-quyet-tranh-chap-thua-ke-tai-san',
      category: 'guide',
      publishedDate: '2026-03-20',
      excerpt: 'Hướng dẫn chi tiết quy trình giải quyết tranh chấp thừa kế tài sản theo pháp luật Việt Nam, từ thỏa thuận đến khởi kiện tại tòa án.',
      content: `# Giải Quyết Tranh Chấp Thừa Kế Tài Sản

## Tổng Quan

Tranh chấp thừa kế là một trong những loại tranh chấp dân sự phổ biến và phức tạp nhất tại Việt Nam. Theo thống kê của Tòa án Nhân dân Tối cao, các vụ tranh chấp thừa kế chiếm khoảng 15-20% tổng số vụ án dân sự hàng năm.

## Các Loại Thừa Kế

### Thừa kế theo di chúc

Di chúc hợp pháp phải đáp ứng các điều kiện theo Bộ luật Dân sự 2015:

- Người lập di chúc minh mẫn, không bị ép buộc
- Di chúc phải bằng văn bản (trừ trường hợp đặc biệt)
- Có người làm chứng (nếu di chúc viết tay không có công chứng)
- Nội dung không trái pháp luật, đạo đức xã hội

### Thừa kế theo pháp luật

Khi không có di chúc hoặc di chúc không hợp pháp, tài sản được chia theo hàng thừa kế:

1. **Hàng thứ nhất**: Vợ/chồng, cha đẻ, mẹ đẻ, cha nuôi, mẹ nuôi, con đẻ, con nuôi
2. **Hàng thứ hai**: Ông nội, bà nội, ông ngoại, bà ngoại, anh ruột, chị ruột, em ruột
3. **Hàng thứ ba**: Cụ nội, cụ ngoại, bác ruột, chú ruột, cậu ruột, cô ruột, dì ruột, cháu ruột

## Quy Trình Giải Quyết

### Bước 1: Xác định di sản thừa kế

- Liệt kê toàn bộ tài sản của người để lại
- Xác định tài sản chung, tài sản riêng
- Thu thập giấy tờ chứng minh quyền sở hữu

### Bước 2: Thỏa thuận giữa các đồng thừa kế

- Họp gia đình để thương lượng phân chia
- Nếu đồng ý: lập văn bản phân chia di sản có công chứng
- Nếu không đồng ý: chuyển sang hòa giải hoặc khởi kiện

### Bước 3: Hòa giải tại UBND cấp xã

- Nộp đơn yêu cầu hòa giải tại UBND phường/xã
- UBND tổ chức hòa giải giữa các bên
- Kết quả hòa giải được lập biên bản

### Bước 4: Khởi kiện tại tòa án

- Nộp đơn khởi kiện kèm chứng cứ
- Tòa án thụ lý và tiến hành hòa giải
- Xét xử sơ thẩm, phúc thẩm (nếu kháng cáo)

## Thời Hiệu Khởi Kiện

- **Yêu cầu chia di sản**: 30 năm đối với bất động sản, 10 năm đối với động sản
- **Yêu cầu xác nhận quyền thừa kế**: Không hết thời hiệu
- **Yêu cầu bác bỏ quyền thừa kế**: 10 năm

## Kinh Nghiệm Thực Tiễn

1. **Thu thập chứng cứ sớm**: Giấy tờ nhà đất, sổ hộ khẩu cũ, giấy khai sinh
2. **Bảo quản di chúc**: Nên lưu bản sao tại văn phòng công chứng
3. **Không tự ý phân chia**: Cần sự đồng ý của tất cả đồng thừa kế
4. **Tìm luật sư sớm**: Tư vấn pháp lý từ đầu giúp tránh sai sót

## Kết Luận

Tranh chấp thừa kế không chỉ ảnh hưởng đến tài sản mà còn tác động đến tình cảm gia đình. Giải quyết sớm và chuyên nghiệp là cách tốt nhất để bảo vệ quyền lợi của tất cả các bên.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn về vấn đề thừa kế tài sản.`
    },
    {
      title: 'Luật Lao Động 2019: Quyền Lợi Mới Của Người Lao Động',
      slug: 'luat-lao-dong-2019-quyen-loi-moi-nguoi-lao-dong',
      category: 'commentary',
      publishedDate: '2026-03-18',
      excerpt: 'Phân tích những thay đổi quan trọng trong Bộ luật Lao động 2019 và tác động đến quyền lợi người lao động tại Việt Nam.',
      content: `# Luật Lao Động 2019: Quyền Lợi Mới Của Người Lao Động

## Giới Thiệu

Bộ luật Lao động 2019 có hiệu lực từ ngày 01/01/2021, mang đến nhiều thay đổi tích cực cho người lao động. Sau hơn 5 năm thi hành, bài viết này đánh giá tác động thực tiễn của các quy định mới.

## Những Thay Đổi Chính

### 1. Tuổi nghỉ hưu tăng dần

- Nam: tăng dần đến 62 tuổi (đến 2028)
- Nữ: tăng dần đến 60 tuổi (đến 2035)
- Quy định đặc biệt cho ngành nghề nặng nhọc, độc hại

### 2. Hợp đồng lao động

**Chỉ còn 2 loại hợp đồng**:

- Hợp đồng không xác định thời hạn
- Hợp đồng xác định thời hạn (không quá 36 tháng)

Bỏ loại hợp đồng mùa vụ/theo công việc dưới 12 tháng.

### 3. Thời giờ làm việc

- Giờ làm việc tối đa: 8 giờ/ngày, 48 giờ/tuần
- Làm thêm giờ tối đa: 40 giờ/tháng, 200 giờ/năm (một số ngành 300 giờ/năm)
- Quyền nghỉ ngơi: ít nhất 24 giờ liên tục/tuần

### 4. Nghỉ phép năm

- Nghỉ phép năm tối thiểu: 12 ngày/năm
- Cứ 5 năm làm việc: tăng thêm 1 ngày
- Quyền tích lũy phép năm sang năm sau

### 5. Quyền đơn phương chấm dứt hợp đồng

Người lao động có quyền nghỉ việc với:

- Hợp đồng không xác định thời hạn: báo trước 45 ngày
- Hợp đồng xác định thời hạn: báo trước 30 ngày
- Không cần lý do (quy định mới quan trọng)

### 6. Bảo vệ lao động nữ

- Cấm sa thải lao động nữ vì lý do mang thai
- Bảo đảm việc làm sau khi nghỉ thai sản
- Nghỉ thai sản: 6 tháng
- Quyền đi làm sớm hơn (nếu có xác nhận y tế)

## Tác Động Thực Tiễn

### Tích cực

1. Người lao động linh hoạt hơn trong việc thay đổi công việc
2. Bảo vệ tốt hơn cho lao động yếu thế
3. Hệ thống hợp đồng đơn giản hơn

### Thách thức

1. Doanh nghiệp phải điều chỉnh chính sách nhân sự
2. Chi phí lao động tăng (đặc biệt làm thêm giờ)
3. Cần cập nhật nội quy lao động

## Kết Luận

Bộ luật Lao động 2019 đánh dấu bước tiến lớn trong bảo vệ quyền lợi người lao động. Cả người lao động và doanh nghiệp cần nắm vững các quy định để đảm bảo tuân thủ.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn về vấn đề lao động.`
    },
    {
      title: 'Trọng Tài Thương Mại Tại Việt Nam: Ưu Điểm Và Quy Trình',
      slug: 'trong-tai-thuong-mai-viet-nam-uu-diem-quy-trinh',
      category: 'guide',
      publishedDate: '2026-03-15',
      excerpt: 'Tìm hiểu về trọng tài thương mại tại Việt Nam: khi nào nên chọn trọng tài thay vì tòa án, quy trình tố tụng và chi phí.',
      content: `# Trọng Tài Thương Mại Tại Việt Nam

## Giới Thiệu

Trọng tài thương mại ngày càng được ưa chuộng tại Việt Nam như một phương thức giải quyết tranh chấp hiệu quả thay thế cho tòa án. Trung tâm Trọng tài Quốc tế Việt Nam (VIAC) ghi nhận số vụ tranh chấp tăng đều hàng năm, cho thấy sự tin tưởng ngày càng lớn của cộng đồng doanh nghiệp.

## Khi Nào Nên Chọn Trọng Tài?

### Trọng tài phù hợp khi:

- Tranh chấp giữa các doanh nghiệp (B2B)
- Giao dịch thương mại quốc tế
- Cần bảo mật thông tin kinh doanh
- Muốn giải quyết nhanh hơn tòa án
- Cần phán quyết có hiệu lực quốc tế

### Tòa án phù hợp hơn khi:

- Tranh chấp giá trị nhỏ
- Cần áp dụng biện pháp khẩn cấp tạm thời
- Một bên không đồng ý trọng tài
- Tranh chấp lao động, hôn nhân gia đình

## Quy Trình Trọng Tài Tại VIAC

### Bước 1: Nộp đơn khởi kiện

- Đơn khởi kiện kèm thỏa thuận trọng tài
- Tóm tắt vụ tranh chấp và yêu cầu
- Tạm ứng phí trọng tài

### Bước 2: Chọn trọng tài viên

- Mỗi bên chọn 1 trọng tài viên
- Hai trọng tài viên chọn chủ tịch Hội đồng
- Hoặc các bên đồng ý trọng tài viên duy nhất

### Bước 3: Phiên họp giải quyết tranh chấp

- Trao đổi bản tự bảo vệ và chứng cứ
- Phiên điều trần (hearing)
- Hội đồng trọng tài xem xét, đánh giá

### Bước 4: Phán quyết trọng tài

- Phán quyết được ban hành bằng văn bản
- Phán quyết là chung thẩm, có hiệu lực thi hành
- Có thể yêu cầu tòa án hủy phán quyết (điều kiện hạn chế)

## Ưu Điểm Của Trọng Tài

1. **Nhanh chóng**: Thường 3-6 tháng (so với 12-24 tháng tại tòa)
2. **Bảo mật**: Phiên họp kín, không công khai
3. **Linh hoạt**: Các bên chọn ngôn ngữ, địa điểm, quy tắc tố tụng
4. **Chuyên môn**: Trọng tài viên có chuyên môn trong lĩnh vực tranh chấp
5. **Thi hành quốc tế**: Theo Công ước New York 1958

## Chi Phí Trọng Tài

Phí trọng tài tại VIAC được tính theo giá trị tranh chấp:

- Tranh chấp dưới 100 triệu VNĐ: phí cố định
- Tranh chấp 100 triệu - 10 tỷ VNĐ: tỷ lệ giảm dần
- Tranh chấp trên 10 tỷ VNĐ: thương lượng

Chi phí bao gồm: phí trọng tài, phí hành chính, chi phí luật sư.

## Điều Khoản Trọng Tài Mẫu

Luật sư Võ Thiện Hiển khuyến nghị đưa điều khoản trọng tài vào hợp đồng:

> "Mọi tranh chấp phát sinh từ hoặc liên quan đến hợp đồng này sẽ được giải quyết bằng trọng tài tại Trung tâm Trọng tài Quốc tế Việt Nam (VIAC) theo Quy tắc tố tụng trọng tài của VIAC."

## Kết Luận

Trọng tài thương mại là lựa chọn thông minh cho các tranh chấp kinh doanh. Với sự hỗ trợ của luật sư có kinh nghiệm, doanh nghiệp có thể tận dụng tối đa ưu điểm của phương thức này.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn về trọng tài thương mại.`
    },
    {
      title: 'Thủ Tục Đăng Ký Kết Hôn Với Người Nước Ngoài Tại Việt Nam',
      slug: 'thu-tuc-dang-ky-ket-hon-voi-nguoi-nuoc-ngoai',
      category: 'guide',
      publishedDate: '2026-03-12',
      excerpt: 'Hướng dẫn chi tiết thủ tục đăng ký kết hôn với người nước ngoài tại Việt Nam: hồ sơ, quy trình, thời gian và chi phí.',
      content: `# Thủ Tục Đăng Ký Kết Hôn Với Người Nước Ngoài Tại Việt Nam

## Điều Kiện Kết Hôn

Theo Luật Hôn nhân và Gia đình 2014 và Nghị định 123/2015/NĐ-CP, việc kết hôn với người nước ngoài phải đáp ứng:

### Điều kiện chung

- Nam từ đủ 20 tuổi, nữ từ đủ 18 tuổi
- Tự nguyện, không bị ép buộc
- Không thuộc trường hợp cấm kết hôn
- Mỗi bên chỉ được có một vợ/chồng

### Điều kiện riêng cho người nước ngoài

- Đáp ứng điều kiện kết hôn theo pháp luật nước mình
- Có giấy xác nhận tình trạng hôn nhân từ cơ quan có thẩm quyền

## Hồ Sơ Cần Chuẩn Bị

### Bên Việt Nam

- Tờ khai đăng ký kết hôn
- CCCD/CMND bản sao có chứng thực
- Giấy xác nhận tình trạng hôn nhân (UBND cấp xã)
- Giấy khám sức khỏe (không quá 6 tháng)

### Bên nước ngoài

- Hộ chiếu bản sao có chứng thực
- Giấy xác nhận tình trạng hôn nhân (lãnh sự quán hoặc cơ quan có thẩm quyền)
- Giấy khám sức khỏe tại Việt Nam
- Thị thực/visa hợp lệ

**Lưu ý**: Tất cả giấy tờ bằng tiếng nước ngoài phải được dịch thuật công chứng sang tiếng Việt và hợp pháp hóa lãnh sự.

## Quy Trình Đăng Ký

### Bước 1: Chuẩn bị hồ sơ (1-2 tuần)

Thu thập và hợp pháp hóa toàn bộ giấy tờ cần thiết.

### Bước 2: Nộp hồ sơ tại UBND cấp huyện/quận

Nơi đăng ký: UBND quận/huyện nơi cư trú của bên Việt Nam.

### Bước 3: Xác minh hồ sơ (15 ngày làm việc)

UBND phối hợp với công an để xác minh. Thời gian có thể kéo dài đến 25 ngày.

### Bước 4: Phỏng vấn (nếu cần)

Cán bộ tư pháp có thể phỏng vấn riêng từng bên để xác nhận tính tự nguyện.

### Bước 5: Cấp Giấy chứng nhận đăng ký kết hôn

Hai bên có mặt tại UBND để nhận Giấy chứng nhận.

## Chi Phí

- Phí đăng ký kết hôn: 1.500.000 VNĐ (theo quy định)
- Chi phí dịch thuật: 500.000 - 2.000.000 VNĐ
- Hợp pháp hóa lãnh sự: tùy quốc gia
- Chi phí luật sư tư vấn: thương lượng

## Lưu Ý Quan Trọng

1. **Hợp pháp hóa lãnh sự**: Giấy tờ nước ngoài phải được hợp pháp hóa tại Đại sứ quán/Lãnh sự quán Việt Nam ở nước sở tại
2. **Thời hạn giấy tờ**: Giấy xác nhận tình trạng hôn nhân chỉ có giá trị 6 tháng
3. **Dịch thuật**: Phải là dịch thuật công chứng (không chấp nhận tự dịch)
4. **Từ chối đăng ký**: UBND có quyền từ chối nếu phát hiện kết hôn giả

## Kết Luận

Đăng ký kết hôn với người nước ngoài có nhiều thủ tục phức tạp hơn so với kết hôn trong nước. Sự hỗ trợ của luật sư giúp đảm bảo hồ sơ đầy đủ và quy trình thuận lợi.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn thủ tục kết hôn có yếu tố nước ngoài.`
    },
    {
      title: 'Bảo Hộ Nhãn Hiệu Tại Việt Nam: Từ Đăng Ký Đến Bảo Vệ Quyền',
      slug: 'bao-ho-nhan-hieu-tai-viet-nam-dang-ky-bao-ve',
      category: 'guide',
      publishedDate: '2026-03-10',
      excerpt: 'Hướng dẫn toàn diện quy trình đăng ký bảo hộ nhãn hiệu tại Việt Nam và cách bảo vệ thương hiệu khỏi bị xâm phạm.',
      content: `# Bảo Hộ Nhãn Hiệu Tại Việt Nam

## Tại Sao Cần Đăng Ký Nhãn Hiệu?

Nhãn hiệu là tài sản vô hình quan trọng của doanh nghiệp. Tại Việt Nam, quyền sở hữu nhãn hiệu phát sinh dựa trên nguyên tắc **"nộp đơn đầu tiên"** (first-to-file), nghĩa là ai đăng ký trước sẽ được bảo hộ, bất kể ai sử dụng trước.

## Điều Kiện Bảo Hộ Nhãn Hiệu

Theo Luật Sở hữu trí tuệ, nhãn hiệu được bảo hộ khi:

- Có khả năng phân biệt hàng hóa, dịch vụ
- Không thuộc các trường hợp bị từ chối (giống quốc kỳ, quốc huy, mô tả...)
- Không trùng hoặc tương tự gây nhầm lẫn với nhãn hiệu đã đăng ký

## Quy Trình Đăng Ký

### 1. Tra cứu nhãn hiệu (2-5 ngày)

Kiểm tra tại Cục Sở hữu trí tuệ xem nhãn hiệu có trùng hoặc tương tự không.

### 2. Nộp đơn đăng ký

- Tờ khai đăng ký nhãn hiệu
- Mẫu nhãn hiệu (10 bản)
- Danh mục hàng hóa/dịch vụ (theo phân loại Nice)
- Phí nộp đơn

### 3. Thẩm định hình thức (1-2 tháng)

Cục SHTT kiểm tra tính hợp lệ của đơn.

### 4. Công bố đơn (2 tháng)

Đơn được công bố trên Công báo Sở hữu công nghiệp.

### 5. Thẩm định nội dung (9-12 tháng)

Đánh giá khả năng bảo hộ của nhãn hiệu.

### 6. Cấp Giấy chứng nhận

Nếu đáp ứng điều kiện, Cục SHTT cấp Giấy chứng nhận đăng ký nhãn hiệu.

## Thời Hạn và Gia Hạn

- Thời hạn bảo hộ: 10 năm kể từ ngày nộp đơn
- Có thể gia hạn nhiều lần, mỗi lần 10 năm
- Phải nộp đơn gia hạn trước khi hết hạn 6 tháng

## Bảo Vệ Nhãn Hiệu Khi Bị Xâm Phạm

### Biện pháp dân sự

- Yêu cầu chấm dứt hành vi xâm phạm
- Yêu cầu bồi thường thiệt hại
- Khởi kiện tại tòa án

### Biện pháp hành chính

- Khiếu nại đến Thanh tra Bộ Khoa học và Công nghệ
- Xử phạt vi phạm hành chính (phạt tiền, tịch thu hàng hóa)

### Biện pháp hình sự

Áp dụng cho vi phạm nghiêm trọng với mục đích thương mại.

## Kết Luận

Đăng ký nhãn hiệu là đầu tư chiến lược cho mọi doanh nghiệp. Hãy bảo vệ thương hiệu của bạn ngay từ đầu.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn đăng ký và bảo vệ nhãn hiệu.`
    },
    {
      title: 'Phá Sản Doanh Nghiệp: Quy Trình Pháp Lý Và Hệ Quả',
      slug: 'pha-san-doanh-nghiep-quy-trinh-phap-ly-he-qua',
      category: 'analysis',
      publishedDate: '2026-03-08',
      excerpt: 'Phân tích quy trình phá sản doanh nghiệp theo Luật Phá sản 2014, quyền lợi của chủ nợ và người lao động, hệ quả pháp lý.',
      content: `# Phá Sản Doanh Nghiệp: Quy Trình Pháp Lý Và Hệ Quả

## Giới Thiệu

Phá sản là quy trình pháp lý giải quyết tình trạng mất khả năng thanh toán của doanh nghiệp. Luật Phá sản 2014 quy định chi tiết quy trình này, nhằm bảo vệ quyền lợi hợp pháp của tất cả các bên liên quan.

## Điều Kiện Mở Thủ Tục Phá Sản

Doanh nghiệp bị coi là mất khả năng thanh toán khi:

- Không thực hiện nghĩa vụ thanh toán khoản nợ trong thời hạn 3 tháng kể từ ngày đến hạn

### Ai có quyền nộp đơn?

- **Chủ nợ** (khi đã yêu cầu thanh toán nhưng không được)
- **Người lao động** (khi không được trả lương)
- **Chính doanh nghiệp** (tự nhận thức mất khả năng thanh toán)
- **Cổ đông/thành viên** (trong một số trường hợp)

## Quy Trình Phá Sản

### Giai đoạn 1: Nộp đơn và thụ lý

- Nộp đơn yêu cầu mở thủ tục phá sản tại tòa án
- Tòa án xem xét và ra quyết định thụ lý (30 ngày)
- Chỉ định quản tài viên hoặc doanh nghiệp quản lý, thanh lý tài sản

### Giai đoạn 2: Hội nghị chủ nợ

- Lập danh sách chủ nợ và khoản nợ
- Triệu tập hội nghị chủ nợ
- Biểu quyết phương án phục hồi hoặc thanh lý

### Giai đoạn 3: Phục hồi hoạt động (nếu được)

- Doanh nghiệp đề xuất phương án phục hồi
- Hội nghị chủ nợ thông qua
- Thời gian phục hồi: tối đa 3 năm

### Giai đoạn 4: Tuyên bố phá sản

Nếu không phục hồi được:
- Tòa án ra quyết định tuyên bố phá sản
- Thanh lý tài sản theo thứ tự ưu tiên

## Thứ Tự Thanh Toán

1. Chi phí phá sản
2. Nợ lương, trợ cấp thôi việc, BHXH của người lao động
3. Nợ phát sinh sau khi mở thủ tục phá sản
4. Nợ thuế
5. Nợ không có bảo đảm

## Hệ Quả Pháp Lý

### Đối với doanh nghiệp

- Chấm dứt hoạt động
- Xóa tên trong sổ đăng ký kinh doanh

### Đối với người quản lý

- Không được thành lập doanh nghiệp trong 3 năm (nếu có lỗi)
- Không được giữ chức vụ quản lý trong thời gian cấm

### Đối với người lao động

- Được ưu tiên thanh toán nợ lương
- Được hưởng trợ cấp thất nghiệp theo quy định

## Kết Luận

Phá sản không phải kết thúc mà là cơ hội để tái cơ cấu. Sự tư vấn pháp lý chuyên nghiệp giúp doanh nghiệp và chủ nợ bảo vệ tối đa quyền lợi.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn về phá sản doanh nghiệp.`
    },
    {
      title: 'Hợp Đồng Đặt Cọc Mua Bất Động Sản: Rủi Ro và Cách Phòng Tránh',
      slug: 'hop-dong-dat-coc-mua-bat-dong-san-rui-ro',
      category: 'guide',
      publishedDate: '2026-03-05',
      excerpt: 'Phân tích các rủi ro pháp lý thường gặp trong hợp đồng đặt cọc mua bất động sản và giải pháp bảo vệ quyền lợi.',
      content: `# Hợp Đồng Đặt Cọc Mua Bất Động Sản: Rủi Ro và Cách Phòng Tránh

## Đặt Cọc Là Gì?

Theo Điều 328 Bộ luật Dân sự 2015, đặt cọc là việc một bên giao cho bên kia một khoản tiền hoặc tài sản có giá trị trong một thời hạn để bảo đảm giao kết hoặc thực hiện hợp đồng.

## Quy Định Pháp Luật

### Hệ quả khi vi phạm

- **Bên đặt cọc không mua**: Mất tiền đặt cọc
- **Bên nhận cọc không bán**: Phải trả lại tiền cọc và bồi thường tương đương

### Mức đặt cọc

Pháp luật không giới hạn mức đặt cọc, nhưng thông thường:

- Đất nền, nhà phố: 10-30% giá trị giao dịch
- Căn hộ chung cư: 5-10%
- Bất động sản giá trị lớn: Theo thỏa thuận

## Rủi Ro Thường Gặp

### 1. Bên bán không có quyền bán

- Tài sản đang thế chấp ngân hàng
- Tài sản là tài sản chung vợ chồng nhưng chỉ một bên ký
- Giấy tờ giả hoặc không hợp lệ

### 2. Bất động sản có vấn đề pháp lý

- Đang có tranh chấp
- Nằm trong quy hoạch
- Bị kê biên, phong tỏa

### 3. Điều khoản hợp đồng bất lợi

- Thời hạn đặt cọc quá ngắn
- Điều kiện hoàn trả cọc mơ hồ
- Không quy định chế tài rõ ràng

### 4. Lừa đảo

- Bán một tài sản cho nhiều người
- Thu tiền cọc rồi bỏ trốn
- Giả mạo chủ sở hữu

## Cách Phòng Tránh

### Trước khi đặt cọc

1. **Kiểm tra tình trạng pháp lý** tại Văn phòng Đăng ký đất đai
2. **Xác minh chủ sở hữu** qua CCCD và Giấy chứng nhận
3. **Kiểm tra quy hoạch** tại UBND quận/huyện
4. **Xem xét thực tế** bất động sản (vị trí, hiện trạng)

### Trong hợp đồng đặt cọc

1. Ghi rõ thông tin bất động sản (số thửa, tờ bản đồ, diện tích)
2. Quy định rõ thời hạn và điều kiện ký hợp đồng chính thức
3. Cam kết của bên bán về tình trạng pháp lý
4. Điều khoản hoàn trả cọc khi phát hiện vi phạm
5. Phạt vi phạm cụ thể cho từng trường hợp
6. **Công chứng hợp đồng đặt cọc** (khuyến nghị)

### Sau khi đặt cọc

1. Giữ bản gốc hợp đồng đặt cọc
2. Lưu giữ chứng từ chuyển tiền
3. Theo dõi tiến độ thực hiện
4. Liên hệ luật sư ngay khi phát hiện bất thường

## Kết Luận

Đặt cọc mua bất động sản luôn tiềm ẩn rủi ro. Sự thận trọng và tư vấn pháp lý chuyên nghiệp là cách tốt nhất để bảo vệ tài sản của bạn.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn trước khi ký hợp đồng đặt cọc.`
    },
    {
      title: 'Bảo Hiểm Xã Hội Một Lần: Điều Kiện, Thủ Tục và Lưu Ý',
      slug: 'bao-hiem-xa-hoi-mot-lan-dieu-kien-thu-tuc',
      category: 'guide',
      publishedDate: '2026-03-02',
      excerpt: 'Hướng dẫn chi tiết điều kiện hưởng BHXH một lần, hồ sơ, thủ tục và những điều cần cân nhắc trước khi rút.',
      content: `# Bảo Hiểm Xã Hội Một Lần

## Giới Thiệu

Bảo hiểm xã hội (BHXH) một lần là chế độ cho phép người lao động nhận toàn bộ số tiền BHXH đã đóng trong một lần thay vì chờ hưởng lương hưu. Đây là quyết định quan trọng cần cân nhắc kỹ vì ảnh hưởng đến quyền lợi lâu dài.

## Điều Kiện Hưởng BHXH Một Lần

Theo Luật BHXH 2014 (sửa đổi), người lao động được hưởng BHXH một lần khi:

1. **Đủ tuổi nghỉ hưu nhưng chưa đủ 20 năm đóng BHXH**
2. **Ra nước ngoài để định cư**
3. **Mắc bệnh nguy hiểm đến tính mạng** (ung thư, AIDS, suy thận, gan...)
4. **Sau 1 năm không tham gia BHXH và chưa đủ 20 năm đóng** (điều kiện phổ biến nhất)

## Mức Hưởng

### Công thức tính

- Mỗi năm đóng BHXH trước 2014: 1,5 tháng lương bình quân
- Mỗi năm đóng BHXH từ 2014: 2 tháng lương bình quân
- Thời gian đóng dưới 1 năm: bằng số tiền đã đóng (NLĐ + người SDLĐ)

### Ví dụ minh họa

Anh A đóng BHXH 8 năm (2016-2024), mức lương bình quân 10 triệu/tháng:

- Mức hưởng = 8 năm × 2 tháng = 16 tháng lương
- Số tiền = 16 × 10.000.000 = 160.000.000 VNĐ

## Hồ Sơ Cần Chuẩn Bị

- Đơn đề nghị hưởng BHXH một lần
- Sổ BHXH (bản gốc)
- CCCD/CMND (bản sao có chứng thực)
- Giấy tờ bổ sung tùy trường hợp (giấy xác nhận định cư, kết luận y tế...)

## Quy Trình

### Bước 1: Chốt sổ BHXH

Liên hệ đơn vị sử dụng lao động cuối cùng để chốt sổ.

### Bước 2: Nộp hồ sơ

Nộp tại cơ quan BHXH quận/huyện nơi cư trú hoặc nơi đóng BHXH cuối cùng.

### Bước 3: Nhận quyết định

Thời gian xử lý: 10-15 ngày làm việc.

### Bước 4: Nhận tiền

Nhận qua tài khoản ngân hàng hoặc tại cơ quan BHXH.

## Những Điều Cần Cân Nhắc

### Nên rút khi

- Cần vốn kinh doanh gấp
- Định cư nước ngoài vĩnh viễn
- Tình trạng sức khỏe nghiêm trọng

### Không nên rút khi

- Còn trẻ và có thể đóng tiếp
- Đã đóng gần 20 năm (sắp đủ điều kiện hưu)
- Chưa có kế hoạch tài chính cụ thể

### Hệ quả khi rút BHXH một lần

- Mất quyền hưởng lương hưu
- Mất bảo hiểm y tế miễn phí khi về hưu
- Không được hưởng chế độ tử tuất cho thân nhân
- Số tiền nhận có thể thấp hơn tổng đã đóng + lãi

## Kết Luận

BHXH một lần là quyền của người lao động, nhưng cần cân nhắc kỹ trước khi quyết định. Tư vấn pháp lý giúp bạn hiểu rõ quyền lợi và đưa ra quyết định phù hợp nhất.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn về quyền lợi bảo hiểm xã hội.`
    },
    {
      title: 'Tranh Chấp Hợp Đồng Thuê Nhà: Quyền Và Nghĩa Vụ Của Các Bên',
      slug: 'tranh-chap-hop-dong-thue-nha-quyen-nghia-vu',
      category: 'guide',
      publishedDate: '2026-02-28',
      excerpt: 'Phân tích quyền và nghĩa vụ của bên cho thuê và bên thuê nhà, cách giải quyết tranh chấp và bảo vệ quyền lợi.',
      content: `# Tranh Chấp Hợp Đồng Thuê Nhà

## Tổng Quan

Tranh chấp hợp đồng thuê nhà là một trong những loại tranh chấp dân sự phổ biến nhất tại các thành phố lớn như TP.HCM và Hà Nội. Hiểu rõ quyền và nghĩa vụ giúp cả hai bên phòng tránh tranh chấp.

## Quyền và Nghĩa Vụ Của Bên Cho Thuê

### Quyền

- Nhận tiền thuê đúng hạn
- Yêu cầu bên thuê giữ gìn tài sản
- Đơn phương chấm dứt hợp đồng khi bên thuê vi phạm nghiêm trọng
- Yêu cầu bồi thường thiệt hại

### Nghĩa vụ

- Giao nhà đúng tình trạng thỏa thuận
- Bảo trì, sửa chữa lớn
- Không tự ý tăng giá trong thời hạn hợp đồng
- Tôn trọng quyền sử dụng của bên thuê

## Quyền và Nghĩa Vụ Của Bên Thuê

### Quyền

- Sử dụng nhà theo mục đích thỏa thuận
- Yêu cầu sửa chữa khi nhà hư hỏng
- Được ưu tiên thuê tiếp khi hết hạn
- Cho thuê lại một phần (nếu được đồng ý)

### Nghĩa vụ

- Trả tiền thuê đúng hạn
- Sử dụng đúng mục đích
- Bảo quản tài sản
- Trả nhà đúng tình trạng khi hết hạn

## Các Tranh Chấp Thường Gặp

### 1. Tiền đặt cọc

- Bên cho thuê không trả cọc khi hết hợp đồng
- Tranh chấp về mức khấu trừ cọc
- Giải pháp: Lập biên bản giao/nhận nhà chi tiết

### 2. Tăng giá thuê

- Tăng giá không đúng thỏa thuận
- Giải pháp: Quy định rõ cơ chế điều chỉnh giá trong hợp đồng

### 3. Sửa chữa, cải tạo

- Ai chịu chi phí sửa chữa?
- Bên thuê tự ý cải tạo
- Giải pháp: Quy định rõ trách nhiệm bảo trì

### 4. Chấm dứt hợp đồng trước hạn

- Một bên đơn phương chấm dứt
- Mức bồi thường khi chấm dứt sớm
- Giải pháp: Điều khoản chấm dứt rõ ràng

## Cách Giải Quyết Tranh Chấp

### Thương lượng

Luôn ưu tiên thương lượng trực tiếp. Ghi nhận bằng văn bản.

### Hòa giải

Nhờ bên thứ ba (tổ dân phố, UBND phường) hòa giải.

### Khởi kiện

Nộp đơn tại tòa án cấp quận/huyện nơi có bất động sản.

## Mẫu Điều Khoản Quan Trọng

Luật sư Võ Thiện Hiển khuyến nghị hợp đồng thuê nhà nên có:

- Thời hạn thuê cụ thể
- Giá thuê và phương thức thanh toán
- Mức đặt cọc và điều kiện hoàn trả
- Trách nhiệm sửa chữa, bảo trì
- Điều kiện chấm dứt hợp đồng
- Mức phạt vi phạm
- Giải quyết tranh chấp

## Kết Luận

Một hợp đồng thuê nhà được soạn thảo tốt là cách phòng ngừa tranh chấp hiệu quả nhất. Hãy tham khảo ý kiến luật sư trước khi ký kết.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn về hợp đồng thuê nhà.`
    },
    {
      title: 'Tội Phạm Công Nghệ Cao: Thực Trạng và Phòng Chống',
      slug: 'toi-pham-cong-nghe-cao-thuc-trang-phong-chong',
      category: 'commentary',
      publishedDate: '2026-02-25',
      excerpt: 'Phân tích các hình thức tội phạm công nghệ cao phổ biến tại Việt Nam, khung hình phạt và cách bảo vệ bản thân.',
      content: `# Tội Phạm Công Nghệ Cao Tại Việt Nam

## Giới Thiệu

Tội phạm sử dụng công nghệ cao đang gia tăng nhanh chóng tại Việt Nam. Năm 2025, cơ quan công an đã xử lý hàng nghìn vụ án liên quan đến lừa đảo trực tuyến, hack hệ thống, đánh cắp dữ liệu cá nhân.

## Các Hình Thức Phổ Biến

### 1. Lừa đảo chiếm đoạt tài sản qua mạng

- Giả mạo ngân hàng, cơ quan nhà nước
- Lừa đảo đầu tư tài chính
- Bán hàng giả trên sàn thương mại điện tử
- Giả mạo email doanh nghiệp (BEC fraud)

### 2. Xâm nhập hệ thống máy tính

- Tấn công ransomware
- Đánh cắp cơ sở dữ liệu
- Khai thác lỗ hổng bảo mật

### 3. Thu thập, sử dụng dữ liệu cá nhân trái phép

- Mua bán dữ liệu khách hàng
- Theo dõi, giám sát trái phép
- Sử dụng dữ liệu cho mục đích lừa đảo

### 4. Tội phạm liên quan đến tiền điện tử

- Lừa đảo qua dự án tiền ảo
- Rửa tiền qua cryptocurrency
- Đánh bạc trực tuyến

## Khung Hình Phạt

Theo Bộ luật Hình sự 2015 (sửa đổi 2017):

### Tội sử dụng mạng máy tính, mạng viễn thông để chiếm đoạt tài sản (Điều 290)

- Chiếm đoạt từ 2 triệu đến dưới 50 triệu: phạt cải tạo đến 3 năm hoặc tù 6 tháng - 3 năm
- Chiếm đoạt từ 50 triệu đến dưới 200 triệu: tù 2 - 7 năm
- Chiếm đoạt từ 200 triệu đến dưới 500 triệu: tù 7 - 12 năm
- Chiếm đoạt 500 triệu trở lên: tù 12 - 20 năm

### Tội xâm nhập trái phép hệ thống máy tính (Điều 289)

- Phạt tiền 50 - 200 triệu hoặc tù 1 - 5 năm
- Trường hợp nghiêm trọng: tù 3 - 7 năm

## Cách Phòng Tránh

1. **Không chia sẻ mã OTP, mật khẩu** cho bất kỳ ai
2. **Xác minh danh tính** trước khi chuyển tiền
3. **Sử dụng xác thực 2 lớp** cho tất cả tài khoản
4. **Cập nhật phần mềm** thường xuyên
5. **Cảnh giác** với lợi nhuận bất thường

## Khi Bị Hại

1. Giữ lại mọi bằng chứng (tin nhắn, chuyển khoản, email)
2. Trình báo công an ngay lập tức
3. Liên hệ ngân hàng để phong tỏa tài khoản
4. Tìm luật sư hỗ trợ khởi kiện dân sự

## Kết Luận

Tội phạm công nghệ cao ngày càng tinh vi, đòi hỏi sự cảnh giác của mọi người. Khi trở thành nạn nhân, hãy hành động nhanh chóng và tìm kiếm sự hỗ trợ pháp lý.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn khi gặp vấn đề liên quan đến tội phạm công nghệ.`
    },
    {
      title: 'Thủ Tục Xin Cấp Phép Xây Dựng: Hướng Dẫn Chi Tiết',
      slug: 'thu-tuc-xin-cap-phep-xay-dung-huong-dan',
      category: 'guide',
      publishedDate: '2026-02-22',
      excerpt: 'Hướng dẫn từ A-Z thủ tục xin cấp phép xây dựng nhà ở tại Việt Nam: hồ sơ, quy trình, thời gian và lưu ý quan trọng.',
      content: `# Thủ Tục Xin Cấp Phép Xây Dựng

## Khi Nào Cần Giấy Phép Xây Dựng?

Theo Luật Xây dựng, hầu hết công trình xây dựng đều cần giấy phép, trừ một số trường hợp miễn phép:

### Được miễn giấy phép

- Nhà ở riêng lẻ tại nông thôn (ngoài khu vực bảo tồn)
- Công trình sửa chữa nhỏ, không ảnh hưởng kết cấu
- Công trình tạm phục vụ thi công

### Bắt buộc có giấy phép

- Xây mới nhà ở tại đô thị
- Cải tạo, nâng tầng, mở rộng
- Công trình thương mại, công nghiệp

## Hồ Sơ Cần Chuẩn Bị

### Giấy tờ pháp lý

- Đơn xin cấp giấy phép xây dựng
- Giấy chứng nhận quyền sử dụng đất (sổ đỏ/sổ hồng)
- CCCD/CMND chủ đầu tư

### Hồ sơ thiết kế

- Bản vẽ kiến trúc (mặt bằng, mặt đứng, mặt cắt)
- Bản vẽ kết cấu
- Bản vẽ hệ thống điện, nước
- Thiết kế phải do đơn vị có năng lực thiết kế thực hiện

### Giấy tờ bổ sung (tùy trường hợp)

- Biên bản họp gia đình (nếu đất chung)
- Cam kết bảo vệ môi trường
- Ý kiến hàng xóm về ranh giới

## Quy Trình

### Bước 1: Thuê đơn vị thiết kế

Chọn đơn vị thiết kế có giấy phép hành nghề. Chi phí: 15-50 triệu VNĐ tùy quy mô.

### Bước 2: Nộp hồ sơ

Nộp tại Bộ phận tiếp nhận của UBND quận/huyện hoặc Sở Xây dựng (công trình lớn).

### Bước 3: Thẩm định

- Nhà ở riêng lẻ: 15 ngày làm việc
- Công trình khác: 20-30 ngày làm việc

### Bước 4: Nhận giấy phép

Nhận giấy phép xây dựng tại nơi nộp hồ sơ.

## Chi Phí

| Khoản mục | Chi phí |
|-----------|---------|
| Lệ phí cấp phép | 75.000 - 150.000 VNĐ |
| Thiết kế kiến trúc | 15 - 50 triệu VNĐ |
| Thẩm định phòng cháy | 3 - 10 triệu VNĐ |

## Lưu Ý Quan Trọng

1. **Xây không phép** bị phạt 30-70 triệu VNĐ và có thể bị buộc tháo dỡ
2. **Xây sai phép** bị phạt và buộc cải tạo hoặc tháo dỡ phần sai
3. **Thời hạn giấy phép**: Phải khởi công trong 12 tháng kể từ ngày cấp
4. **Điều chỉnh giấy phép**: Nếu thay đổi thiết kế phải xin điều chỉnh trước khi thi công

## Kết Luận

Tuân thủ quy trình cấp phép xây dựng giúp bảo vệ quyền lợi hợp pháp và tránh rủi ro pháp lý. Hãy tham khảo ý kiến chuyên gia trước khi xây dựng.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn pháp lý về xây dựng.`
    },
    {
      title: 'Giải Quyết Tranh Chấp Bằng Hòa Giải: Phương Thức Thay Thế Hiệu Quả',
      slug: 'giai-quyet-tranh-chap-bang-hoa-giai',
      category: 'analysis',
      publishedDate: '2026-02-20',
      excerpt: 'Phân tích phương thức hòa giải trong giải quyết tranh chấp: ưu điểm, quy trình và khi nào nên chọn hòa giải thay vì khởi kiện.',
      content: `# Giải Quyết Tranh Chấp Bằng Hòa Giải

## Giới Thiệu

Hòa giải là phương thức giải quyết tranh chấp ngày càng được khuyến khích tại Việt Nam. Luật Hòa giải đối thoại tại Tòa án 2020 và Nghị định về hòa giải thương mại đã tạo khung pháp lý vững chắc cho phương thức này.

## Các Hình Thức Hòa Giải

### 1. Hòa giải cơ sở

Do tổ hòa giải tại phường/xã thực hiện. Phù hợp cho tranh chấp nhỏ giữa cá nhân.

### 2. Hòa giải tại Tòa án

Thực hiện bởi Hòa giải viên do Tòa án chỉ định, trước khi đưa vụ án ra xét xử.

### 3. Hòa giải thương mại

Do trung tâm hòa giải hoặc hòa giải viên thương mại thực hiện. Phù hợp cho tranh chấp kinh doanh.

## Ưu Điểm Của Hòa Giải

1. **Tiết kiệm thời gian**: Thường chỉ 1-3 tháng (so với 6-24 tháng tại tòa)
2. **Tiết kiệm chi phí**: Chi phí thấp hơn đáng kể so với tố tụng
3. **Bảo mật**: Nội dung hòa giải được giữ kín
4. **Duy trì quan hệ**: Giữ quan hệ kinh doanh, gia đình
5. **Linh hoạt**: Các bên tự quyết định giải pháp
6. **Tự nguyện**: Không ai bị ép buộc chấp nhận

## Quy Trình Hòa Giải Tại Tòa Án

### Bước 1: Yêu cầu hòa giải

Khi nhận đơn khởi kiện, Tòa án chỉ định Hòa giải viên.

### Bước 2: Chuẩn bị

- Hòa giải viên nghiên cứu hồ sơ
- Gặp riêng từng bên để tìm hiểu
- Xác định các vấn đề cần giải quyết

### Bước 3: Phiên hòa giải

- Các bên trình bày quan điểm
- Hòa giải viên hỗ trợ tìm giải pháp
- Có thể tổ chức nhiều phiên

### Bước 4: Kết quả

- Nếu thành công: Lập biên bản hòa giải thành → Tòa án công nhận
- Nếu không thành: Chuyển sang xét xử

## Giá Trị Pháp Lý

Thỏa thuận hòa giải thành được Tòa án công nhận có hiệu lực:

- Không bị kháng cáo, kháng nghị
- Có thể cưỡng chế thi hành
- Có giá trị như bản án của Tòa

## Khi Nào Nên Chọn Hòa Giải?

- Tranh chấp hợp đồng giá trị vừa phải
- Muốn giữ quan hệ kinh doanh
- Vụ việc có khả năng thỏa hiệp cao
- Muốn tiết kiệm thời gian và chi phí

## Khi Nào Không Nên Hòa Giải?

- Một bên không thiện chí
- Cần án lệ hoặc tiền lệ pháp lý
- Tranh chấp về nguyên tắc (không thể thỏa hiệp)
- Cần biện pháp khẩn cấp tạm thời

## Kết Luận

Hòa giải là phương thức giải quyết tranh chấp văn minh, hiệu quả. Sự hỗ trợ của luật sư giúp bạn chuẩn bị tốt và đạt kết quả tối ưu trong hòa giải.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn phương thức giải quyết tranh chấp phù hợp nhất.`
    },
    {
      title: 'Luật Nhà Ở 2023: Những Thay Đổi Ảnh Hưởng Đến Người Mua Nhà',
      slug: 'luat-nha-o-2023-thay-doi-anh-huong-nguoi-mua-nha',
      category: 'commentary',
      publishedDate: '2026-02-18',
      excerpt: 'Phân tích những điểm mới quan trọng trong Luật Nhà ở 2023 và tác động đến quyền lợi người mua nhà tại Việt Nam.',
      content: `# Luật Nhà Ở 2023: Những Thay Đổi Ảnh Hưởng Đến Người Mua Nhà

## Giới Thiệu

Luật Nhà ở 2023 (số 27/2023/QH15) có hiệu lực từ ngày 01/8/2024, thay thế Luật Nhà ở 2014. Luật mới mang đến nhiều thay đổi quan trọng ảnh hưởng trực tiếp đến người mua nhà.

## Điểm Mới Quan Trọng

### 1. Quyền sở hữu nhà ở của người nước ngoài

**Trước đây**: Người nước ngoài chỉ được mua căn hộ chung cư, không quá 30% số căn trong một tòa nhà.

**Luật mới**:
- Mở rộng đối tượng được mua nhà
- Nới lỏng điều kiện về số lượng nhà được sở hữu
- Thời hạn sở hữu tối đa: 50 năm (có thể gia hạn)

### 2. Chung cư mini

- Được công nhận chính thức là loại hình nhà ở
- Phải đáp ứng tiêu chuẩn an toàn PCCC
- Diện tích tối thiểu mỗi căn: 25m²
- Phải có giấy phép xây dựng

### 3. Bảo lãnh ngân hàng

- Chủ đầu tư bắt buộc phải có bảo lãnh ngân hàng trước khi bán nhà hình thành trong tương lai
- Người mua được bảo vệ tốt hơn trong trường hợp chủ đầu tư phá sản

### 4. Thanh toán mua nhà hình thành trong tương lai

- Lần đầu: không quá 30% giá trị hợp đồng
- Tổng thanh toán trước bàn giao: không quá 70%
- 5% giữ lại đến khi hoàn thành sổ hồng

### 5. Sổ hồng chung cư

- Chủ đầu tư phải làm sổ hồng trong 50 ngày kể từ bàn giao
- Nếu chậm: bị phạt và người mua có quyền kiện

## Tác Động Đến Người Mua Nhà

### Tích cực

1. Được bảo vệ tốt hơn với bảo lãnh ngân hàng
2. Rõ ràng hơn về tiến độ thanh toán
3. Thời hạn cấp sổ hồng được quy định cụ thể

### Cần lưu ý

1. Kiểm tra bảo lãnh ngân hàng trước khi mua
2. Không thanh toán vượt tỷ lệ quy định
3. Yêu cầu cam kết về thời hạn cấp sổ

## Kết Luận

Luật Nhà ở 2023 tạo khung pháp lý bảo vệ người mua nhà tốt hơn. Tuy nhiên, người mua vẫn cần tìm hiểu kỹ và có sự tư vấn pháp lý chuyên nghiệp.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn về pháp luật nhà ở và bất động sản.`
    },
    {
      title: 'Quy Trình Thi Hành Án Dân Sự: Từ Bản Án Đến Thực Thi',
      slug: 'quy-trinh-thi-hanh-an-dan-su-tu-ban-an-den-thuc-thi',
      category: 'guide',
      publishedDate: '2026-02-15',
      excerpt: 'Hướng dẫn chi tiết quy trình thi hành án dân sự tại Việt Nam: từ yêu cầu thi hành đến cưỡng chế thực hiện.',
      content: `# Quy Trình Thi Hành Án Dân Sự

## Giới Thiệu

Thi hành án dân sự là giai đoạn cuối cùng và quan trọng nhất trong quá trình giải quyết tranh chấp. Nhiều người thắng kiện nhưng không thể thu hồi được quyền lợi do không nắm rõ quy trình thi hành án.

## Ai Có Quyền Yêu Cầu Thi Hành Án?

- Người được thi hành án (bên thắng kiện)
- Người đại diện theo pháp luật
- Luật sư được ủy quyền

## Quy Trình Thi Hành Án

### Bước 1: Nhận bản án/quyết định có hiệu lực

- Bản án sơ thẩm: có hiệu lực sau 15 ngày (nếu không kháng cáo)
- Bản án phúc thẩm: có hiệu lực ngay
- Quyết định công nhận hòa giải: có hiệu lực ngay

### Bước 2: Nộp đơn yêu cầu thi hành án

- Nộp tại Chi cục/Cục Thi hành án dân sự
- Kèm bản án/quyết định (bản sao có chứng thực)
- Thời hiệu: 5 năm kể từ ngày bản án có hiệu lực

### Bước 3: Thụ lý và ra quyết định thi hành án

- Thời gian: 5 ngày kể từ ngày nhận đơn hợp lệ
- Chấp hành viên được phân công

### Bước 4: Thông báo cho người phải thi hành

- Ấn định thời hạn tự nguyện thi hành: 10 ngày
- Nếu tự nguyện thi hành: kết thúc

### Bước 5: Xác minh tài sản

Nếu không tự nguyện, Chấp hành viên:
- Xác minh tài sản, thu nhập của người phải thi hành
- Yêu cầu ngân hàng, cơ quan đất đai cung cấp thông tin
- Người yêu cầu thi hành có thể cung cấp thông tin tài sản

### Bước 6: Áp dụng biện pháp cưỡng chế

- Khấu trừ tiền trong tài khoản ngân hàng
- Trừ vào thu nhập
- Kê biên, bán đấu giá tài sản
- Cưỡng chế giao tài sản, nhà đất

## Thời Gian Thi Hành

Không có thời hạn cố định. Phụ thuộc vào:
- Tính phức tạp của vụ việc
- Khả năng tài sản của người phải thi hành
- Sự hợp tác của các bên

## Khó Khăn Thường Gặp

1. Người phải thi hành tẩu tán tài sản
2. Không xác minh được tài sản
3. Tài sản đã bị thế chấp
4. Người phải thi hành bỏ trốn

## Giải Pháp

1. **Yêu cầu áp dụng biện pháp bảo đảm** ngay từ giai đoạn kiện
2. **Cung cấp thông tin tài sản** cho Chấp hành viên
3. **Theo dõi, đôn đốc** quá trình thi hành
4. **Có luật sư đại diện** trong quá trình thi hành án

## Kết Luận

Thắng kiện chỉ là nửa chặng đường. Thi hành án hiệu quả đòi hỏi sự chuẩn bị từ sớm và hỗ trợ pháp lý chuyên nghiệp.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được hỗ trợ thi hành án dân sự.`
    },
    {
      title: 'Pháp Luật Về Cho Vay Ngang Hàng (P2P Lending) Tại Việt Nam',
      slug: 'phap-luat-cho-vay-ngang-hang-p2p-lending-viet-nam',
      category: 'analysis',
      publishedDate: '2026-02-12',
      excerpt: 'Phân tích khung pháp lý cho vay ngang hàng tại Việt Nam, rủi ro pháp lý và cách bảo vệ quyền lợi người cho vay và vay.',
      content: `# Pháp Luật Về Cho Vay Ngang Hàng (P2P Lending) Tại Việt Nam

## Giới Thiệu

Cho vay ngang hàng (Peer-to-Peer Lending) là hình thức cho vay trực tiếp giữa người cho vay và người vay thông qua nền tảng công nghệ, không qua trung gian ngân hàng. Tại Việt Nam, P2P Lending phát triển nhanh nhưng khung pháp lý vẫn đang hoàn thiện.

## Hiện Trạng Pháp Lý

### Sandbox (thí điểm)

Ngân hàng Nhà nước Việt Nam đã cho phép một số nền tảng P2P Lending hoạt động thí điểm theo Nghị định về cơ chế thử nghiệm sandbox fintech.

### Chưa có luật riêng

Hiện tại, hoạt động P2P Lending được điều chỉnh bởi:
- Bộ luật Dân sự 2015 (về hợp đồng vay)
- Luật Doanh nghiệp (về hình thức tổ chức)
- Luật Giao dịch điện tử
- Nghị định về sandbox fintech

## Rủi Ro Pháp Lý

### Cho người cho vay

1. **Mất vốn**: Người vay không trả nợ
2. **Nền tảng phá sản**: Mất dữ liệu giao dịch
3. **Pháp lý không rõ ràng**: Khó khởi kiện nếu tranh chấp
4. **Lãi suất trần**: Vượt 20%/năm theo Bộ luật Dân sự có thể bị vô hiệu

### Cho người vay

1. **Lãi suất cao**: Nhiều nền tảng tính lãi suất rất cao
2. **Thu hồi nợ không đúng pháp luật**: Đe dọa, quấy rối
3. **Rò rỉ thông tin cá nhân**: Dữ liệu bị bán cho bên thứ ba

### Cho nền tảng

1. **Chưa được cấp phép chính thức**: Rủi ro bị đóng cửa
2. **Trách nhiệm pháp lý**: Khi người vay không trả nợ
3. **Rửa tiền**: Nguy cơ bị lợi dụng

## Quy Định Về Lãi Suất

Theo Điều 468 Bộ luật Dân sự 2015:

- Lãi suất thỏa thuận không quá 20%/năm
- Nếu vượt: phần vượt vô hiệu
- Lãi suất chậm trả: bằng lãi suất vay + 10%/năm x số tiền chậm trả

## Cách Bảo Vệ Quyền Lợi

### Người cho vay

- Chỉ sử dụng nền tảng được cấp phép/thí điểm
- Không đầu tư quá 10% tài sản vào P2P
- Kiểm tra uy tín nền tảng
- Lưu giữ mọi bằng chứng giao dịch

### Người vay

- Đọc kỹ hợp đồng trước khi vay
- Kiểm tra tổng chi phí vay (không chỉ lãi suất)
- Không chia sẻ thông tin cá nhân quá mức
- Báo công an nếu bị đe dọa thu hồi nợ

## Kết Luận

P2P Lending là xu hướng tất yếu nhưng tiềm ẩn nhiều rủi ro khi khung pháp lý chưa hoàn thiện. Tư vấn pháp lý giúp bạn hiểu rõ quyền và nghĩa vụ khi tham gia.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn về pháp luật tài chính công nghệ.`
    },
    {
      title: 'Bồi Thường Khi Bị Tai Nạn Giao Thông: Quy Định và Thực Tiễn',
      slug: 'boi-thuong-tai-nan-giao-thong-quy-dinh-thuc-tien',
      category: 'guide',
      publishedDate: '2026-02-10',
      excerpt: 'Hướng dẫn chi tiết quyền được bồi thường khi bị tai nạn giao thông: mức bồi thường, thủ tục yêu cầu và cách bảo vệ quyền lợi.',
      content: `# Bồi Thường Khi Bị Tai Nạn Giao Thông

## Cơ Sở Pháp Lý

Bồi thường thiệt hại do tai nạn giao thông được quy định tại:
- Bộ luật Dân sự 2015 (Điều 584-608)
- Luật Giao thông đường bộ
- Nghị quyết 03/2006 của HĐTP TAND Tối cao

## Các Loại Thiệt Hại Được Bồi Thường

### 1. Thiệt hại về sức khỏe

- **Chi phí y tế**: Viện phí, thuốc men, phẫu thuật, phục hồi chức năng
- **Thu nhập bị mất**: Trong thời gian điều trị
- **Chi phí chăm sóc**: Người chăm sóc nạn nhân
- **Tổn thất tinh thần**: Không quá 50 lần mức lương cơ sở

### 2. Thiệt hại về tính mạng

- Chi phí mai táng
- Tiền cấp dưỡng cho người phụ thuộc
- Tổn thất tinh thần cho thân nhân: không quá 100 lần mức lương cơ sở
- Thu nhập bị mất trước khi chết

### 3. Thiệt hại về tài sản

- Chi phí sửa chữa xe
- Giá trị tài sản bị hư hỏng
- Thu nhập bị mất do tài sản hư hỏng

## Ai Phải Bồi Thường?

### Nguyên tắc chung

- Người gây tai nạn (trực tiếp hoặc gián tiếp)
- Chủ xe (nếu người lái không phải chủ xe)
- Bảo hiểm (nếu xe có bảo hiểm bắt buộc)

### Trường hợp đặc biệt

- Cả hai bên cùng có lỗi: bồi thường theo tỷ lệ lỗi
- Xe không có bảo hiểm: chủ xe chịu toàn bộ
- Người chưa thành niên: cha mẹ/người giám hộ chịu trách nhiệm

## Quy Trình Yêu Cầu Bồi Thường

### Bước 1: Thu thập chứng cứ ngay tại hiện trường

- Gọi công an giao thông
- Chụp ảnh hiện trường, phương tiện
- Lấy thông tin nhân chứng
- Giữ biên bản tai nạn

### Bước 2: Điều trị và lưu giữ chứng từ

- Giữ tất cả hóa đơn y tế
- Xin giấy chứng thương (nếu bị thương nặng)
- Giấy xác nhận nghỉ việc
- Chứng nhận thu nhập bị mất

### Bước 3: Thương lượng bồi thường

- Trực tiếp với bên gây tai nạn
- Qua công ty bảo hiểm
- Có thể nhờ luật sư đại diện

### Bước 4: Khởi kiện (nếu thương lượng không thành)

- Nộp đơn tại tòa án cấp quận/huyện
- Thời hiệu: 3 năm kể từ ngày tai nạn
- Chuẩn bị đầy đủ chứng cứ

## Bảo Hiểm Bắt Buộc

Theo Nghị định 03/2021/NĐ-CP:
- Xe máy: mức bồi thường tối đa 150 triệu/người
- Ô tô: tùy loại hình, tối đa 150 triệu/người về người

## Kết Luận

Bảo vệ quyền lợi khi bị tai nạn giao thông đòi hỏi sự chuẩn bị và hiểu biết pháp lý. Hãy tìm kiếm tư vấn pháp lý sớm để đảm bảo quyền bồi thường đầy đủ.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn về bồi thường tai nạn giao thông.`
    },
    {
      title: 'Quyền Sở Hữu Trí Tuệ Trong Thời Đại Số: Bảo Vệ Tác Phẩm Online',
      slug: 'quyen-so-huu-tri-tue-thoi-dai-so-bao-ve-tac-pham',
      category: 'analysis',
      publishedDate: '2026-02-08',
      excerpt: 'Phân tích quyền sở hữu trí tuệ trong môi trường số: bảo vệ bản quyền nội dung online, xử lý vi phạm và xu hướng pháp luật.',
      content: `# Quyền Sở Hữu Trí Tuệ Trong Thời Đại Số

## Giới Thiệu

Thời đại số mang đến thách thức mới cho bảo vệ quyền sở hữu trí tuệ. Nội dung số dễ dàng bị sao chép, phân phối mà không được phép, gây thiệt hại lớn cho chủ sở hữu.

## Các Loại Quyền SHTT Trong Môi Trường Số

### 1. Quyền tác giả

- Tác phẩm văn học, nghệ thuật trên internet
- Phần mềm máy tính
- Cơ sở dữ liệu
- Thiết kế website

### 2. Quyền sở hữu công nghiệp

- Nhãn hiệu trên không gian mạng
- Tên miền internet
- Sáng chế phần mềm, quy trình

### 3. Quyền liên quan

- Bản ghi âm, ghi hình
- Phát sóng trực tuyến (livestream)
- Podcast, video

## Vi Phạm Phổ Biến

### Sao chép nội dung

- Copy bài viết, hình ảnh không xin phép
- Reup video lên nền tảng khác
- Sử dụng nhạc, hình ảnh trong video thương mại

### Vi phạm nhãn hiệu

- Sử dụng nhãn hiệu của người khác làm từ khóa quảng cáo
- Bán hàng giả trên sàn thương mại điện tử
- Tên miền trùng với nhãn hiệu nổi tiếng

### Xâm phạm bí mật kinh doanh

- Lấy cắp mã nguồn
- Rò rỉ thông tin khách hàng
- Sao chép cơ sở dữ liệu

## Cách Bảo Vệ

### Biện pháp phòng ngừa

1. Đăng ký quyền tác giả cho tác phẩm số
2. Đăng ký nhãn hiệu cho thương hiệu online
3. Sử dụng watermark cho hình ảnh
4. Cài đặt công cụ phát hiện sao chép
5. Ghi rõ điều khoản sử dụng trên website

### Khi bị vi phạm

1. **Thu thập chứng cứ**: Screenshot, lưu URL, lưu thời gian
2. **Gửi thông báo gỡ bỏ**: DMCA takedown hoặc yêu cầu trực tiếp
3. **Khiếu nại đến nền tảng**: YouTube, Facebook, Google...
4. **Khiếu nại hành chính**: Thanh tra Bộ Văn hóa, Bộ KHCN
5. **Khởi kiện**: Tòa án có thẩm quyền

## Xu Hướng Pháp Luật

### AI và quyền tác giả

- Tác phẩm do AI tạo ra: ai là tác giả?
- Sử dụng tác phẩm để huấn luyện AI
- Bảo hộ sáng tạo có sự hỗ trợ của AI

### NFT và sở hữu số

- Quyền sở hữu NFT vs quyền tác giả
- Bán tác phẩm số dưới dạng NFT
- Tranh chấp NFT

## Kết Luận

Bảo vệ quyền sở hữu trí tuệ trong thời đại số đòi hỏi sự chủ động và hiểu biết pháp lý. Đừng chờ đến khi bị vi phạm mới hành động.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn bảo vệ quyền sở hữu trí tuệ.`
    },
    {
      title: 'Giải Quyết Tranh Chấp Giữa Thành Viên Công Ty TNHH',
      slug: 'giai-quyet-tranh-chap-giua-thanh-vien-cong-ty-tnhh',
      category: 'guide',
      publishedDate: '2026-02-05',
      excerpt: 'Phân tích các loại tranh chấp giữa thành viên công ty TNHH và cách giải quyết theo Luật Doanh nghiệp 2020.',
      content: `# Giải Quyết Tranh Chấp Giữa Thành Viên Công Ty TNHH

## Giới Thiệu

Công ty TNHH hai thành viên trở lên là loại hình doanh nghiệp phổ biến nhất tại Việt Nam. Tuy nhiên, tranh chấp giữa các thành viên cũng rất phổ biến, đặc biệt khi doanh nghiệp phát triển hoặc gặp khó khăn.

## Các Loại Tranh Chấp Thường Gặp

### 1. Tranh chấp về quyền biểu quyết

- Bất đồng về quyết định kinh doanh quan trọng
- Thành viên đa số lạm dụng quyền
- Loại bỏ thành viên thiểu số

### 2. Tranh chấp về phân chia lợi nhuận

- Không chia lợi nhuận mặc dù có lãi
- Chia lợi nhuận không theo tỷ lệ vốn góp
- Che giấu doanh thu, lợi nhuận

### 3. Tranh chấp về chuyển nhượng vốn

- Quyền ưu tiên mua phần vốn góp
- Giá chuyển nhượng không hợp lý
- Vi phạm quy trình chuyển nhượng

### 4. Tranh chấp về quản lý điều hành

- Giám đốc/người quản lý lạm quyền
- Giao dịch tư lợi
- Không minh bạch tài chính

## Giải Pháp Pháp Lý

### Biện pháp nội bộ

1. **Đàm phán**: Họp Hội đồng thành viên để giải quyết
2. **Sửa đổi điều lệ**: Thêm cơ chế giải quyết tranh chấp
3. **Mua lại phần vốn**: Thành viên bất đồng bán vốn và rời đi
4. **Thay đổi người quản lý**: Bãi nhiệm và bổ nhiệm người mới

### Biện pháp pháp lý

1. **Yêu cầu hủy nghị quyết**: Nếu nghị quyết vi phạm pháp luật hoặc điều lệ
2. **Kiện đòi quyền lợi**: Quyền chia lợi nhuận, quyền thông tin
3. **Yêu cầu giải thể**: Khi không thể tiếp tục hợp tác
4. **Kiện người quản lý**: Về hành vi vi phạm nghĩa vụ

## Quyền Của Thành Viên Thiểu Số

Theo Luật Doanh nghiệp 2020, thành viên sở hữu ≥10% vốn điều lệ có quyền:

- Yêu cầu triệu tập Hội đồng thành viên
- Xem xét, tra cứu sổ ghi chép
- Yêu cầu Tòa án hủy nghị quyết bất hợp pháp
- Khởi kiện người quản lý về hành vi vi phạm

## Cách Phòng Ngừa

1. **Soạn thảo điều lệ kỹ lưỡng**: Quy định rõ quyền từng thành viên
2. **Thỏa thuận cổ đông**: Ngoài điều lệ, ký thỏa thuận riêng về quản trị
3. **Minh bạch tài chính**: Báo cáo tài chính định kỳ cho tất cả thành viên
4. **Cơ chế giải quyết tranh chấp**: Quy định trong điều lệ (hòa giải, trọng tài)

## Kết Luận

Phòng ngừa luôn tốt hơn giải quyết. Một điều lệ công ty được soạn thảo chuyên nghiệp là nền tảng cho sự hợp tác bền vững giữa các thành viên.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn về quản trị doanh nghiệp và giải quyết tranh chấp thành viên.`
    },
    {
      title: 'Hướng Dẫn Khiếu Nại Quyết Định Hành Chính Về Đất Đai',
      slug: 'huong-dan-khieu-nai-quyet-dinh-hanh-chinh-dat-dai',
      category: 'guide',
      publishedDate: '2026-02-02',
      excerpt: 'Hướng dẫn chi tiết quy trình khiếu nại quyết định hành chính liên quan đến đất đai: quyền khiếu nại, trình tự và kinh nghiệm.',
      content: `# Hướng Dẫn Khiếu Nại Quyết Định Hành Chính Về Đất Đai

## Giới Thiệu

Khiếu nại quyết định hành chính về đất đai là quyền hợp pháp của công dân khi cho rằng quyết định của cơ quan nhà nước xâm phạm quyền sử dụng đất của mình. Bài viết này hướng dẫn chi tiết quy trình khiếu nại theo Luật Khiếu nại 2011 và Luật Đất đai 2024.

## Các Trường Hợp Thường Khiếu Nại

1. Quyết định thu hồi đất
2. Quyết định về bồi thường, hỗ trợ, tái định cư
3. Quyết định cấp/thu hồi Giấy chứng nhận quyền sử dụng đất
4. Quyết định giải quyết tranh chấp đất đai
5. Quyết định xử phạt vi phạm hành chính về đất đai

## Quyền Khiếu Nại

### Ai được khiếu nại?

- Cá nhân, hộ gia đình bị ảnh hưởng bởi quyết định
- Tổ chức có quyền sử dụng đất bị xâm phạm
- Người được ủy quyền hợp pháp

### Thời hiệu khiếu nại

- 90 ngày kể từ ngày nhận quyết định
- Hoặc 90 ngày kể từ ngày biết quyết định (nếu không được thông báo)

## Quy Trình Khiếu Nại

### Khiếu nại lần 1

**Gửi đến**: Cơ quan đã ban hành quyết định (UBND cấp xã, huyện, tỉnh)

**Hồ sơ**:
- Đơn khiếu nại (theo mẫu)
- Bản sao quyết định bị khiếu nại
- Giấy tờ chứng minh quyền sử dụng đất
- CCCD/CMND
- Tài liệu, chứng cứ liên quan

**Thời gian giải quyết**:
- Không quá 30 ngày (vụ việc đơn giản)
- Không quá 45 ngày (vụ việc phức tạp)
- Vùng sâu, xa: thêm 15 ngày

### Khiếu nại lần 2

**Nếu không đồng ý** với kết quả lần 1:

**Gửi đến**: Cơ quan cấp trên trực tiếp

**Thời hạn**: 30 ngày kể từ ngày nhận quyết định lần 1

**Thời gian giải quyết**: Tương tự lần 1 nhưng có thể kéo dài hơn

### Khởi kiện tại Tòa án

**Nếu không đồng ý** với kết quả khiếu nại, người dân có quyền:
- Khởi kiện vụ án hành chính tại Tòa án
- Thời hiệu: 1 năm kể từ ngày nhận quyết định giải quyết khiếu nại
- Tòa có thẩm quyền: TAND cấp huyện hoặc cấp tỉnh

## Lưu Ý Quan Trọng

1. **Phải khiếu nại đúng thời hạn**: Quá hạn sẽ mất quyền
2. **Giữ bản gốc đơn và biên nhận**: Chứng minh đã nộp đơn
3. **Không được khiếu nại vượt cấp**: Phải tuần tự từ thấp đến cao
4. **Có thể thuê luật sư đại diện**: Luật sư giúp soạn đơn và tham gia toàn bộ quy trình
5. **Trong thời gian khiếu nại**: Vẫn phải thi hành quyết định (trừ khi được tạm đình chỉ)

## Kết Luận

Khiếu nại hành chính về đất đai là quyền quan trọng của công dân. Sự hỗ trợ của luật sư giúp đảm bảo quy trình đúng pháp luật và bảo vệ tối đa quyền lợi.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn và đại diện trong khiếu nại hành chính đất đai.`
    },
    {
      title: 'Pháp Luật Về Hợp Đồng Điện Tử Tại Việt Nam',
      slug: 'phap-luat-hop-dong-dien-tu-tai-viet-nam',
      category: 'analysis',
      publishedDate: '2026-01-30',
      excerpt: 'Phân tích giá trị pháp lý của hợp đồng điện tử theo Luật Giao dịch điện tử 2023 và những lưu ý khi ký kết.',
      content: `# Pháp Luật Về Hợp Đồng Điện Tử Tại Việt Nam

## Giới Thiệu

Luật Giao dịch điện tử 2023 (có hiệu lực từ 01/7/2024) đã tạo khung pháp lý toàn diện cho hợp đồng điện tử tại Việt Nam. Trong bối cảnh chuyển đổi số, hợp đồng điện tử ngày càng phổ biến và được pháp luật thừa nhận.

## Khái Niệm

Hợp đồng điện tử là hợp đồng được thiết lập dưới dạng thông điệp dữ liệu, bao gồm:
- Email, tin nhắn
- Hợp đồng ký trên nền tảng điện tử
- Smart contract (hợp đồng thông minh)

## Giá Trị Pháp Lý

### Nguyên tắc không phân biệt

Hợp đồng điện tử có giá trị pháp lý tương đương hợp đồng giấy nếu:
- Nội dung được lưu giữ nguyên vẹn
- Có thể truy cập, sử dụng để tham chiếu
- Đảm bảo tính toàn vẹn từ khi tạo

### Trường hợp không được lập dưới dạng điện tử

- Văn bằng, chứng chỉ
- Di chúc
- Giấy chứng nhận quyền sử dụng đất (trừ bản sao)
- Một số giao dịch bất động sản theo quy định

## Chữ Ký Điện Tử

### Các loại chữ ký điện tử

1. **Chữ ký số (digital signature)**: Sử dụng chứng thư số, có giá trị pháp lý cao nhất
2. **Chữ ký điện tử khác**: Email, vân tay, OTP... (giá trị pháp lý tùy thỏa thuận)

### Điều kiện có hiệu lực

- Xác định được người ký
- Phương pháp tạo chữ ký đáng tin cậy
- Dữ liệu gắn với chữ ký không bị thay đổi

## Lưu Ý Khi Ký Hợp Đồng Điện Tử

### Doanh nghiệp

1. Sử dụng nền tảng hợp đồng điện tử uy tín
2. Đảm bảo chữ ký số hợp lệ (đã đăng ký với CA)
3. Lưu trữ bản gốc điện tử đúng quy định
4. Ghi rõ điều kiện giao kết trong hợp đồng

### Cá nhân

1. Đọc kỹ nội dung trước khi ký
2. Bảo mật thông tin chữ ký điện tử
3. Lưu bản sao hợp đồng
4. Kiểm tra danh tính bên kia

## Giải Quyết Tranh Chấp

Tranh chấp hợp đồng điện tử được giải quyết tương tự hợp đồng truyền thống:
- Thương lượng
- Hòa giải
- Trọng tài
- Tòa án

**Chứng cứ điện tử**: Dữ liệu điện tử được chấp nhận làm chứng cứ tại tòa nếu đảm bảo tính toàn vẹn.

## Kết Luận

Hợp đồng điện tử là xu hướng tất yếu. Hiểu rõ giá trị pháp lý và điều kiện hợp lệ giúp doanh nghiệp và cá nhân tự tin sử dụng trong giao dịch.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn về hợp đồng điện tử và giao dịch số.`
    },
    {
      title: 'Quy Trình Giám Đốc Thẩm và Tái Thẩm Trong Tố Tụng Dân Sự',
      slug: 'quy-trinh-giam-doc-tham-tai-tham-to-tung-dan-su',
      category: 'analysis',
      publishedDate: '2026-01-25',
      excerpt: 'Phân tích quy trình giám đốc thẩm và tái thẩm: khi nào được áp dụng, ai có quyền đề nghị và thủ tục thực hiện.',
      content: `# Quy Trình Giám Đốc Thẩm và Tái Thẩm

## Giới Thiệu

Giám đốc thẩm và tái thẩm là hai thủ tục đặc biệt trong tố tụng dân sự Việt Nam, áp dụng khi bản án, quyết định đã có hiệu lực pháp luật nhưng phát hiện có vi phạm pháp luật nghiêm trọng hoặc có tình tiết mới.

## Giám Đốc Thẩm

### Căn cứ kháng nghị

Bản án, quyết định có hiệu lực bị kháng nghị giám đốc thẩm khi:

1. **Kết luận không phù hợp** với tình tiết khách quan của vụ án
2. **Vi phạm nghiêm trọng** thủ tục tố tụng
3. **Sai lầm nghiêm trọng** trong áp dụng pháp luật

### Ai có quyền kháng nghị?

- Chánh án TAND Tối cao
- Viện trưởng VKSND Tối cao
- Chánh án TAND cấp cao (trong phạm vi thẩm quyền)

### Thời hạn kháng nghị

- 3 năm kể từ ngày bản án có hiệu lực
- Ngoại lệ: trong trường hợp đặc biệt, có thể kéo dài thêm 2 năm

### Quyền đề nghị

Đương sự không có quyền kháng nghị nhưng có quyền **đề nghị** người có thẩm quyền kháng nghị:
- Gửi đơn đề nghị kèm bản án và chứng cứ
- Cơ quan có thẩm quyền xem xét và quyết định

## Tái Thẩm

### Căn cứ kháng nghị

Khác với giám đốc thẩm, tái thẩm dựa trên **tình tiết mới** phát hiện sau khi bản án có hiệu lực:

1. **Phát hiện tình tiết quan trọng** mà đương sự không biết trước
2. **Kết luận giám định, dịch thuật sai** ảnh hưởng nội dung vụ án
3. **Thẩm phán, Hội thẩm phạm tội** liên quan đến vụ án
4. **Chứng cứ bị làm giả** được sử dụng làm căn cứ xét xử

### Thời hạn kháng nghị

- 1 năm kể từ ngày phát hiện tình tiết mới

## So Sánh Giám Đốc Thẩm và Tái Thẩm

| Tiêu chí | Giám Đốc Thẩm | Tái Thẩm |
|----------|---------------|----------|
| Căn cứ | Vi phạm pháp luật | Tình tiết mới |
| Thời hạn | 3 năm (+2 đặc biệt) | 1 năm từ khi phát hiện |
| Người kháng nghị | Chánh án, Viện trưởng | Chánh án, Viện trưởng |
| Kết quả | Hủy, sửa hoặc giữ nguyên | Hủy để xét xử lại |

## Quyền Của Đương Sự

Mặc dù không trực tiếp kháng nghị, đương sự có thể:

1. Nộp đơn đề nghị giám đốc thẩm/tái thẩm
2. Cung cấp chứng cứ, tài liệu bổ sung
3. Thuê luật sư soạn đơn và theo dõi
4. Tham gia phiên tòa giám đốc thẩm/tái thẩm

## Kết Luận

Giám đốc thẩm và tái thẩm là "cửa cuối" để sửa chữa sai sót trong xét xử. Sự hỗ trợ của luật sư có kinh nghiệm là rất cần thiết trong thủ tục phức tạp này.

**Liên hệ Luật sư Võ Thiện Hiển** tại Apolo Lawyers để được tư vấn về giám đốc thẩm và tái thẩm.`
    }
  ];
}

function generateNewEnArticles() {
  return [
    {
      title: 'Vietnam Real Estate Purchase Agreement: Essential Clauses for Foreign Buyers',
      slug: 'vietnam-real-estate-purchase-agreement-foreign-buyers',
      category: 'guide',
      publishedDate: '2026-04-01',
      excerpt: 'A comprehensive guide to essential clauses in Vietnamese real estate purchase agreements and common pitfalls foreign buyers should avoid.',
      content: `# Vietnam Real Estate Purchase Agreement: Essential Clauses for Foreign Buyers

## Introduction

Purchasing property in Vietnam as a foreigner involves navigating a unique legal framework. The Housing Law 2023 and Land Law 2024 have expanded foreign ownership rights, but the purchase agreement remains the most critical document in any transaction.

**Attorney Vo Thien Hien** at Apolo Lawyers has guided numerous international clients through property acquisitions in Ho Chi Minh City and across Vietnam.

## Key Clauses Every Agreement Must Include

### 1. Property Description

The agreement must precisely identify the property:

- Exact address and location
- Land plot number and cadastral map number
- Total land area and built-up area
- Certificate of Land Use Rights (CLUR) number
- Current land use purpose and duration

### 2. Purchase Price and Payment Schedule

This is the most commonly disputed clause:

- Total price in both numbers and words (VND)
- Payment installments with specific dates
- Payment method (bank transfer strongly recommended)
- Conditions for final payment (typically after title transfer)
- Currency and exchange rate provisions (for foreign buyers)

### 3. Seller's Representations and Warranties

The seller must warrant that:

- They are the legal owner with authority to sell
- The property is free from encumbrances and disputes
- No mortgages or pledges exist
- The property is not subject to government acquisition plans
- All taxes and fees are current

### 4. Transfer Timeline

- Deadline for submitting transfer documents
- Expected completion date for title transfer
- Consequences for delays on either side

## Foreign Ownership Restrictions

### What foreigners CAN buy

- Apartments in approved projects
- Houses in approved residential areas
- Maximum 30% of apartments in one building
- Maximum 250 houses in one ward

### What foreigners CANNOT buy

- Agricultural land
- Land in security-sensitive areas
- Properties exceeding the 30% cap

### Ownership Duration

- Maximum 50 years (renewable once for 50 more years)
- Married to Vietnamese citizen: same rights as Vietnamese nationals

## Common Pitfalls

1. **Under-declaring the price**: Some sellers propose recording a lower price to reduce taxes — this exposes buyers to significant risk
2. **Skipping notarization**: Transfer contracts MUST be notarized to be legally valid
3. **Not checking the master plan**: The property may be in a planned demolition zone
4. **Ignoring maintenance fees**: Apartment buyers must account for ongoing management fees

## Due Diligence Checklist

- Verify ownership at the Land Registration Office
- Check for liens, mortgages, or court orders
- Confirm the property is within the foreign ownership quota
- Review the developer's legal documents (for new apartments)
- Check urban planning status at the district authority

## Conclusion

A professionally drafted purchase agreement is the best investment you can make when buying property in Vietnam. Always work with an experienced legal advisor who understands both Vietnamese law and international client needs.

**Contact Attorney Vo Thien Hien** at Apolo Lawyers for expert guidance on your Vietnam property acquisition.`
    },
    {
      title: 'Understanding Vietnam Labor Law: A Guide for Foreign Employers',
      slug: 'understanding-vietnam-labor-law-guide-foreign-employers',
      category: 'guide',
      publishedDate: '2026-03-28',
      excerpt: 'Essential guide to Vietnam Labor Code 2019 for foreign employers: employment contracts, working hours, termination rules, and compliance.',
      content: `# Understanding Vietnam Labor Law: A Guide for Foreign Employers

## Overview

The Vietnam Labor Code 2019 (effective January 1, 2021) governs all employment relationships in Vietnam. For foreign employers operating in Vietnam — whether through a wholly foreign-owned enterprise, joint venture, or representative office — compliance is mandatory and strictly enforced.

## Employment Contracts

### Types of Contracts

Vietnam recognizes only two types:

1. **Indefinite-term contracts**: No expiry date
2. **Fixed-term contracts**: Maximum 36 months

The old seasonal/job-specific contract category has been abolished.

### Key Requirements

- Must be in writing (Vietnamese language required)
- Must include: job description, salary, working hours, workplace, contract term
- Probation period: maximum 60 days for management positions, 30 days for others
- Electronic contracts are now legally valid

## Working Hours and Overtime

### Standard Hours

- Maximum 8 hours/day, 48 hours/week
- At least one 24-hour rest period per week

### Overtime Limits

- Maximum 40 hours/month
- Maximum 200 hours/year (300 hours for certain industries)
- Employee consent required for overtime

### Overtime Pay Rates

- Normal working days: 150% of normal wage
- Weekly rest days: 200%
- Public holidays: 300%
- Night work premium: additional 30%

## Termination

### Employer-initiated termination

Valid grounds include:
- Repeated failure to perform duties
- Prolonged illness (12 months for indefinite contracts)
- Force majeure (natural disaster, pandemic)
- Business restructuring

**Required notice**:
- 45 days for indefinite-term contracts
- 30 days for fixed-term contracts

### Employee-initiated termination

**Major change**: Employees can now resign without providing a reason. They only need to provide advance notice:
- 45 days for indefinite-term contracts
- 30 days for fixed-term contracts

### Severance Pay

- 0.5 months' salary per year of service
- Applies when employment exceeds 12 months
- Does not apply in cases of disciplinary dismissal

## Mandatory Insurance

Employers must contribute to:

| Insurance | Employer | Employee |
|-----------|----------|----------|
| Social Insurance | 17.5% | 8% |
| Health Insurance | 3% | 1.5% |
| Unemployment | 1% | 1% |

Total employer burden: 21.5% of gross salary.

## Foreign Employee Work Permits

### Requirements

- Work permit required for all foreign employees
- Valid for up to 2 years (renewable)
- Must apply before the employee starts working
- Exemptions: intra-company transferees (<90 days), experts providing emergency assistance

### Common Violations

1. Employing foreigners without work permits (fine: up to 150 million VND)
2. Exceeding work permit duration
3. Assigning work outside the permitted scope

## Practical Recommendations

1. **Use bilingual contracts**: Vietnamese is legally binding, but include English for clarity
2. **Update internal labor regulations**: Must be registered with the labor authority if you have 10+ employees
3. **Keep meticulous records**: Attendance, overtime, leave — authorities can audit at any time
4. **Budget for total labor costs**: Base salary + 21.5% insurance + bonuses + leave

## Conclusion

Vietnam labor law compliance requires ongoing attention and expert guidance. Non-compliance can result in significant fines, reputational damage, and operational disruption.

**Contact Attorney Vo Thien Hien** at Apolo Lawyers for comprehensive labor law advisory tailored to your business needs.`
    },
    {
      title: 'Dispute Resolution in Vietnam: Litigation vs Arbitration vs Mediation',
      slug: 'dispute-resolution-vietnam-litigation-arbitration-mediation',
      category: 'analysis',
      publishedDate: '2026-03-25',
      excerpt: 'Comparing three dispute resolution methods in Vietnam: court litigation, commercial arbitration, and mediation — costs, timelines, and best use cases.',
      content: `# Dispute Resolution in Vietnam: Litigation vs Arbitration vs Mediation

## Introduction

When a commercial dispute arises in Vietnam, parties have three primary resolution paths. Choosing the right method can save millions in costs and months in time. **Attorney Vo Thien Hien** has represented clients across all three forums and offers this comparative guide.

## Court Litigation

### Process

1. File lawsuit at the competent People's Court
2. Court-led mediation attempt (mandatory)
3. First-instance trial (3-6 months after filing)
4. Appeal (if either party disagrees)
5. Enforcement of judgment

### Advantages

- Binding and enforceable decisions
- Ability to apply interim measures
- Lower filing fees than arbitration
- Public precedent value

### Disadvantages

- Slow: 12-24 months for final resolution
- Public proceedings (no confidentiality)
- Judges may lack commercial expertise
- Multiple appeal levels
- Enforcement of foreign judgments is difficult

### Best For

- Domestic disputes with clear legal precedent
- Cases requiring injunctive relief
- Lower-value disputes
- Cases where one party won't agree to arbitration

## Commercial Arbitration

### Process

1. File request for arbitration (VIAC or other institution)
2. Tribunal constitution (each party selects one arbitrator)
3. Exchange of submissions and evidence
4. Oral hearing
5. Final award (binding, no appeal on merits)

### Leading Institutions

- **VIAC** (Vietnam International Arbitration Centre): Most popular in Vietnam
- **SIAC** (Singapore): Popular for cross-border disputes involving Vietnam
- **ICC** (Paris): For large international transactions

### Advantages

- Faster: typically 6-12 months
- Confidential proceedings
- Arbitrators with industry expertise
- Awards enforceable internationally (New York Convention)
- Flexible procedures

### Disadvantages

- Higher costs (arbitrator fees + institutional fees)
- Requires prior agreement (arbitration clause)
- Limited grounds for setting aside awards
- No appeal on merits

### Best For

- International commercial disputes
- High-value B2B disputes
- Cases requiring confidentiality
- Disputes needing specialized expertise

## Mediation

### Process

1. Parties agree to mediate
2. Select a mediator (independent or institutional)
3. Joint and separate sessions
4. If successful: settlement agreement (enforceable if court-recognized)
5. If unsuccessful: parties retain right to litigate/arbitrate

### Advantages

- Fastest: weeks to months
- Lowest cost
- Preserves business relationships
- Parties control the outcome
- Court recognition available

### Disadvantages

- Non-binding (unless court-recognized)
- Requires good faith from both parties
- No precedent value
- Cannot compel attendance

### Best For

- Ongoing business relationships
- Disputes with potential for compromise
- Multi-party disputes
- Family business succession issues

## Cost Comparison

| Method | Filing Fee | Duration | Total Cost Estimate |
|--------|-----------|----------|-------------------|
| Litigation | 0.5-3% of claim value | 12-24 months | $5,000-50,000 |
| Arbitration (VIAC) | Based on claim value | 6-12 months | $15,000-100,000+ |
| Mediation | Negotiable | 1-3 months | $2,000-15,000 |

## Practical Tips

1. **Include a dispute resolution clause** in every contract
2. **Consider multi-tier clauses**: negotiate → mediate → arbitrate
3. **Choose the governing law** carefully (Vietnamese law is mandatory for some matters)
4. **Preserve evidence** from day one
5. **Engage counsel early** — prevention is cheaper than cure

## Conclusion

There is no one-size-fits-all approach. The best dispute resolution method depends on the nature of the dispute, the relationship between parties, and the desired outcome.

**Contact Attorney Vo Thien Hien** at Apolo Lawyers for strategic advice on dispute resolution in Vietnam.`
    },
    {
      title: 'Vietnam Franchise Law: Legal Requirements for Foreign Franchisors',
      slug: 'vietnam-franchise-law-foreign-franchisors',
      category: 'guide',
      publishedDate: '2026-03-20',
      excerpt: 'Complete guide to franchising in Vietnam: registration requirements, franchise disclosure, intellectual property protection, and compliance.',
      content: `# Vietnam Franchise Law: Legal Requirements for Foreign Franchisors

## Introduction

Vietnam's growing middle class and consumer market make it an attractive destination for international franchises. However, the legal framework for franchising has specific requirements that foreign franchisors must understand before entering the market.

## Legal Framework

Franchising in Vietnam is governed by:
- Commercial Law 2005 (Articles 284-291)
- Decree 35/2006/ND-CP (as amended by Decree 08/2018/ND-CP)
- Circular 09/2006/TT-BTM

## Registration Requirements

### Who must register?

All franchise systems operating in Vietnam must be registered with the Ministry of Industry and Trade (MOIT).

### Registration documents

1. Application form (prescribed format)
2. Franchise Disclosure Document (FDD) — in Vietnamese
3. Sample franchise agreement — in Vietnamese
4. Franchisor's certificate of incorporation
5. Financial statements (audited, last 2 years)
6. Proof the franchise system has operated for at least 1 year

### Processing time

- 5 working days for complete applications
- Registration is valid indefinitely (but must notify changes)

## Franchise Disclosure Document (FDD)

The FDD must include:
- Company information and business history
- Financial condition of the franchisor
- Intellectual property details (trademarks, patents)
- Franchise fees and ongoing royalties
- Territory rights and restrictions
- Training and support provided
- Termination and renewal conditions
- List of current franchisees
- Audited financial statements

**Timeline**: The FDD must be provided to the franchisee at least 15 working days before signing the franchise agreement.

## Key Franchise Agreement Terms

### Mandatory provisions

- Duration (minimum not specified, but typically 5-10 years)
- Territory definition
- Fee structure (initial fee + ongoing royalties)
- IP license terms
- Quality control standards
- Training obligations
- Termination conditions
- Dispute resolution mechanism

### Common structures

- **Master Franchise**: Foreign franchisor grants rights to a Vietnamese master franchisee
- **Direct Franchise**: Foreign franchisor directly franchises to individual operators
- **Area Development**: Franchisee commits to opening multiple units in a territory

## Intellectual Property Protection

### Before entering Vietnam

1. Register your trademark with the National Office of IP (NOIP)
2. Conduct a trademark search to check for conflicts
3. Register domain names (.vn)

### In the franchise agreement

- Clear IP license terms
- Quality control provisions
- Post-termination IP restrictions
- Anti-counterfeiting commitments

## Tax Considerations

- Franchise fees are subject to 10% withholding tax
- Royalties subject to 10% withholding tax
- VAT may apply to certain services
- Transfer pricing rules apply to related-party transactions

## Common Challenges

1. **Finding reliable franchisees**: Due diligence is essential
2. **Protecting brand standards**: Regular audits and training
3. **Currency controls**: Repatriation of franchise fees
4. **Legal enforcement**: Termination can be difficult under Vietnamese law
5. **Consumer preferences**: Adapting menus/products to local tastes

## Conclusion

Vietnam offers significant franchise opportunities, but success requires careful legal planning. A well-structured franchise agreement and proper IP protection are essential foundations.

**Contact Attorney Vo Thien Hien** at Apolo Lawyers for expert franchise law advisory in Vietnam.`
    },
    {
      title: 'Tax Obligations for Foreign Companies Operating in Vietnam',
      slug: 'tax-obligations-foreign-companies-operating-vietnam',
      category: 'guide',
      publishedDate: '2026-03-18',
      excerpt: 'Essential guide to Vietnamese tax obligations for foreign companies: CIT, VAT, PIT, FCT, transfer pricing, and tax incentives.',
      content: `# Tax Obligations for Foreign Companies Operating in Vietnam

## Overview

Understanding Vietnam's tax system is critical for foreign companies. Vietnam applies a territorial tax system with several key taxes affecting foreign businesses. **Attorney Vo Thien Hien** at Apolo Lawyers provides this overview to help international clients navigate their tax obligations.

## Corporate Income Tax (CIT)

### Standard Rate

- 20% on taxable income
- Applied to all FDI enterprises and domestic companies equally

### Tax Incentives

Vietnam offers generous incentives for investments in:

**Preferential rates**:
- 10% for 15 years (high-tech, special economic zones)
- 17% for 10 years (industrial zones, certain sectors)

**Tax holidays**:
- 4 years exemption + 9 years at 50% reduction (most generous)
- 2 years exemption + 4 years at 50% reduction (standard)

### Conditions for incentives

- Investment in encouraged sectors or locations
- Minimum capital requirements
- Employment thresholds
- Technology transfer conditions

## Value Added Tax (VAT)

### Rates

- Standard: 10% (reduced to 8% through mid-2025 for certain goods)
- Reduced: 5% (essential goods, healthcare, education)
- 0%: Exported goods and services
- Exempt: Financial services, insurance, healthcare, education

### VAT Registration

- All businesses with annual revenue exceeding 1 billion VND must register
- Monthly or quarterly filing depending on revenue size

## Personal Income Tax (PIT)

### For foreign employees

- Tax residents (183+ days/year): Progressive rates 5-35%
- Non-residents: Flat 20% on Vietnam-sourced income

### Employer obligations

- Withhold PIT from employee salaries
- File monthly/quarterly PIT returns
- Year-end finalization for departing employees

## Foreign Contractor Tax (FCT)

### When it applies

Foreign companies providing services to Vietnamese entities without a permanent establishment must pay FCT.

### Rates

| Service Type | CIT Component | VAT Component |
|-------------|---------------|---------------|
| Services | 5% | 5% |
| Goods with services | 1% | 3% |
| Royalties | 10% | N/A |
| Interest | 5% | Exempt |
| Rental | 5% | 5% |

### Payment methods

- **Direct method**: Vietnamese payer withholds and remits
- **Hybrid method**: Foreign contractor registers for VAT, Vietnamese payer withholds CIT
- **Declaration method**: Foreign contractor files own returns (requires PE registration)

## Transfer Pricing

### Requirements

- All related-party transactions must be at arm's length
- Annual transfer pricing disclosure required
- Three-tiered documentation: master file, local file, country-by-country report
- Safe harbor rules available for low-risk transactions

### Penalties

- Additional tax assessment
- Late payment interest (0.03%/day)
- Penalties up to 20% of underreported tax

## Compliance Calendar

| Deadline | Obligation |
|----------|-----------|
| 20th of following month | Monthly VAT, PIT withholding |
| 30th of following quarter | Quarterly CIT provisional |
| March 31 | Annual CIT finalization |
| March 31 | Annual PIT finalization |
| 90 days after fiscal year-end | Audited financial statements |

## Practical Recommendations

1. **Engage a licensed tax advisor** before operations begin
2. **Structure the entity correctly** to maximize incentives
3. **Maintain complete documentation** for all transactions
4. **Plan for transfer pricing** from day one
5. **Monitor regulatory changes** — Vietnamese tax law evolves rapidly

## Conclusion

Vietnam's tax system offers attractive incentives but demands rigorous compliance. Professional tax and legal advisory is essential to optimize your tax position while maintaining full compliance.

**Contact Attorney Vo Thien Hien** at Apolo Lawyers for comprehensive tax and corporate advisory services.`
    },
    {
      title: 'Protecting Trade Secrets in Vietnam: Legal Framework and Best Practices',
      slug: 'protecting-trade-secrets-vietnam-legal-framework',
      category: 'analysis',
      publishedDate: '2026-03-15',
      excerpt: 'How to protect trade secrets in Vietnam under the IP Law: legal requirements, NDA enforcement, employee obligations, and remedies for misappropriation.',
      content: `# Protecting Trade Secrets in Vietnam

## Introduction

Trade secrets are among the most valuable yet vulnerable assets of any business. In Vietnam, where employee mobility is high and enforcement can be challenging, proactive protection is essential. This article by **Attorney Vo Thien Hien** outlines the legal framework and practical strategies.

## Legal Framework

### Definition

Under Vietnam's Intellectual Property Law, trade secrets are information that:

1. Is not generally known or easily accessible
2. Provides a competitive advantage to its holder
3. Is subject to reasonable protection measures by the holder

### What qualifies?

- Customer lists and pricing strategies
- Manufacturing processes and formulas
- Business plans and financial data
- Software algorithms and source code
- Supplier agreements and terms

### What does NOT qualify?

- Publicly available information
- General industry knowledge
- Employee skills and experience

## Protection Mechanisms

### 1. Non-Disclosure Agreements (NDAs)

**With employees**:
- Must be specific about what information is confidential
- Should define duration of obligations (typically 2-5 years post-employment)
- Include remedies for breach (injunction + damages)

**With business partners**:
- Define the scope of confidential information
- Specify permitted use
- Include return/destruction obligations

### 2. Non-Compete Agreements

Vietnam law does NOT explicitly regulate non-compete agreements. However:
- Courts generally recognize reasonable non-competes
- Must be limited in scope, geography, and duration
- Must include compensation for the restriction period
- Overly broad clauses may be unenforceable

### 3. Internal Controls

- Access controls (need-to-know basis)
- Digital security (encryption, access logs)
- Physical security (locked areas, visitor policies)
- Employee training on confidentiality
- Exit interviews with confidentiality reminders

## Employee Obligations

### During employment

- Employees have an implied duty of confidentiality
- Strengthen with explicit confidentiality clauses in employment contracts
- Define what constitutes company information vs. personal knowledge

### After employment

- Contractual obligations survive termination (if properly drafted)
- Former employees cannot use or disclose trade secrets
- However, they CAN use general skills and knowledge

## Remedies for Misappropriation

### Civil remedies

- Injunction to stop the misappropriation
- Damages (actual loss + lost profits)
- Reasonable attorney fees
- Destruction of infringing materials

### Administrative remedies

- Complaint to the IP enforcement authorities
- Fines up to 500 million VND
- Seizure of infringing goods/materials

### Criminal remedies

- Available for serious cases
- Imprisonment up to 3 years
- Fines up to 1 billion VND

## Practical Recommendations

1. **Document your trade secrets**: Maintain a register of confidential information
2. **Mark documents as confidential**: Physical and digital marking
3. **Limit access**: Compartmentalize information
4. **Use robust NDAs**: Tailored to Vietnamese law
5. **Monitor departing employees**: Conduct exit procedures
6. **Act quickly on breaches**: Delay weakens your legal position

## Conclusion

Trade secret protection in Vietnam requires a combination of legal agreements, internal controls, and swift enforcement. The cost of prevention is far less than the cost of misappropriation.

**Contact Attorney Vo Thien Hien** at Apolo Lawyers for tailored trade secret protection strategies.`
    },
    {
      title: 'Vietnam Construction Law: Permits, Contracts, and Dispute Resolution',
      slug: 'vietnam-construction-law-permits-contracts-disputes',
      category: 'guide',
      publishedDate: '2026-03-12',
      excerpt: 'Guide to Vietnam construction law for developers and contractors: building permits, EPC contracts, FIDIC adaptations, and dispute resolution.',
      content: `# Vietnam Construction Law: Permits, Contracts, and Dispute Resolution

## Introduction

Vietnam's construction sector continues to boom, attracting significant foreign investment. Understanding the legal framework is essential for developers, contractors, and investors. **Attorney Vo Thien Hien** provides this comprehensive guide to construction law in Vietnam.

## Building Permits

### When required

Most construction projects in urban areas require a building permit, including:
- New buildings
- Renovations and expansions
- Additional floors or structural changes

### Exemptions

- Rural residential buildings (outside conservation zones)
- Minor repairs not affecting structure
- Temporary construction for approved projects

### Application process

1. Submit application to district People's Committee
2. Include architectural drawings, structural plans, CLUR
3. Processing time: 15-30 working days
4. Permit valid for 12 months (must commence within)

### Building without a permit

- Administrative fine: 30-70 million VND
- Possible forced demolition
- Criminal liability in severe cases

## Construction Contracts

### Common contract types

1. **EPC (Engineering, Procurement, Construction)**: Turnkey, most common for large projects
2. **Design-Build**: Single entity for design and construction
3. **Traditional (Design-Bid-Build)**: Separate contracts for design and construction
4. **FIDIC-based contracts**: Increasingly used for international projects

### Essential clauses

- Scope of work and specifications
- Contract price and payment schedule
- Construction timeline and milestones
- Quality standards and testing procedures
- Variation (change order) procedures
- Liquidated damages for delay
- Force majeure provisions
- Dispute resolution mechanism

### FIDIC in Vietnam

FIDIC contracts are widely used but require adaptation:
- Must comply with Vietnamese Construction Law
- Certain provisions may conflict with local regulations
- Vietnamese language version is legally binding
- Engineer's role may need modification

## Key Legal Issues

### 1. Land use rights

- Developer must hold valid CLUR or land lease
- Land use purpose must match construction type
- Environmental impact assessment required for large projects

### 2. Foreign contractor requirements

- Must establish a legal presence in Vietnam (or partner with local contractor)
- Work permits required for foreign workers
- Equipment import permits needed
- Performance bonds mandatory

### 3. Quality and safety

- Must comply with Vietnamese construction standards (TCVN)
- Construction safety management plan required
- Regular inspections by competent authority
- Insurance mandatory (third-party liability minimum)

## Dispute Resolution

### Common disputes

- Payment delays
- Construction defects
- Schedule delays
- Scope changes
- Force majeure claims

### Resolution methods

1. **Negotiation**: Direct between parties
2. **Mediation**: Through construction mediation centers
3. **Arbitration**: VIAC or international arbitration (if agreed)
4. **Litigation**: Court proceedings (last resort)

### Practical tips

- Document everything (daily logs, correspondence, photos)
- Follow notice requirements strictly
- Preserve evidence of defects or delays
- Engage legal counsel early in disputes

## Conclusion

Vietnam's construction sector offers tremendous opportunities but requires careful legal navigation. From permits to contracts to dispute resolution, professional legal guidance protects your investment.

**Contact Attorney Vo Thien Hien** at Apolo Lawyers for construction law advisory.`
    },
    {
      title: 'Data Privacy Law in Vietnam: PDPD Compliance Guide for Businesses',
      slug: 'data-privacy-law-vietnam-pdpd-compliance-guide',
      category: 'guide',
      publishedDate: '2026-03-10',
      excerpt: 'Comprehensive guide to Vietnam Personal Data Protection Decree: scope, consent requirements, data subject rights, cross-border transfer rules.',
      content: `# Data Privacy Law in Vietnam: PDPD Compliance Guide

## Introduction

Vietnam's Personal Data Protection Decree (PDPD, Decree 13/2023/ND-CP), effective July 1, 2023, established the country's first comprehensive data privacy framework. For businesses operating in or targeting Vietnam, compliance is now mandatory.

## Scope and Applicability

### Who must comply?

- All organizations processing personal data of individuals in Vietnam
- Both Vietnamese and foreign entities
- Applies regardless of where processing occurs

### What is personal data?

**Basic personal data**: Name, date of birth, gender, address, phone number, email, nationality, ID number, images.

**Sensitive personal data**: Political opinions, religious beliefs, health data, financial data, sexual orientation, biometric data, genetic data, criminal records, location data.

## Key Obligations

### 1. Consent

- Must obtain explicit consent before processing personal data
- Consent must be informed, specific, and freely given
- For sensitive data: consent must be separate and explicit
- Must be able to demonstrate consent was obtained

### 2. Data Processing Agreement

Required for all data processing activities. Must include:
- Purpose of processing
- Types of data processed
- Duration of processing
- Security measures
- Rights of data subjects

### 3. Data Protection Impact Assessment

Required when:
- Processing sensitive personal data
- Processing data of children
- Cross-border data transfers
- Using new technologies for processing
- Processing data for automated decision-making

### 4. Data Breach Notification

- Notify the Ministry of Public Security within 72 hours
- Notify affected data subjects without undue delay
- Document all breaches regardless of notification obligation

## Data Subject Rights

Individuals have the right to:

1. **Be informed** about data collection and processing
2. **Consent** to or refuse data processing
3. **Access** their personal data
4. **Rectify** inaccurate data
5. **Delete** their data
6. **Restrict** processing
7. **Object** to processing
8. **Data portability** — receive data in a structured format
9. **Lodge complaints** with authorities
10. **Claim damages** for violations

## Cross-Border Data Transfer

### Requirements

Transfer of personal data outside Vietnam requires:

1. Consent of the data subject
2. Data Protection Impact Assessment
3. Notification to the Ministry of Public Security
4. The transferring organization remains responsible for data protection
5. Written agreement with the receiving party

### Data Localization

- No general data localization requirement
- Specific sectors (banking, telecom) may have localization rules
- Government data must be stored in Vietnam

## Penalties

- Administrative fines: up to 100 million VND per violation
- Criminal liability: possible for severe violations
- Civil liability: damages claims from affected individuals
- Operational: suspension of data processing activities

## Compliance Roadmap

### Immediate steps

1. **Audit current data practices**: What data do you collect, why, and where is it stored?
2. **Update privacy policies**: Vietnamese and English versions
3. **Implement consent mechanisms**: Clear, specific, documented
4. **Appoint a data protection officer**: Recommended for organizations processing large volumes

### Ongoing compliance

1. Regular data protection impact assessments
2. Employee training on data handling
3. Vendor due diligence for data processors
4. Incident response plan for data breaches
5. Annual compliance review

## Conclusion

Vietnam's PDPD represents a significant step toward international data privacy standards. Early compliance not only avoids penalties but builds trust with Vietnamese consumers and business partners.

**Contact Attorney Vo Thien Hien** at Apolo Lawyers for data privacy compliance advisory.`
    },
    {
      title: 'Inheritance Law in Vietnam: Rights of Foreign Heirs',
      slug: 'inheritance-law-vietnam-rights-foreign-heirs',
      category: 'guide',
      publishedDate: '2026-03-08',
      excerpt: 'Guide for foreign nationals inheriting property in Vietnam: legal framework, inheritance rights, property restrictions, and practical procedures.',
      content: `# Inheritance Law in Vietnam: Rights of Foreign Heirs

## Introduction

When a person passes away in Vietnam — whether Vietnamese or foreign — their estate is distributed according to Vietnamese inheritance law if the assets are located in Vietnam. For foreign heirs, navigating this process involves unique challenges.

## Legal Framework

Vietnam's inheritance law is governed by:
- Civil Code 2015 (Part IV: Inheritance)
- Law on Private International Law 2015
- Housing Law 2023 (for real estate inheritance)
- Land Law 2024 (for land use rights)

## Types of Inheritance

### Inheritance by Will (Testamentary)

A valid will in Vietnam must meet these conditions:
- Testator was of sound mind and not coerced
- Will must be in writing (except emergency situations)
- Witnesses required if the will is not notarized
- Content must not violate law or public morality

### Inheritance by Law (Intestate)

When there is no valid will, assets are distributed by priority:

**First order**: Spouse, biological parents, adoptive parents, biological children, adopted children

**Second order**: Grandparents, siblings

**Third order**: Great-grandparents, uncles, aunts, nieces, nephews

All heirs within the same order receive equal shares.

## Rights of Foreign Heirs

### Movable property (cash, securities, vehicles)

Foreign heirs have the same inheritance rights as Vietnamese nationals for movable property. No restrictions apply.

### Real estate (houses and apartments)

Foreign heirs can inherit:
- Houses and apartments in approved projects
- Subject to the same ownership caps as foreign buyers (30% per building, 250 per ward)
- Ownership limited to 50 years (renewable)

If the property exceeds foreign ownership limits, the heir must sell within one year and receives the sale proceeds.

### Land use rights

This is the most restricted area:
- Foreign individuals generally cannot hold land use rights
- If inherited, they must transfer the land use rights to an eligible person
- They receive the monetary value of the transfer

## Practical Procedures

### Step 1: Obtain death certificate

- Issued by the commune People's Committee
- For deaths abroad: legalized death certificate from the relevant embassy

### Step 2: Gather estate documents

- Property certificates (CLUR, vehicle registration)
- Bank account information
- Will (if any)
- Family relationship certificates

### Step 3: Notarize inheritance

- All heirs appear before a notary office
- Declare and agree on estate distribution
- If agreement is reached: notarized inheritance agreement
- If not: file a lawsuit at the People's Court

### Step 4: Register property transfer

- Submit notarized documents to the Land Registration Office
- Processing time: 10-30 working days
- Pay transfer tax and registration fees

## Taxes and Fees

- Income tax on inheritance: 10% of the estate value exceeding 10 million VND
- Registration fee: 0.5% of property value
- Notarization fees: varies by value

## Common Challenges for Foreign Heirs

1. **Distance and language**: Navigating Vietnamese bureaucracy from abroad
2. **Document legalization**: Foreign documents must be apostilled/legalized
3. **Property restrictions**: May be forced to sell certain assets
4. **Multiple jurisdictions**: Estate may span multiple countries
5. **Statute of limitations**: 30 years for real estate, 10 years for movable property

## Conclusion

Inheritance matters involving foreign heirs in Vietnam require specialized legal knowledge spanning international private law, property law, and tax law.

**Contact Attorney Vo Thien Hien** at Apolo Lawyers for expert guidance on inheritance matters in Vietnam.`
    },
    {
      title: 'Joint Ventures in Vietnam: Legal Structure, Governance, and Exit Strategies',
      slug: 'joint-ventures-vietnam-legal-structure-governance-exit',
      category: 'guide',
      publishedDate: '2026-03-05',
      excerpt: 'Comprehensive guide to establishing and managing joint ventures in Vietnam: legal structures, governance, profit sharing, deadlock resolution, and exit.',
      content: `# Joint Ventures in Vietnam: Legal Structure, Governance, and Exit

## Introduction

Joint ventures (JVs) remain a popular entry strategy for foreign investors in Vietnam, particularly in sectors with foreign ownership restrictions. While Vietnam's Investment Law 2020 has liberalized many sectors, JVs continue to offer strategic advantages. **Attorney Vo Thien Hien** provides this practical guide based on extensive JV advisory experience.

## Why Joint Ventures?

### When a JV makes sense

- Sectors with foreign ownership caps (banking, telecom, media)
- Need for local market knowledge and relationships
- Government contracts requiring local participation
- Distribution networks in consumer sectors
- Real estate development partnerships

### When to consider alternatives

- Full foreign ownership is permitted in your sector
- You want complete operational control
- The local partner lacks genuine capability
- Cultural or governance differences are too significant

## Legal Structures

### Two-Member LLC (Most Common)

- Minimum 2, maximum 50 members
- Members' Council is the highest decision-making body
- Each member's voting rights proportional to capital contribution
- 75% supermajority required for major decisions

### Joint Stock Company

- Minimum 3 shareholders
- More complex governance (Board of Directors + General Meeting)
- Easier to add/remove shareholders
- Can list on stock exchange

### Business Cooperation Contract (BCC)

- No new legal entity created
- Each party operates under their own name
- Profit/loss sharing per contract
- Suitable for short-term projects

## Key JV Agreement Terms

### 1. Capital Contributions

- Type: cash, assets, intellectual property, technology
- Valuation methodology for non-cash contributions
- Timeline for capital contribution (must complete within 90 days)
- Consequences of failure to contribute

### 2. Governance

- Composition of Members' Council/Board
- Chairman appointment and rotation
- Supermajority vs. simple majority decisions
- Day-to-day management (General Director appointment)
- Reporting requirements and information access

### 3. Profit Distribution

- Proportional to capital contribution (default rule)
- Alternative: performance-based distribution
- Timing and conditions for distribution
- Reinvestment vs. dividend policy

### 4. Deadlock Resolution

Critical for 50/50 JVs:
- Escalation to senior management
- Mediation by agreed third party
- Expert determination for specific issues
- Put/call options as last resort
- Dissolution mechanism if deadlock persists

### 5. Non-Compete and Exclusivity

- Geographic scope of non-compete
- Duration (typically life of JV + 2-3 years)
- Carve-outs for existing businesses
- Consequences of breach

## Exit Strategies

### 1. Transfer of Interest

- Right of first refusal for remaining partner
- Third-party transfer restrictions
- Valuation methodology (fair market value, formula-based, independent valuation)
- Approval requirements (may need government approval)

### 2. Put/Call Options

- Put option: right to sell your interest to the partner
- Call option: right to buy the partner's interest
- Trigger events: deadlock, change of control, material breach
- Pricing mechanism: fixed formula or independent valuation

### 3. Dissolution

- Voluntary dissolution by mutual agreement
- Asset distribution and liability settlement
- Employee obligations
- Tax clearance requirements
- Government deregistration

## Common Pitfalls

1. **Insufficient due diligence** on local partner
2. **Vague governance provisions** leading to deadlock
3. **No exit mechanism** — trapped in a bad partnership
4. **Underestimating cultural differences** in decision-making
5. **Ignoring related-party transactions** — transfer pricing risk

## Conclusion

A well-structured JV agreement is the foundation for successful partnership in Vietnam. Invest time upfront in governance design, deadlock resolution, and exit planning.

**Contact Attorney Vo Thien Hien** at Apolo Lawyers for expert joint venture advisory in Vietnam.`
    },
    {
      title: 'Vietnam E-Commerce Regulations: Legal Compliance for Online Businesses',
      slug: 'vietnam-e-commerce-regulations-legal-compliance',
      category: 'guide',
      publishedDate: '2026-03-02',
      excerpt: 'Guide to Vietnam e-commerce law: registration requirements, consumer protection, electronic contracts, payment processing, and cross-border selling.',
      content: `# Vietnam E-Commerce Regulations: Legal Compliance for Online Businesses

## Introduction

Vietnam's e-commerce market is projected to reach $39 billion by 2025, making it one of Southeast Asia's fastest-growing digital economies. With growth comes regulation — and compliance is essential for both domestic and foreign online businesses.

## Legal Framework

Key regulations:
- E-Commerce Decree 52/2013/ND-CP (amended by Decree 85/2021/ND-CP)
- Consumer Protection Law 2023
- Electronic Transactions Law 2023
- Personal Data Protection Decree 13/2023/ND-CP
- Cybersecurity Law 2018

## Registration Requirements

### E-commerce websites

All e-commerce websites must be registered or notified with MOIT:

**Notification** (for selling websites):
- Complete online notification at online.gov.vn
- Provide business registration, domain name, product categories

**Registration** (for e-commerce platforms):
- More extensive requirements
- Must demonstrate technical capability
- Financial requirements
- Content moderation policies

### Social commerce

Selling through social media (Facebook, Zalo, TikTok):
- Same tax obligations as traditional e-commerce
- Must declare income from social selling
- Platform operators have reporting obligations

## Consumer Protection

### Required disclosures

Online sellers must prominently display:
- Full legal name and business registration number
- Contact address and phone number
- Product descriptions, prices (including all fees)
- Return and refund policy
- Delivery timeline and methods
- Payment methods and security measures

### Cooling-off period

- Consumers have the right to return goods within 3 days for distance selling
- Exceptions: perishable goods, personalized items, digital content

### Prohibited practices

- Misleading advertising or fake reviews
- Hidden fees or surprise charges
- Unauthorized use of customer data
- Pyramid selling schemes disguised as e-commerce

## Electronic Contracts

### Validity

- Electronic contracts are legally valid under the E-Transactions Law 2023
- Electronic signatures are recognized
- Terms and conditions must be clearly displayed and accepted

### Cross-border contracts

- Vietnamese consumer protection law applies when targeting Vietnamese consumers
- Choice of law clauses may be limited
- Vietnamese courts have jurisdiction for disputes involving Vietnamese consumers

## Tax Obligations

### For domestic e-commerce businesses

- Corporate Income Tax: 20%
- VAT: 10% (standard) or 8% (reduced rate if applicable)
- Must issue electronic invoices for all transactions

### For foreign e-commerce platforms

- Must register for tax in Vietnam
- VAT applies to digital services consumed in Vietnam
- Withholding tax may apply
- Major platforms must declare revenue from Vietnamese users

### For individual sellers

- Personal Income Tax on business income
- Threshold: 100 million VND annual revenue
- Must register with tax authorities

## Cross-Border E-Commerce

### Importing goods

- Customs declaration required for all shipments
- Import duties apply (rates vary by product category)
- De minimis threshold: 1 million VND (no duty below this amount)
- Prohibited and restricted goods list applies

### Foreign seller obligations

- Must comply with Vietnamese product standards
- Labeling requirements (Vietnamese language)
- Product liability applies
- Must appoint a responsible representative in Vietnam

## Data Protection

- Comply with PDPD (Decree 13/2023)
- Obtain consent for data collection
- Implement data security measures
- Cross-border data transfer restrictions
- Data breach notification within 72 hours

## Conclusion

Vietnam's e-commerce regulations are evolving rapidly. Staying compliant requires ongoing attention to legal changes and proactive compliance measures.

**Contact Attorney Vo Thien Hien** at Apolo Lawyers for e-commerce legal compliance advisory.`
    },
    {
      title: 'Environmental Law Compliance in Vietnam: Requirements for Industrial Projects',
      slug: 'environmental-law-compliance-vietnam-industrial-projects',
      category: 'analysis',
      publishedDate: '2026-02-28',
      excerpt: 'Guide to environmental compliance for industrial projects in Vietnam: EIA requirements, permits, waste management, and enforcement trends.',
      content: `# Environmental Law Compliance in Vietnam: Industrial Projects

## Introduction

Environmental compliance in Vietnam has become increasingly stringent. The Environmental Protection Law 2020 (effective January 1, 2022) introduced significant new requirements that affect all industrial and manufacturing projects.

## Legal Framework

- Environmental Protection Law 2020 (Law 72/2020/QH14)
- Decree 08/2022/ND-CP (detailed implementation)
- Circular 02/2022/TT-BTNMT (technical standards)
- Various sector-specific environmental standards (QCVN)

## Environmental Impact Assessment (EIA)

### Projects requiring EIA

Group I (highest impact):
- Projects in nature reserves, national parks
- Projects using large areas of forest land
- Nuclear facilities
- Large-scale industrial projects

Group II (significant impact):
- Most manufacturing and industrial projects
- Real estate developments over certain thresholds
- Infrastructure projects

### EIA Process

1. **Scoping**: Identify potential environmental impacts
2. **Baseline study**: Document existing environmental conditions
3. **Impact assessment**: Analyze construction and operational impacts
4. **Mitigation measures**: Propose prevention and control measures
5. **Public consultation**: Required for Group I and certain Group II projects
6. **Report submission**: To MONRE or provincial DONRE
7. **Review and approval**: 30-45 working days

### Environmental License

Replaces the old Environmental Protection Plan. Required before commencing operations.

## Key Compliance Areas

### 1. Wastewater

- Must meet QCVN discharge standards
- Wastewater treatment system required
- Automatic monitoring for large discharges
- Regular sampling and reporting

### 2. Air Emissions

- Must meet QCVN emission standards
- Dust and gas treatment systems required
- Stack monitoring for major sources
- Fugitive emission controls

### 3. Solid and Hazardous Waste

- Must contract licensed waste transporters and treaters
- Hazardous waste manifest system
- Storage time limits (12 months maximum for hazardous waste)
- Annual reporting to environmental authorities

### 4. Noise and Vibration

- Must comply with QCVN standards
- Monitoring at facility boundary
- Mitigation measures for sensitive receptors

## Environmental Monitoring

### Self-monitoring obligations

- Regular sampling of wastewater, air emissions, noise
- Frequency: quarterly or semi-annually (depending on scale)
- Automatic continuous monitoring for large facilities
- Data transmission to authorities in real-time

### Reporting

- Annual environmental monitoring report
- Hazardous waste management report
- Environmental audit (every 5 years for major facilities)

## Enforcement Trends

Vietnam has significantly increased environmental enforcement:

### Administrative penalties

- Fines up to 2 billion VND for organizations
- Operational suspension for serious violations
- Remediation orders

### Criminal liability

- Environmental crimes: up to 10 years imprisonment
- Corporate criminal liability introduced
- Increasing prosecution of environmental violations

### Community monitoring

- Public participation in environmental monitoring
- Community complaint mechanisms
- NGO involvement in oversight

## Practical Recommendations

1. **Conduct early environmental due diligence** before site selection
2. **Budget adequately** for environmental management systems
3. **Engage qualified consultants** for EIA preparation
4. **Implement ISO 14001** environmental management system
5. **Train employees** on environmental compliance
6. **Maintain comprehensive records** — authorities can audit at any time

## Conclusion

Environmental compliance in Vietnam is no longer optional — it is a core business requirement. Proactive compliance protects your investment, reputation, and operational continuity.

**Contact Attorney Vo Thien Hien** at Apolo Lawyers for environmental law advisory for your project in Vietnam.`
    },
    {
      title: 'Banking and Finance Regulations in Vietnam: Guide for Foreign Investors',
      slug: 'banking-finance-regulations-vietnam-foreign-investors',
      category: 'analysis',
      publishedDate: '2026-02-25',
      excerpt: 'Overview of Vietnam banking and finance regulations: foreign investment in banks, lending restrictions, foreign exchange controls, and fintech licensing.',
      content: `# Banking and Finance Regulations in Vietnam

## Introduction

Vietnam's banking and finance sector presents both opportunities and regulatory complexity for foreign investors. The State Bank of Vietnam (SBV) maintains strict oversight, and understanding the regulatory landscape is essential for any financial sector investment.

## Banking Sector Structure

### Types of banking institutions

1. **State-owned commercial banks** (Vietcombank, VietinBank, BIDV, Agribank)
2. **Joint-stock commercial banks** (31 banks)
3. **Foreign bank branches** (9 branches)
4. **100% foreign-owned banks** (2 banks: HSBC, Shinhan)
5. **Joint venture banks** (limited presence)

### Foreign ownership limits

- Single foreign investor: maximum 20% of voting shares
- All foreign investors combined: maximum 30%
- Strategic foreign investor: maximum 20% (requires SBV approval)

## Foreign Exchange Controls

### Capital account

- Foreign investors can freely contribute and repatriate capital
- Profit remittance allowed after fulfilling tax obligations
- Capital account transactions require SBV approval
- Intra-company loans must be registered with SBV

### Current account

- Generally free for trade-related transactions
- Foreign currency accounts permitted for certain purposes
- Exchange rate determined by market (within SBV band)

### Loan registration

Foreign loans must be registered with SBV:
- Short-term loans (under 1 year): reporting only
- Medium/long-term loans: prior registration required
- Interest rate caps may apply
- Debt-to-equity ratios monitored

## Lending Regulations

### Interest rate controls

- Deposit rates: SBV sets maximum for short-term deposits
- Lending rates: largely market-determined
- Consumer lending: additional consumer protection requirements
- Maximum lending rate for certain priority sectors

### Lending limits

- Single borrower: maximum 15% of bank's equity
- Single borrower group: maximum 25%
- Related party lending restrictions
- Real estate lending caps (percentage of total portfolio)

## Fintech Regulations

### Current framework

Vietnam has embraced fintech through:
- **Regulatory sandbox**: Testing new financial products/services
- **Mobile money**: Licensed pilot programs
- **Digital banking**: Electronic KYC permitted
- **Payment services**: Licensed intermediary payment services

### Key requirements

- Payment intermediary license from SBV
- Minimum capital requirements
- Technology security standards
- Consumer protection obligations
- Anti-money laundering compliance

### Cryptocurrency

- Not recognized as legal tender
- Trading not officially prohibited but not regulated
- SBV has warned about risks
- New regulations expected

## Anti-Money Laundering (AML)

### Obligations

- Customer due diligence (CDD) for all accounts
- Enhanced due diligence for high-risk customers
- Suspicious transaction reporting to SBV
- Record keeping (minimum 5 years)
- Staff training on AML

### Reporting thresholds

- Cash transactions: 300 million VND or equivalent
- Electronic transfers: no threshold (risk-based)
- Suspicious transactions: any amount

## Practical Considerations

1. **Engage early with SBV** for any financial sector investment
2. **Understand the approval timeline** — SBV reviews can take 3-6 months
3. **Plan foreign exchange carefully** — registration requirements are strict
4. **Budget for compliance** — AML and reporting obligations are significant
5. **Monitor regulatory changes** — Vietnamese financial regulations evolve rapidly

## Conclusion

Vietnam's banking and finance sector offers growth opportunities but requires careful regulatory navigation. Expert legal counsel with SBV relationship experience is essential.

**Contact Attorney Vo Thien Hien** at Apolo Lawyers for banking and finance regulatory advisory.`
    },
    {
      title: 'Work Permit Requirements in Vietnam: Complete Guide for Employers',
      slug: 'work-permit-requirements-vietnam-complete-guide',
      category: 'guide',
      publishedDate: '2026-02-22',
      excerpt: 'Step-by-step guide to obtaining work permits in Vietnam: eligibility, application process, exemptions, renewal, and common pitfalls.',
      content: `# Work Permit Requirements in Vietnam

## Introduction

All foreign nationals working in Vietnam must obtain a work permit, with limited exceptions. The process has been streamlined in recent years but remains detailed and document-intensive. This guide by **Attorney Vo Thien Hien** covers the complete process.

## Who Needs a Work Permit?

### Required for

- All foreign employees working in Vietnam
- Foreign managers, executives, and specialists
- Technical workers and skilled laborers
- Foreign interns (over 90 days)

### Exemptions

Work permits are NOT required for:
- Intra-company transferees (under 90 days, with notification)
- Foreign investors/capital contributors visiting for business
- Emergency technical assistance (under 30 days)
- International students on approved internships
- Foreign lawyers licensed in Vietnam
- Certain categories under international treaties

## Eligibility Requirements

### For the foreign employee

1. **Age**: At least 18 years old
2. **Health**: Medical certificate from an approved Vietnamese hospital
3. **No criminal record**: Police clearance from home country or country of residence
4. **Qualifications**: One of the following:
   - Manager/Executive: Proof of management experience
   - Expert: University degree + 3 years relevant experience
   - Technical worker: Certificate + years of training/experience

### For the employer

1. Must have a legitimate business operation in Vietnam
2. Must demonstrate the need for foreign labor (local recruitment efforts)
3. Must submit a foreign labor utilization report

## Application Process

### Step 1: Foreign Labor Report (30 days before hiring)

- Submit to provincial DOLISA (Department of Labor)
- Report the position, qualifications required, and why a local cannot fill it
- DOLISA approves or requests local recruitment first

### Step 2: Gather Required Documents

**From the employee's home country**:
- Criminal background check (apostilled/legalized)
- Degree certificates (apostilled/legalized)
- Employment history verification

**In Vietnam**:
- Health certificate from approved hospital
- Passport copy (notarized)
- Photos (4x6 color, white background)

**From the employer**:
- Business registration certificate
- Foreign labor report approval
- Employment contract or appointment letter

### Step 3: Submit Work Permit Application

- Submit to provincial DOLISA
- Processing time: 5 working days (after complete submission)
- Work permit valid for up to 2 years

### Step 4: Receive Work Permit

- Collect from DOLISA
- Employee must carry the work permit during work

## Renewal Process

- Apply at least 5 days before expiry
- Same documents required (updated)
- Processing: 5 working days
- Maximum renewal: same position and employer

## Common Pitfalls

1. **Document legalization delays**: Start apostille/legalization process 2-3 months early
2. **Health certificate validity**: Only 12 months — time the medical exam carefully
3. **Criminal record clearance**: Some countries take 6-8 weeks to issue
4. **Degree authentication**: Some positions require degree in relevant field
5. **Late applications**: Working without a valid permit = significant fines

## Penalties for Non-Compliance

### For the employer

- Fine: 50-75 million VND per foreign worker without work permit
- Deportation of the foreign worker at employer's expense
- Possible revocation of business license

### For the employee

- Fine: 15-25 million VND
- Deportation
- Entry ban (possible)

## Practical Recommendations

1. **Start the process early** — minimum 3 months before intended start date
2. **Use experienced immigration counsel** — document requirements change frequently
3. **Keep copies of everything** — original documents may be required at multiple stages
4. **Calendar renewal dates** — expired work permits cannot be "extended"
5. **Notify DOLISA of changes** — position changes require a new work permit

## Conclusion

Work permit compliance in Vietnam protects both the employer and the foreign employee. The relatively straightforward process becomes complex only when documentation is incomplete or deadlines are missed.

**Contact Attorney Vo Thien Hien** at Apolo Lawyers for work permit and immigration advisory services.`
    }
  ];
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
