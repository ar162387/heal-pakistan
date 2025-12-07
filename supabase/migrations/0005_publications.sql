-- Publications table for articles and media references

create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  published_on date not null,
  type text not null check (type in ('article', 'media')),
  category text not null default 'General',
  status text not null default 'draft' check (status in ('draft', 'published')),
  content text not null,
  cover_image_url text,
  external_url text,
  is_published boolean not null default true,
  created_by uuid references public.admin_users (user_id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.publications enable row level security;

-- Public can read published items
create policy "publications_select_public"
on public.publications
for select
using (is_published = true and status = 'published');

-- Admin/content managers can read all
create policy "publications_select_admins"
on public.publications
for select
using (can_manage_content());

-- Admin/content managers can insert/update/delete
create policy "publications_insert_admins"
on public.publications
for insert
with check (can_manage_content() and created_by = auth.uid());

create policy "publications_update_admins"
on public.publications
for update
using (can_manage_content())
with check (can_manage_content());

create policy "publications_delete_admins"
on public.publications
for delete
using (can_manage_content());

-- Helpful indexes
create index if not exists publications_published_on_idx on public.publications (published_on desc);
create index if not exists publications_status_idx on public.publications (status);
create index if not exists publications_type_idx on public.publications (type);
