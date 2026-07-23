'use client';

import {
  CalendarCheck,
  CalendarPlus,
  MapPinned,
  MoveUpRight
} from 'lucide-react';
import {useTranslations} from 'next-intl';

import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import type {ItineraryItem} from '@/features/itinerary/types/itinerary';
import {platformService} from '@/shared/platform/browser-platform-service';

import type {TripPlace} from '../types/place';

export function PlaceCard({
  tripPlace,
  itineraryItem,
  dayNumber,
  onSelectSchedule
}: {
  tripPlace: TripPlace;
  itineraryItem: ItineraryItem | null;
  dayNumber: number | null;
  onSelectSchedule: (place: TripPlace) => void;
}) {
  const t = useTranslations('places');
  const place = tripPlace.place;

  return (
    <article className="bg-card overflow-hidden rounded-[1.5rem] border shadow-[0_8px_24px_rgb(32_37_31_/_5%)]">
      <div className="bg-muted paper-grid grid h-28 place-items-center border-b">
        <MapPinned aria-hidden="true" className="text-primary/65 size-8" />
        <span className="sr-only">{t('withoutImage')}</span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-xs font-bold">
              {place.localName}
            </p>
            <h3 className="mt-1 text-lg font-black">
              {place.translatedName || place.localName}
            </h3>
          </div>
          <Badge tone={tripPlace.status === 'planned' ? 'success' : 'neutral'}>
            {t(tripPlace.status === 'planned' ? 'planned' : 'candidate')}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          {place.addressLocal}
        </p>
        {tripPlace.memo ? (
          <p className="mt-3 text-sm leading-6">{tripPlace.memo}</p>
        ) : null}
        {itineraryItem ? (
          <div className="bg-primary/8 text-primary mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold">
            <CalendarCheck aria-hidden="true" className="size-4 shrink-0" />
            <span>
              {t('scheduledFor', {
                day: dayNumber ?? 1,
                date: itineraryItem.date,
                time: itineraryItem.startTime ?? t('timeUnscheduled')
              })}
            </span>
          </div>
        ) : null}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              void platformService.openExternalMap({
                address: place.addressLocal,
                url: place.googleMapUrl ?? undefined
              })
            }
          >
            <MoveUpRight aria-hidden="true" className="size-4" />
            {t('openMap')}
          </Button>
          <Button type="button" onClick={() => onSelectSchedule(tripPlace)}>
            {itineraryItem ? (
              <CalendarCheck aria-hidden="true" className="size-4" />
            ) : (
              <CalendarPlus aria-hidden="true" className="size-4" />
            )}
            {t(itineraryItem ? 'editSchedule' : 'addToSchedule')}
          </Button>
        </div>
      </div>
    </article>
  );
}
