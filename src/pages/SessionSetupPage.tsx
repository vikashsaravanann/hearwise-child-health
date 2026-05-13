import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { TAMIL_NADU_DISTRICTS } from '@/lib/districts';
import { getOrCreateSchool, getOrCreateTeacher, createSession } from '@/lib/database';
import { getServerId } from '@/lib/offlineSync';
import { addObservabilityBreadcrumb, captureError, captureEvent, setObservabilityContext } from '@/lib/observability';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LanguageToggle from '@/components/LanguageToggle';
import { Loader2, ShieldCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import OceanBackground from '@/components/OceanBackground';

export default function SessionSetupPage() {
  const navigate = useNavigate();
  const { lang, setSession } = useSession();
  const [schoolName, setSchoolName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);

  const canStart = schoolName.trim() && teacherName.trim() && classGrade && district;

  const handleStart = async () => {
    setLoading(true);
    let schoolLocalId = '';
    let teacherLocalId = '';
    let sessionLocalId = '';

    try {
      schoolLocalId = await getOrCreateSchool(schoolName.trim(), district);
      teacherLocalId = await getOrCreateTeacher(teacherName.trim(), schoolLocalId);
      sessionLocalId = await createSession(teacherLocalId, schoolLocalId);

      setSession({
        schoolName,
        teacherName,
        classGrade,
        district,
        schoolLocalId,
        teacherLocalId,
        sessionLocalId,
        schoolId: getServerId('schools', schoolLocalId),
        teacherId: getServerId('teachers', teacherLocalId),
        sessionId: getServerId('sessions', sessionLocalId),
      });
      setObservabilityContext({
        schoolLocalId,
        teacherLocalId,
        sessionLocalId,
        classGrade,
        district,
      });
      addObservabilityBreadcrumb('Session started', 'session.lifecycle', { offline_fallback: false });
      captureEvent('session_started', {
        district,
        class_grade: classGrade,
        offline_fallback: false,
      });
      navigate('/student-entry');
    } catch (error) {
      console.error('Session setup error:', error);
      captureError(error, { stage: 'session_setup' }, 'warning');
      if (!schoolLocalId) {
        schoolLocalId = await getOrCreateSchool(schoolName.trim(), district);
      }
      if (!teacherLocalId) {
        teacherLocalId = await getOrCreateTeacher(teacherName.trim(), schoolLocalId);
      }
      if (!sessionLocalId) {
        sessionLocalId = await createSession(teacherLocalId, schoolLocalId);
      }
      setSession({
        schoolName,
        teacherName,
        classGrade,
        district,
        schoolLocalId,
        teacherLocalId,
        sessionLocalId,
        schoolId: getServerId('schools', schoolLocalId),
        teacherId: getServerId('teachers', teacherLocalId),
        sessionId: getServerId('sessions', sessionLocalId),
      });
      setObservabilityContext({
        schoolLocalId,
        teacherLocalId,
        sessionLocalId,
        classGrade,
        district,
      });
      addObservabilityBreadcrumb('Session started in offline fallback', 'session.lifecycle', { offline_fallback: true });
      captureEvent('session_started', {
        district,
        class_grade: classGrade,
        offline_fallback: true,
      });
      toast({ title: t('offlineMode', lang), description: t('dataSyncWhenOnline', lang) });
      navigate('/student-entry');
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
            <h2 className="text-3xl font-black text-blue-900 tracking-tight">{t('startSession', lang)}</h2>
            <LanguageToggle />
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl glass-panel p-6 sm:p-10 border-4 border-white/50 shadow-2xl backdrop-blur-md">

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <ShieldCheck className="h-3.5 w-3.5" />
          Configure screening session
        </div>
        <p className="text-sm text-muted-foreground">Add school, teacher, grade and district to initialize this screening batch.</p>
        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/4 rounded-full bg-primary" />
        </div>

        <div className="mt-6 grid gap-5">
          <div>
            <Label className="text-sm font-semibold">{t('schoolName', lang)}</Label>
            <Input className="mt-1.5 h-12 rounded-xl bg-background/80" value={schoolName} onChange={e => setSchoolName(e.target.value)} />
          </div>
          <div>
            <Label className="text-sm font-semibold">{t('teacherName', lang)}</Label>
            <Input className="mt-1.5 h-12 rounded-xl bg-background/80" value={teacherName} onChange={e => setTeacherName(e.target.value)} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label className="text-sm font-semibold">{t('classGrade', lang)}</Label>
              <Select value={classGrade} onValueChange={setClassGrade}>
                <SelectTrigger className="mt-1.5 h-12 rounded-xl bg-background/80"><SelectValue placeholder={t('select', lang)} /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>{t('grade', lang)} {i + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-semibold">{t('district', lang)}</Label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="mt-1.5 h-12 rounded-xl bg-background/80"><SelectValue placeholder={t('select', lang)} /></SelectTrigger>
                <SelectContent>
                  {TAMIL_NADU_DISTRICTS.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-auto w-full max-w-3xl pt-6">
        <Button className="h-14 w-full rounded-2xl text-base font-semibold shadow-lg shadow-primary/20" disabled={!canStart || loading} onClick={handleStart}>
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {t('startSession', lang)}
        </Button>
      </div>
    </div>
  </div>
);
}
