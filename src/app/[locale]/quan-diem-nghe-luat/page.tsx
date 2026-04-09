import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
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
      ? 'Quan Điểm Nghề Luật | Luật sư Võ Thiện Hiển'
      : 'Professional Perspective | Attorney Vo Thien Hien',
    description: isVi
      ? 'Những suy ngẫm và quan điểm của Luật sư Võ Thiện Hiển về nghề luật sư, đạo đức nghề nghiệp và hệ thống pháp luật Việt Nam.'
      : 'Reflections and perspectives from Attorney Vo Thien Hien on the legal profession, ethics, and Vietnam\'s legal system.',
    alternates: {
      canonical: isVi ? '/vi/quan-diem-nghe-luat' : '/en/professional-perspective',
      languages: {
        vi: '/vi/quan-diem-nghe-luat',
        en: '/en/professional-perspective',
      },
    },
    openGraph: {
      images: [{ url: IMAGES.bgSpeaking.cdn, width: 1200, height: 630 }],
    },
  };
}

// Alternate thumbnails for perspective cards
const perspectiveThumbnails = [
  { src: IMAGES.detailHands.cdn, alt: IMAGES.detailHands.alt },
  { src: IMAGES.profileHero.cdn, alt: IMAGES.profileHero.alt },
  { src: IMAGES.bgSpeaking.cdn, alt: IMAGES.bgSpeaking.alt },
  { src: IMAGES.detailHands.cdn, alt: IMAGES.detailHands.alt },
];

const perspectives = {
  vi: [
    {
      slug: 'dao-duc-nghe-luat-su',
      title: 'Đạo đức nghề nghiệp - nền tảng của nghề luật sư',
      excerpt: 'Trong hành trình hơn 15 năm hành nghề, tôi nhận ra rằng đạo đức nghề nghiệp không chỉ là nghĩa vụ mà còn là nền tảng tạo nên giá trị bền vững cho người luật sư. Một luật sư giỏi không chỉ cần giỏi về chuyên môn mà còn phải có lòng trung thực và sự liêm chính.',
      date: '20/02/2024',
    },
    {
      slug: 'luat-su-va-cong-ly-xa-hoi',
      title: 'Vai trò của luật sư trong bảo vệ công lý xã hội',
      excerpt: 'Luật sư không chỉ là người đại diện pháp lý mà còn là người bảo vệ công lý. Trong nhiều vụ việc, tôi đã chứng kiến sức mạnh của pháp luật khi được sử dụng đúng cách có thể thay đổi cuộc sống của con người và góp phần xây dựng một xã hội công bằng hơn.',
      date: '15/01/2024',
    },
    {
      slug: 'tuong-lai-nghe-luat-viet-nam',
      title: 'Tương lai nghề luật tại Việt Nam - Cơ hội và thách thức',
      excerpt: 'Nghề luật sư tại Việt Nam đang trải qua giai đoạn chuyển đổi quan trọng. Công nghệ, hội nhập quốc tế và nhu cầu ngày càng cao của khách hàng đang định hình lại cách chúng ta hành nghề. Luật sư cần thích ứng và không ngừng học hỏi.',
      date: '10/12/2023',
    },
    {
      slug: 'xay-dung-long-tin-khach-hang',
      title: 'Xây dựng lòng tin khách hàng - Chìa khóa thành công',
      excerpt: 'Lòng tin là tài sản quý giá nhất của một luật sư. Nó không đến từ quảng cáo hay danh hiệu, mà từ sự tận tâm, chuyên nghiệp và kết quả thực tế mà bạn mang lại cho khách hàng qua từng vụ việc.',
      date: '25/10/2023',
    },
  ],
  en: [
    {
      slug: 'legal-ethics-foundation',
      title: 'Professional ethics - the foundation of legal practice',
      excerpt: 'In my 15+ year journey in legal practice, I\'ve realized that professional ethics is not merely an obligation but the foundation that creates lasting value for a lawyer. A great lawyer needs not only professional expertise but also integrity and honesty.',
      date: '02/20/2024',
    },
    {
      slug: 'lawyers-social-justice',
      title: 'The role of lawyers in protecting social justice',
      excerpt: 'Lawyers are not just legal representatives but also guardians of justice. In many cases, I\'ve witnessed the power of law when properly applied - it can change people\'s lives and contribute to building a more equitable society.',
      date: '01/15/2024',
    },
    {
      slug: 'future-legal-profession-vietnam',
      title: 'The future of legal practice in Vietnam - Opportunities and challenges',
      excerpt: 'The legal profession in Vietnam is undergoing a significant transformation. Technology, international integration, and increasingly sophisticated client demands are reshaping how we practice. Lawyers must adapt and continuously learn.',
      date: '12/10/2023',
    },
    {
      slug: 'building-client-trust',
      title: 'Building client trust - The key to success',
      excerpt: 'Trust is a lawyer\'s most valuable asset. It doesn\'t come from advertising or titles, but from the dedication, professionalism, and tangible results you deliver to clients through each matter.',
      date: '10/25/2023',
    },
  ],
};

export default async function PerspectivesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const isVi = locale === 'vi';
  const perspectiveList = perspectives[isVi ? 'vi' : 'en'];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isVi ? 'Trang chủ' : 'Home', item: `https://vothienhien.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: isVi ? 'Quan điểm nghề luật' : 'Professional Perspective', item: `https://vothienhien.com/${locale}/${isVi ? 'quan-diem-nghe-luat' : 'professional-perspective'}` },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero with Speaking Background */}
      <section className="relative bg-primary text-white py-28 md:py-40 overflow-hidden">
        <Image
          src={IMAGES.bgSpeaking.cdn}
          alt={IMAGES.bgSpeaking.alt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="text-sm uppercase tracking-[0.3em] text-accent font-medium">
            {isVi ? 'Suy ngẫm' : 'Reflections'}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mt-6 mb-4">
            {t('nav.perspectives')}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {isVi
              ? 'Những suy ngẫm cá nhân về nghề luật sư, trách nhiệm xã hội và hành trình pháp lý.'
              : 'Personal reflections on the legal profession, social responsibility, and the legal journey.'}
          </p>
          <div className="flex justify-center mt-6">
            <GoldDivider width="w-24 mx-auto" />
          </div>
        </div>
      </section>

      {/* Perspectives List */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-12">
            {perspectiveList.map((perspective, index) => {
              const thumb = perspectiveThumbnails[index % perspectiveThumbnails.length];
              return (
                <Link
                  key={perspective.slug}
                  href={{ pathname: '/quan-diem-nghe-luat/[slug]', params: { slug: perspective.slug } }}
                  className="group block"
                >
                  <article className="relative">
                    {index > 0 && (
                      <div className="absolute -top-6 left-0 right-0">
                        <GoldDivider width="w-full" />
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-6 py-2">
                      {/* Thumbnail */}
                      <div className="relative w-full md:w-56 h-48 md:h-40 shrink-0 overflow-hidden">
                        <Image
                          src={thumb.src}
                          alt={thumb.alt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 224px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-accent text-xs font-bold">{String(index + 1).padStart(2, '0')}</span>
                          </div>
                          <span className="text-text-secondary text-sm">{perspective.date}</span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary group-hover:text-accent transition-colors duration-300 mb-4">
                          {perspective.title}
                        </h2>

                        <p className="text-text-secondary text-lg leading-relaxed italic line-clamp-3">
                          &ldquo;{perspective.excerpt}&rdquo;
                        </p>

                        <span className="inline-flex items-center gap-2 text-accent text-sm font-medium mt-6 uppercase tracking-wider">
                          {t('common.readMore')}
                          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
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
