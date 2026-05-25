import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import Button from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
import { IMAGES } from '@/lib/images';
import { SHORT_NAME_VN, SHORT_NAME_EN, parentBrandUrl } from '@/lib/address';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isVi = locale === 'vi';

  return {
    title: isVi
      ? 'Giới Thiệu Luật Sư Võ Thiện Hiển | Apolo Lawyers'
      : 'Attorney Profile - Vo Thien Hien | Apolo Lawyers',
    description: isVi
      ? 'Tìm hiểu về Luật sư Võ Thiện Hiển - Luật sư Điều hành tại Công ty Luật Apolo Lawyers. Hơn 20 năm kinh nghiệm trong tố tụng, trọng tài, giải quyết tranh chấp và tư vấn pháp lý tại Việt Nam.'
      : 'Learn about Attorney Vo Thien Hien (Henry Vo) — Managing Partner at Apolo Lawyers. More than 20 years of legal practice in litigation, arbitration, dispute resolution and legal advisory in Vietnam.',
    alternates: {
      canonical: isVi ? '/vi/gioi-thieu-luat-su' : '/en/lawyer-profile',
      languages: {
        vi: '/vi/gioi-thieu-luat-su',
        en: '/en/lawyer-profile',
      },
    },
  };
}

const timelineData = {
  vi: [
    { year: '2005', title: 'Bắt đầu hoạt động trong lĩnh vực pháp luật', description: 'Bắt đầu công tác trong lĩnh vực pháp luật, xây dựng nền tảng thực tiễn trong tư vấn pháp lý, xử lý tranh chấp và hỗ trợ tố tụng tại Việt Nam.' },
    { year: '2010', title: 'Tranh chấp dân sự và thương mại giá trị lớn', description: 'Tham gia các vụ việc dân sự, thương mại và doanh nghiệp có giá trị lên đến khoảng 200 tỷ đồng, đòi hỏi phân tích chứng cứ, nghĩa vụ hợp đồng và chiến lược tố tụng phù hợp.' },
    { year: '2015', title: 'Vụ án phức tạp về hình sự, dân sự và thương mại', description: 'Tham gia các vụ án hình sự nghiêm trọng, tranh chấp dân sự trên 100 tỷ đồng, hồ sơ hôn nhân và tài sản khoảng 16.500 tỷ đồng, cùng tranh chấp thương mại từ 5 triệu USD đến 8 triệu USD.' },
    { year: '2018', title: 'Luật sư Điều hành tại Apolo Lawyers', description: 'Giữ vai trò Luật sư Điều hành tại Apolo Lawyers, phụ trách định hướng chuyên môn, chiến lược xử lý hồ sơ và trực tiếp tham gia các vụ việc trọng yếu trong nước và quốc tế.' },
    { year: '2020', title: 'Đầu tư, M&A và vụ việc có yếu tố quốc tế', description: 'Hỗ trợ khách hàng nước ngoài trong các hồ sơ tranh chấp, đầu tư, FDI, M&A, trọng tài và lao động; bao gồm dự án 5-20 triệu USD, giao dịch M&A 10-50 triệu USD và một phần thủ tục rút vốn của nhà đầu tư Pháp có quy mô đầu tư khoảng 1 tỷ USD tại Việt Nam.' },
    { year: '2025', title: 'Định vị Apolo Lawyers trong tố tụng và trọng tài', description: 'Tập trung định vị Apolo Lawyers trong tố tụng, trọng tài và tranh chấp phức tạp, trên nền tảng kinh nghiệm hơn 500 vụ việc tại Tòa án, hơn 100 vụ việc trọng tài, hơn 300 hồ sơ tư vấn, giải quyết tranh chấp và đội ngũ nhân sự giỏi chuyên môn.' },
  ],
  en: [
    { year: '2005', title: 'Entry into Legal Practice', description: 'Began working in the legal field, building practical foundations in legal advisory work, dispute handling and litigation support in Vietnam.' },
    { year: '2010', title: 'High Value Civil and Commercial Disputes', description: 'Participated in civil, commercial and corporate matters with values of up to approximately VND 200 billion, requiring evidence analysis, contractual assessment and appropriate litigation strategy.' },
    { year: '2015', title: 'Complex Criminal, Civil and Commercial Matters', description: 'Participated in serious criminal cases, civil disputes exceeding VND 100 billion, family and asset matters valued at approximately VND 16.5 trillion, and commercial disputes ranging from USD 5 million to USD 8 million.' },
    { year: '2018', title: 'Managing Partner at Apolo Lawyers', description: 'Served as Managing Partner of Apolo Lawyers, overseeing professional direction, case strategy and direct involvement in significant domestic and international matters.' },
    { year: '2020', title: 'Investment, M&A and International Matters', description: 'Supported foreign clients in disputes, investment, FDI, M&A, arbitration and labour matters, including projects valued at USD 5-20 million, M&A transactions valued at USD 10-50 million, and part of the legal procedures for the withdrawal of capital by a French investor with an investment scale of approximately USD 1 billion in Vietnam.' },
    { year: '2025', title: 'Positioning Apolo Lawyers in Litigation and Arbitration', description: 'Focused on positioning Apolo Lawyers in litigation, arbitration and complex disputes, built on experience in more than 500 court cases, more than 100 arbitration matters, more than 300 advisory and dispute resolution matters, and a team of strong legal professionals.' },
  ],
};

