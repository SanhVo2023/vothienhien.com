import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import GoldDivider from '@/components/ui/GoldDivider';
import SectionHeading from '@/components/ui/SectionHeading';
import { Link } from '@/i18n/navigation';
import { IMAGES } from '@/lib/images';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

interface PerspectiveData {
  title: string;
  date: string;
  content: string[];
  relatedSlugs: string[];
}

// Map slugs to hero images
const slugImageMap: Record<string, { src: string; alt: string }> = {
  'dao-duc-nghe-luat-su': { src: IMAGES.detailHands.cdn, alt: IMAGES.detailHands.alt },
  'luat-su-va-cong-ly-xa-hoi': { src: IMAGES.bgSpeaking.cdn, alt: IMAGES.bgSpeaking.alt },
  'tuong-lai-nghe-luat-viet-nam': { src: IMAGES.bgLibrary.cdn, alt: IMAGES.bgLibrary.alt },
  'xay-dung-long-tin-khach-hang': { src: IMAGES.profileHero.cdn, alt: IMAGES.profileHero.alt },
};

const perspectivesData: Record<string, { vi: PerspectiveData; en: PerspectiveData }> = {
  'dao-duc-nghe-luat-su': {
    vi: {
      title: 'Đạo đức nghề nghiệp - nền tảng của nghề luật sư',
      date: '20/02/2024',
      content: [
        'Trong hành trình hơn 15 năm hành nghề luật sư, tôi đã chứng kiến nhiều sự thay đổi trong nghề. Nhưng có một điều luôn không thay đổi, đó là giá trị của đạo đức nghề nghiệp. Đây là nền tảng mà mỗi luật sư cần xây dựng và bảo vệ suốt sự nghiệp của mình.',
        'Đạo đức nghề nghiệp không đơn thuần là việc tuân thủ các quy tắc ứng xử do Liên đoàn Luật sư ban hành. Nó còn là cam kết cá nhân của mỗi luật sư với sự trung thực, liêm chính và công bằng trong mọi hành động.',
        'Tôi tin rằng một luật sư thực sự giỏi là người đặt lợi ích chính đáng của khách hàng lên hàng đầu, nhưng không bao giờ vi phạm pháp luật hay đạo đức để đạt được mục đích. Ranh giới này đôi khi rất mong manh, và chỉ có những người có bản lĩnh đạo đức vững vàng mới có thể vượt qua.',
        'Trong nhiều vụ việc, tôi đã từ chối đại diện cho những khách hàng muốn tôi sử dụng những phương pháp không chính đáng. Mặc dù điều này có thể khiến tôi mất đi một số khách hàng, nhưng nó giúp tôi xây dựng được uy tín và sự tin tưởng lâu dài từ cộng đồng và đồng nghiệp.',
        'Tôi khuyên các luật sư trẻ hãy luôn nhớ rằng: danh tiếng cần cả đời để xây dựng nhưng chỉ cần một lần sai phạm để mất đi. Hãy đầu tư vào đạo đức nghề nghiệp như đầu tư vào tương lai của chính mình.',
        'Đạo đức nghề nghiệp không chỉ bảo vệ khách hàng mà còn bảo vệ chính luật sư. Một luật sư liêm chính sẽ luôn được đồng nghiệp tôn trọng, tòa án tin tưởng và khách hàng tìm đến.',
      ],
      relatedSlugs: ['luat-su-va-cong-ly-xa-hoi'],
    },
    en: {
      title: 'Professional ethics - the foundation of legal practice',
      date: '02/20/2024',
      content: [
        'In my 15+ year journey in legal practice, I\'ve witnessed many changes in the profession. But one thing remains constant: the value of professional ethics. This is the foundation that every lawyer must build and protect throughout their career.',
        'Professional ethics is not merely about complying with codes of conduct issued by the Bar Federation. It is also each lawyer\'s personal commitment to honesty, integrity, and fairness in every action.',
        'I believe a truly great lawyer is one who places clients\' legitimate interests first, but never violates the law or ethics to achieve objectives. This boundary is sometimes very thin, and only those with strong moral courage can navigate it.',
        'In many matters, I have declined to represent clients who wanted me to use improper methods. While this may have cost me some clients, it has helped me build lasting credibility and trust from the community and colleagues.',
        'My advice to young lawyers: always remember that reputation takes a lifetime to build but only one misstep to lose. Invest in professional ethics as you invest in your own future.',
        'Professional ethics protects not only clients but also the lawyers themselves. A lawyer of integrity will always earn the respect of colleagues, the trust of courts, and the loyalty of clients.',
      ],
      relatedSlugs: ['lawyers-social-justice'],
    },
  },
  'luat-su-va-cong-ly-xa-hoi': {
    vi: {
      title: 'Vai trò của luật sư trong bảo vệ công lý xã hội',
      date: '15/01/2024',
      content: [
        'Luật sư không chỉ là người cung cấp dịch vụ pháp lý. Chúng ta còn mang trên vai trách nhiệm lớn lao đối với công lý xã hội. Mỗi vụ việc chúng ta xử lý không chỉ ảnh hưởng đến khách hàng mà còn góp phần định hình hệ thống pháp luật và xã hội.',
        'Tôi đã từng đại diện cho những người dân bình thường trong cuộc chiến chống lại những quyết định hành chính bất công. Những vụ việc này thường không mang lại thu nhập cao, nhưng mang lại sự hài lòng khi biết rằng mình đã góp phần bảo vệ quyền lợi của những người yếu thế.',
        'Công lý xã hội đòi hỏi luật sư phải dám lên tiếng khi chứng kiến sự bất công, kể cả khi điều đó không phải lúc nào cũng dễ dàng. Nó đòi hỏi sự dũng cảm, kiên nhẫn và niềm tin vào hệ thống pháp luật.',
        'Tôi tin rằng mỗi luật sư, dù hành nghề ở bất kỳ lĩnh vực nào, đều có thể đóng góp cho công lý xã hội. Có thể là tư vấn miễn phí cho người nghèo, tham gia góp ý xây dựng pháp luật, hoặc đơn giản là làm tốt công việc của mình với sự công tâm và chính trực.',
        'Nghề luật sư là nghề cao quý. Hãy sống xứng đáng với sự cao quý đó.',
        'Khi chúng ta bảo vệ quyền lợi của một người, chúng ta đang bảo vệ quyền lợi của tất cả mọi người. Đó là bản chất của pháp quyền và là sứ mệnh thiêng liêng của người luật sư.',
      ],
      relatedSlugs: ['dao-duc-nghe-luat-su'],
    },
    en: {
      title: 'The role of lawyers in protecting social justice',
      date: '01/15/2024',
      content: [
        'Lawyers are not just legal service providers. We carry the great responsibility for social justice. Every matter we handle not only affects our clients but also helps shape the legal system and society.',
        'I have represented ordinary citizens in their fight against unjust administrative decisions. These cases often don\'t generate high income, but they bring satisfaction knowing that I\'ve contributed to protecting the rights of the disadvantaged.',
        'Social justice requires lawyers to speak up when witnessing injustice, even when it\'s not always easy. It demands courage, patience, and faith in the legal system.',
        'I believe every lawyer, regardless of practice area, can contribute to social justice. Whether through pro bono work for the poor, participating in legislative consultations, or simply doing their work with fairness and integrity.',
        'The legal profession is a noble one. Let us live up to that nobility.',
        'When we protect one person\'s rights, we are protecting everyone\'s rights. That is the essence of the rule of law and the sacred mission of every lawyer.',
      ],
      relatedSlugs: ['legal-ethics-foundation'],
    },
  },
  'tuong-lai-nghe-luat-viet-nam': {
    vi: {
      title: 'Tương lai nghề luật tại Việt Nam - Cơ hội và thách thức',
      date: '10/12/2023',
      content: [
        'Nghề luật sư tại Việt Nam đang đứng trước những thay đổi lớn chưa từng có. Công nghệ số, trí tuệ nhân tạo và toàn cầu hóa đang thay đổi căn bản cách chúng ta hành nghề và cung cấp dịch vụ pháp lý.',
        'Cơ hội là rất lớn. Việt Nam đang hội nhập sâu rộng vào kinh tế thế giới, tạo ra nhu cầu lớn về dịch vụ pháp lý quốc tế. Các doanh nghiệp FDI cần luật sư hiểu biết cả pháp luật Việt Nam và thông lệ quốc tế.',
        'Tuy nhiên, thách thức cũng không nhỏ. Công nghệ có thể thay thế nhiều công việc truyền thống của luật sư. Các nền tảng pháp lý trực tuyến đang làm thay đổi cách khách hàng tiếp cận dịch vụ pháp lý. Luật sư cần thích ứng hoặc bị bỏ lại phía sau.',
        'Tôi tin rằng tương lai thuộc về những luật sư có khả năng kết hợp chuyên môn pháp lý với kiến thức công nghệ và kỹ năng giao tiếp quốc tế. Chuyên môn hóa sâu và đa dạng hóa dịch vụ là hướng đi đúng.',
        'Cho thế hệ luật sư trẻ, tôi muốn nói rằng: hãy không ngừng học hỏi, dám đổi mới và luôn giữ vững giá trị cốt lõi của nghề. Tương lai nghề luật Việt Nam là tươi sáng nếu chúng ta dám đầu tư và thay đổi.',
        'Sự phát triển của công nghệ pháp lý (LegalTech) không phải mối đe dọa mà là cơ hội để luật sư nâng cao chất lượng dịch vụ và mở rộng phạm vi tiếp cận khách hàng.',
      ],
      relatedSlugs: ['xay-dung-long-tin-khach-hang'],
    },
    en: {
      title: 'The future of legal practice in Vietnam - Opportunities and challenges',
      date: '12/10/2023',
      content: [
        'The legal profession in Vietnam is facing unprecedented changes. Digital technology, artificial intelligence, and globalization are fundamentally transforming how we practice and deliver legal services.',
        'The opportunities are immense. Vietnam is deeply integrating into the global economy, creating significant demand for international legal services. FDI enterprises need lawyers who understand both Vietnamese law and international practices.',
        'However, the challenges are equally significant. Technology can replace many traditional lawyer functions. Online legal platforms are changing how clients access legal services. Lawyers must adapt or be left behind.',
        'I believe the future belongs to lawyers who can combine legal expertise with technology literacy and international communication skills. Deep specialization and service diversification is the right direction.',
        'To the young generation of lawyers, I want to say: never stop learning, dare to innovate, and always uphold the core values of the profession. The future of Vietnam\'s legal profession is bright if we dare to invest and change.',
        'The rise of LegalTech is not a threat but an opportunity for lawyers to enhance service quality and expand their client reach.',
      ],
      relatedSlugs: ['building-client-trust'],
    },
  },
  'xay-dung-long-tin-khach-hang': {
    vi: {
      title: 'Xây dựng lòng tin khách hàng - Chìa khóa thành công',
      date: '25/10/2023',
      content: [
        'Trong nghề luật sư, lòng tin của khách hàng là tài sản quý giá nhất. Nó quyết định sự thành bại của sự nghiệp và là cơ sở để xây dựng một thương hiệu cá nhân bền vững.',
        'Lòng tin không đến từ những lời hứa hoa mỹ hay những chiến dịch quảng cáo lớn. Nó đến từ sự tận tâm trong từng vụ việc, sự minh bạch trong giao tiếp và kết quả thực tế mà bạn mang lại cho khách hàng.',
        'Tôi luôn tin rằng việc giao tiếp trung thực với khách hàng, kể cả khi tin xấu, là tốt hơn nhiều so với việc tô vẽ một bức tranh màu hồng nhưng không thực tế. Khách hàng thì có thể thất vọng với kết quả, nhưng họ sẽ tôn trọng sự trung thực của bạn.',
        'Một điều quan trọng khác là việc quản lý kỳ vọng. Ngay từ đầu, luật sư cần giúp khách hàng hiểu rõ tình hình pháp lý, các kịch bản có thể xảy ra và những gì họ có thể kỳ vọng. Điều này giúp tránh hiểu lầm và xây dựng mối quan hệ làm việc hiệu quả.',
        'Qua nhiều năm, tôi nhận ra rằng những khách hàng trung thành nhất không phải là những người tôi đã giúp họ thắng mọi vụ việc, mà là những người cảm nhận được sự chân thành và tận tâm của tôi. Đó mới là chìa khóa thực sự của lòng tin.',
        'Một luật sư xây dựng được lòng tin sẽ có nguồn giới thiệu khách hàng tự nhiên và bền vững. Đó là hình thức marketing hiệu quả nhất mà không cần chi phí quảng cáo.',
      ],
      relatedSlugs: ['tuong-lai-nghe-luat-viet-nam'],
    },
    en: {
      title: 'Building client trust - The key to success',
      date: '10/25/2023',
      content: [
        'In the legal profession, client trust is the most valuable asset. It determines career success and failure and is the foundation for building a sustainable personal brand.',
        'Trust doesn\'t come from fancy promises or large advertising campaigns. It comes from dedication in every matter, transparency in communication, and the tangible results you deliver to clients.',
        'I have always believed that honest communication with clients, even when delivering bad news, is far better than painting a rosy but unrealistic picture. Clients may be disappointed with outcomes, but they will respect your honesty.',
        'Another important aspect is expectation management. From the outset, lawyers need to help clients understand the legal situation clearly, possible scenarios, and what they can expect. This prevents misunderstandings and builds effective working relationships.',
        'Over many years, I\'ve realized that my most loyal clients are not those for whom I\'ve won every case, but those who felt my sincerity and dedication. That is the true key to trust.',
        'A lawyer who builds trust will develop a natural and sustainable client referral pipeline. That is the most effective form of marketing without any advertising costs.',
      ],
      relatedSlugs: ['future-legal-profession-vietnam'],
    },
  },
};

