import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { validateStudentInput } from '@/lib/clinicalSafety';
import { createStudent } from '@/lib/database';
import { createLocalStudent, getServerId } from '@/lib/offlineSync';
import { addObservabilityBreadcrumb, captureError, captureEvent, setObservabilityContext } from '@/lib/observability';
import LanguageToggle from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UserRoundPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import OceanBackground from '@/components/OceanBackground';

export default function StudentEntryPage() {
  const navigate = useNavigate();
  const { lang, session, setStudent, resetReadiness } = useSession();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const errors = validateStudentInput(name, age, gender);
  const canProceed = Object.keys(errors).length === 0;

  useEffect(() => {
    if (!session?.sessionLocalId) {
      toast({ title: t('startSession', lang) });
      navigate('/setup');
    }
  }, [session?.sessionLocalId, navigate, lang]);

  const handleBegin = async () => {
    setLoading(true);
    try {
      if (!session?.schoolLocalId) {
        throw new Error('Session local school ID is missing');
      }

      const studentLocalId = await createStudent(
        name.trim(),
        Number(age),
        gender,
        session.schoolLocalId,
        rollNumber || undefined
      );
      setStudent({
        name,
        age: Number(age),
        gender,
        schoolLocalId: session.schoolLocalId,
        rollNumber: rollNumber || undefined,
        studentLocalId,
        studentId: getServerId('students', studentLocalId),
      });
      setObservabilityContext({
        studentLocalId,
        schoolLocalId: session.schoolLocalId,
        sessionLocalId: session.sessionLocalId,
      });
      addObservabilityBreadcrumb('Student added for screening', 'student.lifecycle', { offline_fallback: false });
      captureEvent('student_added', {
        age: Number(age),
        gender,
        offline_fallback: false,
      });
      resetReadiness();
      navigate('/headphone-check');
    } catch (error) {
      console.error('Student creation error:', error);
      captureError(error, { stage: 'student_entry' }, 'warning');
      if (!session?.schoolLocalId) {
        toast({ title: t('offlineMode', lang), description: t('dataSyncWhenOnline', lang) });
        navigate('/setup');
        return;
      }
      const fallbackStudentLocalId = createLocalStudent(
        name.trim(),
        Number(age),
        gender,
        session.schoolLocalId,
        rollNumber || undefined
      );
      setStudent({
        name,
        age: Number(age),
        gender,
        schoolLocalId: session.schoolLocalId,
        rollNumber: rollNumber || undefined,
        studentLocalId: fallbackStudentLocalId,
        studentId: getServerId('students', fallbackStudentLocalId),
      });
      setObservabilityContext({
        studentLocalId: fallbackStudentLocalId,
        schoolLocalId: session.schoolLocalId,
        sessionLocalId: session.sessionLocalId,
      });
      addObservabilityBreadcrumb('Student added with offline fallback', 'student.lifecycle', { offline_fallback: true });
      captureEvent('student_added', {
        age: Number(age),
        gender,
        offline_fallback: true,
      });
      resetReadiness();
      toast({ title: t('offlineMode', lang), description: t('studentDataSyncLater', lang) });
      navigate('/headphone-check');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none opacity-40 blur-sm">
        <OceanBackground />
      </div>

      <div className="relative z-10 flex flex-col min-h-[calc(100vh-80px)]">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-black text-blue-900 tracking-tight">{t('beginTest', lang)}</h2>
            <LanguageToggle />
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl glass-panel p-6 sm:p-10 border-4 border-white/50 shadow-2xl backdrop-blur-md">

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <UserRoundPlus className="h-3.5 w-3.5" />
          Student profile
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-2/4 rounded-full bg-primary" />
        </div>

        <div className="mt-6 grid gap-5">
          <div>
            <Label className="text-sm font-semibold">{t('studentName', lang)}</Label>
            <Input className="mt-1.5 h-12 rounded-xl bg-background/80" value={name} onChange={e => setName(e.target.value)} />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label className="text-sm font-semibold">{t('age', lang)}</Label>
              <Input className="mt-1.5 h-12 rounded-xl bg-background/80" type="number" min="4" max="16" value={age} onChange={e => setAge(e.target.value)} />
              {errors.age && <p className="mt-1 text-xs text-destructive">{errors.age}</p>}
            </div>
            <div>
              <Label className="text-sm font-semibold">{t('gender', lang)}</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="mt-1.5 h-12 rounded-xl bg-background/80"><SelectValue placeholder={t('select', lang)} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t('male', lang)}</SelectItem>
                  <SelectItem value="female">{t('female', lang)}</SelectItem>
                  <SelectItem value="other">{t('other', lang)}</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="mt-1 text-xs text-destructive">{errors.gender}</p>}
            </div>
          </div>
          <div>
            <Label className="text-sm font-semibold">{t('rollNumber', lang)}</Label>
            <Input className="mt-1.5 h-12 rounded-xl bg-background/80" value={rollNumber} onChange={e => setRollNumber(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-auto w-full max-w-3xl pt-6">
        <Button className="h-14 w-full rounded-2xl text-base font-semibold shadow-lg shadow-primary/20" disabled={!canProceed || loading} onClick={handleBegin}>
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {t('beginTest', lang)}
        </Button>
      </div>
    </div>
  );
}
