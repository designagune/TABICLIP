import {z} from 'zod';

export const createTripSchema = z
  .object({
    title: z.string().trim().min(2, 'titleRequired').max(80, 'titleRequired'),
    originCountryCode: z.string().length(2, 'countryRequired'),
    destinationCountryCode: z.string().length(2, 'countryRequired'),
    language: z.string().min(2, 'countryRequired'),
    startDate: z.iso.date({error: 'dateRequired'}),
    endDate: z.iso.date({error: 'dateRequired'})
  })
  .superRefine((value, context) => {
    if (value.endDate < value.startDate) {
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'dateOrder'
      });
    }
  });
