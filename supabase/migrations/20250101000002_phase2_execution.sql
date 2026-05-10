-- ============================================================
-- DSA Mentor AI — Phase 2: Code Execution Schema
-- ============================================================

-- Add code execution columns to existing submissions table
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS code         TEXT,
  ADD COLUMN IF NOT EXISTS language     TEXT DEFAULT 'javascript',
  ADD COLUMN IF NOT EXISTS last_run_at  TIMESTAMPTZ;

-- ============================================================
-- TABLE: execution_runs
-- Stores individual test run history (NOT final submissions)
-- Separate from submissions — runs are frequent and cheap
-- ============================================================
CREATE TABLE IF NOT EXISTS public.execution_runs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id   UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  code         TEXT NOT NULL,
  language     TEXT NOT NULL,
  stdin        TEXT,
  stdout       TEXT,
  stderr       TEXT,
  compile_out  TEXT,
  status_id    INTEGER NOT NULL,
  status_desc  TEXT NOT NULL,
  time_ms      NUMERIC,
  memory_kb    INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.execution_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own execution runs"
  ON public.execution_runs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Performance index
CREATE INDEX IF NOT EXISTS idx_execution_runs_user_problem
  ON public.execution_runs(user_id, problem_id, created_at DESC);
