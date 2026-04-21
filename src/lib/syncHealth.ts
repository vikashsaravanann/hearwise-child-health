const SYNC_HEALTH_HISTORY_KEY = 'hearwise_sync_health_history';
const MAX_SYNC_HEALTH_RUNS = 120;

export type SyncSource = 'app_load' | 'online_event' | 'interval' | 'manual';

export interface SyncRunSnapshot {
  at: number;
  source: SyncSource;
  queueDepth: number;
  eligibleCount: number;
  syncedCount: number;
  failedCount: number;
  durationMs: number;
}

export interface SyncHealthSummary {
  runCount: number;
  totalSynced: number;
  totalFailed: number;
  averageSuccessRate: number;
  averageDurationMs: number;
  consecutiveFailureRuns: number;
  lastRunAt?: number;
  lastSource?: SyncSource;
  lastQueueDepth: number;
  status: 'healthy' | 'warning' | 'critical';
}

function getStoredRuns(): SyncRunSnapshot[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(SYNC_HEALTH_HISTORY_KEY) || '[]') as SyncRunSnapshot[];
    return parsed.filter((run) => typeof run?.at === 'number');
  } catch {
    return [];
  }
}

function setStoredRuns(runs: SyncRunSnapshot[]) {
  localStorage.setItem(SYNC_HEALTH_HISTORY_KEY, JSON.stringify(runs.slice(-MAX_SYNC_HEALTH_RUNS)));
}

export function getSyncHealthRuns(sampleSize = MAX_SYNC_HEALTH_RUNS): SyncRunSnapshot[] {
  return getStoredRuns().slice(-sampleSize);
}

export function recordSyncRun(snapshot: SyncRunSnapshot) {
  const existing = getStoredRuns();
  existing.push(snapshot);
  setStoredRuns(existing);
}

export function getSyncHealthSummary(sampleSize = 40): SyncHealthSummary {
  const runs = getStoredRuns().slice(-sampleSize);
  if (runs.length === 0) {
    return {
      runCount: 0,
      totalSynced: 0,
      totalFailed: 0,
      averageSuccessRate: 1,
      averageDurationMs: 0,
      consecutiveFailureRuns: 0,
      lastQueueDepth: 0,
      status: 'healthy',
    };
  }

  const totalSynced = runs.reduce((sum, run) => sum + run.syncedCount, 0);
  const totalFailed = runs.reduce((sum, run) => sum + run.failedCount, 0);
  const totalEligible = runs.reduce((sum, run) => sum + run.eligibleCount, 0);
  const averageDurationMs = Math.round(runs.reduce((sum, run) => sum + run.durationMs, 0) / runs.length);
  const averageSuccessRate = totalEligible > 0 ? totalSynced / totalEligible : 1;

  let consecutiveFailureRuns = 0;
  for (let i = runs.length - 1; i >= 0; i -= 1) {
    if (runs[i].failedCount > 0) consecutiveFailureRuns += 1;
    else break;
  }

  const last = runs[runs.length - 1];
  const failureRate = totalEligible > 0 ? totalFailed / totalEligible : 0;
  const status: SyncHealthSummary['status'] =
    consecutiveFailureRuns >= 3 || failureRate >= 0.25
      ? 'critical'
      : consecutiveFailureRuns >= 1 || failureRate >= 0.1
        ? 'warning'
        : 'healthy';

  return {
    runCount: runs.length,
    totalSynced,
    totalFailed,
    averageSuccessRate,
    averageDurationMs,
    consecutiveFailureRuns,
    lastRunAt: last.at,
    lastSource: last.source,
    lastQueueDepth: last.queueDepth,
    status,
  };
}
