import {TripHomeScreen} from '@/features/trips/components/trip-home-screen';

export default async function TripHomePage({
  params
}: {
  params: Promise<{tripId: string}>;
}) {
  const {tripId} = await params;
  return <TripHomeScreen tripId={tripId} />;
}
