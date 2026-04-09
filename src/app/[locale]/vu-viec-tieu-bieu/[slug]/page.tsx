import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import Button from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
import { IMAGES } from '@/lib/images';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

interface MatterDetail {
  title: string;
  year: string;
  area: string;
  areaSlug: string;
  client: string;
  challenge: string;
  approach: string;
  outcome: string;
  relatedSlugs: string[];
}

// Map area slugs to images
const areaSlugImageMap: Record<string, { src: string; alt: string }> = {
  'tranh-chap-dat-dai': { src: IMAGES.practiceLand.cdn, alt: IMAGES.practiceLand.alt },
  'land-disputes': { src: IMAGES.practiceLand.cdn, alt: IMAGES.practiceLand.alt },
  'luat-doanh-nghiep': { src: IMAGES.practiceCorporate.cdn, alt: IMAGES.practiceCorporate.alt },
  'corporate-law': { src: IMAGES.practiceCorporate.cdn, alt: IMAGES.practiceCorporate.alt },
  'luat-hinh-su': { src: IMAGES.practiceCriminal.cdn, alt: IMAGES.practiceCriminal.alt },
  'criminal-defense': { src: IMAGES.practiceCriminal.cdn, alt: IMAGES.practiceCriminal.alt },
  'tranh-chap-lao-dong': { src: IMAGES.practiceLabor.cdn, alt: IMAGES.practiceLabor.alt },
  'labor-disputes': { src: IMAGES.practiceLabor.cdn, alt: IMAGES.practiceLabor.alt },
  'hon-nhan-gia-dinh': { src: IMAGES.practiceFamily.cdn, alt: IMAGES.practiceFamily.alt },
  'family-law': { src: IMAGES.practiceFamily.cdn, alt: IMAGES.practiceFamily.alt },
};

function getAreaImage(areaSlug: string) {
  return areaSlugImageMap[areaSlug] || { src: IMAGES.practiceCivil.cdn, alt: IMAGES.practiceCivil.alt };
}

