-- Migration 003: Replace angle_id FK with dynamic_angle_name text
-- Angles are now AI-generated per campaign strategy — no longer rows in creative_angles table.
-- Run in Supabase SQL editor: https://supabase.com/dashboard/project/tehkhuhpfbqrdzptvxjc/sql

-- 1. Drop the foreign key constraint
alter table generated_creatives
  drop constraint if exists generated_creatives_angle_id_fkey;

-- 2. Change angle_id column type from uuid to text (stores 'dynamic' or legacy angle ids)
alter table generated_creatives
  alter column angle_id type text using angle_id::text;

-- 3. Add dynamic_angle_name to store the human-readable angle name
alter table generated_creatives
  add column if not exists dynamic_angle_name text;

-- 4. Also add the Growth OS output columns if not already present (from migration 002)
alter table generated_creatives
  add column if not exists landing_page   text,
  add column if not exists ecommerce_page text;
