'use client';

import {Check, Clipboard, Map, TicketCheck} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useState} from 'react';

import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Link} from '@/i18n/navigation';
import {platformService} from '@/shared/platform/browser-platform-service';

import type {ItineraryItem} from '../types/itinerary';

export function TravelModeCard({
  item,
  tripId,
  label
}: {
  item: ItineraryItem;
  tripId: string;
  label: string;
}) {
  const t = useTranslations('itinerary.today');
  const tc = useTranslations('common.actions');
  const [copied, setCopied] = useState(false);
  const address = item.addressLocal ?? item.addressTranslated ?? '';

  return (
    <article className="bg-card overflow-hidden rounded-[2rem] border shadow-xl">
      <div className="bg-secondary p-6 text-white">
        <div className="flex items-center justify-between gap-3">
          <Badge className="bg-white/15 text-white">{label}</Badge>
          <span className="text-lg font-black">{item.startTime ?? '–:–'}</span>
        </div>
        <p className="mt-8 text-sm font-bold text-white/65">{item.placeName}</p>
        <h2 className="mt-1 text-3xl font-black tracking-[-0.05em]">
          {item.title}
        </h2>
      </div>
      <div className="p-5">
        <p className="text-muted-foreground text-xs font-black tracking-[0.12em] uppercase">
          {t('address')}
        </p>
        <p className="mt-2 text-lg leading-8 font-bold break-words">
          {address}
        </p>
        {item.addressTranslated && item.addressTranslated !== address ? (
          <p className="text-muted-foreground mt-1 text-sm leading-6">
            {item.addressTranslated}
          </p>
        ) : null}
        {item.memo ? (
          <p className="bg-muted mt-4 rounded-xl p-3 text-sm leading-6">
            {item.memo}
          </p>
        ) : null}
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button
            type="button"
            size="lg"
            onClick={() =>
              void platformService.openExternalMap({
                address,
                url: item.mapUrl ?? undefined
              })
            }
          >
            <Map aria-hidden="true" className="size-5" />
            {t('openMap')}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={async () => {
              await platformService.copyText(address);
              setCopied(true);
            }}
          >
            {copied ? (
              <Check aria-hidden="true" className="text-success size-5" />
            ) : (
              <Clipboard aria-hidden="true" className="size-5" />
            )}
            {copied ? tc('copied') : t('copyAddress')}
          </Button>
        </div>
        <Link
          href={`/app/trips/${tripId}/reservations`}
          className="hover:bg-muted mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold"
        >
          <TicketCheck aria-hidden="true" className="size-5" />
          {t('reservation')}
        </Link>
      </div>
    </article>
  );
}
