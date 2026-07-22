import {TravelModeScreen} from '@/features/itinerary/components/travel-mode-screen';

export default async function TodayPage({
  params
}: {
  params: Promise<{tripId: string}>;
}) {
  const {tripId} = await params;
  return <TravelModeScreen tripId={tripId} />;
}
