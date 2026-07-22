'use client';

import {ChevronDown, ChevronUp, Clock3, MapPin} from 'lucide-react';
import {useTranslations} from 'next-intl';

import {Button} from '@/components/ui/button';

import type {ItineraryItem} from '../types/itinerary';

export function ItineraryItemCard({
  item,
  first,
  last,
  onMove
}: {
  item: ItineraryItem;
  first: boolean;
  last: boolean;
  onMove: (direction: -1 | 1) => void;
}) {
  const t = useTranslations('itinerary');

  return (
    <article className="bg-card relative rounded-2xl border p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="bg-primary/12 text-primary flex min-w-16 shrink-0 items-center justify-center rounded-xl px-2 text-sm font-black">
          {item.startTime ?? t('unscheduled')}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-black">{item.title}</h3>
          {item.placeName ? (
            <p className="text-muted-foreground mt-1 text-xs">
              {item.placeName}
            </p>
          ) : null}
          {item.addressLocal ? (
            <p className="text-muted-foreground mt-2 flex items-start gap-1.5 text-xs leading-5">
              <MapPin aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
              {item.addressLocal}
            </p>
          ) : null}
          {item.memo ? (
            <p className="mt-2 text-sm leading-5">{item.memo}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={first}
            aria-label={t('moveUp')}
            onClick={() => onMove(-1)}
          >
            <ChevronUp aria-hidden="true" className="size-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={last}
            aria-label={t('moveDown')}
            onClick={() => onMove(1)}
          >
            <ChevronDown aria-hidden="true" className="size-5" />
          </Button>
        </div>
      </div>
      {item.startTime ? (
        <span className="sr-only">
          <Clock3 aria-hidden="true" /> {item.startTime}
        </span>
      ) : null}
    </article>
  );
}
