-- AuraSync — start the stars balance at 0 (the prior 1365 was a demo seed).
-- Run in Supabase SQL Editor.

alter table public.aura_profiles alter column stars set default 0;

-- normalize profiles still sitting on the old demo default
update public.aura_profiles set stars = 0 where stars = 1365;
