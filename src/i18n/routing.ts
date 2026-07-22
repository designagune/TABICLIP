import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ja', 'ko'],
  defaultLocale: 'ja',
  localePrefix: 'always',
  localeDetection: false
});

export type AppLocale = (typeof routing.locales)[number];
