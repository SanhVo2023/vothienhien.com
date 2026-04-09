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

interface ArticleData {
  title: string;
  category: string;
  date: string;
  content: string[];
  relatedSlugs: string[];
}

// Map slugs to hero images
const slugImageMap: Record<string, { src: string; alt: string }> = {
  'phan-tich-luat-dat-dai-2024': { src: IMAGES.practiceLand.cdn, alt: IMAGES.practiceLand.alt },
  'huong-dan-thanh-lap-doanh-nghiep': { src: IMAGES.practiceCorporate.cdn, alt: IMAGES.practiceCorporate.alt },
  'quyen-loi-nguoi-lao-dong-nghi-viec': { src: IMAGES.practiceLabor.cdn, alt: IMAGES.practiceLabor.alt },
  'binh-luan-an-le-tranh-chap-dat': { src: IMAGES.practiceLand.cdn, alt: IMAGES.practiceLand.alt },
  'huong-dan-ly-hon-thuan-tinh': { src: IMAGES.practiceFamily.cdn, alt: IMAGES.practiceFamily.alt },
  'binh-luan-sua-doi-luat-doanh-nghiep': { src: IMAGES.practiceCorporate.cdn, alt: IMAGES.practiceCorporate.alt },
};

// Thumbnails for related articles
const relatedThumbnails = [
  { src: IMAGES.detailHands.cdn, alt: IMAGES.detailHands.alt },
  { src: IMAGES.practiceCivil.cdn, alt: IMAGES.practiceCivil.alt },
  { src: IMAGES.bgSpeaking.cdn, alt: IMAGES.bgSpeaking.alt },
];

