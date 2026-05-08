import React from 'react';
import PageWrapper from '@/components/shared/PageWrapper';
import { useSession } from '@/contexts/SessionContext';

export default function MyReportPage() {
  const { lang } = useSession();
  return (
    <PageWrapper
      title={lang === 'ta' ? '📊 எனது அறிக்கை' : '📊 My Report'}
      subtitle={lang === 'ta' ? 'KG – Grade 2' : 'KG – Grade 2'}
      owlState="idle"
      owlSpeech={lang === 'ta' ? 'உங்கள் முன்னேற்றத்தை பாருங்கள்!' : 'Check your progress!'}
    >
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-black text-white mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {lang === 'ta' ? 'உங்கள் சோதனை முடிவுகள்' : 'Your Test Results'}
        </h2>
        <p className="text-white/80">
          {lang === 'ta'
            ? 'நீங்கள் முடித்த சோதனைகளின் விவரங்கள் இங்கே தோன்றும்.'
            : 'Details of your completed tests will appear here.'}
        </p>
      </div>
    </PageWrapper>
  );
}
