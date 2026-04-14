ALTER TABLE public.test_results
ADD COLUMN IF NOT EXISTS client_result_id TEXT;

UPDATE public.test_results
SET client_result_id = id::text
WHERE client_result_id IS NULL;

ALTER TABLE public.test_results
ALTER COLUMN client_result_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'test_results_client_result_id_key'
  ) THEN
    CREATE UNIQUE INDEX test_results_client_result_id_key
    ON public.test_results (client_result_id);
  END IF;
END $$;
