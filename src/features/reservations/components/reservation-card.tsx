'use client';

import {CalendarDays, CreditCard, MapPin, Pencil, Trash2} from 'lucide-react';
import {useFormatter, useTranslations} from 'next-intl';

import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';

import type {Reservation} from '../types/reservation';

export function ReservationCard({
  reservation,
  onEdit,
  onDelete
}: {
  reservation: Reservation;
  onEdit: (reservation: Reservation) => void;
  onDelete: (reservation: Reservation) => void;
}) {
  const t = useTranslations('reservations');
  const tc = useTranslations('common.actions');
  const format = useFormatter();
  return (
    <article className="bg-card rounded-[1.5rem] border p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge tone="outline">{t(`types.${reservation.type}`)}</Badge>
          <h2 className="mt-3 text-xl font-black">{reservation.title}</h2>
        </div>
        <Badge
          tone={reservation.paymentStatus === 'paid' ? 'success' : 'neutral'}
        >
          {reservation.paymentStatus === 'paid'
            ? t('paymentPaid')
            : t('paymentPending')}
        </Badge>
      </div>
      <dl className="text-muted-foreground mt-5 space-y-2.5 text-sm">
        <div className="flex items-center gap-2">
          <CalendarDays aria-hidden="true" className="size-4" />
          <dt className="sr-only">{t('date')}</dt>
          <dd>
            {format.dateTime(
              new Date(`${reservation.reservationDate}T12:00:00`),
              {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }
            )}{' '}
            {reservation.reservationTime}
          </dd>
        </div>
        {reservation.confirmationNumber ? (
          <div className="flex items-center gap-2">
            <CreditCard aria-hidden="true" className="size-4" />
            <dt className="sr-only">{t('number')}</dt>
            <dd className="font-mono font-bold">
              {reservation.confirmationNumber}
            </dd>
          </div>
        ) : null}
        {reservation.address ? (
          <div className="flex items-start gap-2">
            <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <dt className="sr-only">{t('address')}</dt>
            <dd>{reservation.address}</dd>
          </div>
        ) : null}
      </dl>
      {reservation.memo ? (
        <p className="bg-muted mt-4 rounded-xl p-3 text-sm">
          {reservation.memo}
        </p>
      ) : null}
      <div className="mt-4 flex justify-end gap-1">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onEdit(reservation)}
        >
          <Pencil aria-hidden="true" className="size-4" />
          {tc('edit')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onDelete(reservation)}
        >
          <Trash2 aria-hidden="true" className="text-danger size-4" />
          {tc('delete')}
        </Button>
      </div>
    </article>
  );
}
