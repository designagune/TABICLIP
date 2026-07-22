import type {Meta, StoryObj} from '@storybook/nextjs-vite';

import {tripFixture} from '@/test/fixtures';

import {TripCard} from './trip-card';

const meta = {
  title: 'Trips/TripCard',
  component: TripCard,
  args: {trip: tripFixture}
} satisfies Meta<typeof TripCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LongJapaneseText: Story = {};
export const Upcoming: Story = {
  args: {trip: {...tripFixture, status: 'upcoming'}}
};
