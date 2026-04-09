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
      ? 'Bài Viết Chuyên Môn | Luật sư Võ Thiện Hiển'
      : 'Legal Insights | Attorney Vo Thien Hien',
    description: isVi
      ? 'Các bài viết phân tích pháp luật, hướng dẫn pháp lý và bình luận chuyên môn của Luật sư Võ Thiện Hiển.'
      : 'Legal analysis articles, legal guides, and professional commentary by Attorney Vo Thien Hien.',
    alternates: {
      canonical: isVi ? '/vi/bai-viet-chuyen-mon' : '/en/legal-insights',
      languages: {
        vi: '/vi/bai-viet-chuyen-mon',
        en: '/en/legal-insights',
      },
    },
    openGraph: {
      images: [{ url: IMAGES.bgLibrary.cdn, width: 1920, height: 1080 }],
    },
  };
}

const categories = {
  vi: ['Phân tích', 'Hướng dẫn', 'Bình luận'],
  en: ['Analysis', 'Guide', 'Commentary'],
};

// Thumbnail images mapped by article index
const articleThumbnails = [
  { src: IMAGES.articleLandDispute.cdn, alt: IMAGES.articleLandDispute.alt },
  { src: IMAGES.articleCorporateLaw.cdn, alt: IMAGES.articleCorporateLaw.alt },
  { src: IMAGES.articleLaborRights.cdn, alt: IMAGES.articleLaborRights.alt },
  { src: IMAGES.articleLandDispute.cdn, alt: IMAGES.articleLandDispute.alt },
  { src: IMAGES.articleDivorceInternational.cdn, alt: IMAGES.articleDivorceInternational.alt },
  { src: IMAGES.articleCorporateLaw.cdn, alt: IMAGES.articleCorporateLaw.alt },
];

function getArticleThumbnail(index: number) {
  return articleThumbnails[index % articleThumbnails.length];
}

const publications = {
  vi: [
    {
      slug: 'phan-tich-luat-dat-dai-2024',
      title: 'Phân tích những điểm mới của Luật Đất đai 2024',
      category: 'Phân tích',
      date: '15/03/2024',
      excerpt: 'Luật Đất đai 2024 có nhiều thay đổi quan trọng ảnh hưởng trực tiếp đến quyền sử dụng đất của người dân và doanh nghiệp. Bài viết phân tích các điểm mới nổi bật và tác động thực tiễn.',
      readTime: '8 phút đọc',
    },
    {
      slug: 'huong-dan-thanh-lap-doanh-nghiep',
      title: 'Hướng dẫn thủ tục thành lập doanh nghiệp tại Việt Nam 2024',
      category: 'Hướng dẫn',
      date: '28/02/2024',
      excerpt: 'Hướng dẫn chi tiết các bước thành lập doanh nghiệp tại Việt Nam, bao gồm lựa chọn loại hình, hồ sơ cần thiết và các lưu ý pháp lý quan trọng.',
      readTime: '10 phút đọc',
    },
    {
      slug: 'quyen-loi-nguoi-lao-dong-nghi-viec',
      title: 'Quyền lợi của người lao động khi bị đơn phương chấm dứt hợp đồng',
      category: 'Phân tích',
      date: '10/01/2024',
      excerpt: 'Phân tích quyền lợi mà người lao động được hưởng khi bị người sử dụng lao động đơn phương chấm dứt hợp đồng lao động trái pháp luật.',
      readTime: '7 phút đọc',
    },
    {
      slug: 'binh-luan-an-le-tranh-chap-dat',
      title: 'Bình luận án lệ về tranh chấp quyền sử dụng đất',
      category: 'Bình luận',
      date: '20/12/2023',
      excerpt: 'Bình luận chuyên sâu về án lệ mới được công bố liên quan đến tranh chấp quyền sử dụng đất giữa các hộ gia đình tại khu vực nông thôn.',
      readTime: '9 phút đọc',
    },
    {
      slug: 'huong-dan-ly-hon-thuan-tinh',
      title: 'Hướng dẫn thủ tục ly hôn thuận tình tại Việt Nam',
      category: 'Hướng dẫn',
      date: '05/11/2023',
      excerpt: 'Hướng dẫn đầy đủ về thủ tục ly hôn thuận tình, từ chuẩn bị hồ sơ, nộp đơn, hòa giải đến phiên tòa xét xử.',
      readTime: '6 phút đọc',
    },
    {
      slug: 'binh-luan-sua-doi-luat-doanh-nghiep',
      title: 'Bình luận về dự thảo sửa đổi Luật Doanh nghiệp',
      category: 'Bình luận',
      date: '18/10/2023',
      excerpt: 'Nhận xét và góp ý chuyên môn về các nội dung sửa đổi trong dự thảo Luật Doanh nghiệp (sửa đổi), tập trung vào các quy định về quản trị công ty.',
      readTime: '8 phút đọc',
    },
  ],
  en: [
    {
      slug: 'analysis-land-law-2024',
      title: 'Analysis of Key Changes in Vietnam Land Law 2024',
      category: 'Analysis',
      date: '03/15/2024',
      excerpt: 'The 2024 Land Law introduces significant changes directly affecting land use rights of citizens and businesses. This article analyzes notable amendments and their practical impact.',
      readTime: '8 min read',
    },
    {
      slug: 'guide-business-formation-vietnam',
      title: 'Guide to Business Formation in Vietnam 2024',
      category: 'Guide',
      date: '02/28/2024',
      excerpt: 'Detailed guide on steps for business formation in Vietnam, including entity type selection, required documents, and important legal considerations.',
      readTime: '10 min read',
    },
    {
      slug: 'employee-rights-termination',
      title: 'Employee Rights Upon Unlawful Contract Termination',
      category: 'Analysis',
      date: '01/10/2024',
      excerpt: 'Analysis of employee entitlements when employers unlawfully unilaterally terminate employment contracts under Vietnamese labor law.',
      readTime: '7 min read',
    },
    {
      slug: 'commentary-land-dispute-precedent',
      title: 'Commentary on Land Use Rights Dispute Precedent',
      category: 'Commentary',
      date: '12/20/2023',
      excerpt: 'In-depth commentary on a newly published precedent regarding land use rights disputes between households in rural areas.',
      readTime: '9 min read',
    },
    {
      slug: 'guide-consensual-divorce-vietnam',
      title: 'Guide to Consensual Divorce Procedures in Vietnam',
      category: 'Guide',
      date: '11/05/2023',
      excerpt: 'Comprehensive guide on consensual divorce procedures, from document preparation, filing, mediation to court hearing.',
      readTime: '6 min read',
    },
    {
      slug: 'commentary-enterprise-law-amendments',
      title: 'Commentary on Draft Enterprise Law Amendments',
      category: 'Commentary',
      date: '10/18/2023',
      excerpt: 'Professional observations and recommendations on amendment content in the Draft Enterprise Law (amended), focusing on corporate governance provisions.',
      readTime: '8 min read',
    },
  ],
};

