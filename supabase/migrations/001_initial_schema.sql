-- Schools table
CREATE TABLE IF NOT EXISTS schools (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  district text NOT NULL,
  state text DEFAULT 'Tamil Nadu',
  type text CHECK (type IN ('government','private','aided')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  school_id uuid REFERENCES schools(id),
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  age integer CHECK (age BETWEEN 4 AND 18),
  gender text CHECK (gender IN ('male','female','other')),
  roll_number text,
  grade text,
  school_id uuid REFERENCES schools(id),
  created_at timestamptz DEFAULT now()
);

-- Test sessions table
CREATE TABLE IF NOT EXISTS test_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id uuid REFERENCES teachers(id),
  school_id uuid REFERENCES schools(id),
  session_date date DEFAULT CURRENT_DATE,
  device_info text,
  browser text,
  os text,
  created_at timestamptz DEFAULT now()
);

-- Test results table
CREATE TABLE IF NOT EXISTS test_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid REFERENCES test_sessions(id),
  student_id uuid REFERENCES students(id),
  left_500hz boolean,
  left_1000hz boolean,
  left_2000hz boolean,
  left_4000hz boolean,
  right_500hz boolean,
  right_1000hz boolean,
  right_2000hz boolean,
  right_4000hz boolean,
  false_positive_count integer DEFAULT 0,
  overall_result text CHECK (overall_result IN ('normal','mild','refer')),
  created_at timestamptz DEFAULT now()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES students(id),
  result_id uuid REFERENCES test_results(id),
  referred_on date DEFAULT CURRENT_DATE,
  doctor_visited boolean DEFAULT false,
  follow_up_date date,
  notes text,
  status text DEFAULT 'pending'
    CHECK (status IN ('pending','in_progress','resolved')),
  created_at timestamptz DEFAULT now()
);

-- Admin whitelist table
CREATE TABLE IF NOT EXISTS admin_whitelist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  added_on timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION is_admin_whitelisted(check_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM admin_whitelist
    WHERE email = lower(check_email)
  );
$$;

REVOKE ALL ON FUNCTION is_admin_whitelisted(text) FROM public;
GRANT EXECUTE ON FUNCTION is_admin_whitelisted(text) TO authenticated;

-- Login logs table
CREATE TABLE IF NOT EXISTS login_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email text NOT NULL,
  login_time timestamptz DEFAULT now(),
  device_type text,
  browser text,
  os text,
  session_id text,
  logout_time timestamptz
);

-- Seed admin user
INSERT INTO admin_whitelist (email)
VALUES ('vikash07052008@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for idempotent re-runs
DROP POLICY IF EXISTS "auth_read_schools" ON schools;
DROP POLICY IF EXISTS "auth_insert_schools" ON schools;
DROP POLICY IF EXISTS "auth_read_teachers" ON teachers;
DROP POLICY IF EXISTS "auth_insert_teachers" ON teachers;
DROP POLICY IF EXISTS "auth_read_students" ON students;
DROP POLICY IF EXISTS "auth_insert_students" ON students;
DROP POLICY IF EXISTS "auth_read_sessions" ON test_sessions;
DROP POLICY IF EXISTS "auth_insert_sessions" ON test_sessions;
DROP POLICY IF EXISTS "auth_read_results" ON test_results;
DROP POLICY IF EXISTS "auth_insert_results" ON test_results;
DROP POLICY IF EXISTS "auth_all_referrals" ON referrals;
DROP POLICY IF EXISTS "admin_whitelist_deny_all" ON admin_whitelist;
DROP POLICY IF EXISTS "auth_insert_login_logs" ON login_logs;
DROP POLICY IF EXISTS "auth_read_login_logs" ON login_logs;

-- RLS Policies (authenticated users only)
CREATE POLICY "auth_read_schools" ON schools FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "auth_insert_schools" ON schools FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "auth_read_teachers" ON teachers FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "auth_insert_teachers" ON teachers FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "auth_read_students" ON students FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "auth_insert_students" ON students FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "auth_read_sessions" ON test_sessions FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "auth_insert_sessions" ON test_sessions FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "auth_read_results" ON test_results FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "auth_insert_results" ON test_results FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "auth_all_referrals" ON referrals FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_whitelist_deny_all" ON admin_whitelist
  FOR ALL USING (false);

CREATE POLICY "auth_insert_login_logs" ON login_logs FOR INSERT
  TO authenticated WITH CHECK (true);
CREATE POLICY "auth_read_login_logs" ON login_logs FOR SELECT
  TO authenticated USING (true);