const articlesData: Record<string, { vi: ArticleData; en: ArticleData }> = {
  'phan-tich-luat-dat-dai-2024': {
    vi: {
      title: 'Phân tích những điểm mới của Luật Đất đai 2024',
      category: 'Phân tích',
      date: '15/03/2024',
      content: [
        'Luật Đất đai 2024 được Quốc hội thông qua ngày 18/01/2024 và sẽ có hiệu lực từ ngày 01/01/2025, thay thế Luật Đất đai 2013. Đây là một trong những văn bản pháp luật quan trọng nhất được sửa đổi trong năm 2024, ảnh hưởng trực tiếp đến quyền và lợi ích của hàng triệu người dân và doanh nghiệp.',
        'Một trong những thay đổi đáng chú ý nhất là việc bỏ bỏ giá đất do Nhà nước ban hành và chuyển sang cơ chế xác định giá đất theo giá thị trường. Điều này được kỳ vọng sẽ giải quyết vấn đề chênh lệch giá đất gây nhiều tranh cãi trong nhiều năm qua.',
        'Luật mới cũng mở rộng quyền của người sử dụng đất, cho phép người Việt Nam định cư ở nước ngoài có quyền sử dụng đất tương tự như công dân trong nước. Đây là bước tiến lớn trong việc đảm bảo quyền lợi cho kiều bào.',
        'Về thủ tục hành chính, Luật Đất đai 2024 hướng đến đơn giản hóa thủ tục cấp giấy chứng nhận quyền sử dụng đất, rút ngắn thời gian xử lý và tăng cường ứng dụng công nghệ thông tin trong quản lý đất đai.',
        'Tuy nhiên, việc triển khai Luật mới cũng đặt ra nhiều thách thức, đặc biệt là việc xây dựng cơ sở dữ liệu đất đai quốc gia, đào tạo nhân lực và ban hành các văn bản hướng dẫn chi tiết.',
        'Đối với doanh nghiệp, Luật Đất đai 2024 mang lại nhiều cơ hội mới trong việc tiếp cận quỹ đất, đồng thời cũng yêu cầu các doanh nghiệp phải chủ động cập nhật và tuân thủ các quy định mới để tránh rủi ro pháp lý.',
        'Người dân và doanh nghiệp nên chủ động tìm hiểu các quy định mới và tham vấn luật sư chuyên môn để bảo vệ quyền lợi hợp pháp của mình trong bối cảnh chuyển đổi pháp luật.',
      ],
      relatedSlugs: ['binh-luan-an-le-tranh-chap-dat'],
    },
    en: {
      title: 'Analysis of Key Changes in Vietnam Land Law 2024',
      category: 'Analysis',
      date: '03/15/2024',
      content: [
        'The 2024 Land Law was approved by the National Assembly on January 18, 2024, and will take effect from January 1, 2025, replacing the 2013 Land Law. This is one of the most significant pieces of legislation amended in 2024, directly affecting the rights and interests of millions of citizens and businesses.',
        'One of the most notable changes is the elimination of state-issued land price tables in favor of market-based land pricing mechanisms. This is expected to resolve the long-controversial issue of land price discrepancies.',
        'The new law also expands the rights of land users, allowing overseas Vietnamese to have land use rights similar to domestic citizens. This represents a major step forward in protecting the interests of the Vietnamese diaspora.',
        'Regarding administrative procedures, the 2024 Land Law aims to simplify land use right certificate issuance procedures, shorten processing times, and enhance the application of information technology in land management.',
        'However, implementing the new Law also poses many challenges, particularly in building a national land database, training personnel, and issuing detailed guidance documents.',
        'For businesses, the 2024 Land Law brings new opportunities in accessing land resources, while also requiring enterprises to proactively update and comply with new regulations to avoid legal risks.',
        'Citizens and businesses should proactively familiarize themselves with the new regulations and consult specialized attorneys to protect their legitimate interests during this legal transition.',
      ],
      relatedSlugs: ['commentary-land-dispute-precedent'],
    },
  },
  'huong-dan-thanh-lap-doanh-nghiep': {
    vi: {
      title: 'Hướng dẫn thủ tục thành lập doanh nghiệp tại Việt Nam 2024',
      category: 'Hướng dẫn',
      date: '28/02/2024',
      content: [
        'Thành lập doanh nghiệp tại Việt Nam là bước đầu tiên và quan trọng nhất trên hành trình kinh doanh. Bài viết này cung cấp hướng dẫn chi tiết về các bước và thủ tục cần thiết, giúp bạn chuẩn bị tốt nhất cho quá trình đăng ký kinh doanh.',
        'Bước 1: Lựa chọn loại hình doanh nghiệp phù hợp. Pháp luật Việt Nam công nhận nhiều loại hình doanh nghiệp: Công ty TNHH một thành viên, Công ty TNHH hai thành viên trở lên, Công ty cổ phần, Công ty hợp danh và Doanh nghiệp tư nhân. Mỗi loại hình có ưu và nhược điểm riêng.',
        'Bước 2: Chuẩn bị hồ sơ đăng ký doanh nghiệp bao gồm: Giấy đề nghị đăng ký doanh nghiệp, Điều lệ công ty, Danh sách thành viên/cổ đông sáng lập, Bản sao CMND/CCCD của các thành viên.',
        'Bước 3: Nộp hồ sơ tại Sở Kế hoạch và Đầu tư nơi doanh nghiệp đặt trụ sở chính. Thời gian xử lý thông thường là 3-5 ngày làm việc.',
        'Sau khi được cấp Giấy chứng nhận đăng ký doanh nghiệp, doanh nghiệp cần thực hiện các bước tiếp theo: khắc con dấu, đăng ký mã số thuế, mở tài khoản ngân hàng, và đăng ký lao động.',
        'Đối với nhà đầu tư nước ngoài, quy trình thành lập doanh nghiệp có thêm bước xin Giấy chứng nhận đăng ký đầu tư tại Sở Kế hoạch và Đầu tư hoặc Ban Quản lý Khu công nghiệp, tùy thuộc vào lĩnh vực đầu tư.',
        'Việc lựa chọn đúng loại hình doanh nghiệp và chuẩn bị hồ sơ chính xác ngay từ đầu sẽ giúp tiết kiệm thời gian và chi phí, đồng thời tránh các rủi ro pháp lý trong quá trình hoạt động.',
      ],
      relatedSlugs: ['binh-luan-sua-doi-luat-doanh-nghiep'],
    },
    en: {
      title: 'Guide to Business Formation in Vietnam 2024',
      category: 'Guide',
      date: '02/28/2024',
      content: [
        'Establishing a business in Vietnam is the first and most important step on any business journey. This article provides a detailed guide on the necessary steps and procedures, helping you best prepare for the business registration process.',
        'Step 1: Choose the appropriate business entity type. Vietnamese law recognizes several entity types: Single-member LLC, Multi-member LLC, Joint-stock Company, Partnership, and Sole Proprietorship. Each type has its own advantages and disadvantages.',
        'Step 2: Prepare business registration documents including: Business Registration Application, Company Charter, List of founding members/shareholders, and copies of members\' identification documents.',
        'Step 3: Submit documents at the Department of Planning and Investment where the business will be headquartered. Standard processing time is 3-5 business days.',
        'After receiving the Business Registration Certificate, the company needs to complete subsequent steps: seal engraving, tax code registration, bank account opening, and labor registration.',
        'For foreign investors, the establishment process includes an additional step of obtaining an Investment Registration Certificate from the Department of Planning and Investment or Industrial Zone Management Board, depending on the investment sector.',
        'Selecting the right entity type and preparing accurate documentation from the outset will save time and costs while avoiding legal risks during business operations.',
      ],
      relatedSlugs: ['commentary-enterprise-law-amendments'],
    },
  },
  'quyen-loi-nguoi-lao-dong-nghi-viec': {
    vi: {
      title: 'Quyền lợi của người lao động khi bị đơn phương chấm dứt hợp đồng',
      category: 'Phân tích',
      date: '10/01/2024',
      content: [
        'Đơn phương chấm dứt hợp đồng lao động là một trong những vấn đề pháp lý phổ biến nhất trong quan hệ lao động. Bài viết phân tích các quyền lợi mà người lao động được bảo vệ theo Bộ luật Lao động 2019.',
        'Theo Điều 41 Bộ luật Lao động 2019, khi người sử dụng lao động đơn phương chấm dứt hợp đồng lao động trái pháp luật, người lao động có quyền yêu cầu: nhận lại làm việc theo hợp đồng, bồi thường thiệt hại và trả tiền lương cho những ngày không được làm việc.',
        'Mức bồi thường theo quy định là ít nhất 2 tháng tiền lương theo hợp đồng lao động. Ngoài ra, người lao động còn được trả trợ cấp thôi việc hoặc trợ cấp mất việc làm tùy trường hợp.',
        'Người lao động có thể khiếu nại tại công đoàn cơ sở, yêu cầu hòa giải tại hội đồng hòa giải lao động, hoặc khởi kiện tại tòa án nhân dân. Thời hiệu khởi kiện là 1 năm kể từ ngày bị chấm dứt hợp đồng.',
        'Để bảo vệ quyền lợi tốt nhất, người lao động nên lưu giữ bản sao hợp đồng lao động, phiếu lương, và các bằng chứng liên quan đến việc bị chấm dứt hợp đồng.',
        'Trong trường hợp người lao động không muốn quay lại làm việc, họ vẫn có quyền yêu cầu bồi thường thiệt hại bằng tiền, bao gồm tiền lương, trợ cấp thôi việc và các khoản bồi thường khác theo quy định pháp luật.',
      ],
      relatedSlugs: ['phan-tich-luat-dat-dai-2024'],
    },
    en: {
      title: 'Employee Rights Upon Unlawful Contract Termination',
      category: 'Analysis',
      date: '01/10/2024',
      content: [
        'Unilateral employment contract termination is one of the most common legal issues in labor relations. This article analyzes employee rights protected under the 2019 Labor Code.',
        'According to Article 41 of the 2019 Labor Code, when an employer unlawfully terminates an employment contract, the employee has the right to demand: reinstatement according to the contract, damages compensation, and payment of wages for days not worked.',
        'The statutory compensation is at least 2 months\' salary under the employment contract. Additionally, the employee may receive severance or job loss allowances depending on the circumstances.',
        'Employees may file complaints with the grassroots trade union, request mediation at the labor mediation council, or file suit at the people\'s court. The statute of limitations for claims is 1 year from the date of termination.',
        'To best protect their rights, employees should retain copies of employment contracts, pay slips, and all evidence related to the termination.',
        'In cases where employees do not wish to return to work, they still have the right to claim monetary compensation, including wages, severance pay, and other statutory compensation amounts.',
      ],
      relatedSlugs: ['analysis-land-law-2024'],
    },
  },
  'binh-luan-an-le-tranh-chap-dat': {
    vi: {
      title: 'Bình luận án lệ về tranh chấp quyền sử dụng đất',
      category: 'Bình luận',
      date: '20/12/2023',
      content: [
        'Án lệ số 52/2022/AL được Hội đồng Thẩm phán Tòa án nhân dân tối cao công bố liên quan đến tranh chấp quyền sử dụng đất giữa các hộ gia đình là một tiền lệ quan trọng trong thực tiễn xét xử.',
        'Nội dung vụ án: Hai hộ gia đình tranh chấp một thửa đất được truyền từ đời ông bà. Bên nguyên cho rằng họ có quyền sử dụng đất theo di chúc miệng của ông nội. Bên bị cho rằng đất đã được chia trước đó và họ đã canh tác liên tục trên 30 năm.',
        'Tòa án tối cao đã xác định rằng: trong trường hợp không có di chúc bằng văn bản và việc canh tác liên tục trên 30 năm không bị tranh chấp, quyền sử dụng đất được công nhận cho bên đã canh tác. Đây là tiền lệ quan trọng cho các vụ tương tự.',
        'Án lệ này có ý nghĩa thực tiễn lớn, đặc biệt tại các vùng nông thôn nơi việc chuyển nhượng đất đai thường được thực hiện theo tập quán địa phương mà không có văn bản pháp lý chính thức.',
        'Các luật sư cần lưu ý án lệ này khi tư vấn cho khách hàng về tranh chấp đất đai ở khu vực nông thôn, đặc biệt liên quan đến đất thừa kế nhiều đời.',
        'Án lệ này cũng đặt ra câu hỏi quan trọng về mối quan hệ giữa quyền sử dụng đất theo pháp luật và quyền sử dụng đất theo tập quán, một vấn đề cần tiếp tục nghiên cứu và hoàn thiện trong hệ thống pháp luật.',
      ],
      relatedSlugs: ['phan-tich-luat-dat-dai-2024'],
    },
    en: {
      title: 'Commentary on Land Use Rights Dispute Precedent',
      category: 'Commentary',
      date: '12/20/2023',
      content: [
        'Precedent No. 52/2022/AL published by the Judicial Council of the Supreme People\'s Court regarding land use rights disputes between households is an important precedent in judicial practice.',
        'Case facts: Two households disputed a land parcel passed down from grandparents. The plaintiff claimed land use rights based on the grandfather\'s oral will. The defendant argued the land had been previously divided and they had continuously cultivated it for over 30 years.',
        'The Supreme Court determined that: in the absence of a written will and with over 30 years of uncontested continuous cultivation, land use rights are recognized for the cultivating party. This is an important precedent for similar cases.',
        'This precedent has significant practical implications, particularly in rural areas where land transfers are often conducted according to local customs without formal legal documentation.',
        'Attorneys should note this precedent when advising clients on rural land disputes, especially those involving multi-generational inherited land.',
        'This precedent also raises important questions about the relationship between statutory land use rights and customary land use rights, an issue requiring continued research and refinement within the legal system.',
      ],
      relatedSlugs: ['analysis-land-law-2024'],
    },
  },
  'huong-dan-ly-hon-thuan-tinh': {
    vi: {
      title: 'Hướng dẫn thủ tục ly hôn thuận tình tại Việt Nam',
      category: 'Hướng dẫn',
      date: '05/11/2023',
      content: [
        'Ly hôn thuận tình là trường hợp vợ chồng cùng đồng ý ly hôn và đã thỏa thuận được với nhau về phân chia tài sản, quyền nuôi con và các vấn đề liên quan. Đây là hình thức ly hôn đơn giản và nhanh chóng nhất.',
        'Hồ sơ ly hôn thuận tình bao gồm: Đơn yêu cầu công nhận thuận tình ly hôn, Giấy đăng ký kết hôn (bản chính), CMND/CCCD của cả hai bên, Sổ hộ khẩu, Giấy khai sinh của con (nếu có), Thỏa thuận phân chia tài sản và nuôi con.',
        'Thủ tục: Nộp hồ sơ tại Tòa án nhân dân cấp huyện nơi vợ hoặc chồng cư trú. Trong thời hạn 15 ngày, Tòa án sẽ thụ lý vụ án. Sau đó, Tòa án sẽ tiến hành hòa giải. Nếu hòa giải không thành và hai bên vẫn đồng ý ly hôn, Tòa sẽ mở phiên họp công nhận thuận tình ly hôn.',
        'Thời gian giải quyết: Thông thường từ 1-3 tháng. Án phí ly hôn thuận tình là 300.000 đồng.',
        'Lưu ý: Mặc dù là ly hôn thuận tình, các bên nên cân nhắc kỹ các thỏa thuận về tài sản và quyền nuôi con để tránh tranh chấp sau này. Tư vấn với luật sư trước khi ký là điều nên làm.',
        'Trong trường hợp có con chung dưới 36 tháng tuổi, quyền nuôi con thường được giao cho mẹ trừ khi mẹ không đủ điều kiện chăm sóc. Quyền thăm nom của bên còn lại cần được quy định rõ ràng trong thỏa thuận.',
      ],
      relatedSlugs: ['quyen-loi-nguoi-lao-dong-nghi-viec'],
    },
    en: {
      title: 'Guide to Consensual Divorce Procedures in Vietnam',
      category: 'Guide',
      date: '11/05/2023',
      content: [
        'Consensual divorce is when both spouses agree to divorce and have reached agreements on asset division, child custody, and related matters. This is the simplest and fastest form of divorce.',
        'Consensual divorce documents include: Application for recognition of consensual divorce, Marriage Registration Certificate (original), ID cards of both parties, Household Registration Book, Children\'s birth certificates (if applicable), and Asset division and custody agreement.',
        'Procedure: Submit documents at the District People\'s Court where either spouse resides. Within 15 days, the Court will accept the case. The Court then conducts mediation. If mediation fails and both parties still agree to divorce, the Court holds a session to recognize the consensual divorce.',
        'Processing time: Typically 1-3 months. The court fee for consensual divorce is VND 300,000.',
        'Note: Even in consensual divorce, parties should carefully consider asset and custody agreements to avoid future disputes. Consulting with an attorney before signing is advisable.',
        'In cases involving children under 36 months of age, custody is generally granted to the mother unless she is unable to provide adequate care. Visitation rights for the non-custodial parent should be clearly stipulated in the agreement.',
      ],
      relatedSlugs: ['employee-rights-termination'],
    },
  },
  'binh-luan-sua-doi-luat-doanh-nghiep': {
    vi: {
      title: 'Bình luận về dự thảo sửa đổi Luật Doanh nghiệp',
      category: 'Bình luận',
      date: '18/10/2023',
      content: [
        'Dự thảo Luật Doanh nghiệp (sửa đổi) đang được Bộ Kế hoạch và Đầu tư lấy ý kiến rộng rãi trước khi trình Quốc hội. Bài viết tập trung bình luận các thay đổi quan trọng liên quan đến quản trị công ty.',
        'Điểm mới đáng chú ý nhất là việc nâng cao vai trò của Ban Kiểm soát trong công ty cổ phần. Dự thảo quy định rõ ràng hơn về quyền và nghĩa vụ của thành viên Ban Kiểm soát, đồng thời yêu cầu tăng cường tính độc lập của cơ quan này.',
        'Về thành viên độc lập Hội đồng Quản trị, dự thảo bổ sung quy định về tiêu chuẩn, quyền hạn và trách nhiệm của thành viên độc lập, hướng tới chuẩn mực quản trị quốc tế.',
        'Dự thảo cũng đề xuất đơn giản hóa thủ tục đăng ký thay đổi nội dung đăng ký doanh nghiệp, cho phép thực hiện trực tuyến hoàn toàn nhiều thủ tục hành chính.',
        'Tuy nhiên, một số quy định trong dự thảo còn chưa rõ ràng và có thể gây khó khăn trong thực tiễn áp dụng. Cần có hướng dẫn cụ thể hơn từ cơ quan quản lý nhà nước.',
        'Nhìn chung, dự thảo sửa đổi thể hiện nỗ lực đáng ghi nhận trong việc hoàn thiện khung pháp lý cho quản trị doanh nghiệp, hướng đến minh bạch và bảo vệ quyền lợi cổ đông thiểu số.',
      ],
      relatedSlugs: ['huong-dan-thanh-lap-doanh-nghiep'],
    },
    en: {
      title: 'Commentary on Draft Enterprise Law Amendments',
      category: 'Commentary',
      date: '10/18/2023',
      content: [
        'The Draft Enterprise Law (amended) is being publicly consulted by the Ministry of Planning and Investment before submission to the National Assembly. This article focuses on key changes regarding corporate governance.',
        'The most notable amendment is the enhanced role of the Supervisory Board in joint-stock companies. The draft more clearly defines the rights and obligations of Supervisory Board members while requiring increased independence of this body.',
        'Regarding independent Board of Directors members, the draft supplements provisions on qualifications, authority, and responsibilities of independent members, moving toward international governance standards.',
        'The draft also proposes simplifying procedures for registering changes in business registration content, allowing fully online processing of many administrative procedures.',
        'However, some provisions in the draft remain unclear and may cause practical implementation difficulties. More specific guidance from state management agencies is needed.',
        'Overall, the draft amendments represent commendable efforts to improve the legal framework for corporate governance, moving toward transparency and protecting minority shareholder rights.',
      ],
      relatedSlugs: ['guide-business-formation-vietnam'],
    },
  },
};

