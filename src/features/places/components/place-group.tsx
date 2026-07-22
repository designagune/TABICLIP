import type {TripPlace} from '../types/place';
import {PlaceCard} from './place-card';

export function PlaceGroup({
  region,
  places,
  onAddToSchedule
}: {
  region: string;
  places: TripPlace[];
  onAddToSchedule: (place: TripPlace) => void;
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
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            tripPlace={place}
            onAddToSchedule={onAddToSchedule}
          />
        ))}
      </div>
    </section>
  );
}
