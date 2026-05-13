import React, { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  left: number;
  delay: number;
  size: number;
  duration: number;
  tx: number;
}

interface Fish {
  id: number;
  top: number;
  delay: number;
  duration: number;
  reverse: boolean;
}

export default function OceanBackground() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [fish, setFish] = useState<Fish[]>([]);

  useEffect(() => {
    // Generate bubbles
    const generatedBubbles: Bubble[] = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      size: Math.random() * 30 + 10,
      duration: Math.random() * 4 + 3,
      tx: (Math.random() - 0.5) * 100,
    }));
    setBubbles(generatedBubbles);

    // Generate fish
    const generatedFish: Fish[] = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      top: Math.random() * 60 + 20,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 6,
      reverse: i % 2 === 0,
    }));
    setFish(generatedFish);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* Ocean gradient background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,100%,90%)] via-[hsl(200,100%,75%)] to-[hsl(200,100%,50%)]" />

      {/* Sand bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(43,87%,65%)] to-transparent opacity-60" />

      {/* Glowing orbs background */}
      <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[hsl(200,100%,70%)]/30 blur-[100px] animate-pulse-glow" />
      <div className="absolute -right-32 bottom-32 h-80 w-80 rounded-full bg-[hsl(200,100%,60%)]/20 blur-[120px] animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
      <div className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-[hsl(4,74%,63%)]/10 blur-[80px]" />

      {/* Animated bubbles */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={`absolute rounded-full border-2 border-[hsl(200,100%,85%)]/60 bg-[hsl(200,100%,95%)]/30 animate-bubble-rise ${bubble.size < 15 ? 'blur-[1px]' : ''}`}
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            bottom: '-50px',
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
            '--tx': `${bubble.tx}px`,
            boxShadow: `inset -2px -2px 8px rgba(255,255,255,0.4), inset 2px 2px 8px rgba(0,150,200,0.2)`,
          } as React.CSSProperties}
        >
          {/* Bubble shine */}
          <div className="absolute top-1 left-1 w-1/3 h-1/3 rounded-full bg-white/40" />
        </div>
      ))}

      {/* Animated fish */}
      {fish.map((f) => (
        <div
          key={f.id}
          className={`${f.reverse ? 'animate-fish-swim-reverse' : 'animate-fish-swim'} ${f.top < 40 ? 'blur-[2px] opacity-40' : 'blur-0 opacity-70'}`}
          style={{
            position: 'absolute',
            top: `${f.top}%`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
          }}
        >
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Fish body */}
            <ellipse cx="30" cy="20" rx="18" ry="12" fill="hsl(200,100%,55%)" />
            {/* Fish head */}
            <circle cx="42" cy="20" r="10" fill="hsl(200,100%,60%)" />
            {/* Fish eye */}
            <circle cx="46" cy="18" r="3" fill="white" />
            <circle cx="46" cy="18" r="1.5" fill="black" />
            {/* Fish tail */}
            <path d="M12 20 L-5 10 L-5 30 Z" fill="hsl(200,100%,50%)" />
            {/* Fin */}
            <path d="M28 14 L25 5 L30 14 Z" fill="hsl(200,100%,45%)" />
          </svg>
        </div>
      ))}

      {/* Seaweed plants */}
      <div className="absolute bottom-0 left-[10%] h-48 w-12">
        <svg width="100%" height="100%" viewBox="0 0 20 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 0 Q5 50, 10 100 Q15 150, 10 200"
            stroke="hsl(145,56%,41%)"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
            className="animate-sway"
          />
        </svg>
      </div>

      <div className="absolute bottom-0 right-[15%] h-56 w-12">
        <svg width="100%" height="100%" viewBox="0 0 20 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 0 Q8 60, 10 120 Q12 180, 10 250"
            stroke="hsl(145,56%,50%)"
            strokeWidth="3"
            fill="none"
            opacity="0.5"
            className="animate-sway"
            style={{ animationDelay: '0.5s' }}
          />
        </svg>
      </div>

      {/* Waves at water surface */}
      <div className="absolute top-0 left-0 right-0 h-16 opacity-20">
        <svg width="100%" height="100%" viewBox="0 0 1200 100" fill="none" preserveAspectRatio="none">
          <path
            d="M0,50 Q100,20 200,50 T400,50 T600,50 T800,50 T1000,50 T1200,50"
            stroke="hsl(200,100%,100%)"
            strokeWidth="3"
            fill="none"
            className="animate-wave-motion"
          />
          <path
            d="M0,60 Q100,35 200,60 T400,60 T600,60 T800,60 T1000,60 T1200,60"
            stroke="hsl(200,100%,95%)"
            strokeWidth="2"
            fill="none"
            className="animate-wave-motion"
            style={{ animationDelay: '0.2s' }}
          />
        </svg>
      </div>
    </div>
  );
}