const viToEn: Record<string, string> = {
  'phan-tich-luat-dat-dai-2024': 'analysis-land-law-2024',
  'huong-dan-thanh-lap-doanh-nghiep': 'guide-business-formation-vietnam',
  'quyen-loi-nguoi-lao-dong-nghi-viec': 'employee-rights-termination',
  'binh-luan-an-le-tranh-chap-dat': 'commentary-land-dispute-precedent',
  'huong-dan-ly-hon-thuan-tinh': 'guide-consensual-divorce-vietnam',
  'binh-luan-sua-doi-luat-doanh-nghiep': 'commentary-enterprise-law-amendments',
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
  if (articlesData[slug]) return slug;
  return enToVi[slug] || slug;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const isVi = locale === 'vi';
  const canonical = getCanonicalSlug(slug);
  const data = articlesData[canonical];
  if (!data) return { title: 'Not Found' };

  const content = isVi ? data.vi : data.en;
  const heroImage = slugImageMap[canonical] || { src: IMAGES.detailHands.cdn, alt: IMAGES.detailHands.alt };

  return {
    title: `${content.title} | ${isVi ? 'Luật sư Võ Thiện Hiển' : 'Attorney Vo Thien Hien'}`,
    description: content.content[0].substring(0, 160),
    alternates: {
      canonical: isVi
        ? `/vi/bai-viet-chuyen-mon/${canonical}`
        : `/en/legal-insights/${viToEn[canonical] || slug}`,
      languages: {
        vi: `/vi/bai-viet-chuyen-mon/${canonical}`,
        en: `/en/legal-insights/${viToEn[canonical] || slug}`,
      },
    },
    openGraph: {
      images: [{ url: heroImage.src, width: 1200, height: 630 }],
    },
  };
}

