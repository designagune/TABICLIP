# State management

## Ownership matrix

| Kind                           | Tool                    | Examples                                               |
| ------------------------------ | ----------------------- | ------------------------------------------------------ |
| Durable remote state           | TanStack Query          | trips, clips, places, itinerary, reservations          |
| Cross-component workflow state | feature Zustand store   | image upload queue; future collection/itinerary drafts |
| Restorable state               | URL route/search params | locale, trip id, screen, future filters                |
| Complex input                  | React Hook Form         | trip, place, reservation forms                         |
| Single-component interaction   | React state             | selected card, open modal, filter tab                  |
| Auth session                   | Supabase Auth           | cookie-backed user claims                              |

Server rows are never copied into Zustand. Query mutations invalidate only `['trips', tripId]` or the trip list, and the repository is the only persistence boundary.

## Query policies

- Default stale time: 30 seconds.
- Queries retry once; mutations do not retry automatically.
- Refocus does not trigger an unexpected reload during travel mode.
- Tests create a new `QueryClient` and disable retries.
- Query keys are feature-scoped factories in `src/features/trips/queries/trip-keys.ts`.

## Zustand policy

The image upload queue is transient and deliberately not persisted. It contains metadata and progress, never a `File`, signed URL, Auth token, or server row. `createUploadQueueStore` exposes an isolated vanilla factory for tests while `useUploadQueueStore` is the browser hook.

No custom React Context stores are used. `NextIntlClientProvider` and `QueryClientProvider` exist only because their libraries require providers.
