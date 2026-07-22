import {afterEach, describe, expect, it, vi} from 'vitest';

import {getDataMode} from './data-mode';

describe('getDataMode', () => {
  afterEach(() => vi.unstubAllEnvs());

  it.each(['mock', 'supabase'] as const)('accepts explicit %s mode', (mode) => {
    vi.stubEnv('NEXT_PUBLIC_DATA_MODE', mode);
    expect(getDataMode()).toBe(mode);
  });

  it('does not infer a mode from missing configuration', () => {
    vi.stubEnv('NEXT_PUBLIC_DATA_MODE', '');
    expect(() => getDataMode()).toThrow();
  });
});