const memberships = {
  vi: [
    'Đoàn Luật sư Thành phố Hồ Chí Minh',
    'Liên đoàn Luật sư Việt Nam',
    'Hội Luật gia Việt Nam',
    'Association of European Attorneys (AEA)',
  ],
  en: [
    'Ho Chi Minh City Bar Association',
    'Vietnam Bar Federation',
    'Vietnam Lawyers Association',
    'Association of European Attorneys (AEA)',
  ],
};

export default async function LawyerProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const isVi = locale === 'vi';
  const timeline = timelineData[isVi ? 'vi' : 'en'];
  const membershipList = memberships[isVi ? 'vi' : 'en'];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Vo Thien Hien',
      // VI alternate name is the Vietnamese diacritic form; EN exposes the
      // English nickname per the 17/05/2026 client review.
      alternateName: isVi ? 'Võ Thiện Hiển' : 'Henry Vo',
      jobTitle: isVi ? 'Luật sư Điều hành' : 'Managing Partner',
      worksFor: {
        '@type': 'LegalService',
        name: isVi ? SHORT_NAME_VN : SHORT_NAME_EN,
        url: parentBrandUrl(locale),
      },
      url: 'https://vothienhien.com',
      sameAs: [parentBrandUrl(locale)],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: isVi ? 'Trang chủ' : 'Home', item: `https://vothienhien.com/${locale}` },
        { '@type': 'ListItem', position: 2, name: isVi ? 'Giới thiệu Luật sư' : 'Lawyer Profile', item: `https://vothienhien.com/${locale}/${isVi ? 'gioi-thieu-luat-su' : 'lawyer-profile'}` },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero Section */}
      <section className="relative bg-primary text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-secondary to-primary opacity-90" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="text-sm uppercase tracking-[0.3em] text-accent font-medium">
            {isVi ? 'Hồ sơ Luật sư' : 'Attorney Profile'}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mt-6 mb-4">
            {isVi ? 'Võ Thiện Hiển' : 'Vo Thien Hien'}
          </h1>
          <p className="text-xl text-white/80 font-light">
            {isVi ? 'Luật sư Điều hành · Apolo Lawyers' : 'Managing Partner · Apolo Lawyers'}
          </p>
          <div className="flex justify-center mt-6">
            <GoldDivider width="w-24 mx-auto" />
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading
            subtitle={isVi ? 'Tiểu sử' : 'Biography'}
            title={isVi ? 'Về Luật sư Võ Thiện Hiển' : 'About Attorney Vo Thien Hien'}
          />
          <div className="mt-12 space-y-6 text-text-secondary leading-relaxed text-lg">
            {isVi ? (
              <>
                <p>
                  Luật sư Võ Thiện Hiển, tên tiếng Anh là Henry Vo, là luật sư Việt Nam có hơn 20 năm kinh nghiệm hành nghề trong lĩnh vực tố tụng, trọng tài, giải quyết tranh chấp và tư vấn pháp lý tại Việt Nam. Từ năm 2018, ông giữ vai trò Luật sư Điều hành tại Apolo Lawyers, phụ trách định hướng chuyên môn và trực tiếp tham gia xử lý các vụ việc có yếu tố trong nước và nước ngoài.
                </p>
                <p>
                  Trong quá trình hành nghề, Luật sư Võ Thiện Hiển đã tham gia hơn 500 vụ việc tại Tòa án, hơn 100 vụ việc trọng tài và hơn 300 hồ sơ tư vấn, hỗ trợ giải quyết tranh chấp. Kinh nghiệm thực tiễn này giúp ông tiếp cận vụ việc từ nhiều góc độ, bao gồm pháp lý, chứng cứ, thủ tục, đàm phán và khả năng thi hành kết quả giải quyết tranh chấp.
                </p>
                <p>
                  Hoạt động hành nghề của ông tập trung vào các lĩnh vực dân sự, thương mại, doanh nghiệp, đất đai, lao động, hôn nhân và gia đình, hình sự, trọng tài và các vấn đề pháp lý có yếu tố nước ngoài. Trong các vụ việc có yếu tố quốc tế, ông phối hợp cùng đội ngũ pháp lý sử dụng tiếng Anh để hỗ trợ khách hàng nước ngoài tiếp cận pháp luật và thủ tục tại Việt Nam một cách rõ ràng, thực tế và thận trọng.
                </p>
                <p>
                  Luật sư Võ Thiện Hiển có nền tảng đào tạo pháp luật tại Trường Đại học Luật Thành phố Hồ Chí Minh và Học viện Tư pháp. Ông có Chứng chỉ hành nghề luật sư do Bộ Tư pháp cấp, Thẻ luật sư do Liên đoàn Luật sư Việt Nam cấp, là thành viên Đoàn Luật sư Thành phố Hồ Chí Minh, Hội Luật gia Việt Nam và Association of European Attorneys.
                </p>
                <p>
                  Cách tiếp cận của ông chú trọng vào việc đánh giá chứng cứ, phân tích rủi ro, xây dựng chiến lược xử lý hồ sơ và giúp khách hàng hiểu rõ vị thế pháp lý của mình trước khi lựa chọn phương án phù hợp.
                </p>
              </>
            ) : (
              <>
                <p>
                  Attorney Vo Thien Hien, also known as Henry Vo, is a Vietnamese attorney with more than 20 years of legal practice experience in litigation, arbitration, dispute resolution and legal advisory work in Vietnam. Since 2018, he has served as the Managing Partner of Apolo Lawyers, overseeing professional direction and directly handling matters involving both domestic and foreign elements.
                </p>
                <p>
                  Throughout his legal career, Attorney Vo Thien Hien has been involved in more than 500 court cases, more than 100 arbitration matters and more than 300 advisory and dispute resolution matters. This practical experience allows him to approach each matter from multiple perspectives, including legal analysis, evidence, procedure, negotiation and the enforceability of dispute resolution outcomes.
                </p>
                <p>
                  His practice focuses on civil, commercial, corporate, land, labour, family, criminal, arbitration and foreign related legal matters. In matters involving international clients, he works together with an English speaking legal team to help foreign clients understand Vietnamese law and procedures in a clear, practical and careful manner.
                </p>
                <p>
                  Attorney Vo Thien Hien received his legal education from Ho Chi Minh City University of Law and the Judicial Academy of Vietnam. He holds a Lawyer Practising Certificate issued by the Ministry of Justice of Vietnam and a Lawyer Card issued by the Vietnam Bar Federation. He is a member of the Ho Chi Minh City Bar Association, the Vietnam Lawyers Association and the Association of European Attorneys.
                </p>
                <p>
                  His approach focuses on evidence assessment, risk analysis, case strategy and helping clients understand their legal position before choosing an appropriate course of action.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Visual Break - Client Meeting */}
      <section className="relative h-[250px] md:h-[350px] overflow-hidden">
        <Image
          src={IMAGES.sectionClientMeeting.cdn}
          alt={IMAGES.sectionClientMeeting.alt}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary/50" />
      </section>

      {/* Career Timeline */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading
            subtitle={isVi ? 'Quá trình' : 'Journey'}
            title={t('profile.timeline')}
          />
          <div className="mt-16 relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border-gold md:-translate-x-px" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-start gap-8 md:gap-12 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Gold dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-accent rounded-full border-2 border-accent -translate-x-1.5 mt-2 z-10" />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <span className="text-accent font-semibold text-lg">{item.year}</span>
                    <h3 className="text-xl font-heading font-semibold text-primary mt-1">{item.title}</h3>
                    <p className="text-text-secondary mt-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visual Break - Consultation */}
      <section className="relative h-[250px] md:h-[350px] overflow-hidden">
        <Image
          src={IMAGES.sectionConsultation.cdn}
          alt={IMAGES.sectionConsultation.alt}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary/50" />
      </section>

      {/* Visual Break - Team Discussion */}
      <section className="relative h-[250px] md:h-[350px] overflow-hidden">
        <Image
          src={IMAGES.sectionTeamDiscussion.cdn}
          alt={IMAGES.sectionTeamDiscussion.alt}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary/50" />
      </section>

      {/* Memberships */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading
            subtitle={isVi ? 'Tổ chức' : 'Organizations'}
            title={t('profile.memberships')}
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {membershipList.map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 bg-background border border-border-gold/20 p-6 hover:border-accent/40 transition-colors duration-300"
              >
                <div className="w-2 h-2 bg-accent rounded-full shrink-0" />
                <span className="text-text-primary font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
            {isVi ? 'Cần tư vấn pháp lý?' : 'Need Legal Counsel?'}
          </h2>
          <p className="text-white/70 text-lg mb-8">
            {isVi
              ? 'Hãy liên hệ với Luật sư Võ Thiện Hiển để được tư vấn chuyên nghiệp và tận tâm.'
              : 'Contact Attorney Vo Thien Hien for dedicated and professional legal guidance.'}
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
