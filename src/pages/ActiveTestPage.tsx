import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { buildTestSequence, playTestTone, getRandomDelay, computeResults, type TestStepResult } from '@/lib/testEngine';
import { saveTestResult, createReferral } from '@/lib/database';

export default function ActiveTestPage() {
  const navigate = useNavigate();
  const { lang, student, session, addTestedStudent } = useSession();
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [tapped, setTapped] = useState(false);
  const [showBalloon, setShowBalloon] = useState(false);
  const resultsRef = useRef<TestStepResult[]>([]);
  const toneStartRef = useRef<number>(0);
  const respondedRef = useRef(false);
  const sequence = useRef(buildTestSequence()).current;
  const totalSteps = sequence.length;

  const currentStep = sequence[stepIndex];

  const handleTap = useCallback(() => {
    if (!waitingForResponse || respondedRef.current) return;
    respondedRef.current = true;
    const responseTime = Date.now() - toneStartRef.current;
    resultsRef.current.push({ step: currentStep, responded: true, responseTime });

    setTapped(true);
    if (currentStep.frequency !== 0) {
      setShowBalloon(true);
      setTimeout(() => setShowBalloon(false), 1500);
    }
    setTimeout(() => setTapped(false), 300);
  }, [waitingForResponse, currentStep]);

  const runStep = useCallback(async () => {
    if (stepIndex >= totalSteps) return;

    respondedRef.current = false;
    setIsPlaying(true);

    await new Promise(r => setTimeout(r, getRandomDelay()));

    toneStartRef.current = Date.now();
    setWaitingForResponse(true);

    await playTestTone(sequence[stepIndex]);
    await new Promise(r => setTimeout(r, 2000));

    if (!respondedRef.current) {
      resultsRef.current.push({ step: sequence[stepIndex], responded: false, responseTime: null });
    }

    setWaitingForResponse(false);
    setIsPlaying(false);

    const nextIdx = stepIndex + 1;
    if (nextIdx >= totalSteps) {
      const results = computeResults(resultsRef.current);
      addTestedStudent({ student, results, timestamp: new Date().toISOString() });

      // Save to database
      try {
        if (session?.sessionId && student?.studentId) {
          const resultId = await saveTestResult(session.sessionId, student.studentId, results);
          if (results.overall === 'refer' || results.overall === 'mild') {
            await createReferral(student.studentId, resultId);
          }
        }
      } catch (e) {
        console.error('Failed to save result to DB:', e);
      }

      navigate('/results', { state: { results } });
    } else {
      setStepIndex(nextIdx);
    }
  }, [stepIndex, totalSteps, sequence, student, session, addTestedStudent, navigate]);

  useEffect(() => {
    const timeout = setTimeout(() => runStep(), 500);
    return () => clearTimeout(timeout);
  }, [stepIndex]);

  const currentEar = currentStep?.ear;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6" onClick={handleTap}>
      {/* Ear indicator */}
      <div className="absolute top-8 flex items-center gap-4">
        <div className={`flex flex-col items-center rounded-xl px-4 py-2 ${currentEar === 'left' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
          <span className="text-xs font-medium">{t('leftEar', lang)}</span>
        </div>
        <div className={`flex flex-col items-center rounded-xl px-4 py-2 ${currentEar === 'right' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
          <span className="text-xs font-medium">{t('rightEar', lang)}</span>
        </div>
      </div>

      {/* Progress dots */}
      <div className="absolute top-20 flex flex-wrap justify-center gap-1 px-4">
        {Array.from({ length: Math.min(totalSteps, 40) }).map((_, i) => (
          <div key={i} className={`h-2 w-2 rounded-full transition-colors ${i <= stepIndex ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>

      {/* Tap zone */}
      <div className="relative flex items-center justify-center">
        {isPlaying && <div className="absolute h-44 w-44 rounded-full bg-primary/20 animate-pulse-ring" />}
        <div className={`flex h-40 w-40 items-center justify-center rounded-full transition-all duration-150 ${tapped ? 'scale-110 bg-primary/40' : isPlaying ? 'bg-primary/20' : 'bg-muted'}`}>
          <div className={`h-24 w-24 rounded-full bg-primary transition-transform ${tapped ? 'scale-110' : ''}`} />
        </div>
      </div>

      <p className="mt-8 text-lg font-medium text-foreground">{t('tapWhenHear', lang)}</p>

      {showBalloon && <div className="absolute bottom-1/3 text-4xl animate-float-up">🎈</div>}
    </div>
  );
}
