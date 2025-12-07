-- Add category to publications

alter table public.publications
add column if not exists category text not null default 'General';

create index if not exists publications_category_idx on public.publications (category);
