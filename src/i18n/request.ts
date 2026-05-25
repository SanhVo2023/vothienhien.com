import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale can be undefined, or — when a non-locale path such as /admin
  // gets resolved through this config — an unknown value. Importing
  // `messages/${locale}.json` for an unknown locale throws MODULE_NOT_FOUND and
  // 500s the request, so validate against the configured locales and fall back.
  const requested = await requestLocale;
  const locale = routing.locales.includes(requested as (typeof routing.locales)[number])
    ? (requested as string)
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
