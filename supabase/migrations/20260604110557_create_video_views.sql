CREATE TABLE IF NOT EXISTS public.video_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT NOT NULL,
  video_title TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewer_email TEXT,
  watched_at TIMESTAMPTZ DEFAULT NOW(),
  duration_watched_seconds INTEGER DEFAULT 0
);

ALTER TABLE public.video_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read all views" ON public.video_views
  FOR SELECT USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));
CREATE POLICY "Anyone can insert view" ON public.video_views
  FOR INSERT WITH CHECK (true);
