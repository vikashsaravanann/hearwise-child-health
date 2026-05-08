import { describe, expect, it } from 'vitest';
import { getParentSummary, isReadinessComplete, validateStudentInput } from '@/lib/clinicalSafety';

describe('clinicalSafety', () => {
  it('validates student input rules', () => {
    expect(validateStudentInput('', '2', '')).toMatchObject({
      name: 'Enter at least 2 letters',
      age: 'Age must be between 4 and 16',
      gender: 'Select gender',
    });

    expect(validateStudentInput('Aarav', '8', 'male')).toEqual({});
  });

  it('checks readiness completion', () => {
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

  it('returns parent summary in selected language', () => {
    const mildResult = {
      overall: 'mild',
      left: { '500': true, '1000': true, '2000': false, '4000': true, falsePositives: 0 },
      right: { '500': true, '1000': true, '2000': true, '4000': true, falsePositives: 0 },
    } as const;

    expect(getParentSummary(mildResult, 'en')).toContain('repeat screening');
    expect(getParentSummary(mildResult, 'ta')).toContain('மீண்டும்');
  });
});
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
