-- Add about page content fields
alter table public.site_settings
  add column if not exists about_intro text,
  add column if not exists about_mission text,
  add column if not exists about_vision text;

-- Seed defaults for existing row so frontend has content immediately
update public.site_settings
set
  about_intro = coalesce(
    about_intro,
    'At HEAL Pakistan, we inspire humanity and foster healing through our initiative to reach the unreached. We empower the youth with education and awareness, cultivating a compassionate generation dedicated to uplifting communities across our nation.'
  ),
  about_mission = coalesce(
    about_mission,
    'At HEAL Pakistan, we inspire humanity and foster healing through our initiative to reach the unreached. We empower the youth with education and awareness, cultivating a compassionate generation dedicated to uplifting communities across our nation.'
  ),
  about_vision = coalesce(
    about_vision,
    'To create a Pakistan where every community has access to education, healthcare, and opportunities for growth. We envision a nation led by compassionate, educated young leaders committed to positive change.'
  )
where id = 'default';
