import React from 'react';

interface ProgressFishProps {
  /** 0–100 */
  percent: number;
  current: number;
  total: number;
}

/**
 * A fish swimming toward a treasure chest as the child answers questions.
 * At 100% the chest "opens" with sparkles.
 */
export default function ProgressFish({ percent, current, total }: ProgressFishProps) {
  const isComplete = percent >= 100;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-1 px-1">
        <span className="text-xs font-bold text-blue-700">
          Question {current} of {total}
        </span>
        <span className="text-xs font-bold text-emerald-600">{Math.round(percent)}%</span>
      </div>

      {/* Track */}
      <div className="relative h-8 rounded-full bg-white/50 border-2 border-blue-300 overflow-visible shadow-inner">
        {/* Water fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700 ease-out"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />

        {/* Swimming fish — positioned at the tip of the progress fill */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
          style={{
            left: `calc(${Math.min(percent, 96)}% - 20px)`,
            animation: isComplete ? 'none' : 'fish-bob 0.6s ease-in-out infinite',
          }}
        >
          <svg width="36" height="24" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="30" cy="20" rx="18" ry="12" fill="#0099FF" opacity="0.9" />
            <circle cx="42" cy="20" r="10" fill="#00BBFF" opacity="0.95" />
            <circle cx="46" cy="17" r="3" fill="white" />
            <circle cx="46" cy="17" r="1.5" fill="#111" />
            <path d="M12 20 L-5 10 L-5 30 Z" fill="#0077CC" opacity="0.8" />
            <path d="M28 14 L25 5 L30 14 Z" fill="#0088EE" opacity="0.7" />
          </svg>
        </div>

        {/* Treasure chest at the end */}
        <div
          className="absolute right-1 top-1/2 -translate-y-1/2 text-xl select-none"
          style={{ animation: isComplete ? 'chest-open 0.5s ease-out' : 'none' }}
        >
          {isComplete ? '💰' : '🎁'}
        </div>

        {/* Sparkles burst at completion */}
        {isComplete && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
            {['✨', '⭐', '🌟'].map((s, i) => (
              <span
                key={i}
                className="absolute text-sm"
                style={{
                  right: `${4 + i * 14}px`,
                  top: `${-8 - i * 6}px`,
                  animation: `star-burst 0.8s ease-out ${i * 0.1}s forwards`,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fish-bob {
          0%, 100% { transform: translateY(-50%) rotate(-3deg); }
          50% { transform: translateY(-60%) rotate(3deg); }
        }
        @keyframes chest-open {
          0% { transform: translateY(-50%) scale(1); }
          50% { transform: translateY(-70%) scale(1.4); }
          100% { transform: translateY(-50%) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
