begin;

create extension if not exists pgtap with schema extensions;
select plan(11);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'owner@example.com', '', now(), '{"provider":"email","providers":["email"]}', '{"locale":"ja"}', now(), now()),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'member@example.com', '', now(), '{"provider":"email","providers":["email"]}', '{"locale":"ja"}', now(), now()),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'stranger@example.com', '', now(), '{"provider":"email","providers":["email"]}', '{"locale":"ja"}', now(), now());

insert into public.trips (
  id, owner_id, title, origin_country_code, destination_country_code,
  language, start_date, end_date
) values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  'RLS trip', 'JP', 'KR', 'ja', current_date, current_date + 2
);

insert into public.trip_members (trip_id, user_id, role) values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '22222222-2222-2222-2222-222222222222',
  'viewer'
);

insert into public.reservations (
  id, trip_id, type, title, reservation_date
) values (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'stay', 'Private hotel', current_date
);

insert into public.collected_items (
  id, trip_id, type, source_url
) values (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'url', 'https://example.com'
);

insert into public.attachments (
  id, trip_id, collected_item_id, storage_path, mime_type, file_size
) values (
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'users/11111111-1111-1111-1111-111111111111/trips/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/collection/dddddddd-dddd-dddd-dddd-dddddddddddd.jpg',
  'image/jpeg', 1024
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);
select results_eq(
  'select count(*) from public.trips',
  'values (1::bigint)',
  'owner can view their trip'
);
select lives_ok(
  $$update public.trips set title = 'Owner updated' where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$,
  'owner can update their trip'
);

select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', true);
select results_eq(
  'select count(*) from public.trips',
  'values (1::bigint)',
  'member can view an allowed trip'
);
select results_eq(
  'select count(*) from public.reservations',
  'values (1::bigint)',
  'member can view reservation data for an allowed trip'
);
select throws_ok(
  $$insert into public.collected_items (trip_id, type, original_text) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'text', 'viewer write')$$,
  'viewer cannot create child records'
);

select set_config('request.jwt.claim.sub', '33333333-3333-3333-3333-333333333333', true);
select results_eq(
  'select count(*) from public.trips',
  'values (0::bigint)',
  'stranger cannot view another user trip'
);
select results_eq(
  'select count(*) from public.reservations',
  'values (0::bigint)',
  'stranger cannot view another user reservation'
);
select results_eq(
  'select count(*) from public.attachments',
  'values (0::bigint)',
  'stranger cannot view another user attachment metadata'
);
select throws_ok(
  $$insert into storage.objects (bucket_id, name) values ('trip-private', 'users/33333333-3333-3333-3333-333333333333/trips/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/collection/unauthorized.jpg')$$,
  'stranger cannot upload into another user trip path'
);
select results_eq(
  $$with deleted as (delete from public.trips where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' returning id) select count(*) from deleted$$,
  'values (0::bigint)',
  'stranger cannot delete another user trip'
);

select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);
select lives_ok(
  $$delete from public.trips where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$,
  'owner can delete their trip'
);

select * from finish();
rollback;
