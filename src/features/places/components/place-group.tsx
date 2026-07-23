import type {ItineraryItem} from '@/features/itinerary/types/itinerary';

import type {TripPlace} from '../types/place';
import {PlaceCard} from './place-card';

export function PlaceGroup({
  region,
  places,
  itineraryByPlace,
  tripDates,
  onSelectSchedule
}: {
  region: string;
  places: TripPlace[];
  itineraryByPlace: ReadonlyMap<string, ItineraryItem>;
  tripDates: string[];
  onSelectSchedule: (place: TripPlace) => void;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-lg font-black">{region}</h2>
        <span className="text-muted-foreground text-xs font-bold">
          {places.length}
        </span>
        <span className="bg-border h-px flex-1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {places.map((place) => {
          const itineraryItem = itineraryByPlace.get(place.id) ?? null;
          const dateIndex = itineraryItem
            ? tripDates.indexOf(itineraryItem.date)
            : -1;
          return (
            <PlaceCard
              key={place.id}
              tripPlace={place}
              itineraryItem={itineraryItem}
              dayNumber={dateIndex >= 0 ? dateIndex + 1 : null}
              onSelectSchedule={onSelectSchedule}
            />
          );
        })}
      </div>
    </section>
  );
}
