# HearWise Project Audit - Production Readiness

## Overview
This audit evaluates the current state of the HearWise School Hearing Screening platform against production standards for healthcare applications.

## Current Health Status
- **Security:** Fairly Strong (Infrastructure) / Incomplete (RLS enforcement).
- **TypeScript:** Good coverage, but needs refactoring of manual casts.
- **Tests:** Minimal. Core logic is covered, but E2E is missing.
- **Data Privacy:** Warning. PII stored in plain text locally; RLS allows too much internal visibility.
- **Reliability:** Advanced offline sync design, but brittle (LocalStorage reliance).

## Production Gaps (Critical)

### 1. Security & Data Privacy
- [ ] **RLS Lockdown:** Restrict `students`, `test_results`, and `referrals` to `admin_users` only.
- [ ] **PII Encryption:** Student names and age are currently stored in plain text in `localStorage`. These must be encrypted before local persistence.
- [ ] **Edge Function Integration:** The `ingest-screening-result` edge function is implemented but not used by the frontend sync path. Direct writes to `test_results` should be disabled.
- [ ] **Consent Management:** Missing explicit parent/guardian consent flow in the session setup.

### 2. Testing & Quality Assurance
- [ ] **E2E Coverage:** No automated tests for the full "Teacher to Result" flow.
- [ ] **Sync Stress Test:** No verification of sync behavior with 100+ queued results (LocalStorage limit risk).
- [ ] **Accessibility:** Screen reader and keyboard navigation audit for the screening flow.

### 3. Reliability & Observability
- [ ] **Storage Migration:** Move from `localStorage` to `IndexedDB` for unsynced results to prevent data loss on cache clear.
- [ ] **Error Telemetry:** Centralized logging for sync failures and clinical logic errors.

## Clean-up List
- Remove `src/test/example.test.ts`.
- Delete duplicate file `src/vite-env.d 2.ts`.
- Refactor `src/lib/database.ts` to reduce manual type casting and improve query modularity.
- Consolidate redundant RLS policies in migration history.

## Path Forward

### Phase 1: Security & Privacy (Immediate)
1. Apply strict Admin-only RLS policies.
2. Implement `localStorage` encryption for student data.
3. Add a mandatory Parent Consent checkbox in `SessionSetupPage`.

### Phase 2: Ingestion & Reliability
1. Transition frontend sync logic to use the `ingest-screening-result` Edge Function.
2. Refactor `offlineSync.ts` to use IndexedDB.

### Phase 3: Validation
1. Set up Playwright for critical path E2E testing.
2. Perform a production-mirror load and offline simulation test.
