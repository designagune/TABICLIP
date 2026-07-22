export type PlaceCategory =
  'sightseeing' | 'food' | 'cafe' | 'shopping' | 'stay' | 'other';
export type TripPlaceStatus = 'candidate' | 'planned' | 'visited' | 'skipped';

export interface Place {
  id: string;
  createdBy: string;
  visibility: 'private' | 'shared' | 'public';
  countryCode: string;
  localName: string;
  translatedName: string;
  addressLocal: string;
  addressTranslated: string;
  latitude: number | null;
  longitude: number | null;
  region: string;
  category: PlaceCategory;
  officialUrl: string | null;
  instagramUrl: string | null;
  naverMapUrl: string | null;
  kakaoMapUrl: string | null;
  googleMapUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TripPlace {
  id: string;
  tripId: string;
  placeId: string;
  collectedItemId: string | null;
  memo: string;
  priority: number;
  status: TripPlaceStatus;
  place: Place;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizeCollectedItemInput {
  tripId: string;
  collectedItemId: string;
  localName: string;
  translatedName: string;
  addressLocal: string;
  addressTranslated: string;
  region: string;
  category: PlaceCategory;
  memo: string;
  googleMapUrl?: string;
}
