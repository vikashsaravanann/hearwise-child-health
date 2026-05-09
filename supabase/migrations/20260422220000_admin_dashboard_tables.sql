-- ============================================================
-- HearWise Admin Dashboard — New Tables & RLS
-- Migration: 20260422220000_admin_dashboard_tables.sql
-- ============================================================

-- 1. admin_whitelist — controls who can access the dashboard
CREATE TABLE IF NOT EXISTS admin_whitelist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  added_on timestamptz DEFAULT now()
);

ALTER TABLE admin_whitelist ENABLE ROW LEVEL SECURITY;

-- Only authenticated users whose email is in the whitelist can read
CREATE POLICY "admin_whitelist_select"
  ON admin_whitelist FOR SELECT
  TO authenticated
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) IN (
      SELECT email FROM admin_whitelist
    )
  );

-- Seed the admin email
INSERT INTO admin_whitelist (email)
VALUES ('vikash07052008@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- 2. login_logs — tracks every admin login event
CREATE TABLE IF NOT EXISTS login_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  login_time timestamptz DEFAULT now(),
  device_type text,
  browser text,
  os text,
  ip_address text,
  session_id text,
  logout_time timestamptz
);

ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;

-- Only whitelisted admins can read login logs
CREATE POLICY "login_logs_select"
  ON login_logs FOR SELECT
  TO authenticated
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) IN (
      SELECT email FROM admin_whitelist
    )
  );

-- Only whitelisted admins can insert login logs
CREATE POLICY "login_logs_insert"
  ON login_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT email FROM auth.users WHERE id = auth.uid()) IN (
      SELECT email FROM admin_whitelist
    )
  );

-- 3. Helper function: check if the current user is a whitelisted admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_whitelist
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );
$$;

-- Compatibility RPC used by frontend auth checks
CREATE OR REPLACE FUNCTION is_admin_whitelisted(check_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_whitelist
    WHERE email = lower(check_email)
  );
$$;

-- 4. Allow admins to update referrals (doctor_visited, follow_up_date, notes)
DROP POLICY IF EXISTS "referrals_update_admin" ON referrals;
CREATE POLICY "referrals_update_admin"
  ON referrals FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
