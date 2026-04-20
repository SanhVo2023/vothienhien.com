import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import Button from '@/components/ui/Button';
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
      ? 'Giới Thiệu Luật Sư Võ Thiện Hiển | Apolo Lawyers'
      : 'Attorney Profile - Vo Thien Hien | Apolo Lawyers',
    description: isVi
      ? 'Tìm hiểu về Luật sư Võ Thiện Hiển - Luật sư Điều hành tại Công ty Luật TNHH Apolo Lawyers. Hơn 15 năm kinh nghiệm trong lĩnh vực pháp luật dân sự, đất đai và doanh nghiệp.'
      : 'Learn about Attorney Vo Thien Hien - Managing Partner at Apolo Lawyers LLC. Over 15 years of experience in civil law, land disputes, and corporate advisory in Vietnam.',
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
    { year: '2008', title: 'Tốt nghiệp Cử nhân Luật', description: 'Đại học Luật TP. Hồ Chí Minh - Bằng Cử nhân Luật, xếp loại Giỏi' },
    { year: '2010', title: 'Chứng chỉ Hành nghề Luật sư', description: 'Hoàn thành khóa đào tạo nghề luật sư tại Học viện Tư pháp và được cấp Chứng chỉ hành nghề' },
    { year: '2011', title: 'Gia nhập Đoàn Luật sư', description: 'Trở thành thành viên Đoàn Luật sư TP. Hồ Chí Minh' },
    { year: '2014', title: 'Luật sư Thành viên', description: 'Trở thành Luật sư Thành viên tại Công ty Luật TNHH Apolo Lawyers' },
    { year: '2018', title: 'Thạc sĩ Luật Kinh tế', description: 'Hoàn thành chương trình Thạc sĩ Luật Kinh tế tại Đại học Luật TP. Hồ Chí Minh' },
    { year: '2020', title: 'Luật sư Điều hành', description: 'Được bổ nhiệm làm Luật sư Điều hành, dẫn dắt đội ngũ luật sư và mở rộng lĩnh vực hành nghề' },
  ],
  en: [
    { year: '2008', title: 'Bachelor of Laws', description: 'Ho Chi Minh City University of Law - Bachelor of Laws, Honors' },
    { year: '2010', title: 'Legal Practice Certificate', description: 'Completed professional legal training at the Judicial Academy and obtained Legal Practice Certificate' },
    { year: '2011', title: 'Bar Association Membership', description: 'Admitted to the Ho Chi Minh City Bar Association' },
    { year: '2014', title: 'Partner', description: 'Became a Partner at Apolo Lawyers LLC' },
    { year: '2018', title: 'Master of Economic Law', description: 'Completed Master of Economic Law program at Ho Chi Minh City University of Law' },
    { year: '2020', title: 'Managing Partner', description: 'Appointed Managing Partner, leading the legal team and expanding practice areas' },
  ],
};

const educationData = {
  vi: [
    { degree: 'Thạc sĩ Luật Kinh tế', institution: 'Đại học Luật TP. Hồ Chí Minh', year: '2018' },
    { degree: 'Cử nhân Luật', institution: 'Đại học Luật TP. Hồ Chí Minh', year: '2008' },
    { degree: 'Chứng chỉ Hành nghề Luật sư', institution: 'Học viện Tư pháp', year: '2010' },
  ],
  en: [
    { degree: 'Master of Economic Law', institution: 'Ho Chi Minh City University of Law', year: '2018' },
    { degree: 'Bachelor of Laws (LL.B.)', institution: 'Ho Chi Minh City University of Law', year: '2008' },
    { degree: 'Legal Practice Certificate', institution: 'Judicial Academy', year: '2010' },
  ],
};

const memberships = {
  vi: [
    'Đoàn Luật sư TP. Hồ Chí Minh',
    'Liên đoàn Luật sư Việt Nam',
    'Hiệp hội Luật sư Châu Á - Thái Bình Dương (LAWASIA)',
    'Câu lạc bộ Luật sư Thương mại Quốc tế',
  ],
  en: [
    'Ho Chi Minh City Bar Association',
    'Vietnam Bar Federation',
    'Law Association for Asia and the Pacific (LAWASIA)',
    'International Commercial Law Club',
  ],
};

