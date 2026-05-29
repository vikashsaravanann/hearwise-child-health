import React, { useEffect } from 'react';
import { motion } from 'react-serif'; // Framer motion is imported as motion from framer-motion
import { motion as framerMotion } from 'framer-motion';
import { 
  X, BarChart, Ear, School, CheckCircle, Telescope, Globe2, Gamepad2, Target, 
  Settings, Headphones, Waves, ClipboardList, Rocket, Heart, Code, 
  Stethoscope, GraduationCap, Mail, Users 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedOwl from '@/components/owl/AnimatedOwl';

export default function AboutHearWiseModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  const fadeUpVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
      {/* Backdrop */}
      <framerMotion.div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal Container — Overhauled with premium high-contrast white background and dark text */}
      <framerMotion.div
        className="relative z-10 flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border-2 border-slate-200/80 bg-white shadow-2xl text-slate-900"
        variants={containerVars}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Close Button — styled with high-contrast slate buttons */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-slate-100 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition"
        >
          <X size={24} />
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 sm:py-12 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300">
          
          {/* SECTION 1 - HERO HEADER with Animated Owl Mascot */}
          <framerMotion.div className="flex flex-col items-center text-center mb-12" variants={fadeUpVars}>
            <div className="mb-4">
              <AnimatedOwl state="excited" size={130} />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-3 tracking-tight">About HearWise</h1>
            <p className="text-xl md:text-2xl text-blue-700 font-bold max-w-2xl">Smart Hearing Care for Every Child in India</p>
            <div className="mt-6 flex gap-2">
              <span className="w-16 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="w-8 h-1.5 bg-cyan-500 rounded-full animate-pulse delay-75"></span>
              <span className="w-4 h-1.5 bg-teal-400 rounded-full animate-pulse delay-150"></span>
            </div>
          </framerMotion.div>

          {/* SECTION 2 - ABOUT THE PROJECT */}
          <framerMotion.section className="mb-14" variants={fadeUpVars} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
              What is HearWise? <span className="text-3xl">👂</span>
            </h2>
            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200/80 text-slate-700 text-lg leading-relaxed shadow-sm">
              <p className="mb-4 font-bold text-slate-800">
                HearWise is a mobile-first, gamified hearing screening web application designed specifically for school children across India — from KG to Grade 12. We make hearing health fun, accessible, and engaging for every child through our Ocean World adventure experience.
              </p>
              <p className="text-slate-600 font-medium">
                Built for school health programs, HearWise enables teachers, school nurses, and healthcare professionals to conduct accurate hearing screenings without expensive equipment — right from a smartphone or tablet.
              </p>
            </div>
          </framerMotion.section>

          {/* SECTION 3 - PROBLEM STATEMENT */}
          <framerMotion.section className="mb-14" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <framerMotion.h2 variants={fadeUpVars} className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <BarChart className="text-blue-600" size={32} /> The Problem We're Solving 🎯
            </framerMotion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <framerMotion.div variants={fadeUpVars} className="bg-rose-50 border-2 border-rose-200/60 rounded-2xl p-6 flex flex-col items-center text-center">
                <Ear className="text-rose-500 mb-3" size={44} />
                <h3 className="text-3xl font-black text-rose-950 mb-1">63 Million</h3>
                <p className="text-rose-800 font-bold text-sm">Children in India affected by hearing loss</p>
              </framerMotion.div>
              <framerMotion.div variants={fadeUpVars} className="bg-amber-50 border-2 border-amber-200/60 rounded-2xl p-6 flex flex-col items-center text-center">
                <School className="text-amber-600 mb-3" size={44} />
                <h3 className="text-3xl font-black text-amber-950 mb-1">80%</h3>
                <p className="text-amber-800 font-bold text-sm">Cases go undetected in rural school children</p>
              </framerMotion.div>
              <framerMotion.div variants={fadeUpVars} className="bg-emerald-50 border-2 border-emerald-200/60 rounded-2xl p-6 flex flex-col items-center text-center">
                <CheckCircle className="text-emerald-600 mb-3" size={44} />
                <h3 className="text-3xl font-black text-emerald-950 mb-1">Early Detection</h3>
                <p className="text-emerald-800 font-bold text-sm">Can prevent permanent hearing damage</p>
              </framerMotion.div>
            </div>
            <framerMotion.div variants={fadeUpVars} className="text-slate-600 font-medium text-base leading-relaxed text-center max-w-4xl mx-auto">
              Most hearing issues in children go undetected until they affect learning and development. Traditional audiometry requires expensive equipment and trained professionals — making it inaccessible for most Indian schools. HearWise bridges this gap with a simple, affordable digital solution.
            </framerMotion.div>
          </framerMotion.section>

          {/* SECTION 4 - OUR VISION */}
          <framerMotion.section className="mb-14" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <framerMotion.h2 variants={fadeUpVars} className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Telescope className="text-blue-600" size={32} /> Our Vision 🌟
            </framerMotion.h2>
            
            <framerMotion.div variants={fadeUpVars} className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-600 rounded-r-2xl p-8 mb-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-[0.05] text-slate-900 transform translate-x-4 -translate-y-4">
                <Globe2 size={120} />
              </div>
              <p className="text-xl text-slate-800 font-bold italic relative z-10 leading-relaxed">
                "A future where every child in India — from the busiest city school to the most remote village classroom — has access to early hearing health screening, ensuring no child's potential is lost to undetected hearing loss."
              </p>
            </framerMotion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <framerMotion.div variants={fadeUpVars} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:bg-slate-100/50 transition">
                <Globe2 className="text-blue-600 mb-3" size={32} />
                <h3 className="text-lg font-black text-slate-900 mb-2">Accessible 🌍</h3>
                <p className="text-slate-600 font-medium text-sm">Works on any smartphone, no special equipment needed. Available in English and Tamil.</p>
              </framerMotion.div>
              <framerMotion.div variants={fadeUpVars} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:bg-slate-100/50 transition">
                <Gamepad2 className="text-indigo-600 mb-3" size={32} />
                <h3 className="text-lg font-black text-slate-900 mb-2">Engaging 🎮</h3>
                <p className="text-slate-600 font-medium text-sm">Gamified Ocean World experience keeps children excited through the entire screening process.</p>
              </framerMotion.div>
              <framerMotion.div variants={fadeUpVars} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:bg-slate-100/50 transition">
                <Target className="text-rose-600 mb-3" size={32} />
                <h3 className="text-lg font-black text-slate-900 mb-2">Accurate 🎯</h3>
                <p className="text-slate-600 font-medium text-sm">5-level clinical hearing test with professional-grade frequency testing for reliable results.</p>
              </framerMotion.div>
            </div>
          </framerMotion.section>

          {/* SECTION 5 - HOW IT WORKS */}
          <framerMotion.section className="mb-14" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <framerMotion.h2 variants={fadeUpVars} className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <Settings className="text-blue-600" size={32} /> How HearWise Works ⚙️
            </framerMotion.h2>
            
            <div className="flex flex-col md:flex-row justify-between relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
              
              {[
                { icon: <School size={24} />, title: "Teacher Sets Up", desc: "Teacher enters school, class, and grade details", color: "from-blue-500 to-blue-600 shadow-blue-500/20" },
                { icon: <Headphones size={24} />, title: "Student Setup", desc: "Child puts on calibrated headphones in quiet space", color: "from-indigo-500 to-indigo-600 shadow-indigo-500/20" },
                { icon: <Waves size={24} />, title: "Ocean Adventure", desc: "Child plays active hearing sweep under LFO wave audio", color: "from-cyan-500 to-cyan-600 shadow-cyan-500/20" },
                { icon: <BarChart size={24} />, title: "Instant Analysis", desc: "Left/right ears checked across frequencies instantly", color: "from-teal-500 to-teal-600 shadow-teal-500/20" },
                { icon: <ClipboardList size={24} />, title: "Clinical Reporting", desc: "Summary reports logged and referrals queued automatically", color: "from-emerald-500 to-emerald-600 shadow-emerald-500/20" }
              ].map((step, idx) => (
                <framerMotion.div key={idx} variants={fadeUpVars} className="relative z-10 flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/5 px-2">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.color} shadow-lg flex items-center justify-center text-white mb-3 border-4 border-white`}>
                    {step.icon}
                  </div>
                  <h3 className="text-slate-900 font-black text-sm mb-1.5 leading-snug">{step.title}</h3>
                  <p className="text-slate-500 text-xs font-semibold">{step.desc}</p>
                </framerMotion.div>
              ))}
            </div>
          </framerMotion.section>

          {/* SECTION 6 - KEY FEATURES */}
          <framerMotion.section className="mb-14" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <framerMotion.h2 variants={fadeUpVars} className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Rocket className="text-blue-600" size={32} /> Key Features 🚀
            </framerMotion.h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[
                { title: "32-Step Clinical PTA", desc: "Rigorous 500-4000Hz sweep for left and right ears", emoji: "🎮" },
                { title: "Animated Owl Mascot", desc: "Active guide changing moods to encourage kids", emoji: "🦉" },
                { title: "Bilingual Support", desc: "Seamless English and Tamil options", emoji: "🌐" },
                { title: "Works Offline", desc: "No active network required for classroom screenings", emoji: "📱" },
                { title: "Badges & Star Rewards", desc: "Gamified awards motivate participation", emoji: "🏆" },
                { title: "Admin Dashboard", desc: "Actionable district and school trends", emoji: "📊" },
                { title: "Calming Ambient Waves", desc: " mixed ocean, bubble pops, and seagulls", emoji: "🌊" },
                { title: "Bilingual Reports", desc: "Immediate clinical parent summaries", emoji: "📄" },
                { title: "Student Privacy", desc: "Strict RLS and client encryption safeguards", emoji: "🔒" }
              ].map((feature, idx) => (
                <framerMotion.div key={idx} variants={fadeUpVars} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 hover:bg-slate-100/50 transition shadow-sm">
                  <div className="text-3xl mb-2">{feature.emoji}</div>
                  <h3 className="text-slate-950 font-black text-base mb-1.5 leading-tight">{feature.title}</h3>
                  <p className="text-slate-600 text-xs font-semibold leading-normal">{feature.desc}</p>
                </framerMotion.div>
              ))}
            </div>
          </framerMotion.section>

          {/* SECTION 7 - OUR MISSION */}
          <framerMotion.section className="mb-14" variants={fadeUpVars} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
              <Heart className="text-rose-500" size={32} /> Our Mission 💙
            </h2>
            <div className="bg-slate-50 border-2 border-slate-200/80 rounded-3xl p-8 text-center shadow-sm">
              <p className="text-xl md:text-2xl text-slate-800 font-black leading-relaxed mb-6">
                "To make professional-grade hearing screening accessible to every school child in India by 2030, using technology, gamification, and community health partnerships to detect and address hearing loss before it impacts a child's education and future."
              </p>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-slate-800/60 font-black text-sm uppercase tracking-wide">
                <span className="flex items-center gap-1.5"><Heart className="text-rose-500" size={16}/> Child First</span>
                <span className="flex items-center gap-1.5"><Globe2 className="text-blue-500" size={16}/> Accessible</span>
                <span className="flex items-center gap-1.5"><Target className="text-green-500" size={16}/> Accurate</span>
                <span className="flex items-center gap-1.5"><Users className="text-orange-500" size={16}/> Community</span>
              </div>
            </div>
          </framerMotion.section>

          {/* SECTION 8 - THE TEAM */}
          <framerMotion.section className="mb-14" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <motion.h2 variants={fadeUpVars} className="text-2xl font-black text-slate-900 mb-4">
              Built With ❤️ For Indian Children
            </motion.h2>
            
            <framerMotion.div variants={fadeUpVars} className="bg-slate-50 rounded-2xl p-6 md:p-8 mb-6 border border-slate-200/80 text-slate-600 font-medium text-base">
              HearWise was created by a passionate team dedicated to improving child health outcomes across India. We combine expertise in healthcare, technology, and education to build tools that make a real difference.
            </framerMotion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <Code size={36} className="text-blue-600" />, name: "Technology Team", role: "Full Stack Development", desc: "Building the digital platform that powers every screening session" },
                { icon: <Stethoscope size={36} className="text-emerald-600" />, name: "Healthcare Advisory", role: "Clinical & Audiological Guidance", desc: "Ensuring clinical accuracy and alignment with WHO hearing standards" },
                { icon: <GraduationCap size={36} className="text-amber-600" />, name: "Education Partners", role: "School Integration & Testing", desc: "Teachers and school health workers who pilot and validate HearWise in real classrooms" }
              ].map((member, idx) => (
                <framerMotion.div key={idx} variants={fadeUpVars} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center hover:bg-slate-100/50 transition shadow-md">
                  <div className="bg-slate-200/60 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-inner">
                    {member.icon}
                  </div>
                  <h3 className="text-lg font-black text-slate-950 mb-1">{member.name}</h3>
                  <p className="text-blue-700 text-xs font-black uppercase tracking-wider mb-3">{member.role}</p>
                  <p className="text-slate-600 text-sm font-semibold leading-normal">{member.desc}</p>
                </framerMotion.div>
              ))}
            </div>
          </framerMotion.section>

          {/* SECTION 9 - CONTACT & FOOTER */}
          <framerMotion.section className="text-center pb-4" variants={fadeUpVars} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <h2 className="text-2xl font-black text-slate-900 mb-3 flex items-center justify-center gap-3">
              Get HearWise In Your School <Mail className="text-blue-600" size={28} />
            </h2>
            <p className="text-slate-600 font-medium text-base max-w-2xl mx-auto mb-6">
              Want to bring HearWise to your school or district? We partner with schools, NGOs, and health departments across Tamil Nadu and beyond.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button onClick={() => window.location.href='mailto:vikash752008@icloud.com'} className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black py-6 px-8 rounded-full text-lg shadow-lg shadow-blue-500/25 transition">
                Book a Demo
              </Button>
              <Button variant="outline" onClick={() => { onClose(); navigate('/help'); }} className="bg-transparent border-2 border-slate-200 text-slate-800 hover:bg-slate-100 font-black py-6 px-8 rounded-full text-lg transition">
                Contact Us
              </Button>
            </div>
            
            <div className="pt-8 border-t border-slate-200/80 text-slate-500 text-xs font-semibold">
              <p className="mb-1 font-bold text-slate-700">🦉 HearWise — Smart Hearing Care for Every Child</p>
              <p className="mb-1">Made with ❤️ in India | English | தமிழ்</p>
              <p className="opacity-60">Version: v2.0 Ocean Edition</p>
            </div>
          </framerMotion.section>
        </div>
      </framerMotion.div>
    </div>
  );
}
