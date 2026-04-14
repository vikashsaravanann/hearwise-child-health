import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function StudentEntryPage() {
  const navigate = useNavigate();
  const { lang, setStudent } = useSession();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  const canProceed = name.trim() && age && gender;

  const handleBegin = () => {
    setStudent({ name, age: Number(age), gender, rollNumber: rollNumber || undefined });
    navigate('/headphone-check');
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-6">
      <h2 className="text-xl font-bold text-foreground">{t('studentName', lang)}</h2>
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
        <Button className="h-14 w-full rounded-2xl text-base font-semibold" disabled={!canProceed} onClick={handleBegin}>
          {t('beginTest', lang)}
        </Button>
      </div>
    </div>
  );
}
