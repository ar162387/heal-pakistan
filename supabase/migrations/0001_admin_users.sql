-- Admin users table with role-based access control
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null check (role in ('super_admin', 'content_manager', 'member')),
  status text not null default 'active' check (status in ('active', 'inactive', 'suspended')),
  last_login timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.admin_users enable row level security;

-- Helper to check if the current authenticated user is a super admin.
-- Marked SECURITY DEFINER to avoid recursive RLS evaluation on admin_users.
create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
      and au.role = 'super_admin'
  );
$$;

-- Read: allow the user to see their own row, or any row if they are super admin
create policy "admin_users_select"
on public.admin_users
for select
using (
  auth.uid() = user_id
  or is_super_admin()
);

-- Insert: only super admins (bootstrap should be done via SQL/editor)
create policy "admin_users_insert"
on public.admin_users
for insert
with check (is_super_admin());

-- Update: self or super admin
create policy "admin_users_update"
on public.admin_users
for update
using (
  auth.uid() = user_id
  or is_super_admin()
)
with check (
  auth.uid() = user_id
  or is_super_admin()
);

-- Delete: only super admin
create policy "admin_users_delete"
on public.admin_users
for delete
using (is_super_admin());

-- Convenience index for lookups
create index if not exists admin_users_role_idx on public.admin_users (role);
create index if not exists admin_users_email_idx on public.admin_users (email);

