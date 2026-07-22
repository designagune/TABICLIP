'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {LoaderCircle} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {Button} from '@/components/ui/button';
import {FieldError} from '@/components/ui/field-error';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Modal} from '@/components/ui/modal';
import {Textarea} from '@/components/ui/textarea';

import {reservationSchema} from '../schemas/reservation-schema';
import type {Reservation} from '../types/reservation';

type ReservationFormValues = z.infer<typeof reservationSchema>;

export function ReservationFormModal({
  open,
  reservation,
  defaultDate,
  pending,
  onClose,
  onSave
}: {
  open: boolean;
  reservation: Reservation | null;
  defaultDate: string;
  pending: boolean;
  onClose: () => void;
  onSave: (values: ReservationFormValues) => Promise<void>;
}) {
  const t = useTranslations('reservations');
  const tc = useTranslations('common.actions');
  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    values: {
      type: reservation?.type ?? 'stay',
      title: reservation?.title ?? '',
      reservationDate: reservation?.reservationDate ?? defaultDate,
      reservationTime: reservation?.reservationTime ?? '',
      confirmationNumber: reservation?.confirmationNumber ?? '',
      bookedName: reservation?.bookedName ?? '',
      address: reservation?.address ?? '',
      originalUrl: reservation?.originalUrl ?? '',
      cancellationDeadline: reservation?.cancellationDeadline ?? '',
      paymentStatus: reservation?.paymentStatus ?? 'pending',
      memo: reservation?.memo ?? ''
    }
  });

  return (
    <Modal
      open={open}
      title={t('formTitle')}
      closeLabel={tc('close')}
      onClose={onClose}
    >
      <form
        onSubmit={form.handleSubmit(onSave)}
        className="space-y-5"
        noValidate
      >
        <div>
          <Label htmlFor="reservation-title">{t('name')}</Label>
          <Input id="reservation-title" {...form.register('title')} />
          <FieldError id="reservation-title-error">
            {form.formState.errors.title
              ? t('validation.titleRequired')
              : undefined}
          </FieldError>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reservation-type">{t('type')}</Label>
            <select
              id="reservation-type"
              className="bg-card min-h-12 w-full rounded-xl border px-3 text-base"
              {...form.register('type')}
            >
              {(
                ['stay', 'transport', 'food', 'activity', 'other'] as const
              ).map((type) => (
                <option key={type} value={type}>
                  {t(`types.${type}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="reservation-payment">{t('paymentPending')}</Label>
            <select
              id="reservation-payment"
              className="bg-card min-h-12 w-full rounded-xl border px-3 text-base"
              {...form.register('paymentStatus')}
            >
              <option value="pending">{t('paymentPending')}</option>
              <option value="paid">{t('paymentPaid')}</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reservation-date">{t('date')}</Label>
            <Input
              id="reservation-date"
              type="date"
              {...form.register('reservationDate')}
            />
          </div>
          <div>
            <Label htmlFor="reservation-time">{t('time')}</Label>
            <Input
              id="reservation-time"
              type="time"
              {...form.register('reservationTime')}
            />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="reservation-number">{t('number')}</Label>
            <Input
              id="reservation-number"
              {...form.register('confirmationNumber')}
            />
          </div>
          <div>
            <Label htmlFor="reservation-name">{t('bookedName')}</Label>
            <Input id="reservation-name" {...form.register('bookedName')} />
          </div>
        </div>
        <div>
          <Label htmlFor="reservation-address">{t('address')}</Label>
          <Input id="reservation-address" {...form.register('address')} />
        </div>
        <div>
          <Label htmlFor="reservation-url">{t('url')}</Label>
          <Input
            id="reservation-url"
            type="url"
            {...form.register('originalUrl')}
          />
        </div>
        <div>
          <Label htmlFor="reservation-deadline">{t('deadline')}</Label>
          <Input
            id="reservation-deadline"
            type="datetime-local"
            {...form.register('cancellationDeadline')}
          />
        </div>
        <div>
          <Label htmlFor="reservation-memo">{t('memo')}</Label>
          <Textarea id="reservation-memo" {...form.register('memo')} />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? (
            <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
          ) : null}
          {t('save')}
        </Button>
      </form>
    </Modal>
  );
}
