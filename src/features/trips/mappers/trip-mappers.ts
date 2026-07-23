import type {
  CollectedItem,
  CollectedItemStatus,
  CollectedItemType
} from '@/features/collection/types/collected-item';
import type {ItineraryItem} from '@/features/itinerary/types/itinerary';
import type {
  Place,
  PlaceCategory,
  TripPlace,
  TripPlaceStatus
} from '@/features/places/types/place';
import type {
  PaymentStatus,
  Reservation,
  ReservationType
} from '@/features/reservations/types/reservation';
import type {Database} from '@/lib/supabase/database.types';
import {getTripStatus} from '@/shared/date/date-utils';

import type {Trip} from '../types/trip';

type Tables = Database['public']['Tables'];

export function mapTrip(row: Tables['trips']['Row']): Trip {
  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    originCountryCode: row.origin_country_code,
    destinationCountryCode: row.destination_country_code,
    language: row.language,
    startDate: row.start_date,
    endDate: row.end_date,
    coverImagePath: row.cover_image_path,
    status: getTripStatus(row.start_date, row.end_date),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function mapCollectedItem(
  row: Tables['collected_items']['Row'],
  imagePreview: {
    url: string | null;
    width: number | null;
    height: number | null;
  } | null = null
): CollectedItem {
  return {
    id: row.id,
    tripId: row.trip_id,
    type: row.type as CollectedItemType,
    sourceUrl: row.source_url,
    sourcePlatform: row.source_platform,
    originalText: row.original_text,
    memo: row.memo,
    imagePreviewUrl: imagePreview?.url ?? null,
    imageWidth: imagePreview?.width ?? null,
    imageHeight: imagePreview?.height ?? null,
    status: row.status as CollectedItemStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function mapPlace(row: Tables['places']['Row']): Place {
  return {
    id: row.id,
    createdBy: row.created_by,
    visibility:
      row.visibility === 'public'
        ? 'public'
        : row.visibility === 'shared'
          ? 'shared'
          : 'private',
    countryCode: row.country_code,
    localName: row.local_name,
    translatedName: row.translated_name,
    addressLocal: row.address_local,
    addressTranslated: row.address_translated,
    latitude: row.latitude,
    longitude: row.longitude,
    region: row.region,
    category: row.category as PlaceCategory,
    officialUrl: row.official_url,
    instagramUrl: row.instagram_url,
    naverMapUrl: row.naver_map_url,
    kakaoMapUrl: row.kakao_map_url,
    googleMapUrl: row.google_map_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function mapTripPlace(
  row: Tables['trip_places']['Row'],
  place: Place
): TripPlace {
  return {
    id: row.id,
    tripId: row.trip_id,
    placeId: row.place_id,
    collectedItemId: row.collected_item_id,
    memo: row.memo,
    priority: row.priority,
    status: row.status as TripPlaceStatus,
    place,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function mapItineraryItem(
  row: Tables['itinerary_items']['Row'],
  tripPlace?: TripPlace
): ItineraryItem {
  return {
    id: row.id,
    tripId: row.trip_id,
    tripPlaceId: row.trip_place_id,
    reservationId: row.reservation_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    title: row.title,
    memo: row.memo,
    sortOrder: row.sort_order,
    placeName: tripPlace?.place.localName ?? null,
    addressLocal: tripPlace?.place.addressLocal ?? null,
    addressTranslated: tripPlace?.place.addressTranslated ?? null,
    mapUrl: tripPlace?.place.googleMapUrl ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function mapReservation(
  row: Tables['reservations']['Row']
): Reservation {
  return {
    id: row.id,
    tripId: row.trip_id,
    type: row.type as ReservationType,
    title: row.title,
    reservationDate: row.reservation_date,
    reservationTime: row.reservation_time,
    confirmationNumber: row.confirmation_number,
    bookedName: row.booked_name,
    address: row.address,
    originalUrl: row.original_url,
    cancellationDeadline: row.cancellation_deadline,
    paymentStatus: row.payment_status as PaymentStatus,
    memo: row.memo,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
