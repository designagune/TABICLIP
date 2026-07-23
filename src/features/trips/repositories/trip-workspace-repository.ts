import type {
  AddCollectedItemInput,
  CollectedItem
} from '@/features/collection/types/collected-item';
import type {
  AddItineraryItemInput,
  ItineraryItem,
  UpdateItineraryItemInput
} from '@/features/itinerary/types/itinerary';
import type {
  OrganizeCollectedItemInput,
  TripPlace
} from '@/features/places/types/place';
import type {
  CreateReservationInput,
  Reservation,
  UpdateReservationInput
} from '@/features/reservations/types/reservation';

import type {CreateTripInput, Trip} from '../types/trip';
import type {TripWorkspace} from '../types/trip-workspace';

export interface TripWorkspaceRepository {
  listTrips(): Promise<Trip[]>;
  createTrip(input: CreateTripInput): Promise<Trip>;
  getWorkspace(tripId: string): Promise<TripWorkspace>;
  addCollectedItem(input: AddCollectedItemInput): Promise<CollectedItem>;
  organizeCollectedItem(input: OrganizeCollectedItemInput): Promise<TripPlace>;
  addItineraryItem(input: AddItineraryItemInput): Promise<ItineraryItem>;
  updateItineraryItem(input: UpdateItineraryItemInput): Promise<ItineraryItem>;
  moveItineraryItem(
    tripId: string,
    itemId: string,
    direction: -1 | 1
  ): Promise<void>;
  createReservation(input: CreateReservationInput): Promise<Reservation>;
  updateReservation(input: UpdateReservationInput): Promise<Reservation>;
  deleteReservation(tripId: string, reservationId: string): Promise<void>;
}
