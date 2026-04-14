
-- Schools table
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Tamil Nadu',
  type TEXT DEFAULT 'government',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on schools" ON public.schools FOR SELECT USING (true);
CREATE POLICY "Allow public insert on schools" ON public.schools FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on schools" ON public.schools FOR UPDATE USING (true);

-- Teachers table
CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on teachers" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Allow public insert on teachers" ON public.teachers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on teachers" ON public.teachers FOR UPDATE USING (true);

-- Students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  roll_number TEXT,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert on students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on students" ON public.students FOR UPDATE USING (true);

-- Test sessions table
CREATE TABLE public.test_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  device_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.test_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on test_sessions" ON public.test_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on test_sessions" ON public.test_sessions FOR INSERT WITH CHECK (true);

-- Test results table
CREATE TABLE public.test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.test_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  left_ear_500hz BOOLEAN NOT NULL DEFAULT false,
  left_ear_1000hz BOOLEAN NOT NULL DEFAULT false,
  left_ear_2000hz BOOLEAN NOT NULL DEFAULT false,
  left_ear_4000hz BOOLEAN NOT NULL DEFAULT false,
  right_ear_500hz BOOLEAN NOT NULL DEFAULT false,
  right_ear_1000hz BOOLEAN NOT NULL DEFAULT false,
  right_ear_2000hz BOOLEAN NOT NULL DEFAULT false,
  right_ear_4000hz BOOLEAN NOT NULL DEFAULT false,
  false_positive_count INTEGER NOT NULL DEFAULT 0,
  overall_result TEXT NOT NULL DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on test_results" ON public.test_results FOR SELECT USING (true);
CREATE POLICY "Allow public insert on test_results" ON public.test_results FOR INSERT WITH CHECK (true);

-- Referrals table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  result_id UUID NOT NULL REFERENCES public.test_results(id) ON DELETE CASCADE,
  referred_on DATE NOT NULL DEFAULT CURRENT_DATE,
  doctor_visited BOOLEAN NOT NULL DEFAULT false,
  follow_up_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on referrals" ON public.referrals FOR SELECT USING (true);
CREATE POLICY "Allow public insert on referrals" ON public.referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on referrals" ON public.referrals FOR UPDATE USING (true);
