import React from 'react';
import PageWrapper from '@/components/shared/PageWrapper';
import { useSession } from '@/contexts/SessionContext';

export default function BookAppointmentPage() {
  const { lang } = useSession();
  return (
    <PageWrapper
      title={lang === 'ta' ? '📅 சந்திப்பு பதிவு' : '📅 Book Appointment'}
      subtitle={lang === 'ta' ? 'Grade 9 – 12' : 'Grade 9 – 12'}
      owlState="idle"
      owlSpeech={lang === 'ta' ? 'நிபுணரை சந்திக்கவும்!' : 'Consult a specialist!'}
    >
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-black text-white mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {lang === 'ta' ? 'மருத்துவ ஆலோசனை' : 'Clinical Consultation'}
        </h2>
        <p className="text-white/80">
          {lang === 'ta'
            ? 'அருகிலுள்ள காது மருத்துவரை சந்திக்க இங்கே பதிவு செய்யவும்.'
            : 'Register here to meet an ENT specialist near you.'}
        </p>
      </div>
    </PageWrapper>
  );
}
