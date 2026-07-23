import type {CollectedItem} from '@/features/collection/types/collected-item';
import type {ItineraryItem} from '@/features/itinerary/types/itinerary';
import type {Place, TripPlace} from '@/features/places/types/place';
import type {Reservation} from '@/features/reservations/types/reservation';
import {addDays, getTripStatus, toIsoDate} from '@/shared/date/date-utils';

import type {CreateTripInput, Trip} from '../types/trip';
import type {TripWorkspace} from '../types/trip-workspace';
import type {TripWorkspaceRepository} from './trip-workspace-repository';

type Clock = () => Date;

interface MockDatabase {
  trips: Trip[];
  collectedItems: CollectedItem[];
  places: TripPlace[];
  itineraryItems: ItineraryItem[];
  reservations: Reservation[];
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function createSeed(clock: Clock): MockDatabase {
  const now = clock();
  const today = toIsoDate(now);
  const endDate = toIsoDate(addDays(now, 3));
  const timestamp = now.toISOString();
  const place: Place = {
    id: 'place-seoul-forest',
    createdBy: 'mock-user',
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
    officialUrl: 'https://parks.seoul.go.kr/',
    instagramUrl: null,
    naverMapUrl: null,
    kakaoMapUrl: null,
    googleMapUrl:
      'https://www.google.com/maps/search/?api=1&query=%EC%84%9C%EC%9A%B8%EC%88%B2',
    createdAt: timestamp,
    updatedAt: timestamp
  };

  return {
    trips: [
      {
        id: 'demo-trip',
        ownerId: 'mock-user',
        title: '夏のソウル、3泊4日',
        originCountryCode: 'JP',
        destinationCountryCode: 'KR',
        language: 'ja',
        startDate: today,
        endDate,
        coverImagePath: null,
        status: 'active',
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ],
    collectedItems: [
      {
        id: 'clip-seongsu-cafe',
        tripId: 'demo-trip',
        type: 'url',
        sourceUrl: 'https://example.com/seongsu-cafe',
        sourcePlatform: 'web',
        originalText: null,
        memo: '聖水で朝から開いているベーカリーカフェ',
        imagePreviewUrl: null,
        imageWidth: null,
        imageHeight: null,
        status: 'inbox',
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 'clip-seoul-forest',
        tripId: 'demo-trip',
        type: 'text',
        sourceUrl: null,
        sourcePlatform: null,
        originalText: 'ソウルの森。朝の散歩に良さそう。',
        memo: null,
        imagePreviewUrl: null,
        imageWidth: null,
        imageHeight: null,
        status: 'organized',
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ],
    places: [
      {
        id: 'trip-place-seoul-forest',
        tripId: 'demo-trip',
        placeId: place.id,
        collectedItemId: 'clip-seoul-forest',
        memo: '午前中に散歩。カフェへ歩いて移動。',
        priority: 1,
        status: 'planned',
        place,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ],
    itineraryItems: [
      {
        id: 'itinerary-seoul-forest',
        tripId: 'demo-trip',
        tripPlaceId: 'trip-place-seoul-forest',
        reservationId: null,
        date: today,
        startTime: '10:00',
        endTime: null,
        title: place.translatedName,
        memo: '2番出口から徒歩。',
        sortOrder: 0,
        placeName: place.localName,
        addressLocal: place.addressLocal,
        addressTranslated: place.addressTranslated,
        mapUrl: place.googleMapUrl,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ],
    reservations: [
      {
        id: 'reservation-hotel',
        tripId: 'demo-trip',
        type: 'stay',
        title: 'ホテル ソウルステイ',
        reservationDate: today,
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
      }
    ]
  };
}

function sourcePlatform(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'web';
  }
}

export function createMockTripWorkspaceRepository(
  clock: Clock = () => new Date()
): TripWorkspaceRepository & {reset(): void} {
  let database = createSeed(clock);
  let sequence = 0;
  const id = (prefix: string) => `${prefix}-${++sequence}`;
  const timestamp = () => clock().toISOString();

  const repository: TripWorkspaceRepository & {reset(): void} = {
    async listTrips() {
      return clone(
        database.trips.map((trip) => ({
          ...trip,
          status: getTripStatus(trip.startDate, trip.endDate, clock())
        }))
      );
    },

    async createTrip(input: CreateTripInput) {
      const now = timestamp();
      const trip: Trip = {
        id: id('trip'),
        ownerId: 'mock-user',
        ...input,
        coverImagePath: null,
        status: getTripStatus(input.startDate, input.endDate, clock()),
        createdAt: now,
        updatedAt: now
      };
      database.trips.unshift(trip);
      return clone(trip);
    },

    async getWorkspace(tripId: string) {
      const trip = database.trips.find((candidate) => candidate.id === tripId);
      if (!trip) throw new Error('TRIP_NOT_FOUND');
      const workspace: TripWorkspace = {
        trip,
        collectedItems: database.collectedItems.filter(
          (item) => item.tripId === tripId
        ),
        places: database.places.filter((item) => item.tripId === tripId),
        itineraryItems: database.itineraryItems
          .filter((item) => item.tripId === tripId)
          .sort(
            (a, b) => a.date.localeCompare(b.date) || a.sortOrder - b.sortOrder
          ),
        reservations: database.reservations.filter(
          (item) => item.tripId === tripId
        )
      };
      return clone(workspace);
    },

    async addCollectedItem(input) {
      const now = timestamp();
      const item: CollectedItem = {
        id: id('clip'),
        tripId: input.tripId,
        type: input.type,
        sourceUrl: input.sourceUrl ?? null,
        sourcePlatform: sourcePlatform(input.sourceUrl),
        originalText: input.originalText ?? null,
        memo: input.memo ?? null,
        imagePreviewUrl: input.image ? URL.createObjectURL(input.image) : null,
        imageWidth: null,
        imageHeight: null,
        status: 'inbox',
        createdAt: now,
        updatedAt: now
      };
      database.collectedItems.unshift(item);
      return clone(item);
    },

    async organizeCollectedItem(input) {
      const collectedItem = database.collectedItems.find(
        (item) =>
          item.id === input.collectedItemId && item.tripId === input.tripId
      );
      if (!collectedItem) throw new Error('COLLECTED_ITEM_NOT_FOUND');
      const trip = database.trips.find(
        (candidate) => candidate.id === input.tripId
      );
      if (!trip) throw new Error('TRIP_NOT_FOUND');
      const now = timestamp();
      const place: Place = {
        id: id('place'),
        createdBy: trip.ownerId,
        visibility: 'private',
        countryCode: trip.destinationCountryCode,
        localName: input.localName,
        translatedName: input.translatedName,
        addressLocal: input.addressLocal,
        addressTranslated: input.addressTranslated,
        latitude: null,
        longitude: null,
        region: input.region,
        category: input.category,
        officialUrl: null,
        instagramUrl: null,
        naverMapUrl: null,
        kakaoMapUrl: null,
        googleMapUrl: input.googleMapUrl || null,
        createdAt: now,
        updatedAt: now
      };
      const tripPlace: TripPlace = {
        id: id('trip-place'),
        tripId: input.tripId,
        placeId: place.id,
        collectedItemId: collectedItem.id,
        memo: input.memo,
        priority: 0,
        status: 'candidate',
        place,
        createdAt: now,
        updatedAt: now
      };
      collectedItem.status = 'organized';
      collectedItem.updatedAt = now;
      database.places.push(tripPlace);
      return clone(tripPlace);
    },

    async addItineraryItem(input) {
      const tripPlace = database.places.find(
        (item) => item.id === input.tripPlaceId && item.tripId === input.tripId
      );
      if (!tripPlace) throw new Error('PLACE_NOT_FOUND');
      const now = timestamp();
      const sameDayItems = database.itineraryItems.filter(
        (item) => item.tripId === input.tripId && item.date === input.date
      );
      const itineraryItem: ItineraryItem = {
        id: id('itinerary'),
        tripId: input.tripId,
        tripPlaceId: tripPlace.id,
        reservationId: null,
        date: input.date,
        startTime: input.startTime || null,
        endTime: null,
        title: tripPlace.place.translatedName || tripPlace.place.localName,
        memo: input.memo ?? '',
        sortOrder: sameDayItems.length,
        placeName: tripPlace.place.localName,
        addressLocal: tripPlace.place.addressLocal,
        addressTranslated: tripPlace.place.addressTranslated,
        mapUrl: tripPlace.place.googleMapUrl,
        createdAt: now,
        updatedAt: now
      };
      tripPlace.status = 'planned';
      tripPlace.updatedAt = now;
      database.itineraryItems.push(itineraryItem);
      return clone(itineraryItem);
    },

    async moveItineraryItem(tripId, itemId, direction) {
      const target = database.itineraryItems.find(
        (item) => item.id === itemId && item.tripId === tripId
      );
      if (!target) throw new Error('ITINERARY_ITEM_NOT_FOUND');
      const siblings = database.itineraryItems
        .filter((item) => item.tripId === tripId && item.date === target.date)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      const currentIndex = siblings.findIndex((item) => item.id === itemId);
      const swapWith = siblings[currentIndex + direction];
      if (!swapWith) return;
      const previousOrder = target.sortOrder;
      target.sortOrder = swapWith.sortOrder;
      swapWith.sortOrder = previousOrder;
    },

    async createReservation(input) {
      const now = timestamp();
      const reservation: Reservation = {
        id: id('reservation'),
        tripId: input.tripId,
        type: input.type,
        title: input.title,
        reservationDate: input.reservationDate,
        reservationTime: input.reservationTime || null,
        confirmationNumber: input.confirmationNumber || null,
        bookedName: input.bookedName || null,
        address: input.address || null,
        originalUrl: input.originalUrl || null,
        cancellationDeadline: input.cancellationDeadline || null,
        paymentStatus: input.paymentStatus,
        memo: input.memo ?? '',
        createdAt: now,
        updatedAt: now
      };
      database.reservations.push(reservation);
      return clone(reservation);
    },

    async updateReservation(input) {
      const reservation = database.reservations.find(
        (item) => item.id === input.id && item.tripId === input.tripId
      );
      if (!reservation) throw new Error('RESERVATION_NOT_FOUND');
      Object.assign(reservation, {
        type: input.type,
        title: input.title,
        reservationDate: input.reservationDate,
        reservationTime: input.reservationTime || null,
        confirmationNumber: input.confirmationNumber || null,
        bookedName: input.bookedName || null,
        address: input.address || null,
        originalUrl: input.originalUrl || null,
        cancellationDeadline: input.cancellationDeadline || null,
        paymentStatus: input.paymentStatus,
        memo: input.memo ?? '',
        updatedAt: timestamp()
      });
      return clone(reservation);
    },

    async deleteReservation(tripId, reservationId) {
      database.reservations = database.reservations.filter(
        (item) => !(item.tripId === tripId && item.id === reservationId)
      );
    },

    reset() {
      database = createSeed(clock);
      sequence = 0;
    }
  };

  return repository;
}

export const mockTripWorkspaceRepository = createMockTripWorkspaceRepository();
