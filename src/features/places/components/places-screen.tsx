'use client';

import {MapPinned} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useMemo, useState} from 'react';
import {toast} from 'sonner';

import {PageHeading} from '@/components/page-heading';
import {EmptyState} from '@/components/states/empty-state';
import {ErrorState} from '@/components/states/error-state';
import {ScreenSkeleton} from '@/components/states/screen-skeleton';
import {AddToItineraryModal} from '@/features/itinerary/components/add-to-itinerary-modal';
import {
  useAddItineraryItem,
  useTripWorkspace
} from '@/features/trips/queries/use-trip-queries';

import type {TripPlace} from '../types/place';
import {PlaceGroup} from './place-group';

export function PlacesScreen({tripId}: {tripId: string}) {
  const t = useTranslations('places');
  const ti = useTranslations('itinerary');
  const tc = useTranslations('common.actions');
  const query = useTripWorkspace(tripId);
  const mutation = useAddItineraryItem(tripId);
  const [selected, setSelected] = useState<TripPlace | null>(null);

  const groups = useMemo(() => {
    const grouped = new Map<string, TripPlace[]>();
    for (const place of query.data?.places ?? []) {
      grouped.set(place.place.region, [
        ...(grouped.get(place.place.region) ?? []),
        place
      ]);
    }
    return Array.from(grouped.entries());
  }, [query.data?.places]);

  if (query.isPending) return <ScreenSkeleton />;
  if (query.isError) {
    return (
      <ErrorState
        title={t('emptyTitle')}
        retryLabel={tc('retry')}
        onRetry={() => void query.refetch()}
      />
    );
  }

  return (
    <div>
      <PageHeading
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />
      {groups.length === 0 ? (
        <EmptyState
          icon={MapPinned}
          title={t('emptyTitle')}
          description={t('emptyBody')}
        />
      ) : (
        <div className="space-y-8">
          {groups.map(([region, places]) => (
            <PlaceGroup
              key={region}
              region={region}
              places={places}
              onAddToSchedule={setSelected}
            />
          ))}
        </div>
      )}
      <AddToItineraryModal
        key={selected?.id ?? 'closed'}
        place={selected}
        tripDates={{
          start: query.data.trip.startDate,
          end: query.data.trip.endDate
        }}
        pending={mutation.isPending}
        onClose={() => setSelected(null)}
        onSave={async (input) => {
          await mutation.mutateAsync({tripId, ...input});
          setSelected(null);
          toast.success(ti('added'));
        }}
      />
    </div>
  );
}
