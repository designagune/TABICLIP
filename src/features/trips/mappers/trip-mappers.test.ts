import {describe, expect, it} from 'vitest';

import type {Database} from '@/lib/supabase/database.types';

import {
  mapCollectedItem,
  mapItineraryItem,
  mapPlace,
  mapReservation,
  mapTrip,
  mapTripPlace
} from './trip-mappers';

type Tables = Database['public']['Tables'];
const timestamp = '2026-07-21T00:00:00.000Z';

describe('Supabase row mappers', () => {
  const tripRow: Tables['trips']['Row'] = {
    id: 'trip',
    owner_id: 'user',
    title: '서울 여행',
    origin_country_code: 'JP',
    destination_country_code: 'KR',
    language: 'ja',
    start_date: '2026-07-21',
    end_date: '2026-07-24',
    cover_image_path: null,
    status: 'active',
    created_at: timestamp,
    updated_at: timestamp
  };
  const placeRow: Tables['places']['Row'] = {
    id: 'place',
    created_by: 'user',
    visibility: 'private',
    country_code: 'KR',
    local_name: '서울숲',
    translated_name: 'ソウルの森',
    address_local: '서울 성동구',
    address_translated: 'ソウル 城東区',
    latitude: null,
    longitude: null,
    region: '聖水',
    category: 'sightseeing',
    official_url: null,
    instagram_url: null,
    naver_map_url: null,
    kakao_map_url: null,
    google_map_url: 'https://maps.example.com',
    created_at: timestamp,
    updated_at: timestamp
  };

  it('maps row naming and nullable fields into application models', () => {
    expect(mapTrip(tripRow)).toMatchObject({
      ownerId: 'user',
      destinationCountryCode: 'KR'
    });
    expect(
      mapCollectedItem({
        id: 'clip',
        trip_id: 'trip',
        type: 'url',
        source_url: 'https://example.com',
        source_platform: 'example.com',
        original_text: null,
        memo: null,
        status: 'inbox',
        created_at: timestamp,
        updated_at: timestamp
      })
    ).toMatchObject({type: 'url', imagePreviewUrl: null});
    expect(
      mapCollectedItem(
        {
          id: 'image-clip',
          trip_id: 'trip',
          type: 'image',
          source_url: null,
          source_platform: null,
          original_text: null,
          memo: null,
          status: 'inbox',
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          url: 'https://example.supabase.co/storage/v1/object/sign/private/image.jpg',
          width: 1080,
          height: 1920
        }
      )
    ).toMatchObject({
      type: 'image',
      imagePreviewUrl:
        'https://example.supabase.co/storage/v1/object/sign/private/image.jpg',
      imageWidth: 1080,
      imageHeight: 1920
    });
    expect(mapPlace(placeRow)).toMatchObject({
      localName: '서울숲',
      category: 'sightseeing'
    });
  });

  it('joins trip place context into itinerary display data', () => {
    const tripPlace = mapTripPlace(
      {
        id: 'trip-place',
        trip_id: 'trip',
        place_id: 'place',
        collected_item_id: null,
        memo: '',
        priority: 0,
        status: 'planned',
        created_at: timestamp,
        updated_at: timestamp
      },
      mapPlace(placeRow)
    );
    const itinerary = mapItineraryItem(
      {
        id: 'itinerary',
        trip_id: 'trip',
        trip_place_id: 'trip-place',
        reservation_id: null,
        date: '2026-07-21',
        start_time: '10:00:00',
        end_time: null,
        title: 'ソウルの森',
        memo: '',
        sort_order: 0,
        created_at: timestamp,
        updated_at: timestamp
      },
      tripPlace
    );
    expect(itinerary).toMatchObject({
      placeName: '서울숲',
      addressLocal: '서울 성동구'
    });
    expect(
      mapItineraryItem({...itineraryRow(), trip_place_id: null})
    ).toMatchObject({
      placeName: null,
      mapUrl: null
    });
  });

  it('maps reservations', () => {
    expect(
      mapReservation({
        id: 'reservation',
        trip_id: 'trip',
        type: 'stay',
        title: 'Hotel',
        reservation_date: '2026-07-21',
        reservation_time: null,
        confirmation_number: null,
        booked_name: null,
        address: null,
        original_url: null,
        cancellation_deadline: null,
        payment_status: 'paid',
        memo: '',
        created_at: timestamp,
        updated_at: timestamp
      })
    ).toMatchObject({type: 'stay', paymentStatus: 'paid'});
  });
});

function itineraryRow(): Tables['itinerary_items']['Row'] {
  return {
    id: 'itinerary',
    trip_id: 'trip',
    trip_place_id: 'trip-place',
    reservation_id: null,
    date: '2026-07-21',
    start_time: null,
    end_time: null,
    title: 'Free time',
    memo: '',
    sort_order: 0,
    created_at: timestamp,
    updated_at: timestamp
  };
}
