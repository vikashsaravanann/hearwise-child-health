import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { getParentSummary, isReadinessComplete } from '@/lib/clinicalSafety';
import { buildTestSequence, playTestTone, getRandomDelay, computeResults, type TestStepResult } from '@/lib/testEngine';
import { saveTestResult, createReferral } from '@/lib/database';
import LanguageToggle from '@/components/LanguageToggle';
import { toast } from '@/hooks/use-toast';

import OceanBackground from '@/components/OceanBackground';
import AnimatedOwl, { type OwlState } from '@/components/owl/AnimatedOwl';
import ProgressFish from '@/components/gamification/ProgressFish';
import { Shield, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { startAmbientSound, stopAmbientSound, adjustAmbientVolume } from '@/lib/ambientAudio';

export default function ActiveTestPage() {
  const navigate = useNavigate();
  const { lang, student, session, addTestedStudent, readiness } = useSession();
  
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [tapped, setTapped] = useState(false);
  const [showBalloon, setShowBalloon] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [owlState, setOwlState] = useState<OwlState>('idle');
  const [owlSpeech, setOwlSpeech] = useState<string | null>(null);
  
  // Ambient Sound volume (0.2 is faint to protect hearing screening integrity)
  const [ambientVolume, setAmbientVolume] = useState(0.2);

  // Simulated ambient noise
  const [ambientDb, setAmbientDb] = useState(32);

  const resultsRef = useRef<TestStepResult[]>([]);
  const toneStartRef = useRef<number>(0);
  const respondedRef = useRef(false);
  const sequence = useRef(buildTestSequence()).current;
  const totalSteps = sequence.length;

  const currentStep = sequence[stepIndex];
  const progressPercent = (stepIndex / totalSteps) * 100;

  // Initialize mixed ambient ocean soundtrack
  useEffect(() => {
    startAmbientSound();
    adjustAmbientVolume(0.2);
    return () => {
      stopAmbientSound();
    };
  }, []);

  // Fluctuating decibel meter to simulate clinical calibration
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbientDb(Math.floor(30 + Math.random() * 5));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const toggleAmbient = () => {
    if (ambientVolume > 0) {
      setAmbientVolume(0);
      adjustAmbientVolume(0);
    } else {
      setAmbientVolume(0.2);
      adjustAmbientVolume(0.2);
    }
  };

  const handleTap = useCallback(() => {
    if (!waitingForResponse || respondedRef.current) return;
    respondedRef.current = true;
    const responseTime = Date.now() - toneStartRef.current;
    resultsRef.current.push({ step: currentStep, responded: true, responseTime });

    setTapped(true);
    setOwlState('celebrating');
    setOwlSpeech(lang === 'ta' ? 'அருமை! 🎉' : 'Awesome! 🎉');

    if (currentStep.frequency !== 0) {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(25);
      }
      setShowBalloon(true);
      setShowStars(true);
      setTimeout(() => setShowBalloon(false), 1500);
      setTimeout(() => setShowStars(false), 650);
    }
    
    setTimeout(() => {
      setTapped(false);
      setOwlState('idle');
      setOwlSpeech(null);
    }, 800);
  }, [waitingForResponse, currentStep, lang]);

  const runStep = useCallback(async () => {
    if (stepIndex >= totalSteps) return;

    respondedRef.current = false;
    setIsPlaying(true);
    setOwlState('idle');
    setOwlSpeech(lang === 'ta' ? 'அமைதியாக கேளுங்கள்... 🤫' : 'Listen closely... 🤫');

    await new Promise(r => setTimeout(r, getRandomDelay()));

    toneStartRef.current = Date.now();
    setWaitingForResponse(true);
    setOwlState('excited');
    setOwlSpeech(lang === 'ta' ? 'ஒலி கேட்டதா? 🔊' : 'Did you hear that? 🔊');

    await playTestTone(sequence[stepIndex]);
    
    // 2-second response window
    await new Promise(r => setTimeout(r, 2000));

    if (!respondedRef.current) {
      resultsRef.current.push({ step: sequence[stepIndex], responded: false, responseTime: null });
      setOwlState('encouraging');
      setOwlSpeech(lang === 'ta' ? 'தொடரலாம்! 💪' : 'Keep going! 💪');
      setTimeout(() => {
        setOwlState('idle');
        setOwlSpeech(null);
      }, 1000);
    }

    setWaitingForResponse(false);
    setIsPlaying(false);

    const nextIdx = stepIndex + 1;
    if (nextIdx >= totalSteps) {
      const results = computeResults(resultsRef.current);
      addTestedStudent({ student, results, timestamp: new Date().toISOString() });

      try {
        if (session?.sessionLocalId && student?.studentLocalId) {
          const resultId = await saveTestResult(session.sessionLocalId, student.studentLocalId, results, {
            readinessChecklist: readiness,
            parentSummaryEn: getParentSummary(results, 'en'),
            parentSummaryTa: getParentSummary(results, 'ta'),
          });
          const isOfflineQueued = resultId.startsWith('local_result_');
          if (isOfflineQueued) {
            toast({ title: t('saveQueuedForSync', lang) });
          }
          if (!isOfflineQueued && (results.overall === 'refer' || results.overall === 'mild')) {
            await createReferral(student.studentId || student.studentLocalId, resultId);
          }
        }
      } catch (e) {
        console.error('Failed to save result to DB:', e);
        toast({ title: t('saveQueuedForSync', lang) });
      }

      navigate('/results', { state: { results } });
    } else {
      setStepIndex(nextIdx);
    }
  }, [stepIndex, totalSteps, sequence, student, session, addTestedStudent, navigate, lang, readiness]);

  useEffect(() => {
    if (!isReadinessComplete(readiness)) {
      toast({ title: t('readinessRequired', lang) });
      navigate('/headphone-check');
      return;
    }

    const timeout = setTimeout(() => runStep(), 1000);
    return () => clearTimeout(timeout);
  }, [runStep, readiness, navigate, lang]);

  const currentEar = currentStep?.ear;

  return (
    <div className="page-shell relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Dynamic ocean floor background */}
      <div className="fixed inset-0 pointer-events-none opacity-40 blur-sm">
        <OceanBackground />
      </div>

      {/* Header Info Panel */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-20 pb-4 flex justify-between items-center gap-4">
        <div className="glass-panel px-6 py-3 border-2 border-white/50 shadow-lg flex items-center gap-3 bg-white/70 backdrop-blur-md rounded-2xl">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-left">
            <p className="text-xs text-blue-800/60 font-black uppercase tracking-wider">{t('student', lang)}</p>
            <p className="text-sm font-black text-blue-900">{student?.name || t('unknownStudent', lang)}</p>
          </div>
        </div>

        {/* Ambient Decibel Calibration Bar */}
        <div className="hidden md:flex glass-panel px-6 py-3 border-2 border-white/50 shadow-lg items-center gap-3 bg-white/70 backdrop-blur-md rounded-2xl">
          <Shield className="w-5 h-5 text-blue-600" />
          <div className="text-left">
            <p className="text-xs text-blue-800/60 font-black uppercase tracking-wider">Environmental Calib</p>
            <p className="text-sm font-black text-blue-900">Quiet: {ambientDb} dB (Safe)</p>
          </div>
        </div>

        {/* Ambient Sound Soundtrack Mute/Volume Controller */}
        <button
          onClick={toggleAmbient}
          className="glass-panel px-4 py-3 border-2 border-white/50 shadow-lg flex items-center gap-2 bg-white/70 backdrop-blur-md rounded-2xl hover:bg-white/95 active:scale-95 transition-all text-blue-900 focus:outline-none"
        >
          {ambientVolume > 0 ? (
            <>
              <Volume2 className="w-5 h-5 text-cyan-600 animate-bounce" />
              <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">Ambient On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-5 h-5 text-rose-500" />
              <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">Ambient Mute</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-4">
          <LanguageToggle />
          <AnimatedOwl state={owlState} size={70} speechBubble={owlSpeech} />
        </div>
      </header>

      {/* Main Testing Panel */}
      <main className="relative z-10 w-full max-w-3xl mx-auto px-4 flex flex-col items-center my-6">
        <div className="glass-panel w-full p-8 sm:p-12 border-4 border-white/50 shadow-2xl backdrop-blur-xl rounded-[3rem] text-center">
          
          {/* Progress Swimmer */}
          <div className="mb-8">
            <ProgressFish
              percent={progressPercent}
              current={stepIndex + 1}
              total={totalSteps}
            />
          </div>

          {/* Left/Right Ear Indicator with active visual highlighting */}
          <div className="flex justify-center items-center gap-6 sm:p-8 mb-8">
            <div className={`flex flex-col items-center rounded-2xl px-6 py-3 border-2 shadow-md transition-all duration-300 ${
              currentEar === 'left' 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 text-white scale-105 shadow-blue-500/20' 
                : 'bg-white/50 border-white/20 text-blue-900/60'
            }`}>
              <span className="text-2xl sm:text-3xl mb-1">👂</span>
              <span className="text-sm font-black tracking-wide">{t('leftEar', lang)}</span>
            </div>

            <div className={`flex flex-col items-center rounded-2xl px-6 py-3 border-2 shadow-md transition-all duration-300 ${
              currentEar === 'right' 
                ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 border-cyan-400 text-white scale-105 shadow-cyan-500/20' 
                : 'bg-white/50 border-white/20 text-blue-900/60'
            }`}>
              <span className="text-2xl sm:text-3xl mb-1">👂</span>
              <span className="text-sm font-black tracking-wide">{t('rightEar', lang)}</span>
            </div>
          </div>

          {/* Interactive Pearl Tap Zone */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              aria-label={t('tapWhenHear', lang)}
              className="relative flex items-center justify-center rounded-full focus:outline-none transition-transform duration-300 active:scale-95"
              onClick={handleTap}
              disabled={!waitingForResponse || respondedRef.current}
            >
              {/* Pulsing ring during tone play */}
              {isPlaying && <div className="absolute h-60 w-60 rounded-full bg-blue-500/20 border border-blue-300/30 animate-pulse-ring" />}
              {isPlaying && <div className="absolute h-48 w-48 rounded-full bg-blue-500/25 animate-blue-glow" />}

              {/* Magical pearl button */}
              <div className={`flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-full border-4 border-white/60 shadow-2xl transition-all duration-300 ${
                tapped 
                  ? 'scale-110 bg-blue-600/30 border-blue-400' 
                  : isPlaying 
                  ? 'bg-blue-500/10 hover:scale-105 hover:shadow-cyan-400/20' 
                  : 'bg-white/20 hover:scale-105'
              }`}>
                <div className={`h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-700 shadow-xl transition-all duration-300 ${
                  tapped ? 'scale-125' : 'hover:scale-110'
                }`} />
              </div>

              {/* Floating stars effect */}
              {showStars && (
                <>
                  <span className="pointer-events-none absolute -top-6 sm:p-8 left-1/2 -translate-x-1/2 text-2xl text-yellow-400 animate-star-burst">✦</span>
                  <span className="pointer-events-none absolute left-3 top-5 text-lg text-yellow-500 animate-star-burst-delay-1">✦</span>
                  <span className="pointer-events-none absolute right-3 top-5 text-lg text-yellow-500 animate-star-burst-delay-2">✦</span>
                </>
              )}
            </button>

            <p className="mt-8 text-2xl font-black text-blue-900 tracking-tight">{t('tapWhenHear', lang)}</p>
            <p className="mt-2 text-sm text-blue-800/50">
              {waitingForResponse ? (lang === 'ta' ? 'ஒலி இயக்கத்தில் உள்ளது!' : 'Listening window active!') : (lang === 'ta' ? 'அடுத்த ஒலிக்கு காத்திருக்கவும்...' : 'Wait for next tone...')}
            </p>

            {/* Simulated Live Sound Wave Animation */}
            {isPlaying && (
              <div className="flex items-center justify-center gap-1.5 mt-6 h-10">
                {Array(9).fill(0).map((_, i) => (
                  <div key={i} className="w-1.5 bg-gradient-to-t from-blue-600 to-cyan-300 rounded-full animate-sound-wave"
                    style={{ height: `${10 + Math.random() * 25}px`, animationDelay: `${i * 0.08}s` }} />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer / Status Gating Indicator */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-4 pb-8 flex justify-center text-center">
        <p className="text-xs font-black text-blue-800/40 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          HearWise ISO 8253 Screening Protocol Active
        </p>
      </footer>

      {/* Floating balloon animation on success */}
      {showBalloon && <div className="fixed bottom-1/3 left-1/2 -translate-x-1/2 text-4xl md:text-5xl z-50 animate-float-up pointer-events-none">🎈</div>}

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .animate-pulse-ring { animation: pulse-ring 2.5s infinite cubic-bezier(0.215, 0.61, 0.355, 1); }

        @keyframes blue-glow {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.65; }
        }
        .animate-blue-glow { animation: blue-glow 2s infinite ease-in-out; }

        @keyframes sound-wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.8); }
        }
        .animate-sound-wave { animation: sound-wave 0.5s ease-in-out infinite; }

        @keyframes star-burst {
          0% { transform: translate(-50%, 0) scale(0); opacity: 1; }
          50% { opacity: 1; }
          100% { transform: translate(-50%, -60px) scale(1.3); opacity: 0; }
        }
        .animate-star-burst { animation: star-burst 0.7s cubic-bezier(0.19, 1, 0.22, 1) forwards; }

        @keyframes star-burst-delay-1 {
          0% { transform: translate(0, 0) scale(0); opacity: 1; }
          50% { opacity: 1; }
          100% { transform: translate(-30px, -40px) scale(1.1); opacity: 0; }
        }
        .animate-star-burst-delay-1 { animation: star-burst-delay-1 0.7s cubic-bezier(0.19, 1, 0.22, 1) 0.1s forwards; }

        @keyframes star-burst-delay-2 {
          0% { transform: translate(0, 0) scale(0); opacity: 1; }
          50% { opacity: 1; }
          100% { transform: translate(30px, -40px) scale(1.1); opacity: 0; }
        }
        .animate-star-burst-delay-2 { animation: star-burst-delay-2 0.7s cubic-bezier(0.19, 1, 0.22, 1) 0.15s forwards; }

        @keyframes float-up {
          0% { transform: translate(-50%, 0) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -250px) scale(1.2); opacity: 0; }
        }
        .animate-float-up { animation: float-up 1.5s cubic-bezier(0.08, 0.82, 0.17, 1) forwards; }
      `}</style>
    </div>
  );
}
