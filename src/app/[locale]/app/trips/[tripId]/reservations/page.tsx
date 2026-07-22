import {ReservationsScreen} from '@/features/reservations/components/reservations-screen';

export default async function ReservationsPage({
  params
}: {
  params: Promise<{tripId: string}>;
}) {
  const {tripId} = await params;
  return <ReservationsScreen tripId={tripId} />;
}
