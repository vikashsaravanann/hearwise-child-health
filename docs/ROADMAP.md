# HearWise Roadmap (Execution Checklist)

This roadmap breaks Phase 3 and Phase 4 into implementation-ready tasks.

## Phase 3: Referral and follow-up workflow

## Product goals

- Ensure every child with concern is tracked to closure.
- Give teachers and coordinators a simple follow-up workflow.
- Keep parent communication clear in Tamil and English.

## Sprint-ready tasks

- [ ] Define referral lifecycle states:
  - `new`
  - `contacted`
  - `appointment_scheduled`
  - `visited`
  - `closed`
- [ ] Define role permissions:
  - teacher
  - coordinator
  - district admin
- [ ] Add referral severity tags (`mild`, `refer`, `urgent`).
- [ ] Add outcome codes (`resolved`, `no_show`, `pending_review`).

## Database and migration tasks

- [ ] Create migration: `supabase/migrations/<timestamp>_phase3_referral_workflow.sql`
- [ ] Add to `referrals`:
  - `status text not null default 'new'`
  - `severity text`
  - `assigned_to uuid null`
  - `next_action_date date null`
  - `closed_reason text null`
- [ ] Create `referral_events` table for immutable status audit history.
- [ ] Add indexes:
  - `referrals(status)`
  - `referrals(next_action_date)`
  - `referrals(assigned_to)`

## API / edge function tasks

- [ ] Implement `create_referral_from_result` function.
- [ ] Implement `update_referral_status` function.
- [ ] Implement `list_referrals` query endpoint with filters.
- [ ] Validate status transitions server-side (prevent invalid jumps).

## UI tasks

- [ ] Build `ReferralInboxPage` with status and date filters.
- [ ] Build `ReferralDetailPage` with timeline from `referral_events`.
- [ ] Add bilingual parent communication templates.
- [ ] Add quick actions: mark contacted / schedule visit / close referral.

## QA checklist

- [ ] Functional:
  - Referral auto-created for `mild`/`refer` result.
  - Status transitions save correctly.
  - Timeline shows all events in order.
- [ ] Edge:
  - Invalid transition is blocked.
  - Duplicate referral creation is prevented.
  - Missing student linkage throws validation error.
- [ ] Offline:
  - Referral updates queue when offline and sync later.
  - Conflict handling on reconnect is deterministic.

## Security and RLS tasks

- [ ] Restrict referral read/write by role and district scope.
- [ ] Prevent teachers from cross-school access.
- [ ] Add policy tests for `select/insert/update` coverage.
- [ ] Mask sensitive notes in aggregate views.

## Rollout checklist

- [ ] Pilot with 1 district and defined escalation protocol.
- [ ] Train teachers and coordinators using one-page SOP.
- [ ] Track SLA metrics:
  - `% contacted in 7 days`
  - `% visited in 30 days`
- [ ] Review failure cases weekly during pilot.

---

## Phase 4: District/state analytics and reporting

## Product goals

- Deliver program-level visibility for district and state teams.
- Make decisions easy with clean trend and funnel metrics.
- Enable policy-ready exports with consistent definitions.

## Sprint-ready tasks

- [ ] Define canonical KPI dictionary:
  - total screened
  - referral rate
  - follow-up completion rate
  - district coverage %
- [ ] Freeze metric definitions in docs before dashboard release.
- [ ] Set role-based access matrix for school/district/state visibility.

## Database and analytics tasks

- [ ] Create migration: `supabase/migrations/<timestamp>_phase4_analytics.sql`
- [ ] Add materialized views:
  - `analytics_daily_screening`
  - `analytics_referral_funnel`
- [ ] Add scheduled refresh strategy (cron/edge function).
- [ ] Add supporting indexes for range queries by district/date.

## API / edge function tasks

- [ ] Implement `get_coverage_metrics`.
- [ ] Implement `get_referral_funnel`.
- [ ] Implement `export_government_report_csv`.
- [ ] Implement `export_government_report_pdf` (optional in first release).

## UI tasks

- [ ] Build district analytics dashboard page.
- [ ] Build state summary page with drill-down.
- [ ] Add filters:
  - date range
  - district
  - school type
  - grade
- [ ] Add export panel with predefined report templates.

## QA checklist

- [ ] Functional:
  - KPI values match raw SQL checks.
  - Filters update all widgets consistently.
  - Export data matches on-screen filtered scope.
- [ ] Edge:
  - Empty district returns zero-state UI.
  - Large date ranges stay performant.
  - Partial data periods are clearly labeled.
- [ ] Offline:
  - Last-known cached analytics state shown when offline.
  - Exports disabled gracefully while offline.

## Security and RLS tasks

- [ ] Enforce aggregate-only access at district/state roles.
- [ ] Block child-level PII in state-level views.
- [ ] Log report export events for audit traceability.
- [ ] Add policy verification checklist before go-live.

## Rollout checklist

- [ ] UAT with district officials and health partners.
- [ ] Validate report formats required by government stakeholders.
- [ ] Publish monthly program review cadence.
- [ ] Set alerting thresholds for low coverage and follow-up backlog.
