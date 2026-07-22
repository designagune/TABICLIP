import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {NextIntlClientProvider} from 'next-intl';
import {expect, it, vi} from 'vitest';

import collection from '@/messages/ja/collection.json';

import {CollectedItemCard} from './collected-item-card';

it('offers the user a Japanese organization action', async () => {
  const onOrganize = vi.fn();
  const item = {
    id: 'clip',
    tripId: 'trip',
    type: 'text' as const,
    sourceUrl: null,
    sourcePlatform: null,
    originalText: '望遠市場の屋台',
    memo: null,
    imagePreviewUrl: null,
    status: 'inbox' as const,
    createdAt: '2026-07-21T00:00:00Z',
    updatedAt: '2026-07-21T00:00:00Z'
  };
  render(
    <NextIntlClientProvider locale="ja" messages={{collection}}>
      <CollectedItemCard item={item} onOrganize={onOrganize} />
    </NextIntlClientProvider>
  );
  expect(screen.getByText('望遠市場の屋台')).toBeVisible();
  await userEvent.click(screen.getByRole('button', {name: '場所に整理'}));
  expect(onOrganize).toHaveBeenCalledWith(item);
});
