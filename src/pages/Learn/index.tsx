import React from 'react';
import PageWrapper from '@/components/shared/PageWrapper';
import { useSession } from '@/contexts/SessionContext';

export default function LearnPage() {
  const { lang } = useSession();
  return (
    <PageWrapper
      title={lang === 'ta' ? '📚 கற்றல்' : '📚 Learn'}
      subtitle={lang === 'ta' ? 'KG – Grade 12' : 'KG – Grade 12'}
      owlState="idle"
      owlSpeech={lang === 'ta' ? 'அறிவை கண்டறிவோம்!' : 'Let’s explore knowledge!'}
    >
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-black text-white mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {lang === 'ta' ? 'கற்றல் வளங்கள்' : 'Learning Resources'}
        </h2>
        <p className="text-white/80">
          {lang === 'ta'
            ? 'காதை தொடர்பான கற்றல், ஒலி விஞ்ஞானம் மற்றும் கடல் உலகின் சுவாரஸ்யமான தகவல்களை இங்கே கண்டுபிடிக்கலாம்.'
            : 'Discover educational content about hearing, sound science, and the ocean world.'}
        </p>
      </div>
    </PageWrapper>
  );
}
