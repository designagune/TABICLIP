import {describe, expect, it} from 'vitest';

import {organizePlaceSchema} from './place-schema';

describe('organizePlaceSchema', () => {
  it('requires local name, address, and region', () => {
    const result = organizePlaceSchema.safeParse({
      localName: '',
      translatedName: '',
      addressLocal: '',
      addressTranslated: '',
      region: '',
      category: 'cafe',
      memo: '',
      googleMapUrl: ''
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual([
        'nameRequired',
        'addressRequired',
        'regionRequired'
      ]);
    }
  });
});
