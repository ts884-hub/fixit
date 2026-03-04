-- ============================================================
-- FixIt – Supabase Schema (idempotent — safe to re-run)
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Tickets ───────────────────────────────────────────────────────────────────

create table if not exists tickets (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null    default now(),
  property      text        not null,
  unit          text        not null,
  tenant_name   text        not null,
  tenant_phone  text        not null,
  category      text        not null,
  description   text        not null,
  urgency       text        not null    default 'medium'
                  check (urgency in ('low', 'medium', 'high')),
  status        text        not null    default 'new'
                  check (status in ('new', 'in_progress', 'done')),
  photo_url     text,
  manager_notes text
);

alter table tickets enable row level security;

-- Location fields (added after initial launch — idempotent)
alter table tickets
  add column if not exists location_area  text not null default 'other',
  add column if not exists location_notes text;

-- Manager/property linkage (set server-side via property token)
alter table tickets
  add column if not exists manager_id  uuid references auth.users(id),
  add column if not exists property_id uuid references properties(id);

-- RLS policies (drop before re-create to stay idempotent)
drop policy if exists "Tenants can insert tickets"    on tickets;
drop policy if exists "Managers can select tickets"   on tickets;
drop policy if exists "Managers can update tickets"   on tickets;
drop policy if exists "Managers can select own tickets" on tickets;
drop policy if exists "Managers can update own tickets" on tickets;

create policy "Tenants can insert tickets"
  on tickets for insert to anon with check (true);

create policy "Managers can select own tickets"
  on tickets for select to authenticated
  using (manager_id = auth.uid());

create policy "Managers can update own tickets"
  on tickets for update to authenticated
  using  (manager_id = auth.uid())
  with check (manager_id = auth.uid());

-- ── Properties ────────────────────────────────────────────────────────────────

create table if not exists properties (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null    default now(),
  name        text        not null,
  address     text        not null,
  token       text        not null    unique,
  manager_id  uuid        not null    references auth.users(id) on delete cascade
);

alter table properties enable row level security;

drop policy if exists "Managers can manage own properties" on properties;
drop policy if exists "Anyone can read properties"         on properties;

create policy "Managers can manage own properties"
  on properties for all to authenticated
  using  (manager_id = auth.uid())
  with check (manager_id = auth.uid());

create policy "Anyone can read properties"
  on properties for select to anon
  using (true);

-- ── Manager Profiles ──────────────────────────────────────────────────────────
-- Stores phone number and convenience email for each manager.
-- Linked 1:1 to auth.users via id.

create table if not exists manager_profiles (
  id         uuid        primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  phone      text        not null,
  email      text        not null
);

alter table manager_profiles enable row level security;

drop policy if exists "Managers can read own profile"   on manager_profiles;
drop policy if exists "Managers can update own profile" on manager_profiles;
drop policy if exists "Managers can insert own profile" on manager_profiles;

create policy "Managers can read own profile"
  on manager_profiles for select to authenticated
  using (id = auth.uid());

create policy "Managers can insert own profile"
  on manager_profiles for insert to authenticated
  with check (id = auth.uid());

create policy "Managers can update own profile"
  on manager_profiles for update to authenticated
  using  (id = auth.uid())
  with check (id = auth.uid());

-- ============================================================
-- Storage
-- ============================================================
-- In Supabase Dashboard → Storage, create a private bucket: ticket-photos
-- The backend generates signed URLs on every read (service role key).
