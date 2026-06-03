CREATE TABLE IF NOT EXISTS school_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_name TEXT NOT NULL,
  school_type TEXT,
  address TEXT,
  district TEXT,
  state TEXT DEFAULT 'Tamil Nadu',
  pincode TEXT,
  udise_code TEXT,
  student_count INTEGER,
  contact_name TEXT,
  designation TEXT,
  email TEXT,
  mobile TEXT,
  preferred_language TEXT,
  android_available BOOLEAN,
  phone_count INTEGER,
  headphones_available TEXT,
  connectivity TEXT,
  referral_source TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE school_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON school_registrations FOR INSERT TO public WITH CHECK (true);
