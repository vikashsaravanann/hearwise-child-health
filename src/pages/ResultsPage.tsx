import { useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import type { TestResult } from '@/lib/testEngine';
import OwlIcon from '@/components/OwlIcon';
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

  const shareWhatsApp = () => {
    const isEarNormal = (ear: TestResult['left']) => ear['500'] && ear['1000'] && ear['2000'] && ear['4000'];
    const leftResult = isEarNormal(results.left) ? 'Normal' : 'Mild Concern';
    const rightResult = isEarNormal(results.right) ? 'Normal' : 'Mild Concern';
    const overallLabel = results.overall === 'normal' ? 'Normal' : results.overall === 'mild' ? 'Mild Concern' : 'Refer to Doctor';
    const text = `HearWise Hearing Report 🎧\nStudent: ${student.name}\nAge: ${student.age}\nSchool: ${session?.schoolName ?? '-'}\nDate: ${new Date().toLocaleDateString()}\nLeft Ear: ${leftResult}\nRight Ear: ${rightResult}\nOverall Result: ${overallLabel}\n\nPowered by HearWise — Smart Hearing Care for Every Child`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-8">
      <div className={`flex w-full max-w-sm flex-col items-center rounded-2xl border-2 p-6 ${bgColor}`}>
        <OwlIcon mood={owlMood} size={80} />
        <p className="mt-4 text-center text-lg font-bold text-foreground">{message}</p>
      </div>

      <div className="mt-6 w-full max-w-sm">
        <h3 className="text-sm font-semibold text-foreground">{t('leftEar', lang)}</h3>
        <div className="mt-2 flex flex-col gap-2">
          {freqs.map(f => <FreqBar key={`l-${f}`} label={f} passed={results.left[f]} />)}
        </div>
      </div>

      <div className="mt-6 w-full max-w-sm">
        <h3 className="text-sm font-semibold text-foreground">{t('rightEar', lang)}</h3>
        <div className="mt-2 flex flex-col gap-2">
          {freqs.map(f => <FreqBar key={`r-${f}`} label={f} passed={results.right[f]} />)}
        </div>
      </div>

      <div className="mt-auto flex w-full max-w-sm flex-col gap-3 pt-8">
        <Button className="h-14 rounded-2xl text-base font-semibold" onClick={() => navigate('/student-entry')}>
          {t('saveTestNext', lang)}
        </Button>
        <Button variant="outline" className="h-14 gap-2 rounded-2xl text-base" onClick={shareWhatsApp}>
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
