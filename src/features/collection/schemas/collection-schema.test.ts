import {describe, expect, it} from 'vitest';

import {
  MAX_IMAGE_BYTES,
  textCollectionSchema,
  urlCollectionSchema,
  validateImage
} from './collection-schema';

describe('collection validation', () => {
  it('accepts web URLs and rejects unsafe protocols', () => {
    expect(
      urlCollectionSchema.safeParse({url: 'https://example.com/place'}).success
    ).toBe(true);
    expect(
      urlCollectionSchema.safeParse({url: 'javascript:alert(1)'}).success
    ).toBe(false);
  });

  it('rejects empty text clips', () => {
    expect(textCollectionSchema.safeParse({text: '  '}).success).toBe(false);
  });

  it('validates image type and size', () => {
    expect(
      validateImage(new File(['image'], 'spot.png', {type: 'image/png'}))
    ).toBeNull();
    expect(
      validateImage(new File(['x'], 'spot.gif', {type: 'image/gif'}))
    ).toBe('fileType');
    const large = new File(['x'], 'large.jpg', {type: 'image/jpeg'});
    Object.defineProperty(large, 'size', {value: MAX_IMAGE_BYTES + 1});
    expect(validateImage(large)).toBe('fileSize');
  });
});
