-- Waitlist signups captured by the site's form (POST /api/waitlist).
--
-- PRIVATE LIST: RLS is enabled with NO policies, so the `anon` / `authenticated`
-- roles (and therefore the public Data/REST API) can read or write NOTHING.
-- Only the server's SUPABASE_SERVICE_ROLE_KEY — which bypasses RLS and must
-- never be exposed to the browser — can insert/select. That keeps signup
-- emails out of reach of anyone hitting the API from the client.

create extension if not exists pgcrypto; -- gen_random_uuid()

create table if not exists public.waitlist (
  id         uuid        primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text        not null,
  email      text        not null unique, -- one row per email; re-signups upsert
  skill      text,
  zip        text
);

alter table public.waitlist enable row level security;
-- Intentionally no policies: deny all for anon/authenticated; service_role bypasses RLS.
