import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {fn} from 'storybook/test';

import {itineraryFixture} from '@/test/fixtures';

import {ItineraryItemCard} from './itinerary-item-card';
import {ItineraryTimeline} from './itinerary-timeline';

const meta = {
  title: 'Itinerary/ItineraryItem',
  component: ItineraryItemCard,
  args: {item: itineraryFixture, first: false, last: false, onMove: fn()}
} satisfies Meta<typeof ItineraryItemCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Unscheduled: Story = {
  args: {item: {...itineraryFixture, startTime: null}}
};
export const Timeline: Story = {
  render: () => (
    <ItineraryTimeline
      date="2026-07-21"
      dayNumber={1}
      items={[
        itineraryFixture,
        {
          ...itineraryFixture,
          id: 'second',
          title: '聖水のベーカリー',
          startTime: '12:30'
        }
      ]}
      onMove={fn()}
    />
  )
};
export const EmptyTimeline: Story = {
  render: () => (
    <ItineraryTimeline
      date="2026-07-22"
      dayNumber={2}
      items={[]}
      onMove={fn()}
    />
  )
};
