'use client';

import {useTranslations} from 'next-intl';

import {PageHeading} from '@/components/page-heading';
import {ErrorState} from '@/components/states/error-state';
import {ScreenSkeleton} from '@/components/states/screen-skeleton';
import {
  useMoveItineraryItem,
  useTripWorkspace
} from '@/features/trips/queries/use-trip-queries';
import {enumerateDates} from '@/shared/date/date-utils';

import {ItineraryTimeline} from './itinerary-timeline';

export function ScheduleScreen({tripId}: {tripId: string}) {
  const t = useTranslations('itinerary');
  const tc = useTranslations('common.actions');
  const query = useTripWorkspace(tripId);
  const move = useMoveItineraryItem(tripId);
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

  const dates = enumerateDates(
    query.data.trip.startDate,
    query.data.trip.endDate
  );
  return (
    <div>
      <PageHeading
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />
      <div className="space-y-10">
        {dates.map((date, index) => (
          <ItineraryTimeline
            key={date}
            date={date}
            dayNumber={index + 1}
            items={query.data.itineraryItems.filter(
              (item) => item.date === date
            )}
            onMove={(itemId, direction) => move.mutate({itemId, direction})}
          />
        ))}
      </div>
    </div>
  );
}
