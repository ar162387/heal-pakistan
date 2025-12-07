-- Alumni & Internship profiles with admin-only management and public read RPC

-- Ensure helper for content-managing admins (super_admin or content_manager)
create or replace function public.can_manage_content()
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
      and au.role in ('super_admin', 'content_manager')
  );
$$;

create table if not exists public.alumni_profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  university text not null,
  batch text not null,
  bio text,
  contact_email text,
  contact_phone text,
  profile_photo_url text,
  is_published boolean not null default true,
  created_by uuid references public.admin_users (user_id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.alumni_profiles enable row level security;

create policy "alumni_profiles_select_admins"
on public.alumni_profiles
for select
using (can_manage_content());

create policy "alumni_profiles_insert_admins"
on public.alumni_profiles
for insert
with check (can_manage_content() and created_by = auth.uid());

create policy "alumni_profiles_update_admins"
on public.alumni_profiles
for update
using (can_manage_content())
with check (can_manage_content());

create policy "alumni_profiles_delete_admins"
on public.alumni_profiles
for delete
using (can_manage_content());

create index if not exists alumni_profiles_university_idx on public.alumni_profiles (university);
create index if not exists alumni_profiles_batch_idx on public.alumni_profiles (batch);
create index if not exists alumni_profiles_created_at_idx on public.alumni_profiles (created_at desc);

-- Public, read-only RPC for frontend consumption (excludes contact details)
create or replace function public.get_public_alumni(
  search text default '',
  university text default null,
  batch text default null,
  limit_rows int default 100,
  offset_rows int default 0
)
returns table (
  id uuid,
  full_name text,
  university text,
  batch text,
  bio text,
  profile_photo_url text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $func$
  select
    a.id,
    a.full_name,
    a.university,
    a.batch,
    a.bio,
    a.profile_photo_url,
    a.created_at
  from public.alumni_profiles a
  where a.is_published = true
    and (
      coalesce(search, '') = ''
      or a.full_name ilike '%' || search || '%'
      or a.university ilike '%' || search || '%'
      or a.batch ilike '%' || search || '%'
    )
    and (university is null or university = '' or a.university = university)
    and (batch is null or batch = '' or a.batch = batch)
  order by a.created_at desc
  limit limit_rows
  offset offset_rows;
$func$;

grant execute on function public.get_public_alumni(text, text, text, int, int) to anon, authenticated;

