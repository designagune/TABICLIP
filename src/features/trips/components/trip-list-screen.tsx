'use client';

import {Map, Plus} from 'lucide-react';
import {useTranslations} from 'next-intl';

import {BrandMark} from '@/components/brand-mark';
import {LocaleSwitcher} from '@/components/locale-switcher';
import {PageHeading} from '@/components/page-heading';
import {EmptyState} from '@/components/states/empty-state';
import {ErrorState} from '@/components/states/error-state';
import {ScreenSkeleton} from '@/components/states/screen-skeleton';
import {buttonVariants} from '@/components/ui/button';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/utils';

import {useTrips} from '../queries/use-trip-queries';
import {TripCard} from './trip-card';

export function TripListScreen() {
  const t = useTranslations('trips');
  const query = useTrips();

  return (
    <div className="sm:border-border mx-auto min-h-dvh max-w-3xl border-x border-transparent bg-white/28">
      <header className="flex min-h-20 items-center justify-between px-5 sm:px-7">
        <BrandMark />
        <LocaleSwitcher />
      </header>
      <main id="main-content" className="px-5 pt-7 pb-24 sm:px-7">
        <PageHeading
          eyebrow={t('listEyebrow')}
          title={t('listTitle')}
          action={
            <Link
              href="/app/trips/new"
              aria-label={t('newTrip')}
              className={cn(buttonVariants({size: 'icon'}), 'shrink-0')}
            >
              <Plus aria-hidden="true" className="size-5" />
            </Link>
          }
        />
        {query.isPending ? <ScreenSkeleton /> : null}
        {query.isError ? (
          <ErrorState
            title={t('emptyTitle')}
            retryLabel={t('newTrip')}
            onRetry={() => void query.refetch()}
          />
        ) : null}
        {query.data?.length === 0 ? (
          <EmptyState
            icon={Map}
            title={t('emptyTitle')}
            description={t('emptyBody')}
            action={
              <Link href="/app/trips/new" className={buttonVariants()}>
                {t('newTrip')}
              </Link>
            }
          />
        ) : null}
        <div className="space-y-4">
          {query.data?.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </main>
      <div className="safe-bottom bg-background/90 fixed inset-x-0 bottom-0 z-20 mx-auto max-w-3xl border-t p-3 backdrop-blur-xl">
        <Link
          href="/app/trips/new"
          className={cn(buttonVariants({size: 'lg'}), 'w-full')}
        >
          <Plus aria-hidden="true" className="size-5" />
          {t('newTrip')}
        </Link>
      </div>
    </div>
  );
}
