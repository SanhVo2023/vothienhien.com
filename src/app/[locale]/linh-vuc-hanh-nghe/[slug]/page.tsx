import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';
import JsonLd from '@/components/JsonLd';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import Button from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';

const slugToImage: Record<string, { cdn: string; alt: string }> = {
  'tranh-chap-dan-su': IMAGES.practiceCivil,
  'tranh-chap-dat-dai': IMAGES.practiceLand,
  'hon-nhan-gia-dinh': IMAGES.practiceFamily,
  'luat-doanh-nghiep': IMAGES.practiceCorporate,
  'tranh-chap-lao-dong': IMAGES.practiceLabor,
  'luat-hinh-su': IMAGES.practiceCriminal,
};

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const slugMap: Record<string, string> = {
  'tranh-chap-dan-su': 'civil-disputes',
  'tranh-chap-dat-dai': 'land-disputes',
  'hon-nhan-gia-dinh': 'family-law',
  'luat-doanh-nghiep': 'corporate-law',
  'tranh-chap-lao-dong': 'labor-disputes',
  'luat-hinh-su': 'criminal-defense',
  'civil-disputes': 'tranh-chap-dan-su',
  'land-disputes': 'tranh-chap-dat-dai',
  'family-law': 'hon-nhan-gia-dinh',
  'corporate-law': 'luat-doanh-nghiep',
  'labor-disputes': 'tranh-chap-lao-dong',
  'criminal-defense': 'luat-hinh-su',
};

interface PracticeAreaData {
  title: string;
  subtitle: string;
  description: string[];
  approaches: string[];
  matters: { title: string; year: string; excerpt: string }[];
  stats: { value: string; label: string }[];
  whyChoose: { title: string; description: string }[];
}

