import { playTone, TEST_FREQUENCIES, type TestFrequency } from './audio';

export interface TestStep {
  frequency: TestFrequency | 0; // 0 = silent trial
  ear: 'left' | 'right';
  presentation: number; // 1, 2, or 3
}

export interface TestStepResult {
  step: TestStep;
  responded: boolean;
  responseTime: number | null;
}

export interface EarResult {
  '500': boolean;
  '1000': boolean;
  '2000': boolean;
  '4000': boolean;
  falsePositives: number;
}

export interface TestResult {
  left: EarResult;
  right: EarResult;
  overall: 'normal' | 'mild' | 'refer';
}

// Build the full test sequence
export function buildTestSequence(): TestStep[] {
  const steps: TestStep[] = [];
  const ears: ('left' | 'right')[] = ['right', 'left'];

  for (const ear of ears) {
    for (const freq of TEST_FREQUENCIES) {
      // 3 presentations per frequency
      for (let p = 1; p <= 3; p++) {
        steps.push({ frequency: freq, ear, presentation: p });
      }
      // 1 silent trial per frequency
      steps.push({ frequency: 0, ear, presentation: 1 });
    }
  }
  return steps;
}

export function getRandomDelay(): number {
  return 1000 + Math.random() * 3000; // 1-4 seconds
}

export async function playTestTone(step: TestStep): Promise<void> {
  if (step.frequency === 0) {
    // Silent trial - wait the same duration
    await new Promise(r => setTimeout(r, 1500));
    return;
  }
  await playTone(step.frequency, step.ear);
}

export function computeResults(stepResults: TestStepResult[]): TestResult {
  const calc = (ear: 'left' | 'right'): EarResult => {
    const earResults = stepResults.filter(r => r.step.ear === ear);
    const result: EarResult = {
      '500': false,
      '1000': false,
      '2000': false,
      '4000': false,
      falsePositives: 0,
    };

    for (const freq of TEST_FREQUENCIES) {
      const freqResults = earResults.filter(r => r.step.frequency === freq);
      const correct = freqResults.filter(r => r.responded).length;
      result[String(freq) as keyof Omit<EarResult, 'falsePositives'>] = correct >= 2; // 2 out of 3 rule
    }

    // Count false positives (responded to silent trials)
    result.falsePositives = earResults.filter(r => r.step.frequency === 0 && r.responded).length;

    return result;
  };

  const left = calc('left');
  const right = calc('right');

  const leftFailed = [left['500'], left['1000'], left['2000'], left['4000']].filter(v => !v).length;
  const rightFailed = [right['500'], right['1000'], right['2000'], right['4000']].filter(v => !v).length;
  const totalFailed = leftFailed + rightFailed;
  const totalFP = left.falsePositives + right.falsePositives;

  let overall: 'normal' | 'mild' | 'refer' = 'normal';
  if (totalFailed >= 3 || totalFP >= 3) overall = 'refer';
  else if (totalFailed >= 1) overall = 'mild';

  return { left, right, overall };
}

export function getTotalSteps(): number {
  return buildTestSequence().length;
}
