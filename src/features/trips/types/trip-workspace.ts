import type {CollectedItem} from '@/features/collection/types/collected-item';
import type {ItineraryItem} from '@/features/itinerary/types/itinerary';
import type {TripPlace} from '@/features/places/types/place';
import type {Reservation} from '@/features/reservations/types/reservation';

import type {Trip} from './trip';

export interface TripWorkspace {
  trip: Trip;
  collectedItems: CollectedItem[];
  places: TripPlace[];
  itineraryItems: ItineraryItem[];
  reservations: Reservation[];
}
