import React from 'react';
import owlMascot from '@/assets/owl-mascot.png';

export type OwlState =
  | 'idle'
  | 'excited'
  | 'celebrating'
  | 'thinking'
  | 'encouraging'
  | 'cheering'
  | 'sleeping';

interface AnimatedOwlProps {
  state?: OwlState;
  size?: number;
  /** bilingual speech bubble text; pass null to hide */
  speechBubble?: string | null;
  className?: string;
}

export default function AnimatedOwl({
  state = 'idle',
  size = 96,
  speechBubble,
  className = '',
}: AnimatedOwlProps) {
  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Speech bubble */}
      {speechBubble && (
        <div
          className="mb-2 rounded-2xl border-2 border-[hsl(200,100%,70%)] bg-white/90 px-4 py-2 text-center text-sm font-bold text-[hsl(200,100%,30%)] shadow-lg backdrop-blur-sm"
          style={{ maxWidth: size * 2, animation: 'bubble-pop-in 0.3s ease-out' }}
        >
          {speechBubble}
          {/* Triangle pointer */}
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-[hsl(200,100%,70%)]"
          />
        </div>
      )}

      {/* Owl image with state animation */}
      <div
        style={{ width: size, height: size, animation: getAnimation(state) }}
        className="relative"
      >
        <img
          src={owlMascot}
          alt="HearWise Owl Mascot"
          width={size}
          height={size}
          className="h-full w-full object-contain drop-shadow-xl"
          style={{ filter: getFilter(state) }}
        />

        {/* Sparkles for celebrating */}
        {state === 'celebrating' && (
          <>
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="pointer-events-none absolute text-lg"
                style={{
                  top: `${10 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 60}%`,
                  animation: `owl-sparkle ${0.6 + i * 0.15}s ease-out ${i * 0.1}s infinite`,
                }}
              >
                ✨
              </span>
            ))}
          </>
        )}

        {/* ZZZ for sleeping */}
        {state === 'sleeping' && (
          <>
            {['Z', 'Z', 'Z'].map((z, i) => (
              <span
                key={i}
                className="pointer-events-none absolute font-black text-blue-400"
                style={{
                  top: `${-10 - i * 18}%`,
                  right: `${-5 + i * 5}%`,
                  fontSize: `${10 + i * 4}px`,
                  animation: `owl-zzz 1.5s ease-in-out ${i * 0.4}s infinite`,
                }}
              >
                {z}
              </span>
            ))}
          </>
        )}

        {/* Question marks for thinking */}
        {state === 'thinking' && (
          <>
            {['?', '?'].map((q, i) => (
              <span
                key={i}
                className="pointer-events-none absolute font-black text-amber-500"
                style={{
                  top: `${-5 - i * 15}%`,
                  right: `${-8 + i * 12}%`,
                  fontSize: `${14 + i * 4}px`,
                  animation: `owl-question ${1 + i * 0.3}s ease-in-out infinite`,
                }}
              >
                {q}
              </span>
            ))}
          </>
        )}

        {/* Banner for cheering */}
        {state === 'cheering' && (
          <div
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-3 py-1 text-xs font-black text-white shadow-lg"
            style={{ animation: 'owl-banner 0.5s ease-in-out infinite alternate' }}
          >
            🎉 LEVEL UP!
          </div>
        )}
      </div>

      <style>{`
        @keyframes owl-idle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes owl-excited {
          0%, 100% { transform: translateY(0px) scale(1); }
          25% { transform: translateY(-16px) scale(1.05) rotate(-3deg); }
          75% { transform: translateY(-12px) scale(1.05) rotate(3deg); }
        }
        @keyframes owl-celebrating {
          0%, 100% { transform: rotate(-5deg) scale(1); }
          25% { transform: rotate(5deg) scale(1.1) translateY(-10px); }
          50% { transform: rotate(-3deg) scale(1.05) translateY(-5px); }
          75% { transform: rotate(3deg) scale(1.1) translateY(-10px); }
        }
        @keyframes owl-thinking {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-8deg) translateX(-4px); }
        }
        @keyframes owl-encouraging {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08) translateY(-4px); }
        }
        @keyframes owl-cheering {
          0%, 100% { transform: scale(1) rotate(-2deg); }
          50% { transform: scale(1.08) rotate(2deg) translateY(-6px); }
        }
        @keyframes owl-sleeping {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes owl-sparkle {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.4) rotate(180deg); opacity: 1; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes owl-zzz {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(-20px) scale(1.3); opacity: 0; }
        }
        @keyframes owl-question {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-6px) rotate(5deg); }
        }
        @keyframes owl-banner {
          from { transform: translateX(-50%) rotate(-2deg); }
          to { transform: translateX(-50%) rotate(2deg); }
        }
        @keyframes bubble-pop-in {
          from { transform: scale(0.7); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="owl-"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

function getAnimation(state: OwlState): string {
  const map: Record<OwlState, string> = {
    idle: 'owl-idle 3s ease-in-out infinite',
    excited: 'owl-excited 0.6s ease-in-out infinite',
    celebrating: 'owl-celebrating 0.8s ease-in-out infinite',
    thinking: 'owl-thinking 1.5s ease-in-out infinite',
    encouraging: 'owl-encouraging 1.2s ease-in-out infinite',
    cheering: 'owl-cheering 0.7s ease-in-out infinite',
    sleeping: 'owl-sleeping 2.5s ease-in-out infinite',
  };
  return map[state];
}

function getFilter(state: OwlState): string {
  const map: Record<OwlState, string> = {
    idle: 'none',
    excited: 'brightness(1.1) saturate(1.2)',
    celebrating: 'brightness(1.15) saturate(1.3) hue-rotate(5deg)',
    thinking: 'brightness(0.95) saturate(0.9)',
    encouraging: 'brightness(1.1)',
    cheering: 'brightness(1.2) saturate(1.4)',
    sleeping: 'brightness(0.85) saturate(0.7)',
  };
  return map[state];
}
