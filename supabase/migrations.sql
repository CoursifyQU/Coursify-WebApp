-- ============================================================
-- Distribution Contribution & AI Gating System
-- Run this SQL in the Supabase SQL editor (or as a migration)
-- ============================================================

-- --------------------------------------------------------
-- 1. user_profiles table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  year_of_study INTEGER NOT NULL DEFAULT 1 CHECK (year_of_study BETWEEN 1 AND 6),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_semester_prompted TEXT,       -- e.g. "F25", "W26"
  last_year_bump_at TIMESTAMPTZ     -- tracks when year was last auto-incremented
);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS: Users can only read/update their own profile
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Service role can insert profiles (for auth callback)
CREATE POLICY "Service role can insert profiles"
  ON user_profiles FOR INSERT
  WITH CHECK (true);

-- --------------------------------------------------------
-- 2. user_contributions table
-- --------------------------------------------------------
-- Tracks which (user, course, term) combos have been contributed.
-- UNIQUE constraint prevents re-claiming same contribution.
CREATE TABLE IF NOT EXISTS user_contributions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  term TEXT NOT NULL,
  contributed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id, term)
);

CREATE INDEX IF NOT EXISTS idx_user_contributions_user ON user_contributions(user_id);

ALTER TABLE user_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contributions"
  ON user_contributions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role handles inserts
CREATE POLICY "Service role can insert contributions"
  ON user_contributions FOR INSERT
  WITH CHECK (true);

-- --------------------------------------------------------
-- 3. ai_request_log table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_request_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_request_log_user_time
  ON ai_request_log(user_id, requested_at DESC);

ALTER TABLE ai_request_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own request log"
  ON ai_request_log FOR SELECT
  USING (auth.uid() = user_id);

-- Service role handles inserts
CREATE POLICY "Service role can insert request log"
  ON ai_request_log FOR INSERT
  WITH CHECK (true);

-- --------------------------------------------------------
-- 4. Year auto-bump function (run via pg_cron on Sept 1 each year)
-- --------------------------------------------------------
-- To schedule with pg_cron (if enabled on Supabase):
--   SELECT cron.schedule('bump-year-of-study', '0 0 1 9 *', $$
--     SELECT bump_year_of_study();
--   $$);

CREATE OR REPLACE FUNCTION bump_year_of_study()
RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET
    year_of_study = LEAST(year_of_study + 1, 6),
    last_year_bump_at = NOW(),
    updated_at = NOW()
  WHERE
    last_year_bump_at IS NULL
    OR last_year_bump_at < (DATE_TRUNC('year', NOW()) + INTERVAL '8 months');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --------------------------------------------------------
-- 5. Helper: get user contribution count
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_contribution_count(p_user_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM user_contributions WHERE user_id = p_user_id;
$$ LANGUAGE sql SECURITY DEFINER;
