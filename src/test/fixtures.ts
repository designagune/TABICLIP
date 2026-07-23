import type {CollectedItem} from '@/features/collection/types/collected-item';
import type {ItineraryItem} from '@/features/itinerary/types/itinerary';
import type {Place, TripPlace} from '@/features/places/types/place';
import type {Reservation} from '@/features/reservations/types/reservation';
import type {Trip} from '@/features/trips/types/trip';

const timestamp = '2026-07-21T00:00:00.000Z';

export const tripFixture: Trip = {
  id: 'demo-trip',
  ownerId: 'user',
  title: '夏のソウル、3泊4日 — 聖水・鍾路・漢南洞をゆっくり巡る旅',
  originCountryCode: 'JP',
  destinationCountryCode: 'KR',
  language: 'ja',
  startDate: '2026-07-21',
  endDate: '2026-07-24',
  coverImagePath: null,
  status: 'active',
  createdAt: timestamp,
  updatedAt: timestamp
};

export const collectedItemFixture: CollectedItem = {
  id: 'clip',
  tripId: 'demo-trip',
  type: 'url',
  sourceUrl: 'https://example.com/seongsu',
  sourcePlatform: 'example.com',
  originalText: null,
  memo: '聖水で朝から開いている、塩パンが人気の小さなベーカリーカフェ',
  imagePreviewUrl: null,
  imageWidth: null,
  imageHeight: null,
  status: 'inbox',
  createdAt: timestamp,
  updatedAt: timestamp
};

export const placeFixture: Place = {
  id: 'place',
  createdBy: 'user',
  visibility: 'private',
  countryCode: 'KR',
  localName: '서울숲',
  translatedName: 'ソウルの森',
  addressLocal: '서울특별시 성동구 뚝섬로 273',
  addressTranslated: 'ソウル特別市 城東区 トゥクソム路273',
  latitude: 37.5444,
  longitude: 127.0374,
  region: '聖水・ソンス',
  category: 'sightseeing',
  officialUrl: null,
  instagramUrl: null,
  naverMapUrl: null,
  kakaoMapUrl: null,
  googleMapUrl: 'https://maps.google.com',
  createdAt: timestamp,
  updatedAt: timestamp
};

export const tripPlaceFixture: TripPlace = {
  id: 'trip-place',
  tripId: 'demo-trip',
  placeId: 'place',
  collectedItemId: 'clip',
  memo: '午前中に散歩。近くのカフェまで歩く。',
  priority: 1,
  status: 'candidate',
  place: placeFixture,
  createdAt: timestamp,
  updatedAt: timestamp
};

export const itineraryFixture: ItineraryItem = {
  id: 'itinerary',
  tripId: 'demo-trip',
  tripPlaceId: 'trip-place',
  reservationId: null,
  date: '2026-07-21',
  startTime: '10:00',
  endTime: null,
  title: 'ソウルの森',
  memo: '2番出口から徒歩。木陰の道を通る。',
  sortOrder: 0,
  placeName: '서울숲',
  addressLocal: '서울특별시 성동구 뚝섬로 273',
  addressTranslated: 'ソウル特別市 城東区 トゥクソム路273',
  mapUrl: 'https://maps.google.com',
  createdAt: timestamp,
  updatedAt: timestamp
};

export const reservationFixture: Reservation = {
  id: 'reservation',
  tripId: 'demo-trip',
  type: 'stay',
  title: 'ホテル ソウルステイ',
  reservationDate: '2026-07-21',
  reservationTime: '15:00',
  confirmationNumber: 'TC-2407',
  bookedName: 'TABI HANAKO',
  address: '서울특별시 중구 을지로 100',
  originalUrl: null,
  cancellationDeadline: null,
  paymentStatus: 'paid',
  memo: 'フロントでパスポートを提示',
  createdAt: timestamp,
  updatedAt: timestamp
};
