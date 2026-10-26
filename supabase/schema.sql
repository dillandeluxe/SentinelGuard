-- SentinelGuard database. Fresh install: run this once in Supabase → SQL Editor, then each file in supabase/migrations/ in order.
-- Column names are quoted camelCase so rows map 1:1 to src/lib/types.ts (same as Prisma's default naming).
-- Roles are enforced here with Row-Level Security, not in the UI.

-- ── Accounts ──────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null default '',
  role text not null default 'Resident' check (role in ('Guard', 'Resident', 'Admin')),
  "unitNumber" text -- set by an admin; links a resident to their unit
);

-- Every sign-up becomes a Resident with no unit. Admins promote/link in the Table Editor.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name) values (new.id, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- security definer so policies can read the caller's profile without recursing into its RLS.
create function public.my_role() returns text
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;
create function public.my_unit() returns text
language sql stable security definer set search_path = public as $$
  select "unitNumber" from public.profiles where id = auth.uid()
$$;

-- ── Data ──────────────────────────────────────────────────────────────────
create table public.units (
  id text primary key,
  "unitNumber" text not null unique,
  block text not null,
  floor int not null,
  "residentName" text not null,
  "residentPhone" text not null,
  status text not null default 'Occupied',
  "allocatedParkingBay" text,
  "registeredVehicles" text[] not null default '{}'
);

create table public.visitor_passes (
  id text primary key,
  "passCode" text not null unique,
  "guestName" text not null,
  "guestPhone" text not null,
  "vehiclePlate" text,
  "unitId" text not null,
  "unitNumber" text not null,
  "residentName" text not null,
  "visitorType" text not null,
  "validFrom" timestamptz not null,
  "validUntil" timestamptz not null,
  status text not null default 'Active' check (status in ('Active', 'CheckedIn', 'Completed', 'Expired')),
  "assignedParkingBay" text,
  "createdAt" timestamptz not null default now()
);

create table public.visitor_logs (
  id text primary key,
  "passId" text,
  "guestName" text not null,
  "visitorType" text not null,
  "unitNumber" text not null,
  "vehiclePlate" text,
  "entryTime" timestamptz not null,
  "exitTime" timestamptz,
  "guardName" text not null,
  "assignedParkingBay" text,
  status text not null check (status in ('Inside', 'Departed')),
  notes text
);

create table public.parking_spaces (
  id text primary key,
  "bayNumber" text not null unique,
  zone text not null,
  type text not null,
  status text not null default 'Available',
  "currentVehiclePlate" text,
  "assignedUnitNumber" text,
  "occupantName" text,
  "entryTime" timestamptz,
  "maxHoursAllowed" int
);

create table public.lpr_detections (
  id text primary key,
  "plateNumber" text not null,
  confidence real not null,
  timestamp text not null,
  "cameraName" text not null,
  "matchedStatus" text not null,
  "matchedUnit" text,
  "matchedName" text,
  "suggestedAction" text not null
);

-- ── Who can do what ───────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.units enable row level security;
alter table public.visitor_passes enable row level security;
alter table public.visitor_logs enable row level security;
alter table public.parking_spaces enable row level security;
alter table public.lpr_detections enable row level security;

-- Profiles: you see your own; admins see everyone. Only admins change roles/units (via dashboard or this policy).
create policy "own profile" on public.profiles for select using (id = auth.uid() or my_role() = 'Admin');
create policy "admin edits profiles" on public.profiles for update using (my_role() = 'Admin');

-- Units: staff see all (directory); a resident sees only their own unit. Only admins write.
create policy "read units" on public.units for select
  using (my_role() in ('Guard', 'Admin') or "unitNumber" = my_unit());
create policy "admin writes units" on public.units for all
  using (my_role() = 'Admin') with check (my_role() = 'Admin');

-- Passes: residents create/read passes for their own unit only; staff read all and update status at check-in/out.
create policy "read passes" on public.visitor_passes for select
  using (my_role() in ('Guard', 'Admin') or "unitNumber" = my_unit());
create policy "resident creates own passes" on public.visitor_passes for insert
  with check (my_role() in ('Guard', 'Admin') or ("unitNumber" = my_unit() and status = 'Active'));
create policy "staff update passes" on public.visitor_passes for update
  using (my_role() in ('Guard', 'Admin'));

-- Logs and LPR reads: staff only. No deletes for anyone, so the trail can't be erased from the app.
create policy "staff read logs" on public.visitor_logs for select using (my_role() in ('Guard', 'Admin'));
create policy "staff insert logs" on public.visitor_logs for insert with check (my_role() in ('Guard', 'Admin'));
create policy "staff update logs" on public.visitor_logs for update using (my_role() in ('Guard', 'Admin'));
create policy "staff read lpr" on public.lpr_detections for select using (my_role() in ('Guard', 'Admin'));
create policy "staff insert lpr" on public.lpr_detections for insert with check (my_role() in ('Guard', 'Admin'));

-- Parking: staff see/update all, admins create bays; a resident sees their unit's bay and bays their guests occupy.
create policy "read parking" on public.parking_spaces for select
  using (
    my_role() in ('Guard', 'Admin')
    or "assignedUnitNumber" = my_unit()
    or "bayNumber" = (select "allocatedParkingBay" from public.units where "unitNumber" = my_unit())
  );
create policy "staff update parking" on public.parking_spaces for update using (my_role() in ('Guard', 'Admin'));
create policy "admin creates parking" on public.parking_spaces for insert with check (my_role() = 'Admin');
create policy "admin deletes parking" on public.parking_spaces for delete using (my_role() = 'Admin');

-- ── Live sync to every open device ────────────────────────────────────────
alter publication supabase_realtime add table
  public.units, public.visitor_passes, public.visitor_logs, public.parking_spaces, public.lpr_detections;
