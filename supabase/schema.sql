create extension if not exists pgcrypto;

create type public.batch_status as enum ('open', 'running', 'closed');

create type public.join_request_status as enum (
  'new',
  'verified',
  'rejected',
  'waitlisted'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.normalize_id_phone(input text)
returns text
language plpgsql
immutable
as $$
declare
  cleaned text;
begin
  if input is null then
    return null;
  end if;

  cleaned := regexp_replace(trim(input), '[^0-9+]', '', 'g');

  if cleaned like '+62%' then
    cleaned := substring(cleaned from 2);
  end if;

  if cleaned like '08%' then
    cleaned := '62' || substring(cleaned from 2);
  end if;

  if cleaned !~ '^628[0-9]{7,13}$' then
    raise exception 'Invalid Indonesian WhatsApp phone number format: %', input;
  end if;

  return cleaned;
end;
$$;

create or replace function public.normalize_join_request_phone()
returns trigger
language plpgsql
as $$
begin
  new.phone := public.normalize_id_phone(new.phone);
  return new;
end;
$$;

create table public.batches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status public.batch_status not null default 'open',
  deadline_join date,
  remaining_quota integer,
  next_batch_open date,
  next_batch_label text,
  start_date date not null,
  end_date date not null,
  source_month text not null,
  notes text,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint batches_source_month_unique unique (source_month),
  constraint batches_date_range_check check (start_date <= end_date),
  constraint batches_remaining_quota_check check (remaining_quota is null or remaining_quota >= 0)
);

create table public.batch_slots (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.batches(id) on delete cascade,
  date date not null,
  day_name text not null,
  main_course text,
  side_dish text,
  extra text,
  image_url text,
  is_available boolean not null default false,
  label text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint batch_slots_unique_date_per_batch unique (batch_id, date),
  constraint batch_slots_sort_order_check check (sort_order >= 0)
);

create table public.holidays (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  name text not null,
  type text not null,
  created_at timestamptz not null default now()
);

create table public.join_requests (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.batches(id) on delete restrict,
  full_name text not null,
  phone text not null,
  payment_proof_url text not null,
  status public.join_request_status not null default 'new',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint join_requests_full_name_check check (char_length(trim(full_name)) >= 3),
  constraint join_requests_payment_proof_check check (char_length(trim(payment_proof_url)) > 0),
  constraint join_requests_phone_check check (phone ~ '^628[0-9]{7,13}$')
);

create table public.admin_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_credentials (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_credentials_username_check check (char_length(trim(username)) >= 3),
  constraint admin_credentials_password_hash_check check (char_length(trim(password_hash)) >= 20)
);

create index batches_status_idx on public.batches(status);
create index batches_is_active_idx on public.batches(is_active);
create index batches_start_date_idx on public.batches(start_date);
create index batches_end_date_idx on public.batches(end_date);

create index batch_slots_batch_id_idx on public.batch_slots(batch_id);
create index batch_slots_date_idx on public.batch_slots(date);
create index batch_slots_is_available_idx on public.batch_slots(is_available);
create index batch_slots_sort_order_idx on public.batch_slots(batch_id, sort_order);

create index holidays_date_idx on public.holidays(date);

create index join_requests_batch_id_idx on public.join_requests(batch_id);
create index join_requests_status_idx on public.join_requests(status);
create index join_requests_created_at_idx on public.join_requests(created_at desc);
create index join_requests_phone_idx on public.join_requests(phone);

create unique index admin_credentials_username_idx on public.admin_credentials(username);
create unique index batches_only_one_active_idx on public.batches ((is_active)) where is_active = true;

create trigger set_batches_updated_at before update on public.batches for each row execute function public.set_updated_at();
create trigger set_batch_slots_updated_at before update on public.batch_slots for each row execute function public.set_updated_at();
create trigger set_join_requests_updated_at before update on public.join_requests for each row execute function public.set_updated_at();
create trigger set_admin_settings_updated_at before update on public.admin_settings for each row execute function public.set_updated_at();
create trigger set_admin_credentials_updated_at before update on public.admin_credentials for each row execute function public.set_updated_at();

create trigger normalize_join_requests_phone_before_insert before insert on public.join_requests for each row execute function public.normalize_join_request_phone();
create trigger normalize_join_requests_phone_before_update before update on public.join_requests for each row execute function public.normalize_join_request_phone();

create or replace view public.active_batch_with_slots as
select
  b.id as batch_id,
  b.name as batch_name,
  b.status,
  b.deadline_join,
  b.remaining_quota,
  b.next_batch_open,
  b.next_batch_label,
  b.start_date,
  b.end_date,
  b.source_month,
  s.id as slot_id,
  s.date,
  s.day_name,
  s.main_course,
  s.side_dish,
  s.extra,
  s.image_url,
  s.is_available,
  s.label,
  s.sort_order
from public.batches b
join public.batch_slots s on s.batch_id = b.id
where b.is_active = true
order by s.date asc, s.sort_order asc;

alter table public.batches enable row level security;
alter table public.batch_slots enable row level security;
alter table public.holidays enable row level security;
alter table public.join_requests enable row level security;
alter table public.admin_settings enable row level security;
alter table public.admin_credentials enable row level security;

create policy "public can read active batches"
on public.batches for select to anon, authenticated
using (is_active = true);

create policy "public can read slots of active batches"
on public.batch_slots for select to anon, authenticated
using (
  exists (
    select 1 from public.batches b
    where b.id = batch_slots.batch_id
      and b.is_active = true
  )
);

create policy "public can read holidays"
on public.holidays for select to anon, authenticated
using (true);

create policy "public can create join requests"
on public.join_requests for insert to anon, authenticated
with check (true);
