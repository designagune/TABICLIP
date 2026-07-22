create extension if not exists pgcrypto with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  locale text not null default 'ja' check (locale in ('ja', 'ko')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 80),
  origin_country_code char(2) not null,
  destination_country_code char(2) not null,
  language text not null,
  start_date date not null,
  end_date date not null check (end_date >= start_date),
  cover_image_path text,
  status text not null default 'upcoming' check (status in ('upcoming', 'active', 'past')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trip_members (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('viewer', 'editor')),
  created_at timestamptz not null default now(),
  unique (trip_id, user_id)
);

create table public.collected_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  type text not null check (type in ('image', 'url', 'text')),
  source_url text,
  source_platform text,
  original_text text,
  memo text,
  status text not null default 'inbox' check (status in ('inbox', 'organizing', 'organized')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (source_url is not null or original_text is not null or type = 'image')
);

create table public.places (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id) on delete cascade,
  visibility text not null default 'private' check (visibility in ('private', 'shared', 'public')),
  country_code char(2) not null,
  local_name text not null,
  translated_name text not null default '',
  address_local text not null,
  address_translated text not null default '',
  latitude double precision,
  longitude double precision,
  region text not null,
  category text not null check (category in ('sightseeing', 'food', 'cafe', 'shopping', 'stay', 'other')),
  official_url text,
  instagram_url text,
  naver_map_url text,
  kakao_map_url text,
  google_map_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (latitude is null or latitude between -90 and 90),
  check (longitude is null or longitude between -180 and 180)
);

create table public.trip_places (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete cascade,
  collected_item_id uuid references public.collected_items(id) on delete set null,
  memo text not null default '',
  priority integer not null default 0,
  status text not null default 'candidate' check (status in ('candidate', 'planned', 'visited', 'skipped')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trip_id, place_id)
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  type text not null check (type in ('stay', 'transport', 'food', 'activity', 'other')),
  title text not null,
  reservation_date date not null,
  reservation_time time,
  confirmation_number text,
  booked_name text,
  address text,
  original_url text,
  cancellation_deadline timestamptz,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'refunded')),
  memo text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  trip_place_id uuid references public.trip_places(id) on delete set null,
  reservation_id uuid references public.reservations(id) on delete set null,
  date date not null,
  start_time time,
  end_time time,
  title text not null,
  memo text not null default '',
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time is null or start_time is null or end_time >= start_time)
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  collected_item_id uuid references public.collected_items(id) on delete cascade,
  reservation_id uuid references public.reservations(id) on delete cascade,
  storage_path text not null unique,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  file_size integer not null check (file_size > 0 and file_size <= 10485760),
  width integer,
  height integer,
  created_at timestamptz not null default now(),
  check (num_nonnulls(collected_item_id, reservation_id) = 1)
);

create index trips_owner_id_idx on public.trips(owner_id);
create index trip_members_user_id_idx on public.trip_members(user_id);
create index collected_items_trip_status_idx on public.collected_items(trip_id, status);
create index trip_places_trip_status_idx on public.trip_places(trip_id, status);
create index itinerary_items_trip_date_order_idx on public.itinerary_items(trip_id, date, sort_order);
create index reservations_trip_date_idx on public.reservations(trip_id, reservation_date);
create index attachments_trip_id_idx on public.attachments(trip_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger trips_updated_at before update on public.trips
for each row execute function public.set_updated_at();
create trigger collected_items_updated_at before update on public.collected_items
for each row execute function public.set_updated_at();
create trigger places_updated_at before update on public.places
for each row execute function public.set_updated_at();
create trigger trip_places_updated_at before update on public.trip_places
for each row execute function public.set_updated_at();
create trigger itinerary_items_updated_at before update on public.itinerary_items
for each row execute function public.set_updated_at();
create trigger reservations_updated_at before update on public.reservations
for each row execute function public.set_updated_at();

create or replace function public.keep_trip_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.owner_id <> old.owner_id then
    raise exception 'trip owner cannot be changed';
  end if;
  return new;
end;
$$;

create trigger trips_keep_owner before update of owner_id on public.trips
for each row execute function public.keep_trip_owner();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, locale)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, ''), '@', 1)),
    case when new.raw_user_meta_data ->> 'locale' = 'ko' then 'ko' else 'ja' end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_trip_member(target_trip_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.trips t
    where t.id = target_trip_id and t.owner_id = auth.uid()
  ) or exists (
    select 1 from public.trip_members tm
    where tm.trip_id = target_trip_id and tm.user_id = auth.uid()
  );
$$;

create or replace function public.can_edit_trip(target_trip_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.trips t
    where t.id = target_trip_id and t.owner_id = auth.uid()
  ) or exists (
    select 1 from public.trip_members tm
    where tm.trip_id = target_trip_id and tm.user_id = auth.uid() and tm.role = 'editor'
  );
$$;

