drop policy if exists trips_select_member on public.trips;

create policy trips_select_member
on public.trips
for select
to authenticated
using (
  owner_id = auth.uid()
  or public.is_trip_member(id)
);
