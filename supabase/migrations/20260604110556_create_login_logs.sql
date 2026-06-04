CREATE TABLE IF NOT EXISTS public.login_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  login_method TEXT NOT NULL CHECK (login_method IN ('google', 'email_otp', 'phone_otp', 'email_password')),
  phone_number TEXT,
  ip_address TEXT,
  device_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin read all login logs" ON public.login_logs
  FOR SELECT USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

CREATE POLICY "Insert own login log" ON public.login_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
