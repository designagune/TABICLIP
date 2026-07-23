import {beforeEach, describe, expect, it} from 'vitest';

import {createMockTripWorkspaceRepository} from './mock-trip-workspace-repository';

const now = new Date(2026, 6, 21, 10);
const createRepository = () => createMockTripWorkspaceRepository(() => now);

describe('mock trip workspace repository', () => {
  let repository = createRepository();

  beforeEach(() => {
    repository = createRepository();
  });

  it('exposes a deterministic demo workspace', async () => {
    const trips = await repository.listTrips();
    expect(trips).toHaveLength(1);
    expect(trips[0]).toMatchObject({id: 'demo-trip', status: 'active'});
    const workspace = await repository.getWorkspace('demo-trip');
    expect(workspace.collectedItems).toHaveLength(2);
    expect(workspace.itineraryItems[0]?.placeName).toBe('서울숲');
  });

  it('creates an independent trip and validates lookup failures', async () => {
    const trip = await repository.createTrip({
      title: '釜山の週末',
      originCountryCode: 'JP',
      destinationCountryCode: 'KR',
      language: 'ja',
      startDate: '2026-08-10',
      endDate: '2026-08-12'
    });
    expect(trip.status).toBe('upcoming');
    expect(await repository.listTrips()).toHaveLength(2);
    await expect(repository.getWorkspace('missing')).rejects.toThrow(
      'TRIP_NOT_FOUND'
    );
  });

  it('completes URL collection, organization, and itinerary scheduling', async () => {
    const clip = await repository.addCollectedItem({
      tripId: 'demo-trip',
      type: 'url',
      sourceUrl: 'https://www.instagram.com/p/place'
    });
    expect(clip.sourcePlatform).toBe('instagram.com');
    const tripPlace = await repository.organizeCollectedItem({
      tripId: 'demo-trip',
      collectedItemId: clip.id,
      localName: '광장시장',
      translatedName: '広蔵市場',
      addressLocal: '서울특별시 종로구 창경궁로 88',
      addressTranslated: 'ソウル特別市 鍾路区 昌慶宮路88',
      region: '鍾路',
      category: 'food',
      memo: '午前中に行く'
    });
    expect(tripPlace.place.visibility).toBe('private');
    const itinerary = await repository.addItineraryItem({
      tripId: 'demo-trip',
      tripPlaceId: tripPlace.id,
      date: '2026-07-22',
      startTime: '11:30'
    });
    expect(itinerary).toMatchObject({title: '広蔵市場', sortOrder: 0});
    const workspace = await repository.getWorkspace('demo-trip');
    expect(
      workspace.collectedItems.find((item) => item.id === clip.id)?.status
    ).toBe('organized');
    expect(
      workspace.places.find((item) => item.id === tripPlace.id)?.status
    ).toBe('planned');
    await expect(
      repository.addItineraryItem({
        tripId: 'demo-trip',
        tripPlaceId: tripPlace.id,
        date: '2026-07-23'
      })
    ).rejects.toThrow('ITINERARY_PLACE_ALREADY_SCHEDULED');
    const updated = await repository.updateItineraryItem({
      id: itinerary.id,
      tripId: 'demo-trip',
      date: '2026-07-23',
      startTime: '13:15',
      memo: '점심 이후 방문'
    });
    expect(updated).toMatchObject({
      date: '2026-07-23',
      startTime: '13:15',
      memo: '점심 이후 방문'
    });
  });

  it('reorders same-day itinerary items without crossing dates', async () => {
    const clip = await repository.addCollectedItem({
      tripId: 'demo-trip',
      type: 'text',
      originalText: '두 번째 장소'
    });
    const place = await repository.organizeCollectedItem({
      tripId: 'demo-trip',
      collectedItemId: clip.id,
      localName: '광장시장',
      translatedName: '広蔵市場',
      addressLocal: '서울특별시 종로구 창경궁로 88',
      addressTranslated: 'ソウル特別市 鍾路区 昌慶宮路88',
      region: '종로',
      category: 'food',
      memo: ''
    });
    const second = await repository.addItineraryItem({
      tripId: 'demo-trip',
      tripPlaceId: place.id,
      date: '2026-07-21',
      startTime: '12:00'
    });
    await repository.moveItineraryItem('demo-trip', second.id, -1);
    const reordered = await repository.getWorkspace('demo-trip');
    expect(
      reordered.itineraryItems.filter((item) => item.date === '2026-07-21')[0]
        ?.id
    ).toBe(second.id);
    await repository.moveItineraryItem('demo-trip', second.id, -1);
  });

  it('creates, updates, and deletes a reservation', async () => {
    const created = await repository.createReservation({
      tripId: 'demo-trip',
      type: 'food',
      title: '夕食',
      reservationDate: '2026-07-22',
      paymentStatus: 'pending'
    });
    const updated = await repository.updateReservation({
      id: created.id,
      tripId: 'demo-trip',
      type: 'food',
      title: '夕食・変更',
      reservationDate: created.reservationDate,
      paymentStatus: 'paid',
      memo: created.memo
    });
    expect(updated).toMatchObject({title: '夕食・変更', paymentStatus: 'paid'});
    await repository.deleteReservation('demo-trip', created.id);
    expect(
      (await repository.getWorkspace('demo-trip')).reservations.some(
        (item) => item.id === created.id
      )
    ).toBe(false);
  });

  it('keeps image files in transient mock memory only', async () => {
    const clip = await repository.addCollectedItem({
      tripId: 'demo-trip',
      type: 'image',
      image: new File(['image'], 'spot.png', {type: 'image/png'})
    });
    expect(clip.imagePreviewUrl).toBe('blob:mock-preview');
  });

  it('resets all mutations', async () => {
    await repository.addCollectedItem({
      tripId: 'demo-trip',
      type: 'text',
      originalText: 'new'
    });
    repository.reset();
    expect(
      (await repository.getWorkspace('demo-trip')).collectedItems
    ).toHaveLength(2);
  });
});
