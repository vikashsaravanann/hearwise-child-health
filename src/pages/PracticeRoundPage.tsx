import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { playSampleTone } from '@/lib/audio';
import OwlIcon from '@/components/OwlIcon';
import LanguageToggle from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

import OceanBackground from '@/components/OceanBackground';

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
    navigate('/ocean-levels');
  };

  return (
    <div className="page-shell relative min-h-screen flex flex-col items-center justify-center">
      <div className="fixed inset-0 pointer-events-none opacity-40 blur-sm">
        <OceanBackground />
      </div>

      <div className="relative z-10 w-full max-w-3xl px-4 flex flex-col items-center">
        <div className="absolute right-0 top-0">
          <LanguageToggle />
        </div>

        <div className="glass-panel w-full p-8 sm:p-12 border-4 border-white/50 shadow-2xl backdrop-blur-xl rounded-[3rem] mt-12">
          <div className="h-2 w-full overflow-hidden rounded-full bg-blue-200 mb-10">
            <div className="h-full w-4/5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
          </div>

          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl animate-pulse" />
              <OwlIcon mood="happy" size={100} />
            </div>
            
            <h2 className="text-3xl font-black text-blue-900 mb-3">{t('practiceRound', lang)}</h2>
            <p className="text-lg text-blue-800/60 font-bold mb-10">{t('tapWhenHear', lang)}</p>

            <button
              onClick={handleTap}
              className={`relative group flex h-48 w-48 items-center justify-center rounded-full border-4 border-white/50 bg-white/30 shadow-2xl transition-all duration-300 ${tapped ? 'scale-110 bg-blue-600/20' : 'hover:scale-105'}`}
            >
              <div className={`h-28 w-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg transition-transform duration-300 ${tapped ? 'scale-125' : 'group-hover:scale-110'}`} />
              <div className="absolute inset-0 rounded-full border-4 border-blue-400/30 animate-ping-slow" />
            </button>

            <Button 
              variant="outline" 
              className={`mt-10 h-16 px-8 rounded-2xl border-2 font-black text-lg transition-all duration-300 ${practicePlayed ? 'bg-emerald-500/10 border-emerald-400 text-emerald-700' : 'bg-white/60 border-blue-200 text-blue-700 hover:bg-white/80'}`} 
              onClick={handlePlayPractice}
            >
              <Volume2 className={`mr-2 w-6 h-6 ${practicePlayed ? 'text-emerald-500' : 'text-blue-500'}`} />
              {t('playPracticeTone', lang)}
            </Button>
          </div>
        </div>

        <div className="mt-12 w-full">
          <Button 
            className="h-16 w-full rounded-[2rem] text-xl font-black shadow-2xl transition-all active:scale-95 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/30" 
            onClick={handleReady}
          >
            {t('imReady', lang)}
            <Sparkles className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping-slow { animation: ping-slow 3s infinite ease-out; }
      `}</style>
    </div>
  );
}
