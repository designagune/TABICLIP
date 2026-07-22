import {ScheduleScreen} from '@/features/itinerary/components/schedule-screen';

export default async function SchedulePage({
  params
}: {
  params: Promise<{tripId: string}>;
}) {
  const {tripId} = await params;
  return <ScheduleScreen tripId={tripId} />;
}
