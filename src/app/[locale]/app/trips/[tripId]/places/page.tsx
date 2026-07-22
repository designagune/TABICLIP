import {PlacesScreen} from '@/features/places/components/places-screen';

export default async function PlacesPage({
  params
}: {
  params: Promise<{tripId: string}>;
}) {
  const {tripId} = await params;
  return <PlacesScreen tripId={tripId} />;
}
