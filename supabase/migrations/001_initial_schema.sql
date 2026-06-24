-- Daily Devotion Growth OS — Initial Schema
-- Run this in your Supabase SQL editor: https://supabase.com/dashboard/project/tehkhuhpfbqrdzptvxjc/sql

create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  description text,
  created_at  timestamptz default now()
);

create table if not exists verses (
  id          uuid primary key default gen_random_uuid(),
  reference   text not null unique,
  text        text not null,
  created_at  timestamptz default now()
);

create table if not exists creative_angles (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  created_at  timestamptz default now()
);

create table if not exists generated_creatives (
  id                  uuid primary key default gen_random_uuid(),
  product_id          uuid references products(id) on delete set null,
  verse_id            uuid references verses(id) on delete set null,
  angle_id            uuid references creative_angles(id) on delete set null,
  format              text not null,
  primary_text        text,
  headline            text,
  ugc_script          text,
  voiceover_script    text,
  product_description text,
  hooks               jsonb default '[]'::jsonb,
  ctas                jsonb default '[]'::jsonb,
  notes               text,
  created_at          timestamptz default now()
);

-- Enable RLS
alter table products           enable row level security;
alter table verses             enable row level security;
alter table creative_angles    enable row level security;
alter table generated_creatives enable row level security;

-- Open policies for internal tool (no auth required)
create policy "allow all on products"            on products            for all using (true) with check (true);
create policy "allow all on verses"              on verses              for all using (true) with check (true);
create policy "allow all on creative_angles"     on creative_angles     for all using (true) with check (true);
create policy "allow all on generated_creatives" on generated_creatives for all using (true) with check (true);
