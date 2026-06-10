-- AuraSync — generic per-user state (saved insights, emotion bookmarks,
-- shop purchases, weekly report). One jsonb column on the profile.
-- Run in Supabase SQL Editor.

alter table public.aura_profiles
  add column if not exists state jsonb default '{}'::jsonb;
