import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { playSampleTone } from '@/lib/audio';
import LanguageToggle from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Headphones, Volume2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function HeadphoneCheckPage() {
  const navigate = useNavigate();
  const { lang, setReadiness } = useSession();
  const [checks, setChecks] = useState([false, false, false]);
  const [samplePlayed, setSamplePlayed] = useState(false);
  const allChecked = checks.every(Boolean);

  const toggle = (i: number) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
  };

  const handlePlaySample = async () => {
    await playSampleTone();
    setSamplePlayed(true);
    setReadiness((prev) => ({ ...prev, sampleTonePlayed: true }));
  };

  const handleContinue = () => {
    if (!samplePlayed) {
      toast({ title: t('sampleToneRequired', lang) });
      return;
    }
    setReadiness((prev) => ({ ...prev, headphoneChecklistComplete: true }));
    navigate('/practice');
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-8">
      <div className="flex w-full max-w-sm items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">{t('headphoneCheck', lang)}</h2>
        <LanguageToggle />
      </div>
      <div className="my-8 flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
        <Headphones size={64} className="text-primary" />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-4">
        {[t('volumeMax', lang), t('headphonesOn', lang), t('childSeated', lang)].map((label, i) => (
          <label key={i} className="flex min-h-[60px] items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm">
            <Checkbox checked={checks[i]} onCheckedChange={() => toggle(i)} />
            {label}
          </label>
        ))}
      </div>
      <Button variant="outline" className="mt-6 h-12 gap-2 rounded-xl" onClick={handlePlaySample}>
        <Volume2 size={18} />
        {t('playSampleTone', lang)}
      </Button>
      <div className="mt-auto w-full max-w-sm pt-8">
        <Button className="h-14 w-full rounded-2xl text-base font-semibold" disabled={!allChecked} onClick={handleContinue}>
          {t('confirmContinue', lang)}
        </Button>
      </div>
    </div>
  );
}
