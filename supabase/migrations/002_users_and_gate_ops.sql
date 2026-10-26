-- 002: user management + all-or-nothing gate operations.
-- Run once in Supabase → SQL Editor, after schema.sql. Self-check: supabase/tests/gate_ops_test.sql.

-- ── Emails on profiles, so the admin Users list can tell accounts apart ──
alter table public.profiles add column if not exists email text;
update public.profiles p set email = u.email from auth.users u where u.id = p.id and p.email is null;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''), new.email);
  return new;
end $$;

-- ── Gate operations ───────────────────────────────────────────────────────
-- Same rule as pickBay in src/lib/rules.ts. SKIP LOCKED so two guards checking in at once never get the same bay.
create or replace function public.pick_bay(requested text, has_vehicle boolean) returns text
language plpgsql set search_path = public as $$
declare bay text;
begin
  select "bayNumber" into bay from parking_spaces
    where "bayNumber" = requested and status = 'Available' for update skip locked;
  if bay is null and has_vehicle then
    select "bayNumber" into bay from parking_spaces
      where type = 'Visitor' and status = 'Available' order by "bayNumber" limit 1 for update skip locked;
  end if;
  return bay;
end $$;

-- Every function below is security definer (bypasses RLS), so each one checks the caller's role first.
-- coalesce: my_role() is null for unknown callers, and `null not in (...)` would let them through.

create or replace function public.check_in(p_pass_id text, p_bay text default null) returns public.visitor_logs
language plpgsql security definer set search_path = public as $$
declare
  pass visitor_passes;
  bay text;
  log visitor_logs;
begin
  if coalesce(my_role(), '') not in ('Guard', 'Admin') then raise exception 'Only guards can check visitors in'; end if;
  select * into pass from visitor_passes where id = p_pass_id for update;
  if not found then raise exception 'Pass not found'; end if;
  if pass.status <> 'Active' then raise exception 'Pass is already %', pass.status; end if;
  if now() not between pass."validFrom" and pass."validUntil" then raise exception 'Pass is outside its valid time'; end if;

  bay := pick_bay(coalesce(nullif(p_bay, ''), pass."assignedParkingBay"), pass."vehiclePlate" is not null);
  insert into visitor_logs (id, "passId", "guestName", "visitorType", "unitNumber", "vehiclePlate", "entryTime", "guardName", "assignedParkingBay", status)
  values ('vl-' || gen_random_uuid(), pass.id, pass."guestName", pass."visitorType", pass."unitNumber", pass."vehiclePlate",
          now(), (select name from profiles where id = auth.uid()), bay, 'Inside')
  returning * into log;
  update visitor_passes set status = 'CheckedIn' where id = pass.id;
  if bay is not null then
    update parking_spaces set status = 'Occupied_Visitor', "currentVehiclePlate" = pass."vehiclePlate",
      "assignedUnitNumber" = pass."unitNumber", "occupantName" = pass."guestName", "entryTime" = now()
    where "bayNumber" = bay;
  end if;
  return log;
end $$;

create or replace function public.walk_in(
  p_guest_name text, p_unit_number text, p_visitor_type text,
  p_vehicle_plate text default null, p_bay text default null, p_notes text default null
) returns public.visitor_logs
language plpgsql security definer set search_path = public as $$
declare
  plate text := nullif(trim(p_vehicle_plate), '');
  bay text;
  log visitor_logs;
begin
  if coalesce(my_role(), '') not in ('Guard', 'Admin') then raise exception 'Only guards can register walk-ins'; end if;
  if coalesce(trim(p_guest_name), '') = '' then raise exception 'Guest name is required'; end if;

  bay := pick_bay(nullif(p_bay, ''), plate is not null);
  insert into visitor_logs (id, "guestName", "visitorType", "unitNumber", "vehiclePlate", "entryTime", "guardName", "assignedParkingBay", status, notes)
  values ('vl-' || gen_random_uuid(), trim(p_guest_name), p_visitor_type, p_unit_number, plate,
          now(), (select name from profiles where id = auth.uid()), bay, 'Inside', nullif(p_notes, ''))
  returning * into log;
  if bay is not null then
    update parking_spaces set status = 'Occupied_Visitor', "currentVehiclePlate" = plate,
      "assignedUnitNumber" = p_unit_number, "occupantName" = trim(p_guest_name), "entryTime" = now()
    where "bayNumber" = bay;
  end if;
  return log;
end $$;

create or replace function public.check_out(p_log_id text) returns public.visitor_logs
language plpgsql security definer set search_path = public as $$
declare log visitor_logs;
begin
  if coalesce(my_role(), '') not in ('Guard', 'Admin') then raise exception 'Only guards can check visitors out'; end if;
  select * into log from visitor_logs where id = p_log_id for update;
  if not found then raise exception 'Visit not found'; end if;
  if log.status <> 'Inside' then raise exception 'Visitor already checked out'; end if;

  update visitor_logs set status = 'Departed', "exitTime" = now() where id = log.id returning * into log;
  if log."assignedParkingBay" is not null then
    update parking_spaces set status = 'Available', "currentVehiclePlate" = null, "assignedUnitNumber" = null,
      "occupantName" = null, "entryTime" = null
    where "bayNumber" = log."assignedParkingBay";
  end if;
  -- Close the pass so the same QR can't be reused.
  if log."passId" is not null then update visitor_passes set status = 'Completed' where id = log."passId"; end if;
  return log;
end $$;

-- Only signed-in users may call these (the role check inside does the rest); pick_bay is internal.
revoke execute on function public.pick_bay(text, boolean) from public, anon, authenticated;
revoke execute on function public.check_in(text, text) from public, anon;
revoke execute on function public.walk_in(text, text, text, text, text, text) from public, anon;
revoke execute on function public.check_out(text) from public, anon;
grant execute on function public.check_in(text, text) to authenticated;
grant execute on function public.walk_in(text, text, text, text, text, text) to authenticated;
grant execute on function public.check_out(text) to authenticated;
