import React, { useEffect, useState } from 'react';
import { Trophy, X, Star } from 'lucide-react';

interface TrophyModalProps {
  levelNum: number;
  badgeName: string;
  emoji: string;
  score: number;
  maxScore: number;
  onCollect: () => void;
}

const LEVEL_COLORS: Record<number, string> = {
  1: 'from-amber-600 to-amber-400',
  2: 'from-slate-400 to-slate-300',
  3: 'from-yellow-400 to-yellow-300',
  4: 'from-cyan-400 to-blue-400',
  5: 'from-yellow-300 to-orange-300',
};

export default function TrophyModal({ levelNum, badgeName, emoji, score, maxScore, onCollect }: TrophyModalProps) {
  const [collected, setCollected] = useState(false);
  const [stars, setStars] = useState<Array<{ id: number; left: number; top: number; delay: number }>>([]);

  useEffect(() => {
    // Generate floating stars for celebration
    setStars(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 90 + 5,
        top: Math.random() * 80 + 5,
        delay: Math.random() * 0.8,
      }))
    );
  }, []);

  const handleCollect = () => {
    setCollected(true);
    setTimeout(onCollect, 600);
  };

  const gradientClass = LEVEL_COLORS[levelNum] || LEVEL_COLORS[1];
  const isPerfect = score === maxScore;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,30,60,0.85)', backdropFilter: 'blur(8px)', animation: 'trophy-backdrop-in 0.3s ease-out' }}
    >
      {/* Floating stars in background */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="pointer-events-none fixed text-2xl select-none"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animation: `trophy-star-float ${1.5 + s.delay}s ease-in-out ${s.delay}s infinite alternate`,
          }}
        >
          ⭐
        </div>
      ))}

      {/* Modal card */}
      <div
        className={`relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 ${collected ? 'scale-110 opacity-0 transition-all duration-500' : ''}`}
        style={{ background: 'linear-gradient(135deg, hsl(200,100%,15%) 0%, hsl(200,100%,25%) 100%)' }}
      >
        {/* Shimmer overlay */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 opacity-10" style={{ animation: 'trophy-shimmer 2s ease-in-out infinite', background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 p-8 text-center">
          {/* Level badge */}
          <div className="text-sm font-bold text-blue-300 mb-2 tracking-widest uppercase">Level {levelNum} Complete!</div>

          {/* 3D Trophy */}
          <div
            className="mx-auto mb-4 flex items-center justify-center"
            style={{ animation: 'trophy-3d-spin 3s ease-in-out infinite', transformStyle: 'preserve-3d' }}
          >
            <div
              className={`w-28 h-28 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-2xl border-4 border-white/40`}
              style={{ boxShadow: `0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(255,215,0,0.2)` }}
            >
              <span className="text-6xl" style={{ animation: 'trophy-pulse 1.5s ease-in-out infinite' }}>
                {emoji}
              </span>
            </div>
          </div>

          {/* Badge name */}
          <h2
            className="text-3xl font-black text-white mb-1"
            style={{ fontFamily: 'Fredoka, sans-serif', textShadow: '0 0 20px rgba(255,215,0,0.5)' }}
          >
            {badgeName}
          </h2>

          {/* Score */}
          <div className="flex items-center justify-center gap-1 mb-4">
            {Array(maxScore).fill(0).map((_, i) => (
              <Star
                key={i}
                size={24}
                className={i < score ? 'text-yellow-300 fill-yellow-300' : 'text-white/30'}
                style={i < score ? { animation: `badge-star-pop 0.4s ease-out ${i * 0.1}s both` } : undefined}
              />
            ))}
          </div>

          {isPerfect && (
            <div className="mb-4 rounded-2xl border-2 border-yellow-400 bg-yellow-400/20 px-4 py-2">
              <p className="font-black text-yellow-300 text-sm">🏆 PERFECT SCORE! Certificate Unlocked!</p>
            </div>
          )}

          {/* Collect button */}
          <button
            onClick={handleCollect}
            className="w-full py-4 rounded-2xl font-black text-xl text-white shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: `linear-gradient(135deg, hsl(43,90%,55%), hsl(43,90%,45%))`,
              boxShadow: '0 8px 32px rgba(255,193,7,0.4)',
              animation: 'collect-bounce 0.8s ease-in-out infinite',
              fontFamily: 'Fredoka, sans-serif',
            }}
          >
            ✨ Tap to Collect!
          </button>
        </div>
      </div>

      <style>{`
        @keyframes trophy-backdrop-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes trophy-3d-spin {
          0%, 100% { transform: perspective(400px) rotateY(0deg) scale(1); }
          50% { transform: perspective(400px) rotateY(15deg) scale(1.05); }
        }
        @keyframes trophy-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes trophy-shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        @keyframes trophy-star-float {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.7; }
          100% { transform: translateY(-20px) rotate(20deg) scale(1.2); opacity: 1; }
        }
        @keyframes badge-star-pop {
          0% { transform: scale(0) rotate(-30deg); opacity: 0; }
          60% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes collect-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
