import {describe, expect, it} from 'vitest';

import {
  addDays,
  differenceInCalendarDays,
  enumerateDates,
  getTripStatus,
  toIsoDate
} from './date-utils';

describe('date utilities', () => {
  it('formats local dates without UTC rollover', () => {
    expect(toIsoDate(new Date(2026, 6, 3, 23, 30))).toBe('2026-07-03');
  });

  it('adds days across a month boundary', () => {
    expect(toIsoDate(addDays(new Date(2026, 6, 31), 1))).toBe('2026-08-01');
  });

  it('enumerates every trip day inclusively', () => {
    expect(enumerateDates('2026-07-21', '2026-07-23')).toEqual([
      '2026-07-21',
      '2026-07-22',
      '2026-07-23'
    ]);
  });

  it.each([
    ['2026-07-22', '2026-07-24', 'upcoming'],
    ['2026-07-20', '2026-07-22', 'active'],
    ['2026-07-18', '2026-07-20', 'past']
  ] as const)('classifies %s to %s as %s', (start, end, status) => {
    expect(getTripStatus(start, end, new Date(2026, 6, 21))).toBe(status);
  });

  it('never reports a negative countdown', () => {
    expect(differenceInCalendarDays('2026-07-20', new Date(2026, 6, 21))).toBe(
      0
    );
    expect(differenceInCalendarDays('2026-07-24', new Date(2026, 6, 21))).toBe(
      3
    );
  });
});
