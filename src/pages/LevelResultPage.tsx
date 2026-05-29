import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Trophy, Share2, Download, ArrowRight } from 'lucide-react';
import OceanBackground from '@/components/OceanBackground';
import AnimatedOwl from '@/components/owl/AnimatedOwl';
import TrophyModal from '@/components/gamification/TrophyModal';
import { useSession } from '@/contexts/SessionContext';

interface LevelReward {
  emoji: string;
  badgeName: string;
  color: string;
}

export default function LevelResultPage() {
  const navigate = useNavigate();
  const { level } = useParams();
  const [searchParams] = useSearchParams();
  const { lang } = useSession();
  const [showTrophyModal, setShowTrophyModal] = useState(true);
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; symbol: string }>>([]);

  const score = parseInt(searchParams.get('score') || '0');
  const levelNum = parseInt(level || '1');

  const rewards: Record<number, LevelReward> = {
    1: { emoji: '🐚', badgeName: lang === 'ta' ? 'வெண்கல நட்சத்திரம்' : 'Bronze Star Badge', color: 'from-amber-700 to-amber-600' },
    2: { emoji: '🐠', badgeName: lang === 'ta' ? 'வெள்ளி நட்சத்திரம்' : 'Silver Star Badge', color: 'from-slate-400 to-slate-500' },
    3: { emoji: '🦀', badgeName: lang === 'ta' ? 'தங்க நட்சத்திரம்' : 'Gold Star Badge', color: 'from-yellow-400 to-yellow-500' },
    4: { emoji: '🐙', badgeName: lang === 'ta' ? 'வைர பதக்கம்' : 'Diamond Badge', color: 'from-cyan-300 to-blue-400' },
    5: { emoji: '👑', badgeName: lang === 'ta' ? 'தங்கக் கிரீடம்' : 'Golden Trophy', color: 'from-yellow-300 to-orange-400' },
  };

  const reward = rewards[levelNum];
  const maxScore = 5;
  const successRate = (score / maxScore) * 100;
  const isPerfect = score === maxScore;

  useEffect(() => {
    const symbols = ['🎊', '🎉', '⭐', '🏆', '💎', '🐚', '🐠'];
    setConfetti(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
      }))
    );
  }, [isPerfect]);

  const getOwlState = () => {
    if (score === maxScore) return 'celebrating' as const;
    if (score >= 3) return 'excited' as const;
    return 'encouraging' as const;
  };

  const getOwlSpeech = () => {
    if (score === maxScore) return lang === 'ta' ? 'அருமை! நீ சிறந்தவர்! 🏆' : 'Amazing! You are perfect! 🏆';
    if (score >= 3) return lang === 'ta' ? 'நன்றாக செய்தீர்கள்! 👏' : 'Well done! 👏';
    return lang === 'ta' ? 'அடுத்த முறை சிறப்பாக! 💪' : 'Better next time! 💪';
  };

  const getPerformanceMessage = () => {
    if (score === maxScore) return '🏆 PERFECT SCORE! 🏆';
    if (score >= 4) return '🎉 EXCELLENT! 🎉';
    if (score >= 3) return '👏 GREAT JOB! 👏';
    if (score >= 2) return '💪 GOOD EFFORT! 💪';
    return '🌟 KEEP TRYING! 🌟';
  };

  const handleNextLevel = () => {
    if (levelNum < 5) navigate('/ocean-levels');
    else navigate('/session-summary?completedLevels=5');
  };

  return (
    <div className="page-shell relative overflow-hidden">
      <OceanBackground />

      {/* Trophy Modal — shown first */}
      {showTrophyModal && (
        <TrophyModal
          levelNum={levelNum}
          badgeName={reward.badgeName}
          emoji={reward.emoji}
          score={score}
          maxScore={maxScore}
          onCollect={() => setShowTrophyModal(false)}
        />
      )}

      {/* Confetti rain */}
      {confetti.map((c) => (
        <div key={c.id} className="fixed pointer-events-none animate-float-up text-2xl select-none"
          style={{ left: `${c.left}%`, bottom: '-50px', animationDelay: `${c.delay}s` }}>
          {c.symbol}
        </div>
      ))}

      {/* Owl corner */}
      <div className="fixed top-4 right-4 z-20">
        <AnimatedOwl state={getOwlState()} size={72} speechBubble={getOwlSpeech()} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Header */}
        <div className="text-center mb-6 mt-4" style={{ animation: 'fade-in 0.6s ease-out' }}>
          <div className="text-6xl mb-3 animate-bounce-celebration">{reward.emoji}</div>
          <h1 className="text-4xl md:text-5xl font-black mb-2"
            style={{ fontFamily: 'Fredoka, sans-serif', color: 'hsl(200, 100%, 25%)' }}>
            {getPerformanceMessage()}
          </h1>
          <p className="text-lg text-blue-700 font-semibold">
            {lang === 'ta' ? `நிலை ${levelNum} முடிந்தது! 🌊` : `Level ${levelNum} Complete! 🌊`}
          </p>
        </div>

        {/* Score Card */}
        <div className="w-full max-w-2xl mb-6">
          <div className="ocean-panel p-6 md:p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-300/20 rounded-full blur-2xl -z-10 animate-pulse-glow" />

            {/* Score */}
            <p className="text-sm text-blue-600 font-semibold mb-3">
              {lang === 'ta' ? 'உங்கள் மதிப்பெண்' : 'YOUR SCORE'}
            </p>
            <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 mb-4">
              {score}/{maxScore}
            </div>

            {/* Success bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-blue-700">{lang === 'ta' ? 'வெற்றி விகிதம்' : 'Success Rate'}</span>
                <span className="font-bold text-blue-600">{Math.round(successRate)}%</span>
              </div>
              <div className="w-full h-4 bg-white/50 rounded-full overflow-hidden border-2 border-blue-300">
                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${successRate}%` }} />
              </div>
            </div>

            {/* Badge reward */}
            <div className="mb-6">
              <p className="text-sm text-blue-600 font-semibold mb-3">
                {lang === 'ta' ? '🎁 உங்கள் பரிசு 🎁' : '🎁 YOUR REWARD 🎁'}
              </p>
              <div className={`inline-block bg-gradient-to-r ${reward.color} text-white rounded-3xl px-8 py-5 shadow-2xl hover:scale-110 transition-transform cursor-default`}>
                <div className="text-5xl mb-1">{reward.emoji}</div>
                <div className="text-xl font-black">{reward.badgeName}</div>
                <div className="text-xs opacity-90 mt-1">
                  {lang === 'ta' ? 'திறக்கப்பட்டது! 🔓' : 'Unlocked! 🔓'}
                </div>
              </div>
            </div>


            {/* Badges collected */}
            <div className="pt-5 border-t-2 border-blue-200">
              <p className="text-sm text-blue-600 font-semibold mb-3">
                {lang === 'ta' ? 'சேகரிக்கப்பட்ட பதக்கங்கள்' : 'BADGES COLLECTED'}
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {Array.from({ length: levelNum }).map((_, i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-xl shadow-lg border-4 border-white animate-bounce-celebration"
                    style={{ animationDelay: `${i * 0.1}s` }}>⭐</div>
                ))}
                {Array.from({ length: 5 - levelNum }).map((_, i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-white/30 border-4 border-dashed border-blue-300 flex items-center justify-center text-xl opacity-40">⭐</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="w-full max-w-2xl grid grid-cols-2 gap-4">
          <button onClick={() => navigate(`/ocean-test/${level}`)}
            className="px-6 py-4 bg-blue-500 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all hover:scale-105 active:scale-95">
            🔄 {lang === 'ta' ? 'மீண்டும் முயல்' : 'Retry'}
          </button>
          <button onClick={handleNextLevel}
            className="px-6 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
            {levelNum < 5
              ? <>{lang === 'ta' ? 'அடுத்த நிலை' : 'Next Level'} <ArrowRight size={20} /></>
              : <>{lang === 'ta' ? 'முடி!' : 'Finish!'} <Trophy size={20} /></>}
          </button>
        </div>

        <p className="text-center text-blue-700 font-semibold mt-4 text-sm max-w-md">
          {score === maxScore
            ? (lang === 'ta' ? '🌟 நீ ஒரு கேட்கும் நட்சத்திரம்! 👑' : '🌟 You are a hearing legend! 👑')
            : (lang === 'ta' ? '💪 அடுத்த நிலையில் சிறப்பாக செய்!' : '💪 Try the next level to improve!')}
        </p>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
