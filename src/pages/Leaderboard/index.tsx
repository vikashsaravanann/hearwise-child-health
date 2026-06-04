import React from 'react';
import PageWrapper from '@/components/shared/PageWrapper';
import { useSession } from '@/contexts/SessionContext';

export default function LeaderboardPage() {
  const { lang } = useSession();
  return (
    <PageWrapper
      title={lang === 'ta' ? '🏆 தரவரிசை' : '🏆 Leaderboard'}
      subtitle={lang === 'ta' ? 'Grade 3 – 12' : 'Grade 3 – 12'}
      owlState="excited"
      owlSpeech={lang === 'ta' ? 'யார் முன்னிலையில் உள்ளனர்?' : 'Who is leading?'}
    >
      <div className="max-w-2xl mx-auto p-5 sm:p-6 text-center">
        <h2 className="text-2xl font-black text-white mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {lang === 'ta' ? 'சிறந்த சாதனையாளர்கள்' : 'Top Achievers'}
        </h2>
        <p className="text-white/80">
          {lang === 'ta'
            ? 'அதிக புள்ளிகள் பெற்ற மாணவர்களின் பட்டியல் இங்கே தோன்றும்.'
            : 'List of students with the highest scores will appear here.'}
        </p>
      </div>
    </PageWrapper>
  );
}
