import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {NextIntlClientProvider} from 'next-intl';
import {describe, expect, it, vi} from 'vitest';

import common from '@/messages/ko/common.json';
import itinerary from '@/messages/ko/itinerary.json';
import {itineraryFixture, tripPlaceFixture} from '@/test/fixtures';

import {AddToItineraryModal} from './add-to-itinerary-modal';

describe('AddToItineraryModal', () => {
  it('prefills and saves an existing itinerary item', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(
      <NextIntlClientProvider locale="ko" messages={{common, itinerary}}>
        <AddToItineraryModal
          place={tripPlaceFixture}
          itineraryItem={itineraryFixture}
          tripDates={{start: '2026-07-21', end: '2026-07-24'}}
          pending={false}
          onClose={vi.fn()}
          onSave={onSave}
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByLabelText('날짜')).toHaveValue('2026-07-21');
    expect(screen.getByLabelText('시작 시간')).toHaveValue('10:00');
    await userEvent.clear(screen.getByLabelText('시작 시간'));
    await userEvent.type(screen.getByLabelText('시작 시간'), '13:30');
    await userEvent.click(screen.getByRole('button', {name: '변경사항 저장'}));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        tripPlaceId: tripPlaceFixture.id,
        date: '2026-07-21',
        startTime: '13:30'
      })
    );
  });
});
