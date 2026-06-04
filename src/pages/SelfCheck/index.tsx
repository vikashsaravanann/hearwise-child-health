import React from 'react';
import PageWrapper from '@/components/shared/PageWrapper';
import { useSession } from '@/contexts/SessionContext';

export default function SelfCheckPage() {
  const { lang } = useSession();
  return (
    <PageWrapper
      title={lang === 'ta' ? '✅ சுய பரிசோதனை' : '✅ Self-Check'}
      subtitle={lang === 'ta' ? 'Grade 6 – 8' : 'Grade 6 – 8'}
      owlState="idle"
      owlSpeech={lang === 'ta' ? 'உங்கள் காதுகளை சரிபார்க்கவும்!' : 'Check your ears!'}
    >
      <div className="max-w-2xl mx-auto p-5 sm:p-6 text-center">
        <h2 className="text-2xl font-black text-white mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {lang === 'ta' ? 'கேள்வி பதில்' : 'Quick Questionnaire'}
        </h2>
        <p className="text-white/80">
          {lang === 'ta'
            ? 'உங்கள் கேட்கும் திறனை பற்றி நீங்களே அறிந்து கொள்ளுங்கள்.'
            : 'Answer a few questions to understand your hearing health.'}
        </p>
      </div>
    </PageWrapper>
  );
}
