import { describe, expect, it } from 'vitest';
import { buildTestSequence, computeResults, type TestStepResult } from '@/lib/testEngine';

describe('testEngine', () => {
  it('builds full sequence with expected length', () => {
    const sequence = buildTestSequence();
    // 2 ears * 4 frequencies * (3 tones + 1 silent trial)
    expect(sequence).toHaveLength(32);
  });

  it('classifies perfect responses as normal', () => {
    const sequence = buildTestSequence();
    const results: TestStepResult[] = sequence.map((step) => ({
      step,
      responded: step.frequency !== 0,
      responseTime: step.frequency !== 0 ? 500 : null,
    }));

    const computed = computeResults(results);
    expect(computed.overall).toBe('normal');
    expect(computed.left.falsePositives).toBe(0);
    expect(computed.right.falsePositives).toBe(0);
  });

  it('classifies multiple failed tones as refer', () => {
    const sequence = buildTestSequence();
    const results: TestStepResult[] = sequence.map((step) => {
      const isFailedLeft500 = step.ear === 'left' && step.frequency === 500;
      const isFailedRight1000 = step.ear === 'right' && step.frequency === 1000;
      const isFailedRight2000 = step.ear === 'right' && step.frequency === 2000;
      const missThisTone = isFailedLeft500 || isFailedRight1000 || isFailedRight2000;
      return {
        step,
        responded: step.frequency === 0 ? false : !missThisTone,
        responseTime: step.frequency === 0 || missThisTone ? null : 450,
      };
    });

    const computed = computeResults(results);
    expect(computed.overall).toBe('refer');
  });
});
