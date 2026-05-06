-- ============================================================
-- DSA Mentor AI — Phase 1 Initial Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: users_profile
-- Extends Supabase Auth users with app-specific data
-- ============================================================
CREATE TABLE public.users_profile (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  username     TEXT UNIQUE NOT NULL,
  avatar_url   TEXT,
  level        TEXT NOT NULL DEFAULT 'Beginner'
               CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: topics
-- Master list of DSA topics
-- ============================================================
CREATE TABLE public.topics (
  id    SERIAL PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE,
  slug  TEXT NOT NULL UNIQUE,
  icon  TEXT
);

-- ============================================================
-- TABLE: problems
-- Master problem database
-- ============================================================
CREATE TABLE public.problems (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  platform    TEXT NOT NULL CHECK (platform IN ('LeetCode', 'HackerRank', 'CodeChef', 'Custom')),
  difficulty  TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  topic_id    INTEGER NOT NULL REFERENCES public.topics(id),
  topic_name  TEXT NOT NULL,
  link        TEXT,
  is_must_do  BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: submissions
-- User's problem attempts and solutions
-- ============================================================
CREATE TABLE public.submissions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id          UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  status              TEXT NOT NULL DEFAULT 'todo'
                      CHECK (status IN ('todo', 'solved', 'attempted', 'skipped')),
  time_taken_minutes  INTEGER CHECK (time_taken_minutes > 0),
  notes               TEXT,
  is_favourite        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- ============================================================
-- TABLE: user_stats
-- Aggregated statistics per user (updated via triggers)
-- ============================================================
CREATE TABLE public.user_stats (
  user_id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_solved      INTEGER NOT NULL DEFAULT 0,
  easy_solved       INTEGER NOT NULL DEFAULT 0,
  medium_solved     INTEGER NOT NULL DEFAULT 0,
  hard_solved       INTEGER NOT NULL DEFAULT 0,
  current_streak    INTEGER NOT NULL DEFAULT 0,
  longest_streak    INTEGER NOT NULL DEFAULT 0,
  weak_topics       TEXT[] NOT NULL DEFAULT '{}',
  accuracy_percent  NUMERIC(5,2) NOT NULL DEFAULT 0,
  last_active       DATE,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: streak_history
-- Daily activity log for heatmap visualization
-- ============================================================
CREATE TABLE public.streak_history (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date             DATE NOT NULL,
  problems_solved  INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, date)
);

-- ============================================================
-- TABLE: ai_responses (cache for Phase 4)
-- Pre-populated in Phase 1, used in Phase 4
-- ============================================================
CREATE TABLE public.ai_responses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id  UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('hint', 'approach', 'review')),
  content     TEXT NOT NULL,
  model       TEXT NOT NULL DEFAULT 'rule-based',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(problem_id, type)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — Enable on all tables
-- ============================================================

ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streak_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_responses ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- users_profile: users can only read/insert/update their own profile
CREATE POLICY "Users can view own profile"
  ON public.users_profile FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users_profile FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users_profile FOR UPDATE
  USING (auth.uid() = id);

-- topics: all authenticated users can read topics
CREATE POLICY "All users can read topics"
  ON public.topics FOR SELECT
  TO authenticated
  USING (true);

-- problems: all authenticated users can read problems
CREATE POLICY "All users can read problems"
  ON public.problems FOR SELECT
  TO authenticated
  USING (true);

-- submissions: users can only CRUD their own submissions
CREATE POLICY "Users can view own submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions"
  ON public.submissions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own submissions"
  ON public.submissions FOR DELETE
  USING (auth.uid() = user_id);

-- user_stats: users can only read and update their own stats
CREATE POLICY "Users can view own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- streak_history: users can only read and insert their own history
CREATE POLICY "Users can view own streak history"
  ON public.streak_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak history"
  ON public.streak_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ai_responses: all authenticated users can read (shared cache)
CREATE POLICY "All users can read AI responses"
  ON public.ai_responses FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create user_stats row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profile (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );

  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_users_profile
  BEFORE UPDATE ON public.users_profile
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_submissions
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- INDEXES (performance)
-- ============================================================
CREATE INDEX idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX idx_submissions_problem_id ON public.submissions(problem_id);
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_problems_topic_id ON public.problems(topic_id);
CREATE INDEX idx_problems_difficulty ON public.problems(difficulty);
CREATE INDEX idx_streak_history_user_date ON public.streak_history(user_id, date DESC);
