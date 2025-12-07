-- Events & gallery tables with public read and admin-only write

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique default concat('event-', replace(gen_random_uuid()::text, '-', '')),
  description text not null,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  hero_image_url text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_by uuid references public.admin_users (user_id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.event_gallery_images (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.events enable row level security;
alter table public.event_gallery_images enable row level security;

-- Select policies: public (published) + admins (all)
create policy "events_select_public"
on public.events
for select
using (is_published = true);

create policy "events_select_admins"
on public.events
for select
using (can_manage_content());

-- Write policies for admins
create policy "events_insert_admins"
on public.events
for insert
with check (can_manage_content() and created_by = auth.uid());

create policy "events_update_admins"
on public.events
for update
using (can_manage_content())
with check (can_manage_content());

create policy "events_delete_admins"
on public.events
for delete
using (can_manage_content());

-- Gallery policies
create policy "event_gallery_select_public"
on public.event_gallery_images
for select
using (
  exists (
    select 1 from public.events e
    where e.id = event_id
      and e.is_published = true
  )
  or can_manage_content()
);

create policy "event_gallery_insert_admins"
on public.event_gallery_images
for insert
with check (can_manage_content());

create policy "event_gallery_update_admins"
on public.event_gallery_images
for update
using (can_manage_content())
with check (can_manage_content());

create policy "event_gallery_delete_admins"
on public.event_gallery_images
for delete
using (can_manage_content());

-- Indexes for fast lookups and ordering
create index if not exists events_starts_at_idx on public.events (starts_at desc);
create index if not exists events_is_featured_idx on public.events (is_featured);
create index if not exists event_gallery_event_id_idx on public.event_gallery_images (event_id);
create index if not exists event_gallery_sort_idx on public.event_gallery_images (event_id, sort_order);
