-- Broaden insert policy so both anon and authenticated users can submit

drop policy if exists "membership_insert_public" on public.membership_applications;

create policy "membership_insert_public_or_auth"
on public.membership_applications
for insert
with check (auth.role() in ('anon', 'authenticated'));
