import React from 'react';
import PageWrapper from '@/components/shared/PageWrapper';
import { useSession } from '@/contexts/SessionContext';

export default function SoundExplorerPage() {
  const { lang } = useSession();
  return (
    <PageWrapper
      title={lang === 'ta' ? '🔊 ஒலி ஆராய்ச்சி' : '🔊 Sound Explorer'}
      subtitle={lang === 'ta' ? 'KG – Grade 6' : 'KG – Grade 6'}
      owlState="excited"
      owlSpeech={lang === 'ta' ? 'ஒலிகளை கண்டறிவோம்!' : 'Explore sounds!'}
    >
      <div className="max-w-2xl mx-auto p-5 sm:p-6 text-center">
        <p className="text-white/80">
          {lang === 'ta'
            ? 'வித்தியாசமான ஒலி அலைவரிசைகளை கேட்டு, அவர்களின் மூலத்தை கண்டறியுங்கள்.'
            : 'Listen to various sound frequencies and identify their sources.'}
        </p>
      </div>
    </PageWrapper>
  );
}
