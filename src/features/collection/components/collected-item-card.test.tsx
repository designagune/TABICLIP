import {fireEvent, render, screen, waitFor} from '@testing-library/react';
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
    imageWidth: null,
    imageHeight: null,
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

it('renders a private signed image URL without image optimization', () => {
  const item = {
    id: 'image-clip',
    tripId: 'trip',
    type: 'image' as const,
    sourceUrl: null,
    sourcePlatform: null,
    originalText: 'Uploaded Seoul photo',
    memo: null,
    imagePreviewUrl:
      'https://example.supabase.co/storage/v1/object/sign/trip-private/image.jpg?token=signed',
    imageWidth: 1080,
    imageHeight: 1920,
    status: 'inbox' as const,
    createdAt: '2026-07-21T00:00:00Z',
    updatedAt: '2026-07-21T00:00:00Z'
  };
  render(
    <NextIntlClientProvider locale="ja" messages={{collection}}>
      <CollectedItemCard item={item} onOrganize={vi.fn()} />
    </NextIntlClientProvider>
  );
  const image = screen.getByRole('img', {name: 'Uploaded Seoul photo'});
  expect(image).toHaveAttribute('src', item.imagePreviewUrl);
  expect(image).toHaveAttribute('width', '1080');
  expect(image).toHaveAttribute('height', '1920');
});

it('measures legacy images whose stored dimensions are missing', async () => {
  const item = {
    id: 'legacy-image-clip',
    tripId: 'trip',
    type: 'image' as const,
    sourceUrl: null,
    sourcePlatform: null,
    originalText: 'Legacy upload',
    memo: null,
    imagePreviewUrl:
      'https://example.supabase.co/storage/v1/object/sign/trip-private/legacy.jpg?token=signed',
    imageWidth: null,
    imageHeight: null,
    status: 'inbox' as const,
    createdAt: '2026-07-21T00:00:00Z',
    updatedAt: '2026-07-21T00:00:00Z'
  };
  render(
    <NextIntlClientProvider locale="ja" messages={{collection}}>
      <CollectedItemCard item={item} onOrganize={vi.fn()} />
    </NextIntlClientProvider>
  );
  const image = screen.getByRole('img', {name: 'Legacy upload'});
  Object.defineProperties(image, {
    naturalWidth: {value: 900},
    naturalHeight: {value: 1600}
  });
  fireEvent.load(image);
  await waitFor(() => {
    expect(image).toHaveAttribute('width', '900');
    expect(image).toHaveAttribute('height', '1600');
  });
});