export default async function PublicationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const isVi = locale === 'vi';
  const articleList = publications[isVi ? 'vi' : 'en'];
  const categoryList = categories[isVi ? 'vi' : 'en'];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isVi ? 'Trang chủ' : 'Home', item: `https://vothienhien.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: isVi ? 'Bài viết chuyên môn' : 'Legal Insights', item: `https://vothienhien.com/${locale}/${isVi ? 'bai-viet-chuyen-mon' : 'legal-insights'}` },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero with Library Background */}
      <section className="relative bg-primary text-white py-28 md:py-40 overflow-hidden">
        <Image
          src={IMAGES.bgLibrary.cdn}
          alt={IMAGES.bgLibrary.alt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="text-sm uppercase tracking-[0.3em] text-accent font-medium">
            {isVi ? 'Kiến thức pháp lý' : 'Legal Knowledge'}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mt-6 mb-4">
            {t('nav.publications')}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {isVi
              ? 'Các bài viết phân tích, hướng dẫn và bình luận pháp luật của Luật sư Võ Thiện Hiển.'
              : 'Legal analysis, guides, and professional commentary by Attorney Vo Thien Hien.'}
          </p>
          <div className="flex justify-center mt-6">
            <GoldDivider width="w-24 mx-auto" />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-background border-b border-border-gold/20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-8 overflow-x-auto py-4">
            <button className="text-sm uppercase tracking-wider font-medium text-accent border-b-2 border-accent pb-2 whitespace-nowrap">
              {isVi ? 'Tất cả' : 'All'}
            </button>
            {categoryList.map((cat) => (
              <button
                key={cat}
                className="text-sm uppercase tracking-wider font-medium text-text-secondary hover:text-accent pb-2 border-b-2 border-transparent hover:border-accent/30 transition-colors whitespace-nowrap"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {articleList.map((article, index) => {
              const thumb = getArticleThumbnail(index);
              return (
                <Link
                  key={article.slug}
                  href={{ pathname: '/bai-viet-chuyen-mon/[slug]', params: { slug: article.slug } }}
                  className="group block"
                >
                  <article className="bg-surface border border-border-gold/20 hover:border-accent/50 transition-all duration-500 overflow-hidden h-full">
                    {/* Thumbnail Image */}
                    <div className="relative w-full h-52 overflow-hidden">
                      <Image
                        src={thumb.src}
                        alt={thumb.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                    </div>

                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs uppercase tracking-wider text-accent font-medium bg-accent/10 px-3 py-1">
                          {article.category}
                        </span>
                        <span className="text-xs text-text-secondary">{article.date}</span>
                        <span className="text-xs text-text-secondary/60 ml-auto">{article.readTime}</span>
                      </div>

                      <h3 className="text-lg font-heading font-semibold text-primary mb-3 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>

                      <span className="inline-flex items-center gap-2 text-accent text-sm font-medium mt-4 uppercase tracking-wider">
                        {t('common.readMore')}
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>

          {/* Pagination placeholder */}
          <div className="mt-16 flex justify-center gap-2">
            <span className="w-10 h-10 flex items-center justify-center bg-accent text-primary text-sm font-medium">1</span>
            <span className="w-10 h-10 flex items-center justify-center border border-border-gold/30 text-text-secondary text-sm hover:border-accent transition-colors cursor-pointer">2</span>
            <span className="w-10 h-10 flex items-center justify-center border border-border-gold/30 text-text-secondary text-sm hover:border-accent transition-colors cursor-pointer">3</span>
          </div>
        </div>
      </section>
    </>
  );
}
