import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

type ResultPayload = {
  left_ear_500hz: boolean;
  left_ear_1000hz: boolean;
  left_ear_2000hz: boolean;
  left_ear_4000hz: boolean;
  right_ear_500hz: boolean;
  right_ear_1000hz: boolean;
  right_ear_2000hz: boolean;
  right_ear_4000hz: boolean;
  false_positive_count: number;
  overall_result: 'normal' | 'mild' | 'refer';
  left_false_positive_count?: number;
  right_false_positive_count?: number;
  screening_version?: string;
  readiness_checklist?: unknown;
  practice_passed?: boolean;
  parent_summary_en?: string | null;
  parent_summary_ta?: string | null;
};

type IngestBody = {
  client_result_id: string;
  session_id: string;
  student_id: string;
  payload: ResultPayload;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function isValidBody(input: unknown): input is IngestBody {
  if (!input || typeof input !== 'object') return false;
  const obj = input as Record<string, unknown>;
  return (
    typeof obj.client_result_id === 'string' &&
    typeof obj.session_id === 'string' &&
    typeof obj.student_id === 'string' &&
    !!obj.payload &&
    typeof obj.payload === 'object'
  );
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: 'Server not configured' }, 500);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  if (!isValidBody(body)) {
    return json({ error: 'Invalid request payload' }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { client_result_id, session_id, student_id, payload } = body;

  const row = {
    client_result_id,
    session_id,
    student_id,
    left_ear_500hz: payload.left_ear_500hz,
    left_ear_1000hz: payload.left_ear_1000hz,
    left_ear_2000hz: payload.left_ear_2000hz,
    left_ear_4000hz: payload.left_ear_4000hz,
    right_ear_500hz: payload.right_ear_500hz,
    right_ear_1000hz: payload.right_ear_1000hz,
    right_ear_2000hz: payload.right_ear_2000hz,
    right_ear_4000hz: payload.right_ear_4000hz,
    false_positive_count: payload.false_positive_count,
    overall_result: payload.overall_result,
    left_false_positive_count: payload.left_false_positive_count ?? 0,
    right_false_positive_count: payload.right_false_positive_count ?? 0,
    screening_version: payload.screening_version ?? 'phase1_clinical_safe',
    readiness_checklist: payload.readiness_checklist ?? null,
    practice_passed: payload.practice_passed ?? false,
    parent_summary_en: payload.parent_summary_en ?? null,
    parent_summary_ta: payload.parent_summary_ta ?? null,
  };

  const { data, error } = await supabase
    .from('test_results')
    .upsert(row, { onConflict: 'client_result_id' })
    .select('id')
    .single();

  if (error || !data?.id) {
    return json({ error: error?.message ?? 'Unable to ingest result' }, 500);
  }

  return json({ ok: true, result_id: data.id });
});
