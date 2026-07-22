export type ReservationType =
  'stay' | 'transport' | 'food' | 'activity' | 'other';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Reservation {
  id: string;
  tripId: string;
  type: ReservationType;
  title: string;
  reservationDate: string;
  reservationTime: string | null;
  confirmationNumber: string | null;
  bookedName: string | null;
  address: string | null;
  originalUrl: string | null;
  cancellationDeadline: string | null;
  paymentStatus: PaymentStatus;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationInput {
  tripId: string;
  type: ReservationType;
  title: string;
  reservationDate: string;
  reservationTime?: string;
  confirmationNumber?: string;
  bookedName?: string;
  address?: string;
  originalUrl?: string;
  cancellationDeadline?: string;
  paymentStatus: PaymentStatus;
  memo?: string;
}

export interface UpdateReservationInput extends CreateReservationInput {
  id: string;
}