const practiceAreaData: Record<string, { vi: PracticeAreaData; en: PracticeAreaData }> = {
  'tranh-chap-dan-su': {
    vi: {
      title: 'Tranh Chấp Dân Sự',
      subtitle: 'Bảo vệ quyền và lợi ích hợp pháp',
      description: [
        'Lĩnh vực tranh chấp dân sự là một trong những thế mạnh cốt lõi của Luật sư Võ Thiện Hiển. Với hơn 15 năm kinh nghiệm hành nghề tại Thành phố Hồ Chí Minh và các tỉnh phía Nam, ông đã thành công đại diện cho hàng trăm khách hàng trong các vụ tranh chấp dân sự phức tạp tại các cấp tòa án từ cấp huyện đến Tòa án Nhân dân Tối cao. Sự am hiểu sâu sắc về Bộ luật Dân sự 2015, Bộ luật Tố tụng Dân sự 2015 và các văn bản hướng dẫn thi hành giúp ông xử lý mọi tình huống pháp lý một cách hiệu quả.',
        'Trong bối cảnh pháp luật Việt Nam, tranh chấp dân sự bao gồm phạm vi rộng lớn các quan hệ pháp luật. Các loại tranh chấp phổ biến nhất bao gồm: tranh chấp hợp đồng mua bán, cho thuê, vay mượn; bồi thường thiệt hại ngoài hợp đồng; tranh chấp quyền sở hữu tài sản và quyền sử dụng tài sản; tranh chấp thừa kế theo di chúc và theo pháp luật; tranh chấp liên quan đến quyền nhân thân; và các quan hệ dân sự khác được điều chỉnh bởi Bộ luật Dân sự.',
        'Các quy định pháp luật chính điều chỉnh lĩnh vực này bao gồm Bộ luật Dân sự 2015 (Luật số 91/2015/QH13), Bộ luật Tố tụng Dân sự 2015 (Luật số 92/2015/QH13), Luật Thi hành án Dân sự 2008 (sửa đổi, bổ sung 2014), cùng hàng loạt nghị định, thông tư và nghị quyết hướng dẫn của Hội đồng Thẩm phán Tòa án Nhân dân Tối cao. Luật sư Hiển luôn cập nhật kịp thời mọi thay đổi của pháp luật để đảm bảo tư vấn chính xác nhất.',
        'Trong thực tiễn hành nghề, Luật sư Hiển thường gặp các tình huống tranh chấp điển hình như: hợp đồng mua bán bất động sản bị vi phạm về giá cả hoặc tiến độ bàn giao; tranh chấp đặt cọc khi giao dịch bất thành; yêu cầu bồi thường do hành vi gây thiệt hại; phân chia di sản thừa kế giữa nhiều đồng thừa kế có mâu thuẫn; và tranh chấp quyền sở hữu trí tuệ trong lĩnh vực dân sự.',
        'Khách hàng lựa chọn Luật sư Võ Thiện Hiển bởi sự kết hợp giữa kiến thức pháp luật vững chắc, kinh nghiệm thực tiễn phong phú và khả năng phân tích chiến lược cao. Ông không chỉ đơn thuần tư vấn pháp luật mà còn đồng hành cùng khách hàng trong suốt quá trình giải quyết tranh chấp, từ bước đánh giá ban đầu đến khi đạt được kết quả cuối cùng. Phong cách làm việc chuyên nghiệp, tận tâm và minh bạch đã tạo nên uy tín vững chắc trong cộng đồng pháp lý.',
        'Với phương pháp tiếp cận toàn diện, Luật sư Hiển áp dụng linh hoạt giữa thương lượng hòa giải và tranh tụng tại tòa án để đạt được kết quả tối ưu cho khách hàng. Ông luôn ưu tiên giải pháp ngoài tòa án khi có thể, nhằm tiết kiệm thời gian và chi phí cho khách hàng, nhưng sẵn sàng tranh tụng quyết liệt khi quyền lợi của khách hàng bị xâm phạm.',
        'Quy trình giải quyết tranh chấp dân sự thường bao gồm: giai đoạn tư vấn và đánh giá ban đầu (1-2 tuần), giai đoạn thu thập chứng cứ và chuẩn bị hồ sơ (2-4 tuần), giai đoạn thương lượng hòa giải (1-3 tháng), và nếu cần thiết, giai đoạn tố tụng tại tòa án (6-18 tháng tùy tính chất vụ việc). Luật sư Hiển cam kết thông báo tiến độ thường xuyên và giữ liên lạc chặt chẽ với khách hàng trong suốt quá trình.',
      ],
      approaches: [
        'Phân tích pháp lý toàn diện và đánh giá rủi ro',
        'Ưu tiên thương lượng hòa giải để tiết kiệm thời gian và chi phí',
        'Chuẩn bị hồ sơ tranh tụng chuyên nghiệp và đầy đủ',
        'Theo dõi và cập nhật tiến độ vụ việc liên tục',
        'Đảm bảo thi hành án hiệu quả sau khi có bản án',
      ],
      matters: [
        { title: 'Tranh chấp hợp đồng mua bán bất động sản trị giá 50 tỷ đồng', year: '2023', excerpt: 'Đại diện bên mua trong tranh chấp hợp đồng mua bán bất động sản, thành công bảo vệ toàn bộ quyền lợi khách hàng.' },
        { title: 'Vụ tranh chấp thừa kế tài sản gia đình', year: '2022', excerpt: 'Giải quyết thành công tranh chấp thừa kế liên quan đến nhiều bên, đảm bảo phân chia tài sản công bằng.' },
      ],
      stats: [
        { value: '200+', label: 'Vụ việc dân sự đã giải quyết' },
        { value: '95%', label: 'Tỷ lệ thành công' },
        { value: '15+', label: 'Năm kinh nghiệm' },
        { value: '50 tỷ+', label: 'Giá trị tranh chấp lớn nhất' },
      ],
      whyChoose: [
        { title: 'Kinh nghiệm thực chiến phong phú', description: 'Hơn 200 vụ tranh chấp dân sự đã được giải quyết thành công tại mọi cấp tòa án, từ sơ thẩm đến giám đốc thẩm.' },
        { title: 'Am hiểu sâu hệ thống pháp luật', description: 'Luôn cập nhật các văn bản pháp luật mới nhất, nghị quyết hướng dẫn và án lệ để áp dụng chính xác cho từng vụ việc.' },
        { title: 'Chiến lược linh hoạt và hiệu quả', description: 'Kết hợp nhuần nhuyễn giữa thương lượng, hòa giải và tranh tụng để đạt kết quả tối ưu với chi phí hợp lý nhất.' },
        { title: 'Cam kết minh bạch và tận tâm', description: 'Thông báo tiến độ thường xuyên, giải thích rõ ràng mọi phương án và rủi ro, luôn đặt quyền lợi khách hàng lên hàng đầu.' },
      ],
    },
    en: {
      title: 'Civil Disputes',
      subtitle: 'Protecting rights and legitimate interests',
      description: [
        'Civil dispute resolution is one of Attorney Vo Thien Hien\'s core strengths. With over 15 years of practice in Ho Chi Minh City and the southern provinces, he has successfully represented hundreds of clients in complex civil disputes across all court levels, from district courts to the Supreme People\'s Court. His deep understanding of the 2015 Civil Code, the 2015 Civil Procedure Code, and related implementing regulations enables him to handle any legal situation effectively.',
        'Under Vietnamese law, civil disputes encompass a broad range of legal relationships. The most common types include: sale, lease, and loan contract disputes; non-contractual tort damages; property ownership and usage rights disputes; testamentary and statutory inheritance disputes; personal rights disputes; and other civil relationships governed by the Civil Code.',
        'Key regulations governing this area include the 2015 Civil Code (Law No. 91/2015/QH13), the 2015 Civil Procedure Code (Law No. 92/2015/QH13), the 2008 Civil Judgment Enforcement Law (amended 2014), along with numerous decrees, circulars, and guiding resolutions of the Judicial Council of the Supreme People\'s Court. Attorney Hien stays current with all legislative changes to ensure the most accurate counsel.',
        'In practice, Attorney Hien frequently encounters typical dispute scenarios such as: real estate purchase contracts breached on pricing or handover timelines; deposit disputes when transactions fall through; damage compensation claims; estate division among multiple conflicting co-heirs; and intellectual property disputes in the civil domain.',
        'Clients choose Attorney Vo Thien Hien for his combination of solid legal knowledge, rich practical experience, and strong strategic analysis capabilities. He does not merely provide legal advice but accompanies clients throughout the entire dispute resolution process, from initial assessment to achieving final outcomes. His professional, dedicated, and transparent working style has built a strong reputation in the legal community.',
        'With his comprehensive approach, Attorney Hien flexibly applies negotiation, mediation, and court litigation to achieve optimal results for clients. He prioritizes out-of-court solutions when possible to save clients time and costs, but is prepared to litigate aggressively when client rights are infringed.',
        'The civil dispute resolution process typically includes: initial consultation and assessment phase (1-2 weeks), evidence collection and file preparation phase (2-4 weeks), negotiation and mediation phase (1-3 months), and if necessary, court proceedings phase (6-18 months depending on case complexity). Attorney Hien commits to regular progress updates and maintaining close contact with clients throughout the process.',
      ],
      approaches: [
        'Comprehensive legal analysis and risk assessment',
        'Prioritizing negotiation and mediation to save time and costs',
        'Professional and thorough litigation file preparation',
        'Continuous case progress monitoring and updates',
        'Ensuring effective judgment enforcement',
      ],
      matters: [
        { title: 'Real estate purchase contract dispute valued at VND 50 billion', year: '2023', excerpt: 'Represented the buyer in a real estate purchase contract dispute, successfully protecting all client interests.' },
        { title: 'Family inheritance dispute', year: '2022', excerpt: 'Successfully resolved a multi-party inheritance dispute, ensuring fair asset distribution.' },
      ],
      stats: [
        { value: '200+', label: 'Civil Cases Resolved' },
        { value: '95%', label: 'Success Rate' },
        { value: '15+', label: 'Years of Experience' },
        { value: 'VND 50B+', label: 'Largest Dispute Value' },
      ],
      whyChoose: [
        { title: 'Extensive Practical Experience', description: 'Over 200 civil disputes successfully resolved across all court levels, from first instance to cassation review.' },
        { title: 'Deep Legal System Knowledge', description: 'Continuously updated on the latest legislation, guiding resolutions, and case precedents for precise application to each case.' },
        { title: 'Flexible and Effective Strategy', description: 'Seamlessly combining negotiation, mediation, and litigation to achieve optimal results at the most reasonable cost.' },
        { title: 'Transparent and Dedicated Commitment', description: 'Regular progress updates, clear explanation of all options and risks, always placing client interests first.' },
      ],
    },
  },
  'tranh-chap-dat-dai': {
    vi: {
      title: 'Tranh Chấp Đất Đai',
      subtitle: 'Chuyên gia về quyền sử dụng đất',
      description: [
        'Tranh chấp đất đai là lĩnh vực đặc biệt phức tạp tại Việt Nam do hệ thống pháp luật đất đai có nhiều tầng lớp lịch sử, trải qua nhiều giai đoạn thay đổi từ thời kỳ trước và sau năm 1975, qua các Luật Đất đai 1987, 1993, 2003, 2013 đến Luật Đất đai 2024 hiện hành. Luật sư Võ Thiện Hiển có kinh nghiệm sâu rộng trong việc giải quyết các tranh chấp liên quan đến quyền sử dụng đất, đặc biệt tại khu vực Thành phố Hồ Chí Minh và các tỉnh Đông Nam Bộ.',
        'Các vấn đề tranh chấp đất đai thường gặp trong thực tiễn bao gồm: tranh chấp ranh giới và mốc giới đất; chuyển nhượng, tặng cho, thế chấp quyền sử dụng đất; thu hồi đất và đền bù giải phóng mặt bằng cho các dự án công cộng và thương mại; cấp và thu hồi Giấy chứng nhận quyền sử dụng đất (sổ đỏ, sổ hồng); tranh chấp đất đai có yếu tố lịch sử phức tạp; và các khiếu nại hành chính liên quan đến quản lý đất đai.',
        'Hệ thống pháp luật đất đai Việt Nam được chi phối chủ yếu bởi Luật Đất đai 2024 (Luật số 31/2024/QH15, có hiệu lực từ ngày 01/8/2024), Nghị định số 102/2024/NĐ-CP hướng dẫn thi hành, Luật Nhà ở 2023, Luật Kinh doanh Bất động sản 2023, cùng các nghị quyết của Hội đồng Thẩm phán. Luật sư Hiển nắm vững cả hệ thống pháp luật hiện hành lẫn các quy định đã hết hiệu lực nhưng vẫn được áp dụng cho các quan hệ pháp luật phát sinh trước đó.',
        'Các tình huống tranh chấp đất đai điển hình mà Luật sư Hiển thường xử lý bao gồm: người dân bị thu hồi đất với mức bồi thường không thỏa đáng; tranh chấp giữa các thành viên trong gia đình về quyền sử dụng đất thừa kế; chuyển nhượng quyền sử dụng đất bằng giấy tay không qua công chứng; lấn chiếm đất đai giữa các hộ liền kề; và tranh chấp với chủ đầu tư dự án bất động sản về quyền sử dụng đất.',
        'Khách hàng tin tưởng lựa chọn Luật sư Võ Thiện Hiển vì ông có sự am hiểu không chỉ về mặt pháp lý mà còn về thực tiễn quản lý đất đai tại địa phương. Ông duy trì mối quan hệ làm việc chuyên nghiệp với các cơ quan quản lý đất đai, tòa án và cơ quan thi hành án tại nhiều tỉnh thành, giúp quá trình giải quyết tranh chấp diễn ra thuận lợi hơn. Kinh nghiệm xử lý các vụ việc đất đai có yếu tố lịch sử từ trước năm 1975 là một lợi thế đặc biệt của ông.',
        'Phương pháp tiếp cận của Luật sư Hiển đối với tranh chấp đất đai bao gồm: khảo sát thực địa và kiểm tra hồ sơ địa chính gốc; tra cứu lịch sử biến động đất đai qua các thời kỳ; thu thập chứng cứ từ nhiều nguồn (bản đồ địa chính, ảnh vệ tinh, lời khai nhân chứng); và xây dựng chiến lược phù hợp nhất cho từng vụ việc cụ thể.',
        'Về thời gian giải quyết, tranh chấp đất đai thường kéo dài hơn các loại tranh chấp khác do tính phức tạp của chứng cứ và thủ tục. Giai đoạn hòa giải tại UBND cấp xã (bắt buộc) mất 1-3 tháng, sau đó nếu khởi kiện ra tòa án, quá trình tố tụng có thể kéo dài từ 12 đến 24 tháng. Luật sư Hiển cam kết đồng hành cùng khách hàng trong suốt quá trình và luôn tìm kiếm giải pháp nhanh nhất có thể.',
      ],
      approaches: [
        'Kiểm tra nguồn gốc pháp lý và lịch sử sử dụng đất',
        'Thu thập và đánh giá chứng cứ địa chính',
        'Làm việc với cơ quan quản lý đất đai địa phương',
        'Đại diện tại tòa án và cơ quan giải quyết tranh chấp',
        'Tư vấn phòng ngừa rủi ro pháp lý về đất đai',
      ],
      matters: [
        { title: 'Tranh chấp quyền sử dụng đất 5.000m2 tại quận 9', year: '2023', excerpt: 'Thành công bảo vệ quyền sử dụng đất cho khách hàng trong vụ tranh chấp kéo dài 3 năm.' },
        { title: 'Khiếu nại về bồi thường giải phóng mặt bằng dự án', year: '2021', excerpt: 'Đại diện cư dân khiếu nại thành công, tăng mức bồi thường lên 200% so với mức ban đầu.' },
      ],
      stats: [
        { value: '150+', label: 'Vụ tranh chấp đất đai đã xử lý' },
        { value: '92%', label: 'Tỷ lệ kết quả thuận lợi' },
        { value: '200%', label: 'Mức tăng bồi thường cao nhất đạt được' },
        { value: '10+', label: 'Tỉnh thành đã thụ lý' },
      ],
      whyChoose: [
        { title: 'Chuyên sâu pháp luật đất đai', description: 'Nắm vững toàn bộ hệ thống pháp luật đất đai qua các thời kỳ, từ trước 1975 đến Luật Đất đai 2024 mới nhất.' },
        { title: 'Hiểu biết thực tiễn địa phương', description: 'Am hiểu sâu sắc thực tiễn quản lý đất đai tại TP.HCM và các tỉnh Đông Nam Bộ, có quan hệ làm việc chuyên nghiệp với các cơ quan liên quan.' },
        { title: 'Khảo sát thực địa kỹ lưỡng', description: 'Luôn tiến hành khảo sát thực địa, đối chiếu hồ sơ địa chính gốc và bản đồ qua các thời kỳ để xây dựng chứng cứ vững chắc.' },
        { title: 'Kiên trì theo đuổi đến cùng', description: 'Cam kết đồng hành cùng khách hàng qua mọi giai đoạn tố tụng, từ hòa giải tại UBND đến giám đốc thẩm tại Tòa án Tối cao.' },
      ],
    },
    en: {
      title: 'Land & Real Estate Disputes',
      subtitle: 'Expert in land use rights',
      description: [
        'Land disputes are particularly complex in Vietnam due to the multi-layered historical legal framework governing land, spanning multiple periods of change from before and after 1975, through the Land Laws of 1987, 1993, 2003, 2013, to the current 2024 Land Law. Attorney Vo Thien Hien has extensive experience resolving disputes related to land use rights, particularly in Ho Chi Minh City and the southeastern provinces.',
        'Common land dispute issues encountered in practice include: boundary and landmark disputes; transfer, donation, and mortgage of land use rights; land acquisition and compensation for public and commercial projects; issuance and revocation of Land Use Right Certificates (red books, pink books); land disputes with complex historical elements; and administrative complaints related to land management.',
        'Vietnam\'s land law system is primarily governed by the 2024 Land Law (Law No. 31/2024/QH15, effective August 1, 2024), Decree No. 102/2024/ND-CP on implementation, the 2023 Housing Law, the 2023 Real Estate Business Law, and Judicial Council resolutions. Attorney Hien masters both the current legal framework and expired regulations that still apply to legal relationships arising before their expiration.',
        'Typical land dispute scenarios that Attorney Hien regularly handles include: residents facing inadequate compensation for land acquisition; family disputes over inherited land use rights; informal land transfers without notarization; encroachment between adjacent landholders; and disputes with real estate project developers over land use rights.',
        'Clients trust Attorney Vo Thien Hien because he understands not only the legal aspects but also the practical realities of land management at the local level. He maintains professional working relationships with land management authorities, courts, and judgment enforcement agencies across multiple provinces, facilitating smoother dispute resolution. His experience handling land cases with historical elements from before 1975 is a distinctive advantage.',
        'Attorney Hien\'s approach to land disputes includes: on-site surveys and examination of original cadastral records; tracing land use history through different periods; gathering evidence from multiple sources (cadastral maps, satellite imagery, witness testimony); and developing the most suitable strategy for each specific case.',
        'Regarding timelines, land disputes typically take longer than other disputes due to the complexity of evidence and procedures. The mandatory mediation phase at the commune-level People\'s Committee takes 1-3 months, followed by court proceedings that can extend 12 to 24 months if litigation is necessary. Attorney Hien commits to accompanying clients throughout the process and always seeks the fastest possible resolution.',
      ],
      approaches: [
        'Investigating legal origins and land use history',
        'Collecting and evaluating cadastral evidence',
        'Working with local land management authorities',
        'Representation at courts and dispute resolution bodies',
        'Preventive advisory on land-related legal risks',
      ],
      matters: [
        { title: '5,000 sqm land use rights dispute in District 9', year: '2023', excerpt: 'Successfully protected client\'s land use rights in a 3-year dispute.' },
        { title: 'Project land clearance compensation complaint', year: '2021', excerpt: 'Successfully represented residents in complaint, increasing compensation by 200% from initial amount.' },
      ],
      stats: [
        { value: '150+', label: 'Land Disputes Handled' },
        { value: '92%', label: 'Favorable Outcome Rate' },
        { value: '200%', label: 'Highest Compensation Increase' },
        { value: '10+', label: 'Provinces Covered' },
      ],
      whyChoose: [
        { title: 'Deep Land Law Expertise', description: 'Mastery of the entire land law system through all periods, from pre-1975 to the latest 2024 Land Law.' },
        { title: 'Local Practical Knowledge', description: 'Deep understanding of land management practices in HCMC and southeastern provinces, with professional relationships across relevant authorities.' },
        { title: 'Thorough Field Surveys', description: 'Always conducts on-site surveys, cross-references original cadastral records and historical maps to build rock-solid evidence.' },
        { title: 'Persistent Pursuit to Completion', description: 'Committed to accompanying clients through every litigation stage, from commune mediation to cassation review at the Supreme Court.' },
      ],
    },
  },
  'hon-nhan-gia-dinh': {
    vi: {
      title: 'Hôn Nhân & Gia Đình',
      subtitle: 'Hỗ trợ pháp lý tận tâm và nhân văn',
      description: [
        'Các vấn đề hôn nhân gia đình đòi hỏi sự nhân văn, tế nhị và chuyên nghiệp cao nhất. Luật sư Võ Thiện Hiển tiếp cận mọi vụ việc gia đình với sự thấu hiểu và tôn trọng sâu sắc, đồng thời kiên quyết bảo vệ tối đa quyền lợi hợp pháp của khách hàng. Với kinh nghiệm hơn 15 năm giải quyết các vụ việc hôn nhân gia đình từ đơn giản đến phức tạp, ông đã giúp hàng trăm gia đình tìm được giải pháp pháp lý phù hợp nhất.',
        'Dịch vụ pháp lý trong lĩnh vực hôn nhân gia đình bao gồm: ly hôn thuận tình và ly hôn đơn phương; phân chia tài sản chung vợ chồng bao gồm bất động sản, cổ phần, tài khoản ngân hàng và các loại tài sản khác; giành quyền nuôi con và thay đổi quyền nuôi con; yêu cầu cấp dưỡng cho con cái và vợ/chồng; tranh chấp về hợp đồng tiền hôn nhân; và nhận nuôi con nuôi trong nước và quốc tế.',
        'Pháp luật điều chỉnh lĩnh vực này chủ yếu bao gồm Luật Hôn nhân và Gia đình 2014 (Luật số 52/2014/QH13), Nghị định 126/2014/NĐ-CP hướng dẫn thi hành, Luật Trẻ em 2016, Luật Nuôi con nuôi 2010, và các thông tư hướng dẫn liên quan. Đối với các vụ việc có yếu tố nước ngoài, còn phải áp dụng thêm các hiệp định tương trợ tư pháp song phương và Công ước Hague mà Việt Nam là thành viên.',
        'Trong thực tiễn, Luật sư Hiển thường xử lý các tình huống phức tạp như: ly hôn khi một bên ở nước ngoài hoặc không hợp tác; phân chia tài sản chung khi tài sản được đứng tên người thứ ba; tranh chấp quyền nuôi con khi cả hai bên đều có điều kiện tốt; xác định tài sản riêng và tài sản chung trong hôn nhân; và giải quyết quyền lợi của con cái khi cha mẹ ly hôn.',
        'Luật sư Võ Thiện Hiển được khách hàng đánh giá cao bởi sự tận tâm và nhạy cảm đặc biệt trong các vụ việc gia đình. Ông hiểu rằng đằng sau mỗi vụ ly hôn hay tranh chấp gia đình là những cảm xúc sâu sắc và những mối quan hệ cần được xử lý khéo léo. Ông luôn ưu tiên bảo vệ quyền lợi của trẻ em và tìm kiếm giải pháp giảm thiểu xung đột gia đình.',
        'Phương pháp tiếp cận của ông luôn ưu tiên giải pháp hòa giải và thương lượng để giảm thiểu ảnh hưởng tinh thần đến các thành viên trong gia đình, đặc biệt là trẻ em. Ông tin rằng một cuộc ly hôn được giải quyết trong hòa bình sẽ tốt hơn cho tất cả các bên, đặc biệt là con cái, so với một cuộc tranh tụng kéo dài và đau đớn.',
        'Quy trình giải quyết ly hôn thông thường bao gồm: tư vấn ban đầu và đánh giá tình huống (1 tuần), chuẩn bị hồ sơ và thu thập chứng cứ (2-4 tuần), nộp đơn ly hôn tại tòa án (thời hạn thụ lý 5-7 ngày), hòa giải tại tòa (1-2 tháng), và xét xử nếu hòa giải không thành (3-6 tháng). Đối với ly hôn thuận tình, thời gian có thể rút ngắn đáng kể, chỉ từ 1-3 tháng.',
      ],
      approaches: [
        'Tiếp cận tận tâm, nhân văn và bảo mật tuyệt đối',
        'Ưu tiên thương lượng hòa giải vì quyền lợi các bên',
        'Bảo vệ quyền lợi của trẻ em là ưu tiên hàng đầu',
        'Tư vấn toàn diện về tài sản và nghĩa vụ tài chính',
        'Hỗ trợ thủ tục pháp lý nhanh chóng và hiệu quả',
      ],
      matters: [
        { title: 'Giải quyết ly hôn và phân chia tài sản chung trị giá 30 tỷ đồng', year: '2023', excerpt: 'Thành công bảo vệ quyền lợi tài sản và quyền nuôi con cho khách hàng.' },
        { title: 'Tranh chấp quyền nuôi con quốc tế', year: '2022', excerpt: 'Giải quyết thành công vụ tranh chấp quyền nuôi con giữa công dân Việt Nam và nước ngoài.' },
      ],
      stats: [
        { value: '180+', label: 'Vụ việc gia đình đã giải quyết' },
        { value: '90%', label: 'Giải quyết qua hòa giải' },
        { value: '100%', label: 'Cam kết bảo mật' },
        { value: '30 tỷ+', label: 'Giá trị tài sản đã phân chia' },
      ],
      whyChoose: [
        { title: 'Nhạy cảm và thấu hiểu', description: 'Tiếp cận mọi vụ việc gia đình với sự tôn trọng, thấu hiểu cảm xúc và bảo mật tuyệt đối cho khách hàng.' },
        { title: 'Ưu tiên quyền lợi trẻ em', description: 'Luôn đặt quyền lợi tốt nhất của trẻ em lên hàng đầu trong mọi quyết định về quyền nuôi con và cấp dưỡng.' },
        { title: 'Kinh nghiệm vụ việc quốc tế', description: 'Xử lý thành công nhiều vụ việc hôn nhân gia đình có yếu tố nước ngoài, áp dụng đúng pháp luật quốc tế.' },
        { title: 'Giải pháp toàn diện', description: 'Tư vấn không chỉ về pháp lý mà còn về phương án tài chính, quyền nuôi con và kế hoạch cuộc sống sau ly hôn.' },
      ],
    },
    en: {
      title: 'Marriage & Family Law',
      subtitle: 'Compassionate and professional legal support',
      description: [
        'Family law matters demand the highest levels of compassion, sensitivity, and professionalism. Attorney Vo Thien Hien approaches every family case with deep understanding and respect, while firmly protecting clients\' legitimate interests to the fullest extent. With over 15 years of experience handling family law matters from simple to complex, he has helped hundreds of families find the most appropriate legal solutions.',
        'Legal services in the family law area include: consensual and unilateral divorce; division of marital property including real estate, shares, bank accounts, and other assets; child custody claims and custody modifications; child and spousal support claims; prenuptial agreement disputes; and domestic and international adoption.',
        'The primary legislation governing this area includes the 2014 Marriage and Family Law (Law No. 52/2014/QH13), Decree 126/2014/ND-CP on implementation, the 2016 Children Law, the 2010 Adoption Law, and related implementing circulars. For cases involving foreign elements, bilateral judicial assistance treaties and Hague Conventions to which Vietnam is a party must also be applied.',
        'In practice, Attorney Hien frequently handles complex situations such as: divorce when one party is abroad or uncooperative; division of marital property held in a third party\'s name; custody disputes when both parents have strong qualifications; distinguishing separate and marital property; and protecting children\'s interests when parents divorce.',
        'Attorney Vo Thien Hien is highly valued by clients for his dedication and exceptional sensitivity in family cases. He understands that behind every divorce or family dispute are deep emotions and relationships that require skillful handling. He always prioritizes protecting children\'s interests and seeks solutions that minimize family conflict.',
        'His approach always prioritizes mediation and negotiation to minimize emotional impact on family members, especially children. He believes that a peacefully resolved divorce is better for all parties, particularly children, compared to prolonged and painful litigation.',
        'The typical divorce process includes: initial consultation and situation assessment (1 week), file preparation and evidence collection (2-4 weeks), filing the divorce petition at court (5-7 day acceptance period), court mediation (1-2 months), and trial if mediation fails (3-6 months). For consensual divorces, the timeline can be significantly shortened to just 1-3 months.',
      ],
      approaches: [
        'Compassionate, humane approach with absolute confidentiality',
        'Prioritizing negotiation and mediation for all parties\' benefit',
        'Children\'s interests as the top priority',
        'Comprehensive advisory on assets and financial obligations',
        'Swift and efficient legal procedure support',
      ],
      matters: [
        { title: 'Divorce and VND 30 billion marital property division', year: '2023', excerpt: 'Successfully protected client\'s property rights and child custody.' },
        { title: 'International child custody dispute', year: '2022', excerpt: 'Successfully resolved custody dispute between Vietnamese and foreign nationals.' },
      ],
      stats: [
        { value: '180+', label: 'Family Cases Resolved' },
        { value: '90%', label: 'Resolved Through Mediation' },
        { value: '100%', label: 'Confidentiality Commitment' },
        { value: 'VND 30B+', label: 'Assets Divided' },
      ],
      whyChoose: [
        { title: 'Sensitive and Understanding', description: 'Approaching every family case with respect, emotional understanding, and absolute confidentiality for clients.' },
        { title: 'Children\'s Interests First', description: 'Always placing children\'s best interests at the forefront in all custody and support decisions.' },
        { title: 'International Case Experience', description: 'Successfully handling numerous family law cases with foreign elements, correctly applying international law.' },
        { title: 'Comprehensive Solutions', description: 'Advisory covering not just legal matters but also financial planning, custody arrangements, and post-divorce life planning.' },
      ],
    },
  },
  'luat-doanh-nghiep': {
    vi: {
      title: 'Luật Doanh Nghiệp',
      subtitle: 'Đồng hành pháp lý cho doanh nghiệp',
      description: [
        'Luật sư Võ Thiện Hiển cung cấp dịch vụ tư vấn pháp lý toàn diện cho doanh nghiệp, từ giai đoạn thành lập đến vận hành và phát triển. Với vị trí Luật sư Thành viên Điều hành tại Apolo Lawyers, ông là đối tác pháp lý đáng tin cậy cho nhiều doanh nghiệp trong và ngoài nước, từ các startup công nghệ đến các tập đoàn đa quốc gia hoạt động tại Việt Nam.',
        'Phạm vi dịch vụ pháp lý doanh nghiệp bao gồm: thành lập công ty và lựa chọn loại hình doanh nghiệp phù hợp; tái cơ cấu doanh nghiệp và chuyển đổi loại hình; soạn thảo, rà soát và đàm phán hợp đồng thương mại; mua bán và sáp nhập doanh nghiệp (M&A); quản trị công ty và điều lệ; giải quyết tranh chấp thương mại; tuân thủ pháp luật đầu tư và doanh nghiệp; và tư vấn pháp lý thường xuyên.',
        'Các quy định pháp luật chính trong lĩnh vực này bao gồm Luật Doanh nghiệp 2020 (Luật số 59/2020/QH14), Luật Đầu tư 2020 (Luật số 61/2020/QH14), Luật Thương mại 2005, Luật Cạnh tranh 2018, Luật Phá sản 2014, cùng hàng trăm nghị định và thông tư hướng dẫn. Đối với doanh nghiệp có vốn đầu tư nước ngoài (FDI), còn phải tuân thủ thêm các quy định về đầu tư nước ngoài và cam kết WTO của Việt Nam.',
        'Trong thực tiễn, Luật sư Hiển xử lý nhiều tình huống đa dạng như: tư vấn cho nhà đầu tư nước ngoài thành lập công ty tại Việt Nam với tỷ lệ sở hữu phù hợp; rà soát pháp lý (due diligence) cho các giao dịch M&A; soạn thảo hợp đồng liên doanh và thỏa thuận cổ đông; tư vấn tuân thủ thuế và kế toán; giải quyết tranh chấp giữa các cổ đông/thành viên; và hỗ trợ doanh nghiệp trong các cuộc thanh tra, kiểm tra của cơ quan nhà nước.',
        'Doanh nghiệp lựa chọn Luật sư Hiển vì ông không chỉ là luật sư mà còn là nhà tư vấn chiến lược, hiểu rõ bối cảnh kinh doanh và mục tiêu phát triển của từng khách hàng. Ông có khả năng kết nối các khía cạnh pháp lý với chiến lược kinh doanh, giúp doanh nghiệp không chỉ tuân thủ pháp luật mà còn tận dụng tối đa các cơ hội pháp lý để phát triển.',
        'Với sự hiểu biết sâu sắc về môi trường kinh doanh Việt Nam và kinh nghiệm làm việc với các doanh nghiệp đa quốc gia, Luật sư Hiển giúp doanh nghiệp giảm thiểu rủi ro pháp lý và tối ưu hóa hoạt động. Ông thông thạo cả tiếng Việt và tiếng Anh pháp lý, đảm bảo giao tiếp hiệu quả với mọi đối tác.',
        'Quy trình tư vấn pháp lý doanh nghiệp được thiết kế linh hoạt theo nhu cầu: từ tư vấn theo vụ việc cho các giao dịch cụ thể, đến dịch vụ tư vấn pháp lý thường xuyên (retainer) với mức phí cố định hàng tháng. Thời gian xử lý tùy thuộc vào tính chất công việc: thành lập công ty (2-4 tuần), giao dịch M&A (2-6 tháng), giải quyết tranh chấp thương mại (3-12 tháng).',
      ],
      approaches: [
        'Tư vấn chiến lược pháp lý dài hạn cho doanh nghiệp',
        'Rà soát và soạn thảo hợp đồng chuyên nghiệp',
        'Hỗ trợ thủ tục M&A và tái cơ cấu doanh nghiệp',
        'Đảm bảo tuân thủ pháp luật và quy định ngành',
        'Giải quyết tranh chấp thương mại nhanh chóng',
      ],
      matters: [
        { title: 'Tư vấn M&A cho giao dịch trị giá 200 tỷ đồng', year: '2023', excerpt: 'Tư vấn pháp lý toàn diện cho giao dịch mua bán và sáp nhập doanh nghiệp trong lĩnh vực bất động sản.' },
        { title: 'Tái cơ cấu tập đoàn đa ngành', year: '2022', excerpt: 'Hỗ trợ tái cơ cấu tổ chức và pháp lý cho tập đoàn với 5 công ty thành viên.' },
      ],
      stats: [
        { value: '100+', label: 'Doanh nghiệp đã tư vấn' },
        { value: '200 tỷ+', label: 'Giá trị giao dịch M&A' },
        { value: '50+', label: 'Doanh nghiệp FDI đã hỗ trợ' },
        { value: '98%', label: 'Khách hàng hài lòng' },
      ],
      whyChoose: [
        { title: 'Tư duy kinh doanh chiến lược', description: 'Không chỉ tư vấn pháp lý mà còn hiểu rõ bối cảnh kinh doanh, giúp kết nối pháp luật với chiến lược phát triển doanh nghiệp.' },
        { title: 'Kinh nghiệm đa ngành', description: 'Tư vấn cho doanh nghiệp trong nhiều lĩnh vực: bất động sản, công nghệ, sản xuất, thương mại, dịch vụ tài chính.' },
        { title: 'Thông thạo song ngữ', description: 'Khả năng tư vấn bằng tiếng Việt và tiếng Anh, đảm bảo giao tiếp hiệu quả với đối tác quốc tế và nhà đầu tư nước ngoài.' },
        { title: 'Mạng lưới chuyên gia rộng', description: 'Kết nối với mạng lưới chuyên gia kế toán, kiểm toán, thuế và các lĩnh vực liên quan để cung cấp giải pháp toàn diện.' },
      ],
    },
    en: {
      title: 'Corporate Law',
      subtitle: 'Legal partnership for businesses',
      description: [
        'Attorney Vo Thien Hien provides comprehensive legal advisory services for businesses, from formation through operation and growth. As Managing Partner at Apolo Lawyers, he is a trusted legal partner for numerous domestic and international enterprises, from tech startups to multinational corporations operating in Vietnam.',
        'Corporate legal services include: company formation and selection of appropriate business entity types; business restructuring and conversion; drafting, reviewing, and negotiating commercial contracts; mergers and acquisitions (M&A); corporate governance and charter documents; commercial dispute resolution; investment and enterprise law compliance; and ongoing legal advisory.',
        'Key legislation in this area includes the 2020 Enterprise Law (Law No. 59/2020/QH14), the 2020 Investment Law (Law No. 61/2020/QH14), the 2005 Commercial Law, the 2018 Competition Law, the 2014 Bankruptcy Law, along with hundreds of implementing decrees and circulars. For foreign-invested enterprises (FDI), additional regulations on foreign investment and Vietnam\'s WTO commitments must be observed.',
        'In practice, Attorney Hien handles diverse situations such as: advising foreign investors on company formation in Vietnam with appropriate ownership ratios; legal due diligence for M&A transactions; drafting joint venture agreements and shareholder agreements; tax and accounting compliance advisory; resolving shareholder/member disputes; and supporting businesses during government inspections and audits.',
        'Businesses choose Attorney Hien because he serves not only as a lawyer but as a strategic advisor who understands each client\'s business context and development goals. He connects legal considerations with business strategy, helping enterprises not only comply with the law but also maximize legal opportunities for growth.',
        'With deep understanding of Vietnam\'s business environment and experience working with multinational enterprises, Attorney Hien helps businesses minimize legal risks and optimize operations. He is fluent in both Vietnamese and English legal terminology, ensuring effective communication with all partners.',
        'The corporate legal advisory process is designed flexibly according to needs: from matter-based advisory for specific transactions to ongoing legal retainer services with fixed monthly fees. Processing timelines depend on the nature of work: company formation (2-4 weeks), M&A transactions (2-6 months), commercial dispute resolution (3-12 months).',
      ],
      approaches: [
        'Long-term strategic legal advisory for businesses',
        'Professional contract review and drafting',
        'M&A and business restructuring support',
        'Ensuring legal and industry regulatory compliance',
        'Swift commercial dispute resolution',
      ],
      matters: [
        { title: 'M&A advisory for VND 200 billion transaction', year: '2023', excerpt: 'Comprehensive legal advisory for a real estate sector acquisition and merger transaction.' },
        { title: 'Multi-sector conglomerate restructuring', year: '2022', excerpt: 'Supported organizational and legal restructuring for a conglomerate with 5 subsidiaries.' },
      ],
      stats: [
        { value: '100+', label: 'Businesses Advised' },
        { value: 'VND 200B+', label: 'M&A Transaction Value' },
        { value: '50+', label: 'FDI Companies Supported' },
        { value: '98%', label: 'Client Satisfaction' },
      ],
      whyChoose: [
        { title: 'Strategic Business Thinking', description: 'Not just legal advisory but genuine understanding of business context, connecting law with corporate development strategy.' },
        { title: 'Multi-Industry Experience', description: 'Advisory for businesses across sectors: real estate, technology, manufacturing, commerce, and financial services.' },
        { title: 'Bilingual Proficiency', description: 'Capability to advise in both Vietnamese and English, ensuring effective communication with international partners and foreign investors.' },
        { title: 'Extensive Expert Network', description: 'Connected with networks of accounting, auditing, tax, and related field experts to provide comprehensive solutions.' },
      ],
    },
  },
  'tranh-chap-lao-dong': {
    vi: {
      title: 'Tranh Chấp Lao Động',
      subtitle: 'Bảo vệ quyền lợi lao động',
      description: [
        'Quan hệ lao động tại Việt Nam ngày càng phức tạp với sự phát triển mạnh mẽ của nền kinh tế và sự hội nhập quốc tế sâu rộng. Luật sư Võ Thiện Hiển đại diện cho cả người lao động và người sử dụng lao động trong các tranh chấp lao động, với sự công bằng và chuyên nghiệp trong mọi trường hợp. Ông hiểu rằng quan hệ lao động lành mạnh là nền tảng cho sự phát triển bền vững của doanh nghiệp và xã hội.',
        'Các vấn đề tranh chấp lao động thường gặp bao gồm: chấm dứt hợp đồng lao động trái pháp luật và đơn phương; nợ lương, thưởng và các khoản phúc lợi; trốn đóng hoặc đóng thiếu bảo hiểm xã hội, bảo hiểm y tế, bảo hiểm thất nghiệp; kỷ luật lao động và sa thải trái luật; tai nạn lao động và bệnh nghề nghiệp; đình công và tranh chấp lao động tập thể; và phân biệt đối xử, quấy rối tại nơi làm việc.',
        'Khung pháp lý điều chỉnh lĩnh vực lao động bao gồm Bộ luật Lao động 2019 (Luật số 45/2019/QH14, có hiệu lực từ 01/01/2021), Luật Bảo hiểm xã hội 2014, Luật An toàn vệ sinh lao động 2015, Luật Việc làm 2013, Luật Công đoàn 2012, cùng nhiều nghị định hướng dẫn quan trọng như Nghị định 145/2020/NĐ-CP và Nghị định 12/2022/NĐ-CP về xử phạt vi phạm hành chính trong lĩnh vực lao động.',
        'Trong thực tiễn, Luật sư Hiển đã xử lý nhiều vụ việc phức tạp như: doanh nghiệp sa thải hàng loạt người lao động khi cơ cấu lại tổ chức mà không tuân thủ quy trình pháp luật; người lao động bị chấm dứt hợp đồng vì lý do phân biệt đối xử; doanh nghiệp FDI không tuân thủ quy định về giờ làm việc, nghỉ phép và bảo hiểm; tranh chấp về phương án sử dụng lao động khi sáp nhập doanh nghiệp; và các vụ tai nạn lao động nghiêm trọng yêu cầu bồi thường lớn.',
        'Người lao động và doanh nghiệp tin tưởng Luật sư Hiển vì ông hiểu sâu sắc cả hai phía của mối quan hệ lao động. Khi đại diện cho người lao động, ông kiên quyết đấu tranh cho quyền lợi chính đáng; khi tư vấn cho doanh nghiệp, ông giúp xây dựng chính sách lao động hợp pháp và phòng ngừa tranh chấp từ gốc. Sự cân bằng và chuyên nghiệp này giúp ông đạt được giải pháp công bằng cho mọi bên.',
        'Phương pháp giải quyết tranh chấp lao động của Luật sư Hiển tuân theo quy trình pháp lý chặt chẽ: đầu tiên là thương lượng trực tiếp giữa các bên, tiếp theo là hòa giải thông qua hòa giải viên lao động hoặc Hội đồng trọng tài lao động, và cuối cùng là khởi kiện tại Tòa án Nhân dân nếu các phương thức trước không đạt kết quả.',
        'Thời gian giải quyết tranh chấp lao động thường nhanh hơn các loại tranh chấp khác nhờ quy trình tố tụng rút gọn. Giai đoạn thương lượng và hòa giải mất 1-3 tháng, tố tụng tại tòa án mất 3-8 tháng. Đối với các trường hợp khẩn cấp như sa thải trái luật, Luật sư Hiển có thể yêu cầu tòa án áp dụng biện pháp khẩn cấp tạm thời để bảo vệ quyền lợi người lao động ngay lập tức.',
      ],
      approaches: [
        'Tư vấn phòng ngừa tranh chấp lao động',
        'Rà soát hợp đồng lao động và nội quy lao động',
        'Đại diện tại hội đồng hòa giải và tòa án',
        'Giải quyết tranh chấp tập thể và đình công',
        'Tư vấn tuân thủ pháp luật lao động',
      ],
      matters: [
        { title: 'Tranh chấp sa thải trái pháp luật 50 người lao động', year: '2023', excerpt: 'Đại diện nhóm người lao động bị sa thải trái pháp luật, thành công yêu cầu bồi thường và phục hồi quyền lợi.' },
        { title: 'Tư vấn giải quyết đình công tại nhà máy', year: '2022', excerpt: 'Tư vấn cho doanh nghiệp giải quyết đình công của 200 công nhân, đảm bảo quyền lợi cả hai bên.' },
      ],
      stats: [
        { value: '120+', label: 'Vụ tranh chấp lao động đã xử lý' },
        { value: '88%', label: 'Giải quyết ngoài tòa án' },
        { value: '500+', label: 'Người lao động đã bảo vệ' },
        { value: '50+', label: 'Doanh nghiệp đã tư vấn' },
      ],
      whyChoose: [
        { title: 'Hiểu cả hai phía', description: 'Kinh nghiệm đại diện cho cả người lao động và doanh nghiệp giúp hiểu sâu sắc quan điểm và lợi ích của mỗi bên.' },
        { title: 'Giải quyết nhanh chóng', description: 'Ưu tiên thương lượng và hòa giải để giải quyết tranh chấp nhanh nhất, giảm thiểu ảnh hưởng đến đời sống và hoạt động kinh doanh.' },
        { title: 'Phòng ngừa từ gốc', description: 'Tư vấn xây dựng nội quy, hợp đồng lao động và chính sách nhân sự đúng pháp luật để phòng ngừa tranh chấp.' },
        { title: 'Cập nhật pháp luật liên tục', description: 'Luôn nắm bắt kịp thời mọi thay đổi của Bộ luật Lao động và các văn bản hướng dẫn để tư vấn chính xác nhất.' },
      ],
    },
    en: {
      title: 'Labor Disputes',
      subtitle: 'Protecting labor rights',
      description: [
        'Labor relations in Vietnam are increasingly complex with the economy\'s robust growth and deep international integration. Attorney Vo Thien Hien represents both employees and employers in labor disputes, with fairness and professionalism in every case. He understands that healthy labor relations are the foundation for sustainable business and social development.',
        'Common labor dispute issues include: unlawful and unilateral employment termination; wage, bonus, and benefit arrears; evasion or underpayment of social insurance, health insurance, and unemployment insurance; labor discipline and unlawful dismissal; workplace accidents and occupational diseases; strikes and collective labor disputes; and workplace discrimination and harassment.',
        'The legal framework governing labor includes the 2019 Labor Code (Law No. 45/2019/QH14, effective January 1, 2021), the 2014 Social Insurance Law, the 2015 Occupational Safety and Health Law, the 2013 Employment Law, the 2012 Trade Union Law, along with important implementing decrees such as Decree 145/2020/ND-CP and Decree 12/2022/ND-CP on administrative penalties in the labor field.',
        'In practice, Attorney Hien has handled many complex cases such as: enterprises mass-terminating employees during restructuring without following legal procedures; employees dismissed on discriminatory grounds; FDI enterprises not complying with working hours, leave, and insurance regulations; disputes over labor utilization plans during mergers; and serious workplace accidents requiring substantial compensation.',
        'Both employees and businesses trust Attorney Hien because he deeply understands both sides of the employment relationship. When representing employees, he firmly advocates for their legitimate rights; when advising businesses, he helps build lawful labor policies and prevent disputes at the root. This balance and professionalism enable him to achieve fair solutions for all parties.',
        'Attorney Hien\'s labor dispute resolution methodology follows a rigorous legal process: first direct negotiation between parties, then mediation through labor mediators or the Labor Arbitration Council, and finally filing a lawsuit at the People\'s Court if prior methods prove unsuccessful.',
        'Labor dispute resolution timelines are typically faster than other dispute types thanks to abbreviated procedural rules. The negotiation and mediation phase takes 1-3 months, court proceedings take 3-8 months. For urgent cases such as unlawful dismissal, Attorney Hien can request the court to apply provisional emergency measures to protect workers\' rights immediately.',
      ],
      approaches: [
        'Preventive labor dispute advisory',
        'Employment contract and workplace policy review',
        'Representation at mediation councils and courts',
        'Collective dispute and strike resolution',
        'Labor law compliance advisory',
      ],
      matters: [
        { title: 'Unlawful termination dispute for 50 workers', year: '2023', excerpt: 'Represented a group of unlawfully terminated workers, successfully securing compensation and rights restoration.' },
        { title: 'Factory strike resolution advisory', year: '2022', excerpt: 'Advised employer on resolving a 200-worker strike, ensuring both parties\' rights.' },
      ],
      stats: [
        { value: '120+', label: 'Labor Disputes Handled' },
        { value: '88%', label: 'Resolved Out of Court' },
        { value: '500+', label: 'Workers Protected' },
        { value: '50+', label: 'Businesses Advised' },
      ],
      whyChoose: [
        { title: 'Understanding Both Sides', description: 'Experience representing both employees and employers provides deep insight into each party\'s perspective and interests.' },
        { title: 'Swift Resolution', description: 'Prioritizing negotiation and mediation to resolve disputes fastest, minimizing impact on livelihoods and business operations.' },
        { title: 'Root Cause Prevention', description: 'Advisory on building legally compliant workplace rules, employment contracts, and HR policies to prevent disputes.' },
        { title: 'Continuous Legal Updates', description: 'Always staying current with all Labor Code changes and implementing guidelines for the most accurate advisory.' },
      ],
    },
  },
  'luat-hinh-su': {
    vi: {
      title: 'Luật Hình Sự',
      subtitle: 'Bào chữa và bảo vệ quyền công dân',
      description: [
        'Bào chữa trong vụ án hình sự đòi hỏi kinh nghiệm dày dặn, bản lĩnh vững vàng và sự am hiểu sâu sắc về pháp luật tố tụng hình sự. Luật sư Võ Thiện Hiển đã tham gia bào chữa trong nhiều vụ án hình sự phức tạp tại các cấp tòa án, từ vụ án kinh tế, tham nhũng đến các vụ án hình sự thông thường. Ông tin rằng mọi người đều có quyền được bào chữa công bằng và đúng pháp luật.',
        'Phạm vi dịch vụ bào chữa hình sự bao gồm: bào chữa cho bị can, bị cáo tại cơ quan điều tra, viện kiểm sát nhân dân và tòa án nhân dân các cấp; bảo vệ quyền và lợi ích hợp pháp cho người bị hại, nguyên đơn dân sự trong vụ án hình sự; tư vấn chiến lược bào chữa và đánh giá tình hình pháp lý; hỗ trợ thủ tục tại ngoại, bảo lãnh; và đại diện trong các vụ án phúc thẩm, giám đốc thẩm.',
        'Pháp luật hình sự Việt Nam được điều chỉnh bởi Bộ luật Hình sự 2015 (sửa đổi, bổ sung 2017) (Luật số 100/2015/QH13), Bộ luật Tố tụng Hình sự 2015 (Luật số 101/2015/QH13), Luật Thi hành án Hình sự 2019, Luật Trợ giúp pháp lý 2017, cùng các nghị quyết hướng dẫn của Hội đồng Thẩm phán Tòa án Nhân dân Tối cao và thông tư liên tịch giữa các cơ quan tiến hành tố tụng.',
        'Các loại vụ án hình sự mà Luật sư Hiển thường tham gia bào chữa bao gồm: tội phạm về kinh tế và chức vụ (lừa đảo, lạm dụng tín nhiệm, tham ô, nhận hối lộ); tội phạm xâm phạm sở hữu (trộm cắp, cướp, cưỡng đoạt); tội phạm xâm phạm tính mạng, sức khỏe (cố ý gây thương tích, giết người); tội phạm về ma túy; tội phạm liên quan đến thuế và tài chính; và tội phạm công nghệ cao.',
        'Khách hàng và gia đình bị can tin tưởng Luật sư Hiển bởi sự kiên quyết trong bào chữa và cam kết bảo vệ mọi quyền tố tụng của thân chủ. Ông luôn có mặt kịp thời tại cơ quan điều tra khi được yêu cầu, giám sát chặt chẽ việc tuân thủ quy trình tố tụng, và không ngại đối đầu với cơ quan công tố khi quyền lợi hợp pháp của thân chủ bị vi phạm.',
        'Chiến lược bào chữa của Luật sư Hiển được xây dựng trên nền tảng phân tích kỹ lưỡng hồ sơ vụ án, đánh giá độc lập chứng cứ buộc tội và gỡ tội, tìm kiếm các tình tiết giảm nhẹ, và xác định các vi phạm tố tụng có thể ảnh hưởng đến tính hợp pháp của chứng cứ. Ông kết hợp giữa kiến thức pháp luật vững chắc và kỹ năng tranh luận sắc bén tại phiên tòa.',
        'Quy trình tố tụng hình sự tại Việt Nam gồm ba giai đoạn chính: điều tra (2-6 tháng, có thể gia hạn), truy tố (1-2 tháng), và xét xử sơ thẩm (1-3 tháng). Luật sư Hiển khuyến nghị thân chủ và gia đình liên hệ ngay khi có quyết định khởi tố hoặc bắt tạm giam để đảm bảo quyền bào chữa được thực hiện từ giai đoạn sớm nhất, khi cơ hội bảo vệ quyền lợi là tốt nhất.',
      ],
      approaches: [
        'Tham gia từ giai đoạn điều tra sớm nhất',
        'Xây dựng chiến lược bào chữa toàn diện',
        'Thu thập và đánh giá chứng cứ độc lập',
        'Bảo vệ quyền im lặng và quyền bào chữa',
        'Đảm bảo thủ tục tố tụng đúng pháp luật',
      ],
      matters: [
        { title: 'Bào chữa trong vụ án kinh tế lớn', year: '2023', excerpt: 'Thành công bào chữa cho thân chủ trong vụ án liên quan đến hoạt động kinh doanh, giảm nhẹ hình phạt đáng kể.' },
        { title: 'Bảo vệ quyền lợi người bị hại trong vụ lừa đảo', year: '2022', excerpt: 'Đại diện người bị hại trong vụ lừa đảo chiếm đoạt tài sản, đảm bảo thu hồi tối đa tài sản bị chiếm đoạt.' },
      ],
      stats: [
        { value: '80+', label: 'Vụ án hình sự đã bào chữa' },
        { value: '70%', label: 'Đạt kết quả giảm nhẹ hình phạt' },
        { value: '15+', label: 'Năm kinh nghiệm bào chữa' },
        { value: '24/7', label: 'Sẵn sàng hỗ trợ khẩn cấp' },
      ],
      whyChoose: [
        { title: 'Bản lĩnh và kiên quyết', description: 'Không ngại đối đầu với cơ quan công tố, kiên quyết bảo vệ mọi quyền tố tụng hợp pháp của thân chủ tại mọi giai đoạn.' },
        { title: 'Có mặt kịp thời', description: 'Luôn sẵn sàng 24/7, có mặt ngay tại cơ quan điều tra khi thân chủ bị tạm giữ hoặc khởi tố để bảo vệ quyền bào chữa.' },
        { title: 'Phân tích chứng cứ sắc bén', description: 'Đánh giá độc lập và kỹ lưỡng mọi chứng cứ buộc tội, tìm ra những điểm yếu trong cáo trạng để xây dựng lập luận bào chữa.' },
        { title: 'Kinh nghiệm đa dạng vụ án', description: 'Tham gia bào chữa nhiều loại vụ án từ kinh tế, tham nhũng đến hình sự thông thường, giúp xử lý linh hoạt mọi tình huống.' },
      ],
    },
    en: {
      title: 'Criminal Defense',
      subtitle: 'Defense and citizen rights protection',
      description: [
        'Criminal defense requires extensive experience, steadfast courage, and deep understanding of criminal procedural law. Attorney Vo Thien Hien has participated in defense for numerous complex criminal cases across all court levels, from economic and corruption cases to common criminal matters. He firmly believes that everyone has the right to fair and lawful defense.',
        'Criminal defense services include: defending suspects and defendants at investigation agencies, people\'s procuracies, and people\'s courts at all levels; protecting the rights and legitimate interests of victims and civil plaintiffs in criminal cases; defense strategy advisory and legal situation assessment; bail and release procedure support; and representation in appeals and cassation reviews.',
        'Vietnamese criminal law is governed by the 2015 Criminal Code (amended 2017) (Law No. 100/2015/QH13), the 2015 Criminal Procedure Code (Law No. 101/2015/QH13), the 2019 Criminal Judgment Enforcement Law, the 2017 Legal Aid Law, along with guiding resolutions of the Judicial Council of the Supreme People\'s Court and joint circulars among procedural agencies.',
        'Types of criminal cases that Attorney Hien frequently defends include: economic and position-related crimes (fraud, breach of trust, embezzlement, bribery); property crimes (theft, robbery, extortion); crimes against life and health (intentional injury, homicide); drug-related crimes; tax and financial crimes; and high-tech crimes.',
        'Clients and defendants\' families trust Attorney Hien for his resolute defense and commitment to protecting every procedural right of his clients. He is always present promptly at investigation agencies when required, closely monitors procedural compliance, and does not hesitate to confront the prosecution when clients\' legitimate rights are violated.',
        'Attorney Hien\'s defense strategy is built on thorough case file analysis, independent evaluation of incriminating and exculpatory evidence, identification of mitigating circumstances, and determination of procedural violations that may affect evidence legality. He combines solid legal knowledge with sharp argumentation skills at trial.',
        'Criminal proceedings in Vietnam comprise three main phases: investigation (2-6 months, extendable), prosecution (1-2 months), and first-instance trial (1-3 months). Attorney Hien recommends that defendants and their families contact him immediately upon a prosecution decision or detention order to ensure defense rights are exercised from the earliest stage, when opportunities to protect interests are greatest.',
      ],
      approaches: [
        'Early participation from the investigation stage',
        'Comprehensive defense strategy development',
        'Independent evidence collection and evaluation',
        'Protecting the right to silence and right to counsel',
        'Ensuring lawful procedural compliance',
      ],
      matters: [
        { title: 'Defense in major economic crime case', year: '2023', excerpt: 'Successfully defended client in a business-related criminal case, achieving significant sentence reduction.' },
        { title: 'Victim rights protection in fraud case', year: '2022', excerpt: 'Represented fraud victims, ensuring maximum recovery of misappropriated assets.' },
      ],
      stats: [
        { value: '80+', label: 'Criminal Cases Defended' },
        { value: '70%', label: 'Achieved Sentence Reduction' },
        { value: '15+', label: 'Years of Defense Experience' },
        { value: '24/7', label: 'Emergency Availability' },
      ],
      whyChoose: [
        { title: 'Courageous and Resolute', description: 'Unafraid to confront the prosecution, resolutely protecting every legitimate procedural right of clients at every stage.' },
        { title: 'Prompt Availability', description: 'Always ready 24/7, present immediately at investigation agencies when clients are detained or prosecuted to protect defense rights.' },
        { title: 'Sharp Evidence Analysis', description: 'Independent and thorough evaluation of all incriminating evidence, identifying prosecution weaknesses to build defense arguments.' },
        { title: 'Diverse Case Experience', description: 'Defense participation across case types from economic and corruption to common criminal matters, enabling flexible handling of any situation.' },
      ],
    },
  },
};

