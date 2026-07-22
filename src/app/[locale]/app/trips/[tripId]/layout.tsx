import type {ReactNode} from 'react';

import {TripShell} from '@/components/trip-shell';

export default async function TripLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{tripId: string}>;
}) {
  const {tripId} = await params;
  return <TripShell tripId={tripId}>{children}</TripShell>;
}
