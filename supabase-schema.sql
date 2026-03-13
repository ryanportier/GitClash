-- ============================================================
-- GitClash — Supabase Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  github_username text not null,
  github_id     text not null,
  display_name  text not null,
  avatar_url    text default '',
  rank_points   integer default 1000,
  rank_title    text default 'Unranked',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ============================================================
-- FIGHTERS
-- ============================================================
create table if not exists fighters (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references profiles(id) on delete cascade,
  github_username text not null,
  name          text not null,
  class         text not null,
  rarity        text not null default 'common',
  title         text not null default 'Rookie',
  stats         jsonb not null default '{}',
  level         integer default 1,
  xp            integer default 0,
  hp            integer default 100,
  max_hp        integer default 100,
  wins          integer default 0,
  losses        integer default 0,
  win_streak    integer default 0,
  badges        text[] default '{}',
  aura_color    text default '#00c4ff',
  sprite_seed   text default '',
  avatar_url    text default '',
  created_at    timestamptz default now(),
  last_sync_at  timestamptz default now()
);

create index if not exists fighters_user_id_idx on fighters(user_id);

-- ============================================================
-- FIGHTER METRICS
-- ============================================================
create table if not exists fighter_metrics (
  id                    uuid primary key default uuid_generate_v4(),
  fighter_id            uuid not null references fighters(id) on delete cascade,
  user_id               uuid not null references profiles(id) on delete cascade,
  recent_commits        integer default 0,
  total_commits         integer default 0,
  consistency_score     integer default 0,
  public_repos          integer default 0,
  merged_prs            integer default 0,
  external_contributions integer default 0,
  stars_received        integer default 0,
  forks                 integer default 0,
  language_count        integer default 0,
  top_language          text default 'Unknown',
  account_age_days      integer default 0,
  weekly_activity_burst integer default 0,
  repo_depth            numeric default 0,
  raw_data              jsonb default '{}',
  created_at            timestamptz default now(),
  unique (fighter_id)
);

-- ============================================================
-- BATTLES
-- ============================================================
create table if not exists battles (
  id                  uuid primary key default uuid_generate_v4(),
  player1_id          uuid not null references profiles(id),
  player2_id          uuid not null references profiles(id),
  winner_id           uuid references profiles(id),
  loser_id            uuid references profiles(id),
  battle_log          jsonb default '[]',
  seed                text not null,
  xp_gained           integer default 0,
  rank_points_change  integer default 0,
  created_at          timestamptz default now()
);

create index if not exists battles_player1_idx on battles(player1_id);
create index if not exists battles_player2_idx on battles(player2_id);
create index if not exists battles_created_at_idx on battles(created_at desc);

-- ============================================================
-- RANKINGS (materialized view / table)
-- ============================================================
create table if not exists rankings (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references profiles(id) on delete cascade,
  rank_points   integer default 1000,
  rank_position integer default 0,
  updated_at    timestamptz default now(),
  unique (user_id)
);

-- ============================================================
-- REWARDS
-- ============================================================
create table if not exists rewards (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles(id) on delete cascade,
  type        text not null,
  value       text not null,
  description text default '',
  earned_at   timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles: public read, self write
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);

-- Fighters: public read, self write
alter table fighters enable row level security;
create policy "Fighters are viewable by everyone" on fighters for select using (true);
create policy "Users can manage their own fighter" on fighters for all using (auth.uid() = user_id);

-- Metrics: self only
alter table fighter_metrics enable row level security;
create policy "Users can manage their own metrics" on fighter_metrics for all using (auth.uid() = user_id);
create policy "Metrics are viewable by everyone" on fighter_metrics for select using (true);

-- Battles: public read, self write
alter table battles enable row level security;
create policy "Battles are viewable by everyone" on battles for select using (true);
create policy "Players can insert battles" on battles for insert with check (auth.uid() = player1_id);

-- Rankings: public read
alter table rankings enable row level security;
create policy "Rankings are viewable by everyone" on rankings for select using (true);
create policy "Users can manage their ranking" on rankings for all using (auth.uid() = user_id);

-- Rewards: self only
alter table rewards enable row level security;
create policy "Users can view their own rewards" on rewards for select using (auth.uid() = user_id);

-- ============================================================
-- HELPER FUNCTION: increment
-- ============================================================
create or replace function increment(x integer)
returns integer as $$
  select x + 1
$$ language sql immutable;
