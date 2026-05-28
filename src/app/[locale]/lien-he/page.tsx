import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import ContactForm from '@/components/contact/ContactForm';
import { IMAGES } from '@/lib/images';
import {
  EAST_SAIGON_BRANCH,
  EMAIL,
  HEAD_OFFICE,
  PERSONAL_CONTACT,
  POSTAL_ADDRESS,
  SHORT_NAME_EN,
  SHORT_NAME_VN,
  parentBrandUrl,
} from '@/lib/address';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isVi = locale === 'vi';

  return {
    title: isVi
      ? 'Liên Hệ | Luật sư Võ Thiện Hiển'
      : 'Contact | Attorney Vo Thien Hien',
    description: isVi
      ? 'Liên hệ với Luật sư Võ Thiện Hiển để được tư vấn pháp lý chuyên nghiệp. Đặt lịch tư vấn qua điện thoại, email hoặc WhatsApp.'
      : 'Contact Attorney Vo Thien Hien for professional legal counsel. Schedule a consultation via phone, email, or WhatsApp.',
    alternates: {
      canonical: isVi ? '/vi/lien-he' : '/en/contact',
      languages: {
        vi: '/vi/lien-he',
        en: '/en/contact',
      },
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const isVi = locale === 'vi';
  const headOffice = isVi ? HEAD_OFFICE.vi : HEAD_OFFICE.en;
  const branch = isVi ? EAST_SAIGON_BRANCH.vi : EAST_SAIGON_BRANCH.en;
  const postal = isVi ? POSTAL_ADDRESS.vi : POSTAL_ADDRESS.en;
  const personalPhone = isVi ? PERSONAL_CONTACT.phone.vi : PERSONAL_CONTACT.phone.en;
  const firmName = isVi ? SHORT_NAME_VN : SHORT_NAME_EN;
  const brandUrl = parentBrandUrl(locale);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: isVi ? 'Liên hệ Luật sư Võ Thiện Hiển' : 'Contact Attorney Vo Thien Hien',
      url: `https://vothienhien.com/${locale}/${isVi ? 'lien-he' : 'contact'}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Vo Thien Hien',
      jobTitle: isVi ? 'Luật sư Điều hành' : 'Managing Partner',
      telephone: PERSONAL_CONTACT.phoneE164,
      email: PERSONAL_CONTACT.email,
      url: 'https://vothienhien.com',
      worksFor: {
        '@type': 'LegalService',
        name: firmName,
        url: brandUrl,
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: postal.streetAddress,
        addressLocality: postal.addressLocality,
        addressCountry: postal.addressCountry,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: isVi ? 'Trang chủ' : 'Home', item: `https://vothienhien.com/${locale}` },
        { '@type': 'ListItem', position: 2, name: isVi ? 'Liên hệ' : 'Contact', item: `https://vothienhien.com/${locale}/${isVi ? 'lien-he' : 'contact'}` },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="relative bg-primary text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-secondary to-primary opacity-90" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="text-sm uppercase tracking-[0.3em] text-accent font-medium">
            {isVi ? 'Kết nối' : 'Get in Touch'}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mt-6 mb-4">
            {t('sections.contact')}
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            {isVi
              ? 'Hãy để lại thông tin vụ việc và yêu cầu pháp lý của bạn để luật sư có cơ sở xem xét, đánh giá sơ bộ và phản hồi hướng hỗ trợ phù hợp.'
              : 'Please provide information about your matter and legal request so that the attorney can review, make a preliminary assessment, and respond with an appropriate direction of support.'}
          </p>
          <div className="flex justify-center mt-6">
            <GoldDivider width="w-24 mx-auto" />
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left: Contact Form */}
            <div>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-2">
                {isVi ? 'Gửi yêu cầu tư vấn' : 'Submit a Consultation Request'}
              </h2>
              <p className="text-text-secondary mb-8">
                {isVi
                  ? 'Vui lòng điền các thông tin cần thiết bên dưới để luật sư có thể xem xét và phản hồi phù hợp.'
                  : 'Please complete the required information below so that the attorney can review your matter and respond appropriately.'}
              </p>
              <ContactForm />
            </div>

            {/* Right: Contact Information */}
            <div>
              <div className="bg-surface border border-border-gold/20 p-10 sticky top-28">
                <h2 className="text-2xl font-heading font-semibold text-primary mb-8">
                  {isVi ? 'Thông tin liên hệ' : 'Contact Information'}
                </h2>

                <div className="space-y-6">
                  {/* Name & Title */}
                  <div>
                    <h3 className="font-heading font-semibold text-primary text-lg">
                      {isVi ? 'Luật sư Võ Thiện Hiển' : 'Attorney Vo Thien Hien'}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {isVi ? 'Luật sư Điều hành, Apolo Lawyers' : 'Managing Partner, Apolo Lawyers'}
                    </p>
                  </div>

                  <GoldDivider width="w-full" />

                  {/* Firm */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">
                        {isVi ? 'Công ty' : 'Firm'}
                      </p>
                      <p className="text-primary font-medium">{firmName}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">
                        {isVi ? 'Địa chỉ' : 'Address'}
                      </p>
                      <p className="text-primary">{headOffice.address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">
                        {isVi ? 'Điện thoại' : 'Phone'}
                      </p>
                      <a href={`tel:${PERSONAL_CONTACT.phoneE164}`} className="text-primary hover:text-accent transition-colors">
                        {personalPhone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">Email</p>
                      <a href={`mailto:${PERSONAL_CONTACT.email}`} className="text-primary hover:text-accent transition-colors">
                        {PERSONAL_CONTACT.email}
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp — personal number per 17/05/2026 review (R13). */}
                  <div className="mt-8 pt-6 border-t border-border-gold/20">
                    <a
                      href={`https://wa.me/${PERSONAL_CONTACT.whatsappDigits}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 font-medium hover:bg-[#20BD5C] transition-colors w-full justify-center"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      {isVi ? 'Liên hệ qua WhatsApp' : 'Contact via WhatsApp'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Visual */}
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

      {/* Office Location */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            subtitle={isVi ? 'Văn phòng' : 'Office'}
            title={isVi ? 'Địa chỉ văn phòng' : 'Office Location'}
          />
          {/* Head Office + Branch, both locales (17/05/2026 client review).
              Format per R17: company short name, address, single-line phones,
              email. No business hours, no hotline labels. */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-background border border-border-gold/20 p-8">
              <p className="text-[11px] uppercase tracking-[0.25em] text-accent font-medium mb-2">
                {headOffice.name}
              </p>
              <h3 className="font-heading font-semibold text-primary text-lg mb-3">
                {firmName}
              </h3>
              <p className="text-text-secondary">{headOffice.address}</p>
              <p className="mt-3 text-text-secondary text-sm">
                {headOffice.phones.join(' · ')}
              </p>
              <p className="mt-1 text-text-secondary text-sm">
                <a href={`mailto:${EMAIL}`} className="hover:text-accent transition-colors">
                  {EMAIL}
                </a>
              </p>
            </div>
            <div className="bg-background border border-border-gold/20 p-8">
              <p className="text-[11px] uppercase tracking-[0.25em] text-accent font-medium mb-2">
                {isVi ? 'Chi nhánh' : 'Branch'}
              </p>
              <h3 className="font-heading font-semibold text-primary text-lg mb-3">
                {branch.name}
              </h3>
              <p className="text-text-secondary">{branch.address}</p>
              <p className="mt-3 text-text-secondary text-sm">
                {branch.phones.join(' · ')}
              </p>
              <p className="mt-1 text-text-secondary text-sm">
                <a href={`mailto:${EMAIL}`} className="hover:text-accent transition-colors">
                  {EMAIL}
                </a>
              </p>
            </div>
          </div>

          {/* HCMC map — moved below the address blocks since both offices are now shown */}
          <div className="mt-8 bg-background border border-border-gold/20 overflow-hidden relative h-[280px] md:h-[360px]">
            <Image
              src={IMAGES.mapHcmcOffice.cdn}
              alt={IMAGES.mapHcmcOffice.alt}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      </section>
    </>
  );
}
