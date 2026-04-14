import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { validateStudentInput } from '@/lib/clinicalSafety';
import { createStudent } from '@/lib/database';
import { createLocalStudent, getServerId } from '@/lib/offlineSync';
import LanguageToggle from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
      resetReadiness();
      navigate('/headphone-check');
    } catch (error) {
      console.error('Student creation error:', error);
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
      resetReadiness();
      toast({ title: t('offlineMode', lang), description: t('studentDataSyncLater', lang) });
      navigate('/headphone-check');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">{t('beginTest', lang)}</h2>
        <LanguageToggle />
      </div>
      <div className="mt-8 flex flex-col gap-5">
        <div>
          <Label className="text-sm font-medium">{t('studentName', lang)}</Label>
          <Input className="mt-1.5 h-12 rounded-xl" value={name} onChange={e => setName(e.target.value)} />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>
        <div>
          <Label className="text-sm font-medium">{t('age', lang)}</Label>
          <Input className="mt-1.5 h-12 rounded-xl" type="number" min="4" max="16" value={age} onChange={e => setAge(e.target.value)} />
          {errors.age && <p className="mt-1 text-xs text-destructive">{errors.age}</p>}
        </div>
        <div>
          <Label className="text-sm font-medium">{t('gender', lang)}</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="mt-1.5 h-12 rounded-xl"><SelectValue placeholder={t('select', lang)} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">{t('male', lang)}</SelectItem>
              <SelectItem value="female">{t('female', lang)}</SelectItem>
              <SelectItem value="other">{t('other', lang)}</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="mt-1 text-xs text-destructive">{errors.gender}</p>}
        </div>
        <div>
          <Label className="text-sm font-medium">{t('rollNumber', lang)}</Label>
          <Input className="mt-1.5 h-12 rounded-xl" value={rollNumber} onChange={e => setRollNumber(e.target.value)} />
        </div>
      </div>
      <div className="mt-auto pt-8">
        <Button className="h-14 w-full rounded-2xl text-base font-semibold" disabled={!canProceed || loading} onClick={handleBegin}>
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {t('beginTest', lang)}
        </Button>
      </div>
    </div>
  );
}
