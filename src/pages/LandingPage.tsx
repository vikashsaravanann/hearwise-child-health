import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import LanguageToggle from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { 
  BadgeCheck, 
  Sparkles, 
  Info, 
  Users, 
  Target, 
  MapPin, 
  ArrowRight,
  Shield,
  Zap,
  CheckCircle2
} from 'lucide-react';
import owlMascot from '@/assets/owl-mascot.png';
import oceanFooter from '@/assets/ocean-footer.png';
import AboutHearWiseModal from '@/components/AboutHearWiseModal';

// Animated Bubble Component
const Bubble = ({ size, delay, left }: { size: number, delay: number, left: string }) => (
  <motion.div
    className="absolute bottom-[-20px] rounded-full bg-white/10 backdrop-blur-[2px] border border-white/20"
    style={{ width: size, height: size, left }}
    initial={{ y: 0, opacity: 0 }}
    animate={{ 
      y: -1200, 
      opacity: [0, 0.4, 0.4, 0],
      x: [0, 20, -20, 0]
    }}
    transition={{ 
      duration: 15 + Math.random() * 10, 
      delay, 
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

export default function LandingPage() {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const { lang } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const quickStats = [
    { label: 'National Target', value: '1.5M Schools', icon: <Target className="w-4 h-4 text-cyan-400" /> },
    { label: 'Tamil Nadu Pilot', value: '37,000+ Schools', icon: <MapPin className="w-4 h-4 text-pink-400" /> },
    { label: 'Screening Accuracy', value: '98% Clinical', icon: <Shield className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#000b1d] text-white font-sans selection:bg-cyan-500/30">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#000b1d] via-[#001c3d] to-[#000b1d]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,225,255,0.08),transparent_70%)]" />
        
        {/* Bubbles */}
        {[...Array(20)].map((_, i) => (
          <Bubble 
            key={i} 
            size={10 + Math.random() * 30} 
            delay={i * 1.5} 
            left={`${Math.random() * 100}%`} 
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#000b1d]/80 backdrop-blur-lg border-b border-white/10 py-3' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <img src={owlMascot} alt="Logo" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              HearWise
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Button 
              variant="ghost" 
              className="hidden sm:flex text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => navigate('/explore')}
            >
              Explore
            </Button>
            <Button 
              variant="ghost" 
              className="hidden sm:flex text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Hero Section */}
          <section className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Next-Gen School Screening
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6">
                Protect Every <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Child's Hearing
                </span>
              </h1>
              
              <p className="text-lg text-white/60 max-w-xl leading-relaxed mb-10">
                {t('tagline', lang)} We combine advanced audiology with gamified experiences to make hearing screening accessible for every school in India.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg" 
                  className="h-14 px-8 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-[#000b1d] font-bold text-lg shadow-xl shadow-cyan-500/20 transition-all active:scale-95"
                  onClick={() => navigate('/setup')}
                >
                  {t('startAsTeacher', lang)}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-14 px-8 rounded-2xl border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-lg backdrop-blur-sm transition-all"
                  onClick={() => navigate('/dashboard')}
                >
                  {t('viewDashboard', lang)}
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-14 px-8 rounded-2xl border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-lg backdrop-blur-sm transition-all"
                  onClick={() => navigate('/dashboard')}
                >
                  {t('viewDashboard', lang)}
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-14 px-8 rounded-2xl border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold text-lg backdrop-blur-sm transition-all"
                  onClick={() => navigate('/explore')}
                >
                  Explore All Pages
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {quickStats.map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {stat.icon}
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</span>
                    </div>
                    <div className="text-xl font-black text-white">{stat.value}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-md aspect-square">
                {/* Glow effects */}
                <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute inset-0 bg-blue-600/10 blur-[80px] rounded-full animate-pulse delay-700" />
                
                {/* Mascot Frame */}
                <motion.div 
                  className="relative z-10 w-full h-full rounded-[4rem] border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl p-8 flex items-center justify-center overflow-hidden"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img 
                    src={owlMascot} 
                    alt="Owl Mascot" 
                    className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,225,255,0.4)]"
                  />
                  
                  {/* Floating elements */}
                  <div className="absolute top-10 left-10 w-12 h-12 rounded-full bg-cyan-400/20 backdrop-blur-sm border border-white/20 flex items-center justify-center animate-bounce">
                    <Zap className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="absolute bottom-20 right-5 w-16 h-16 rounded-full bg-blue-500/20 backdrop-blur-sm border border-white/20 flex items-center justify-center animate-bounce delay-300">
                    <BadgeCheck className="w-8 h-8 text-blue-400" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* About Section Trigger */}
          <section className="mt-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-12 rounded-[3rem] bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center gap-10"
            >
              <div className="flex-1">
                <h2 className="text-3xl font-black mb-4">Learn More About Our Mission</h2>
                <p className="text-white/60 leading-relaxed mb-6">
                  Discover how HearWise is transforming childhood health across Tamil Nadu and beyond. Explore our vision, problem statement, and meet the team.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-cyan-400 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" /> Early Detection
                  </span>
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-pink-400 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" /> Rural Reach
                  </span>
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" /> Clinical Accuracy
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setShowAbout(true)}
                className="group relative flex flex-col items-center justify-center w-48 h-48 shrink-0"
              >
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl group-hover:bg-cyan-500/40 transition-all" />
                <div className="relative w-full h-full rounded-full border-2 border-cyan-500/50 bg-[#000b1d] flex flex-col items-center justify-center gap-2 transition-transform group-hover:scale-105 active:scale-95">
                  <Info className="w-10 h-10 text-cyan-400" />
                  <span className="text-sm font-black text-white uppercase tracking-tighter">About Project</span>
                  <ArrowRight className="w-5 h-5 text-cyan-400 mt-1 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                </div>
              </button>
            </motion.div>
          </section>
        </div>
      </main>

      {/* Footer Image */}
      <footer className="relative mt-20 pt-20">
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden pointer-events-none">
          <img 
            src={oceanFooter} 
            alt="Ocean World Footer" 
            className="w-full object-cover min-h-[300px] opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000b1d] via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 text-center border-t border-white/5">
          <div className="flex items-center justify-center gap-3 mb-6 opacity-50 grayscale">
            <img src={owlMascot} alt="Logo" className="w-6 h-6" />
            <span className="font-black tracking-tight">HearWise Technologies</span>
          </div>
          <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] mb-4">
            v2.0 Ocean Edition • Smart Hearing Care for Every Child
          </p>
          <p className="text-white/20 text-[10px]">© 2025 HearWise Technologies Pvt. Ltd. All rights reserved.</p>
        </div>
      </footer>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <AboutHearWiseModal onClose={() => setShowAbout(false)} />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}
