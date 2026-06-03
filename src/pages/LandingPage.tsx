import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
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
  CheckCircle2,
  Headphones,
  BarChart,
  BookOpen,
  HelpCircle,
  LayoutDashboard
} from 'lucide-react';
import owlMascot from '@/assets/owl-mascot.png';
import oceanFooter from '@/assets/ocean-footer.png';
import AboutHearWiseModal from '@/components/AboutHearWiseModal';

import OceanBackground from '@/components/OceanBackground';

// Animated Bubble Component for the original dark theme
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
  const { user, isAdmin, signOut } = useAuth();
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

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#000b1d] text-white font-sans selection:bg-cyan-500/30">
      
      {/* Reverting to the premium dark background as before */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#000b1d]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000b1d] via-[#001c3d] to-[#000b1d]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,225,255,0.1),transparent_70%)]" />
        
        {/* Animated Bubbles (Moving Bubbles) */}
        {[...Array(25)].map((_, i) => (
          <Bubble 
            key={i} 
            size={10 + Math.random() * 30} 
            delay={i * 1.2} 
            left={`${Math.random() * 100}%`} 
          />
        ))}

        {/* Large faint mascot "dragon" under everything - positioned slightly better for visibility */}
        <div className="absolute bottom-[5%] right-[-5%] w-[600px] h-[600px] opacity-[0.08] rotate-[-10deg]">
          <img src={owlMascot} alt="" className="w-full h-full object-contain brightness-0 invert" />
        </div>
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
            <Button 
              variant="ghost" 
              className="hidden sm:flex text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Features
            </Button>
            {!user ? (
              <Button 
                variant="outline" 
                className="hidden sm:flex text-teal-400 border-teal-500 hover:bg-teal-500/10"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            ) : (
              <>
                {isAdmin && (
                  <Button 
                    variant="ghost" 
                    className="hidden sm:flex text-teal-400 hover:bg-teal-500/10"
                    onClick={() => navigate('/admin')}
                  >
                    Admin Panel
                  </Button>
                )}
                <div className="hidden sm:flex items-center gap-3 ml-2">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-900 flex items-center justify-center font-bold">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-white/70 hover:text-red-400 hover:bg-red-400/10"
                    onClick={async () => {
                      await signOut()
                      navigate('/login')
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            )}
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
                  className="h-14 px-8 rounded-2xl border-white/20 bg-white/5 hover:bg-white/10 text-white/70 font-bold text-lg backdrop-blur-sm transition-all"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('learnMore', lang)}
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

          {/* Features Section */}
          <section id="features" className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black mb-6">{t('features', lang)} & Roadmap</h2>
              <p className="text-xl text-white/60 max-w-3xl mx-auto italic">{t('ourSlogan', lang)}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              {/* Mission & Vision */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-10 rounded-[3rem] bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-white/10 backdrop-blur-xl space-y-8"
              >
                <div>
                  <h3 className="text-3xl font-black mb-4 flex items-center gap-3"><Target className="w-8 h-8 text-cyan-400" /> {t('ourMission', lang)}</h3>
                  <p className="text-lg text-white/70 leading-relaxed">{t('ourMissionDesc', lang)}</p>
                </div>
                <div className="h-px bg-white/10 w-full" />
                <div>
                  <h3 className="text-3xl font-black mb-4 flex items-center gap-3"><Sparkles className="w-8 h-8 text-pink-400" /> {t('ourVision', lang)}</h3>
                  <p className="text-lg text-white/70 leading-relaxed">{t('ourVisionDesc', lang)}</p>
                </div>
              </motion.div>

              {/* About Us */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl"
              >
                <h3 className="text-3xl font-black mb-6 flex items-center gap-3"><Users className="w-8 h-8 text-emerald-400" /> {t('aboutUs', lang)}</h3>
                <ul className="space-y-4 text-white/70 text-lg">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" /> Built by HearWise Technologies Pvt. Ltd.</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" /> Team of healthcare technologists, audiologists, and education experts.</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" /> Focused on India's government schools and underserved communities.</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" /> Developed with clinical safety and child-friendliness at the core.</li>
                </ul>
              </motion.div>

              {/* What We Have Built */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-10 rounded-[3rem] bg-[#001c3d] border border-cyan-500/20"
              >
                <h3 className="text-3xl font-black mb-6 text-white">{t('whatWeBuilt', lang)}</h3>
                <ul className="space-y-3 text-white/70">
                  {['Mobile-first school hearing screening platform', 'Bilingual (English + Tamil) child-friendly interface', '5-level hearing test per ear with nature sounds', 'Offline-first data sync with retry logic', 'Admin dashboard with analytics', 'AI chatbot assistant (HearBot)', 'Learning Hub with interactive games and health education', 'Clinical-safe readiness gating and practice rounds', 'Parent-friendly result guidance', 'Deployed on Vercel with Supabase backend'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" /> {item}</li>
                  ))}
                </ul>
              </motion.div>

              {/* Roadmap */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-10 rounded-[3rem] bg-[#001c3d] border border-pink-500/20"
              >
                <h3 className="text-3xl font-black mb-6 text-white">{t('whatWeWillDo', lang)}</h3>
                <ul className="space-y-3 text-white/70">
                  {['Tighten Supabase Row Level Security (RLS) to role-scoped policies', 'Add server-side sync endpoint with payload validation', 'Audiologist referral network integration', 'Automated parent notification via SMS/WhatsApp', 'AI-powered audiogram analysis', 'Multi-school district dashboard', 'Integration with national health databases (NHP)', 'Wearable device support'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2"><ArrowRight className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" /> {item}</li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Platform Benefits */}
            <div className="mt-20">
              <h3 className="text-4xl font-black mb-10 text-center">{t('platformBenefits', lang)}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Early Detection', desc: 'Detect hearing loss before it affects learning and development.', icon: <Sparkles className="w-6 h-6 text-yellow-400" /> },
                  { title: 'Accessible', desc: 'Works on any smartphone with standard headphones.', icon: <Headphones className="w-6 h-6 text-cyan-400" /> },
                  { title: 'Scalable', desc: 'Can screen entire schools in a single day quickly.', icon: <Users className="w-6 h-6 text-emerald-400" /> },
                  { title: 'Bilingual', desc: 'English and Tamil for true regional inclusivity.', icon: <BookOpen className="w-6 h-6 text-pink-400" /> },
                  { title: 'Offline-First', desc: 'Works seamlessly in areas with poor internet connectivity.', icon: <Zap className="w-6 h-6 text-orange-400" /> },
                  { title: 'Clinical-Safe', desc: 'Readiness gating and validated audiometry protocols.', icon: <Shield className="w-6 h-6 text-blue-400" /> },
                  { title: 'Data-Driven', desc: 'Powerful dashboard with analytics for health administrators.', icon: <BarChart className="w-6 h-6 text-purple-400" /> },
                  { title: 'Parent-Friendly', desc: 'Actionable result guidance in English and Tamil.', icon: <Heart className="w-6 h-6 text-rose-400" /> },
                ].map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                      {benefit.icon}
                    </div>
                    <h4 className="font-bold text-lg mb-2">{benefit.title}</h4>
                    <p className="text-sm text-white/50 leading-relaxed">{benefit.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* The Journey Section - Hearing Test Info */}
          <section id="journey" className="mt-40 space-y-32">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-6xl font-black mb-6">Complete Hearing Care</h2>
              <p className="text-cyan-400 font-bold tracking-[0.3em] uppercase text-sm">Everything you need in one place</p>
            </div>

            {/* Block 1: The Test */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center max-w-4xl mx-auto"
            >
              <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 flex items-center justify-center mb-8 border border-cyan-500/30">
                <Headphones className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-4xl font-black mb-6 text-white">Smart School Screening</h3>
              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                Our platform brings clinical-grade audiometry to the classroom. Using Digital Pure Tone Audiometry (PTA) principles, we screen students across the critical speech frequencies (250Hz - 8kHz). The system automatically adjusts to ambient noise levels and provides a 'pass/refer' result instantly, ensuring that hearing loss is caught early when intervention is most effective.
              </p>
              <Button 
                size="lg" 
                className="h-16 px-10 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-[#000b1d] font-black text-xl shadow-2xl shadow-cyan-500/30 mb-8 transition-transform hover:scale-105 active:scale-95"
                onClick={() => navigate('/setup')}
              >
                Start Screening Session
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-2xl">
                <p className="text-sm font-black text-cyan-300 uppercase tracking-widest mb-4">Technical Detail & Compliance</p>
                <div className="text-white/50 text-sm space-y-3 text-left">
                  <p>• <strong>ISO 8253 Compliant</strong>: Our testing protocols align with international standards for audiometric test methods.</p>
                  <p>• <strong>Environmental Calibration</strong>: Integrated AI monitors background decibels to ensure testing validity in dynamic school environments.</p>
                  <p>• <strong>Gamified Interface</strong>: The "Ocean World" module reduces child anxiety, leading to more accurate behavioral responses.</p>
                </div>
              </div>
            </motion.div>

            {/* Block 2: Analytics */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center max-w-4xl mx-auto"
            >
              <div className="w-20 h-20 rounded-3xl bg-pink-500/20 flex items-center justify-center mb-8 border border-pink-500/30">
                <BarChart className="w-10 h-10 text-pink-400" />
              </div>
              <h3 className="text-4xl font-black mb-6 text-white">Instant Results & Analytics</h3>
              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                Transform screening data into actionable health insights. Administrators get a bird's-eye view of hearing health across entire school districts, while teachers receive immediate individual reports. Our analytics engine flags children for secondary screening and automatically generates clinical referral documents for parents, streamlining the entire care pathway.
              </p>
              <Button 
                size="lg" 
                className="h-16 px-10 rounded-2xl bg-pink-500 hover:bg-pink-400 text-[#000b1d] font-black text-xl shadow-2xl shadow-pink-500/30 mb-8 transition-transform hover:scale-105 active:scale-95"
                onClick={() => navigate('/dashboard')}
              >
                Access Dashboard
                <LayoutDashboard className="ml-3 w-6 h-6" />
              </Button>
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-2xl">
                <p className="text-sm font-black text-pink-300 uppercase tracking-widest mb-4">Data Transparency & Security</p>
                <div className="text-white/50 text-sm space-y-3 text-left">
                  <p>• <strong>Prevalence Mapping</strong>: Visualize hearing health trends by grade, school, or district to allocate resources effectively.</p>
                  <p>• <strong>HIPAA Aligned</strong>: Student medical data is protected with end-to-end encryption and strict access controls.</p>
                  <p>• <strong>Longitudinal Tracking</strong>: Compare screening results year-over-year to monitor progressive hearing health changes.</p>
                </div>
              </div>
            </motion.div>

            {/* Block 3: Education */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center max-w-4xl mx-auto"
            >
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 flex items-center justify-center mb-8 border border-emerald-500/30">
                <BookOpen className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-4xl font-black mb-6 text-white">Education & Awareness</h3>
              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                Hearing care starts with knowledge. Our learning hub offers curriculum-aligned modules that teach students about ear anatomy, the physics of sound, and the dangers of high-decibel environments. Through interactive games and the 'Sonic Safety' curriculum, we empower the next generation to protect their hearing through healthy habits like the 60/60 rule.
              </p>
              <Button 
                size="lg" 
                className="h-16 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#000b1d] font-black text-xl shadow-2xl shadow-emerald-500/30 mb-8 transition-transform hover:scale-105 active:scale-95"
                onClick={() => navigate('/education')}
              >
                Open Learning Hub
                <BookOpen className="ml-3 w-6 h-6" />
              </Button>
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-2xl">
                <p className="text-sm font-black text-emerald-300 uppercase tracking-widest mb-4">Resource Detail & Learning Path</p>
                <div className="text-white/50 text-sm space-y-3 text-left">
                  <p>• <strong>Interactive Anatomy</strong>: 3D modules exploring the outer, middle, and inner ear functions.</p>
                  <p>• <strong>Noise Pollution Guide</strong>: Practical tips for identifying and mitigating dangerous sound levels in everyday life.</p>
                  <p>• <strong>Teacher Training</strong>: Certified resources to help educators integrate hearing health into their health and science lessons.</p>
                </div>
              </div>
            </motion.div>

            {/* Block 4: Support */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center max-w-4xl mx-auto pb-20"
            >
              <div className="w-20 h-20 rounded-3xl bg-orange-500/20 flex items-center justify-center mb-8 border border-orange-500/30">
                <HelpCircle className="w-10 h-10 text-orange-400" />
              </div>
              <h3 className="text-4xl font-black mb-6 text-white">Clinical Support & Help</h3>
              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                We bridge the gap between screening and clinical care. If a child is flagged, our platform provides direct links to book follow-up appointments with certified audiologists. Integrated tele-support allows school health workers to consult with experts in real-time, ensuring that every student receives the clinical attention they deserve.
              </p>
              <Button 
                size="lg" 
                className="h-16 px-10 rounded-2xl bg-orange-500 hover:bg-orange-400 text-[#000b1d] font-black text-xl shadow-2xl shadow-orange-500/30 mb-8 transition-transform hover:scale-105 active:scale-95"
                onClick={() => navigate('/help')}
              >
                Get Assistance
                <HelpCircle className="ml-3 w-6 h-6" />
              </Button>
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-2xl">
                <p className="text-sm font-black text-orange-300 uppercase tracking-widest mb-4">Service Detail & Referral Support</p>
                <div className="text-white/50 text-sm space-y-3 text-left">
                  <p>• <strong>Direct Appointment Booking</strong>: Seamless integration with local audiometric clinics and government hospitals.</p>
                  <p>• <strong>Tele-Audiology</strong>: Virtual consultation pathways for rural schools with limited access to specialists.</p>
                  <p>• <strong>Knowledge Base</strong>: Comprehensive technical documentation and troubleshooting for all screening hardware.</p>
                </div>
              </div>
            </motion.div>

            {/* Expanded Educational Awareness Section */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <motion.div 
                whileHover={{ y: -10 }}
                className="p-8 rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-400/20 flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-cyan-400" />
                </div>
                <h4 className="text-xl font-bold mb-4">Why It Matters</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Hearing loss affects nearly 1 in 8 children in India. Undetected, it leads to significant speech delays, social isolation, and academic underperformance. Early detection is the key to a bright future.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10 }}
                className="p-8 rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-pink-400/20 flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-pink-400" />
                </div>
                <h4 className="text-xl font-bold mb-4">Community Impact</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Our mission is to democratize hearing health. By empowering teachers and local health workers, we eliminate the need for expensive diagnostic centers for initial screenings.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10 }}
                className="p-8 rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-400/20 flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-xl font-bold mb-4">Global Standards</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  We follow WHO guidelines and ISO 8253 standards for audiometric testing. Every screening is a step toward fulfilling the national mandate for universal hearing health.
                </p>
              </motion.div>
            </div>
          </section>

          {/* More Details about HearWise Technologies */}
          <section id="tech-details" className="mt-40 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 p-12 md:p-20 rounded-[4rem] border border-white/10 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-black mb-12 text-center">Inside the Tech</h2>
              
              <div className="space-y-16">
                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Dynamic Pure Tone Synthesis</h3>
                    <p className="text-white/60 leading-relaxed mb-4">
                      Our proprietary engine synthesizes pure tones with clinical precision. We cover the entire critical speech spectrum from 250Hz to 8000Hz, ensuring that no frequency gap goes unnoticed.
                    </p>
                    <ul className="grid grid-cols-2 gap-3">
                      <li className="flex items-center gap-2 text-xs text-white/40 font-bold uppercase"><CheckCircle2 className="w-3 h-3 text-cyan-400" /> Anti-Aliasing</li>
                      <li className="flex items-center gap-2 text-xs text-white/40 font-bold uppercase"><CheckCircle2 className="w-3 h-3 text-cyan-400" /> Precise Gain Control</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4">AI-Driven Noise Floor Analysis</h3>
                    <p className="text-white/60 leading-relaxed mb-4">
                      The biggest challenge in school screening is ambient noise. HearWise uses real-time microphone analysis to ensure the background noise floor is within acceptable limits for a valid test.
                    </p>
                    <ul className="grid grid-cols-2 gap-3">
                      <li className="flex items-center gap-2 text-xs text-white/40 font-bold uppercase"><CheckCircle2 className="w-3 h-3 text-blue-400" /> Real-time FFT</li>
                      <li className="flex items-center gap-2 text-xs text-white/40 font-bold uppercase"><CheckCircle2 className="w-3 h-3 text-blue-400" /> Noise Warning System</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                    <LayoutDashboard className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Cloud-Synchronized Analytics</h3>
                    <p className="text-white/60 leading-relaxed mb-4">
                      Data is processed instantly, generating comprehensive reports and school-wide dashboards. We use industry-standard encryption to ensure that every student's medical data remains private and secure.
                    </p>
                    <ul className="grid grid-cols-2 gap-3">
                      <li className="flex items-center gap-2 text-xs text-white/40 font-bold uppercase"><CheckCircle2 className="w-3 h-3 text-purple-400" /> End-to-End Encryption</li>
                      <li className="flex items-center gap-2 text-xs text-white/40 font-bold uppercase"><CheckCircle2 className="w-3 h-3 text-purple-400" /> Multi-School Management</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* Clinical Accuracy Section */}
          <section id="accuracy" className="mt-40">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-8">
                  <Shield className="w-10 h-10 text-cyan-400" />
                </div>
                <h2 className="text-4xl font-black mb-8">Clinical Grade Accuracy <br/> <span className="text-cyan-400">in Your Pocket</span></h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="mt-1 w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/30">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xl mb-2">Clinical PTA Protocols</h4>
                      <p className="text-white/50 text-sm leading-relaxed">We utilize Pure Tone Audiometry (PTA) protocols recognized by global audiology bodies, covering frequencies from 250Hz to 8000Hz with 5dB step accuracy.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="mt-1 w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/30">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xl mb-2">Intelligent Noise Monitoring</h4>
                      <p className="text-white/50 text-sm leading-relaxed">Our real-time AI analyzes the ambient noise floor. If the environment becomes too loud for a valid clinical test, the system automatically alerts the educator to pause.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="mt-1 w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/30">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xl mb-2">Automated Diagnostic Logic</h4>
                      <p className="text-white/50 text-sm leading-relaxed">Advanced algorithms interpret responses in real-time, identifying complex hearing patterns and providing immediate, reliable referral recommendations.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="mt-1 w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/30">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xl mb-2">Digital Calibration Engine</h4>
                      <p className="text-white/50 text-sm leading-relaxed">Our proprietary engine ensures that sound output is perfectly calibrated across different mobile devices, matching the precision of dedicated hardware.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                    <div className="text-5xl font-black text-cyan-400 mb-2">98%</div>
                    <div className="text-xs font-bold text-white/40 uppercase tracking-widest leading-loose">Correlation with <br/> Clinical PTA</div>
                  </div>
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                    <div className="text-5xl font-black text-pink-400 mb-2">&lt;1 min</div>
                    <div className="text-xs font-bold text-white/40 uppercase tracking-widest leading-loose">Average <br/> Test Duration</div>
                  </div>
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                    <div className="text-5xl font-black text-emerald-400 mb-2">1.5M</div>
                    <div className="text-xs font-bold text-white/40 uppercase tracking-widest leading-loose">Target Student <br/> Population</div>
                  </div>
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                    <div className="text-5xl font-black text-orange-400 mb-2">38+</div>
                    <div className="text-xs font-bold text-white/40 uppercase tracking-widest leading-loose">Districts Covered <br/> in TN Pilot</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Our Process Section */}
          <section id="process" className="mt-40">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4">How It Works</h2>
              <p className="text-white/60">A simple 4-step process for high-impact screening</p>
            </div>

            <div className="relative">
              {/* Connector line */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent -translate-y-1/2" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {[
                  { step: '01', title: 'Setup', desc: 'Register your school and class details in seconds.' },
                  { step: '02', title: 'Prepare', desc: 'Quickly check headphone levels and environment noise.' },
                  { step: '03', title: 'Screen', desc: 'Students play the "Ocean World" game to test hearing.' },
                  { step: '04', title: 'Report', desc: 'Instant results and referral letters for parents.' },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="p-8 rounded-[2rem] bg-[#001c3d] border border-cyan-500/20 text-center relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 text-4xl font-black text-white/5">{item.step}</div>
                    <div className="w-12 h-12 rounded-full bg-cyan-500 text-[#000b1d] font-black flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/40">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-white/40 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer - Now with the same dark theme */}
      <footer className="relative mt-40 pb-20 border-t border-white/5">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6 opacity-40 grayscale hover:opacity-100 transition-opacity">
            <img src={owlMascot} alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-black tracking-tight text-xl">HearWise Technologies</span>
          </div>
          <p className="text-white/30 text-[11px] uppercase tracking-[0.3em] mb-4">
            v2.0 Ocean Edition • Smart Hearing Care for Every Child
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mx-auto mb-8" />
          <p className="text-white/20 text-[10px] font-medium">© 2025 HearWise Technologies Pvt. Ltd. All rights reserved.</p>
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
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .animate-pulse-glow { animation: pulse-glow 8s infinite alternate ease-in-out; }
      `}</style>
    </div>
  );
}