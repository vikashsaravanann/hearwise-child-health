import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      addObservabilityBreadcrumb('Student added for screening', 'student.lifecycle');
      captureEvent('student_added', { age: Number(age), gender });
      resetReadiness();
      navigate('/headphone-check');
    } catch (error) {
      console.error('Student creation error:', error);
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
            <h2 className="text-3xl sm:text-4xl font-black text-blue-900 tracking-tight">{t('beginTest', lang)}</h2>
            <LanguageToggle />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-3xl glass-panel p-8 sm:p-12 border-4 border-white/50 shadow-2xl backdrop-blur-md rounded-[3rem]"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-primary/10 px-4 py-2 text-sm font-black text-primary">
            <UserRoundPlus className="h-5 w-5" />
            Next Student Profile
          </div>

          <div className="grid gap-5 sm:p-6">
            <div className="space-y-2">
              <Label className="text-lg font-black text-blue-900">{t('studentName', lang)}</Label>
              <Input className="h-14 rounded-2xl bg-white/50 border-2 border-white/80 text-lg font-bold" value={name} onChange={e => setName(e.target.value)} />
              {errors.name && <p className="mt-1 text-xs text-destructive font-bold">{errors.name}</p>}
            </div>
            <div className="grid gap-6 sm:grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-lg font-black text-blue-900">{t('age', lang)}</Label>
                <Input className="h-14 rounded-2xl bg-white/50 border-2 border-white/80 text-lg font-bold" type="number" min="4" max="16" value={age} onChange={e => setAge(e.target.value)} />
                {errors.age && <p className="mt-1 text-xs text-destructive font-bold">{errors.age}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-lg font-black text-blue-900">{t('gender', lang)}</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="h-14 rounded-2xl bg-white/50 border-2 border-white/80 text-lg font-bold"><SelectValue placeholder={t('select', lang)} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t('male', lang)}</SelectItem>
                    <SelectItem value="female">{t('female', lang)}</SelectItem>
                    <SelectItem value="other">{t('other', lang)}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="mt-1 text-xs text-destructive font-bold">{errors.gender}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-black text-blue-900">{t('rollNumber', lang)}</Label>
              <Input className="h-14 rounded-2xl bg-white/50 border-2 border-white/80 text-lg font-bold" value={rollNumber} onChange={e => setRollNumber(e.target.value)} />
            </div>
          </div>
        </motion.div>

        <div className="mx-auto mt-auto w-full max-w-3xl pt-8 pb-12">
          <Button 
            className="h-16 w-full rounded-[2rem] text-xl font-black shadow-2xl shadow-primary/30 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all active:scale-95" 
            disabled={!canProceed || loading} 
            onClick={handleBegin}
          >
            {loading && <Loader2 className="mr-3 h-6 w-6 animate-spin" />}
            {t('beginTest', lang)}
          </Button>
        </div>
      </div>
    </div>
  );
}
