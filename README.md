# HearWise Child Health

HearWise is a mobile-first school hearing screening app for India, built by HearWise Technologies Pvt. Ltd.

## Links

- Vercel production app: [https://hearwise-child-health.vercel.app](https://hearwise-child-health.vercel.app)
- GitHub repository: [https://github.com/vikashsaravanann/hearwise-child-health](https://github.com/vikashsaravanann/hearwise-child-health)

## Mission

- Eliminate undetected childhood hearing loss in India.
- Screen every child before age 10.
- Prioritize government schools, low-connectivity environments, and Tamil-first UX.

## Status

- Phase 1 complete: clinical-safe screening flow.
- Phase 2 complete: offline-first sync reliability baseline.
- Phase 3 complete: Supabase RLS hardening baseline.
- Phase 4 baseline complete: server-side result ingestion endpoint.
- See full details in `docs/IMPLEMENTATION.md`.
- See execution plan in `docs/ROADMAP.md`.
- See audit summary in `docs/PROJECT_AUDIT.md`.

## Stack

- React + TypeScript + Vite
- Tailwind + shadcn/ui
- Supabase (Postgres + RLS)
- Vercel (primary), Netlify (secondary)
- Vitest

## Development

- `npm install`
- `npm run dev:8080`
- Open `http://localhost:8080`

## Monitoring and analytics

Set these in `.env.local` and Vercel project environment variables:

- `VITE_SENTRY_DSN`
- `VITE_POSTHOG_KEY`
- `VITE_POSTHOG_HOST` (default `https://app.posthog.com`)

## Quality gates

- `npm run lint`
- `npm run test`
- `npm run build`

## Deploy (Vercel)

1. Ensure Vercel account and project access.
2. Run `npm run deploy:vercel`.
3. Verify production URL and deep-link routing.

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
- tighten Supabase RLS from public policies to role-scoped policies ✅
  - add server-side sync endpoint for payload validation and signed ingestion ✅ baseline
