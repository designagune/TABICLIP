import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import type {ReactNode} from 'react';

import {OfflineBanner} from '@/components/offline-banner';
import {AppProviders} from '@/components/providers/app-providers';
import {siteMetadata, siteViewport} from '@/config/site-metadata';
import {routing} from '@/i18n/routing';

import '../globals.css';

export const metadata = siteMetadata;
export const viewport = siteViewport;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('common');

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>
        <NextIntlClientProvider>
          <AppProviders>
            <a
              href="#main-content"
              className="bg-foreground text-background fixed top-2 left-2 z-[100] -translate-y-20 rounded-lg px-4 py-3 font-bold transition focus:translate-y-0"
            >
              {t('skipToContent')}
            </a>
            <OfflineBanner />
            {children}
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