const viToEn: Record<string, string> = {
  'dao-duc-nghe-luat-su': 'legal-ethics-foundation',
  'luat-su-va-cong-ly-xa-hoi': 'lawyers-social-justice',
  'tuong-lai-nghe-luat-viet-nam': 'future-legal-profession-vietnam',
  'xay-dung-long-tin-khach-hang': 'building-client-trust',
};
const enToVi: Record<string, string> = Object.fromEntries(
  Object.entries(viToEn).map(([v, e]) => [e, v])
);

export function generateStaticParams() {
  return [
    ...Object.keys(viToEn).map((slug) => ({ locale: 'vi', slug })),
    ...Object.values(viToEn).map((slug) => ({ locale: 'en', slug })),
  ];
}

function getCanonicalSlug(slug: string): string {
  if (perspectivesData[slug]) return slug;
  return enToVi[slug] || slug;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const isVi = locale === 'vi';
  const canonical = getCanonicalSlug(slug);
  const data = perspectivesData[canonical];
  if (!data) return { title: 'Not Found' };

  const content = isVi ? data.vi : data.en;
  const heroImage = slugImageMap[canonical] || { src: IMAGES.detailHands.cdn, alt: IMAGES.detailHands.alt };

  return {
    title: `${content.title} | ${isVi ? 'Luật sư Võ Thiện Hiển' : 'Attorney Vo Thien Hien'}`,
    description: content.content[0].substring(0, 160),
    alternates: {
      canonical: isVi
        ? `/vi/quan-diem-nghe-luat/${canonical}`
        : `/en/professional-perspective/${viToEn[canonical] || slug}`,
      languages: {
        vi: `/vi/quan-diem-nghe-luat/${canonical}`,
        en: `/en/professional-perspective/${viToEn[canonical] || slug}`,
      },
    },
    openGraph: {
      images: [{ url: heroImage.src, width: 1200, height: 630 }],
    },
  };
}

