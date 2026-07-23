import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {fn} from 'storybook/test';

import {itineraryFixture, tripPlaceFixture} from '@/test/fixtures';

import {PlaceCard} from './place-card';
import {PlaceGroup} from './place-group';

const meta = {
  title: 'Places/PlaceCard',
  component: PlaceCard,
  args: {
    tripPlace: tripPlaceFixture,
    itineraryItem: null,
    dayNumber: null,
    onSelectSchedule: fn()
  }
} satisfies Meta<typeof PlaceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutImage: Story = {};
export const Selected: Story = {
  args: {
    tripPlace: {...tripPlaceFixture, status: 'planned'},
    itineraryItem: itineraryFixture,
    dayNumber: 1
  }
};
export const PlaceGroupStory: Story = {
  render: () => (
    <PlaceGroup
      region="聖水・ソンス"
      places={[tripPlaceFixture, {...tripPlaceFixture, id: 'second'}]}
      itineraryByPlace={new Map()}
      tripDates={['2026-07-21']}
      onSelectSchedule={fn()}
    />
  )
};