const mattersData: Record<string, { vi: MatterDetail; en: MatterDetail }> = {
  'tranh-chap-bat-dong-san-50-ty': {
    vi: {
      title: 'Tranh chấp bất động sản thương mại trị giá 50 tỷ đồng',
      year: '2023',
      area: 'Đất đai',
      areaSlug: 'tranh-chap-dat-dai',
      client: 'Công ty cổ phần đầu tư bất động sản',
      challenge: 'Khách hàng là bên mua trong hợp đồng mua bán bất động sản thương mại trị giá 50 tỷ đồng. Bên bán đã vi phạm nhiều điều khoản hợp đồng, bao gồm chậm bàn giao, không đảm bảo chất lượng xây dựng và không hoàn thành thủ tục pháp lý. Vụ việc liên quan đến nhiều bên thứ ba và có tính phức tạp cao về mặt pháp lý.',
      approach: 'Chúng tôi đã tiến hành phân tích toàn diện hợp đồng và các tài liệu liên quan, thu thập chứng cứ về các vi phạm của bên bán. Đội ngũ luật sư đã xây dựng chiến lược tranh tụng đa tầng, bắt đầu từ thương lượng trực tiếp, sau đó chuyển sang hòa giải tại trung tâm trọng tài và cuối cùng là khởi kiện tại tòa án.',
      outcome: 'Sau quá trình thương lượng và hòa giải, hai bên đã đạt được thỏa thuận giải quyết, theo đó khách hàng được bồi thường toàn bộ thiệt hại và được giảm giá bàn giao. Tổng giá trị bồi thường và quyền lợi đạt được là hơn 8 tỷ đồng.',
      relatedSlugs: ['khieu-nai-boi-thuong-giai-phong-mat-bang'],
    },
    en: {
      title: 'Commercial real estate dispute valued at VND 50 billion',
      year: '2023',
      area: 'Land',
      areaSlug: 'land-disputes',
      client: 'Real estate investment joint-stock company',
      challenge: 'The client was the buyer in a VND 50 billion commercial real estate purchase agreement. The seller breached multiple contract terms, including delayed handover, construction quality failures, and incomplete legal procedures. The matter involved multiple third parties and high legal complexity.',
      approach: 'We conducted a comprehensive analysis of the contract and related documents, gathering evidence of the seller\'s breaches. The legal team developed a multi-tier litigation strategy, beginning with direct negotiation, then mediation at an arbitration center, and finally court proceedings.',
      outcome: 'Following negotiation and mediation, both parties reached a settlement agreement, under which the client received full damages compensation and a reduced handover price. Total compensation and benefits achieved exceeded VND 8 billion.',
      relatedSlugs: ['land-clearance-compensation-complaint'],
    },
  },
  'tu-van-ma-tap-doan-200-ty': {
    vi: {
      title: 'Tư vấn M&A cho giao dịch 200 tỷ đồng',
      year: '2023',
      area: 'Doanh nghiệp',
      areaSlug: 'luat-doanh-nghiep',
      client: 'Tập đoàn đầu tư đa ngành',
      challenge: 'Khách hàng muốn mua lại một công ty bất động sản có vốn điều lệ 200 tỷ đồng. Giao dịch đòi hỏi thẩm định pháp lý toàn diện, đánh giá rủi ro pháp lý và thuế, soạn thảo hợp đồng phức tạp và thực hiện các thủ tục đăng ký thay đổi.',
      approach: 'Đội ngũ luật sư đã tiến hành thẩm định pháp lý (due diligence) toàn diện, bao gồm kiểm tra tình trạng pháp lý của công ty mục tiêu, các quyền sử dụng đất, hợp đồng hiện hành, nghĩa vụ thuế và các rủi ro tiềm ẩn. Chúng tôi đã soạn thảo toàn bộ hệ thống hợp đồng giao dịch và hỗ trợ thực hiện các thủ tục hậu M&A.',
      outcome: 'Giao dịch được hoàn thành đúng tiến độ, các rủi ro pháp lý được nhận diện và xử lý trước khi ký kết. Khách hàng tiết kiệm được chi phí đáng kể nhờ các điều khoản bảo đảm và bồi thường được thiết kế hợp lý.',
      relatedSlugs: ['giai-quyet-tranh-chap-lao-dong-tap-the'],
    },
    en: {
      title: 'M&A advisory for VND 200 billion transaction',
      year: '2023',
      area: 'Corporate',
      areaSlug: 'corporate-law',
      client: 'Multi-sector investment conglomerate',
      challenge: 'The client sought to acquire a real estate company with VND 200 billion in charter capital. The transaction required comprehensive legal due diligence, legal and tax risk assessment, complex contract drafting, and execution of amendment registration procedures.',
      approach: 'The legal team conducted comprehensive legal due diligence, including verification of the target company\'s legal status, land use rights, existing contracts, tax obligations, and potential risks. We drafted the complete transaction contract system and supported post-M&A procedures.',
      outcome: 'The transaction was completed on schedule, with all legal risks identified and addressed prior to signing. The client achieved significant cost savings through well-designed warranty and indemnification clauses.',
      relatedSlugs: ['collective-labor-dispute-200-workers'],
    },
  },
  'bao-chua-vu-an-kinh-te': {
    vi: {
      title: 'Bào chữa trong vụ án kinh tế phức tạp',
      year: '2023',
      area: 'Hình sự',
      areaSlug: 'luat-hinh-su',
      client: 'Giám đốc doanh nghiệp',
      challenge: 'Thân chủ bị truy tố về tội vi phạm quy định về quản lý kinh tế, đối mặt với mức hình phạt tù 5-10 năm theo đề nghị của viện kiểm sát. Vụ án có khối lượng hồ sơ lớn và liên quan đến nhiều giao dịch tài chính phức tạp.',
      approach: 'Luật sư đã tham gia từ giai đoạn điều tra, đảm bảo quyền bào chữa của thân chủ được bảo vệ. Chúng tôi đã thu thập chứng cứ độc lập, mời chuyên gia tài chính đánh giá lại các giao dịch và xây dựng luận cứ bào chữa chuyên nghiệp, chứng minh hành vi của thân chủ không cấu thành tội phạm.',
      outcome: 'Tòa án đã chấp nhận phần lớn luận cứ bào chữa, tuyên phạt thân chủ mức án thấp hơn đáng kể so với đề nghị của viện kiểm sát. Thân chủ được hưởng án treo và được phép tiếp tục điều hành doanh nghiệp.',
      relatedSlugs: ['tranh-chap-bat-dong-san-50-ty'],
    },
    en: {
      title: 'Defense in complex economic criminal case',
      year: '2023',
      area: 'Criminal',
      areaSlug: 'criminal-defense',
      client: 'Business executive',
      challenge: 'The client was prosecuted for violations of economic management regulations, facing a 5-10 year imprisonment recommendation from the procuracy. The case involved extensive files and complex financial transactions.',
      approach: 'Attorney participated from the investigation stage, ensuring the client\'s defense rights were protected. We collected independent evidence, engaged financial experts to reassess transactions, and developed professional defense arguments proving the client\'s actions did not constitute a crime.',
      outcome: 'The court accepted the majority of defense arguments, sentencing the client to a significantly lower penalty than the procuracy\'s recommendation. The client received a suspended sentence and was permitted to continue managing the business.',
      relatedSlugs: ['commercial-real-estate-dispute-50b'],
    },
  },
  'giai-quyet-tranh-chap-lao-dong-tap-the': {
    vi: {
      title: 'Giải quyết tranh chấp lao động tập thể 200 công nhân',
      year: '2022',
      area: 'Lao động',
      areaSlug: 'tranh-chap-lao-dong',
      client: 'Công ty sản xuất công nghiệp',
      challenge: '200 công nhân tại nhà máy ngừng việc tập thể do bất đồng về điều kiện lao động và tiền lương. Vụ việc có nguy cơ leo thang và ảnh hưởng nghiêm trọng đến hoạt động sản xuất của doanh nghiệp.',
      approach: 'Luật sư đã nhanh chóng tham gia làm trung gian hòa giải giữa hai bên. Chúng tôi đã phân tích các yêu cầu của người lao động, đánh giá tính hợp pháp và hợp lý, đồng thời tư vấn doanh nghiệp về nghĩa vụ pháp lý và các giải pháp khả thi.',
      outcome: 'Sau 2 tuần thương lượng, hai bên đã đạt được thỏa thuận: doanh nghiệp tăng lương 15%, cải thiện điều kiện làm việc và cam kết không xử lý kỷ luật đối với công nhân tham gia đình công. Hoạt động sản xuất được khôi phục bình thường.',
      relatedSlugs: ['ly-hon-phan-chia-tai-san-30-ty'],
    },
    en: {
      title: 'Collective labor dispute resolution for 200 workers',
      year: '2022',
      area: 'Labor',
      areaSlug: 'labor-disputes',
      client: 'Industrial manufacturing company',
      challenge: '200 factory workers collectively stopped work due to disagreements over working conditions and wages. The situation risked escalation and serious impact on the company\'s production operations.',
      approach: 'Attorney quickly engaged as a mediator between both parties. We analyzed the workers\' demands, assessed their legality and reasonableness, and advised the enterprise on legal obligations and feasible solutions.',
      outcome: 'After 2 weeks of negotiation, both parties reached an agreement: the company increased wages by 15%, improved working conditions, and committed to no disciplinary action against striking workers. Normal production resumed.',
      relatedSlugs: ['divorce-property-division-30b'],
    },
  },
  'ly-hon-phan-chia-tai-san-30-ty': {
    vi: {
      title: 'Ly hôn và phân chia tài sản chung 30 tỷ đồng',
      year: '2022',
      area: 'Gia đình',
      areaSlug: 'hon-nhan-gia-dinh',
      client: 'Cá nhân',
      challenge: 'Khách hàng muốn ly hôn và cần bảo vệ quyền lợi tài sản chung trị giá 30 tỷ đồng, bao gồm bất động sản, cổ phiếu và tài sản kinh doanh. Bên kia có sự hỗ trợ của đội ngũ luật sư kinh nghiệm và có ý định chiếm hữu phần lớn tài sản.',
      approach: 'Chúng tôi đã tiến hành điều tra và thu thập chứng cứ về toàn bộ tài sản chung trong thời kỳ hôn nhân, bao gồm tài sản bị giấu giếm. Đội ngũ luật sư đã xây dựng luận cứ pháp lý vững chắc về đóng góp của khách hàng và quyền phân chia tài sản công bằng.',
      outcome: 'Tòa án đã chấp nhận phương án phân chia tài sản có lợi cho khách hàng, đảm bảo quyền nuôi con và cấp dưỡng phù hợp. Tổng giá trị tài sản mà khách hàng được phân chia là hơn 18 tỷ đồng.',
      relatedSlugs: ['bao-chua-vu-an-kinh-te'],
    },
    en: {
      title: 'Divorce and VND 30 billion marital property division',
      year: '2022',
      area: 'Family',
      areaSlug: 'family-law',
      client: 'Individual',
      challenge: 'Client sought divorce and needed to protect interests in VND 30 billion in marital assets, including real estate, stocks, and business assets. The opposing party had experienced legal counsel and intended to claim the majority of assets.',
      approach: 'We conducted investigation and evidence collection on all marital assets, including hidden assets. The legal team built strong legal arguments regarding the client\'s contributions and right to equitable asset division.',
      outcome: 'The court accepted a favorable asset division plan for the client, ensuring appropriate child custody and alimony arrangements. Total assets awarded to the client exceeded VND 18 billion.',
      relatedSlugs: ['criminal-defense-economic-case'],
    },
  },
  'khieu-nai-boi-thuong-giai-phong-mat-bang': {
    vi: {
      title: 'Khiếu nại bồi thường giải phóng mặt bằng dự án',
      year: '2021',
      area: 'Đất đai',
      areaSlug: 'tranh-chap-dat-dai',
      client: 'Nhóm cư dân',
      challenge: '30 hộ dân bị ảnh hưởng bởi dự án phát triển đô thị khiếu nại mức bồi thường giải phóng mặt bằng quá thấp, không phản ánh đúng giá trị thị trường và thiệt hại thực tế. Cơ quan nhà nước đã ban hành quyết định bồi thường mà không tham vấn đầy đủ ý kiến người dân.',
      approach: 'Luật sư đã đại diện cho nhóm cư dân, thu thập chứng cứ về giá trị thị trường thực tế của đất, mời tổ chức thẩm định giá độc lập và xây dựng đơn khiếu nại chi tiết gửi cơ quan có thẩm quyền. Chúng tôi cũng đồng thời tiến hành vận động và đối thoại với chính quyền địa phương.',
      outcome: 'Cơ quan có thẩm quyền đã chấp nhận khiếu nại và điều chỉnh mức bồi thường tăng 200% so với phương án ban đầu. Ngoài ra, các hộ dân còn được hỗ trợ tái định cư và hỗ trợ chuyển đổi nghề nghiệp.',
      relatedSlugs: ['tranh-chap-bat-dong-san-50-ty'],
    },
    en: {
      title: 'Project land clearance compensation complaint',
      year: '2021',
      area: 'Land',
      areaSlug: 'land-disputes',
      client: 'Group of residents',
      challenge: '30 households affected by an urban development project complained that land clearance compensation was too low, not reflecting actual market value and real damages. The state authority had issued compensation decisions without adequate public consultation.',
      approach: 'Attorney represented the resident group, collecting evidence of actual land market values, engaging independent appraisal organizations, and preparing detailed complaints to competent authorities. We simultaneously conducted advocacy and dialogue with local government.',
      outcome: 'The competent authority accepted the complaint and adjusted compensation by 200% increase from the initial proposal. Additionally, households received resettlement support and occupational transition assistance.',
      relatedSlugs: ['commercial-real-estate-dispute-50b'],
    },
  },
};