export default async function PerspectiveDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const isVi = locale === 'vi';
  const canonical = getCanonicalSlug(slug);
  const data = perspectivesData[canonical];

  if (!data) notFound();

  const content = isVi ? data.vi : data.en;
  const heroImage = slugImageMap[canonical] || { src: IMAGES.detailHands.cdn, alt: IMAGES.detailHands.alt };

  const relatedPerspectives = content.relatedSlugs
    .map((rs) => {
      const rc = getCanonicalSlug(rs);
      const rd = perspectivesData[rc];
      if (!rd) return null;
      const rc2 = isVi ? rd.vi : rd.en;
      return { slug: isVi ? rc : viToEn[rc] || rs, ...rc2 };
    })
    .filter(Boolean);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: content.title,
      datePublished: content.date,
      image: heroImage.src,
      author: {
        '@type': 'Person',
        name: 'Vo Thien Hien',
        jobTitle: isVi ? 'Luật sư Thành viên Điều hành' : 'Managing Partner',
        url: 'https://vothienhien.com',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: isVi ? 'Trang chủ' : 'Home', item: `https://vothienhien.com/${locale}` },
        { '@type': 'ListItem', position: 2, name: isVi ? 'Quan điểm nghề luật' : 'Professional Perspective', item: `https://vothienhien.com/${locale}/${isVi ? 'quan-diem-nghe-luat' : 'professional-perspective'}` },
        { '@type': 'ListItem', position: 3, name: content.title },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero with Image */}
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
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <Link
            href="/quan-diem-nghe-luat"
            className="inline-flex items-center gap-2 text-accent text-sm uppercase tracking-wider mb-8 hover:text-accent-secondary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            {t('common.backTo')} {t('nav.perspectives')}
          </Link>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            {content.title}
          </h1>

          <span className="text-white/60 text-sm">{content.date}</span>

          <div className="flex justify-center mt-6">
            <GoldDivider width="w-24 mx-auto" />
          </div>
        </div>
      </section>

      {/* Author Bio with Photo */}
      <section className="bg-surface border-b border-border-gold/20">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-accent/30">
              <Image
                src={IMAGES.profileHero.cdn}
                alt={isVi ? 'Luật sư Võ Thiện Hiển' : 'Attorney Vo Thien Hien'}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="font-heading font-semibold text-primary text-lg">
                {isVi ? 'Luật sư Võ Thiện Hiển' : 'Attorney Vo Thien Hien'}
              </p>
              <p className="text-text-secondary text-sm mt-1">
                {isVi ? 'Luật sư Thành viên Điều hành - Apolo Lawyers' : 'Managing Partner - Apolo Lawyers'}
              </p>
              <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                {isVi
                  ? 'Hơn 15 năm kinh nghiệm hành nghề luật sư. Chuyên tư vấn dân sự, đất đai, doanh nghiệp và tranh tụng tại các cấp tòa án.'
                  : 'Over 15 years of legal practice experience. Specializing in civil, land, corporate advisory, and litigation at all court levels.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-6">
            {content.content.map((paragraph, i) => (
              <p key={i} className="text-text-secondary text-lg leading-relaxed italic first:text-xl first:not-italic first:text-text-primary first:font-light">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-border-gold/20">
            <p className="text-sm uppercase tracking-wider text-text-secondary font-medium mb-4">
              {t('common.share')}
            </p>
            <div className="flex gap-3">
              <button className="w-10 h-10 flex items-center justify-center border border-border-gold/30 text-text-secondary hover:border-accent hover:text-accent transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center border border-border-gold/30 text-text-secondary hover:border-accent hover:text-accent transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Author Bio Card */}
      <section className="py-16 bg-surface border-t border-border-gold/20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start gap-6 p-8 bg-background border border-border-gold/20">
            <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-accent/30">
              <Image
                src={IMAGES.profileHero.cdn}
                alt={isVi ? 'Luật sư Võ Thiện Hiển' : 'Attorney Vo Thien Hien'}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="font-heading font-semibold text-primary text-lg">
                {isVi ? 'Luật sư Võ Thiện Hiển' : 'Attorney Vo Thien Hien'}
              </p>
              <p className="text-accent text-sm font-medium mt-1">
                {isVi ? 'Luật sư Thành viên Điều hành - Apolo Lawyers' : 'Managing Partner - Apolo Lawyers'}
              </p>
              <p className="text-text-secondary text-sm mt-3 leading-relaxed">
                {isVi
                  ? 'Hơn 15 năm kinh nghiệm hành nghề luật sư. Chuyên tư vấn dân sự, đất đai, doanh nghiệp và tranh tụng tại các cấp tòa án. Luật sư Hiển đã xử lý thành công hàng trăm vụ việc trong nhiều lĩnh vực pháp lý khác nhau.'
                  : 'Over 15 years of legal practice experience. Specializing in civil, land, corporate advisory, and litigation at all court levels. Attorney Hien has successfully handled hundreds of matters across diverse legal domains.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related with Thumbnails */}
      {relatedPerspectives.length > 0 && (
        <section className="py-20 md:py-28 bg-background">
          <div className="max-w-3xl mx-auto px-6">
            <SectionHeading
              subtitle={isVi ? 'Đọc thêm' : 'Further Reading'}
              title={isVi ? 'Quan điểm liên quan' : 'Related Perspectives'}
            />
            <div className="mt-12 space-y-6">
              {relatedPerspectives.map((p) => {
                if (!p) return null;
                const relCanonical = getCanonicalSlug(p.slug);
                const relImage = slugImageMap[relCanonical] || { src: IMAGES.detailHands.cdn, alt: IMAGES.detailHands.alt };
                return (
                  <Link
                    key={p.slug}
                    href={{ pathname: '/quan-diem-nghe-luat/[slug]', params: { slug: p.slug } }}
                    className="group flex flex-col sm:flex-row gap-0 sm:gap-6 bg-surface border border-border-gold/20 hover:border-accent/50 transition-all duration-300 overflow-hidden"
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
                    <div className="p-6 sm:py-6 sm:pr-6 sm:pl-0">
                      <h3 className="text-lg font-heading font-semibold text-primary group-hover:text-accent transition-colors">
                        {p.title}
                      </h3>
                      <span className="text-xs text-text-secondary mt-2 block">{p.date}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
