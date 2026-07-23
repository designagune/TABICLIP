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
  useTripWorkspace,
  useUpdateItineraryItem
} from '@/features/trips/queries/use-trip-queries';
import {enumerateDates} from '@/shared/date/date-utils';

import type {TripPlace} from '../types/place';
import {PlaceGroup} from './place-group';

export function PlacesScreen({tripId}: {tripId: string}) {
  const t = useTranslations('places');
  const ti = useTranslations('itinerary');
  const tc = useTranslations('common.actions');
  const query = useTripWorkspace(tripId);
  const mutation = useAddItineraryItem(tripId);
  const updateMutation = useUpdateItineraryItem(tripId);
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

  const itineraryByPlace = useMemo(
    () =>
      new Map(
        (query.data?.itineraryItems ?? []).flatMap((item) =>
          item.tripPlaceId ? [[item.tripPlaceId, item] as const] : []
        )
      ),
    [query.data?.itineraryItems]
  );

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

  const tripDates = enumerateDates(
    query.data.trip.startDate,
    query.data.trip.endDate
  );
  const selectedItineraryItem = selected
    ? (itineraryByPlace.get(selected.id) ?? null)
    : null;

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
              itineraryByPlace={itineraryByPlace}
              tripDates={tripDates}
              onSelectSchedule={setSelected}
            />
          ))}
        </div>
      )}
      <AddToItineraryModal
        key={`${selected?.id ?? 'closed'}-${selectedItineraryItem?.updatedAt ?? 'new'}`}
        place={selected}
        itineraryItem={selectedItineraryItem}
        tripDates={{
          start: query.data.trip.startDate,
          end: query.data.trip.endDate
        }}
        pending={mutation.isPending || updateMutation.isPending}
        onClose={() => setSelected(null)}
        onSave={async (input) => {
          if (selectedItineraryItem) {
            await updateMutation.mutateAsync({
              id: selectedItineraryItem.id,
              tripId,
              date: input.date,
              startTime: input.startTime,
              memo: input.memo
            });
          } else {
            await mutation.mutateAsync({tripId, ...input});
          }
          setSelected(null);
          toast.success(ti(selectedItineraryItem ? 'updated' : 'added'));
        }}
      />
    </div>
  );
}
