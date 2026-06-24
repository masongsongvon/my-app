-- Daily Devotion Growth OS — Phase 2 Tables
-- Run in Supabase SQL editor: https://supabase.com/dashboard/project/tehkhuhpfbqrdzptvxjc/sql
-- After 001_initial_schema.sql is applied

-- ─── Patch 001 tables: add missing columns ────────────────────────────────────
-- generated_creatives: add landing_page, ecommerce_page (Claude-generated copy)
alter table generated_creatives
  add column if not exists landing_page   text,
  add column if not exists ecommerce_page text;

-- ─── Brand Asset Library ─────────────────────────────────────────────────────
create table if not exists brand_assets (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  original_name    text,
  storage_path     text,            -- Supabase Storage path (for uploaded files)
  public_url       text,            -- CDN URL for uploaded files
  local_path       text,            -- Filesystem path for locally-imported files
  category         text not null check (category in (
                     'product_photos','lifestyle','packaging',
                     'logos','sample_ads','social_proof')),
  folder           text,            -- Source folder name (e.g. "New Product shoot")
  file_size        bigint,
  mime_type        text,
  product_tags     text[] default '{}',
  verse_tags       text[] default '{}',
  campaign_tags    text[] default '{}',
  notes            text,
  created_at       timestamptz default now()
);

-- ─── Campaign Themes ─────────────────────────────────────────────────────────
create table if not exists campaign_themes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  description text,
  color       text,
  created_at  timestamptz default now()
);

-- ─── Content Pillars (child of Campaign Theme) ───────────────────────────────
create table if not exists content_pillars (
  id          uuid primary key default gen_random_uuid(),
  theme_id    uuid references campaign_themes(id) on delete cascade,
  name        text not null,
  description text,
  created_at  timestamptz default now()
);

-- ─── Customer Personas ───────────────────────────────────────────────────────
create table if not exists personas (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  archetype    text,
  description  text,
  age_range    text,
  pain_points  text[] default '{}',
  desires      text[] default '{}',
  hook_phrases text[] default '{}',
  created_at   timestamptz default now()
);

-- ─── Campaign Plans ──────────────────────────────────────────────────────────
create table if not exists campaign_plans (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  theme_id    uuid references campaign_themes(id) on delete set null,
  description text,
  start_date  date,
  end_date    date,
  status      text default 'draft' check (status in ('draft','active','paused','completed')),
  notes       text,
  created_at  timestamptz default now()
);

-- ─── Content Calendar Items ──────────────────────────────────────────────────
create table if not exists content_calendar_items (
  id               uuid primary key default gen_random_uuid(),
  campaign_plan_id uuid references campaign_plans(id) on delete cascade,
  scheduled_date   date not null,
  theme_id         uuid references campaign_themes(id) on delete set null,
  pillar_id        uuid references content_pillars(id) on delete set null,
  persona_id       uuid references personas(id) on delete set null,
  product_id       text,            -- text to match legacy seed IDs
  verse_id         text,            -- text to match legacy seed IDs
  angle            text,
  objective        text,
  format           text,
  platform         text,
  status           text default 'planned',
  hook_preview     text,
  notes            text,
  created_at       timestamptz default now()
);

-- ─── Winning Ads (swipe file) ────────────────────────────────────────────────
create table if not exists winning_ads (
  id                uuid primary key default gen_random_uuid(),
  name              text,
  asset_id          uuid references brand_assets(id) on delete set null,
  product_id        text,
  verse_id          text,
  theme_id          uuid references campaign_themes(id) on delete set null,
  angle             text,
  format            text,
  platform          text,
  performance_notes text,
  created_at        timestamptz default now()
);

-- ─── RLS: enable on all new tables ───────────────────────────────────────────
alter table brand_assets           enable row level security;
alter table campaign_themes        enable row level security;
alter table content_pillars        enable row level security;
alter table personas               enable row level security;
alter table campaign_plans         enable row level security;
alter table content_calendar_items enable row level security;
alter table winning_ads            enable row level security;

-- ─── Open policies (internal tool — no auth) ─────────────────────────────────
create policy "allow all on brand_assets"           on brand_assets           for all using (true) with check (true);
create policy "allow all on campaign_themes"        on campaign_themes        for all using (true) with check (true);
create policy "allow all on content_pillars"        on content_pillars        for all using (true) with check (true);
create policy "allow all on personas"               on personas               for all using (true) with check (true);
create policy "allow all on campaign_plans"         on campaign_plans         for all using (true) with check (true);
create policy "allow all on content_calendar_items" on content_calendar_items for all using (true) with check (true);
create policy "allow all on winning_ads"            on winning_ads            for all using (true) with check (true);

-- ─── Supabase Storage bucket for uploaded brand assets ───────────────────────
-- Run separately in the Supabase dashboard Storage section, or via CLI:
-- supabase storage create brand-assets --public=false
