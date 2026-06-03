CREATE TABLE IF NOT EXISTS audiologist_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  clinic TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  qualification TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audiologist_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON audiologist_applications FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public selects" ON audiologist_applications FOR SELECT TO public USING (true);
