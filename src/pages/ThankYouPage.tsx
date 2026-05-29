import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Heart, Home, UserRoundPlus, Info, Sparkles } from 'lucide-react';
import OceanBackground from '@/components/OceanBackground';
import AnimatedOwl from '@/components/owl/AnimatedOwl';

export default function ThankYouPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, student, session } = useSession();
  
  // Get results from state if passed, otherwise use null
  const results = location.state?.results;

  return (
    <div className="page-shell relative min-h-screen flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none opacity-40 blur-sm">
        <OceanBackground />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl glass-panel p-8 md:p-12 border-4 border-white/50 shadow-2xl backdrop-blur-xl rounded-[3rem] text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-400/20 rounded-full blur-2xl animate-pulse" />
            <AnimatedOwl state="excited" size={120} />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-blue-900 mb-4 tracking-tight">
          Thank You for Visiting!
        </h1>
        
        <div className="bg-white/40 p-6 rounded-3xl border-2 border-white/50 mb-8">
          <p className="text-xl font-bold text-blue-800 mb-2">
            Student: <span className="text-blue-600">{student?.name || '---'}</span>
          </p>
          <p className="text-xl font-bold text-blue-800">
            Teacher: <span className="text-blue-600">{session?.teacherName || '---'}</span>
          </p>
        </div>

        <div className="space-y-6 text-left mb-10">
          <div className="flex gap-4">
            <div className="mt-1 w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-lg">What we are doing</h3>
              <p className="text-blue-800/60 text-sm leading-relaxed">
                HearWise is providing clinical-grade hearing screening to schools across the nation. 
                We use advanced Digital Pure Tone Audiometry to ensure early detection of hearing loss.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1 w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center shrink-0 border border-pink-500/30">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-lg">Importance of the test</h3>
              <p className="text-blue-800/60 text-sm leading-relaxed">
                Early identification is critical. Hearing health directly impacts a child's speech development, 
                academic performance, and social well-being.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1 w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <span className="text-xl">🌊</span>
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-lg">What we have achieved</h3>
              <p className="text-blue-800/60 text-sm leading-relaxed">
                Our gamified "Ocean Edition" has made screening fun and anxiety-free for thousands of children, 
                bridging the gap in childhood healthcare through technology.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            className="h-16 rounded-2xl text-lg font-black shadow-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2"
            onClick={() => {
              if (location.state?.results) {
                navigate('/results', { state: { results: location.state.results } });
              } else if (location.state?.score !== undefined) {
                navigate(`/level-result/${location.state.level}?score=${location.state.score}`);
              } else {
                navigate('/student-entry');
              }
            }}
          >
            <Sparkles className="w-5 h-5" />
            View Results
          </Button>

          <Button 
            variant="outline"
            className="h-16 rounded-2xl text-lg font-black border-2 border-blue-200 bg-white/50 hover:bg-white/80 text-blue-800 transition-all flex items-center justify-center gap-2"
            onClick={() => navigate('/student-entry')}
          >
            <UserRoundPlus className="w-5 h-5" />
            {t('nextStudent', lang)}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