export default async function PublicationDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const isVi = locale === 'vi';
  const canonical = getCanonicalSlug(slug);
  const data = articlesData[canonical];

  if (!data) notFound();

  const content = isVi ? data.vi : data.en;
  const heroImage = slugImageMap[canonical] || { src: IMAGES.detailHands.cdn, alt: IMAGES.detailHands.alt };

  const relatedArticles = content.relatedSlugs
    .map((rs) => {
      const rc = getCanonicalSlug(rs);
      const rd = articlesData[rc];
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
      publisher: {
        '@type': 'Organization',
        name: 'Apolo Lawyers',
        url: 'https://apololawyers.com',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: isVi ? 'Trang chủ' : 'Home', item: `https://vothienhien.com/${locale}` },
        { '@type': 'ListItem', position: 2, name: isVi ? 'Bài viết chuyên môn' : 'Legal Insights', item: `https://vothienhien.com/${locale}/${isVi ? 'bai-viet-chuyen-mon' : 'legal-insights'}` },
        { '@type': 'ListItem', position: 3, name: content.title },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero with Article Image */}
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
            href="/bai-viet-chuyen-mon"
            className="inline-flex items-center gap-2 text-accent text-sm uppercase tracking-wider mb-8 hover:text-accent-secondary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            {t('common.backTo')} {t('nav.publications')}
          </Link>

          <span className="inline-block text-xs uppercase tracking-wider text-accent font-medium bg-accent/10 px-3 py-1 mb-4">
            {content.category}
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            {content.title}
          </h1>

          <div className="flex items-center justify-center gap-4 mt-6 text-white/60 text-sm">
            <span>{content.date}</span>
            <span className="w-1 h-1 bg-accent rounded-full" />
            <span>{isVi ? 'Luật sư Võ Thiện Hiển' : 'Attorney Vo Thien Hien'}</span>
          </div>

          <div className="flex justify-center mt-6">
            <GoldDivider width="w-24 mx-auto" />
          </div>
        </div>
      </section>

      {/* Author Info with Photo */}
      <section className="bg-surface border-b border-border-gold/20">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-accent/30">
              <Image
                src={IMAGES.profileHero.cdn}
                alt={isVi ? 'Luật sư Võ Thiện Hiển' : 'Attorney Vo Thien Hien'}
                width={56}
                height={56}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="font-heading font-semibold text-primary">
                {isVi ? 'Luật sư Võ Thiện Hiển' : 'Attorney Vo Thien Hien'}
              </p>
              <p className="text-text-secondary text-sm">
                {isVi ? 'Luật sư Thành viên Điều hành - Apolo Lawyers' : 'Managing Partner - Apolo Lawyers'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            {content.content.map((paragraph, i) => (
              <p key={i} className="text-text-secondary leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Share buttons placeholder */}
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
              <button className="w-10 h-10 flex items-center justify-center border border-border-gold/30 text-text-secondary hover:border-accent hover:text-accent transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M0 12c0 4.418 3.582 8 8 8h.5v-3h-.5c-2.761 0-5-2.239-5-5s2.239-5 5-5h5v-3h-5c-4.418 0-8 3.582-8 8zm11-4v8h2v-8h3l-4-4-4 4h3z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Author Bio Section */}
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

      {/* Related Articles with Thumbnails */}
      {relatedArticles.length > 0 && (
        <section className="py-20 md:py-28 bg-background">
          <div className="max-w-3xl mx-auto px-6">
            <SectionHeading
              subtitle={isVi ? 'Đọc thêm' : 'Further Reading'}
              title={isVi ? 'Bài viết liên quan' : 'Related Articles'}
            />
            <div className="mt-12 space-y-6">
              {relatedArticles.map((article, index) => {
                if (!article) return null;
                const relThumb = relatedThumbnails[index % relatedThumbnails.length];
                const relCanonical = getCanonicalSlug(article.slug);
                const relImage = slugImageMap[relCanonical] || relThumb;
                return (
                  <Link
                    key={article.slug}
                    href={{ pathname: '/bai-viet-chuyen-mon/[slug]', params: { slug: article.slug } }}
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
                      <span className="inline-block text-xs uppercase tracking-wider text-accent font-medium bg-accent/10 px-3 py-1 mb-3">
                        {article.category}
                      </span>
                      <h3 className="text-lg font-heading font-semibold text-primary group-hover:text-accent transition-colors">
                        {article.title}
                      </h3>
                      <span className="text-xs text-text-secondary mt-2 block">{article.date}</span>
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
