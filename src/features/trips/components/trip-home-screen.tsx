'use client';

import {
  CalendarDays,
  ChevronRight,
  MapPinned,
  Navigation,
  Paperclip,
  TicketCheck
} from 'lucide-react';
import {useTranslations} from 'next-intl';

import {ErrorState} from '@/components/states/error-state';
import {ScreenSkeleton} from '@/components/states/screen-skeleton';
import {Badge} from '@/components/ui/badge';
import {buttonVariants} from '@/components/ui/button';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/utils';
import {differenceInCalendarDays} from '@/shared/date/date-utils';

import {useTripWorkspace} from '../queries/use-trip-queries';

export function TripHomeScreen({tripId}: {tripId: string}) {
  const t = useTranslations('trips');
  const tc = useTranslations('common.actions');
  const query = useTripWorkspace(tripId);
  if (query.isPending) return <ScreenSkeleton />;
  if (query.isError) {
    return (
      <ErrorState
        title={tc('retry')}
        retryLabel={tc('retry')}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const {trip, collectedItems, places, itineraryItems, reservations} =
    query.data;
  const unorganized = collectedItems.filter(
    (item) => item.status === 'inbox'
  ).length;
  const daysLeft = differenceInCalendarDays(trip.startDate);
  const base = `/app/trips/${tripId}`;

  const metrics = [
    {
      href: `${base}/inbox`,
      label: t('home.collection'),
      value: unorganized,
      icon: Paperclip
    },
    {
      href: `${base}/places`,
      label: t('home.places'),
      value: places.length,
      icon: MapPinned
    },
    {
      href: `${base}/schedule`,
      label: t('home.schedule'),
      value: itineraryItems.length,
      icon: CalendarDays
    }
  ];

  return (
    <div>
      <div className="flex items-center gap-2">
        <Badge tone={trip.status === 'active' ? 'accent' : 'neutral'}>
          {trip.status === 'active' ? t('active') : t('upcoming')}
        </Badge>
        <span className="text-muted-foreground text-xs font-bold">
          {trip.originCountryCode} → {trip.destinationCountryCode}
        </span>
      </div>
      <h1 className="mt-4 text-4xl leading-tight font-black tracking-[-0.055em]">
        {trip.title}
      </h1>

      <section className="bg-secondary mt-7 overflow-hidden rounded-[2rem] p-6 text-white shadow-xl">
        <p className="text-xs font-black tracking-[0.18em] text-white/65 uppercase">
          {t('home.nextTrip')}
        </p>
        <div className="mt-3 flex items-end justify-between gap-4">
          <p className="text-4xl font-black tracking-[-0.05em]">
            {t('home.daysLeft', {count: daysLeft})}
          </p>
          <Navigation aria-hidden="true" className="size-9 text-white/75" />
        </div>
        <Link
          href={`${base}/today`}
          className={cn(
            buttonVariants({variant: 'outline'}),
            'mt-7 w-full border-white/20 bg-white/10 text-white hover:bg-white/20'
          )}
        >
          {t('home.todayMode')}
          <ChevronRight aria-hidden="true" className="size-4" />
        </Link>
      </section>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Link
              key={metric.href}
              href={metric.href}
              className="bg-card min-h-32 rounded-2xl border p-3.5 transition hover:-translate-y-0.5"
            >
              <Icon aria-hidden="true" className="text-primary size-5" />
              <p className="mt-5 text-2xl font-black">{metric.value}</p>
              <p className="text-muted-foreground mt-1 text-[0.68rem] leading-4 font-bold">
                {metric.label}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <Link
          href={`${base}/inbox`}
          className={cn(buttonVariants({size: 'lg'}), 'w-full')}
        >
          <Paperclip aria-hidden="true" className="size-5" />
          {t('home.startCollecting')}
        </Link>
        <Link
          href={`${base}/reservations`}
          className={cn(
            buttonVariants({variant: 'outline', size: 'lg'}),
            'w-full'
          )}
        >
          <TicketCheck aria-hidden="true" className="size-5" />
          {reservations.length} · {t('home.reservations')}
        </Link>
      </div>
    </div>
  );
}
