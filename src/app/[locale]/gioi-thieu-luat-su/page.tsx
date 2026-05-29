import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import Button from '@/components/ui/Button';
import CareerGallery from '@/components/about/CareerGallery';
import ProfileStats from '@/components/about/ProfileStats';
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
        'x-default': '/vi/gioi-thieu-luat-su',
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

  const heroChips = isVi
    ? ['Hơn 20 năm kinh nghiệm', 'Luật sư Điều hành', 'Thành viên AEA']
    : ['20+ Years of Practice', 'Managing Partner', 'AEA Member'];

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
        { '@type': 'ListItem', position: 2, name: isVi ? 'Giới thiệu Luật sư' : 'Attorney Profile', item: `https://vothienhien.com/${locale}/${isVi ? 'gioi-thieu-luat-su' : 'lawyer-profile'}` },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-black" />
        {/* Faint laurel mark */}
        <div className="pointer-events-none absolute -right-24 top-1/2 hidden w-[480px] -translate-y-1/2 opacity-[0.05] lg:block">
          <Image src={IMAGES.logoSymbolic4LaurelScales.local} alt="" width={480} height={480} aria-hidden="true" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Text */}
          <div>
            <span className="text-sm font-medium uppercase tracking-[0.3em] text-accent">
              {isVi ? 'Hồ sơ Luật sư' : 'Attorney Profile'}
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.05] md:text-5xl lg:text-6xl">
              {isVi ? 'Võ Thiện Hiển' : 'Vo Thien Hien'}
            </h1>
            <p className="mt-4 text-xl font-light text-white/75">
              {isVi ? 'Luật sư Điều hành · Apolo Lawyers' : 'Managing Partner · Apolo Lawyers'}
            </p>
            <GoldDivider width="w-24" className="mt-6" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              {isVi
                ? 'Hơn hai thập kỷ đồng hành cùng khách hàng trong tố tụng, trọng tài và giải quyết tranh chấp — bằng chứng cứ vững vàng và chiến lược pháp lý thực tế.'
                : 'More than two decades alongside clients in litigation, arbitration and dispute resolution — built on solid evidence and a practical legal strategy.'}
            </p>
            <ul className="mt-8 flex flex-wrap gap-3">
              {heroChips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-accent/30 bg-white/[0.03] px-4 py-2 text-sm text-white/80 backdrop-blur-sm"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          {/* Portrait */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="absolute -inset-3 border border-accent/30" aria-hidden="true" />
            <div className="absolute -bottom-4 -right-4 h-24 w-24 border-b-2 border-r-2 border-accent" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/career/01.webp"
                alt={isVi ? 'Luật sư Võ Thiện Hiển' : 'Attorney Vo Thien Hien'}
                fill
                priority
                sizes="(max-width: 1024px) 24rem, 36vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── Stat band ─────────────────────── */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl px-6">
          <ProfileStats locale={locale} />
        </div>
      </section>

      {/* ─────────────────────── Biography ─────────────────────── */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            {/* Sticky portrait + quote */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="relative aspect-[4/5] overflow-hidden ring-1 ring-border-gold/30">
                <Image
                  src="/images/career/04.webp"
                  alt={isVi ? 'Luật sư Võ Thiện Hiển tại văn phòng' : 'Attorney Vo Thien Hien at the office'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 36vw"
                  className="object-cover"
                />
              </div>
              <figure className="mt-6 border-l-2 border-accent pl-5">
                <blockquote className="font-heading text-lg italic leading-relaxed text-primary">
                  {isVi
                    ? '“Hiểu rõ chứng cứ, phân tích rủi ro và xây dựng chiến lược — để khách hàng nắm vững vị thế pháp lý trước khi quyết định.”'
                    : '“Master the evidence, analyse the risk, and build the strategy — so a client understands their position before they decide.”'}
                </blockquote>
                <figcaption className="mt-3 text-sm uppercase tracking-[0.18em] text-text-secondary">
                  {isVi ? '— Luật sư Võ Thiện Hiển' : '— Vo Thien Hien'}
                </figcaption>
              </figure>
            </div>

            {/* Bio text */}
            <div>
              <SectionHeading
                align="left"
                subtitle={isVi ? 'Tiểu sử' : 'Biography'}
                title={isVi ? 'Về Luật sư Võ Thiện Hiển' : 'About Attorney Vo Thien Hien'}
              />
              <div className="mt-10 space-y-6 text-lg leading-relaxed text-text-secondary">
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
          </div>
        </div>
      </section>

      {/* ──────────────────── Career Moments gallery ──────────────────── */}
      <section className="bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            subtitle={isVi ? 'Hành trình' : 'Journey'}
            title={isVi ? 'Khoảnh khắc sự nghiệp' : 'Career Moments'}
            description={
              isVi
                ? 'Những dấu mốc và khoảnh khắc đáng nhớ trong hành trình hành nghề của Luật sư Võ Thiện Hiển.'
                : 'Milestones and memorable moments across Attorney Vo Thien Hien’s career in practice.'
            }
          />
          <div className="mt-14">
            <CareerGallery locale={locale} />
          </div>
        </div>
      </section>

      {/* ───────────────────────── Timeline ───────────────────────── */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading subtitle={isVi ? 'Quá trình' : 'Milestones'} title={t('profile.timeline')} />
          <div className="relative mt-16">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border-gold md:left-1/2 md:-translate-x-px" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-start gap-8 md:gap-12 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Gold dot */}
                  <div className="absolute left-4 z-10 mt-2 h-3 w-3 -translate-x-1.5 rounded-full bg-accent ring-4 ring-accent/20 md:left-1/2" />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <span className="font-[family-name:var(--font-inter)] text-lg font-semibold text-accent">{item.year}</span>
                    <h3 className="mt-1 font-heading text-xl font-semibold text-primary">{item.title}</h3>
                    <p className="mt-2 text-text-secondary">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── Philosophy (cinematic quote) ──────────────── */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <Image
          src={IMAGES.bgSpeaking.cdn}
          alt=""
          fill
          aria-hidden="true"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative mx-auto max-w-3xl px-6 text-center text-white">
          <span className="font-heading text-6xl leading-none text-accent">“</span>
          <p className="-mt-4 font-heading text-2xl font-light leading-relaxed md:text-3xl">
            {isVi
              ? 'Mỗi vụ việc là một con người, một doanh nghiệp và một quyết định quan trọng. Trách nhiệm của luật sư là làm cho điều phức tạp trở nên rõ ràng.'
              : 'Every matter is a person, a business and a decision that matters. A lawyer’s duty is to make the complex clear.'}
          </p>
          <div className="mt-8 flex justify-center">
            <GoldDivider width="w-24 mx-auto" />
          </div>
          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-white/60">
            {isVi ? 'Võ Thiện Hiển · Luật sư Điều hành' : 'Vo Thien Hien · Managing Partner'}
          </p>
        </div>
      </section>

      {/* ─────────────────────── Memberships ─────────────────────── */}
      <section className="bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading subtitle={isVi ? 'Tổ chức' : 'Organizations'} title={t('profile.memberships')} />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {membershipList.map((item) => (
              <div
                key={item}
                className="group flex items-center gap-4 border border-border-gold/20 bg-background p-6 transition-colors duration-300 hover:border-accent/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 text-accent transition-colors group-hover:bg-accent group-hover:text-primary">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="font-medium text-text-primary">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA ───────────────────────── */}
      <section className="bg-primary py-20 text-center text-white md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-4 font-heading text-3xl font-semibold md:text-4xl">
            {isVi ? 'Cần tư vấn pháp lý?' : 'Need Legal Counsel?'}
          </h2>
          <p className="mb-8 text-lg text-white/70">
            {isVi
              ? 'Hãy liên hệ với Luật sư Võ Thiện Hiển để được tư vấn chuyên nghiệp và tận tâm.'
              : 'Contact Attorney Vo Thien Hien for dedicated and professional legal guidance.'}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/lien-he">
              <Button variant="primary" size="lg">
                {t('common.scheduleConsultation')}
              </Button>
            </Link>
            <Link href="/vu-viec-tieu-bieu">
              <Button variant="outline" size="lg">
                {isVi ? 'Xem vụ việc tiêu biểu' : 'View Representative Experience'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
