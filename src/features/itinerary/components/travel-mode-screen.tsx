'use client';

import {Navigation} from 'lucide-react';
import {useFormatter, useTranslations} from 'next-intl';

import {PageHeading} from '@/components/page-heading';
import {EmptyState} from '@/components/states/empty-state';
import {ErrorState} from '@/components/states/error-state';
import {ScreenSkeleton} from '@/components/states/screen-skeleton';
import {useTripWorkspace} from '@/features/trips/queries/use-trip-queries';
import {toIsoDate} from '@/shared/date/date-utils';

import {TravelModeCard} from './travel-mode-card';

export function TravelModeScreen({tripId}: {tripId: string}) {
  const t = useTranslations('itinerary.today');
  const tc = useTranslations('common.actions');
  const format = useFormatter();
  const query = useTripWorkspace(tripId);
  if (query.isPending) return <ScreenSkeleton />;
  if (query.isError) {
    return (
      <ErrorState
        title={t('title')}
        retryLabel={tc('retry')}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const today = toIsoDate(new Date());
  const items = query.data.itineraryItems.filter((item) => item.date === today);
  return (
    <div>
      <PageHeading
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={format.dateTime(new Date(`${today}T12:00:00`), {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        })}
      />
      {items.length === 0 ? (
        <EmptyState
          icon={Navigation}
          title={t('noPlanTitle')}
          description={t('noPlanBody')}
        />
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <TravelModeCard
              key={item.id}
              item={item}
              tripId={tripId}
              label={index === 0 ? t('current') : t('next')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
