-- Programs that power the homepage and programs page

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  image_url text,
  key_activities text[] not null default '{}',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_by uuid references public.admin_users (user_id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.programs enable row level security;

-- Public (anon or authenticated) can read published programs
create policy "programs_select_public"
on public.programs
for select
using (is_published = true);

-- Admin/content managers full access
create policy "programs_select_admins"
on public.programs
for select
using (can_manage_content());

create policy "programs_insert_admins"
on public.programs
for insert
with check (can_manage_content());

create policy "programs_update_admins"
on public.programs
for update
using (can_manage_content())
with check (can_manage_content());

create policy "programs_delete_admins"
on public.programs
for delete
using (can_manage_content());

-- Helpful indexes for ordering and filtering
create index if not exists programs_sort_order_idx on public.programs (sort_order, created_at desc);
create index if not exists programs_published_idx on public.programs (is_published);
