import type {Meta, StoryObj} from '@storybook/nextjs-vite';

import {itineraryFixture} from '@/test/fixtures';

import {TravelModeCard} from './travel-mode-card';

const meta = {
  title: 'Itinerary/TravelModeCard',
  component: TravelModeCard,
  args: {item: itineraryFixture, tripId: 'demo-trip', label: 'いま・次の予定'}
} satisfies Meta<typeof TravelModeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Offline: Story = {
  parameters: {offline: true}
};
