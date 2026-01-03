-- Hybrid Tracker Supabase Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text default 'Athlete',
  xp integer default 0,
  level integer default 0,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_workout_date timestamptz,
  created_at timestamptz default now()
);

-- Workouts table
create table public.workouts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text check (type in ('run', 'lift')) not null,
  program_id uuid,
  date timestamptz default now(),
  duration_minutes integer not null,
  notes text,
  xp_earned integer default 0,
  created_at timestamptz default now()
);

-- Run logs
create table public.run_logs (
  id uuid primary key default uuid_generate_v4(),
  workout_id uuid references public.workouts(id) on delete cascade not null,
  distance_km numeric(6,2) not null,
  pace_per_km numeric(6,2) not null,
  elevation_m numeric(8,2),
  heart_rate_avg integer,
  created_at timestamptz default now()
);

-- Lift logs
create table public.lift_logs (
  id uuid primary key default uuid_generate_v4(),
  workout_id uuid references public.workouts(id) on delete cascade not null,
  exercises jsonb not null default '[]',
  created_at timestamptz default now()
);

-- Badges table
create table public.badges (
  id text primary key,
  name text not null,
  description text,
  icon text,
  criteria_type text not null,
  criteria_value numeric not null
);

-- User badges (earned)
create table public.user_badges (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge_id text references public.badges(id) not null,
  earned_at timestamptz default now(),
  unique(user_id, badge_id)
);

-- Programs table
create table public.programs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text check (type in ('strength', 'hybrid')) not null,
  description text,
  weeks jsonb not null default '[]',
  created_at timestamptz default now()
);

-- User active program
create table public.user_programs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  program_id uuid references public.programs(id) not null,
  current_week integer default 1,
  current_day integer default 1,
  started_at timestamptz default now(),
  completed_at timestamptz
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.workouts enable row level security;
alter table public.run_logs enable row level security;
alter table public.lift_logs enable row level security;
alter table public.user_badges enable row level security;
alter table public.user_programs enable row level security;

-- Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view own workouts" on public.workouts for select using (auth.uid() = user_id);
create policy "Users can insert own workouts" on public.workouts for insert with check (auth.uid() = user_id);
create policy "Users can update own workouts" on public.workouts for update using (auth.uid() = user_id);
create policy "Users can delete own workouts" on public.workouts for delete using (auth.uid() = user_id);

create policy "Users can view own run logs" on public.run_logs for select using (
  exists (select 1 from public.workouts where workouts.id = run_logs.workout_id and workouts.user_id = auth.uid())
);
create policy "Users can insert own run logs" on public.run_logs for insert with check (
  exists (select 1 from public.workouts where workouts.id = run_logs.workout_id and workouts.user_id = auth.uid())
);

create policy "Users can view own lift logs" on public.lift_logs for select using (
  exists (select 1 from public.workouts where workouts.id = lift_logs.workout_id and workouts.user_id = auth.uid())
);
create policy "Users can insert own lift logs" on public.lift_logs for insert with check (
  exists (select 1 from public.workouts where workouts.id = lift_logs.workout_id and workouts.user_id = auth.uid())
);

create policy "Users can view own badges" on public.user_badges for select using (auth.uid() = user_id);
create policy "Users can earn badges" on public.user_badges for insert with check (auth.uid() = user_id);

create policy "Users can view own program progress" on public.user_programs for select using (auth.uid() = user_id);
create policy "Users can manage own program progress" on public.user_programs for all using (auth.uid() = user_id);

-- Public read access for programs and badges
create policy "Anyone can view programs" on public.programs for select using (true);
create policy "Anyone can view badges" on public.badges for select using (true);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', 'Athlete'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert default badges
insert into public.badges (id, name, description, icon, criteria_type, criteria_value) values
  ('first_run', 'First Steps', 'Complete your first run', '🏃', 'first', 1),
  ('first_lift', 'Iron Rookie', 'Complete your first lift session', '🏋️', 'first', 1),
  ('5k_runner', '5K Runner', 'Complete a 5K run', '🎽', 'run_distance', 5),
  ('10k_runner', '10K Runner', 'Complete a 10K run', '🏅', 'run_distance', 10),
  ('half_marathon', 'Half Marathon', 'Complete a half marathon', '🏆', 'run_distance', 21.1),
  ('week_streak', 'Week Warrior', 'Maintain a 7-day workout streak', '🔥', 'streak', 7),
  ('month_streak', 'Monthly Master', 'Maintain a 30-day workout streak', '💪', 'streak', 30),
  ('100kg_squat', '100kg Squat Club', 'Squat 100kg or more', '🦵', 'lift_weight', 100),
  ('workout_10', 'Getting Started', 'Complete 10 workouts', '⭐', 'workout_count', 10),
  ('workout_50', 'Dedicated', 'Complete 50 workouts', '🌟', 'workout_count', 50),
  ('workout_100', 'Century Club', 'Complete 100 workouts', '💯', 'workout_count', 100);
