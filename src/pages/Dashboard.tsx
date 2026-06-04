import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// ─── Animated counter hook ───────────────────────────────
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return { count, ref };
}

// ─── Section reveal animation ────────────────────────────
function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────
export default function Dashboard() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Guard
  useEffect(() => {
    if (!isAdmin) navigate('/', { replace: true });
  }, [isAdmin, navigate]);

  const SIDEBAR_TABS = [
    { id: 'overview', icon: '⚡', label: 'OVERVIEW' },
    { id: 'founder', icon: '👤', label: 'FOUNDER' },
    { id: 'analytics', icon: '📊', label: 'ANALYTICS' },
    { id: 'platform', icon: '🦉', label: 'PLATFORM' },
    { id: 'settings', icon: '⚙️', label: 'SETTINGS' },
  ];

  // ── STAT CARDS DATA ──────────────────────────────────
  const { count: childrenCount, ref: childrenRef } = useCounter(1247);
  const { count: schoolsCount, ref: schoolsRef } = useCounter(38);
  const { count: detectedCount, ref: detectedRef } = useCounter(94);
  const { count: certsCount, ref: certsRef } = useCounter(15);

  return (
    <div className="min-h-screen bg-[#020817] flex overflow-hidden">

      {/* ── SIDEBAR ─────────────────────────────── */}
      <>
        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Desktop sidebar — always visible */}
        <aside className="hidden lg:flex lg:flex-col w-72 flex-shrink-0 h-screen sticky top-0 z-50">
          <div className="h-full bg-black/80 backdrop-blur-xl border-r border-white/8 flex flex-col">
            {/* Sidebar header */}
            <div className="p-6 border-b border-white/8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                  <img src={`${import.meta.env.BASE_URL}owl-mascot.png`} alt="HearWise" className="w-full h-full object-cover p-1" />
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-white font-black text-sm uppercase tracking-[0.15em] leading-tight">HEARWISE</span>
                  <span className="text-teal-400 font-black text-[10px] uppercase tracking-[0.2em] leading-tight">TECHNOLOGIES</span>
                </div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/8 p-3 text-center">
                <div className="text-teal-400 font-black text-lg tracking-widest uppercase">
                  {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).toUpperCase()}
                </div>
                <div className="text-slate-500 text-[10px] uppercase tracking-widest mt-0.5">
                  {now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                </div>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {SIDEBAR_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group ${activeTab === tab.id
                      ? 'bg-teal-500/15 border border-teal-500/30 text-teal-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <span className="text-base flex-shrink-0">{tab.icon}</span>
                  <span className="font-black text-xs uppercase tracking-widest">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div layoutId="sidebar-active-desktop" className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
                  )}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-white/8">
              <button
                onClick={() => { signOut(); navigate('/login'); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
              >
                <span>🚪</span>
                <span className="font-black text-xs uppercase tracking-widest">SIGN OUT</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile sidebar — slide in/out */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden flex flex-col"
            >
              <div className="h-full bg-black/80 backdrop-blur-xl border-r border-white/8 flex flex-col">
                <div className="p-6 border-b border-white/8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                      <img src={`${import.meta.env.BASE_URL}owl-mascot.png`} alt="HearWise" className="w-full h-full object-cover p-1" />
                    </div>
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="text-white font-black text-sm uppercase tracking-[0.15em] leading-tight">HEARWISE</span>
                      <span className="text-teal-400 font-black text-[10px] uppercase tracking-[0.2em] leading-tight">TECHNOLOGIES</span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/8 p-3 text-center">
                    <div className="text-teal-400 font-black text-lg tracking-widest uppercase">
                      {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).toUpperCase()}
                    </div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-widest mt-0.5">
                      {now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                    </div>
                  </div>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {SIDEBAR_TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group ${activeTab === tab.id
                          ? 'bg-teal-500/15 border border-teal-500/30 text-teal-400'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <span className="text-base flex-shrink-0">{tab.icon}</span>
                      <span className="font-black text-xs uppercase tracking-widest">{tab.label}</span>
                      {activeTab === tab.id && (
                        <motion.div layoutId="sidebar-active-mobile" className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
                      )}
                    </button>
                  ))}
                </nav>
                <div className="p-4 border-t border-white/8">
                  <button
                    onClick={() => { signOut(); navigate('/login'); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <span>🚪</span>
                    <span className="font-black text-xs uppercase tracking-widest">SIGN OUT</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </>


      {/* ── MAIN CONTENT ──────────────────────────── */}
      <main className="flex-1 overflow-y-auto min-h-screen">

        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-[#020817]/90 backdrop-blur-xl border-b border-white/8 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="lg:hidden w-9 h-9 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-slate-400"
            >
              ☰
            </button>
            <div>
              <h1 className="text-white font-black text-base sm:text-lg uppercase tracking-widest">
                {SIDEBAR_TABS.find(t => t.id === activeTab)?.label} DASHBOARD
              </h1>
              <p className="text-slate-600 text-[10px] uppercase tracking-widest">
                HEARWISE TECHNOLOGIES · ADMIN PANEL
              </p>
            </div>
          </div>

          {/* Admin profile chip */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-white font-black text-xs uppercase tracking-widest">VIKASH SARAVANAN</div>
              <div className="text-teal-400 text-[10px] uppercase tracking-widest">FOUNDER & CEO</div>
            </div>
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-teal-400/50">
              <img
                src={`${import.meta.env.BASE_URL}profile4.jpeg`}
                alt="Vikash"
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}owl-mascot.png`; }}
              />
            </div>
          </div>
        </div>

        {/* ── TAB: OVERVIEW ──────────────────────── */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-4 sm:p-8 space-y-8"
            >
              {/* Welcome banner */}
              <RevealSection>
                <div className="relative rounded-3xl overflow-hidden border border-teal-500/20 bg-gradient-to-br from-teal-500/10 to-cyan-500/5 p-6 sm:p-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-[10px] font-black uppercase tracking-widest mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      ADMIN ACCESS · SECURE
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-wider mb-2">
                      WELCOME BACK,{' '}
                      <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                        VIKASH
                      </span>
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base uppercase tracking-widest">
                      {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
                    </p>
                  </div>
                </div>
              </RevealSection>

              {/* Stats grid */}
              <RevealSection delay={0.1}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'CHILDREN SCREENED', value: childrenCount, ref: childrenRef, suffix: '', color: 'text-teal-400', border: 'border-teal-500/20', bg: 'bg-teal-500/5', icon: '👂' },
                    { label: 'SCHOOLS ONBOARDED', value: schoolsCount, ref: schoolsRef, suffix: '+', color: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/5', icon: '🏫' },
                    { label: 'ISSUES DETECTED', value: detectedCount, ref: detectedRef, suffix: '', color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/5', icon: '⚠️' },
                    { label: 'CERTIFICATIONS', value: certsCount, ref: certsRef, suffix: '+', color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', icon: '🏆' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      ref={stat.ref}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className={`rounded-2xl border ${stat.border} ${stat.bg} p-5 sm:p-6 hover:shadow-lg transition-all cursor-default`}
                    >
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <div className={`text-2xl sm:text-3xl font-black ${stat.color} mb-1`}>
                        {stat.value.toLocaleString()}{stat.suffix}
                      </div>
                      <div className="text-slate-500 text-[9px] sm:text-[10px] uppercase tracking-widest">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </RevealSection>

              {/* Progress / skill bars — portfolio style */}
              <RevealSection delay={0.2}>
                <div className="rounded-2xl border border-white/8 bg-white/3 p-6 sm:p-8">
                  <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6">
                    PLATFORM HEALTH METRICS
                  </h3>
                  <div className="space-y-5">
                    {[
                      { label: 'TEST COMPLETION RATE', value: 94, color: 'from-teal-500 to-cyan-400' },
                      { label: 'PLATFORM UPTIME', value: 99, color: 'from-emerald-500 to-teal-400' },
                      { label: 'MOBILE USAGE', value: 87, color: 'from-cyan-500 to-blue-400' },
                      { label: 'TEACHER SATISFACTION', value: 91, color: 'from-teal-400 to-emerald-400' },
                    ].map((metric, i) => (
                      <SkillBar key={metric.label} {...metric} delay={i * 0.1} />
                    ))}
                  </div>
                </div>
              </RevealSection>

              {/* Recent activity */}
              <RevealSection delay={0.3}>
                <div className="rounded-2xl border border-white/8 bg-white/3 p-6 sm:p-8">
                  <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6">RECENT ACTIVITY</h3>
                  <div className="space-y-3">
                    {[
                      { time: '09:42 AM', event: 'NEW SCHOOL REGISTERED', detail: 'PANCHAYAT UNION MIDDLE SCHOOL, KARUR', type: 'success' },
                      { time: '08:15 AM', event: 'HEARING TEST COMPLETED', detail: '24 CHILDREN SCREENED — GRADE 3', type: 'info' },
                      { time: 'YESTERDAY', event: 'ISSUE DETECTED', detail: '3 CHILDREN REFERRED TO AUDIOLOGIST', type: 'warning' },
                      { time: 'YESTERDAY', event: 'REPORT DOWNLOADED', detail: 'PARENT PDF REPORT — RAJAN S.', type: 'info' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-white/3 border border-white/5"
                      >
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${item.type === 'success' ? 'bg-teal-400' :
                            item.type === 'warning' ? 'bg-orange-400' : 'bg-blue-400'
                          }`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-black text-sm">{item.event}</div>
                          <div className="text-slate-400 text-xs mt-1">{item.detail}</div>
                          <div className="text-slate-500 text-[10px] mt-2 font-bold tracking-widest">{item.time}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </RevealSection>
            </motion.div>
          )}

          {/* ── TAB: FOUNDER ─────────────────────── */}
          {activeTab === 'founder' && (
            <motion.div
              key="founder"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-4 sm:p-8 space-y-16 pb-20"
            >
              {/* 1. THREE IMAGE LAYOUT */}
              <RevealSection>
                <div className="relative flex justify-center items-center h-[320px] sm:h-[500px] perspective-1000 mt-8 mb-12 sm:mb-20">
                  <motion.div
                    whileHover={{ scale: 1.05, zIndex: 30, rotateZ: 0 }}
                    className="absolute left-[10%] sm:left-[22%] w-[140px] sm:w-[260px] h-[200px] sm:h-[360px] rounded-3xl overflow-hidden border-8 border-[#020817] shadow-2xl z-10 transition-all duration-500"
                    style={{ transform: 'rotate(-12deg) translateY(20px)' }}
                  >
                    <img src={`${import.meta.env.BASE_URL}img1.jpg`} alt="Vikash" className="w-full h-full object-cover" />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, zIndex: 30, rotateZ: 0 }}
                    className="absolute right-[10%] sm:right-[22%] w-[140px] sm:w-[260px] h-[200px] sm:h-[360px] rounded-3xl overflow-hidden border-8 border-[#020817] shadow-2xl z-10 transition-all duration-500"
                    style={{ transform: 'rotate(12deg) translateY(20px)' }}
                  >
                    <img src={`${import.meta.env.BASE_URL}img3.jpg`} alt="Vikash" className="w-full h-full object-cover" />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, zIndex: 30 }}
                    className="absolute z-20 w-[180px] sm:w-[320px] h-[260px] sm:h-[440px] rounded-[2rem] overflow-hidden border-8 border-[#020817] shadow-[0_20px_60px_rgba(6,182,212,0.25)] transition-all duration-500"
                  >
                    <img src={`${import.meta.env.BASE_URL}profile4.jpeg`} alt="Vikash Center" className="w-full h-full object-cover" />
                  </motion.div>
                </div>
              </RevealSection>

              {/* 2. MAIN PORTFOLIO WIDGET */}
              <RevealSection delay={0.1}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column (Main Info Card) */}
                  <div className="lg:col-span-6 xl:col-span-7">
                    <div className="h-full rounded-3xl border border-white/10 bg-[#0a0f1a]/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none transition-all group-hover:bg-cyan-500/20" />
                      <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 font-serif tracking-tight">
                        B.Tech AI & Data Science Student
                      </h2>
                      <h3 className="text-2xl sm:text-3xl font-black text-cyan-400 mb-10 font-serif">
                        Prompt Engineer & Web D
                      </h3>
                      <div className="space-y-6">
                        {[
                          { icon: '📍', title: 'Location:', value: 'Coimbatore, Tamil Nadu, India (Native: Karur)' },
                          { icon: '💼', title: 'Availability:', value: 'Open for Remote & Coimbatore Internships' },
                          { icon: '🎯', title: 'Objective:', value: 'Ambitious first-year student actively building enterprise-grade AI automation systems.' },
                          { icon: '🧠', title: 'Specialization:', value: 'Bridging the gap between advanced machine learning and full-stack software architecture.' },
                          { icon: '⚡', title: 'Execution:', value: 'Engineering autonomous agents, developing robust React ecosystems, and scraping/analyzing complex datasets.' },
                          { icon: '🚀', title: 'Vision:', value: 'Delivering high-impact, production-ready solutions that solve real-world industry problems at scale.' },
                        ].map(item => (
                          <div key={item.title} className="flex items-start gap-4">
                            <span className="text-xl mt-0.5 text-cyan-400">{item.icon}</span>
                            <div>
                              <span className="text-slate-200 font-bold text-sm sm:text-base mr-2">{item.title}</span>
                              <span className="text-slate-400 text-sm sm:text-base leading-relaxed">{item.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Widgets) */}
                  <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-6">
                    {/* Top Row: Hackathon & Production */}
                    <div className="grid grid-cols-2 gap-6">
                      <motion.div whileHover={{ scale: 1.02 }} className="rounded-3xl border border-white/10 bg-[#0a0f1a]/80 backdrop-blur-xl p-6 text-center flex flex-col items-center justify-center min-h-[140px] shadow-lg hover:border-blue-500/30 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                          <span className="text-blue-400 text-2xl">🏆</span>
                        </div>
                        <h4 className="text-white font-bold text-sm sm:text-base mb-1">Hackathon Finalist</h4>
                        <p className="text-slate-500 text-xs sm:text-sm">Meta PyTorch (OpenEnv)</p>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.02 }} className="rounded-3xl border border-white/10 bg-[#0a0f1a]/80 backdrop-blur-xl p-6 text-center flex flex-col items-center justify-center min-h-[140px] shadow-lg hover:border-emerald-500/30 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                          <span className="text-emerald-400 text-2xl">⚙️</span>
                        </div>
                        <h4 className="text-white font-bold text-sm sm:text-base mb-1">Production Ready</h4>
                        <p className="text-slate-500 text-xs sm:text-sm">3+ Live Architectures</p>
                      </motion.div>
                    </div>

                    {/* Middle Row: Certified Expert */}
                    <motion.div whileHover={{ scale: 1.02 }} className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-900/20 to-[#0a0f1a]/80 backdrop-blur-xl p-6 sm:p-8 flex items-center justify-center gap-6 min-h-[120px] shadow-xl shadow-cyan-900/10">
                      <div className="text-cyan-400 text-5xl animate-pulse">🌟</div>
                      <div>
                        <h4 className="text-white font-black text-xl sm:text-2xl mb-1 tracking-wide">Certified Expert</h4>
                        <p className="text-cyan-200/60 text-sm font-bold uppercase tracking-widest">15+ Professional Certifications</p>
                      </div>
                    </motion.div>

                    {/* Bottom Row: Skills */}
                    <div className="grid grid-cols-3 gap-4">
                      <motion.div whileHover={{ scale: 1.05 }} className="rounded-2xl border border-white/10 bg-[#0a0f1a]/80 backdrop-blur-xl p-4 text-center hover:border-cyan-500/30">
                        <div className="text-cyan-400 mb-2 text-xl">🤖</div>
                        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">FOCUS</div>
                        <div className="text-white font-bold text-xs">AI Automation</div>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} className="rounded-2xl border border-white/10 bg-[#0a0f1a]/80 backdrop-blur-xl p-4 text-center hover:border-blue-500/30">
                        <div className="text-blue-400 mb-2 text-xl">🧠</div>
                        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">SPECIALIZATION</div>
                        <div className="text-white font-bold text-xs">Prompt Eng</div>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} className="rounded-2xl border border-white/10 bg-[#0a0f1a]/80 backdrop-blur-xl p-4 text-center hover:border-emerald-500/30">
                        <div className="text-emerald-400 mb-2 text-xl">{'</>'}</div>
                        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">TOP SKILLS</div>
                        <div className="text-white font-bold text-xs">Python, React, n8n</div>
                      </motion.div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex flex-wrap items-center gap-4 mt-auto pt-2">
                      <a href="https://vikashsaravanann.github.io/Portfolio_Information/" target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[120px] py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-black text-sm uppercase tracking-widest transition-all text-center shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                        About Me
                      </a>
                      <a href="https://linkedin.com/in/vikash-saravanan-j7528" target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[120px] py-4 rounded-xl border border-white/20 hover:border-cyan-400 hover:text-cyan-400 text-white font-bold text-sm transition-colors text-center">
                        Hire Me
                      </a>
                      <a href="https://vikashsaravanann.github.io/Portfolio_Information/" target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[120px] py-4 rounded-xl border border-white/20 hover:border-cyan-400 hover:text-cyan-400 text-white font-bold text-sm transition-colors text-center flex items-center justify-center gap-2">
                        <span>📥</span> Resume
                      </a>
                    </div>
                  </div>
                </div>
              </RevealSection>

              {/* 3. PORTFOLIO INFORMATION BLOCK */}
              <RevealSection delay={0.2}>
                <div className="rounded-[2.5rem] border border-cyan-500/20 bg-gradient-to-br from-[#0a0f1a] to-cyan-950/20 p-8 sm:p-12 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-2xl">
                  <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
                  <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-4xl shadow-lg shadow-cyan-500/30 flex-shrink-0">
                      🌐
                    </div>
                    <div>
                      <h3 className="text-cyan-400 font-black text-sm uppercase tracking-[0.3em] mb-2">OFFICIAL PORTFOLIO</h3>
                      <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 font-serif tracking-tight">Digital Presence & Architecture</h2>
                      <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-4xl font-light">
                        A comprehensive showcase of my journey as an AI & Data Science student. This portfolio serves as a central hub for my production-ready architectures, including <strong>HearWise</strong> (India's first school hearing screening platform) and <strong>Traffic Vision AI</strong> (YOLOv8 adaptive traffic management). It highlights my core competencies in React, TypeScript, Python, and Supabase, alongside a complete gallery of my 15+ professional certifications from institutions like Microsoft, Cisco, and IIT Bombay.
                      </p>
                      <a href="https://vikashsaravanann.github.io/Portfolio_Information/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500 hover:text-[#000b1d] text-cyan-400 font-black text-sm uppercase tracking-widest transition-all">
                        Visit Portfolio Website <span>→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </RevealSection>

              {/* 4. LINKEDIN BLOCK */}
              <RevealSection delay={0.3}>
                <div className="rounded-[2.5rem] border border-blue-500/20 bg-gradient-to-br from-[#0a0f1a] to-blue-950/20 p-8 sm:p-12 relative overflow-hidden group hover:border-blue-500/40 transition-all shadow-2xl">
                  <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-500/20 transition-all" />
                  <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    </div>
                    <div>
                      <h3 className="text-blue-400 font-black text-sm uppercase tracking-[0.3em] mb-2">PROFESSIONAL NETWORK</h3>
                      <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 font-serif tracking-tight">Career & Industry Connections</h2>
                      <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-4xl font-light">
                        My primary channel for professional networking and industry engagement. Here, I actively connect with founders, AI engineers, and web developers. As a Meta PyTorch OpenEnv Hackathon Finalist, I leverage LinkedIn to share deep-dive technical insights, announce new project launches, and document my continuous learning journey. I am highly receptive to remote internships, AI engineering roles, and collaborative startup opportunities.
                      </p>
                      <a href="https://www.linkedin.com/in/vikash-saravanan-j7528/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500 hover:text-white text-blue-400 font-black text-sm uppercase tracking-widest transition-all">
                        Connect on LinkedIn <span>→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </RevealSection>

              {/* 5. GITHUB BLOCK */}
              <RevealSection delay={0.4}>
                <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#0a0f1a] to-white/5 p-8 sm:p-12 relative overflow-hidden group hover:border-white/30 transition-all shadow-2xl">
                  <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-white/10 transition-all" />
                  <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white shadow-lg shadow-black flex-shrink-0">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    </div>
                    <div>
                      <h3 className="text-gray-300 font-black text-sm uppercase tracking-[0.3em] mb-2">OPEN SOURCE REPOSITORIES</h3>
                      <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 font-serif tracking-tight">Code & Version Control</h2>
                      <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-4xl font-light">
                        The heartbeat of my technical execution. My GitHub profile hosts the entire source code architecture for <strong>HearWise Child Health</strong>, my <strong>Portfolio Information</strong> hub, and <strong>Traffic Vision AI</strong>. It reflects my commitment to clean code, modular React component design, and scalable Supabase backend integrations. Here, you can trace my precise commit history and review the raw logic powering my enterprise applications.
                      </p>
                      <a href="https://github.com/vikashsaravanann/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/20 hover:bg-white hover:text-black text-white font-black text-sm uppercase tracking-widest transition-all">
                        View GitHub Profile <span>→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </RevealSection>

              {/* 6. INSTAGRAM BLOCK */}
              <RevealSection delay={0.5}>
                <div className="rounded-[2.5rem] border border-pink-500/20 bg-gradient-to-br from-[#0a0f1a] to-pink-950/20 p-8 sm:p-12 relative overflow-hidden group hover:border-pink-500/40 transition-all shadow-2xl">
                  <div className="absolute -bottom-32 right-0 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-[100px] pointer-events-none group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all" />
                  <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-lg shadow-pink-500/30 flex-shrink-0">
                      📸
                    </div>
                    <div>
                      <h3 className="text-pink-400 font-black text-sm uppercase tracking-[0.3em] mb-2">BUILD IN PUBLIC</h3>
                      <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 font-serif tracking-tight">The Startup Journey</h2>
                      <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-4xl font-light">
                        Transparency is key to my development process. On Instagram, I document the raw, unfiltered engineering journey behind HearWise. I share insights on rapidly shipping production code using modern tools like Cursor AI, Gemini, Perplexity, and n8n. It's a behind-the-scenes look at the late nights, bug fixes, and architectural breakthroughs required to build India's first school hearing screening startup from the ground up.
                      </p>
                      <a href="https://www.instagram.com/startupwithvikash/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-pink-500/10 border border-pink-500/30 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white text-pink-400 font-black text-sm uppercase tracking-widest transition-all">
                        Follow the Journey <span>→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </RevealSection>

              {/* 7. ABOUT HEARWISE BLOCK */}
              <RevealSection delay={0.6}>
                <div className="rounded-[2.5rem] border border-emerald-500/20 bg-gradient-to-br from-[#0a0f1a] to-emerald-950/20 p-8 sm:p-12 relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-2xl">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
                  <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/30 flex-shrink-0">
                      🦉
                    </div>
                    <div>
                      <h3 className="text-emerald-400 font-black text-sm uppercase tracking-[0.3em] mb-2">HEARWISE TECHNOLOGIES</h3>
                      <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 font-serif tracking-tight">India's First School Hearing Screening Platform</h2>
                      <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-4xl font-light">
                        HearWise is a groundbreaking initiative designed to democratize early hearing issue detection across Indian schools. Built with an intuitive, multi-lingual React frontend and a highly secure Supabase backend, it allows schools and clinics to rapidly screen children, generate beautiful diagnostic PDFs, and track platform-wide analytics in real-time. Paired with <strong>HearBot</strong>—an AI assistant powered by Groq—HearWise is transforming pediatric audiology from an expensive clinical process into an accessible, scalable technological solution.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {['REACT + TS', 'SUPABASE', 'GROQ AI', 'TAILWIND'].map(tech => (
                          <div key={tech} className="px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-center text-xs font-black uppercase tracking-widest">
                            {tech}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </RevealSection>

            </motion.div>
          )}

          {/* Other tabs — analytics, platform, settings — add placeholder for now */}
          {['analytics', 'platform', 'settings'].includes(activeTab) && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 sm:p-8 flex items-center justify-center min-h-[60vh]"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{SIDEBAR_TABS.find(t => t.id === activeTab)?.icon}</div>
                <h2 className="text-white font-black text-xl uppercase tracking-widest mb-2">
                  {SIDEBAR_TABS.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-slate-500 text-sm uppercase tracking-widest">COMING SOON</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

// ─── Skill Bar component ──────────────────────────────────
function SkillBar({ label, value, color, delay = 0 }: { label: string; value: number; color: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-slate-300 font-bold text-xs uppercase tracking-widest">{label}</span>
        <span className="text-teal-400 font-black text-xs">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  );
}
