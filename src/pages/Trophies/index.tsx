import React from 'react';
import PageWrapper from '@/components/shared/PageWrapper';
import { useSession } from '@/contexts/SessionContext';

export default function TrophiesPage() {
  const { lang } = useSession();
  const trophies = [
    { level: 1, emoji: '🐚', name: 'Bronze Star', title: 'Super Listener' },
    { level: 2, emoji: '🐠', name: 'Silver Star', title: 'Sound Explorer' },
    { level: 3, emoji: '🦀', name: 'Gold Star', title: 'Hearing Hero' },
    { level: 4, emoji: '🐙', name: 'Diamond Badge', title: 'Sonic Champion' },
    { level: 5, emoji: '👑', name: 'Golden Trophy', title: 'Hearing Master' },
  ];

  return (
    <PageWrapper
      title={lang === 'ta' ? '🏆 பதக்கங்கள்' : '🏆 Trophies'}
      subtitle={lang === 'ta' ? 'இல்லை, பெறப்பட்ட பதக்கங்கள்' : 'Your earned trophies'}
      owlState="celebrating"
      owlSpeech={lang === 'ta' ? 'மிக நல்லது! 🎉' : 'Great job! 🎉'}
    >
      <div className="grid grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 gap-5 sm:p-6 max-w-3xl mx-auto">
        {trophies.map((t) => (
          <div key={t.level} className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 backdrop-blur-sm shadow-lg text-center">
            <div className="text-6xl mb-2">{t.emoji}</div>
            <h3 className="font-black text-2xl" style={{ fontFamily: 'Fredoka, sans-serif' }}>{t.name}</h3>
            <p className="text-white/70 mt-1">{t.title}</p>
            <p className="text-sm text-white/40 mt-2">{lang === 'ta' ? `நிலை ${t.level}` : `Level ${t.level}`}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
