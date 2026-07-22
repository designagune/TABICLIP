import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {fn} from 'storybook/test';

import {tripPlaceFixture} from '@/test/fixtures';

import {PlaceCard} from './place-card';
import {PlaceGroup} from './place-group';

const meta = {
  title: 'Places/PlaceCard',
  component: PlaceCard,
  args: {tripPlace: tripPlaceFixture, onAddToSchedule: fn()}
} satisfies Meta<typeof PlaceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutImage: Story = {};
export const Selected: Story = {
  args: {tripPlace: {...tripPlaceFixture, status: 'planned'}}
};
export const PlaceGroupStory: Story = {
  render: () => (
    <PlaceGroup
      region="聖水・ソンス"
      places={[tripPlaceFixture, {...tripPlaceFixture, id: 'second'}]}
      onAddToSchedule={fn()}
    />
  )
};
