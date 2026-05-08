import React from 'react';
import PageWrapper from '@/components/shared/PageWrapper';
import { useSession } from '@/contexts/SessionContext';

export default function HelpPage() {
  const { lang } = useSession();
  return (
    <PageWrapper
      title={lang === 'ta' ? '❓ உதவி' : '❓ Help'}
      subtitle={lang === 'ta' ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'FAQs'}
      owlState="idle"
      owlSpeech={lang === 'ta' ? 'உங்களுக்கு உதவி தேவையா?' : 'Do you need help?'}
    >
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-black text-white mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {lang === 'ta' ? 'உதவி மையம்' : 'Help Center'}
        </h2>
        <p className="text-white/80">
          {lang === 'ta'
            ? 'இந்த செயலியை பயன்படுத்துவது பற்றிய விளக்கங்கள் இங்கே உள்ளன.'
            : 'Find instructions on how to use this application here.'}
        </p>
      </div>
    </PageWrapper>
  );
}
