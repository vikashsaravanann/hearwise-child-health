import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, BarChart, Ear, School, CheckCircle, Telescope, Globe2, Gamepad2, Target, Settings, Headphones, Waves, ClipboardList, Rocket, Heart, Code, Stethoscope, GraduationCap, Mail } from 'lucide-react';
import owlMascot from '@/assets/owl-mascot.png';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
      <motion.div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        className="relative z-10 flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-br from-blue-900 via-slate-900 to-cyan-900 shadow-2xl"
        variants={containerVars}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition hover:bg-white/20"
        >
          <X size={24} />
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 sm:py-12 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20">
          
          {/* SECTION 1 - HERO HEADER */}
          <motion.div className="flex flex-col items-center text-center mb-16" variants={fadeUpVars}>
            <img src={owlMascot} alt="HearWise Owl Mascot" className="w-32 h-32 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">About HearWise</h1>
            <p className="text-xl md:text-2xl text-cyan-200 font-medium max-w-2xl">Smart Hearing Care for Every Child in India</p>
            <div className="mt-8 flex gap-2">
              <span className="w-16 h-1 bg-cyan-400 rounded-full animate-pulse"></span>
              <span className="w-8 h-1 bg-blue-400 rounded-full animate-pulse delay-75"></span>
              <span className="w-4 h-1 bg-cyan-300 rounded-full animate-pulse delay-150"></span>
            </div>
          </motion.div>

          {/* SECTION 2 - ABOUT THE PROJECT */}
          <motion.section className="mb-16" variants={fadeUpVars} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              What is HearWise? <span className="text-4xl">🦉</span>
            </h2>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10 text-slate-200 text-lg leading-relaxed shadow-lg">
              <p className="mb-4">
                HearWise is a mobile-first, gamified hearing screening web application designed specifically for school children across India — from KG to Grade 12. We make hearing health fun, accessible, and engaging for every child through our Ocean World adventure experience.
              </p>
              <p>
                Built for school health programs, HearWise enables teachers, school nurses, and healthcare professionals to conduct accurate hearing screenings without expensive equipment — right from a smartphone or tablet.
              </p>
            </div>
          </motion.section>

          {/* SECTION 3 - PROBLEM STATEMENT */}
          <motion.section className="mb-16" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <motion.h2 variants={fadeUpVars} className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <BarChart className="text-cyan-400" size={36} /> The Problem We're Solving 🎯
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div variants={fadeUpVars} className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-2xl p-6 flex flex-col items-center text-center">
                <Ear className="text-red-400 mb-4" size={48} />
                <h3 className="text-3xl font-black text-white mb-2">63 Million</h3>
                <p className="text-red-200">Children in India affected by hearing loss</p>
              </motion.div>
              <motion.div variants={fadeUpVars} className="bg-gradient-to-br from-orange-500/20 to-amber-600/20 border border-orange-500/30 rounded-2xl p-6 flex flex-col items-center text-center">
                <School className="text-orange-400 mb-4" size={48} />
                <h3 className="text-3xl font-black text-white mb-2">80%</h3>
                <p className="text-orange-200">Cases go undetected in rural school children</p>
              </motion.div>
              <motion.div variants={fadeUpVars} className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6 flex flex-col items-center text-center">
                <CheckCircle className="text-green-400 mb-4" size={48} />
                <h3 className="text-3xl font-black text-white mb-2">Early Detection</h3>
                <p className="text-green-200">Can prevent permanent hearing damage</p>
              </motion.div>
            </div>
            <motion.div variants={fadeUpVars} className="text-slate-300 text-lg leading-relaxed text-center max-w-4xl mx-auto">
              Most hearing issues in children go undetected until they affect learning and development. Traditional audiometry requires expensive equipment and trained professionals — making it inaccessible for most Indian schools. HearWise bridges this gap with a simple, affordable digital solution.
            </motion.div>
          </motion.section>

          {/* SECTION 4 - OUR VISION */}
          <motion.section className="mb-16" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <motion.h2 variants={fadeUpVars} className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <Telescope className="text-cyan-400" size={36} /> Our Vision 🌟
            </motion.h2>
            
            <motion.div variants={fadeUpVars} className="bg-gradient-to-r from-blue-600/40 to-cyan-600/40 border-l-4 border-cyan-400 rounded-r-2xl p-8 mb-10 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                <Globe2 size={120} />
              </div>
              <p className="text-xl md:text-2xl text-white font-medium italic relative z-10 leading-relaxed">
                "A future where every child in India — from the busiest city school to the most remote village classroom — has access to early hearing health screening, ensuring no child's potential is lost to undetected hearing loss."
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={fadeUpVars} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
                <Globe2 className="text-blue-400 mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-3">Accessible 🌍</h3>
                <p className="text-slate-300">Works on any smartphone, no special equipment needed. Available in English and Tamil.</p>
              </motion.div>
              <motion.div variants={fadeUpVars} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
                <Gamepad2 className="text-purple-400 mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-3">Engaging 🎮</h3>
                <p className="text-slate-300">Gamified Ocean World experience keeps children excited through the entire screening process.</p>
              </motion.div>
              <motion.div variants={fadeUpVars} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
                <Target className="text-rose-400 mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-3">Accurate 🎯</h3>
                <p className="text-slate-300">5-level clinical hearing test with professional-grade frequency testing for reliable results.</p>
              </motion.div>
            </div>
          </motion.section>

          {/* SECTION 5 - HOW IT WORKS */}
          <motion.section className="mb-16" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <motion.h2 variants={fadeUpVars} className="text-3xl font-bold text-white mb-10 flex items-center gap-3">
              <Settings className="text-cyan-400" size={36} /> How HearWise Works ⚙️
            </motion.h2>
            
            <div className="flex flex-col md:flex-row justify-between relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 z-0"></div>
              
              {[
                { icon: <School size={28} />, title: "Teacher Sets Up Session", desc: "Teacher enters class details and student list", color: "from-blue-500 to-blue-600" },
                { icon: <Headphones size={28} />, title: "Student Wears Headphones", desc: "Child puts on standard headphones", color: "from-indigo-500 to-indigo-600" },
                { icon: <Waves size={28} />, title: "Ocean World Adventure Begins", desc: "Child plays through 5 levels of hearing games", color: "from-cyan-500 to-cyan-600" },
                { icon: <BarChart size={28} />, title: "Instant Results Generated", desc: "Left and right ear results analysed immediately", color: "from-teal-500 to-teal-600" },
                { icon: <ClipboardList size={28} />, title: "Teacher Gets Full Report", desc: "Detailed report with referral recommendations", color: "from-emerald-500 to-emerald-600" }
              ].map((step, idx) => (
                <motion.div key={idx} variants={fadeUpVars} className="relative z-10 flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/5 px-2">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} shadow-lg flex items-center justify-center text-white mb-4 border-4 border-slate-900`}>
                    {step.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* SECTION 6 - KEY FEATURES */}
          <motion.section className="mb-16" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <motion.h2 variants={fadeUpVars} className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <Rocket className="text-cyan-400" size={36} /> Key Features 🚀
            </motion.h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[
                { title: "5-Level Gamified Test", desc: "Ocean World adventure keeps kids engaged", emoji: "🎮" },
                { title: "Animated Owl Mascot", desc: "Friendly guide through every step", emoji: "🦉" },
                { title: "Bilingual Support", desc: "English and Tamil language options", emoji: "🌐" },
                { title: "Works Offline", desc: "No internet needed during testing", emoji: "📱" },
                { title: "Badges & Certificates", desc: "Virtual rewards motivate participation", emoji: "🏆" },
                { title: "Admin Dashboard", desc: "Real-time school-wide monitoring", emoji: "📊" },
                { title: "12 Learning Pages", desc: "Ear care education for KG to Grade 12", emoji: "🎓" },
                { title: "PDF Reports", desc: "Downloadable certificates and reports", emoji: "📄" },
                { title: "Student Privacy", desc: "Secure data handling for all students", emoji: "🔒" }
              ].map((feature, idx) => (
                <motion.div key={idx} variants={fadeUpVars} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition shadow-sm">
                  <div className="text-3xl mb-3">{feature.emoji}</div>
                  <h3 className="text-white font-bold text-lg mb-2 leading-tight">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-snug">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* SECTION 7 - OUR MISSION */}
          <motion.section className="mb-16" variants={fadeUpVars} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Heart className="text-rose-400" size={36} /> Our Mission 💙
            </h2>
            <div className="bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/30 rounded-3xl p-8 text-center shadow-xl">
              <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-8">
                "To make professional-grade hearing screening accessible to every school child in India by 2030, using technology, gamification, and community health partnerships to detect and address hearing loss before it impacts a child's education and future."
              </p>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-cyan-200 font-bold text-lg">
                <span className="flex items-center gap-2"><Heart className="text-rose-400" size={20}/> Child First</span>
                <span className="flex items-center gap-2"><Globe2 className="text-blue-400" size={20}/> Accessible</span>
                <span className="flex items-center gap-2"><Target className="text-green-400" size={20}/> Accurate</span>
                <span className="flex items-center gap-2"><Users className="text-orange-400" size={20}/> Community</span>
              </div>
            </div>
          </motion.section>

          {/* SECTION 8 - THE TEAM */}
          <motion.section className="mb-16" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <motion.h2 variants={fadeUpVars} className="text-3xl font-bold text-white mb-6">
              Built With ❤️ For Indian Children
            </motion.h2>
            
            <motion.div variants={fadeUpVars} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mb-8 border border-white/10 text-slate-200 text-lg">
              HearWise was created by a passionate team dedicated to improving child health outcomes across India. We combine expertise in healthcare, technology, and education to build tools that make a real difference.
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <Code size={40} className="text-blue-400" />, name: "Technology Team", role: "Full Stack Development", desc: "Building the digital platform that powers every screening session" },
                { icon: <Stethoscope size={40} className="text-emerald-400" />, name: "Healthcare Advisory", role: "Clinical & Audiological Guidance", desc: "Ensuring clinical accuracy and alignment with WHO hearing standards" },
                { icon: <GraduationCap size={40} className="text-amber-400" />, name: "Education Partners", role: "School Integration & Testing", desc: "Teachers and school health workers who pilot and validate HearWise in real classrooms" }
              ].map((member, idx) => (
                <motion.div key={idx} variants={fadeUpVars} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition shadow-lg backdrop-blur-sm">
                  <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                    {member.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-cyan-400 text-sm font-semibold mb-4">{member.role}</p>
                  <p className="text-slate-300 text-sm">{member.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* SECTION 9 - CONTACT & FOOTER */}
          <motion.section className="text-center pb-8" variants={fadeUpVars} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              Get HearWise In Your School <Mail className="text-cyan-400" size={32} />
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
              Want to bring HearWise to your school or district? We partner with schools, NGOs, and health departments across Tamil Nadu and beyond.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Button onClick={() => window.location.href='mailto:vikash752008@icloud.com'} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-6 px-8 rounded-full text-lg shadow-lg shadow-cyan-500/30">
                Book a Demo
              </Button>
              <Button variant="outline" onClick={() => { onClose(); navigate('/help'); }} className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-bold py-6 px-8 rounded-full text-lg">
                Contact Us
              </Button>
            </div>
            
            <div className="pt-8 border-t border-white/10 text-slate-400 text-sm">
              <p className="mb-2 font-medium text-slate-300">🦉 HearWise — Smart Hearing Care for Every Child</p>
              <p className="mb-2">Made with ❤️ in India | English | தமிழ்</p>
              <p className="opacity-60">Version: v2.0 Ocean Edition</p>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
}
