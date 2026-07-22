import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {fn} from 'storybook/test';

import {collectedItemFixture} from '@/test/fixtures';

import {CollectedItemCard} from './collected-item-card';
import {UploadQueue} from './upload-queue';

const cardMeta = {
  title: 'Collection/CollectedItemCard',
  component: CollectedItemCard,
  args: {item: collectedItemFixture, onOrganize: fn()}
} satisfies Meta<typeof CollectedItemCard>;

export default cardMeta;
type Story = StoryObj<typeof cardMeta>;

export const Default: Story = {};
export const Organized: Story = {
  args: {item: {...collectedItemFixture, status: 'organized'}}
};

export const Uploading: Story = {
  render: () => (
    <UploadQueue
      items={[
        {id: '1', name: 'seongsu-cafe.png', status: 'uploading', progress: 62},
        {id: '2', name: 'reservation.webp', status: 'complete', progress: 100}
      ]}
    />
  )
};
