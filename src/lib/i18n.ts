export type Language = 'en' | 'ta';

const translations: Record<string, Record<Language, string>> = {
  tagline: { en: 'Smart Hearing Care for Every Child', ta: 'ஒவ்வொரு குழந்தைக்கும் புத்திசாலி காது பரிசோதனை' },
  startAsTeacher: { en: 'Start as Teacher', ta: 'ஆசிரியராக தொடங்கு' },
  viewDashboard: { en: 'View Dashboard', ta: 'டாஷ்போர்டு பார்' },
  schoolName: { en: 'School Name', ta: 'பள்ளி பெயர்' },
  teacherName: { en: 'Teacher Name', ta: 'ஆசிரியர் பெயர்' },
  classGrade: { en: 'Class / Grade', ta: 'வகுப்பு' },
  district: { en: 'District', ta: 'மாவட்டம்' },
  startSession: { en: 'Start Session', ta: 'அமர்வை தொடங்கு' },
  studentName: { en: 'Student Name', ta: 'மாணவர் பெயர்' },
  age: { en: 'Age', ta: 'வயது' },
  gender: { en: 'Gender', ta: 'பாலினம்' },
  male: { en: 'Male', ta: 'ஆண்' },
  female: { en: 'Female', ta: 'பெண்' },
  other: { en: 'Other', ta: 'மற்றவை' },
  rollNumber: { en: 'Roll Number (Optional)', ta: 'வரிசை எண் (விரும்பினால்)' },
  beginTest: { en: 'Begin Hearing Test', ta: 'காது பரிசோதனை தொடங்கு' },
  headphoneCheck: { en: 'Headphone Check', ta: 'ஹெட்ஃபோன் சரிபார்ப்பு' },
  volumeMax: { en: 'Device volume is at maximum', ta: 'சாதன ஒலி அதிகபட்சத்தில் உள்ளது' },
  headphonesOn: { en: 'Headphones are properly on both ears', ta: 'ஹெட்ஃபோன் இரு காதிலும் சரியாக உள்ளது' },
  childSeated: { en: 'Child is seated quietly', ta: 'குழந்தை அமைதியாக அமர்ந்துள்ளது' },
  confirmContinue: { en: 'Confirm and Continue', ta: 'உறுதிசெய் & தொடர்' },
  playSampleTone: { en: 'Play a Sample Tone', ta: 'சோதனை ஒலி இயக்கு' },
  practiceRound: { en: 'Practice Round', ta: 'பயிற்சி சுற்று' },
  tapWhenHear: { en: 'Tap when you hear the sound!', ta: 'ஒலி கேட்டால் திரையை தொடுங்கள்!' },
  imReady: { en: "I'm Ready!", ta: 'நான் தயார்!' },
  leftEar: { en: 'Left Ear', ta: 'இடது காது' },
  rightEar: { en: 'Right Ear', ta: 'வலது காது' },
  normal: { en: 'Normal', ta: 'சாதாரணம்' },
  startTest: { en: 'Start Test', ta: 'சோதனை தொடங்கு' },
  saveResult: { en: 'Save Result', ta: 'முடிவை சேமி' },
  excellent: { en: 'Excellent! Hearing is normal.', ta: 'அருமை! கேட்கும் திறன் சாதாரணம்.' },
  mildConcern: { en: 'Mild concern detected. Re-test recommended in 3 months.', ta: 'லேசான கவலை கண்டறியப்பட்டது. 3 மாதங்களில் மறு பரிசோதனை பரிந்துரைக்கப்படுகிறது.' },
  hearingIssue: { en: 'Hearing issue detected. Please consult a doctor.', ta: 'கேட்கும் திறன் பிரச்சனை கண்டறியப்பட்டது. மருத்துவரை அணுகவும்.' },
  saveTestNext: { en: 'Save & Test Next Student', ta: 'சேமி & அடுத்த மாணவர்' },
  shareWhatsApp: { en: 'Share Report via WhatsApp', ta: 'வாட்ஸ்அப் வழியாக பகிர்' },
  sessionSummary: { en: 'Session Summary', ta: 'அமர்வு சுருக்கம்' },
  totalTested: { en: 'Total Students Tested', ta: 'மொத்த பரிசோதிக்கப்பட்ட மாணவர்கள்' },
  normalResults: { en: 'Normal Results', ta: 'சாதாரண முடிவுகள்' },
  mildConcerns: { en: 'Mild Concerns', ta: 'லேசான கவலைகள்' },
  needsReferral: { en: 'Needs Referral', ta: 'பரிந்துரை தேவை' },
  exportPDF: { en: 'Export as PDF', ta: 'PDF ஆக ஏற்றுமதி' },
  endSession: { en: 'End Session', ta: 'அமர்வை முடி' },
  playPracticeTone: { en: 'Play Practice Tone', ta: 'பயிற்சி ஒலி இயக்கு' },
  testing: { en: 'Testing', ta: 'பரிசோதனை' },
  select: { en: 'Select', ta: 'தேர்வு செய்' },
};

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] ?? key;
}

export function getLanguage(): Language {
  return (localStorage.getItem('hearwise-lang') as Language) || 'en';
}

export function setLanguage(lang: Language) {
  localStorage.setItem('hearwise-lang', lang);
}
