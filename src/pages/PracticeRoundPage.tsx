import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { playSampleTone } from '@/lib/audio';
import OwlIcon from '@/components/OwlIcon';
import LanguageToggle from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function PracticeRoundPage() {
  const navigate = useNavigate();
  const { lang, setReadiness } = useSession();
  const [tapped, setTapped] = useState(false);
  const [practicePlayed, setPracticePlayed] = useState(false);
  const [practiceTapped, setPracticeTapped] = useState(false);

  const handleTap = () => {
    setTapped(true);
    setPracticeTapped(true);
    setTimeout(() => setTapped(false), 500);
  };

  const handlePlayPractice = async () => {
    await playSampleTone();
    setPracticePlayed(true);
  };

  const handleReady = () => {
    if (!practicePlayed || !practiceTapped) {
      toast({ title: t('practiceRequired', lang) });
      return;
    }
    setReadiness((prev) => ({ ...prev, practicePassed: true }));
    navigate('/test');
  };

  return (
    <div className="page-shell relative flex flex-col items-center justify-center text-center">
      <div className="absolute right-4 top-4 z-10">
        <LanguageToggle />
      </div>
      <div className="glass-panel w-full max-w-3xl p-6">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-4/5 rounded-full bg-primary" />
        </div>
        <div className="mt-5 flex flex-col items-center">
          <OwlIcon mood="happy" size={92} />
          <h2 className="mt-4 text-2xl font-bold text-foreground">{t('practiceRound', lang)}</h2>
          <p className="mt-2 text-base text-muted-foreground">{t('tapWhenHear', lang)}</p>

          <button
            onClick={handleTap}
            className={`mt-8 flex h-40 w-40 items-center justify-center rounded-full border border-primary/20 bg-primary/10 shadow-lg transition-all ${tapped ? 'scale-110 bg-primary/30' : ''}`}
          >
            <div className={`h-24 w-24 rounded-full bg-primary transition-transform ${tapped ? 'scale-125' : ''}`} />
          </button>

          <Button variant="outline" className="mt-6 h-12 rounded-xl bg-background/70" onClick={handlePlayPractice}>
            {t('playPracticeTone', lang)}
          </Button>
        </div>
      </div>

      <div className="mt-auto w-full max-w-3xl pt-8">
        <Button className="h-14 w-full rounded-2xl text-base font-semibold shadow-lg shadow-primary/20" onClick={handleReady}>
          {t('imReady', lang)}
        </Button>
      </div>
    </div>
  );
}
