import type { Language } from './i18n';
import type { ScreeningReadiness } from '@/contexts/SessionContext';
import type { TestResult } from './testEngine';

export interface StudentInputErrors {
  name?: string;
  age?: string;
  gender?: string;
}

export function validateStudentInput(name: string, age: string, gender: string): StudentInputErrors {
  const errors: StudentInputErrors = {};
  if (name.trim().length < 2) {
    errors.name = 'Enter at least 2 letters';
  }

  const ageNumber = Number(age);
  if (!age || Number.isNaN(ageNumber) || ageNumber < 4 || ageNumber > 16) {
    errors.age = 'Age must be between 4 and 16';
  }

  if (!gender) {
    errors.gender = 'Select gender';
  }

  return errors;
}

export function isReadinessComplete(readiness: ScreeningReadiness): boolean {
  return readiness.headphoneChecklistComplete && readiness.sampleTonePlayed && readiness.practicePassed;
}

export function getParentSummary(result: TestResult, lang: Language): string {
  if (result.overall === 'normal') {
    return lang === 'ta'
      ? 'இன்று பரிசோதனையில் குழந்தையின் கேள்வித்திறன் சாதாரணமாக உள்ளது. ஆண்டுதோறும் ஒரு முறை மீண்டும் சோதிக்கவும்.'
      : 'Today screening shows normal hearing. Please repeat this screening once every year.';
  }

  if (result.overall === 'mild') {
    return lang === 'ta'
      ? 'சில ஒலிகளில் பதில் தெளிவாக இல்லை. 2-4 வாரங்களில் மீண்டும் பரிசோதனை செய்யவும்.'
      : 'Some tones were not clearly heard. Please repeat screening in 2-4 weeks.';
  }

  return lang === 'ta'
    ? 'குழந்தைக்கு விரைவில் ENT அல்லது ஆடியாலஜிஸ்ட் ஆலோசனை அவசியம். மருத்துவர் பரிசோதனைக்கு பரிந்துரைக்கப்படுகிறது.'
    : 'Early medical follow-up is recommended. Please consult an ENT or audiologist soon.';
}
