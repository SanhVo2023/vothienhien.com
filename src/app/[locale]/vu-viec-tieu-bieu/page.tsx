import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import { Link } from '@/i18n/navigation';
import { IMAGES } from '@/lib/images';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isVi = locale === 'vi';

  return {
    title: isVi
      ? 'Vụ Việc Tiêu Biểu | Luật sư Võ Thiện Hiển'
      : 'Representative Experience | Attorney Vo Thien Hien',
    description: isVi
      ? 'Các vụ việc tiêu biểu đã được Luật sư Võ Thiện Hiển xử lý thành công trong các lĩnh vực dân sự, đất đai, doanh nghiệp và hình sự.'
      : 'Notable matters successfully handled by Attorney Vo Thien Hien across civil, land, corporate, and criminal law.',
    alternates: {
      canonical: isVi ? '/vi/vu-viec-tieu-bieu' : '/en/representative-experience',
      languages: {
        vi: '/vi/vu-viec-tieu-bieu',
        en: '/en/representative-experience',
      },
    },
    openGraph: {
      images: [{ url: IMAGES.bgMarble.cdn, width: 1920, height: 1080 }],
    },
  };
}

// Map practice areas to thumbnail images
const areaImageMap: Record<string, { src: string; alt: string }> = {
  'Đất đai': { src: IMAGES.practiceLand.cdn, alt: IMAGES.practiceLand.alt },
  'Land': { src: IMAGES.practiceLand.cdn, alt: IMAGES.practiceLand.alt },
  'Doanh nghiệp': { src: IMAGES.practiceCorporate.cdn, alt: IMAGES.practiceCorporate.alt },
  'Corporate': { src: IMAGES.practiceCorporate.cdn, alt: IMAGES.practiceCorporate.alt },
  'Hình sự': { src: IMAGES.practiceCriminal.cdn, alt: IMAGES.practiceCriminal.alt },
  'Criminal': { src: IMAGES.practiceCriminal.cdn, alt: IMAGES.practiceCriminal.alt },
  'Lao động': { src: IMAGES.practiceLabor.cdn, alt: IMAGES.practiceLabor.alt },
  'Labor': { src: IMAGES.practiceLabor.cdn, alt: IMAGES.practiceLabor.alt },
  'Gia đình': { src: IMAGES.practiceFamily.cdn, alt: IMAGES.practiceFamily.alt },
  'Family': { src: IMAGES.practiceFamily.cdn, alt: IMAGES.practiceFamily.alt },
};

function getAreaImage(area: string) {
  return areaImageMap[area] || { src: IMAGES.practiceCivil.cdn, alt: IMAGES.practiceCivil.alt };
}

const matters = {
  vi: [
    {
      slug: 'tranh-chap-bat-dong-san-50-ty',
      year: '2023',
      title: 'Tranh chấp bất động sản thương mại trị giá 50 tỷ đồng',
      area: 'Đất đai',
      excerpt: 'Đại diện thành công cho khách hàng trong vụ tranh chấp mua bán bất động sản thương mại phức tạp, liên quan đến nhiều bên và nhiều cấp xử lý.',
    },
    {
      slug: 'tu-van-ma-tap-doan-200-ty',
      year: '2023',
      title: 'Tư vấn M&A cho giao dịch 200 tỷ đồng',
      area: 'Doanh nghiệp',
      excerpt: 'Tư vấn pháp lý toàn diện cho giao dịch mua bán và sáp nhập doanh nghiệp bất động sản, bao gồm thẩm định pháp lý, soạn thảo hợp đồng và hỗ trợ đăng ký.',
    },
    {
      slug: 'bao-chua-vu-an-kinh-te',
      year: '2023',
      title: 'Bào chữa trong vụ án kinh tế phức tạp',
      area: 'Hình sự',
      excerpt: 'Thành công bào chữa cho thân chủ trong vụ án hình sự liên quan đến hoạt động kinh doanh, đạt được mức hình phạt giảm đáng kể so với đề nghị của viện kiểm sát.',
    },
    {
      slug: 'giai-quyet-tranh-chap-lao-dong-tap-the',
      year: '2022',
      title: 'Giải quyết tranh chấp lao động tập thể 200 công nhân',
      area: 'Lao động',
      excerpt: 'Tư vấn và hỗ trợ giải quyết thành công vụ đình công của 200 công nhân, đảm bảo quyền lợi cho cả người lao động và doanh nghiệp.',
    },
    {
      slug: 'ly-hon-phan-chia-tai-san-30-ty',
      year: '2022',
      title: 'Ly hôn và phân chia tài sản chung 30 tỷ đồng',
      area: 'Gia đình',
      excerpt: 'Đại diện khách hàng trong vụ ly hôn phức tạp với tài sản chung lớn, thành công bảo vệ quyền lợi tài sản và quyền nuôi con.',
    },
    {
      slug: 'khieu-nai-boi-thuong-giai-phong-mat-bang',
      year: '2021',
      title: 'Khiếu nại bồi thường giải phóng mặt bằng dự án',
      area: 'Đất đai',
      excerpt: 'Đại diện cư dân khiếu nại thành công quyết định bồi thường giải phóng mặt bằng, tăng mức bồi thường lên 200% so với phương án ban đầu.',
    },
  ],
  en: [
    {
      slug: 'commercial-real-estate-dispute-50b',
      year: '2023',
      title: 'Commercial real estate dispute valued at VND 50 billion',
      area: 'Land',
      excerpt: 'Successfully represented client in a complex commercial real estate dispute involving multiple parties and jurisdictional levels.',
    },
    {
      slug: 'ma-advisory-200b-transaction',
      year: '2023',
      title: 'M&A advisory for VND 200 billion transaction',
      area: 'Corporate',
      excerpt: 'Comprehensive legal advisory for a real estate sector M&A transaction, including due diligence, contract drafting, and registration support.',
    },
    {
      slug: 'criminal-defense-economic-case',
      year: '2023',
      title: 'Defense in complex economic criminal case',
      area: 'Criminal',
      excerpt: 'Successfully defended client in a business-related criminal case, achieving significant sentence reduction compared to prosecution\'s recommendation.',
    },
    {
      slug: 'collective-labor-dispute-200-workers',
      year: '2022',
      title: 'Collective labor dispute resolution for 200 workers',
      area: 'Labor',
      excerpt: 'Advised and successfully resolved a 200-worker strike, ensuring rights protection for both employees and the enterprise.',
    },
    {
      slug: 'divorce-property-division-30b',
      year: '2022',
      title: 'Divorce and VND 30 billion marital property division',
      area: 'Family',
      excerpt: 'Represented client in complex divorce proceedings with substantial marital assets, successfully protecting property rights and child custody.',
    },
    {
      slug: 'land-clearance-compensation-complaint',
      year: '2021',
      title: 'Project land clearance compensation complaint',
      area: 'Land',
      excerpt: 'Successfully represented residents in complaint against land clearance compensation decision, increasing compensation by 200% from initial proposal.',
    },
  ],
};

