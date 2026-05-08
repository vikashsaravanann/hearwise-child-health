import React from 'react';
import PageWrapper from '@/components/shared/PageWrapper';
import { useSession } from '@/contexts/SessionContext';

export default function HeadphoneSafetyPage() {
  const { lang } = useSession();
  return (
    <PageWrapper
      title={lang === 'ta' ? '🎧 ஹெட்ஃபோன் பாதுகாப்பு' : '🎧 Headphone Safety'}
      subtitle={lang === 'ta' ? 'KG – Grade 2' : 'KG – Grade 2'}
      owlState="idle"
      owlSpeech={lang === 'ta' ? 'பாதுகாப்பாக கேட்போம்!' : 'Let’s listen safely!'}
    >
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-black text-white mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {lang === 'ta' ? '60/60 விதி' : 'The 60/60 Rule'}
        </h2>
        <p className="text-white/80">
          {lang === 'ta'
            ? '60% சத்தத்தில் ஒரு நாளைக்கு 60 நிமிடங்கள் மட்டுமே ஹெட்ஃபோன் பயன்படுத்தவும்.'
            : 'Use headphones for only 60 minutes a day at 60% volume.'}
        </p>
      </div>
    </PageWrapper>
  );
}