revoke all on function public.is_trip_member(uuid) from public;
revoke all on function public.can_edit_trip(uuid) from public;
grant execute on function public.is_trip_member(uuid) to authenticated;
grant execute on function public.can_edit_trip(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.collected_items enable row level security;
alter table public.places enable row level security;
alter table public.trip_places enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.reservations enable row level security;
alter table public.attachments enable row level security;

create policy profiles_select_self on public.profiles for select to authenticated using (id = auth.uid());
create policy profiles_update_self on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy trips_select_member on public.trips for select to authenticated using (public.is_trip_member(id));
create policy trips_insert_owner on public.trips for insert to authenticated with check (owner_id = auth.uid());
create policy trips_update_editor on public.trips for update to authenticated using (public.can_edit_trip(id)) with check (public.can_edit_trip(id));
create policy trips_delete_owner on public.trips for delete to authenticated using (owner_id = auth.uid());

create policy trip_members_select_member on public.trip_members for select to authenticated using (public.is_trip_member(trip_id));
create policy trip_members_insert_owner on public.trip_members for insert to authenticated with check (exists (select 1 from public.trips t where t.id = trip_id and t.owner_id = auth.uid()));
create policy trip_members_update_owner on public.trip_members for update to authenticated using (exists (select 1 from public.trips t where t.id = trip_id and t.owner_id = auth.uid()));
create policy trip_members_delete_owner on public.trip_members for delete to authenticated using (exists (select 1 from public.trips t where t.id = trip_id and t.owner_id = auth.uid()));

create policy collected_items_select_member on public.collected_items for select to authenticated using (public.is_trip_member(trip_id));
create policy collected_items_insert_editor on public.collected_items for insert to authenticated with check (public.can_edit_trip(trip_id));
create policy collected_items_update_editor on public.collected_items for update to authenticated using (public.can_edit_trip(trip_id)) with check (public.can_edit_trip(trip_id));
create policy collected_items_delete_editor on public.collected_items for delete to authenticated using (public.can_edit_trip(trip_id));

create policy places_select_allowed on public.places for select to authenticated using (
  created_by = auth.uid() or visibility = 'public' or exists (
    select 1 from public.trip_places tp where tp.place_id = id and public.is_trip_member(tp.trip_id)
  )
);
create policy places_insert_self on public.places for insert to authenticated with check (created_by = auth.uid() and visibility <> 'public');
create policy places_update_self on public.places for update to authenticated using (created_by = auth.uid()) with check (created_by = auth.uid());
create policy places_delete_self on public.places for delete to authenticated using (created_by = auth.uid());

create policy trip_places_select_member on public.trip_places for select to authenticated using (public.is_trip_member(trip_id));
create policy trip_places_insert_editor on public.trip_places for insert to authenticated with check (public.can_edit_trip(trip_id));
create policy trip_places_update_editor on public.trip_places for update to authenticated using (public.can_edit_trip(trip_id)) with check (public.can_edit_trip(trip_id));
create policy trip_places_delete_editor on public.trip_places for delete to authenticated using (public.can_edit_trip(trip_id));

create policy itinerary_items_select_member on public.itinerary_items for select to authenticated using (public.is_trip_member(trip_id));
create policy itinerary_items_insert_editor on public.itinerary_items for insert to authenticated with check (public.can_edit_trip(trip_id));
create policy itinerary_items_update_editor on public.itinerary_items for update to authenticated using (public.can_edit_trip(trip_id)) with check (public.can_edit_trip(trip_id));
create policy itinerary_items_delete_editor on public.itinerary_items for delete to authenticated using (public.can_edit_trip(trip_id));

create policy reservations_select_member on public.reservations for select to authenticated using (public.is_trip_member(trip_id));
create policy reservations_insert_editor on public.reservations for insert to authenticated with check (public.can_edit_trip(trip_id));
create policy reservations_update_editor on public.reservations for update to authenticated using (public.can_edit_trip(trip_id)) with check (public.can_edit_trip(trip_id));
create policy reservations_delete_editor on public.reservations for delete to authenticated using (public.can_edit_trip(trip_id));

create policy attachments_select_member on public.attachments for select to authenticated using (public.is_trip_member(trip_id));
create policy attachments_insert_editor on public.attachments for insert to authenticated with check (
  public.can_edit_trip(trip_id)
  and storage_path like 'users/' || auth.uid()::text || '/trips/' || trip_id::text || '/%'
);
create policy attachments_delete_editor on public.attachments for delete to authenticated using (public.can_edit_trip(trip_id));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'trip-private',
  'trip-private',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy trip_storage_select on storage.objects for select to authenticated using (
  bucket_id = 'trip-private' and exists (
    select 1 from public.attachments a
    where a.storage_path = name and public.is_trip_member(a.trip_id)
  )
);
create policy trip_storage_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'trip-private'
  and (storage.foldername(name))[1] = 'users'
  and (storage.foldername(name))[2] = auth.uid()::text
  and (storage.foldername(name))[3] = 'trips'
  and (storage.foldername(name))[4] ~ '^[0-9a-f-]{36}$'
  and public.can_edit_trip(((storage.foldername(name))[4])::uuid)
);
create policy trip_storage_delete on storage.objects for delete to authenticated using (
  bucket_id = 'trip-private' and exists (
    select 1 from public.attachments a
    where a.storage_path = name and public.can_edit_trip(a.trip_id)
  )
);
