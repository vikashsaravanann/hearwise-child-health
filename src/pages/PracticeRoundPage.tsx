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
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-8 text-center">
      <div className="absolute right-4 top-4">
        <LanguageToggle />
      </div>
      <OwlIcon mood="happy" size={90} />
      <h2 className="mt-6 text-xl font-bold text-foreground">{t('practiceRound', lang)}</h2>
      <p className="mt-3 text-base text-foreground">{t('tapWhenHear', lang)}</p>

      <button
        onClick={handleTap}
        className={`mt-8 flex h-36 w-36 items-center justify-center rounded-full bg-primary/10 transition-all ${tapped ? 'scale-110 bg-primary/30' : ''}`}
      >
        <div className={`h-20 w-20 rounded-full bg-primary transition-transform ${tapped ? 'scale-125' : ''}`} />
      </button>

      <Button variant="outline" className="mt-6 h-12 rounded-xl" onClick={handlePlayPractice}>
        {t('playPracticeTone', lang)}
      </Button>

      <div className="mt-auto w-full max-w-sm pt-8">
        <Button className="h-14 w-full rounded-2xl text-base font-semibold" onClick={handleReady}>
          {t('imReady', lang)}
        </Button>
      </div>
    </div>
  );
}
