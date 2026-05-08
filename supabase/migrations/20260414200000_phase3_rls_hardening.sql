-- Phase 3: RLS hardening
-- Goal:
-- 1) keep anonymous screening writes functional
-- 2) restrict sensitive reads to authenticated dashboard/admin usage

-- Remove permissive policies from initial schema
DROP POLICY IF EXISTS "Allow public read on schools" ON public.schools;
DROP POLICY IF EXISTS "Allow public insert on schools" ON public.schools;
DROP POLICY IF EXISTS "Allow public update on schools" ON public.schools;

DROP POLICY IF EXISTS "Allow public read on teachers" ON public.teachers;
DROP POLICY IF EXISTS "Allow public insert on teachers" ON public.teachers;
DROP POLICY IF EXISTS "Allow public update on teachers" ON public.teachers;

DROP POLICY IF EXISTS "Allow public read on students" ON public.students;
DROP POLICY IF EXISTS "Allow public insert on students" ON public.students;
DROP POLICY IF EXISTS "Allow public update on students" ON public.students;

DROP POLICY IF EXISTS "Allow public read on test_sessions" ON public.test_sessions;
DROP POLICY IF EXISTS "Allow public insert on test_sessions" ON public.test_sessions;

DROP POLICY IF EXISTS "Allow public read on test_results" ON public.test_results;
DROP POLICY IF EXISTS "Allow public insert on test_results" ON public.test_results;

DROP POLICY IF EXISTS "Allow public read on referrals" ON public.referrals;
DROP POLICY IF EXISTS "Allow public insert on referrals" ON public.referrals;
DROP POLICY IF EXISTS "Allow public update on referrals" ON public.referrals;

-- Schools: read needed by setup flow + dashboard
CREATE POLICY "Anon can read schools"
ON public.schools
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Authenticated can read schools"
ON public.schools
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Anon can insert schools"
ON public.schools
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Authenticated can insert schools"
ON public.schools
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Teachers: read needed by setup flow + dashboard joins
CREATE POLICY "Anon can read teachers"
ON public.teachers
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Authenticated can read teachers"
ON public.teachers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Anon can insert teachers"
ON public.teachers
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Authenticated can insert teachers"
ON public.teachers
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Students: screening writes allowed, reads restricted to authenticated users
CREATE POLICY "Authenticated can read students"
ON public.students
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Anon can insert students"
ON public.students
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Authenticated can insert students"
ON public.students
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Sessions: screening writes allowed, reads restricted to authenticated users
CREATE POLICY "Authenticated can read test sessions"
ON public.test_sessions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Anon can insert test sessions"
ON public.test_sessions
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Authenticated can insert test sessions"
ON public.test_sessions
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Test results: screening writes allowed, reads restricted to authenticated users
CREATE POLICY "Authenticated can read test results"
ON public.test_results
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Anon can insert test results"
ON public.test_results
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Authenticated can insert test results"
ON public.test_results
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Referrals: screening writes allowed, reads/updates restricted to authenticated users
CREATE POLICY "Authenticated can read referrals"
ON public.referrals
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Anon can insert referrals"
ON public.referrals
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Authenticated can insert referrals"
ON public.referrals
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated can update referrals"
ON public.referrals
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
