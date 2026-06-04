import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/* ─── Google Font ──────────────────────────────────────────────────── */
// Added via index.html or App.tsx — uses Inter + Sora

/* ─── Animated counter ─────────────────────────────────────────────── */
function useCounter(end: number, duration = 2200) {
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

/* ─── Reveal on scroll ─────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Skill progress bar ───────────────────────────────────────────── */
function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-center">
        <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-white font-semibold text-sm tracking-wide">{label}</span>
        <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-slate-400 font-bold text-sm">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/5">
        <motion.div
          className={`h-2 rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </div>
    </div>
  );
}

/* ─── Main Dashboard ───────────────────────────────────────────────── */
export default function Dashboard() {
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!isAdmin) navigate('/', { replace: true });
  }, [isAdmin, navigate]);

  const { count: childrenCount, ref: childrenRef } = useCounter(1247);
  const { count: schoolsCount, ref: schoolsRef } = useCounter(38);
  const { count: detectedCount, ref: detectedRef } = useCounter(94);
  const { count: certsCount, ref: certsRef } = useCounter(15);

  const BASE = import.meta.env.BASE_URL;

  return (
    <div
      className="min-h-screen bg-[#05070f] text-white"
      style={{ fontFamily: "'Inter', 'Sora', sans-serif" }}
    >
      {/* ══════════════════════════════════════════════════════════
          TOP NAVIGATION BAR
      ══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#05070f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center overflow-hidden p-0.5">
              <img src={`${BASE}owl-mascot.png`} alt="HearWise" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-black text-white text-base tracking-tight">HEARWISE</span>
              <span className="text-teal-400 font-black text-base tracking-tight"> TECHNOLOGIES</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-slate-400 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            <span className="mx-2 text-white/10">|</span>
            {now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
          </div>
          <button
            onClick={() => { signOut(); navigate('/login'); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-32 space-y-32 pt-16">

        {/* ══════════════════════════════════════════════════════════
            HERO — WELCOME BANNER
        ══════════════════════════════════════════════════════════ */}
        <Reveal>
          <div className="relative rounded-[2.5rem] overflow-hidden border border-teal-500/20 bg-gradient-to-br from-teal-900/20 via-[#05070f] to-cyan-900/10 p-10 sm:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(20,184,166,0.15)_0%,_transparent_70%)] pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                Admin Access · Secure Dashboard
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight leading-none">
                WELCOME BACK,{' '}
                <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">VIKASH SARAVANAN</span>
              </h1>
              <p className="text-slate-400 text-base sm:text-lg font-medium max-w-xl mx-auto">
                {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
              </p>
            </div>
          </div>
        </Reveal>

        {/* ══════════════════════════════════════════════════════════
            STAT CARDS
        ══════════════════════════════════════════════════════════ */}
        <Reveal delay={0.1}>
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-8">Platform Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Children Screened', value: childrenCount, ref: childrenRef, suffix: '', color: 'text-teal-400', border: 'border-teal-500/20', glow: 'bg-teal-500/5', icon: '👂' },
              { label: 'Schools Onboarded', value: schoolsCount, ref: schoolsRef, suffix: '+', color: 'text-cyan-400', border: 'border-cyan-500/20', glow: 'bg-cyan-500/5', icon: '🏫' },
              { label: 'Issues Detected', value: detectedCount, ref: detectedRef, suffix: '', color: 'text-orange-400', border: 'border-orange-500/20', glow: 'bg-orange-500/5', icon: '⚠️' },
              { label: 'Certifications', value: certsCount, ref: certsRef, suffix: '+', color: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'bg-emerald-500/5', icon: '🏆' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                ref={s.ref}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`rounded-2xl border ${s.border} ${s.glow} p-6 sm:p-8 cursor-default`}
              >
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className={`text-3xl sm:text-4xl font-black ${s.color} mb-2`}>
                  {s.value.toLocaleString()}{s.suffix}
                </div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* ══════════════════════════════════════════════════════════
            PLATFORM HEALTH BARS
        ══════════════════════════════════════════════════════════ */}
        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-8 sm:p-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Platform Health</h2>
            <p className="text-2xl sm:text-3xl font-black text-white mb-10">Real-Time Metrics</p>
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { label: 'Test Completion Rate', value: 94, color: 'from-teal-500 to-cyan-400' },
                { label: 'Platform Uptime', value: 99, color: 'from-emerald-500 to-teal-400' },
                { label: 'Mobile Usage', value: 87, color: 'from-cyan-500 to-blue-400' },
                { label: 'Teacher Satisfaction', value: 91, color: 'from-teal-400 to-emerald-400' },
              ].map((m, i) => (
                <motion.div key={m.label} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Bar {...m} />
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ══════════════════════════════════════════════════════════
            RECENT ACTIVITY
        ══════════════════════════════════════════════════════════ */}
        <Reveal>
          <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-8 sm:p-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Live Feed</h2>
            <p className="text-2xl sm:text-3xl font-black text-white mb-10">Recent Activity</p>
            <div className="space-y-4">
              {[
                { time: '09:42 AM', event: 'New School Registered', detail: 'Panchayat Union Middle School, Karur', type: 'success' },
                { time: '08:15 AM', event: 'Hearing Test Completed', detail: '24 children screened — Grade 3', type: 'info' },
                { time: 'Yesterday', event: 'Issue Detected', detail: '3 children referred to audiologist', type: 'warning' },
                { time: 'Yesterday', event: 'Report Downloaded', detail: 'Parent PDF report — Rajan S.', type: 'info' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${
                    item.type === 'success' ? 'bg-teal-400' :
                    item.type === 'warning' ? 'bg-orange-400' : 'bg-blue-400'
                  }`} />
                  <div className="flex-1">
                    <div className="text-white font-bold text-base">{item.event}</div>
                    <div className="text-slate-400 text-sm mt-0.5">{item.detail}</div>
                  </div>
                  <div className="text-slate-600 text-xs font-semibold whitespace-nowrap">{item.time}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ══════════════════════════════════════════════════════════
            DIVIDER — FOUNDER SECTION START
        ══════════════════════════════════════════════════════════ */}
        <Reveal>
          <div className="flex items-center gap-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-600 px-4">Founder Profile</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </Reveal>

        {/* ══════════════════════════════════════════════════════════
            3 HUGE PHOTOS
        ══════════════════════════════════════════════════════════ */}
        <Reveal>
          {/* 3 vertical photo cards — clean, upright, side by side */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              { src: `${BASE}img1.jpg`, alt: 'Vikash at Campus', label: 'Campus Life', sub: 'Coimbatore, Tamil Nadu' },
              { src: `${BASE}profile4.jpeg`, alt: 'Vikash Saravanan', label: 'Vikash Saravanan', sub: 'Founder & CEO · HearWise Technologies', center: true },
              { src: `${BASE}img3.jpg`, alt: 'Vikash at Work', label: 'Engineering Mode', sub: 'Building India\'s First Hearing Platform' },
            ].map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`rounded-3xl overflow-hidden cursor-pointer group ${
                  photo.center
                    ? 'shadow-[0_0_60px_rgba(6,182,212,0.2),_0_20px_60px_rgba(0,0,0,0.6)] border-2 border-cyan-500/20'
                    : 'shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/8'
                }`}
              >
                {/* Photo — NO text overlay */}
                <div className="w-full aspect-[3/4] overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                {/* Caption BELOW photo */}
                <div className={`p-4 sm:p-5 ${
                  photo.center ? 'bg-gradient-to-b from-cyan-950/40 to-[#05070f]' : 'bg-[#05070f]'
                }`}>
                  <div className={`font-black text-sm sm:text-base leading-tight ${
                    photo.center ? 'text-white' : 'text-slate-200'
                  }`}>{photo.label}</div>
                  <div className="text-slate-500 text-xs mt-1 leading-snug font-medium">{photo.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* ══════════════════════════════════════════════════════════
            ABOUT THE FOUNDER
        ══════════════════════════════════════════════════════════ */}
        <Reveal>
          <div className="grid lg:grid-cols-12 gap-8">
            {/* ── Bio Card ── */}
            <div className="lg:col-span-7 rounded-3xl border border-teal-500/10 bg-gradient-to-br from-teal-900/10 to-[#05070f] p-8 sm:p-12 relative overflow-hidden group hover:border-teal-500/20 transition-all">
              <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative z-10 space-y-8">
                <div>
                  <p className="text-teal-400 font-bold text-xs uppercase tracking-[0.3em] mb-4">The Founder & CEO</p>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-3">Vikash Saravanan</h2>
                  <h3 className="text-lg sm:text-xl font-semibold text-cyan-400 mb-1">B.Tech AI &amp; Data Science Student</h3>
                  <p className="text-slate-400 text-sm font-medium">Prompt Engineer · Web Developer · AI Automation Specialist</p>
                </div>

                <div className="h-px bg-white/5" />

                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { icon: '📍', label: 'Location', val: 'Coimbatore, TN (Native: Karur)' },
                    { icon: '🎓', label: 'Education', val: 'First-Year, AI & DS · 2024–2028' },
                    { icon: '💼', label: 'Open For', val: 'Remote & Coimbatore Internships' },
                    { icon: '🏆', label: 'Achievement', val: 'Meta PyTorch OpenEnv Finalist' },
                    { icon: '🤖', label: 'Expertise', val: 'AI Agents, React, Python, n8n' },
                    { icon: '🚀', label: 'Live Projects', val: 'HearWise · Traffic Vision AI' },
                    { icon: '📜', label: 'Certifications', val: '15+ from Microsoft, Cisco, IIT' },
                    { icon: '🌐', label: 'Languages', val: 'Tamil · English · Hindi' },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3">
                      <span className="text-base mt-0.5 flex-shrink-0">{item.icon}</span>
                      <div>
                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">{item.label}</div>
                        <div className="text-white text-sm font-semibold leading-snug">{item.val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-white/5" />

                <div>
                  <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">Mission Statement</div>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                    Ambitious first-year student actively building enterprise-grade AI automation systems. Bridging the gap between advanced machine learning and full-stack software architecture — engineering autonomous agents, developing robust React ecosystems, and delivering high-impact, production-ready solutions that solve real-world industry problems at scale.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Right Column ── */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              {/* Skill badges */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 sm:p-8">
                <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">Core Technologies</div>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'React', 'TypeScript', 'Supabase', 'n8n', 'Framer Motion', 'Vite', 'Groq AI', 'Tailwind CSS', 'PostgreSQL', 'Cursor AI', 'Gemini API'].map(tech => (
                    <span key={tech} className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-xs font-semibold hover:border-teal-500/30 hover:text-teal-300 transition-colors">{tech}</span>
                  ))}
                </div>
              </div>

              {/* Achievement cards */}
              {[
                { icon: '🏆', title: 'Hackathon Finalist', sub: 'Meta PyTorch OpenEnv', color: 'border-blue-500/20 hover:border-blue-400/30 hover:bg-blue-900/10' },
                { icon: '⚙️', title: '3+ Live Architectures', sub: 'Production-ready deployments on GitHub Pages & Supabase', color: 'border-emerald-500/20 hover:border-emerald-400/30 hover:bg-emerald-900/10' },
                { icon: '🌟', title: '15+ Certifications', sub: 'Microsoft · Cisco · IIT Bombay · NPTEL', color: 'border-yellow-500/20 hover:border-yellow-400/30 hover:bg-yellow-900/10' },
              ].map((b) => (
                <motion.div
                  key={b.title}
                  whileHover={{ y: -3 }}
                  className={`rounded-2xl border ${b.color} bg-white/[0.02] p-5 flex items-center gap-4 transition-all cursor-default`}
                >
                  <span className="text-3xl flex-shrink-0">{b.icon}</span>
                  <div>
                    <div className="text-white font-bold text-sm leading-tight">{b.title}</div>
                    <div className="text-slate-500 text-xs font-medium mt-0.5 leading-snug">{b.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ══════════════════════════════════════════════════════════
            PORTFOLIO WEBSITE
        ══════════════════════════════════════════════════════════ */}
        <Reveal>
          <div className="rounded-[2.5rem] border border-cyan-500/15 bg-gradient-to-br from-cyan-950/20 to-[#05070f] p-10 sm:p-16 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none group-hover:bg-cyan-500/15 transition-all" />
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-4xl shadow-xl shadow-cyan-500/20 flex-shrink-0">🌐</div>
              <div className="flex-1">
                <p className="text-cyan-400 font-bold text-xs uppercase tracking-[0.3em] mb-3">Official Portfolio</p>
                <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6">Digital Presence<br />&amp; Architecture</h2>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-3xl font-normal">
                  A comprehensive showcase of my AI &amp; Data Science journey. This portfolio is the central hub for my production-ready architectures including <strong className="text-white">HearWise</strong> — India's first school hearing screening platform — and <strong className="text-white">Traffic Vision AI</strong> (YOLOv8 adaptive traffic management). It features my core competencies in React, TypeScript, Python, and Supabase, alongside a gallery of my 15+ professional certifications from Microsoft, Cisco, and IIT Bombay.
                </p>
                <a
                  href="https://vikashsaravanann.github.io/Portfolio_Information/"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500 hover:text-[#05070f] text-cyan-400 font-black text-sm uppercase tracking-widest transition-all"
                >
                  Visit Portfolio Website <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ══════════════════════════════════════════════════════════
            LINKEDIN
        ══════════════════════════════════════════════════════════ */}
        <Reveal>
          <div className="rounded-[2.5rem] border border-blue-500/15 bg-gradient-to-br from-blue-950/20 to-[#05070f] p-10 sm:p-16 relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[120px] pointer-events-none group-hover:bg-blue-500/15 transition-all" />
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 flex-shrink-0">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </div>
              <div className="flex-1">
                <p className="text-blue-400 font-bold text-xs uppercase tracking-[0.3em] mb-3">Professional Network</p>
                <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6">Career &amp;<br />Industry Connections</h2>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-3xl font-normal">
                  My primary channel for professional networking and industry engagement. Here, I actively connect with founders, AI engineers, and web developers. As a Meta PyTorch OpenEnv Hackathon Finalist, I leverage LinkedIn to share deep technical insights, announce new project launches, and document my continuous learning journey. I am highly receptive to remote internships, AI engineering roles, and collaborative startup opportunities.
                </p>
                <a
                  href="https://www.linkedin.com/in/vikash-saravanan-j7528/"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500 hover:text-white text-blue-400 font-black text-sm uppercase tracking-widest transition-all"
                >
                  Connect on LinkedIn <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ══════════════════════════════════════════════════════════
            GITHUB
        ══════════════════════════════════════════════════════════ */}
        <Reveal>
          <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/5 to-[#05070f] p-10 sm:p-16 relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-[120px] pointer-events-none group-hover:bg-white/5 transition-all" />
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white shadow-xl shadow-black flex-shrink-0">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </div>
              <div className="flex-1">
                <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em] mb-3">Open Source Repositories</p>
                <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6">Code &amp;<br />Version Control</h2>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-3xl font-normal">
                  The heartbeat of my technical execution. My GitHub profile hosts the entire source code architecture for <strong className="text-white">HearWise Child Health</strong>, my <strong className="text-white">Portfolio Information</strong> hub, and <strong className="text-white">Traffic Vision AI</strong>. It reflects my commitment to clean code, modular React component design, and scalable Supabase backend integrations. Trace my precise commit history and review the raw logic powering my enterprise applications.
                </p>
                <a
                  href="https://github.com/vikashsaravanann/"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/20 hover:bg-white hover:text-black text-white font-black text-sm uppercase tracking-widest transition-all"
                >
                  View GitHub Profile <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ══════════════════════════════════════════════════════════
            INSTAGRAM
        ══════════════════════════════════════════════════════════ */}
        <Reveal>
          <div className="rounded-[2.5rem] border border-pink-500/15 bg-gradient-to-br from-pink-950/20 to-[#05070f] p-10 sm:p-16 relative overflow-hidden group hover:border-pink-500/30 transition-all">
            <div className="absolute -bottom-40 right-0 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-[120px] pointer-events-none group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all" />
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-xl shadow-pink-500/20 flex-shrink-0">📸</div>
              <div className="flex-1">
                <p className="text-pink-400 font-bold text-xs uppercase tracking-[0.3em] mb-3">Build In Public</p>
                <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6">The Startup<br />Journey</h2>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-3xl font-normal">
                  Transparency is key to my development process. On Instagram, I document the raw, unfiltered engineering journey behind HearWise. I share insights on rapidly shipping production code using modern tools like Cursor AI, Gemini, Perplexity, and n8n. It is a behind-the-scenes look at the late nights, bug fixes, and architectural breakthroughs required to build India's first school hearing screening startup from the ground up.
                </p>
                <a
                  href="https://www.instagram.com/startupwithvikash/"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-pink-500/10 border border-pink-500/30 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white text-pink-400 font-black text-sm uppercase tracking-widest transition-all"
                >
                  Follow the Journey <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ══════════════════════════════════════════════════════════
            HEARWISE TECHNOLOGIES — ABOUT THE COMPANY
        ══════════════════════════════════════════════════════════ */}
        <Reveal>
          <div className="rounded-[2.5rem] border border-emerald-500/15 bg-gradient-to-br from-emerald-950/20 to-[#05070f] p-10 sm:p-16 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.08)_0%,_transparent_60%)] pointer-events-none group-hover:opacity-200 transition-all" />
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20 flex-shrink-0">🦉</div>
              <div className="flex-1">
                <p className="text-emerald-400 font-bold text-xs uppercase tracking-[0.3em] mb-3">HearWise Technologies</p>
                <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6">India's First School<br />Hearing Screening Platform</h2>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-3xl font-normal">
                  HearWise is a groundbreaking initiative designed to democratize early hearing issue detection across Indian schools. Built with an intuitive, multi-lingual React frontend and a highly secure Supabase backend, it allows schools and clinics to rapidly screen children, generate beautiful diagnostic PDFs, and track platform-wide analytics in real-time. Paired with <strong className="text-white">HearBot</strong> — an AI assistant powered by Groq — HearWise is transforming pediatric audiology from an expensive clinical process into an accessible, scalable technological solution.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['React + TypeScript', 'Supabase', 'Groq AI', 'Vite', 'Tailwind CSS', 'Framer Motion'].map(tech => (
                    <span key={tech} className="px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ══════════════════════════════════════════════════════════
            FOOTER CTA
        ══════════════════════════════════════════════════════════ */}
        <Reveal>
          <div className="text-center space-y-6 pb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <p className="text-slate-600 text-sm font-semibold uppercase tracking-[0.3em]">Hearwise Technologies · 2026 · Built by Vikash Saravanan</p>
            <div className="flex justify-center gap-4">
              <a href="https://vikashsaravanann.github.io/Portfolio_Information/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-white/30 text-sm font-semibold transition-all">Portfolio</a>
              <a href="https://www.linkedin.com/in/vikash-saravanan-j7528/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-white/30 text-sm font-semibold transition-all">LinkedIn</a>
              <a href="https://github.com/vikashsaravanann/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-white/30 text-sm font-semibold transition-all">GitHub</a>
            </div>
          </div>
        </Reveal>

      </main>
    </div>
  );
}
