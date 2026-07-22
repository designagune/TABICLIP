'use client';

import {ArrowRight, CalendarDays, MapPin} from 'lucide-react';
import {useFormatter, useTranslations} from 'next-intl';

import {Badge} from '@/components/ui/badge';
import {Link} from '@/i18n/navigation';
import {enumerateDates} from '@/shared/date/date-utils';

import type {Trip} from '../types/trip';

export function TripCard({trip}: {trip: Trip}) {
  const t = useTranslations('trips');
  const format = useFormatter();
  const statusLabel =
    trip.status === 'active'
      ? t('active')
      : trip.status === 'past'
        ? t('past')
        : t('upcoming');

  return (
    <article className="bg-card group overflow-hidden rounded-[1.75rem] border shadow-[0_10px_30px_rgb(32_37_31_/_6%)] transition hover:-translate-y-0.5 hover:shadow-xl">
      <Link href={`/app/trips/${trip.id}`} className="block p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <Badge tone={trip.status === 'active' ? 'accent' : 'neutral'}>
            {statusLabel}
          </Badge>
          <ArrowRight
            aria-hidden="true"
            className="text-muted-foreground size-5 transition group-hover:translate-x-1"
          />
        </div>
        <h2 className="mt-7 text-2xl font-black tracking-[-0.04em]">
          {trip.title}
        </h2>
        <div className="text-muted-foreground mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          <span className="inline-flex items-center gap-2">
            <CalendarDays aria-hidden="true" className="size-4" />
            {format.dateTime(new Date(`${trip.startDate}T12:00:00`), {
              month: 'short',
              day: 'numeric'
            })}
            {' – '}
            {format.dateTime(new Date(`${trip.endDate}T12:00:00`), {
              month: 'short',
              day: 'numeric'
            })}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin aria-hidden="true" className="size-4" />
            {trip.originCountryCode} → {trip.destinationCountryCode}
          </span>
        </div>
        <p className="text-muted-foreground mt-5 text-xs font-bold">
          {t('days', {
            count: enumerateDates(trip.startDate, trip.endDate).length
          })}
        </p>
      </Link>
    </article>
  );
}
