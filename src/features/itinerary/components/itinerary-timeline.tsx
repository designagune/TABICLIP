'use client';

import {CalendarPlus} from 'lucide-react';
import {useFormatter, useTranslations} from 'next-intl';

import {EmptyState} from '@/components/states/empty-state';
import type {ItineraryItem} from '../types/itinerary';
import {ItineraryItemCard} from './itinerary-item-card';

export function ItineraryTimeline({
  date,
  dayNumber,
  items,
  onMove
}: {
  date: string;
  dayNumber: number;
  items: ItineraryItem[];
  onMove: (itemId: string, direction: -1 | 1) => void;
}) {
  const t = useTranslations('itinerary');
  const format = useFormatter();
  return (
    <section className="scroll-mt-24" id={`date-${date}`}>
      <header className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-primary text-[0.65rem] font-black tracking-[0.18em]">
            {t('dayNumber', {number: dayNumber})}
          </p>
          <h2 className="mt-1 text-xl font-black">
            {format.dateTime(new Date(`${date}T12:00:00`), {
              month: 'long',
              day: 'numeric',
              weekday: 'short'
            })}
          </h2>
        </div>
        <span className="text-muted-foreground text-xs font-bold">
          {items.length}
        </span>
      </header>
      {items.length ? (
        <div className="relative space-y-2.5">
          <span className="bg-border absolute top-3 bottom-3 left-7 -z-10 w-px" />
          {items.map((item, index) => (
            <ItineraryItemCard
              key={item.id}
              item={item}
              first={index === 0}
              last={index === items.length - 1}
              onMove={(direction) => onMove(item.id, direction)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarPlus}
          title={t('emptyTitle')}
          description={t('emptyBody')}
        />
      )}
    </section>
  );
}
