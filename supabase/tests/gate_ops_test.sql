-- Self-check for 002_users_and_gate_ops.sql. Paste into Supabase → SQL Editor and run.
-- It always ends in an error, which rolls everything back so no test data is left behind:
-- "ALL CHECKS PASSED" = success; any other message names the check that failed.
begin;

insert into auth.users (id, email) values ('00000000-0000-0000-0000-0000000000a1', 'guard-test@example.test');
update public.profiles set role = 'Guard', name = 'Test Guard' where id = '00000000-0000-0000-0000-0000000000a1';
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);

insert into public.parking_spaces (id, "bayNumber", zone, type, status) values
  ('t-v1', 'T-V01', 'Test', 'Visitor', 'Available'),
  ('t-v2', 'T-V02', 'Test', 'Visitor', 'Occupied_Visitor');
insert into public.visitor_passes (id, "passCode", "guestName", "guestPhone", "vehiclePlate", "unitId", "unitNumber", "residentName", "visitorType", "validFrom", "validUntil") values
  ('t-p1', 'T-CODE-1', 'Guest One', '-', 'TST-001', 'u', 'T-1', 'Res', 'Guest', now() - interval '1 hour', now() + interval '1 hour'),
  ('t-p2', 'T-CODE-2', 'Guest Two', '-', null, 'u', 'T-1', 'Res', 'Guest', now() - interval '2 hour', now() - interval '1 hour');

do $$
declare l public.visitor_logs;
begin
  assert (select email from public.profiles where id = '00000000-0000-0000-0000-0000000000a1') = 'guard-test@example.test',
    'new profile should copy the email';

  l := public.check_in('t-p1', 'T-V01');
  assert l."assignedParkingBay" = 'T-V01', 'check_in should use the requested free bay';
  assert l."guardName" = 'Test Guard', 'guard name should come from the profile';
  assert (select status from public.visitor_passes where id = 't-p1') = 'CheckedIn', 'pass should be CheckedIn';
  assert (select status from public.parking_spaces where id = 't-v1') = 'Occupied_Visitor', 'bay should be occupied';

  begin
    perform public.check_in('t-p1');
    raise exception 'FAIL: pass was reused';
  exception when others then
    if sqlerrm like 'FAIL%' then raise; end if;
  end;

  begin
    perform public.check_in('t-p2');
    raise exception 'FAIL: expired pass accepted';
  exception when others then
    if sqlerrm like 'FAIL%' then raise; end if;
  end;

  l := public.check_out(l.id);
  assert l.status = 'Departed' and l."exitTime" is not null, 'log should be Departed';
  assert (select status from public.visitor_passes where id = 't-p1') = 'Completed', 'pass should be Completed';
  assert (select status from public.parking_spaces where id = 't-v1') = 'Available', 'bay should be free again';

  -- Requested bay is taken and the guest is on foot -> no bay at all.
  l := public.walk_in('Courier', 'T-1', 'Delivery', '', 'T-V02', null);
  assert l."assignedParkingBay" is null, 'walk-in on foot must not get the taken bay';
  l := public.walk_in('Driver', 'T-1', 'Guest', 'TST-002', 'T-V01', 'note');
  assert l."assignedParkingBay" = 'T-V01', 'walk-in with a car gets the requested free bay';
  assert (select "currentVehiclePlate" from public.parking_spaces where id = 't-v1') = 'TST-002', 'bay should hold the plate';

  update public.profiles set role = 'Resident' where id = '00000000-0000-0000-0000-0000000000a1';
  begin
    perform public.check_out(l.id);
    raise exception 'FAIL: resident ran check_out';
  exception when others then
    if sqlerrm like 'FAIL%' then raise; end if;
  end;
  raise exception 'ALL CHECKS PASSED';
end $$;