export default async function LawyerProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const isVi = locale === 'vi';
  const timeline = timelineData[isVi ? 'vi' : 'en'];
  const education = educationData[isVi ? 'vi' : 'en'];
  const membershipList = memberships[isVi ? 'vi' : 'en'];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Vo Thien Hien',
      alternateName: 'Võ Thiện Hiển',
      jobTitle: isVi ? 'Luật sư Điều hành' : 'Managing Partner',
      worksFor: {
        '@type': 'LegalService',
        name: 'Apolo Lawyers',
        url: 'https://apololawyers.com',
      },
      url: 'https://vothienhien.com',
      sameAs: ['https://apololawyers.com'],
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
                  Luật sư Võ Thiện Hiển là Luật sư Điều hành tại Công ty Luật TNHH Apolo Lawyers, một trong những công ty luật uy tín hàng đầu tại TP. Hồ Chí Minh. Với hơn 15 năm kinh nghiệm hành nghề, Luật sư Hiển đã trực tiếp tham gia giải quyết hàng trăm vụ việc pháp lý phức tạp trong các lĩnh vực dân sự, đất đai, doanh nghiệp và hình sự.
                </p>
                <p>
                  Tốt nghiệp xuất sắc từ Đại học Luật TP. Hồ Chí Minh và hoàn thành chương trình Thạc sĩ Luật Kinh tế, Luật sư Hiển kết hợp nền tảng học thuật vững chắc với kinh nghiệm thực tiễn phong phú. Ông được biết đến với phong cách tư vấn chuyên nghiệp, tận tâm và luôn đặt quyền lợi của khách hàng lên hàng đầu.
                </p>
                <p>
                  Ngoài hoạt động hành nghề, Luật sư Hiển còn tích cực tham gia các hoạt động đào tạo pháp luật, viết bài nghiên cứu chuyên môn và đóng góp ý kiến cho các dự thảo văn bản pháp luật. Ông là thành viên của nhiều tổ chức nghề nghiệp trong nước và quốc tế.
                </p>
              </>
            ) : (
              <>
                <p>
                  Attorney Vo Thien Hien is the Managing Partner at Apolo Lawyers LLC, one of the leading law firms in Ho Chi Minh City, Vietnam. With over 15 years of legal practice, Attorney Vo Thien Hien has directly handled hundreds of complex legal matters across civil law, land disputes, corporate advisory, and criminal defense.
                </p>
                <p>
                  Having graduated with honors from Ho Chi Minh City University of Law and completed a Master of Economic Law, Attorney Vo Thien Hien combines a strong academic foundation with extensive practical experience. He is recognized for his professional, dedicated approach and unwavering commitment to protecting his clients&apos; interests.
                </p>
                <p>
                  Beyond his legal practice, Attorney Vo Thien Hien actively participates in legal education, publishes professional legal articles, and contributes to legislative drafting consultations. He holds memberships in numerous domestic and international professional organizations.
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

      {/* Education & Credentials */}
      <section className="relative py-20 md:py-28 bg-background overflow-hidden">
        {/* Logo 2 (Classical Pillar) — decorative credentials emblem */}
        <div className="pointer-events-none absolute right-[-120px] top-1/2 -translate-y-1/2 w-[440px] opacity-[0.04]">
          <Image
            src={IMAGES.logoSymbolic2Pillar.cdn}
            alt=""
            width={440}
            height={440}
            aria-hidden="true"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-6">
          <SectionHeading
            subtitle={isVi ? 'Trình độ' : 'Qualifications'}
            title={`${t('profile.education')} & ${t('profile.credentials')}`}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {education.map((item) => (
              <div
                key={item.degree}
                className="bg-surface border border-border-gold/30 p-8 hover:border-accent/50 transition-colors duration-300"
              >
                <span className="text-accent text-sm font-medium">{item.year}</span>
                <h3 className="text-lg font-heading font-semibold text-primary mt-2">{item.degree}</h3>
                <p className="text-text-secondary mt-2 text-sm">{item.institution}</p>
              </div>
            ))}
          </div>
        </div>
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
