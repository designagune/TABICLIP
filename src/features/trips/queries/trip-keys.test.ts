import {expect, it} from 'vitest';

import {
  collectionKeys,
  itineraryKeys,
  reservationKeys,
  tripKeys
} from './trip-keys';

it('creates stable feature-scoped query keys', () => {
  expect(tripKeys.detail('trip-1')).toEqual(['trips', 'trip-1']);
  expect(collectionKeys.all('trip-1')).toEqual([
    'trips',
    'trip-1',
    'collection'
  ]);
  expect(itineraryKeys.byDate('trip-1', '2026-07-21')).toEqual([
    'trips',
    'trip-1',
    'itinerary',
    '2026-07-21'
  ]);
  expect(reservationKeys.all('trip-1')).toEqual([
    'trips',
    'trip-1',
    'reservations'
  ]);
});
