import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { playSampleTone } from '@/lib/audio';
import OwlIcon from '@/components/OwlIcon';
import { Button } from '@/components/ui/button';

export default function PracticeRoundPage() {
  const navigate = useNavigate();
  const { lang } = useSession();
  const [tapped, setTapped] = useState(false);

  const handleTap = () => {
    setTapped(true);
    setTimeout(() => setTapped(false), 500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8 text-center">
      <OwlIcon mood="happy" size={90} />
      <h2 className="mt-6 text-xl font-bold text-foreground">{t('practiceRound', lang)}</h2>
      <p className="mt-3 text-base text-foreground">{t('tapWhenHear', lang)}</p>
      {lang === 'en' && <p className="mt-1 text-sm text-muted-foreground">ஒலி கேட்டால் திரையை தொடுங்கள்!</p>}

      <button
        onClick={handleTap}
        className={`mt-8 flex h-36 w-36 items-center justify-center rounded-full bg-primary/10 transition-all ${tapped ? 'scale-110 bg-primary/30' : ''}`}
      >
        <div className={`h-20 w-20 rounded-full bg-primary transition-transform ${tapped ? 'scale-125' : ''}`} />
      </button>

      <Button variant="outline" className="mt-6 h-12 rounded-xl" onClick={() => playSampleTone()}>
        {t('playPracticeTone', lang)}
      </Button>

      <div className="mt-auto w-full max-w-sm pt-8">
        <Button className="h-14 w-full rounded-2xl text-base font-semibold" onClick={() => navigate('/test')}>
          {t('imReady', lang)}
        </Button>
      </div>
    </div>
  );
}
