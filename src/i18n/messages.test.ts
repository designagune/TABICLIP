import {describe, expect, it} from 'vitest';

import jaCollection from '@/messages/ja/collection.json';
import jaCommon from '@/messages/ja/common.json';
import jaItinerary from '@/messages/ja/itinerary.json';
import jaPlaces from '@/messages/ja/places.json';
import jaReservations from '@/messages/ja/reservations.json';
import jaTrips from '@/messages/ja/trips.json';
import koCollection from '@/messages/ko/collection.json';
import koCommon from '@/messages/ko/common.json';
import koItinerary from '@/messages/ko/itinerary.json';
import koPlaces from '@/messages/ko/places.json';
import koReservations from '@/messages/ko/reservations.json';
import koTrips from '@/messages/ko/trips.json';

function keys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    keys(child, prefix ? `${prefix}.${key}` : key)
  );
}

describe('locale messages', () => {
  it.each([
    ['common', jaCommon, koCommon],
    ['trips', jaTrips, koTrips],
    ['collection', jaCollection, koCollection],
    ['places', jaPlaces, koPlaces],
    ['itinerary', jaItinerary, koItinerary],
    ['reservations', jaReservations, koReservations]
  ])(
    '%s has matching Japanese and Korean keys',
    (_domain, japanese, korean) => {
      expect(keys(japanese).sort()).toEqual(keys(korean).sort());
    }
  );

  it('ships real Japanese interface copy', () => {
    expect(jaCommon.landing.title).toContain('行きたい');
    expect(jaCollection.organize).toBe('場所に整理');
  });
});
