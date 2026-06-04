import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { t } from '@/lib/i18n';
import { getParentSummary } from '@/lib/clinicalSafety';
import type { TestResult } from '@/lib/testEngine';
import AnimatedOwl from '@/components/owl/AnimatedOwl';
import LanguageToggle from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Share2, ArrowRight, UserRoundPlus, Home, Volume2, ShieldCheck, HeartPulse, Hospital } from 'lucide-react';
import OceanBackground from '@/components/OceanBackground';
import DownloadReportButton from '@/components/DownloadReportButton';
import type { ReportData } from '@/utils/generateReport';
const freqs = ['500', '1000', '2000', '4000'] as const;

function FreqBar({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center gap-3 w-full bg-white/40 p-3 rounded-xl border border-white/30 backdrop-blur-sm transition-all duration-300 hover:bg-white/60">
      <span className="w-16 text-xs font-black text-blue-900/60 tracking-wider">{label} Hz</span>
      <div className="flex-1 h-3 rounded-full bg-blue-100/50 overflow-hidden border border-blue-200">
        <div className={`h-full rounded-full transition-all duration-1000 ${
          passed 
            ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.4)]' 
            : 'bg-gradient-to-r from-rose-400 to-red-500'
        }`} style={{ width: '100%' }} />
      </div>
      <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
        passed 
          ? 'bg-emerald-100 text-emerald-700' 
          : 'bg-rose-100 text-rose-700'
      }`}>
        {passed ? 'PASS' : 'REFER'}
      </span>
    </div>
  );
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, student, session } = useSession();
  const { user } = useAuth();
  const state = location.state as { results?: TestResult } | null;
  const results = state?.results;

  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; symbol: string }>>([]);

  useEffect(() => {
    if (results?.overall === 'normal') {
      const symbols = ['🎉', '⭐', '🐚', '🐠', '🌊'];
      setConfetti(
        Array.from({ length: 20 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 0.8,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
        }))
      );
    }
  }, [results]);

  if (!results || !student) {
    navigate('/');
    return null;
  }

  const owlMood = results.overall === 'normal' ? 'celebrating' : results.overall === 'mild' ? 'encouraging' : 'thinking';
  const bgColor = results.overall === 'normal' 
    ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-400/50 shadow-emerald-500/10' 
    : results.overall === 'mild' 
    ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-400/50 shadow-amber-500/10' 
    : 'bg-gradient-to-br from-rose-500/10 to-red-500/10 border-rose-400/50 shadow-rose-500/10';

  const titleMessage = results.overall === 'normal' 
    ? (lang === 'ta' ? 'அருமை! கேள்வித்திறன் சாதாரணம்' : 'EXCELLENT HEARING!') 
    : results.overall === 'mild' 
    ? (lang === 'ta' ? 'சிறிய கவலை கண்டறியப்பட்டது' : 'MILD CONCERN') 
    : (lang === 'ta' ? 'மருத்துவ பரிந்துரை தேவை' : 'CLINICAL REFERRAL RECOMMENDED');

  const descMessage = results.overall === 'normal' 
    ? t('excellent', lang) 
    : results.overall === 'mild' 
    ? t('mildConcern', lang) 
    : t('hearingIssue', lang);

  const parentSummary = getParentSummary(results, lang);

  const shareWhatsApp = () => {
    const isEarNormal = (ear: TestResult['left']) => ear['500'] && ear['1000'] && ear['2000'] && ear['4000'];
    const leftResult = isEarNormal(results.left) ? t('normal', lang) : t('mildConcernLabel', lang);
    const rightResult = isEarNormal(results.right) ? t('normal', lang) : t('mildConcernLabel', lang);
    const overallLabel = results.overall === 'normal' ? t('normal', lang) : results.overall === 'mild' ? t('mildConcernLabel', lang) : t('referToDoctor', lang);
    const text = `${t('hearingReportTitle', lang)}\n${t('student', lang)}: ${student.name}\n${t('age', lang)}: ${student.age}\n${t('school', lang)}: ${session?.schoolName ?? '-'}\n${t('date', lang)}: ${new Date().toLocaleDateString()}\n${t('leftEar', lang)}: ${leftResult}\n${t('rightEar', lang)}: ${rightResult}\n${t('overallResult', lang)}: ${overallLabel}\n\n${t('poweredByHearWise', lang)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const screeningResultData: ReportData = {
    childName: student.name,
    age: student.age.toString(),
    schoolName: session?.schoolName || 'N/A',
    className: 'N/A',
    testDate: new Date().toLocaleDateString('en-IN'),
    overallResult: results.overall === 'normal' ? 'pass' : 'refer',
    conductedBy: user?.email || session?.teacherName || 'HearWise Screener',
    rightEarResults: freqs.map(f => ({
      level: 40,
      frequency: `${f} Hz`,
      result: results.right[f] ? 'pass' : 'refer'
    })),
    leftEarResults: freqs.map(f => ({
      level: 40,
      frequency: `${f} Hz`,
      result: results.left[f] ? 'pass' : 'refer'
    }))
  };

  return (
    <div className="page-shell relative min-h-screen flex flex-col justify-between overflow-x-hidden pb-12">
      <div className="fixed inset-0 pointer-events-none opacity-40 blur-sm">
        <OceanBackground />
      </div>

      {/* Confetti Rain for normal results */}
      {confetti.map((c) => (
        <div key={c.id} className="fixed pointer-events-none animate-float-up text-2xl select-none"
          style={{ left: `${c.left}%`, bottom: '-50px', animationDelay: `${c.delay}s` }}>
          {c.symbol}
        </div>
      ))}

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
            <span className="text-xl">🌊</span>
          </div>
          <span className="text-xl font-black text-blue-900 tracking-tight">HearWise Results</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
        </div>
      </header>

      {/* Main Results Panel */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 flex flex-col items-center my-8">
        
        {/* Core Result Header Card */}
        <div className={`glass-panel w-full p-6 sm:p-8 border-4 shadow-2xl backdrop-blur-xl rounded-[3rem] text-center mb-8 flex flex-col items-center gap-4 transition-all duration-300 ${bgColor}`}>
          <div className="relative mb-2">
            <div className="absolute inset-0 bg-blue-300/20 rounded-full blur-2xl animate-pulse" />
            <AnimatedOwl state={owlMood} size={110} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-3xl sm:text-4xl font-black text-blue-900 tracking-tight mb-2">
              {titleMessage}
            </h1>
            <p className="text-lg font-bold text-blue-800/60 max-w-xl mx-auto">
              {descMessage}
            </p>
          </div>

          {/* Gamified Star Badges */}
          {results.overall === 'normal' && (
            <div className="mt-2 flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-300/20 border-2 border-yellow-400 text-yellow-800 text-base font-black shadow-lg shadow-yellow-500/10">
                ⭐ Super Listener Badge unlocked! ⭐
              </div>
            </div>
          )}
        </div>

        {/* Clinical Frequency Boards */}
        <div className="grid w-full gap-5 sm:p-6 md:grid-cols-1 sm:grid-cols-2 mb-8">
          {/* Left Ear Board */}
          <div className="glass-panel p-6 sm:p-6 sm:p-8 border-2 border-white/50 shadow-xl rounded-[2.5rem] bg-white/70 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl sm:text-3xl">👂</span>
              <div>
                <h3 className="text-lg font-black text-blue-900 leading-tight">{t('leftEar', lang)}</h3>
                <p className="text-xs text-blue-800/40 font-bold uppercase tracking-wider">Frequency Sweep</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {freqs.map(f => <FreqBar key={`l-${f}`} label={f} passed={results.left[f]} />)}
            </div>
          </div>

          {/* Right Ear Board */}
          <div className="glass-panel p-6 sm:p-6 sm:p-8 border-2 border-white/50 shadow-xl rounded-[2.5rem] bg-white/70 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl sm:text-3xl">👂</span>
              <div>
                <h3 className="text-lg font-black text-blue-900 leading-tight">{t('rightEar', lang)}</h3>
                <p className="text-xs text-blue-800/40 font-bold uppercase tracking-wider">Frequency Sweep</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {freqs.map(f => <FreqBar key={`r-${f}`} label={f} passed={results.right[f]} />)}
            </div>
          </div>
        </div>

        {/* Parent Guidance & Clinical Context Panel */}
        <div className="glass-panel w-full p-6 sm:p-6 sm:p-8 border-2 border-white/50 shadow-xl rounded-[2.5rem] bg-white/70 backdrop-blur-md mb-8">
          <div className="flex items-center gap-3 mb-4">
            <HeartPulse className="w-6 h-6 text-blue-600" />
            <h4 className="text-md font-black text-blue-900">{t('parentGuidance', lang)}</h4>
          </div>
          <p className="text-sm font-bold text-blue-800/70 leading-relaxed bg-white/30 p-5 rounded-2xl border border-white/40">
            {parentSummary}
          </p>
        </div>

        {/* Action Controls */}
        <div className="w-full flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
          <DownloadReportButton result={screeningResultData} />

          {results.overall !== 'normal' && (
            <Button 
              className="bg-amber-600 hover:bg-amber-500 text-white font-medium"
              onClick={() => navigate('/audiologists?refer=true')}
            >
              <Hospital className="mr-2 h-4 w-4" />
              Find an Audiologist Near You →
            </Button>
          )}

          <Button 
            className="h-16 px-8 rounded-2xl text-lg font-black shadow-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            onClick={() => navigate('/student-entry')}
          >
            <UserRoundPlus className="w-5 h-5" />
            {t('nextStudent', lang)}
            <ArrowRight className="w-5 h-5" />
          </Button>

          <Button 
            variant="outline" 
            className="h-16 px-8 rounded-2xl text-lg font-black border-2 border-white/60 bg-white/40 hover:bg-white/60 text-blue-800 shadow-lg flex items-center justify-center gap-2 transition-all"
            onClick={shareWhatsApp}
          >
            <Share2 className="w-5 h-5 text-emerald-600 animate-pulse" />
            {t('shareWhatsApp', lang)}
          </Button>

          <Button 
            variant="ghost" 
            className="h-16 px-6 rounded-2xl text-base font-bold text-blue-900/60 hover:text-blue-900 hover:bg-white/40 transition-all"
            onClick={() => navigate('/session-summary')}
          >
            <Home className="w-4 h-4 mr-2" />
            {t('endSession', lang)}
          </Button>
        </div>

      </main>

      {/* Verification footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-4 flex justify-center text-center mt-6">
        <p className="text-[10px] font-black text-blue-800/30 uppercase tracking-[0.25em] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          HearWise Technologies Pvt. Ltd. • All clinical logs stored securely
        </p>
      </footer>

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-500px) scale(1.3); opacity: 0; }
        }
        .animate-float-up { animation: float-up 3s ease-out forwards; }
      `}</style>
    </div>
  );
}