// Map for VI <-> EN slug lookups
const viToEnSlug: Record<string, string> = {
  'tranh-chap-bat-dong-san-50-ty': 'commercial-real-estate-dispute-50b',
  'tu-van-ma-tap-doan-200-ty': 'ma-advisory-200b-transaction',
  'bao-chua-vu-an-kinh-te': 'criminal-defense-economic-case',
  'giai-quyet-tranh-chap-lao-dong-tap-the': 'collective-labor-dispute-200-workers',
  'ly-hon-phan-chia-tai-san-30-ty': 'divorce-property-division-30b',
  'khieu-nai-boi-thuong-giai-phong-mat-bang': 'land-clearance-compensation-complaint',
};

const enToViSlug: Record<string, string> = Object.fromEntries(
  Object.entries(viToEnSlug).map(([vi, en]) => [en, vi])
);

const allViSlugs = Object.keys(viToEnSlug);
const allEnSlugs = Object.values(viToEnSlug);

export function generateStaticParams() {
  return [
    ...allViSlugs.map((slug) => ({ locale: 'vi', slug })),
    ...allEnSlugs.map((slug) => ({ locale: 'en', slug })),
  ];
}

function getCanonicalSlug(slug: string): string {
  if (mattersData[slug]) return slug;
  return enToViSlug[slug] || slug;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const isVi = locale === 'vi';
  const canonicalSlug = getCanonicalSlug(slug);
  const data = mattersData[canonicalSlug];

  if (!data) return { title: 'Not Found' };

  const content = isVi ? data.vi : data.en;
  const heroImage = getAreaImage(content.areaSlug);

  return {
    title: `${content.title} | ${isVi ? 'Luật sư Võ Thiện Hiển' : 'Attorney Vo Thien Hien'}`,
    description: content.challenge.substring(0, 160),
    alternates: {
      canonical: isVi
        ? `/vi/vu-viec-tieu-bieu/${canonicalSlug}`
        : `/en/representative-experience/${viToEnSlug[canonicalSlug] || slug}`,
      languages: {
        vi: `/vi/vu-viec-tieu-bieu/${canonicalSlug}`,
        en: `/en/representative-experience/${viToEnSlug[canonicalSlug] || slug}`,
      },
    },
    openGraph: {
      images: [{ url: heroImage.src, width: 1200, height: 630 }],
    },
  };
}

