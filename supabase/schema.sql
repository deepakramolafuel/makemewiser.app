-- Make Me Wiser — Supabase Schema
-- Run this in your Supabase project's SQL editor

-- ============================================================
-- LESSONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS lessons (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  person_name     varchar(50) NOT NULL,
  person_age      integer     CHECK (person_age > 0 AND person_age <= 120),
  country         varchar(100) NOT NULL,
  life_lesson     text        NOT NULL,
  story           text        NOT NULL,
  source          varchar(20) NOT NULL DEFAULT 'user' CHECK (source IN ('seed', 'user')),
  trigger_warning varchar(50),
  favourite_count integer     NOT NULL DEFAULT 0,
  is_approved     boolean     NOT NULL DEFAULT false,
  is_reported     boolean     NOT NULL DEFAULT false,
  report_count    integer     NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- REPORTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id   uuid        NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  reason      text,
  ip_hash     varchar(64),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_lessons_approved  ON lessons (is_approved) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_lessons_country   ON lessons (country);
CREATE INDEX IF NOT EXISTS idx_lessons_created   ON lessons (created_at);
CREATE INDEX IF NOT EXISTS idx_reports_lesson    ON reports (lesson_id);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON lessons;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RPC FUNCTIONS
-- ============================================================

-- Atomically increment favourite_count and return new value
CREATE OR REPLACE FUNCTION increment_favourite(lesson_id uuid)
RETURNS integer AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE lessons
  SET favourite_count = favourite_count + 1
  WHERE id = lesson_id
  RETURNING favourite_count INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "read_approved_lessons" ON lessons;
DROP POLICY IF EXISTS "insert_lessons"        ON lessons;
DROP POLICY IF EXISTS "update_lessons"        ON lessons;
DROP POLICY IF EXISTS "insert_reports"        ON reports;

-- Anyone can read approved, non-reported lessons
CREATE POLICY "read_approved_lessons" ON lessons
  FOR SELECT USING (is_approved = true AND is_reported = false);

-- Anyone can insert (moderation happens in API route before insert)
CREATE POLICY "insert_lessons" ON lessons
  FOR INSERT WITH CHECK (true);

-- Only the service role can update (favourites, reports, moderation)
CREATE POLICY "update_lessons" ON lessons
  FOR UPDATE USING (auth.role() = 'service_role');

-- Anyone can insert a report
CREATE POLICY "insert_reports" ON reports
  FOR INSERT WITH CHECK (true);