export default async function RepresentativeMattersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const isVi = locale === 'vi';
  const mattersList = matters[isVi ? 'vi' : 'en'];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isVi ? 'Trang chủ' : 'Home', item: `https://vothienhien.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: isVi ? 'Vụ việc tiêu biểu' : 'Representative Experience', item: `https://vothienhien.com/${locale}/${isVi ? 'vu-viec-tieu-bieu' : 'representative-experience'}` },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero with Marble Background */}
      <section className="relative bg-primary text-white py-28 md:py-40 overflow-hidden">
        <Image
          src={IMAGES.bgMarble.cdn}
          alt={IMAGES.bgMarble.alt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/60 to-primary/80" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="text-sm uppercase tracking-[0.3em] text-accent font-medium">
            {isVi ? 'Thành tựu' : 'Track Record'}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mt-6 mb-4">
            {t('sections.representativeMatters')}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {isVi
              ? 'Một số vụ việc tiêu biểu đã được Luật sư Võ Thiện Hiển xử lý thành công.'
              : 'A selection of notable matters successfully handled by Attorney Vo Thien Hien.'}
          </p>
          <div className="flex justify-center mt-6">
            <GoldDivider width="w-24 mx-auto" />
          </div>
        </div>
      </section>

      {/* Matters Grid */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-6">
            {mattersList.map((matter) => {
              const areaImg = getAreaImage(matter.area);
              return (
                <Link
                  key={matter.slug}
                  href={{ pathname: '/vu-viec-tieu-bieu/[slug]', params: { slug: matter.slug } }}
                  className="group block"
                >
                  <article className="bg-surface border border-border-gold/20 hover:border-accent/50 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

                    <div className="flex flex-col md:flex-row">
                      {/* Thumbnail */}
                      <div className="relative w-full md:w-56 h-48 md:h-auto shrink-0 overflow-hidden">
                        <Image
                          src={areaImg.src}
                          alt={areaImg.alt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 224px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/20 hidden md:block" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-8 md:p-10 flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                        <div className="shrink-0">
                          <span className="text-3xl font-heading font-bold text-accent/30 group-hover:text-accent transition-colors duration-300">
                            {matter.year}
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="inline-block text-xs uppercase tracking-wider text-accent font-medium bg-accent/10 px-3 py-1 mb-3">
                            {matter.area}
                          </span>
                          <h3 className="text-xl font-heading font-semibold text-primary group-hover:text-accent transition-colors duration-300">
                            {matter.title}
                          </h3>
                          <p className="text-text-secondary mt-3 leading-relaxed">
                            {matter.excerpt}
                          </p>
                        </div>
                        <div className="shrink-0 self-center">
                          <svg className="w-5 h-5 text-accent/40 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
