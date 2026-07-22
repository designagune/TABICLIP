'use client';

import {Plus, TicketCheck} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {toast} from 'sonner';
import {z} from 'zod';

import {PageHeading} from '@/components/page-heading';
import {EmptyState} from '@/components/states/empty-state';
import {ErrorState} from '@/components/states/error-state';
import {ScreenSkeleton} from '@/components/states/screen-skeleton';
import {Button} from '@/components/ui/button';
import {Modal} from '@/components/ui/modal';
import {
  useCreateReservation,
  useDeleteReservation,
  useTripWorkspace,
  useUpdateReservation
} from '@/features/trips/queries/use-trip-queries';

import {reservationSchema} from '../schemas/reservation-schema';
import type {Reservation} from '../types/reservation';
import {ReservationCard} from './reservation-card';
import {ReservationFormModal} from './reservation-form-modal';

type ReservationFormValues = z.infer<typeof reservationSchema>;

export function ReservationsScreen({tripId}: {tripId: string}) {
  const t = useTranslations('reservations');
  const tc = useTranslations('common.actions');
  const query = useTripWorkspace(tripId);
  const createMutation = useCreateReservation(tripId);
  const updateMutation = useUpdateReservation(tripId);
  const deleteMutation = useDeleteReservation(tripId);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [deleting, setDeleting] = useState<Reservation | null>(null);

  if (query.isPending) return <ScreenSkeleton />;
  if (query.isError) {
    return (
      <ErrorState
        title={t('title')}
        retryLabel={tc('retry')}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  async function save(values: ReservationFormValues) {
    const input = {
      tripId,
      ...values,
      reservationTime: values.reservationTime || undefined,
      confirmationNumber: values.confirmationNumber || undefined,
      bookedName: values.bookedName || undefined,
      address: values.address || undefined,
      originalUrl: values.originalUrl || undefined,
      cancellationDeadline: values.cancellationDeadline || undefined,
      memo: values.memo || undefined
    };
    if (editing) await updateMutation.mutateAsync({...input, id: editing.id});
    else await createMutation.mutateAsync(input);
    closeForm();
    toast.success(t('save'));
  }

  return (
    <div>
      <PageHeading
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        action={
          <Button
            type="button"
            size="icon"
            aria-label={t('new')}
            onClick={() => setFormOpen(true)}
          >
            <Plus aria-hidden="true" className="size-5" />
          </Button>
        }
      />
      {query.data.reservations.length === 0 ? (
        <EmptyState
          icon={TicketCheck}
          title={t('emptyTitle')}
          description={t('emptyBody')}
          action={
            <Button type="button" onClick={() => setFormOpen(true)}>
              <Plus aria-hidden="true" className="size-4" />
              {t('new')}
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {query.data.reservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onEdit={(value) => {
                setEditing(value);
                setFormOpen(true);
              }}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}
      <ReservationFormModal
        open={formOpen}
        reservation={editing}
        defaultDate={query.data.trip.startDate}
        pending={createMutation.isPending || updateMutation.isPending}
        onClose={closeForm}
        onSave={save}
      />
      <Modal
        open={Boolean(deleting)}
        title={t('deleteTitle')}
        description={t('deleteBody')}
        closeLabel={tc('close')}
        onClose={() => setDeleting(null)}
      >
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setDeleting(null)}
          >
            {tc('cancel')}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={deleteMutation.isPending}
            onClick={async () => {
              if (!deleting) return;
              await deleteMutation.mutateAsync(deleting.id);
              setDeleting(null);
            }}
          >
            {tc('delete')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
