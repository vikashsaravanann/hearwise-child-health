CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT,
  role TEXT,
  school_name TEXT,
  city TEXT,
  state TEXT,
  mobile TEXT,
  email TEXT,
  urgency TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON waitlist FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public selects" ON waitlist FOR SELECT TO public USING (true);
