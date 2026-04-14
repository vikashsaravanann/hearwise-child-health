import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import OwlIcon from '@/components/OwlIcon';
import SoundWaveBackground from '@/components/SoundWaveBackground';
import LanguageToggle from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import owlMascot from '@/assets/owl-mascot.png';

export default function LandingPage() {
  const navigate = useNavigate();
  const { lang } = useSession();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-10">
      <SoundWaveBackground />
      <div className="absolute right-4 top-4">
        <LanguageToggle />
      </div>
      <div className="z-10 flex flex-col items-center gap-4 text-center">
        <img src={owlMascot} alt="HearWise Owl" width={120} height={120} className="drop-shadow-lg" />
        <h1 className="text-3xl font-extrabold text-foreground">HearWise</h1>
        <p className="max-w-xs text-base text-muted-foreground">{t('tagline', lang)}</p>
        <div className="flex w-full max-w-xs flex-col gap-3 pt-4">
          <Button className="h-14 text-base font-semibold rounded-2xl" onClick={() => navigate('/setup')}>
            {t('startAsTeacher', lang)}
          </Button>
          <Button variant="outline" className="h-14 text-base font-semibold rounded-2xl" onClick={() => navigate('/dashboard')}>
            {t('viewDashboard', lang)}
          </Button>
        </div>
        <p className="pt-6 text-xs text-muted-foreground">v1.0.0 • © 2025 HearWise Technologies</p>
        <p className="text-[10px] text-muted-foreground max-w-xs">{t('dataPrivacyNote', lang)}</p>
      </div>
    </div>
  );
}
