import {CollectionScreen} from '@/features/collection/components/collection-screen';

export default async function CollectionPage({
  params
}: {
  params: Promise<{tripId: string}>;
}) {
  const {tripId} = await params;
  return <CollectionScreen tripId={tripId} />;
}
