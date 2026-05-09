import { beforeEach, describe, expect, it } from 'vitest';
import {
  enqueuePendingResult,
  getFailedPendingResultCount,
  getPendingResultCount,
  getPendingResults,
  setPendingResults,
} from '@/lib/offlineSync';

describe('offlineSync queue', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('enqueues unsynced items with retry metadata', () => {
    enqueuePendingResult({
      localId: 'local_result_1',
      clientResultId: 'local_result_1',
      sessionLocalId: 'local_session_1',
      studentLocalId: 'local_student_1',
      result: { overall_result: 'normal' },
      timestamp: Date.now(),
    });

    const queue = getPendingResults();
    expect(queue).toHaveLength(1);
    expect(queue[0].synced).toBe(false);
    expect(queue[0].status).toBe('queued');
    expect(queue[0].attempts).toBe(0);
    expect(getPendingResultCount()).toBe(1);
  });

  it('counts failed unsynced items', () => {
    setPendingResults([
      {
        localId: 'local_result_1',
        clientResultId: 'local_result_1',
        sessionLocalId: 'local_session_1',
        studentLocalId: 'local_student_1',
        result: { overall_result: 'refer' },
        timestamp: Date.now(),
        synced: false,
        status: 'failed',
        attempts: 3,
      },
    ]);

    expect(getFailedPendingResultCount()).toBe(1);
  });
});
