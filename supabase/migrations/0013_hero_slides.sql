-- Hero slides for homepage hero section

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  media_url text not null,
  media_type text not null check (media_type in ('image', 'video')),
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_by uuid references public.admin_users (user_id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.hero_slides enable row level security;

-- Public can read active slides
create policy "hero_slides_select_public"
on public.hero_slides
for select
using (is_active = true);

-- Admin/content managers can read all
create policy "hero_slides_select_admins"
on public.hero_slides
for select
using (can_manage_content());

-- Admin/content managers can insert/update/delete
create policy "hero_slides_modify_admins"
on public.hero_slides
for all
using (can_manage_content())
with check (can_manage_content());

-- Add hero fields to site_settings
alter table public.site_settings
  add column if not exists hero_title text,
  add column if not exists hero_subtitle text,
  add column if not exists hero_text text;
