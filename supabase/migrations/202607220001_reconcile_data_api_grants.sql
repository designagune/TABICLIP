-- Reconcile projects where the initial migration was applied before explicit
-- Data API privileges were added to the checked-in schema.

revoke all on function public.is_trip_member(uuid) from public;
revoke all on function public.can_edit_trip(uuid) from public;
grant execute on function public.is_trip_member(uuid) to authenticated;
grant execute on function public.can_edit_trip(uuid) to authenticated;

revoke all on all tables in schema public from anon, authenticated, service_role;

grant select, update on table public.profiles to authenticated;
grant select, insert, update, delete on table
  public.trips,
  public.trip_members,
  public.collected_items,
  public.places,
  public.trip_places,
  public.itinerary_items,
  public.reservations
to authenticated;
grant select, insert, delete on table public.attachments to authenticated;

grant select, insert, update, delete on all tables in schema public to service_role;
