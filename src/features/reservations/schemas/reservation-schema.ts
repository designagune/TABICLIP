import {z} from 'zod';

export const reservationSchema = z.object({
  type: z.enum(['stay', 'transport', 'food', 'activity', 'other']),
  title: z.string().trim().min(1, 'titleRequired').max(120),
  reservationDate: z.iso.date({error: 'dateRequired'}),
  reservationTime: z.string(),
  confirmationNumber: z.string().trim().max(120),
  bookedName: z.string().trim().max(120),
  address: z.string().trim().max(240),
  originalUrl: z.union([z.literal(''), z.url()]),
  cancellationDeadline: z.string(),
  paymentStatus: z.enum(['pending', 'paid', 'refunded']),
  memo: z.string().trim().max(1000)
});
