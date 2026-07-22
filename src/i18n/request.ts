import {hasLocale} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

import {routing} from './routing';

const domains = [
  'common',
  'trips',
  'collection',
  'places',
  'itinerary',
  'reservations'
] as const;

async function loadMessages(locale: string) {
  const entries = await Promise.all(
    domains.map(async (domain) => {
      const messages: unknown = (
        await import(`../messages/${locale}/${domain}.json`)
      ).default;
      return [domain, messages] as const;
    })
  );

  return Object.fromEntries(entries);
}

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  if (!requested || !hasLocale(routing.locales, requested)) {
    notFound();
  }

  return {
    locale: requested,
    messages: await loadMessages(requested),
    timeZone: 'Asia/Seoul',
    now: new Date()
  };
});
