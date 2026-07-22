import {expect, it} from 'vitest';

import {reservationSchema} from './reservation-schema';

it('validates the reservation boundary with stable error codes', () => {
  const result = reservationSchema.safeParse({
    type: 'stay',
    title: '',
    reservationDate: '',
    reservationTime: '',
    confirmationNumber: '',
    bookedName: '',
    address: '',
    originalUrl: '',
    cancellationDeadline: '',
    paymentStatus: 'pending',
    memo: ''
  });
  expect(result.success).toBe(false);
  if (!result.success)
    expect(result.error.issues[0]?.message).toBe('titleRequired');
});
