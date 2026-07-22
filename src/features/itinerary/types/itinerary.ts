export interface ItineraryItem {
  id: string;
  tripId: string;
  tripPlaceId: string | null;
  reservationId: string | null;
  date: string;
  startTime: string | null;
  endTime: string | null;
  title: string;
  memo: string;
  sortOrder: number;
  placeName: string | null;
  addressLocal: string | null;
  addressTranslated: string | null;
  mapUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AddItineraryItemInput {
  tripId: string;
  tripPlaceId: string;
  date: string;
  startTime?: string;
  memo?: string;
}
