import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function SessionSummaryPage() {
  const navigate = useNavigate();
  const { lang, testedStudents, session, clearTestedStudents } = useSession();

  const total = testedStudents.length;
  const normal = testedStudents.filter(s => s.results.overall === 'normal').length;
  const mild = testedStudents.filter(s => s.results.overall === 'mild').length;
  const refer = testedStudents.filter(s => s.results.overall === 'refer').length;

  const handleEndSession = () => {
    clearTestedStudents();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-8">
      <h2 className="text-xl font-bold text-foreground">{t('sessionSummary', lang)}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{session?.schoolName} • Grade {session?.classGrade}</p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center p-4">
            <Users className="text-primary" size={28} />
            <span className="mt-2 text-2xl font-bold text-foreground">{total}</span>
            <span className="text-xs text-muted-foreground">{t('totalTested', lang)}</span>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-success/30 bg-success/5">
          <CardContent className="flex flex-col items-center p-4">
            <CheckCircle className="text-success" size={28} />
            <span className="mt-2 text-2xl font-bold text-foreground">{normal}</span>
            <span className="text-xs text-muted-foreground">{t('normalResults', lang)}</span>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-warning/30 bg-warning/5">
          <CardContent className="flex flex-col items-center p-4">
            <AlertTriangle className="text-warning" size={28} />
            <span className="mt-2 text-2xl font-bold text-foreground">{mild}</span>
            <span className="text-xs text-muted-foreground">{t('mildConcerns', lang)}</span>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-destructive/30 bg-destructive/5">
          <CardContent className="flex flex-col items-center p-4">
            <AlertOctagon className="text-destructive" size={28} />
            <span className="mt-2 text-2xl font-bold text-foreground">{refer}</span>
            <span className="text-xs text-muted-foreground">{t('needsReferral', lang)}</span>
          </CardContent>
        </Card>
      </div>

      {/* Student list */}
      <div className="mt-6 flex flex-col gap-2">
        {testedStudents.map((s, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
            <span className="text-sm font-medium">{s.student.name}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
              s.results.overall === 'normal' ? 'bg-success/10 text-success' :
              s.results.overall === 'mild' ? 'bg-warning/10 text-warning' :
              'bg-destructive/10 text-destructive'
            }`}>
              {s.results.overall.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Button variant="outline" className="h-14 rounded-2xl text-base" onClick={() => navigate('/student-entry')}>
          {t('saveTestNext', lang)}
        </Button>
        <Button className="h-14 rounded-2xl text-base font-semibold" onClick={handleEndSession}>
          {t('endSession', lang)}
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        © 2025 HearWise Technologies. Making hearing care accessible for every child in India.
      </p>
    </div>
  );
}
