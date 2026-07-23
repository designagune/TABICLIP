import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {NextIntlClientProvider} from 'next-intl';
import {describe, expect, it, vi} from 'vitest';

import messages from '@/messages/ko/places.json';
import {itineraryFixture, tripPlaceFixture} from '@/test/fixtures';

import {PlaceCard} from './place-card';

function renderCard(scheduled: boolean, onSelectSchedule = vi.fn()) {
  render(
    <NextIntlClientProvider locale="ko" messages={{places: messages}}>
      <PlaceCard
        tripPlace={tripPlaceFixture}
        itineraryItem={scheduled ? itineraryFixture : null}
        dayNumber={scheduled ? 1 : null}
        onSelectSchedule={onSelectSchedule}
      />
    </NextIntlClientProvider>
  );
  return onSelectSchedule;
}

describe('PlaceCard', () => {
  it('offers to add an unscheduled place', () => {
    renderCard(false);
    expect(
      screen.getByRole('button', {name: '일정에 추가'})
    ).toBeInTheDocument();
    expect(screen.queryByText(/DAY 1/)).not.toBeInTheDocument();
  });

  it('shows the existing schedule and opens it for editing', async () => {
    const onSelectSchedule = renderCard(true);
    expect(screen.getByText('DAY 1 · 2026-07-21 · 10:00')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: '일정 수정'}));
    expect(onSelectSchedule).toHaveBeenCalledWith(tripPlaceFixture);
  });
});
