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
-- FAVOURITES TRACKING TABLE
-- Backs server-side dedup so a single IP can favourite a lesson at most once.
-- ============================================================
CREATE TABLE IF NOT EXISTS favourites (
  lesson_id   uuid        NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  ip_hash     varchar(64) NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (lesson_id, ip_hash)
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

-- Atomically increment favourite_count and return new value.
-- Inserts a (lesson_id, ip_hash) row into favourites for dedup. If the pair
-- already exists, no-ops and returns the current count unchanged.
CREATE OR REPLACE FUNCTION increment_favourite(p_lesson_id uuid, p_ip_hash text)
RETURNS integer AS $$
DECLARE
  v_inserted boolean;
  v_count    integer;
BEGIN
  INSERT INTO favourites (lesson_id, ip_hash)
  VALUES (p_lesson_id, p_ip_hash)
  ON CONFLICT DO NOTHING;

  GET DIAGNOSTICS v_inserted = ROW_COUNT;

  IF v_inserted THEN
    UPDATE lessons
    SET favourite_count = favourite_count + 1
    WHERE id = p_lesson_id
    RETURNING favourite_count INTO v_count;
  ELSE
    SELECT favourite_count INTO v_count FROM lessons WHERE id = p_lesson_id;
  END IF;

  RETURN COALESCE(v_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomically increment report_count, auto-hide at threshold, return new count.
CREATE OR REPLACE FUNCTION increment_report_count(p_lesson_id uuid, p_threshold integer DEFAULT 3)
RETURNS integer AS $$
DECLARE
  v_count integer;
BEGIN
  UPDATE lessons
  SET report_count = report_count + 1,
      is_reported  = (report_count + 1) >= p_threshold OR is_reported
  WHERE id = p_lesson_id
  RETURNING report_count INTO v_count;
  RETURN COALESCE(v_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Return a single random approved, non-reported lesson, optionally excluding ids.
-- Uses ORDER BY random() LIMIT 1 — fine up to ~10k rows. Swap to TABLESAMPLE
-- if the table outgrows that.
CREATE OR REPLACE FUNCTION random_lesson(exclude_ids uuid[] DEFAULT ARRAY[]::uuid[])
RETURNS TABLE (
  id              uuid,
  person_name     varchar,
  person_age      integer,
  country         varchar,
  life_lesson     text,
  story           text,
  trigger_warning varchar,
  favourite_count integer
) AS $$
  SELECT
    l.id,
    l.person_name,
    l.person_age,
    l.country,
    l.life_lesson,
    l.story,
    l.trigger_warning,
    l.favourite_count
  FROM lessons l
  WHERE l.is_approved = true
    AND l.is_reported = false
    AND (exclude_ids IS NULL OR NOT (l.id = ANY(exclude_ids)))
  ORDER BY random()
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Return total approved-non-reported lesson count and distinct country count
-- in a single round trip.
CREATE OR REPLACE FUNCTION lesson_stats()
RETURNS TABLE (total_lessons bigint, total_countries bigint) AS $$
  SELECT
    COUNT(*)             AS total_lessons,
    COUNT(DISTINCT country) AS total_countries
  FROM lessons
  WHERE is_approved = true AND is_reported = false;
$$ LANGUAGE sql STABLE;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE lessons    ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports    ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "read_approved_lessons" ON lessons;
DROP POLICY IF EXISTS "insert_lessons"        ON lessons;
DROP POLICY IF EXISTS "update_lessons"        ON lessons;
DROP POLICY IF EXISTS "insert_reports"        ON reports;
DROP POLICY IF EXISTS "service_only_favourites" ON favourites;

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

-- Favourites table is touched only by service-role RPC; no anon access
CREATE POLICY "service_only_favourites" ON favourites
  FOR ALL USING (auth.role() = 'service_role');
