# HearWise Implementation Notes

## Product context

- Product: HearWise - School Hearing Screening Platform
- Company: HearWise Technologies Pvt. Ltd.
- Mission: Eliminate undetected childhood hearing loss in India.
- Vision: Every child in India screened before age 10.
- Priority users: Government schools, teachers, children, parents.
- Constraints: Mobile-first, low-connectivity rural environments, Tamil-first UX.

## Implemented phases

## Phase 1: Clinical-safe screening flow

### Product outcomes

- Child-friendly bilingual flow with readiness gating.
- Mandatory pre-test checks before active screening.
- Parent-facing result language in English and Tamil.
- Clinical auditability metadata attached to each test result.

### Implemented behavior

- Readiness gate requires:
  - headphone checklist complete
  - sample tone played
  - practice round completed
- Student validation hardens required fields and age bounds.
- Results include parent guidance text and safety context.

### Phase 1 migration

- `supabase/migrations/20260414170000_phase1_clinical_safety.sql`

Adds fields to `test_results` for:

- `left_false_positive_count`
- `right_false_positive_count`
- `screening_version`
- `readiness_checklist`
- `practice_passed`
- `parent_summary_en`
- `parent_summary_ta`

## Phase 2: Offline-first reliability baseline

### Product outcomes

- No silent data loss when network is unstable or offline.
- Reliable sync retry behavior when internet returns.
- Clear in-product visibility of pending/failed syncs.

### Implemented behavior

- Queue-first save path for all results.
- Idempotent sync via `client_result_id`.
- Retry with exponential backoff + jitter.
- Periodic sync heartbeat while online.
- Badge-level visibility for sync retry failures.

### Phase 2 migration

- `supabase/migrations/20260414183000_phase2_offline_idempotency.sql`

Adds and backfills:

- `test_results.client_result_id`
- Unique index on `client_result_id`

## Testing

- `src/test/clinicalSafety.test.ts`
- `src/test/offlineSync.test.ts`

Run:

- `npm run test`
- `npm run build`

## Open remediation and next steps

- Tighten Supabase RLS policies from public access to role-scoped access. ✅ Completed in Phase 3.
- Add server-side sync endpoint for payload validation and signed ingestion. ✅ Baseline implemented via Edge Function ingestion path.
- Implement Phase 3 referral and follow-up lifecycle.
- Implement Phase 4 district/state analytics and reporting.

## Phase 3: RLS hardening

### Product outcomes

- Anonymous screening clients can still create records required for classroom flow.
- Sensitive student, session, result, and referral reads are restricted to authenticated users.
- Referral updates are restricted to authenticated users.

### Phase 3 migration

- `supabase/migrations/20260414200000_phase3_rls_hardening.sql`

## Phase 4: Server-side ingestion baseline

### Product outcomes

- Client sync path now ingests screening results through a server-side endpoint.
- Ingestion validates payload shape and performs idempotent upsert with `client_result_id`.
- Client no longer writes result rows directly during sync retries.

### Implemented files

- `supabase/functions/ingest-screening-result/index.ts`
- `src/lib/database.ts` (sync path now calls edge function)
