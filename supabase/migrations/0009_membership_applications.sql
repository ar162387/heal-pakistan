-- Membership applications submitted from the public Join form

create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  organization text,
  join_as text not null check (join_as in ('member', 'volunteer', 'donor')),
  motivation text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_by uuid references public.admin_users (user_id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.membership_applications enable row level security;

-- Allow public (anon) to submit applications
create policy "membership_insert_public"
on public.membership_applications
for insert
with check (auth.uid() is null or auth.role() = 'anon');

-- Admin/content managers can read all
create policy "membership_select_admins"
on public.membership_applications
for select
using (can_manage_content());

-- Admin/content managers can update (approve/reject)
create policy "membership_update_admins"
on public.membership_applications
for update
using (can_manage_content())
with check (can_manage_content());

-- Admin/content managers can delete if needed
create policy "membership_delete_admins"
on public.membership_applications
for delete
using (can_manage_content());

-- Helpful indexes
create index if not exists membership_status_idx on public.membership_applications (status);
create index if not exists membership_join_as_idx on public.membership_applications (join_as);
create index if not exists membership_created_at_idx on public.membership_applications (created_at desc);
