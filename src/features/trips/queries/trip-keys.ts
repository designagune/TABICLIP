export const tripKeys = {
  all: ['trips'] as const,
  detail: (tripId: string) => ['trips', tripId] as const
};

export const collectionKeys = {
  all: (tripId: string) => ['trips', tripId, 'collection'] as const
};

export const placeKeys = {
  all: (tripId: string) => ['trips', tripId, 'places'] as const
};

export const itineraryKeys = {
  all: (tripId: string) => ['trips', tripId, 'itinerary'] as const,
  byDate: (tripId: string, date: string) =>
    ['trips', tripId, 'itinerary', date] as const
};

export const reservationKeys = {
  all: (tripId: string) => ['trips', tripId, 'reservations'] as const
};
