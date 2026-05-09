import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import SoundWaveBackground from '@/components/SoundWaveBackground';
import LanguageToggle from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { BadgeCheck, ChartNoAxesCombined, ShieldCheck, Sparkles, Info } from 'lucide-react';
import owlMascot from '@/assets/owl-mascot.png';
import AboutHearWiseModal from '@/components/AboutHearWiseModal';

function ErrorButton() {
  return (
    <button
      type="button"
      className="mt-3 rounded-xl border border-destructive/40 px-3 py-2 text-xs font-semibold text-destructive"
      onClick={() => {
        throw new Error('This is your first error!');
      }}
    >
      Break the world
    </button>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const { lang } = useSession();
  const highlights = [
    t('landingFeatureFast', lang),
    t('landingFeatureOffline', lang),
    t('landingFeatureReports', lang),
  ];
  const quickStats = [
    { label: 'Schools Targeted', value: '1.5M+' },
    { label: 'Pilot Ready', value: 'Tamil Nadu' },
    { label: 'Core Platform', value: 'Offline First' },
  ];

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/40 px-4 py-8 sm:px-6">
      <SoundWaveBackground />
      <div className="absolute right-4 top-4 z-20">
        <LanguageToggle />
      </div>

      <div className="z-10 w-full max-w-6xl space-y-6">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              School Hearing Screening Platform
            </div>

            <div className="mt-4 flex items-start gap-4 sm:gap-5">
              <img
                src={owlMascot}
                alt={t('hearWiseOwlAlt', lang)}
                width={120}
                height={120}
                className="h-20 w-20 shrink-0 rounded-2xl border border-border/60 bg-white/80 p-2 drop-shadow-lg sm:h-28 sm:w-28"
              />
              <div>
                <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">HearWise</h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{t('tagline', lang)}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {quickStats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border/60 bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-2">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2.5 text-sm text-foreground">
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
              <Button className="h-12 flex-1 rounded-2xl text-base font-semibold shadow-lg shadow-primary/20" onClick={() => navigate('/setup')}>
                {t('startAsTeacher', lang)}
              </Button>
              <Button variant="outline" className="h-12 flex-1 rounded-2xl text-base font-semibold bg-background/80" onClick={() => navigate('/dashboard')}>
                {t('viewDashboard', lang)}
              </Button>
            </div>

            <button
              onClick={() => setShowAbout(true)}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-blue-500 bg-transparent text-base font-semibold text-blue-600 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse hover:animate-none"
            >
              <Info className="h-5 w-5" /> About HearWise
            </button>

            {import.meta.env.DEV && <ErrorButton />}

            <div className="mt-6 border-t border-border/60 pt-4 text-center sm:text-left">
              <p className="text-xs text-muted-foreground">v1.0.0 • © 2025 HearWise Technologies</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{t('dataPrivacyNote', lang)}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-border/70 bg-card/90 p-5 shadow-xl backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-foreground">Why HearWise Works</h3>
              <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-secondary" />
                  <p>Reliable and standardized hearing checks designed for school environments.</p>
                </div>
                <div className="flex items-start gap-2">
                  <ChartNoAxesCombined className="mt-0.5 h-4 w-4 text-primary" />
                  <p>Actionable reports that help teachers and health workers prioritize follow-ups.</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-gradient-to-br from-primary/8 to-accent/8 p-5 shadow-xl">
              <h3 className="text-sm font-semibold text-foreground">Mission Snapshot</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Detect childhood hearing loss early through an accessible, affordable and scalable mobile-first screening workflow.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border/70 bg-card/90 p-5 shadow-xl backdrop-blur-sm sm:p-6">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">HearWise Technologies Pvt. Ltd.</h2>
          <p className="mt-1 text-sm text-muted-foreground">HearWise - School Hearing Screening Platform</p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
              <h3 className="text-sm font-semibold text-foreground">Mission</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                To eliminate undetected childhood hearing loss in India through accessible, affordable, and scalable mobile-based audiometry screening.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
              <h3 className="text-sm font-semibold text-foreground">Vision</h3>
              <p className="mt-1 text-sm text-muted-foreground">Every child in India screened for hearing loss before age 10.</p>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-border/60 bg-muted/40 p-4">
            <h3 className="text-sm font-semibold text-foreground">Problem Statement</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              63 million Indians suffer from significant hearing loss. Over 50% of cases begin in childhood and go undetected until age 7-10, causing irreversible speech, language, and learning damage. No scalable, affordable screening solution exists for Indian government schools today.
            </p>
          </div>

          <div className="mt-3 rounded-2xl border border-border/60 bg-muted/40 p-4">
            <h3 className="text-sm font-semibold text-foreground">Market</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>1.5 million government schools in India.</li>
              <li>Tamil Nadu alone has 37,000+ government schools.</li>
              <li>Zero are using digital hearing screening tools.</li>
            </ul>
          </div>
        </section>
      </div>
      
      {showAbout && (
        <AboutHearWiseModal onClose={() => setShowAbout(false)} />
      )}
    </div>
  );
}
