-- Site-wide settings (single row, id = 'default')

create table if not exists public.site_settings (
  id text primary key default 'default',
  site_name text not null,
  slogan text,
  logo_url text,
  contact_email text,
  contact_phone text,
  contact_address text,
  social_facebook text,
  social_instagram text,
  social_twitter text,
  social_linkedin text,
  updated_by uuid references public.admin_users (user_id) on delete set null,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.site_settings enable row level security;

-- Allow public/anon to read settings
create policy "site_settings_select_public"
on public.site_settings
for select
using (true);

-- Allow admins/content managers to insert/update
create policy "site_settings_upsert_admins"
on public.site_settings
for all
using (can_manage_content())
with check (can_manage_content());

-- Seed default row
insert into public.site_settings (id, site_name, slogan)
values ('default', 'HEAL Pakistan', 'Reach the Unreached')
on conflict (id) do nothing;
