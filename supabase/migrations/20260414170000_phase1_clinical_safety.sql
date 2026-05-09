ALTER TABLE public.test_results
ADD COLUMN IF NOT EXISTS left_false_positive_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS right_false_positive_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS screening_version TEXT NOT NULL DEFAULT 'phase1_clinical_safe',
ADD COLUMN IF NOT EXISTS readiness_checklist JSONB,
ADD COLUMN IF NOT EXISTS practice_passed BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS parent_summary_en TEXT,
ADD COLUMN IF NOT EXISTS parent_summary_ta TEXT;
