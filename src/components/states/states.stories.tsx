import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {MapPinned} from 'lucide-react';
import {fn} from 'storybook/test';

import {EmptyState} from './empty-state';
import {ErrorState} from './error-state';

const meta = {
  title: 'States/EmptyState',
  component: EmptyState,
  args: {
    icon: MapPinned,
    title: '整理した場所はここに並びます',
    description: 'クリップから場所名と住所を確認して保存してください。'
  }
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Error: Story = {
  render: () => (
    <ErrorState
      title="読み込めませんでした"
      retryLabel="もう一度試す"
      onRetry={fn()}
    />
  )
};
