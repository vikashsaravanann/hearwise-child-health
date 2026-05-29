import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { playSampleTone } from '@/lib/audio';
import LanguageToggle from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Headphones, Volume2, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import OceanBackground from '@/components/OceanBackground';

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
    <div className="page-shell relative min-h-screen flex flex-col items-center">
      <div className="fixed inset-0 pointer-events-none opacity-40 blur-sm">
        <OceanBackground />
      </div>

      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center">
        <div className="flex w-full items-center justify-between mb-4">
          <h2 className="text-3xl font-black text-blue-900 tracking-tight">{t('headphoneCheck', lang)}</h2>
          <LanguageToggle />
        </div>
        
        <div className="h-2 w-full overflow-hidden rounded-full bg-blue-200 mb-8">
          <div className="h-full w-3/4 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
        </div>

        <div className="my-6 flex h-40 w-40 items-center justify-center rounded-full border-4 border-white/50 bg-blue-100/50 shadow-2xl backdrop-blur-md animate-bounce-slow">
          <Headphones size={80} className="text-blue-600 drop-shadow-md" />
        </div>

        <div className="glass-panel flex w-full flex-col gap-4 p-6 sm:p-10 border-4 border-white/50 shadow-2xl backdrop-blur-xl">
          {[t('headphonesOn', lang), t('childSeated', lang), t('sittingVeryQuietly', lang)].map((label, i) => (
            <label key={i} className={`flex min-h-[70px] items-center gap-4 rounded-2xl border-2 transition-all duration-300 p-5 text-lg font-bold cursor-pointer ${checks[i] ? 'bg-blue-600/10 border-blue-400 text-blue-900' : 'bg-white/50 border-white/20 text-blue-800/70 hover:bg-white/70'}`}>
              <Checkbox checked={checks[i]} onCheckedChange={() => toggle(i)} className="w-6 h-6 rounded-lg border-2" />
              {label}
            </label>
          ))}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Button 
              variant="outline" 
              className={`h-16 gap-3 rounded-2xl border-2 font-black text-lg transition-all duration-300 ${samplePlayed ? 'bg-emerald-500/10 border-emerald-400 text-emerald-700' : 'bg-white/60 border-blue-200 text-blue-700 hover:bg-white/80'}`} 
              onClick={handlePlaySample}
            >
              <Volume2 size={24} className={samplePlayed ? 'text-emerald-500' : 'text-blue-500'} />
              {t('playSampleTone', lang)}
            </Button>

            <Button 
              variant="outline" 
              className="h-16 gap-3 rounded-2xl border-2 border-blue-400 bg-blue-50 text-blue-700 font-black text-lg hover:bg-blue-100 transition-all"
              onClick={() => {
                // Placeholder for Bluetooth connection logic
                if ('bluetooth' in navigator) {
                  (navigator as any).bluetooth.requestDevice({ acceptAllDevices: true })
                    .then(() => toast({ title: 'Bluetooth Connected' }))
                    .catch((e: any) => console.log(e));
                } else {
                  toast({ title: 'Bluetooth not supported on this browser', variant: 'destructive' });
                }
              }}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                  <path d="M7 7l10 10-5 5V2l5 5L7 17" />
                </svg>
              </div>
              Connect Bluetooth
            </Button>
          </div>
        </div>

        <div className="mt-10 w-full">
          <Button 
            className="h-16 w-full rounded-[2rem] text-xl font-black shadow-2xl transition-all active:scale-95 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/30" 
            disabled={!allChecked} 
            onClick={handleContinue}
          >
            {t('confirmContinue', lang)}
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
