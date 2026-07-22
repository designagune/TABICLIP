import {z} from 'zod';

export const urlCollectionSchema = z.object({
  url: z.url({protocol: /^https?$/, error: 'invalidUrl'})
});

export const textCollectionSchema = z.object({
  text: z.string().trim().min(1, 'textRequired').max(2000, 'textRequired')
});

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
] as const;

export type ImageValidationError = 'fileType' | 'fileSize';

export function validateImage(file: File): ImageValidationError | null {
  if (!ALLOWED_IMAGE_TYPES.some((type) => type === file.type))
    return 'fileType';
  if (file.size > MAX_IMAGE_BYTES) return 'fileSize';
  return null;
}
