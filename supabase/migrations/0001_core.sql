-- AuraSync — core schema (Stage 1: profiles, onboarding, check-ins, diary, stars)
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query → Run).
-- Safe to re-run: everything uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS.

-- ─────────────────────────────────────────────────────────────
-- Profiles (one row per Telegram user) + onboarding + stars balance
-- ─────────────────────────────────────────────────────────────
create table if not exists public.aura_profiles (
  id                      uuid primary key default gen_random_uuid(),
  telegram_id             bigint unique not null,
  first_name              text,
  last_name               text,
  username                text,
  language_code           text,
  is_premium              boolean default false,
  photo_url               text,
  credits                 int default 0,
  referral_source         text,
  onboarding_completed    boolean default false,
  onboarding              jsonb,
  preferred_time_morning  text,
  preferred_time_evening  text,
  goals                   jsonb,
  current_mood            text,
  main_pain               text,
  stars                   int default 1365,
  subscription_type       text,
  subscription_until      timestamptz,
  is_admin                boolean default false,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

-- in case the table already existed from an earlier version, add new columns
alter table public.aura_profiles add column if not exists onboarding   jsonb;
alter table public.aura_profiles add column if not exists main_pain    text;
alter table public.aura_profiles add column if not exists stars        int default 1365;

-- ─────────────────────────────────────────────────────────────
-- Analytics events
-- ─────────────────────────────────────────────────────────────
create table if not exists public.aura_user_events (
  id           uuid primary key default gen_random_uuid(),
  telegram_id  bigint,
  event_type   text,
  event_data   jsonb,
  created_at   timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- Daily check-ins (one per user per day)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.aura_checkins (
  id           uuid primary key default gen_random_uuid(),
  telegram_id  bigint not null,
  date         date not null,
  energy       int,
  mood         int,
  stress       int,
  emotion      text,
  note         text,
  bad_day      boolean default false,
  extra        jsonb,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  unique (telegram_id, date)
);

-- ─────────────────────────────────────────────────────────────
-- Diary entries
-- ─────────────────────────────────────────────────────────────
create table if not exists public.aura_diary_entries (
  id           uuid primary key default gen_random_uuid(),
  telegram_id  bigint not null,
  text         text,
  tags         jsonb,
  emotion      text,
  created_at   timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- Stars ledger (append-only; balance also cached on aura_profiles.stars)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.aura_stars_ledger (
  id           uuid primary key default gen_random_uuid(),
  telegram_id  bigint not null,
  amount       int not null,
  label        text,
  created_at   timestamptz default now()
);

create index if not exists idx_aura_checkins_user      on public.aura_checkins (telegram_id, date desc);
create index if not exists idx_aura_diary_user         on public.aura_diary_entries (telegram_id, created_at desc);
create index if not exists idx_aura_stars_ledger_user  on public.aura_stars_ledger (telegram_id, created_at desc);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security: all access goes through the Next.js API routes
-- using the service-role key (which bypasses RLS). We enable RLS and add
-- NO public policies, so the browser anon key cannot read/write directly.
-- ─────────────────────────────────────────────────────────────
alter table public.aura_profiles       enable row level security;
alter table public.aura_user_events    enable row level security;
alter table public.aura_checkins       enable row level security;
alter table public.aura_diary_entries  enable row level security;
alter table public.aura_stars_ledger   enable row level security;
