-- Testimonials table to store supporter and intern quotes

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('supporter', 'intern')),
  name text not null,
  quote text not null,
  role text,
  institute text,
  university text,
  batch text,
  photo_url text,
  is_published boolean not null default true,
  created_by uuid references public.admin_users (user_id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.testimonials enable row level security;

-- Public can read published testimonials
create policy "testimonials_select_public"
on public.testimonials
for select
using (is_published = true);

-- Admin/content managers can read all
create policy "testimonials_select_admins"
on public.testimonials
for select
using (can_manage_content());

-- Admin/content managers can insert/update/delete
create policy "testimonials_insert_admins"
on public.testimonials
for insert
with check (can_manage_content() and created_by = auth.uid());

create policy "testimonials_update_admins"
on public.testimonials
for update
using (can_manage_content())
with check (can_manage_content());

create policy "testimonials_delete_admins"
on public.testimonials
for delete
using (can_manage_content());

-- Helpful indexes
create index if not exists testimonials_category_idx on public.testimonials (category);
create index if not exists testimonials_created_at_idx on public.testimonials (created_at desc);
