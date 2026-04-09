import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/gioi-thieu-luat-su': {
      vi: '/gioi-thieu-luat-su',
      en: '/lawyer-profile',
    },
    '/linh-vuc-hanh-nghe': {
      vi: '/linh-vuc-hanh-nghe',
      en: '/practice-areas',
    },
    '/linh-vuc-hanh-nghe/[slug]': {
      vi: '/linh-vuc-hanh-nghe/[slug]',
      en: '/practice-areas/[slug]',
    },
    '/vu-viec-tieu-bieu': {
      vi: '/vu-viec-tieu-bieu',
      en: '/representative-experience',
    },
    '/vu-viec-tieu-bieu/[slug]': {
      vi: '/vu-viec-tieu-bieu/[slug]',
      en: '/representative-experience/[slug]',
    },
    '/bai-viet-chuyen-mon': {
      vi: '/bai-viet-chuyen-mon',
      en: '/legal-insights',
    },
    '/bai-viet-chuyen-mon/[slug]': {
      vi: '/bai-viet-chuyen-mon/[slug]',
      en: '/legal-insights/[slug]',
    },
    '/quan-diem-nghe-luat': {
      vi: '/quan-diem-nghe-luat',
      en: '/professional-perspective',
    },
    '/quan-diem-nghe-luat/[slug]': {
      vi: '/quan-diem-nghe-luat/[slug]',
      en: '/professional-perspective/[slug]',
    },
    '/lien-he': {
      vi: '/lien-he',
      en: '/contact',
    },
  },
});
