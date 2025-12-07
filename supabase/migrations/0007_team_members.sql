-- Team Members table for managing leadership, cabinet, chapter leads, and collaborators

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null check (role in ('founder', 'co-founder', 'cabinet_member', 'chapter_lead', 'collaborator')),
  designation text,
  university text,
  photo_url text,
  description text,
  is_published boolean not null default true,
  created_by uuid references public.admin_users (user_id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.team_members enable row level security;

-- Public can read published items
create policy "team_members_select_public"
on public.team_members
for select
using (is_published = true);

-- Admin/content managers can read all
create policy "team_members_select_admins"
on public.team_members
for select
using (can_manage_content());

-- Admin/content managers can insert/update/delete
create policy "team_members_insert_admins"
on public.team_members
for insert
with check (can_manage_content() and created_by = auth.uid());

create policy "team_members_update_admins"
on public.team_members
for update
using (can_manage_content())
with check (can_manage_content());

create policy "team_members_delete_admins"
on public.team_members
for delete
using (can_manage_content());

-- Helpful indexes
create index if not exists team_members_role_idx on public.team_members (role);
create index if not exists team_members_university_idx on public.team_members (university);
create index if not exists team_members_created_at_idx on public.team_members (created_at desc);

-- Public RPC function for fetching team members by role
create or replace function public.get_public_team_members()
returns table (
  id uuid,
  name text,
  role text,
  designation text,
  university text,
  photo_url text,
  description text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    tm.id,
    tm.name,
    tm.role,
    tm.designation,
    tm.university,
    tm.photo_url,
    tm.description,
    tm.created_at
  from public.team_members tm
  where tm.is_published = true
  order by
    case tm.role
      when 'founder' then 1
      when 'co-founder' then 2
      when 'cabinet_member' then 3
      when 'chapter_lead' then 4
      when 'collaborator' then 5
    end,
    tm.created_at;
$$;