const viSlugs = ['tranh-chap-dan-su', 'tranh-chap-dat-dai', 'hon-nhan-gia-dinh', 'luat-doanh-nghiep', 'tranh-chap-lao-dong', 'luat-hinh-su'];
const enSlugs = ['civil-disputes', 'land-disputes', 'family-law', 'corporate-law', 'labor-disputes', 'criminal-defense'];

export function generateStaticParams() {
  return [
    ...viSlugs.map((slug) => ({ locale: 'vi', slug })),
    ...enSlugs.map((slug) => ({ locale: 'en', slug })),
  ];
}

function getCanonicalSlug(slug: string): string {
  if (viSlugs.includes(slug)) return slug;
  return slugMap[slug] || slug;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const isVi = locale === 'vi';
  const canonicalSlug = getCanonicalSlug(slug);
  const data = practiceAreaData[canonicalSlug];

  if (!data) return { title: 'Not Found' };

  const content = isVi ? data.vi : data.en;
  const viSlug = canonicalSlug;
  const enSlug = slugMap[canonicalSlug] || slug;
  const ogImage = slugToImage[canonicalSlug]?.cdn || IMAGES.ogPractice.cdn;

  return {
    title: `${content.title} | ${isVi ? 'Luật sư Võ Thiện Hiển' : 'Attorney Vo Thien Hien'}`,
    description: content.description[0],
    alternates: {
      canonical: isVi ? `/vi/linh-vuc-hanh-nghe/${viSlug}` : `/en/practice-areas/${enSlug}`,
      languages: {
        vi: `/vi/linh-vuc-hanh-nghe/${viSlug}`,
        en: `/en/practice-areas/${enSlug}`,
      },
    },
    openGraph: {
      title: `${content.title} | ${isVi ? 'Luật sư Võ Thiện Hiển' : 'Attorney Vo Thien Hien'}`,
      description: content.description[0],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: content.title,
        },
      ],
      type: 'website',
      locale: isVi ? 'vi_VN' : 'en_US',
      siteName: 'Vo Thien Hien - Attorney at Law',
    },
  };
}

