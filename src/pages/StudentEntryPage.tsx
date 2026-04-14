import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { createStudent } from '@/lib/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function StudentEntryPage() {
  const navigate = useNavigate();
  const { lang, session, setStudent } = useSession();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const canProceed = name.trim() && age && gender;

  const handleBegin = async () => {
    setLoading(true);
    try {
      let studentId: string | undefined;
      if (session?.schoolId) {
        studentId = await createStudent(name.trim(), Number(age), gender, session.schoolId, rollNumber || undefined);
      }
      setStudent({ name, age: Number(age), gender, rollNumber: rollNumber || undefined, studentId });
      navigate('/headphone-check');
    } catch (error) {
      console.error('Student creation error:', error);
      setStudent({ name, age: Number(age), gender, rollNumber: rollNumber || undefined });
      toast({ title: 'Offline mode', description: 'Student data will sync later.' });
      navigate('/headphone-check');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-6">
      <h2 className="text-xl font-bold text-foreground">{t('beginTest', lang)}</h2>
      <div className="mt-8 flex flex-col gap-5">
        <div>
          <Label className="text-sm font-medium">{t('studentName', lang)}</Label>
          <Input className="mt-1.5 h-12 rounded-xl" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <Label className="text-sm font-medium">{t('age', lang)}</Label>
          <Input className="mt-1.5 h-12 rounded-xl" type="number" min="4" max="16" value={age} onChange={e => setAge(e.target.value)} />
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
