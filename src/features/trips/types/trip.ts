export type TripStatus = 'upcoming' | 'active' | 'past';

export interface Trip {
  id: string;
  ownerId: string;
  title: string;
  originCountryCode: string;
  destinationCountryCode: string;
  language: string;
  startDate: string;
  endDate: string;
  coverImagePath: string | null;
  status: TripStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripInput {
  title: string;
  originCountryCode: string;
  destinationCountryCode: string;
  language: string;
  startDate: string;
  endDate: string;
}
