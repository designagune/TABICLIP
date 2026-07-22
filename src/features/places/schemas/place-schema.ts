import {z} from 'zod';

export const organizePlaceSchema = z.object({
  localName: z.string().trim().min(1, 'nameRequired').max(120),
  translatedName: z.string().trim().max(120),
  addressLocal: z.string().trim().min(1, 'addressRequired').max(240),
  addressTranslated: z.string().trim().max(240),
  region: z.string().trim().min(1, 'regionRequired').max(80),
  category: z.enum([
    'sightseeing',
    'food',
    'cafe',
    'shopping',
    'stay',
    'other'
  ]),
  memo: z.string().trim().max(1000),
  googleMapUrl: z.union([z.literal(''), z.url()])
});
