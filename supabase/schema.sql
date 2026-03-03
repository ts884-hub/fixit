-- ============================================================
-- PropMaint – Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- tickets table
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
  photo_url     text,        -- stores storage FILE PATH (e.g. "photos/uuid.jpg"), NOT a public URL
  manager_notes text
);

-- Enable Row Level Security
alter table tickets enable row level security;

-- Policy: anonymous users can INSERT (public tenant intake form)
create policy "Tenants can insert tickets"
  on tickets
  for insert
  to anon
  with check (true);

-- Policy: authenticated managers can SELECT all tickets
create policy "Managers can select tickets"
  on tickets
  for select
  to authenticated
  using (true);

-- Policy: authenticated managers can UPDATE tickets
create policy "Managers can update tickets"
  on tickets
  for update
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- Properties table  (Option B – unique submission links)
-- ============================================================
-- Each manager creates "properties". Each property gets a unique
-- token that becomes the tenant submission URL: /request/<token>
-- The token lets the system route a ticket to the right manager
-- without exposing any manager identity to the tenant.

create table if not exists properties (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null    default now(),
  name        text        not null,   -- human-readable label, e.g. "Sunset Apartments"
  address     text        not null,   -- street address stored as the ticket's property field
  token       text        not null    unique,  -- random 32-char hex slug used in the URL
  manager_id  uuid        not null    references auth.users(id) on delete cascade
);

alter table properties enable row level security;

-- Managers can fully manage their own properties
create policy "Managers can manage own properties"
  on properties for all
  to authenticated
  using  (manager_id = auth.uid())
  with check (manager_id = auth.uid());

-- Anonymous users need to look up a property by token to display
-- the property name on the public intake form
create policy "Anyone can read properties"
  on properties for select
  to anon
  using (true);

-- ── Add manager/property linkage columns to tickets ──────────────────────────
-- manager_id:  the Supabase Auth user who owns this ticket (set server-side via token)
-- property_id: FK to the properties table (set server-side via token)
-- Both are nullable for backwards-compatibility with any tickets created
-- before the properties feature was introduced.

alter table tickets
  add column if not exists manager_id  uuid references auth.users(id),
  add column if not exists property_id uuid references properties(id);

-- Replace the broad "all managers see all tickets" SELECT policy with one
-- that restricts each manager to seeing only their own tickets.
drop policy if exists "Managers can select tickets" on tickets;
create policy "Managers can select own tickets"
  on tickets for select
  to authenticated
  using (manager_id = auth.uid());

-- Same for UPDATE
drop policy if exists "Managers can update tickets" on tickets;
create policy "Managers can update own tickets"
  on tickets for update
  to authenticated
  using  (manager_id = auth.uid())
  with check (manager_id = auth.uid());

-- ============================================================
-- Storage
-- ============================================================
-- In the Supabase Dashboard → Storage, create a bucket named:
--   ticket-photos
-- Leave it PRIVATE (do NOT toggle "Public bucket").
-- The backend generates short-lived signed URLs on every read request.
--
-- No SQL needed for bucket creation; it is done via the dashboard
-- or Supabase CLI. The backend uses the service role key to upload.
