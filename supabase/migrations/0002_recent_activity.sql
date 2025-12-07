-- Recent activity log for auditing CRUD actions
create table if not exists public.recent_activity (
  id bigserial primary key,
  actor_id uuid references public.admin_users (user_id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.recent_activity enable row level security;

create index if not exists recent_activity_created_at_idx on public.recent_activity (created_at desc);

-- Admins can read activity
create policy "recent_activity_select_for_admins"
on public.recent_activity
for select
using (
  exists (select 1 from public.admin_users au where au.user_id = auth.uid())
);

-- Only authenticated admins can write activity for their own actor_id
create policy "recent_activity_insert_by_actor"
on public.recent_activity
for insert
with check (
  exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  and actor_id = auth.uid()
);

