import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { TAMIL_NADU_DISTRICTS } from '@/lib/districts';
import { getOrCreateSchool, getOrCreateTeacher, createSession } from '@/lib/database';
import { getServerId } from '@/lib/offlineSync';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LanguageToggle from '@/components/LanguageToggle';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
      navigate('/student-entry');
    } catch (error) {
      console.error('Session setup error:', error);
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
      toast({ title: t('offlineMode', lang), description: t('dataSyncWhenOnline', lang) });
      navigate('/student-entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">{t('startSession', lang)}</h2>
        <LanguageToggle />
      </div>
      <div className="mt-8 flex flex-col gap-5">
        <div>
          <Label className="text-sm font-medium">{t('schoolName', lang)}</Label>
          <Input className="mt-1.5 h-12 rounded-xl" value={schoolName} onChange={e => setSchoolName(e.target.value)} />
        </div>
        <div>
          <Label className="text-sm font-medium">{t('teacherName', lang)}</Label>
          <Input className="mt-1.5 h-12 rounded-xl" value={teacherName} onChange={e => setTeacherName(e.target.value)} />
        </div>
        <div>
          <Label className="text-sm font-medium">{t('classGrade', lang)}</Label>
          <Select value={classGrade} onValueChange={setClassGrade}>
            <SelectTrigger className="mt-1.5 h-12 rounded-xl"><SelectValue placeholder={t('select', lang)} /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>{t('grade', lang)} {i + 1}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium">{t('district', lang)}</Label>
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger className="mt-1.5 h-12 rounded-xl"><SelectValue placeholder={t('select', lang)} /></SelectTrigger>
            <SelectContent>
              {TAMIL_NADU_DISTRICTS.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-auto pt-8">
        <Button className="h-14 w-full rounded-2xl text-base font-semibold" disabled={!canStart || loading} onClick={handleStart}>
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {t('startSession', lang)}
        </Button>
      </div>
    </div>
  );
}
