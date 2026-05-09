-- =============================================================================
-- HearWise Security Hardening Migration
-- Date: 2026-04-22
-- Purpose:
--   1. Enable RLS on ALL tables (idempotent — safe to re-run)
--   2. Drop ALL existing permissive policies (USING (true) / WITH CHECK (true))
--   3. Create strict authenticated-only policies for every table
--   4. Create admin_users table for server-side admin authorisation
--   5. No public / anon access to any table whatsoever
-- =============================================================================

-- ────────────────────────────────────────────────────────────────
-- STEP 1: Enable RLS on all tables (idempotent)
-- ────────────────────────────────────────────────────────────────
ALTER TABLE public.schools         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_sessions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals       ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────────
-- STEP 2: Drop ALL existing policies (permissive and phase-3 ones)
-- Covers initial migration + phase-3 migration policies
-- ────────────────────────────────────────────────────────────────

-- schools
DROP POLICY IF EXISTS "Allow public read on schools"        ON public.schools;
DROP POLICY IF EXISTS "Allow public insert on schools"      ON public.schools;
DROP POLICY IF EXISTS "Allow public update on schools"      ON public.schools;
DROP POLICY IF EXISTS "Anon can read schools"               ON public.schools;
DROP POLICY IF EXISTS "Anon can insert schools"             ON public.schools;
DROP POLICY IF EXISTS "Authenticated can read schools"      ON public.schools;
DROP POLICY IF EXISTS "Authenticated can insert schools"    ON public.schools;

-- teachers
DROP POLICY IF EXISTS "Allow public read on teachers"       ON public.teachers;
DROP POLICY IF EXISTS "Allow public insert on teachers"     ON public.teachers;
DROP POLICY IF EXISTS "Allow public update on teachers"     ON public.teachers;
DROP POLICY IF EXISTS "Anon can read teachers"              ON public.teachers;
DROP POLICY IF EXISTS "Anon can insert teachers"            ON public.teachers;
DROP POLICY IF EXISTS "Authenticated can read teachers"     ON public.teachers;
DROP POLICY IF EXISTS "Authenticated can insert teachers"   ON public.teachers;

-- students
DROP POLICY IF EXISTS "Allow public read on students"       ON public.students;
DROP POLICY IF EXISTS "Allow public insert on students"     ON public.students;
DROP POLICY IF EXISTS "Allow public update on students"     ON public.students;
DROP POLICY IF EXISTS "Anon can insert students"            ON public.students;
DROP POLICY IF EXISTS "Authenticated can read students"     ON public.students;
DROP POLICY IF EXISTS "Authenticated can insert students"   ON public.students;

-- test_sessions
DROP POLICY IF EXISTS "Allow public read on test_sessions"      ON public.test_sessions;
DROP POLICY IF EXISTS "Allow public insert on test_sessions"    ON public.test_sessions;
DROP POLICY IF EXISTS "Anon can insert test sessions"           ON public.test_sessions;
DROP POLICY IF EXISTS "Authenticated can read test sessions"    ON public.test_sessions;
DROP POLICY IF EXISTS "Authenticated can insert test sessions"  ON public.test_sessions;

-- test_results
DROP POLICY IF EXISTS "Allow public read on test_results"       ON public.test_results;
DROP POLICY IF EXISTS "Allow public insert on test_results"     ON public.test_results;
DROP POLICY IF EXISTS "Anon can insert test results"            ON public.test_results;
DROP POLICY IF EXISTS "Authenticated can read test results"     ON public.test_results;
DROP POLICY IF EXISTS "Authenticated can insert test results"   ON public.test_results;

-- referrals
DROP POLICY IF EXISTS "Allow public read on referrals"          ON public.referrals;
DROP POLICY IF EXISTS "Allow public insert on referrals"        ON public.referrals;
DROP POLICY IF EXISTS "Allow public update on referrals"        ON public.referrals;
DROP POLICY IF EXISTS "Anon can insert referrals"               ON public.referrals;
DROP POLICY IF EXISTS "Authenticated can read referrals"        ON public.referrals;
DROP POLICY IF EXISTS "Authenticated can insert referrals"      ON public.referrals;
DROP POLICY IF EXISTS "Authenticated can update referrals"      ON public.referrals;

-- ────────────────────────────────────────────────────────────────
-- STEP 3: Create admin_users table
-- Stores the Supabase auth user_id (UUID) of each admin.
-- This is used by RLS policies — no frontend email checks needed.
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email   TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can read the admin_users table itself (recursive — bootstrapped via service role)
DROP POLICY IF EXISTS "Admins can read admin_users" ON public.admin_users;
CREATE POLICY "Admins can read admin_users"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

-- ────────────────────────────────────────────────────────────────
-- STEP 4: Strict authenticated-only policies
-- ALL operations require auth.uid() IS NOT NULL.
-- No anon role is granted any access on any table.
-- ────────────────────────────────────────────────────────────────

-- ── SCHOOLS ──────────────────────────────────────────────────────
CREATE POLICY "Auth users can read schools"
  ON public.schools FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can insert schools"
  ON public.schools FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can update schools"
  ON public.schools FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── TEACHERS ─────────────────────────────────────────────────────
CREATE POLICY "Auth users can read teachers"
  ON public.teachers FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can insert teachers"
  ON public.teachers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can update teachers"
  ON public.teachers FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── STUDENTS ─────────────────────────────────────────────────────
-- Children's personal data — authenticated users only, no exceptions.
CREATE POLICY "Auth users can read students"
  ON public.students FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can insert students"
  ON public.students FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can update students"
  ON public.students FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── TEST_SESSIONS ────────────────────────────────────────────────
CREATE POLICY "Auth users can read test sessions"
  ON public.test_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can insert test sessions"
  ON public.test_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── TEST_RESULTS ─────────────────────────────────────────────────
CREATE POLICY "Auth users can read test results"
  ON public.test_results FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can insert test results"
  ON public.test_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── REFERRALS ────────────────────────────────────────────────────
CREATE POLICY "Auth users can read referrals"
  ON public.referrals FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can insert referrals"
  ON public.referrals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can update referrals"
  ON public.referrals FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ────────────────────────────────────────────────────────────────
-- STEP 5: Admin-only policies on sensitive aggregate views
-- Only users whose auth.uid() appears in admin_users can perform
-- dashboard-level reads (re-stated explicitly for clarity).
-- ────────────────────────────────────────────────────────────────

-- NOTE: The policies above already restrict to `authenticated`.
-- For an extra defence-in-depth layer, you can optionally narrow
-- SELECT on students / test_results / referrals to admin_users only:

-- (Uncomment to activate admin-only read restriction on PII tables)
-- DROP POLICY IF EXISTS "Auth users can read students" ON public.students;
-- CREATE POLICY "Admins can read students"
--   ON public.students FOR SELECT
--   TO authenticated
--   USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

-- ────────────────────────────────────────────────────────────────
-- DONE — Run via: supabase db push  OR  supabase migration up
-- ────────────────────────────────────────────────────────────────
