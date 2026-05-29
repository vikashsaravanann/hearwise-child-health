import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Volume2, CheckCircle, XCircle } from 'lucide-react';
import OceanBackground from '@/components/OceanBackground';
import AnimatedOwl from '@/components/owl/AnimatedOwl';
import ProgressFish from '@/components/gamification/ProgressFish';
import BubblePopGame from '@/components/gamification/BubblePopGame';
import { useSession } from '@/contexts/SessionContext';

interface SoundTest {
  id: number;
  frequency: string;
  ear: 'left' | 'right';
  intensity: string;
}

export default function OceanTestPage() {
  const navigate = useNavigate();
  const { level } = useParams();
  const { lang } = useSession();
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<'left' | 'right' | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [showBubbleGame, setShowBubbleGame] = useState(false);

  const soundTests: SoundTest[] = [
    { id: 1, frequency: '250Hz', ear: 'right', intensity: 'Loud' },
    { id: 2, frequency: '500Hz', ear: 'left', intensity: 'Medium' },
    { id: 3, frequency: '1000Hz', ear: 'right', intensity: 'Medium' },
    { id: 4, frequency: '2000Hz', ear: 'left', intensity: 'Soft' },
    { id: 5, frequency: '4000Hz', ear: 'right', intensity: 'Medium' },
  ];

  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  const currentTest = soundTests[currentTestIndex];
  const progressPercent = ((currentTestIndex) / soundTests.length) * 100;

  // Synthesize audio
  const playSynthesizedSound = (freq: number, ear: 'left' | 'right') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = ctx.createStereoPanner();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      // Map intensity to gain
      const volume = currentTest.intensity === 'Loud' ? 0.5 : currentTest.intensity === 'Medium' ? 0.2 : 0.05;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.1);

      panner.pan.setValueAtTime(ear === 'left' ? -1 : 1, ctx.currentTime);

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.error('Audio synthesis failed', e);
    }
  };

  const levelInfo: Record<string, { name: string; emoji: string; description: string; speech: string }> = {
    '1': { name: 'Super Listener', emoji: '🐚', description: 'Easy Mode', speech: lang === 'ta' ? 'நீ செய்யலாம்! 🌟' : 'You can do it! 🌟' },
    '2': { name: 'Sound Explorer', emoji: '🐠', description: 'Normal Mode', speech: lang === 'ta' ? 'கவனமாக கேளுங்கள்!' : 'Listen carefully!' },
    '3': { name: 'Hearing Hero', emoji: '🦀', description: 'Medium Mode', speech: lang === 'ta' ? 'நீ ஒரு ஹீரோ! 🦸' : "You're a hero! 🦸" },
    '4': { name: 'Sonic Champion', emoji: '🐙', description: 'Hard Mode', speech: lang === 'ta' ? 'அருமை! தொடர்!' : 'Amazing! Keep going!' },
    '5': { name: 'Hearing Master', emoji: '👑', description: 'Expert Mode', speech: lang === 'ta' ? 'நீ மாஸ்டர்! 👑' : "You're a Master! 👑" },
  };

  const currentLevelInfo = levelInfo[level || '1'];

  const owlState = feedback === 'correct' ? 'celebrating' : feedback === 'incorrect' ? 'encouraging' : isPlayingSound ? 'excited' : 'idle';
  const owlSpeech = feedback === 'correct' ? (lang === 'ta' ? 'சரியானது! 🎉' : 'Correct! 🎉') :
    feedback === 'incorrect' ? (lang === 'ta' ? 'மீண்டும் முயல்வோம்!' : 'Try again! 💪') :
    currentTestIndex === 0 ? currentLevelInfo.speech : null;

  const playSound = () => {
    setIsPlayingSound(true);
    setHasPlayedSound(true);
    const freqValue = parseInt(currentTest.frequency);
    playSynthesizedSound(freqValue, currentTest.ear);
    setTimeout(() => { setIsPlayingSound(false); }, 1200);
  };

  const handleResponse = (selectedEar: 'left' | 'right') => {
    if (feedback !== null || isPlayingSound || !hasPlayedSound) return;
    setSelectedResponse(selectedEar);
    const isCorrect = selectedEar === currentTest.ear;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore(score + 1);
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1200);
    }

    setTimeout(() => {
      const nextIndex = currentTestIndex + 1;
      if (nextIndex < soundTests.length) {
        setCurrentTestIndex(nextIndex);
        setSelectedResponse(null);
        setFeedback(null);
        setHasPlayedSound(false);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        const levelNum = parseInt(level || '1');
        if (levelNum < 5) {
          setShowBubbleGame(true);
          setTimeout(() => {
            navigate('/thank-you', { state: { score: finalScore, level: levelNum } });
          }, 11500);
        } else {
          navigate('/thank-you', { state: { score: finalScore, level: levelNum } });
        }
      }
    }, 1200);
  };

  const handleBubbleGameComplete = () => {
    const finalScore = score;
    navigate(`/level-result/${level}?score=${finalScore}`);
  };

  if (showBubbleGame) {
    return <BubblePopGame durationSec={10} onComplete={handleBubbleGameComplete} />;
  }

  return (
    <div className="page-shell relative">
      <OceanBackground />

      <div className="fixed top-4 right-4 z-20">
        <AnimatedOwl state={owlState} size={72} speechBubble={owlSpeech} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <div className="text-center mb-6 mt-4">
          <div className="text-4xl mb-2">{currentLevelInfo.emoji}</div>
          <h1 className="text-3xl md:text-4xl font-black mb-1" style={{ fontFamily: 'Fredoka, sans-serif', color: 'hsl(200, 100%, 25%)' }}>
            {currentLevelInfo.name}
          </h1>
          <p className="text-blue-700 font-semibold">{currentLevelInfo.description}</p>
        </div>

        <div className="w-full max-w-2xl mb-6">
          <ProgressFish
            percent={progressPercent}
            current={currentTestIndex + 1}
            total={soundTests.length}
          />
        </div>

        <div className="mb-4 px-5 py-2 rounded-full bg-white/70 border-2 border-blue-300 backdrop-blur-sm shadow font-black text-blue-700 text-sm">
          ⭐ Score: {score} / {soundTests.length}
        </div>

        <div className="w-full max-w-2xl">
          <div className="ocean-panel p-6 md:p-10 text-center relative overflow-hidden backdrop-blur-xl border-4 border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl -z-10" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-300/20 rounded-full blur-2xl -z-10" />

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-blue-100/80 rounded-2xl p-3 border-2 border-blue-300">
                <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-tighter">FREQUENCY</div>
                <div className="text-xl font-black text-blue-700">{currentTest.frequency}</div>
              </div>
              <div className="bg-cyan-100/80 rounded-2xl p-3 border-2 border-cyan-300">
                <div className="text-xs text-cyan-600 font-semibold mb-1 uppercase tracking-tighter">INTENSITY</div>
                <div className="text-xl font-black text-cyan-700">{currentTest.intensity}</div>
              </div>
              <div className="bg-teal-100/80 rounded-2xl p-3 border-2 border-teal-300">
                <div className="text-xs text-teal-600 font-semibold mb-1 uppercase tracking-tighter">EAR</div>
                <div className="text-xl font-black text-teal-700">{currentTest.ear === 'left' ? '👂 L' : 'R 👂'}</div>
              </div>
            </div>

            <div className="mb-6">
              <button
                onClick={playSound}
                disabled={isPlayingSound || feedback !== null}
                className={`mx-auto px-8 py-4 rounded-full font-black text-lg flex items-center gap-3 transition-all duration-300 shadow-xl ${
                  isPlayingSound
                    ? 'bg-orange-400 text-white scale-110 shadow-orange-500/30 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 text-white hover:shadow-2xl hover:scale-105 active:scale-95'
                }`}
              >
                <Volume2 size={24} className={isPlayingSound ? 'animate-bounce' : ''} />
                {isPlayingSound ? (lang === 'ta' ? 'இயங்குகிறது...' : 'Playing...') : (lang === 'ta' ? 'ஒலி இயக்கு 🔊' : 'Play Sound 🔊')}
              </button>

              {isPlayingSound && (
                <div className="flex items-center justify-center gap-1.5 mt-4 h-12">
                  {Array(11).fill(0).map((_, i) => (
                    <div key={i} className="w-2 bg-gradient-to-t from-blue-500 to-cyan-300 rounded-full animate-sound-wave"
                      style={{ height: `${15 + Math.random() * 35}px`, animationDelay: `${i * 0.07}s` }} />
                  ))}
                </div>
              )}
            </div>

            <p className="text-2xl md:text-3xl font-black text-blue-900/80 mb-8 tracking-tight">
              {lang === 'ta' ? 'எந்த காதில் ஒலி கேட்டது?' : 'Which ear did you hear the sound in?'}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {(['left', 'right'] as const).map((ear) => {
                const isSelected = selectedResponse === ear;
                const isCorrectEar = isSelected && feedback === 'correct';
                const isWrongEar = isSelected && feedback === 'incorrect';
                return (
                  <button
                    key={ear}
                    onClick={() => handleResponse(ear)}
                    disabled={feedback !== null || isPlayingSound || !hasPlayedSound}
                    className={`relative p-6 rounded-[2.5rem] font-black text-xl transition-all duration-500 border-4 shadow-xl overflow-hidden group ${
                      isCorrectEar
                        ? 'bg-green-500 text-white scale-105 shadow-green-500/40 border-green-300'
                        : isWrongEar
                        ? 'bg-red-500 text-white scale-95 border-red-300 opacity-80'
                        : isSelected
                        ? 'bg-blue-600 text-white border-blue-400'
                        : !hasPlayedSound || isPlayingSound
                        ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-50 grayscale'
                        : ear === 'left'
                        ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white hover:scale-105 hover:shadow-2xl border-blue-300 active:scale-95'
                        : 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-white hover:scale-105 hover:shadow-2xl border-cyan-300 active:scale-95'
                    }`}
                  >
                    <div className={`text-5xl mb-2 transition-transform duration-500 ${!isPlayingSound && hasPlayedSound ? 'group-hover:scale-125' : ''}`}>👂</div>
                    <div className="relative z-10 tracking-wider">
                      {ear === 'left' ? (lang === 'ta' ? 'இடது' : 'LEFT') : (lang === 'ta' ? 'வலது' : 'RIGHT')}
                    </div>
                    {isCorrectEar && <CheckCircle className="absolute top-4 right-4" size={28} />}
                    {isWrongEar && <XCircle className="absolute top-4 right-4" size={28} />}
                  </button>
                );
              })}
            </div>

            <div className="h-10">
              {feedback === 'correct' && (
                <div className="animate-bounce text-center">
                  <p className="text-3xl font-black text-green-600 drop-shadow-sm">{lang === 'ta' ? '🎉 அருமை!' : '🎉 EXCELLENT!'}</p>
                </div>
              )}
              {feedback === 'incorrect' && (
                <div className="animate-shake text-center">
                  <p className="text-2xl font-black text-red-600 drop-shadow-sm">{lang === 'ta' ? '❌ அடுத்த முறை முயலலாம்' : '❌ Next time!'}</p>
                </div>
              )}
            </div>

            {showParticles && Array(12).fill(0).map((_, i) => (
              <div key={i} className="absolute animate-star-burst text-2xl pointer-events-none"
                style={{ left: '50%', top: '50%', '--tx': `${(Math.random() - 0.5) * 300}px`, '--ty': `${(Math.random() - 0.5) * 300}px` } as React.CSSProperties}>
                ⭐
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-blue-800 font-bold mt-8 text-base max-w-md bg-white/40 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/20">
          {lang === 'ta'
            ? 'ஒலியை கவனமாக கேட்டு, எந்த காதில் கேட்டீர்கள் என்று சொல்லுங்கள்! 💪'
            : "Listen carefully and choose the ear that heard the sound. You're doing amazing! 💪"}
        </p>
      </div>

      <style>{`
        .animate-sound-wave { animation: sound-wave 0.6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
