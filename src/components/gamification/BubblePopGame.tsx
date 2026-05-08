import React, { useCallback, useEffect, useRef, useState } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  popped: boolean;
  color: string;
}

interface BubblePopGameProps {
  durationSec?: number;
  onComplete: (score: number) => void;
}

const COLORS = [
  'hsl(200,100%,65%)', 'hsl(170,80%,55%)', 'hsl(43,90%,60%)',
  'hsl(340,80%,65%)', 'hsl(260,70%,65%)', 'hsl(120,60%,55%)',
];

/**
 * A 10-second "Pop the bubbles!" mini-game shown between levels.
 * Bubbles float up from the bottom; tap/click to pop them for points.
 */
export default function BubblePopGame({ durationSec = 10, onComplete }: BubblePopGameProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const [done, setDone] = useState(false);
  const nextId = useRef(0);
  const scoreRef = useRef(0);

  // Spawn bubbles periodically
  useEffect(() => {
    if (done) return;
    const spawn = setInterval(() => {
      setBubbles((prev) => [
        ...prev.filter((b) => !b.popped && b.y > -10),
        {
          id: nextId.current++,
          x: Math.random() * 80 + 10,
          y: 105,
          size: Math.random() * 40 + 30,
          speed: Math.random() * 0.4 + 0.2,
          popped: false,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        },
      ]);
    }, 600);
    return () => clearInterval(spawn);
  }, [done]);

  // Move bubbles upward
  useEffect(() => {
    if (done) return;
    const move = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y - b.speed * 2 }))
          .filter((b) => b.y > -15)
      );
    }, 30);
    return () => clearInterval(move);
  }, [done]);

  // Countdown timer
  useEffect(() => {
    if (done) return;
    const tick = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(tick);
          setDone(true);
          setTimeout(() => onComplete(scoreRef.current), 800);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [done, onComplete]);

  const popBubble = useCallback((id: number) => {
    setBubbles((prev) => prev.map((b) => (b.id === id ? { ...b, popped: true } : b)));
    setScore((s) => {
      const next = s + 1;
      scoreRef.current = next;
      return next;
    });
  }, []);

  const pct = (timeLeft / durationSec) * 100;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(180deg, hsl(200,100%,20%) 0%, hsl(200,100%,35%) 100%)' }}
    >
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2">
        <div>
          <p className="text-white/70 text-sm font-semibold">Mini Game</p>
          <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            🫧 Pop the Bubbles!
          </h2>
        </div>
        <div className="text-right">
          <p className="text-white/70 text-sm font-semibold">Score</p>
          <p className="text-3xl font-black text-yellow-300">{score}</p>
        </div>
      </div>

      {/* Timer bar */}
      <div className="px-6 mb-2">
        <div className="h-3 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${pct}%`,
              background: pct > 50 ? 'hsl(120,70%,55%)' : pct > 25 ? 'hsl(43,90%,55%)' : 'hsl(4,74%,63%)',
            }}
          />
        </div>
        <p className="text-center text-white/70 text-sm mt-1">{timeLeft}s remaining</p>
      </div>

      {/* Bubble arena */}
      <div className="relative flex-1" style={{ touchAction: 'none' }}>
        {bubbles.map((b) =>
          b.popped ? null : (
            <button
              key={b.id}
              onClick={() => popBubble(b.id)}
              className="absolute rounded-full border-2 border-white/40 flex items-center justify-center text-white font-black transition-transform hover:scale-110 active:scale-125 cursor-pointer select-none"
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: b.size,
                height: b.size,
                background: `radial-gradient(circle at 35% 35%, white 0%, ${b.color} 40%, ${b.color}88 100%)`,
                boxShadow: `0 4px 20px ${b.color}66, inset -4px -4px 12px rgba(0,0,0,0.15)`,
                fontSize: b.size * 0.35,
                transform: 'translate(-50%, -50%)',
              }}
            >
              🫧
            </button>
          )
        )}

        {done && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-4xl font-black text-white mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {score} Bubbles!
              </h3>
              <p className="text-white/80 text-lg">
                {score >= 10 ? 'Amazing! 🌟' : score >= 5 ? 'Great job! 👏' : 'Nice try! 💪'}
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
