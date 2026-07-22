'use client';

import {Languages} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';

import {usePathname, useRouter} from '@/i18n/navigation';
import type {AppLocale} from '@/i18n/routing';

export function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale: AppLocale = locale === 'ja' ? 'ko' : 'ja';

  return (
    <button
      type="button"
      className="hover:bg-muted inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold"
      aria-label={`${t('language')}: ${nextLocale === 'ja' ? t('japanese') : t('korean')}`}
      onClick={() => router.replace(pathname, {locale: nextLocale})}
    >
      <Languages aria-hidden="true" className="size-4" />
      {locale === 'ja' ? '한국어' : '日本語'}
    </button>
  );
}
