-- Admins can delete parking bays (units were already covered by "admin writes units" for all).
-- The app refuses to delete a bay that is in use or allocated to a unit; this policy only decides who may.
create policy "admin deletes parking" on public.parking_spaces for delete using (my_role() = 'Admin');
