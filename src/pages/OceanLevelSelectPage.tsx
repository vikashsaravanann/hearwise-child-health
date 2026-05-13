import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Star, Zap, Award, Trophy } from 'lucide-react';
import OceanBackground from '@/components/OceanBackground';
import { useSession } from '@/contexts/SessionContext';

interface Level {
  id: number;
  name: string;
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  difficulty: string;
  reward: string;
  isUnlocked: boolean;
  previousLevelComplete?: boolean;
}

export default function OceanLevelSelectPage() {
  const navigate = useNavigate();
  const { lang } = useSession();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);

  const levels: Level[] = [
    { id: 1, name: 'Level 1', title: '🐚 Super Listener', description: 'Easy sounds in the ocean', color: 'from-blue-400 to-blue-500', icon: <Star className="w-12 h-12" />, difficulty: 'Beginner', reward: 'Bronze Star Badge', isUnlocked: true, previousLevelComplete: true },
    { id: 2, name: 'Level 2', title: '🐠 Sound Explorer', description: 'Moderate sound waves', color: 'from-cyan-400 to-cyan-500', icon: <Zap className="w-12 h-12" />, difficulty: 'Easy', reward: 'Silver Star Badge', isUnlocked: true },
    { id: 3, name: 'Level 3', title: '🦀 Hearing Hero', description: 'Medium difficulty challenges', color: 'from-teal-400 to-teal-500', icon: <Award className="w-12 h-12" />, difficulty: 'Medium', reward: 'Gold Star Badge', isUnlocked: true },
    { id: 4, name: 'Level 4', title: '🐙 Sonic Champion', description: 'Advanced sound detection', color: 'from-emerald-400 to-emerald-500', icon: <Crown className="w-12 h-12" />, difficulty: 'Hard', reward: 'Diamond Badge', isUnlocked: true },
    { id: 5, name: 'Level 5', title: '👑 Hearing Master', description: 'Ultimate challenge - Master all sounds!', color: 'from-yellow-300 to-orange-400', icon: <Trophy className="w-12 h-12" />, difficulty: 'Expert', reward: 'Golden Trophy + Certificate', isUnlocked: true },
  ];

  const handleLevelClick = (level: Level) => {
    if (level.isUnlocked) {
      setSelectedLevel(level.id);
      setTimeout(() => { navigate(`/ocean-test/${level.id}`); }, 500);
    }
  };

  return (
    <div className="page-shell relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none opacity-40 blur-sm">
        <OceanBackground />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center mb-12 mt-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-black mb-2" style={{ fontFamily: 'Fredoka, sans-serif', color: 'hsl(200, 100%, 30%)' }}>
            🌊 Ocean Hearing Challenge
          </h1>
          <p className="text-lg md:text-xl text-blue-700 font-semibold">Choose your island and test your hearing abilities!</p>
          <p className="text-sm text-blue-600 mt-2">Complete each level to unlock amazing rewards 🏆</p>
        </div>

        <div className="w-full max-w-6xl px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-3 mb-8">
          {levels.map((level, index) => (
            <div
              key={level.id}
              className={`relative cursor-pointer transition-all duration-300 transform stagger-${index + 1}`}
              onMouseEnter={() => setHoveredLevel(level.id)}
              onMouseLeave={() => setHoveredLevel(null)}
              onClick={() => handleLevelClick(level)}
            >
              <div
                className={`relative rounded-3xl p-6 shadow-xl border-2 transition-all duration-300 transform ${selectedLevel === level.id ? 'scale-110 ring-4 ring-yellow-300' : hoveredLevel === level.id ? 'scale-105 shadow-2xl' : 'shadow-lg'} ${level.isUnlocked ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                style={{ background: `linear-gradient(135deg, ${level.color})`, borderColor: 'rgba(255,255,255,0.5)' }}
              >
                <div className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 200 200" fill="white" opacity="0.3"><circle cx="100" cy="100" r="80" /></svg>
                </div>
                <div className="relative z-10 flex flex-col items-center text-white text-center">
                  <div className={`mb-3 p-3 rounded-full transition-all duration-300 ${hoveredLevel === level.id ? 'animate-bounce-celebration' : ''}`} style={{ background: 'rgba(255,255,255,0.2)', boxShadow: hoveredLevel === level.id ? '0 0 20px rgba(255,255,255,0.6)' : 'none' }}>
                    {level.icon}
                  </div>
                  <h3 className="text-xl md:text-lg font-black mb-1" style={{ fontSize: '1.1rem' }}>{level.title}</h3>
                  <div className="px-3 py-1 rounded-full bg-white/30 text-xs font-bold mb-2 backdrop-blur-sm">{level.difficulty}</div>
                  <p className="text-xs md:text-sm font-medium mb-3 opacity-95">{level.description}</p>
                  <div className="px-2 py-1 rounded-lg bg-yellow-300/90 text-gray-800 text-xs font-bold w-full">🎁 {level.reward}</div>
                  {level.previousLevelComplete && (
                    <div className="mt-2 flex gap-1">
                      {Array(5).fill(0).map((_, i) => (<Star key={i} size={14} className="fill-yellow-300" />))}
                    </div>
                  )}
                </div>
                {hoveredLevel === level.id && (<div className="absolute inset-0 rounded-3xl border-2 border-white/50 animate-pulse-ring" />)}
                {!level.isUnlocked && (<div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/30 backdrop-blur-sm"><span className="text-3xl">🔒</span></div>)}
              </div>
              <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center font-black text-white shadow-lg ring-4 ring-white" style={{ background: `linear-gradient(135deg, ${level.color})` }}>
                {level.id}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-blue-700 font-semibold mt-4">
          <p>💡 Tip: Complete each level to unlock the next challenge!</p>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
      `}</style>
    </div>
  );
}
