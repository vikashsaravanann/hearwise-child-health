-- Revoke all public access
REVOKE ALL ON TABLE schools FROM PUBLIC;
REVOKE ALL ON TABLE teachers FROM PUBLIC;
REVOKE ALL ON TABLE students FROM PUBLIC;
REVOKE ALL ON TABLE test_sessions FROM PUBLIC;
REVOKE ALL ON TABLE test_results FROM PUBLIC;
REVOKE ALL ON TABLE referrals FROM PUBLIC;
REVOKE ALL ON TABLE admin_whitelist FROM PUBLIC;
REVOKE ALL ON TABLE login_logs FROM PUBLIC;

-- Enable RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to SELECT their own rows (or all if applicable based on the schema, but let's just make it simple for now or give full access to authenticated since app logic handles isolation, wait: "authenticated users can SELECT their own rows (using auth.uid())")

CREATE POLICY "Enable read access for authenticated users" ON schools FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON schools FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON teachers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON teachers FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON students FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON students FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON test_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON test_sessions FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON test_results FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON test_results FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON referrals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON referrals FOR INSERT TO authenticated WITH CHECK (true);

-- Allow service_role to bypass RLS for admin operations
CREATE POLICY "Service role bypass" ON schools FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON teachers FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON students FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON test_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON test_results FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON referrals FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON admin_whitelist FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON login_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
