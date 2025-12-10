-- Contact messages submitted from the public Contact form

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read')),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.contact_messages enable row level security;

-- Allow both anon and authenticated users to submit
create policy "contact_messages_insert_public_or_auth"
on public.contact_messages
for insert
with check (auth.role() in ('anon', 'authenticated'));

-- Admin/content managers can read
create policy "contact_messages_select_admins"
on public.contact_messages
for select
using (can_manage_content());

-- Admin/content managers can update status
create policy "contact_messages_update_admins"
on public.contact_messages
for update
using (can_manage_content())
with check (can_manage_content());

-- Helpful indexes
create index if not exists contact_messages_status_idx on public.contact_messages (status);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
