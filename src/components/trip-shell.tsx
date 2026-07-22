'use client';

import {ChevronLeft, Settings} from 'lucide-react';
import {useTranslations} from 'next-intl';
import type {ReactNode} from 'react';

import {BottomNavigation} from '@/components/bottom-navigation';
import {BrandMark} from '@/components/brand-mark';
import {LocaleSwitcher} from '@/components/locale-switcher';
import {Link} from '@/i18n/navigation';

export function TripShell({
  tripId,
  children
}: {
  tripId: string;
  children: ReactNode;
}) {
  const t = useTranslations('common.nav');
  return (
    <div className="sm:border-border mx-auto min-h-dvh max-w-3xl border-x border-transparent bg-white/28">
      <header className="bg-background/88 sticky top-0 z-30 flex min-h-16 items-center justify-between border-b px-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Link
            href="/app"
            className="hover:bg-muted grid size-11 place-items-center rounded-xl"
            aria-label={t('trips')}
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </Link>
          <BrandMark compact />
        </div>
        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <Link
            href="/app/settings"
            className="hover:bg-muted grid size-11 place-items-center rounded-xl"
            aria-label={t('settings')}
          >
            <Settings aria-hidden="true" className="size-5" />
          </Link>
        </div>
      </header>
      <main id="main-content" className="px-4 pt-7 pb-28 sm:px-7">
        {children}
      </main>
      <BottomNavigation tripId={tripId} />
    </div>
  );
}
