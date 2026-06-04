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
    { id: 'links', icon: '🔗', label: 'SOCIAL LINKS' },
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

        <motion.aside
          initial={false}
          animate={{ x: sidebarOpen ? 0 : '-100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:translate-x-0 lg:static lg:flex lg:flex-col"
        >
          <div className="h-full bg-black/80 backdrop-blur-xl border-r border-white/8 flex flex-col">

            {/* Sidebar header */}
            <div className="p-6 border-b border-white/8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                  <img src={`${import.meta.env.BASE_URL}owl-mascot.png`} alt="HearWise" className="w-full h-full object-cover p-1" />
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-white font-black text-sm uppercase tracking-[0.15em] leading-tight">
                    HEARWISE
                  </span>
                  <span className="text-teal-400 font-black text-[10px] uppercase tracking-[0.2em] leading-tight">
                    TECHNOLOGIES
                  </span>
                </div>
              </div>
              {/* Live clock */}
              <div className="rounded-xl bg-white/5 border border-white/8 p-3 text-center">
                <div className="text-teal-400 font-black text-lg tracking-widest uppercase">
                  {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).toUpperCase()}
                </div>
                <div className="text-slate-500 text-[10px] uppercase tracking-widest mt-0.5">
                  {now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Nav tabs */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {SIDEBAR_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group ${
                    activeTab === tab.id
                      ? 'bg-teal-500/15 border border-teal-500/30 text-teal-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-base flex-shrink-0">{tab.icon}</span>
                  <span className="font-black text-xs uppercase tracking-widest">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
                  )}
                </button>
              ))}
            </nav>

            {/* Sidebar footer — sign out */}
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
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                          item.type === 'success' ? 'bg-teal-400' :
                          item.type === 'warning' ? 'bg-orange-400' : 'bg-blue-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-black text-xs uppercase tracking-wider">{item.event}</div>
                          <div className="text-slate-500 text-[10px] uppercase tracking-wider mt-0.5">{item.detail}</div>
                        </div>
                        <div className="text-slate-600 text-[10px] uppercase tracking-widest flex-shrink-0">{item.time}</div>
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
              className="p-4 sm:p-8 space-y-8"
            >
              <RevealSection>
                {/* Founder hero card — vertical image layout like portfolio */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Vertical profile image card */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="lg:col-span-1 rounded-3xl overflow-hidden border border-teal-500/30 bg-gradient-to-b from-teal-500/10 to-transparent relative"
                    style={{ minHeight: '420px' }}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}profile4.jpeg`}
                      alt="Vikash Saravanan — Founder & CEO"
                      className="w-full h-full object-cover object-top absolute inset-0"
                      onError={e => {
                        (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}owl-mascot.png`;
                        (e.target as HTMLImageElement).className = 'w-full h-full object-contain p-8';
                      }}
                    />
                    {/* Overlay gradient at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="inline-flex px-2 py-1 rounded-full bg-teal-400/90 text-black text-[10px] font-black uppercase tracking-widest mb-1">
                        FOUNDER & CEO
                      </div>
                    </div>
                  </motion.div>

                  {/* Info card */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/3 p-6 sm:p-8">
                      <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wider mb-1">
                        VIKASH SARAVANAN
                      </h2>
                      <p className="text-teal-400 font-black text-sm uppercase tracking-widest mb-5">
                        AI ENGINEER · PROMPT ENGINEER · WEB DEVELOPER
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                        {[
                          { icon: '📍', label: 'LOCATION', value: 'COIMBATORE, TAMIL NADU, INDIA' },
                          { icon: '🎓', label: 'EDUCATION', value: 'B.TECH AI & DATA SCIENCE — CLASS OF 2029' },
                          { icon: '🏛️', label: 'COLLEGE', value: 'RATHINAM TECHNICAL CAMPUS' },
                          { icon: '🏠', label: 'NATIVE', value: 'KARUR, TAMIL NADU' },
                          { icon: '💼', label: 'STATUS', value: 'OPEN FOR REMOTE INTERNSHIPS' },
                          { icon: '🚀', label: 'SPECIALIZATION', value: 'ENTERPRISE AI AUTOMATION' },
                        ].map(item => (
                          <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                            <span className="text-lg flex-shrink-0">{item.icon}</span>
                            <div>
                              <div className="text-slate-500 text-[9px] uppercase tracking-widest">{item.label}</div>
                              <div className="text-white font-bold text-xs uppercase tracking-wider mt-0.5">{item.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed uppercase">
                        Ambitious B.Tech AI & Data Science undergraduate building enterprise-grade AI automation systems.
                        Hackathon finalist at Meta PyTorch OpenEnv × Scaler. 15+ professional certifications.
                        3+ production-ready live projects. Bridging the gap between advanced machine learning and
                        full-stack software architecture.
                      </p>
                    </div>

                    {/* Achievement badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { icon: '🏆', title: 'HACKATHON', subtitle: 'FINALIST', detail: 'META PYTORCH OPENENV' },
                        { icon: '📜', title: '15+', subtitle: 'CERTIFICATIONS', detail: 'PROFESSIONAL CERTS' },
                        { icon: '⚡', title: '3+', subtitle: 'LIVE PROJECTS', detail: 'PRODUCTION READY' },
                        { icon: '🎯', title: 'AI FOCUS', subtitle: 'AUTOMATION', detail: 'N8N + LLM AGENTS' },
                      ].map(badge => (
                        <div key={badge.title} className="p-4 rounded-2xl border border-white/8 bg-white/3 text-center hover:border-teal-500/30 hover:bg-teal-500/5 transition-all">
                          <div className="text-2xl mb-1">{badge.icon}</div>
                          <div className="text-white font-black text-sm uppercase">{badge.title}</div>
                          <div className="text-teal-400 text-[10px] font-black uppercase tracking-widest">{badge.subtitle}</div>
                          <div className="text-slate-600 text-[9px] uppercase tracking-wider mt-0.5">{badge.detail}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </RevealSection>

              {/* Journey timeline */}
              <RevealSection delay={0.15}>
                <div className="rounded-2xl border border-white/8 bg-white/3 p-6 sm:p-8">
                  <h3 className="text-white font-black text-sm uppercase tracking-widest mb-8">MY JOURNEY</h3>
                  <div className="space-y-6">
                    {[
                      { date: 'JANUARY 2025', title: 'ENTERPRISE AI AUTOMATION', desc: 'Began intensive focus on building complex n8n workflows and autonomous AI agents for real-world enterprise scaling.', color: 'bg-teal-400' },
                      { date: 'AUGUST 2025', title: 'CERTIFICATIONS & GROWTH', desc: 'Completed 15+ major certifications in AI engineering, network infrastructure, cybersecurity, and data science from Microsoft, LinkedIn, Cisco, and IIT Bombay.', color: 'bg-cyan-400' },
                      { date: 'DECEMBER 2025', title: 'DESIGN THINKING — IIT BOMBAY', desc: 'Certified in Design Thinking, applying human-centric principles to AI solution architecture and product development.', color: 'bg-blue-400' },
                      { date: '2026 — ONGOING', title: 'PROMPT ENGINEERING + HEARWISE', desc: 'Crafting sophisticated LLM prompts and building HearWise — India\'s first school hearing screening platform. Building in public at @startupwithvikash.', color: 'bg-emerald-400' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.date}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-5"
                      >
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className={`w-3 h-3 rounded-full ${item.color} shadow-lg`} />
                          {i < 3 && <div className="w-px flex-1 bg-white/10 mt-2" />}
                        </div>
                        <div className="pb-6">
                          <div className="text-teal-400 text-[10px] font-black uppercase tracking-widest mb-1">{item.date}</div>
                          <div className="text-white font-black text-sm uppercase tracking-wider mb-1">{item.title}</div>
                          <div className="text-slate-400 text-xs leading-relaxed uppercase">{item.desc}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </RevealSection>

              {/* Skills */}
              <RevealSection delay={0.2}>
                <div className="rounded-2xl border border-white/8 bg-white/3 p-6 sm:p-8">
                  <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6">TECHNICAL SKILLS</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { skill: 'PYTHON', level: 85, color: 'from-teal-500 to-cyan-400' },
                      { skill: 'SQL', level: 80, color: 'from-cyan-500 to-blue-400' },
                      { skill: 'HTML / CSS', level: 90, color: 'from-blue-500 to-teal-400' },
                      { skill: 'JAVASCRIPT / REACT', level: 85, color: 'from-teal-400 to-emerald-400' },
                      { skill: 'SUPABASE', level: 75, color: 'from-emerald-500 to-teal-400' },
                      { skill: 'N8N AUTOMATION', level: 88, color: 'from-cyan-400 to-teal-500' },
                    ].map((s, i) => <SkillBar key={s.skill} label={s.skill} value={s.level} color={s.color} delay={i * 0.08} />)}
                  </div>
                </div>
              </RevealSection>
            </motion.div>
          )}

          {/* ── TAB: SOCIAL LINKS ────────────────── */}
          {activeTab === 'links' && (
            <motion.div
              key="links"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-4 sm:p-8 space-y-6"
            >
              <RevealSection>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-2">
                  SOCIAL & PROFESSIONAL LINKS
                </h2>
                <p className="text-slate-500 text-xs uppercase tracking-widest">ALL PLATFORMS — VIKASH SARAVANAN</p>
              </RevealSection>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* LinkedIn */}
                <RevealSection delay={0.05}>
                  <a href="https://linkedin.com/in/vikash-saravanan-j7528" target="_blank" rel="noopener noreferrer">
                    <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-2xl border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition-all p-6 cursor-pointer h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#3b82f6"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                        </div>
                        <div>
                          <div className="text-blue-400 font-black text-sm uppercase tracking-widest">LINKEDIN</div>
                          <div className="text-slate-500 text-[10px] uppercase tracking-wider">PROFESSIONAL NETWORK</div>
                        </div>
                      </div>
                      <div className="text-white font-bold text-xs uppercase tracking-wide mb-2">VIKASH SARAVANAN</div>
                      <p className="text-slate-400 text-xs leading-relaxed uppercase">
                        B.Tech AI & Data Science student. Hackathon finalist at Meta PyTorch OpenEnv × Scaler.
                        15+ professional certifications. Open for remote internships in AI engineering and web development.
                        Building HearWise — India's first school hearing screening platform.
                        Connect for AI/ML, React, and startup opportunities.
                      </p>
                      <div className="mt-4 text-blue-400 text-[10px] uppercase tracking-widest font-black">OPEN PROFILE →</div>
                    </motion.div>
                  </a>
                </RevealSection>

                {/* GitHub */}
                <RevealSection delay={0.1}>
                  <a href="https://github.com/vikashsaravanann" target="_blank" rel="noopener noreferrer">
                    <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-2xl border border-white/15 bg-white/3 hover:bg-white/6 transition-all p-6 cursor-pointer h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </div>
                        <div>
                          <div className="text-white font-black text-sm uppercase tracking-widest">GITHUB</div>
                          <div className="text-slate-500 text-[10px] uppercase tracking-wider">CODE REPOSITORIES</div>
                        </div>
                      </div>
                      <div className="text-white font-bold text-xs uppercase tracking-wide mb-2">@VIKASHSARAVANANN</div>
                      <p className="text-slate-400 text-xs leading-relaxed uppercase">
                        Open source projects including HearWise (India's first school hearing screening platform),
                        Traffic Vision AI (YOLOv8 adaptive traffic management), Meta PyTorch OpenEnv hackathon project,
                        and personal portfolio. React + TypeScript + Supabase + Python ecosystem.
                      </p>
                      <div className="mt-4 text-slate-400 text-[10px] uppercase tracking-widest font-black">VIEW REPOSITORIES →</div>
                    </motion.div>
                  </a>
                </RevealSection>

                {/* Instagram */}
                <RevealSection delay={0.15}>
                  <a href="https://www.instagram.com/startupwithvikash/" target="_blank" rel="noopener noreferrer">
                    <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-2xl border border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10 transition-all p-6 cursor-pointer h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-pink-500/30 flex items-center justify-center text-lg">
                          📸
                        </div>
                        <div>
                          <div className="text-pink-400 font-black text-sm uppercase tracking-widest">INSTAGRAM</div>
                          <div className="text-slate-500 text-[10px] uppercase tracking-wider">BUILD IN PUBLIC</div>
                        </div>
                      </div>
                      <div className="text-white font-bold text-xs uppercase tracking-wide mb-2">@STARTUPWITHVIKASH</div>
                      <p className="text-slate-400 text-xs leading-relaxed uppercase">
                        Documenting the engineering journey of building HearWise and other AI projects in public.
                        Sharing how I use Cursor AI, Gemini, Perplexity, n8n, and Gamma to ship production-ready
                        code rapidly. Behind-the-scenes of building India's first school hearing screening startup.
                        Follow for startup building, AI tools, and tech entrepreneur content.
                      </p>
                      <div className="mt-4 text-pink-400 text-[10px] uppercase tracking-widest font-black">FOLLOW →</div>
                    </motion.div>
                  </a>
                </RevealSection>

                {/* Portfolio */}
                <RevealSection delay={0.2}>
                  <a href="https://vikashsaravanann.github.io/Portfolio_Information/" target="_blank" rel="noopener noreferrer">
                    <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-2xl border border-teal-500/30 bg-teal-500/5 hover:bg-teal-500/10 transition-all p-6 cursor-pointer h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-lg">🌐</div>
                        <div>
                          <div className="text-teal-400 font-black text-sm uppercase tracking-widest">PORTFOLIO</div>
                          <div className="text-slate-500 text-[10px] uppercase tracking-wider">FULL PROFILE</div>
                        </div>
                      </div>
                      <div className="text-white font-bold text-xs uppercase tracking-wide mb-2">VIKASH SARAVANAN — PORTFOLIO</div>
                      <p className="text-slate-400 text-xs leading-relaxed uppercase">
                        Complete professional portfolio — projects (HearWise, Traffic Vision AI, Meta PyTorch OpenEnv),
                        15+ certifications (Microsoft, LinkedIn, Cisco, IIT Bombay, freeCodeCamp), technical skills
                        (Python, React, TypeScript, Supabase, n8n, YOLOv8), personal gallery, journey timeline,
                        and contact. Resume available for download.
                      </p>
                      <div className="mt-4 text-teal-400 text-[10px] uppercase tracking-widest font-black">VISIT PORTFOLIO →</div>
                    </motion.div>
                  </a>
                </RevealSection>

              </div>

              {/* GDC / Centre of Excellence section */}
              <RevealSection delay={0.25}>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8">
                  <h3 className="text-emerald-400 font-black text-sm uppercase tracking-widest mb-4">
                    🏛 GDC / CENTRE OF EXCELLENCE — AI SKILLS HUB
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 uppercase">
                    Secured institutional commitment to the AI Skills Hub at Rathinam Technical Campus —
                    Centre of Excellence for AI and Data Science. Premium access to enterprise-grade AI tooling,
                    mentorship from industry professionals, and collaborative research environments.
                    Building the next generation of AI engineers from Tamil Nadu.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      'AI SKILLS HUB ACCESS',
                      'ENTERPRISE AI TOOLING',
                      'INDUSTRY MENTORSHIP',
                      'RESEARCH COLLABORATION',
                      'HACKATHON NETWORK',
                      'STARTUP INCUBATION',
                    ].map(item => (
                      <div key={item} className="flex items-center gap-2 text-slate-300 text-[10px] uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
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
