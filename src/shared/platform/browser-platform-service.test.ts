import {beforeEach, describe, expect, it, vi} from 'vitest';

import {BrowserPlatformService} from './browser-platform-service';

describe('BrowserPlatformService', () => {
  const service = new BrowserPlatformService();

  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {writeText: vi.fn().mockResolvedValue(undefined)}
    });
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true
    });
  });

  it('reports network status and subscribes to changes', async () => {
    expect(await service.getNetworkStatus()).toEqual({online: true});
    const listener = vi.fn();
    const unsubscribe = service.subscribeNetworkStatus(listener);
    window.dispatchEvent(new Event('offline'));
    expect(listener).toHaveBeenCalledWith({online: true});
    unsubscribe();
  });

  it('copies text and falls back to copy when sharing is unavailable', async () => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined
    });
    await service.copyText('서울숲');
    await service.shareContent({title: 'Trip', text: '서울숲'});
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Trip\n서울숲');
  });

  it('uses the native share API when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share
    });
    await service.shareContent({title: 'Trip'});
    expect(share).toHaveBeenCalledWith({title: 'Trip'});
  });

  it('opens a safe Google Maps fallback', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    await service.openExternalMap({address: '서울숲'});
    expect(open).toHaveBeenCalledWith(
      expect.stringContaining('google.com/maps'),
      '_blank',
      'noopener,noreferrer'
    );
  });
});
