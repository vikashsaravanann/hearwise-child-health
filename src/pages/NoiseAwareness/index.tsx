import React from 'react';
import PageWrapper from '@/components/shared/PageWrapper';
import { useSession } from '@/contexts/SessionContext';

export default function NoiseAwarenessPage() {
  const { lang } = useSession();
  return (
    <PageWrapper
      title={lang === 'ta' ? '🔊 சத்தம் விழிப்புணர்வு' : '🔊 Noise Awareness'}
      subtitle={lang === 'ta' ? 'Grade 3 – 5' : 'Grade 3 – 5'}
      owlState="idle"
      owlSpeech={lang === 'ta' ? 'சத்தமான இடங்களை தவிர்ப்போம்!' : 'Avoid loud places!'}
    >
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-black text-white mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {lang === 'ta' ? 'அதிக சத்தம் ஆபத்தானது' : 'Loud Noise is Dangerous'}
        </h2>
        <p className="text-white/80">
          {lang === 'ta'
            ? 'அதிகப்படியான சத்தம் உங்கள் காதுகளை நிரந்தரமாக பாதிக்கும்.'
            : 'Excessive noise can permanently damage your hearing.'}
        </p>
      </div>
    </PageWrapper>
  );
}
