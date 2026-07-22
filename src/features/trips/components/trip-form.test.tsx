import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {NextIntlClientProvider} from 'next-intl';
import type {AnchorHTMLAttributes} from 'react';
import {beforeEach, expect, it, vi} from 'vitest';

import common from '@/messages/ja/common.json';
import trips from '@/messages/ja/trips.json';

import {mockTripWorkspaceRepository} from '../repositories/mock-trip-workspace-repository';
import {TripForm} from './trip-form';

const navigation = vi.hoisted(() => ({push: vi.fn()}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    children,
    href,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {href: string}) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  useRouter: () => ({push: navigation.push})
}));

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_DATA_MODE', 'mock');
  navigation.push.mockReset();
  mockTripWorkspaceRepository.reset();
});

function renderForm() {
  const queryClient = new QueryClient({
    defaultOptions: {mutations: {retry: false}}
  });
  return render(
    <NextIntlClientProvider locale="ja" messages={{common, trips}}>
      <QueryClientProvider client={queryClient}>
        <TripForm />
      </QueryClientProvider>
    </NextIntlClientProvider>
  );
}

it('creates a trip through the Japanese form', async () => {
  const user = userEvent.setup();
  renderForm();
  await user.type(screen.getByLabelText('旅の名前'), '秋の釜山');
  await user.click(screen.getByRole('button', {name: 'この旅をつくる'}));
  await waitFor(() =>
    expect(navigation.push).toHaveBeenCalledWith(
      expect.stringMatching(/^\/app\/trips\/trip-/)
    )
  );
});

it('connects a translated error to the invalid date field', async () => {
  const user = userEvent.setup();
  renderForm();
  await user.type(screen.getByLabelText('旅の名前'), '秋の釜山');
  const start = screen.getByLabelText('出発日');
  const end = screen.getByLabelText('帰国日');
  await user.clear(start);
  await user.type(start, '2026-10-10');
  await user.clear(end);
  await user.type(end, '2026-10-01');
  await user.click(screen.getByRole('button', {name: 'この旅をつくる'}));
  expect(await screen.findByRole('alert')).toHaveTextContent(
    '帰国日は出発日以降にしてください'
  );
  expect(end).toHaveAttribute('aria-invalid', 'true');
});
