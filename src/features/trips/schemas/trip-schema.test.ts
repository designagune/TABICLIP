import {describe, expect, it} from 'vitest';

import {createTripSchema} from './trip-schema';

const validTrip = {
  title: '春のソウル',
  originCountryCode: 'JP',
  destinationCountryCode: 'KR',
  language: 'ja',
  startDate: '2026-08-01',
  endDate: '2026-08-04'
};

describe('createTripSchema', () => {
  it('accepts a valid country-neutral trip', () => {
    expect(createTripSchema.safeParse(validTrip).success).toBe(true);
  });

  it('returns a stable code when dates are reversed', () => {
    const result = createTripSchema.safeParse({
      ...validTrip,
      endDate: '2026-07-31'
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0]?.message).toBe('dateOrder');
  });

  it('rejects a one-character title', () => {
    expect(
      createTripSchema.safeParse({...validTrip, title: '旅'}).success
    ).toBe(false);
  });
});
