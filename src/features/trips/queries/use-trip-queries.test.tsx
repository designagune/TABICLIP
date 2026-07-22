import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {act, renderHook, waitFor} from '@testing-library/react';
import type {ReactNode} from 'react';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {mockTripWorkspaceRepository} from '../repositories/mock-trip-workspace-repository';
import {useAddCollectedItem, useTripWorkspace} from './use-trip-queries';

describe('trip TanStack Query integration', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_DATA_MODE', 'mock');
    mockTripWorkspaceRepository.reset();
  });

  it('moves from loading to success and refreshes after a mutation', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {queries: {retry: false}, mutations: {retry: false}}
    });
    const wrapper = ({children}: {children: ReactNode}) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const workspace = renderHook(() => useTripWorkspace('demo-trip'), {
      wrapper
    });
    expect(workspace.result.current.isPending).toBe(true);
    await waitFor(() => expect(workspace.result.current.isSuccess).toBe(true));
    expect(workspace.result.current.data?.collectedItems).toHaveLength(2);

    const add = renderHook(() => useAddCollectedItem('demo-trip'), {wrapper});
    await act(async () => {
      await add.result.current.mutateAsync({
        tripId: 'demo-trip',
        type: 'text',
        originalText: '延南洞の本屋'
      });
    });
    await waitFor(() =>
      expect(workspace.result.current.data?.collectedItems).toHaveLength(3)
    );
  });
});