export default async function PracticeAreaDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const isVi = locale === 'vi';
  const canonicalSlug = getCanonicalSlug(slug);
  const data = practiceAreaData[canonicalSlug];

  if (!data) notFound();

  const content = isVi ? data.vi : data.en;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      name: content.title,
      description: content.description[0],
      provider: {
        '@type': 'Person',
        name: 'Vo Thien Hien',
        jobTitle: isVi ? 'Luật sư Thành viên Điều hành' : 'Managing Partner',
      },
      areaServed: { '@type': 'Country', name: 'Vietnam' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: isVi ? 'Trang chủ' : 'Home', item: `https://vothienhien.com/${locale}` },
        { '@type': 'ListItem', position: 2, name: isVi ? 'Lĩnh vực hành nghề' : 'Practice Areas', item: `https://vothienhien.com/${locale}/${isVi ? 'linh-vuc-hanh-nghe' : 'practice-areas'}` },
        { '@type': 'ListItem', position: 3, name: content.title },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Full-bleed Hero with practice area image */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden">
        {slugToImage[canonicalSlug] && (
          <Image
            src={slugToImage[canonicalSlug].cdn}
            alt={slugToImage[canonicalSlug].alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent" />
        <div className="relative w-full max-w-5xl mx-auto px-6 pb-12 md:pb-16">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-white/60 hover:text-accent transition-colors"
                >
                  {isVi ? 'Trang chủ' : 'Home'}
                </Link>
              </li>
              <li className="text-white/40">/</li>
              <li>
                <Link
                  href="/linh-vuc-hanh-nghe"
                  className="text-white/60 hover:text-accent transition-colors"
                >
                  {isVi ? 'Lĩnh vực hành nghề' : 'Practice Areas'}
                </Link>
              </li>
              <li className="text-white/40">/</li>
              <li className="text-accent font-medium">{content.title}</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 drop-shadow-lg">
            {content.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl">{content.subtitle}</p>
          <div className="mt-6">
            <GoldDivider width="w-24" />
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-6 text-text-secondary text-lg leading-relaxed">
            {content.description.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Break - Hands with Pen */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        <Image
          src={IMAGES.detailHands.cdn}
          alt={IMAGES.detailHands.alt}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center px-6">
            <Image
              src={IMAGES.accentGoldStroke.cdn}
              alt=""
              width={120}
              height={20}
              className="mx-auto mb-6 opacity-80"
              aria-hidden="true"
            />
            <p className="text-white/90 text-xl md:text-2xl font-heading font-light italic max-w-3xl">
              {isVi
                ? '"Mỗi vụ việc là một câu chuyện riêng, đòi hỏi sự thấu hiểu và giải pháp pháp lý phù hợp nhất."'
                : '"Every case is a unique story, requiring understanding and the most suitable legal solution."'}
            </p>
            <p className="text-accent mt-4 text-sm uppercase tracking-widest">
              {isVi ? '— Luật sư Võ Thiện Hiển' : '— Attorney Vo Thien Hien'}
            </p>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-16 md:py-20 bg-primary text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {content.stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach - with marble background */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <Image
          src={IMAGES.bgMarble.cdn}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative max-w-4xl mx-auto px-6">
          <SectionHeading
            subtitle={isVi ? 'Phương pháp' : 'Methodology'}
            title={isVi ? 'Cách tiếp cận của chúng tôi' : 'Our Approach'}
            light
          />
          <div className="mt-12 space-y-4">
            {content.approaches.map((approach, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-white/5 backdrop-blur-sm border border-accent/20 p-6 hover:border-accent/50 transition-colors duration-300"
              >
                <span className="text-accent font-heading font-semibold text-lg mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-white/90">{approach}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeading
            subtitle={isVi ? 'Lý do lựa chọn' : 'Why Choose Us'}
            title={isVi ? 'Tại sao chọn Luật sư Võ Thiện Hiển' : 'Why Choose Attorney Vo Thien Hien'}
          />
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {content.whyChoose.map((reason, i) => (
              <div
                key={i}
                className="bg-surface border border-border-gold/20 p-8 hover:border-accent/40 transition-colors duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <span className="shrink-0 w-12 h-12 flex items-center justify-center bg-accent/10 text-accent font-heading font-bold text-xl border border-accent/30 group-hover:bg-accent group-hover:text-primary transition-colors duration-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-primary mb-2">
                      {reason.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Matters */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading
            subtitle={isVi ? 'Kinh nghiệm' : 'Experience'}
            title={isVi ? 'Vụ việc tiêu biểu' : 'Representative Matters'}
          />
          <div className="mt-12 space-y-6">
            {content.matters.map((matter, i) => (
              <div
                key={i}
                className="bg-background border border-border-gold/20 p-8 hover:border-accent/40 transition-colors duration-300"
              >
                <span className="text-accent text-sm font-medium">{matter.year}</span>
                <h3 className="text-xl font-heading font-semibold text-primary mt-2">{matter.title}</h3>
                <p className="text-text-secondary mt-3">{matter.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with skyline background */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <Image
          src={IMAGES.bgSkyline.cdn}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 to-primary/70" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <Image
            src={IMAGES.accentGoldStroke.cdn}
            alt=""
            width={100}
            height={16}
            className="mx-auto mb-8 opacity-70"
            aria-hidden="true"
          />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-white mb-4">
            {isVi ? 'Thảo luận về vấn đề của bạn' : 'Discuss Your Matter'}
          </h2>
          <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            {isVi
              ? 'Liên hệ với Luật sư Võ Thiện Hiển để được tư vấn chuyên sâu về vấn đề pháp lý của bạn. Buổi tư vấn đầu tiên hoàn toàn bảo mật.'
              : 'Contact Attorney Vo Thien Hien for in-depth counsel on your legal matter. Your initial consultation is completely confidential.'}
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
