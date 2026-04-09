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
      ? 'Lĩnh Vực Hành Nghề | Luật sư Võ Thiện Hiển'
      : 'Practice Areas | Attorney Vo Thien Hien',
    description: isVi
      ? 'Các lĩnh vực hành nghề chính của Luật sư Võ Thiện Hiển: tranh chấp dân sự, đất đai, hôn nhân gia đình, doanh nghiệp, lao động và hình sự.'
      : 'Key practice areas of Attorney Vo Thien Hien: civil disputes, land disputes, family law, corporate law, labor disputes, and criminal defense.',
    alternates: {
      canonical: isVi ? '/vi/linh-vuc-hanh-nghe' : '/en/practice-areas',
      languages: {
        vi: '/vi/linh-vuc-hanh-nghe',
        en: '/en/practice-areas',
      },
    },
    openGraph: {
      images: [{ url: IMAGES.ogPractice.cdn, width: 1200, height: 630 }],
    },
  };
}

// Map practice area slugs to images
const practiceAreaImages: Record<string, { src: string; alt: string }> = {
  'tranh-chap-dan-su': { src: IMAGES.practiceCivil.cdn, alt: IMAGES.practiceCivil.alt },
  'civil-disputes': { src: IMAGES.practiceCivil.cdn, alt: IMAGES.practiceCivil.alt },
  'tranh-chap-dat-dai': { src: IMAGES.practiceLand.cdn, alt: IMAGES.practiceLand.alt },
  'land-disputes': { src: IMAGES.practiceLand.cdn, alt: IMAGES.practiceLand.alt },
  'hon-nhan-gia-dinh': { src: IMAGES.practiceFamily.cdn, alt: IMAGES.practiceFamily.alt },
  'family-law': { src: IMAGES.practiceFamily.cdn, alt: IMAGES.practiceFamily.alt },
  'luat-doanh-nghiep': { src: IMAGES.practiceCorporate.cdn, alt: IMAGES.practiceCorporate.alt },
  'corporate-law': { src: IMAGES.practiceCorporate.cdn, alt: IMAGES.practiceCorporate.alt },
  'tranh-chap-lao-dong': { src: IMAGES.practiceLabor.cdn, alt: IMAGES.practiceLabor.alt },
  'labor-disputes': { src: IMAGES.practiceLabor.cdn, alt: IMAGES.practiceLabor.alt },
  'luat-hinh-su': { src: IMAGES.practiceCriminal.cdn, alt: IMAGES.practiceCriminal.alt },
  'criminal-defense': { src: IMAGES.practiceCriminal.cdn, alt: IMAGES.practiceCriminal.alt },
};

const practiceAreas = {
  vi: [
    {
      slug: 'tranh-chap-dan-su',
      title: 'Tranh Chấp Dân Sự',
      description: 'Tư vấn và đại diện trong các vụ tranh chấp dân sự, bao gồm hợp đồng, bồi thường thiệt hại, quyền sở hữu tài sản và các quan hệ dân sự khác.',
    },
    {
      slug: 'tranh-chap-dat-dai',
      title: 'Tranh Chấp Đất Đai',
      description: 'Giải quyết tranh chấp quyền sử dụng đất, chuyển nhượng bất động sản, thu hồi đất và các vấn đề liên quan đến địa chính.',
    },
    {
      slug: 'hon-nhan-gia-dinh',
      title: 'Hôn Nhân & Gia Đình',
      description: 'Hỗ trợ pháp lý trong ly hôn, phân chia tài sản, quyền nuôi con, cấp dưỡng và các vấn đề hôn nhân gia đình khác.',
    },
    {
      slug: 'luat-doanh-nghiep',
      title: 'Luật Doanh Nghiệp',
      description: 'Tư vấn thành lập doanh nghiệp, cơ cấu tổ chức, M&A, quản trị công ty và tuân thủ pháp luật doanh nghiệp.',
    },
    {
      slug: 'tranh-chap-lao-dong',
      title: 'Tranh Chấp Lao Động',
      description: 'Đại diện và tư vấn trong các tranh chấp lao động, hợp đồng lao động, sa thải và quyền lợi người lao động.',
    },
    {
      slug: 'luat-hinh-su',
      title: 'Luật Hình Sự',
      description: 'Bào chữa và đại diện trong các vụ án hình sự, bảo vệ quyền và lợi ích hợp pháp của thân chủ trước cơ quan tố tụng.',
    },
  ],
  en: [
    {
      slug: 'civil-disputes',
      title: 'Civil Disputes',
      description: 'Advisory and representation in civil disputes, including contracts, damages, property rights, and other civil relationships.',
    },
    {
      slug: 'land-disputes',
      title: 'Land & Real Estate Disputes',
      description: 'Resolving disputes over land use rights, real estate transfers, land acquisition, and related cadastral matters.',
    },
    {
      slug: 'family-law',
      title: 'Marriage & Family Law',
      description: 'Legal support in divorce proceedings, property division, child custody, alimony, and other family law matters.',
    },
    {
      slug: 'corporate-law',
      title: 'Corporate Law',
      description: 'Business formation advisory, organizational structuring, M&A, corporate governance, and regulatory compliance.',
    },
    {
      slug: 'labor-disputes',
      title: 'Labor Disputes',
      description: 'Representation and counsel in labor disputes, employment contracts, termination, and employee rights protection.',
    },
    {
      slug: 'criminal-defense',
      title: 'Criminal Defense',
      description: 'Defense and representation in criminal cases, protecting the legitimate rights and interests of clients before judicial authorities.',
    },
  ],
};

export default async function PracticeAreasPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const isVi = locale === 'vi';
  const areas = practiceAreas[isVi ? 'vi' : 'en'];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isVi ? 'Trang chủ' : 'Home', item: `https://vothienhien.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: isVi ? 'Lĩnh vực hành nghề' : 'Practice Areas', item: `https://vothienhien.com/${locale}/${isVi ? 'linh-vuc-hanh-nghe' : 'practice-areas'}` },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero Section with Background Image */}
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
            {isVi ? 'Chuyên môn' : 'Expertise'}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mt-6 mb-4">
            {t('sections.practiceAreas')}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {isVi
              ? 'Luật sư Võ Thiện Hiển cung cấp dịch vụ pháp lý toàn diện trên nhiều lĩnh vực, đảm bảo quyền lợi tối đa cho khách hàng.'
              : 'Attorney Vo Thien Hien provides comprehensive legal services across multiple practice areas, ensuring maximum protection of client interests.'}
          </p>
          <div className="flex justify-center mt-6">
            <GoldDivider width="w-24 mx-auto" />
          </div>
        </div>
      </section>

      {/* Practice Areas Grid */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => {
              const areaImage = practiceAreaImages[area.slug] || { src: IMAGES.practiceCivil.cdn, alt: IMAGES.practiceCivil.alt };
              return (
                <Link
                  key={area.slug}
                  href={{ pathname: '/linh-vuc-hanh-nghe/[slug]', params: { slug: area.slug } }}
                  className="group block"
                >
                  <div className="bg-surface border border-border-gold/20 h-full hover:border-accent/60 hover:shadow-lg transition-all duration-500 relative overflow-hidden">
                    {/* Decorative top bar */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                    {/* Practice area image */}
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={areaImage.src}
                        alt={areaImage.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                    </div>

                    <div className="p-8">
                      <h3 className="text-xl font-heading font-semibold text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                        {area.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed mb-4">
                        {area.description}
                      </p>
                      <span className="text-accent text-sm font-medium uppercase tracking-wider inline-flex items-center gap-2">
                        {t('common.readMore')}
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
