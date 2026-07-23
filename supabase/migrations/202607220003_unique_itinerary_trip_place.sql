-- Keep the first schedule created for a place and remove later duplicates that
-- the previous UI allowed users to create.
with ranked_place_schedules as (
  select
    id,
    row_number() over (
      partition by trip_place_id
      order by created_at, id
    ) as occurrence
  from public.itinerary_items
  where trip_place_id is not null
)
delete from public.itinerary_items
where id in (
  select id
  from ranked_place_schedules
  where occurrence > 1
);

create unique index itinerary_items_trip_place_unique_idx
on public.itinerary_items (trip_place_id)
where trip_place_id is not null;