export default async function MatterDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const isVi = locale === 'vi';
  const canonicalSlug = getCanonicalSlug(slug);
  const data = mattersData[canonicalSlug];

  if (!data) notFound();

  const content = isVi ? data.vi : data.en;
  const heroImage = getAreaImage(content.areaSlug);

  // Find related matters
  const relatedMatters = content.relatedSlugs
    .map((rs) => {
      const rCanonical = getCanonicalSlug(rs);
      const rData = mattersData[rCanonical];
      if (!rData) return null;
      const rContent = isVi ? rData.vi : rData.en;
      return { slug: isVi ? rCanonical : viToEnSlug[rCanonical] || rs, ...rContent };
    })
    .filter(Boolean);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: content.title,
      image: heroImage.src,
      author: {
        '@type': 'Person',
        name: 'Vo Thien Hien',
      },
      datePublished: `${content.year}-01-01`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: isVi ? 'Trang chủ' : 'Home', item: `https://vothienhien.com/${locale}` },
        { '@type': 'ListItem', position: 2, name: isVi ? 'Vụ việc tiêu biểu' : 'Representative Experience', item: `https://vothienhien.com/${locale}/${isVi ? 'vu-viec-tieu-bieu' : 'representative-experience'}` },
        { '@type': 'ListItem', position: 3, name: content.title },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero with Practice Area Image */}
      <section className="relative bg-primary text-white py-28 md:py-36 overflow-hidden">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/75 via-primary/65 to-primary/85" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Link
            href="/vu-viec-tieu-bieu"
            className="inline-flex items-center gap-2 text-accent text-sm uppercase tracking-wider mb-8 hover:text-accent-secondary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            {t('common.backTo')} {t('sections.representativeMatters')}
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            {content.title}
          </h1>
          <div className="flex justify-center mt-6">
            <GoldDivider width="w-24 mx-auto" />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Challenge */}
              <div>
                <h2 className="text-sm uppercase tracking-[0.2em] text-accent font-medium mb-4">
                  {isVi ? 'Thách thức' : 'The Challenge'}
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed">
                  {content.challenge}
                </p>
              </div>

              <GoldDivider width="w-16" />

              {/* Approach */}
              <div>
                <h2 className="text-sm uppercase tracking-[0.2em] text-accent font-medium mb-4">
                  {isVi ? 'Cách tiếp cận' : 'Our Approach'}
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed">
                  {content.approach}
                </p>
              </div>

              <GoldDivider width="w-16" />

              {/* Outcome */}
              <div>
                <h2 className="text-sm uppercase tracking-[0.2em] text-accent font-medium mb-4">
                  {isVi ? 'Kết quả' : 'The Outcome'}
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed">
                  {content.outcome}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-surface border border-border-gold/20 p-8 sticky top-28">
                <h3 className="text-sm uppercase tracking-[0.2em] text-accent font-medium mb-6">
                  {isVi ? 'Chi tiết vụ việc' : 'Case Details'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-text-secondary uppercase tracking-wider">{isVi ? 'Năm' : 'Year'}</span>
                    <p className="text-primary font-medium mt-1">{content.year}</p>
                  </div>
                  <div className="border-t border-border-gold/20 pt-4">
                    <span className="text-xs text-text-secondary uppercase tracking-wider">{isVi ? 'Lĩnh vực' : 'Practice Area'}</span>
                    <p className="text-primary font-medium mt-1">{content.area}</p>
                  </div>
                  <div className="border-t border-border-gold/20 pt-4">
                    <span className="text-xs text-text-secondary uppercase tracking-wider">{isVi ? 'Khách hàng' : 'Client'}</span>
                    <p className="text-primary font-medium mt-1">{content.client}</p>
                  </div>
                  <div className="border-t border-border-gold/20 pt-4">
                    <Link
                      href={{ pathname: '/linh-vuc-hanh-nghe/[slug]', params: { slug: content.areaSlug } }}
                      className="text-accent text-sm font-medium hover:text-accent-secondary transition-colors inline-flex items-center gap-1"
                    >
                      {isVi ? 'Xem lĩnh vực hành nghề' : 'View Practice Area'}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Matters with Thumbnails */}
      {relatedMatters.length > 0 && (
        <section className="py-20 md:py-28 bg-surface">
          <div className="max-w-5xl mx-auto px-6">
            <SectionHeading
              subtitle={isVi ? 'Liên quan' : 'Related'}
              title={isVi ? 'Vụ việc tương tự' : 'Related Matters'}
            />
            <div className="mt-12 space-y-6">
              {relatedMatters.map((matter) => {
                if (!matter) return null;
                const relImage = getAreaImage(matter.areaSlug);
                return (
                  <Link
                    key={matter.slug}
                    href={{ pathname: '/vu-viec-tieu-bieu/[slug]', params: { slug: matter.slug } }}
                    className="group flex flex-col sm:flex-row gap-0 bg-background border border-border-gold/20 hover:border-accent/50 transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative w-full sm:w-48 h-40 sm:h-auto shrink-0 overflow-hidden">
                      <Image
                        src={relImage.src}
                        alt={relImage.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 192px"
                      />
                    </div>
                    <div className="p-6 sm:p-8">
                      <span className="text-accent text-sm font-medium">{matter.year}</span>
                      <h3 className="text-lg font-heading font-semibold text-primary mt-1 group-hover:text-accent transition-colors">
                        {matter.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 md:py-28 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
            {isVi ? 'Bạn có vấn đề tương tự?' : 'Have a Similar Matter?'}
          </h2>
          <p className="text-white/70 text-lg mb-8">
            {isVi
              ? 'Liên hệ với Luật sư Võ Thiện Hiển để được tư vấn chuyên nghiệp.'
              : 'Contact Attorney Vo Thien Hien for professional counsel.'}
          </p>
          <Link href="/lien-he">
            <Button variant="primary" size="lg">
              {t('common.scheduleConsultation')}
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
