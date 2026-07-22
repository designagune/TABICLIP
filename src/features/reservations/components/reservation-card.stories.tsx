import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {fn} from 'storybook/test';

import {reservationFixture} from '@/test/fixtures';

import {ReservationCard} from './reservation-card';

const meta = {
  title: 'Reservations/ReservationCard',
  component: ReservationCard,
  args: {reservation: reservationFixture, onEdit: fn(), onDelete: fn()}
} satisfies Meta<typeof ReservationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const PendingPayment: Story = {
  args: {reservation: {...reservationFixture, paymentStatus: 'pending'}}
};
