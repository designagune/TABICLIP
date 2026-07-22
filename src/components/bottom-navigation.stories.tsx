import type {Meta, StoryObj} from '@storybook/nextjs-vite';

import {BottomNavigation} from './bottom-navigation';

const meta = {
  title: 'Navigation/BottomNavigation',
  component: BottomNavigation,
  args: {tripId: 'demo-trip'},
  decorators: [
    (Story) => (
      <div className="relative h-40">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof BottomNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
