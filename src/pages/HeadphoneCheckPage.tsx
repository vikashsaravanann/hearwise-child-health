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
    <div className="page-shell flex flex-col items-center">
      <div className="flex w-full max-w-3xl items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{t('headphoneCheck', lang)}</h2>
        <LanguageToggle />
      </div>
      <div className="mt-4 h-1.5 w-full max-w-3xl overflow-hidden rounded-full bg-muted">
        <div className="h-full w-3/4 rounded-full bg-primary" />
      </div>
      <div className="my-7 flex h-36 w-36 items-center justify-center rounded-full border border-primary/20 bg-primary/10 shadow-lg shadow-primary/15">
        <Headphones size={68} className="text-primary" />
      </div>
      <div className="glass-panel flex w-full max-w-3xl flex-col gap-4 p-5 sm:p-6">
        {[t('volumeMax', lang), t('headphonesOn', lang), t('childSeated', lang)].map((label, i) => (
          <label key={i} className="flex min-h-[60px] items-center gap-3 rounded-xl border border-border/70 bg-background/80 p-4 text-sm font-medium">
            <Checkbox checked={checks[i]} onCheckedChange={() => toggle(i)} />
            {label}
          </label>
        ))}
        <Button variant="outline" className="h-12 gap-2 rounded-xl bg-background/70" onClick={handlePlaySample}>
          <Volume2 size={18} />
          {t('playSampleTone', lang)}
        </Button>
      </div>
      <div className="mt-auto w-full max-w-3xl pt-8">
        <Button className="h-14 w-full rounded-2xl text-base font-semibold shadow-lg shadow-primary/20" disabled={!allChecked} onClick={handleContinue}>
          {t('confirmContinue', lang)}
        </Button>
      </div>
    </div>
  );
}
