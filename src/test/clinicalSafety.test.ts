import { describe, expect, it } from 'vitest';
import { getParentSummary, isReadinessComplete, validateStudentInput } from '@/lib/clinicalSafety';

describe('clinicalSafety', () => {
  it('validates student entry bounds', () => {
    const errors = validateStudentInput('A', '2', '');
    expect(errors.name).toBeTruthy();
    expect(errors.age).toBeTruthy();
    expect(errors.gender).toBeTruthy();
  });

  it('marks readiness complete only when all checks pass', () => {
    expect(
      isReadinessComplete({
        headphoneChecklistComplete: true,
        sampleTonePlayed: true,
        practicePassed: true,
      })
    ).toBe(true);

    expect(
      isReadinessComplete({
        headphoneChecklistComplete: true,
        sampleTonePlayed: false,
        practicePassed: true,
      })
    ).toBe(false);
  });

  it('returns parent-facing summary in both languages', () => {
    const baseResult = {
      left: { '500': true, '1000': true, '2000': true, '4000': true, falsePositives: 0 },
      right: { '500': true, '1000': true, '2000': true, '4000': true, falsePositives: 0 },
      overall: 'normal' as const,
    };

    expect(getParentSummary(baseResult, 'en')).toContain('normal hearing');
    expect(getParentSummary(baseResult, 'ta')).toContain('கேள்வித்திறன்');
  });
});
