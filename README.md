# HearWise Child Health

Mobile-first school hearing screening app for India, built by HearWise Technologies Pvt. Ltd.

## Product context

- Product: HearWise - School Hearing Screening Platform
- Mission: Eliminate undetected childhood hearing loss in India
- Vision: Every child in India screened before age 10
- Priority settings: Government schools, low-connectivity classrooms, Tamil-first UX

## Current implementation status

### Phase 1 complete: Clinical-safe screening flow

- Bilingual child-friendly flow with readiness gating.
- Mandatory pre-test checks:
  - headphone checklist complete
  - sample tone played
  - practice round completed
- Stricter student validation (age bounds, required fields).
- Parent-friendly result guidance in English and Tamil.
- Clinical audit metadata stored per test result:
  - screening version
  - readiness checklist
  - per-ear false positives
  - bilingual parent summary

### Phase 2 complete: Offline-first reliability baseline

- Queue-first result saving (no silent data loss).
- Idempotent sync key per result: `client_result_id`.
- Automatic retry with exponential backoff + jitter.
- Periodic heartbeat sync (every 15s when online).
- Failure visibility in UI badge (`sync retries`).

## Data model updates

- Migration: `supabase/migrations/20260414170000_phase1_clinical_safety.sql`
- Migration: `supabase/migrations/20260414183000_phase2_offline_idempotency.sql`

## Development

- `npm install`
- `npm run dev:8080`
- Open `http://localhost:8080`

## Quality gates

- `npm run lint`
- `npm run test`
- `npm run build`

## Deploy

### Option A: Vercel (recommended)

1. Ensure Vercel account and project access.
2. Run `npm run deploy:vercel`
3. Follow CLI prompts once (project/link).

### Option B: Netlify

1. Ensure Netlify account and site access.
2. Run `npm run deploy:netlify`
3. Follow CLI prompts once.

SPA routing configs:

- `vercel.json`
- `netlify.toml`

## Pre-release acceptance checklist

1. Switch language EN/TA in all teacher and test screens.
2. Complete setup -> student entry -> headphone check -> practice -> test.
3. Verify readiness guard blocks test when pre-checks are incomplete.
4. Verify results page shows parent guidance (EN/TA).
5. Run offline scenario:
   - disable internet
   - complete a full student test
   - confirm queued save message
   - re-enable internet
   - confirm auto-sync and badge update
6. Verify CSV export and dashboard load.

## Remediation log (updated)

- Fixed: risk of incomplete pre-test execution by adding hard readiness gates.
- Fixed: weak input validation for student demographics.
- Fixed: non-idempotent offline sync risk by introducing `client_result_id`.
- Fixed: invisible sync retry failures by surfacing retry state in badge.
- Open next remediation:
  - tighten Supabase RLS from public policies to role-scoped policies
  - add server-side sync endpoint for payload validation and signed ingestion
