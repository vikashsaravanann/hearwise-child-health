import React from 'react';
import PageWrapper from '@/components/shared/PageWrapper';
import { useSession } from '@/contexts/SessionContext';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, ShieldAlert, Ear, Zap, Sparkles } from 'lucide-react';
import OceanBackground from '@/components/OceanBackground';

export default function NoiseAwarenessPage() {
  const { lang } = useSession();

  const rules = [
    {
      title: lang === 'ta' ? '60/60 விதி' : 'The 60/60 Rule',
      desc: lang === 'ta' ? '60% ஒலி அளவில் 60 நிமிடங்கள் மட்டுமே கேட்கவும்.' : 'Listen at 60% volume for no more than 60 minutes.',
      icon: <Volume2 className="w-8 h-8 text-blue-400" />,
      color: "from-blue-500/20 to-cyan-500/10"
    },
    {
      title: lang === 'ta' ? 'விலகிச் செல்லுங்கள்' : 'Walk Away',
      desc: lang === 'ta' ? 'சத்தமான இடத்திலிருந்து உடனடியாக விலகிச் செல்லுங்கள்.' : 'If it\'s too loud, move away from the sound source.',
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      color: "from-yellow-500/20 to-orange-500/10"
    },
    {
      title: lang === 'ta' ? 'காதுகளைப் பாதுகாக்கவும்' : 'Protect Your Ears',
      desc: lang === 'ta' ? 'தேவைப்பட்டால் காதுக் கவசங்களைப் பயன்படுத்தவும்.' : 'Use earplugs or earmuffs in very noisy environments.',
      icon: <ShieldAlert className="w-8 h-8 text-red-400" />,
      color: "from-red-500/20 to-rose-500/10"
    }
  ];

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none opacity-40 blur-sm">
        <OceanBackground />
      </div>

      <PageWrapper
        title={lang === 'ta' ? '🔊 சத்தம் விழிப்புணர்வு' : '🔊 Noise Awareness'}
        subtitle={lang === 'ta' ? 'உங்கள் காதுகளைப் பாதுகாப்போம்!' : 'Protect Your Amazing Ears!'}
        owlState="thinking"
        owlSpeech={lang === 'ta' ? 'சத்தமான இடங்களை தவிர்ப்போம்! 🤫' : 'Shhh! Let\'s keep it quiet! 🤫'}
      >
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          
          {/* Hero Content */}
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-3xl sm:text-4xl md:text-6xl font-black text-blue-900 mb-6 leading-tight tracking-tight"
            >
              {lang === 'ta' ? 'அதிக சத்தம் ஆபத்தானது!' : 'Is it Too Loud?'}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-blue-800/60 text-xl max-w-2xl mx-auto font-bold"
            >
              {lang === 'ta'
                ? 'அதிகப்படியான சத்தம் உங்கள் காதுகளை நிரந்தரமாக பாதிக்கும். அதைத் தடுக்க நாம் சில விதிகளைப் பின்பற்றுவோம்!'
                : 'Loud noises can be invisible monsters! Learn how to be a Sound Hero and protect your hearing.'}
            </motion.p>
          </div>

          {/* Rules Grid */}
          <div className="grid md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:p-8 mb-20">
            {rules.map((rule, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className={`p-10 rounded-[3rem] bg-gradient-to-br ${rule.color} border-4 border-white/60 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center`}
              >
                <div className="p-5 rounded-3xl bg-white mb-6 shadow-lg">
                  {rule.icon}
                </div>
                <h3 className="text-2xl font-black text-blue-900 mb-3">{rule.title}</h3>
                <p className="text-blue-800/70 font-bold leading-relaxed">
                  {rule.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Interactive Decibel Scale (Visual Only) */}
          <motion.div 
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="glass-panel p-12 border-4 border-white/60 rounded-[4rem] shadow-3xl bg-white/40 backdrop-blur-xl mb-20"
          >
            <h3 className="text-2xl sm:text-3xl font-black text-blue-900 mb-8 text-center">The Sound Meter</h3>
            <div className="relative h-20 w-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full border-4 border-white shadow-inner overflow-hidden">
               <motion.div 
                 animate={{ x: ['0%', '80%', '40%', '90%', '20%'] }}
                 transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-0 bottom-0 w-2 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10"
               />
               <div className="absolute inset-0 flex items-center justify-between px-8">
                  <span className="text-white font-black text-xs">WHISPER</span>
                  <span className="text-white font-black text-xs">TALKING</span>
                  <span className="text-white font-black text-xs">SHOUTING</span>
                  <span className="text-white font-black text-xs uppercase">Danger!</span>
               </div>
            </div>
            <p className="mt-8 text-center text-blue-800/60 font-bold">
              Stay in the green and yellow zones to keep your ears happy! 🐚
            </p>
          </motion.div>

          {/* Final CTA */}
          <div className="text-center pb-20">
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="px-12 py-6 rounded-[2.5rem] bg-blue-600 text-white text-2xl font-black shadow-2xl hover:bg-blue-700 transition-all flex items-center gap-3 mx-auto"
             >
               <Sparkles />
               {lang === 'ta' ? 'விளையாட்டைத் தொடங்கு' : 'Play Sound Hero Game'}
             </motion.button>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}

