import { useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { getParentSummary } from '@/lib/clinicalSafety';
import type { TestResult } from '@/lib/testEngine';
import OwlIcon from '@/components/OwlIcon';
import LanguageToggle from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

const freqs = ['500', '1000', '2000', '4000'] as const;

function FreqBar({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-xs text-muted-foreground">{label} Hz</span>
      <div className={`h-4 flex-1 rounded-full ${passed ? 'bg-success' : 'bg-destructive'}`} />
    </div>
  );
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, student, session } = useSession();
  const state = location.state as { results?: TestResult } | null;
  const results = state?.results;

  if (!results || !student) {
    navigate('/');
    return null;
  }

  const owlMood = results.overall === 'normal' ? 'happy' : results.overall === 'mild' ? 'thoughtful' : 'concerned';
  const bgColor = results.overall === 'normal' ? 'bg-success/10 border-success' : results.overall === 'mild' ? 'bg-warning/10 border-warning' : 'bg-destructive/10 border-destructive';
  const message = results.overall === 'normal' ? t('excellent', lang) : results.overall === 'mild' ? t('mildConcern', lang) : t('hearingIssue', lang);
  const parentSummary = getParentSummary(results, lang);

  const shareWhatsApp = () => {
    const isEarNormal = (ear: TestResult['left']) => ear['500'] && ear['1000'] && ear['2000'] && ear['4000'];
    const leftResult = isEarNormal(results.left) ? t('normal', lang) : t('mildConcernLabel', lang);
    const rightResult = isEarNormal(results.right) ? t('normal', lang) : t('mildConcernLabel', lang);
    const overallLabel = results.overall === 'normal' ? t('normal', lang) : results.overall === 'mild' ? t('mildConcernLabel', lang) : t('referToDoctor', lang);
    const text = `${t('hearingReportTitle', lang)}\n${t('student', lang)}: ${student.name}\n${t('age', lang)}: ${student.age}\n${t('school', lang)}: ${session?.schoolName ?? '-'}\n${t('date', lang)}: ${new Date().toLocaleDateString()}\n${t('leftEar', lang)}: ${leftResult}\n${t('rightEar', lang)}: ${rightResult}\n${t('overallResult', lang)}: ${overallLabel}\n\n${t('poweredByHearWise', lang)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="page-shell relative flex flex-col items-center">
      <div className="absolute right-4 top-4 z-10">
        <LanguageToggle />
      </div>
      <div className={`glass-panel flex w-full max-w-3xl flex-col items-center border-2 p-6 ${bgColor}`}>
        <OwlIcon mood={owlMood} size={80} />
        <p className="mt-4 text-center text-lg font-bold text-foreground">{message}</p>
      </div>

      <div className="mt-6 grid w-full max-w-3xl gap-4 md:grid-cols-2">
        <div className="soft-panel p-4">
          <h3 className="text-sm font-semibold text-foreground">{t('leftEar', lang)}</h3>
          <div className="mt-2 flex flex-col gap-2">
            {freqs.map(f => <FreqBar key={`l-${f}`} label={f} passed={results.left[f]} />)}
          </div>
        </div>
        <div className="soft-panel p-4">
          <h3 className="text-sm font-semibold text-foreground">{t('rightEar', lang)}</h3>
          <div className="mt-2 flex flex-col gap-2">
            {freqs.map(f => <FreqBar key={`r-${f}`} label={f} passed={results.right[f]} />)}
          </div>
        </div>
      </div>

      <div className="mt-4 w-full max-w-3xl rounded-2xl border border-border/70 bg-card/90 p-4 shadow-sm">
        <h4 className="text-sm font-semibold text-foreground">{t('parentGuidance', lang)}</h4>
        <p className="mt-2 text-sm text-muted-foreground">{parentSummary}</p>
      </div>

      <div className="mt-auto flex w-full max-w-3xl flex-col gap-3 pt-8">
        <Button className="h-14 rounded-2xl text-base font-semibold shadow-lg shadow-primary/20" onClick={() => navigate('/student-entry')}>
          {t('nextStudent', lang)}
        </Button>
        <Button variant="outline" className="h-14 gap-2 rounded-2xl bg-background/70 text-base" onClick={shareWhatsApp}>
          <Share2 size={18} />
          {t('shareWhatsApp', lang)}
        </Button>
        <Button variant="ghost" className="h-12" onClick={() => navigate('/session-summary')}>
          {t('endSession', lang)}
        </Button>
      </div>
    </div>
  );
}
