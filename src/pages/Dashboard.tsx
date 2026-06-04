import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw, Shield, LogOut, CheckCircle, AlertTriangle, User,
  Mail, Smartphone, Key, Lock, PlayCircle, GitCommit, Copy, Ear
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// --- TYPES ---
interface DashboardData {
  stats: {
    totalChildren: number;
    totalSchools: number;
    passRate: number;
    referRate: number;
    todayCount: number;
    totalUsers: number;
  };
  loginLogs: any[];
  screenings: any[];
  videoViews: any[];
  teacherSessions: any[];
  timelineEvents: any[];
  loginChartData: any[];
  dailySignups: any[];
  healthChecks: any[];
  envChecks: any[];
  routeChecks: any[];
  githubCommits: any[];
}

// --- CONSTANTS ---
const SECTION_STYLE = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '20px',
  padding: '32px',
  marginBottom: '24px'
};

const PAGE_BG = '#0a0f1e';
const NAV_BG = 'rgba(10, 15, 30, 0.97)';
const ANIM_VIEWPORT = { once: true, margin: '-60px' };

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [time, setTime] = useState(new Date());
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [aiAdvice, setAiAdvice] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Time update
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch all data
  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  async function fetchAllDashboardData() {
    setLoading(true);
    try {
      const [
        statsData,
        logsData,
        screeningsData,
        videoData,
        teacherData,
        timelineData,
        healthData,
        commitsData
      ] = await Promise.all([
        fetchStats(),
        fetchLoginLogs(),
        fetchScreenings(),
        fetchVideoViews(),
        fetchTeacherSessions(),
        fetchActivityTimeline(),
        fetchHealthChecks(),
        fetchGitHubCommits(),
      ]);

      setData({
        stats: statsData,
        loginLogs: logsData.logs,
        loginChartData: logsData.chartData,
        dailySignups: logsData.dailySignups,
        screenings: screeningsData,
        videoViews: videoData,
        teacherSessions: teacherData,
        timelineEvents: timelineData,
        healthChecks: healthData.tables,
        envChecks: healthData.envs,
        routeChecks: healthData.routes,
        githubCommits: commitsData,
      });
    } catch (e: any) {
      console.error('Failed to load dashboard data:', e);
      setErrorMsg(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  // --- FETCHERS ---
  async function fetchStats() {
    const { count: totalChildren } = await supabase.from('screening_results').select('*', { count: 'exact', head: true });
    const { count: totalSchools } = await supabase.from('schools').select('*', { count: 'exact', head: true });
    const { count: passCount } = await supabase.from('screening_results').select('*', { count: 'exact', head: true }).eq('overall_result', 'pass');
    const { count: referCount } = await supabase.from('screening_results').select('*', { count: 'exact', head: true }).eq('overall_result', 'refer');
    
    const today = new Date().toISOString().split('T')[0];
    const { count: todayCount } = await supabase.from('screening_results').select('*', { count: 'exact', head: true }).gte('created_at', today);
    const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).catch(() => ({ count: 0 }));

    const total = (passCount || 0) + (referCount || 0);
    const passRate = total > 0 ? Math.round(((passCount || 0) / total) * 100) : 0;
    const referRate = 100 - passRate;

    return {
      totalChildren: totalChildren || 0,
      totalSchools: totalSchools || 0,
      passRate,
      referRate,
      todayCount: todayCount || 0,
      totalUsers: totalUsers || 0,
    };
  }

  async function fetchLoginLogs() {
    const { data: logs } = await supabase
      .from('login_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
      
    // Chart data
    const methodCounts = (logs || []).reduce((acc: any, log: any) => {
      acc[log.login_method] = (acc[log.login_method] || 0) + 1;
      return acc;
    }, {});
    
    const chartData = [
      { name: 'Google', value: methodCounts['google'] || 0, color: '#3b82f6' },
      { name: 'Email OTP', value: methodCounts['email_otp'] || 0, color: '#0d9488' },
      { name: 'Phone OTP', value: methodCounts['phone_otp'] || 0, color: '#22c55e' },
      { name: 'Email/Pass', value: methodCounts['email_password'] || 0, color: '#a855f7' },
    ];

    return { logs: logs || [], chartData, dailySignups: [] };
  }

  async function fetchScreenings() {
    const { data } = await supabase
      .from('screening_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    return data || [];
  }

  async function fetchVideoViews() {
    const { data } = await supabase
      .from('video_views')
      .select('*')
      .order('watched_at', { ascending: false })
      .limit(100);
      
    // Group
    const grouped = (data || []).reduce((acc: any, row: any) => {
      if (!acc[row.video_title]) acc[row.video_title] = { count: 0, emails: [] };
      acc[row.video_title].count += 1;
      if (row.viewer_email && !acc[row.video_title].emails.includes(row.viewer_email)) {
        acc[row.video_title].emails.push(row.viewer_email);
      }
      return acc;
    }, {});
    
    return Object.entries(grouped).map(([title, val]: any) => ({ title, count: val.count, emails: val.emails }));
  }

  async function fetchTeacherSessions() {
    const { data } = await supabase
      .from('school_registrations') // fallback table
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    return data || [];
  }

  async function fetchActivityTimeline() {
    const { data: logs } = await supabase.from('login_logs').select('id, email, login_method, created_at').order('created_at', { ascending: false }).limit(10);
    const { data: screens } = await supabase.from('screening_results').select('id, child_name, school_name, overall_result, created_at').order('created_at', { ascending: false }).limit(10);
    
    let events = [
      ...(logs || []).map((l: any) => ({
        id: 'l'+l.id, type: 'login', date: new Date(l.created_at || Date.now()), data: l
      })),
      ...(screens || []).map((s: any) => ({
        id: 's'+s.id, type: 'screening', date: new Date(s.created_at || Date.now()), data: s
      }))
    ];
    events.sort((a, b) => b.date.getTime() - a.date.getTime());
    return events.slice(0, 20);
  }

  async function fetchHealthChecks() {
    const checks = [
      { name: 'screening_results', query: () => supabase.from('screening_results').select('id').limit(1) },
      { name: 'schools', query: () => supabase.from('schools').select('id').limit(1) },
      { name: 'login_logs', query: () => supabase.from('login_logs').select('id').limit(1) },
      { name: 'video_views', query: () => supabase.from('video_views').select('id').limit(1) },
      { name: 'audiologist_applications', query: () => supabase.from('audiologist_applications').select('id').limit(1) },
      { name: 'school_registrations', query: () => supabase.from('school_registrations').select('id').limit(1) },
    ];

    const results = await Promise.allSettled(checks.map(async (c) => {
      try {
        const { error } = await c.query();
        return { name: c.name, status: error ? 'error' : 'ok', message: error?.message || 'Operational' };
      } catch (e: any) {
        return { name: c.name, status: 'error', message: e.message };
      }
    }));
    
    const tables = results.map((r: any) => r.value);
    
    const envs = [
      { name: 'VITE_SUPABASE_URL', value: import.meta.env.VITE_SUPABASE_URL },
      { name: 'VITE_SUPABASE_ANON_KEY', value: !!import.meta.env.VITE_SUPABASE_ANON_KEY },
      { name: 'VITE_ADMIN_EMAIL', value: import.meta.env.VITE_ADMIN_EMAIL },
      { name: 'VITE_ANTHROPIC_API_KEY', value: !!import.meta.env.VITE_ANTHROPIC_API_KEY },
    ];
    
    const routes = [
      { path: '/', exists: true },
      { path: '/login', exists: true },
      { path: '/dashboard', exists: true },
    ];
    
    return { tables, envs, routes };
  }

  async function fetchGitHubCommits() {
    try {
      const res = await fetch('https://api.github.com/repos/vikashsaravanann/hearwise-child-health/commits?per_page=8');
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  }

  async function handleAskAi() {
    setAiLoading(true);
    try {
      const errors = data?.healthChecks.filter(c => c.status === 'error').map(c => `${c.name}: ${c.message}`).join('\\n') || 'No errors found.';
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          system: "You are a helpful technical assistant for HearWise Technologies, a React + TypeScript + Supabase web app. When given a list of errors from the platform's dashboard health check, you give clear, actionable, numbered steps to fix each error. Write in plain English. No markdown symbols. Use emojis for each step. Be specific to Supabase, React, and Vite.",
          messages: [{ role: 'user', content: `These errors were found in the HearWise platform health check:\\n\\n${errors}\\n\\nPlease tell me exactly how to fix each one, step by step.` }]
        })
      });
      const aiData = await res.json();
      setAiAdvice(aiData.content?.[0]?.text || 'No advice could be loaded.');
    } catch (e) {
      setAiAdvice('Error calling AI advisor. Ensure VITE_ANTHROPIC_API_KEY is valid.');
    } finally {
      setAiLoading(false);
    }
  }

  if (loading || (!data && !errorMsg)) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(12px)' }}>
        <motion.img
          src={`${import.meta.env.BASE_URL}owl-mascot.png`}
          className="w-16 h-16 object-contain mb-4"
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/owl-mascot.png'; }}
        />
        <p className="text-teal-400 text-sm font-bold tracking-widest mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          LOADING DASHBOARD DATA...
        </p>
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center"
        style={{ background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(12px)' }}>
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Error Loading Dashboard</h2>
        <p className="text-slate-400 mb-6">{errorMsg}</p>
        <button onClick={() => { setErrorMsg(null); fetchAllDashboardData(); }} className="px-6 py-2 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-lg transition-colors">
          Retry Loading
        </button>
      </div>
    );
  }

  if (!data) return null;

  // --- RENDER HELPERS ---
  const SectionHeader = ({ num, title, sub }: any) => (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-teal-400 font-bold text-lg opacity-80">0{num}</span>
        <div className="h-px bg-gradient-to-r from-teal-400/50 to-transparent flex-1" />
      </div>
      <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-2xl font-bold text-white mb-1">
        {title}
      </h2>
      <p className="text-slate-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {sub}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen text-slate-200" style={{ background: PAGE_BG, fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* 0 — STICKY HEADER */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: NAV_BG, backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-4">
          <motion.img
            src={`${import.meta.env.BASE_URL}owl-mascot.png`}
            className="w-10 h-10 object-contain"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div>
            <h1 className="text-white font-bold text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>HearWise</h1>
            <p className="text-teal-400 text-[10px] uppercase tracking-widest font-bold">Admin Intelligence Centre</p>
          </div>
        </div>
        
        <div className="hidden md:block text-teal-400 text-sm font-medium">
          {time.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} · {time.toLocaleTimeString('en-GB')}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-green-400">System Online</span>
          </div>
          <button onClick={fetchAllDashboardData} className="p-2 text-slate-400 hover:text-white transition-colors" title="Refresh Data">
            <RefreshCw className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 pl-4 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center font-bold text-xs text-white">
              VS
            </div>
            <div className="hidden md:block text-xs">
              <div className="font-bold text-white flex items-center gap-1">Vikash Saravanan <Shield className="w-3 h-3 text-teal-400" /></div>
              <div className="text-slate-400">Admin</div>
            </div>
          </div>
          <button onClick={() => signOut().then(() => navigate('/login'))} className="p-2 text-slate-400 hover:text-red-400 transition-colors" title="Sign Out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-5 sm:p-6 md:p-6 sm:p-8 space-y-12">
        
        {/* 1 — CEO PROFILE HERO CARD */}
        <motion.section
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={ANIM_VIEWPORT} transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            background: 'linear-gradient(135deg, rgba(13,148,136,0.08) 0%, rgba(59,130,246,0.05) 50%, rgba(139,92,246,0.05) 100%)',
            border: '1px solid rgba(13,148,136,0.2)',
            borderRadius: '24px',
            padding: '40px'
          }}
          className="flex flex-col lg:flex-row gap-10"
        >
          <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mb-6"
              style={{ background: 'linear-gradient(135deg, #0d9488 0%, #3b82f6 50%, #8b5cf6 100%)', fontFamily: "'Syne', sans-serif" }}>
              VS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Vikash Saravanan</h2>
            <div className="flex flex-wrap gap-2 mb-4 justify-center lg:justify-start">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">Founder & CEO</span>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">Admin</span>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">AI Engineer</span>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">Prompt Engineer</span>
            </div>
            <p className="text-slate-300 font-medium mb-1">HearWise Technologies Pvt. Ltd.</p>
            <p className="text-slate-400 text-sm mb-1">Coimbatore, Tamil Nadu, India · Native: Karur</p>
            <p className="text-slate-400 text-sm mb-4">B.Tech AI & Data Science — Rathinam Technical Campus (Class of 2029)</p>
            <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold text-green-400">Available for Internships & Collaboration</span>
            </div>
          </div>
          
          <div className="flex-1">
            <p className="text-slate-300 leading-relaxed mb-8">
              Vikash Saravanan is an ambitious first-year B.Tech AI and Data Science student at Rathinam Technical Campus, Coimbatore. He is the sole founder and architect of HearWise Technologies — India's first mobile school hearing screening platform. As an AI Engineer, Prompt Engineer, and Full-Stack Web Developer, Vikash bridges advanced machine learning with full-stack software architecture. His mission is to engineer high-performance systems that solve real-world challenges in healthcare and education. He is intensely focused on securing high-impact internship opportunities and building production-ready AI systems.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white font-bold mb-1">Hackathon Finalist</p>
                <p className="text-xs text-slate-400">Meta PyTorch OpenEnv (Team: Fresh Tensors, Scaler)</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white font-bold mb-1">15+ Certifications</p>
                <p className="text-xs text-slate-400">Microsoft, LinkedIn, Cisco, IIT Bombay, freeCodeCamp</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white font-bold mb-1">3+ Live Projects</p>
                <p className="text-xs text-slate-400">HearWise, Traffic Vision AI, Support Ticket Triage</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white font-bold mb-1">AI Automation Focus</p>
                <p className="text-xs text-slate-400">Python, React, n8n, Supabase, Prompt Engineering</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {['Python', 'React', 'TypeScript', 'Supabase', 'n8n', 'YOLOv8', 'Prompt Engineering', 'Tailwind CSS', 'FastAPI', 'Docker'].map(s => (
                <span key={s} className="px-2.5 py-1 text-[11px] font-semibold bg-white/10 rounded-lg text-slate-300 border border-white/5">{s}</span>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm font-semibold">
              <a href="https://vikashsaravanann.github.io/Portfolio_Information/" target="_blank" className="text-teal-400 hover:underline">Portfolio</a>
              <a href="https://github.com/vikashsaravanann" target="_blank" className="text-blue-400 hover:underline">GitHub</a>
              <a href="https://linkedin.com/in/vikash-saravanan-j7528" target="_blank" className="text-blue-500 hover:underline">LinkedIn</a>
              <a href="#" className="text-pink-400 hover:underline">@startupwithvikash</a>
              <a href="mailto:vikash07052008@gmail.com" className="text-purple-400 hover:underline">Email</a>
            </div>
          </div>
        </motion.section>

        {/* 2 — HEARWISE PLATFORM OVERVIEW CARD */}
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={ANIM_VIEWPORT} transition={{ duration: 0.6 }} style={SECTION_STYLE}>
          <div className="flex flex-col md:flex-row items-center gap-6 sm:p-8">
            <motion.img src={`${import.meta.env.BASE_URL}owl-mascot.png`} className="w-32 h-32" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 gap-6 sm:p-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>HearWise Technologies</h3>
                <p className="text-teal-400 font-semibold mb-4">India's First Mobile School Hearing Screening Platform</p>
                <p className="text-slate-400 text-sm mb-2">Founded: 2024 · Coimbatore, Tamil Nadu</p>
                <p className="text-slate-400 text-sm mb-2">Live at: <a href="https://vikashsaravanann.github.io/hearwise-child-health/" className="text-teal-400 underline">hearwise-child-health</a></p>
                <p className="text-slate-400 text-sm">Stack: React 18 + Vite + TypeScript + Supabase + Tailwind + Framer Motion</p>
              </div>
              <div className="text-sm space-y-2 text-slate-300">
                <p>👂 Hearing test with nature sounds (ocean, birds)</p>
                <p>📱 Works on any Android smartphone</p>
                <p>🏫 Designed for school teachers</p>
                <p>🔬 5 levels per ear = 10 total checks</p>
                <p>📄 Auto-generates PDF report</p>
                <p>🤖 HearBot AI chatbot powered by Anthropic</p>
                <p>📲 PWA — installable on Android, works offline</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 3 — LIVE PLATFORM STATISTICS */}
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={ANIM_VIEWPORT} transition={{ duration: 0.6 }}>
          <SectionHeader num="1" title="Live Platform Statistics" sub="Real-time data pulled from Supabase — refreshes on every page load" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Children Screened", value: data.stats.totalChildren, icon: "👂", color: "#0d9488" },
              { label: "Schools Onboarded", value: data.stats.totalSchools, icon: "🏫", color: "#3b82f6" },
              { label: "Overall Pass Rate", value: data.stats.passRate + "%", icon: "✅", color: "#22c55e" },
              { label: "Refer Rate", value: data.stats.referRate + "%", icon: "⚠️", color: "#f59e0b" },
              { label: "Screened Today", value: data.stats.todayCount, icon: "📅", color: "#8b5cf6" },
              { label: "Registered Users", value: data.stats.totalUsers, icon: "👤", color: "#ec4899" }
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={ANIM_VIEWPORT} transition={{ delay: i * 0.08 }} className="relative bg-white/5 border border-white/10 p-5 rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform cursor-default">
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20 blur-2xl" style={{ backgroundColor: stat.color }} />
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
                <div className="absolute top-3 right-3 text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">↑ Live Data</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 4 — USER LOGIN ACTIVITY TABLE */}
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={ANIM_VIEWPORT} transition={{ duration: 0.6 }} style={SECTION_STYLE}>
          <SectionHeader num="2" title="User Login Activity" sub="Every user who has logged into HearWise — their email, login method, and last active time" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="px-4 py-3">Avatar</th>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Email / Phone</th>
                  <th className="px-4 py-3">Login Method</th>
                  <th className="px-4 py-3">Login Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.loginLogs.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-500">No login activity yet.</td></tr>
                )}
                {data.loginLogs.map(log => (
                  <tr key={log.id} className="hover:bg-teal-500/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
                        {log.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{log.full_name || 'Anonymous'}</td>
                    <td className="px-4 py-3 text-slate-300">{log.email || log.phone_number}</td>
                    <td className="px-4 py-3">
                      {log.login_method === 'google' && <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">🔵 Google</span>}
                      {log.login_method === 'email_otp' && <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs font-semibold">📧 Email OTP</span>}
                      {log.login_method === 'phone_otp' && <span className="px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">📱 Phone OTP</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* 5 — HEARING TEST RECORDS */}
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={ANIM_VIEWPORT} transition={{ duration: 0.6 }}>
          <SectionHeader num="3" title="Hearing Test Records" sub="Every child screened — teacher name, student details, district, results per ear" />
          <div className="space-y-3">
            {data.screenings.length === 0 && (
              <div className="p-6 sm:p-8 text-center text-slate-500 bg-white/5 rounded-xl border border-white/10">No hearing tests conducted yet.</div>
            )}
            {data.screenings.map(s => (
              <div key={s.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden cursor-pointer" onClick={() => setExpandedRowId(expandedRowId === s.id ? null : s.id)}>
                <div className="px-6 py-4 flex items-center justify-between hover:bg-white/5">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">🧒</span>
                    <div>
                      <p className="text-white font-bold">{s.child_name}</p>
                      <p className="text-xs text-slate-400">{s.child_age} yrs · Grade {s.child_grade} · {s.school_name}, {s.district}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {s.overall_result === 'pass' ? (
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> PASS</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> REFER</span>
                    )}
                    <span className="text-xs text-slate-500">{new Date(s.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {expandedRowId === s.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="px-6 py-4 border-t border-white/10 bg-black/20 flex flex-col md:flex-row gap-6 sm:p-8">
                    <div className="flex-1 space-y-2 text-sm text-slate-300">
                      <p><strong className="text-white">Location:</strong> {s.location || s.district}</p>
                      <p><strong className="text-white">Teacher:</strong> {s.teacher_name} ({s.teacher_email})</p>
                      <div className="pt-2">
                        <p className="text-xs uppercase text-slate-500 font-bold mb-1">Left Ear Results</p>
                        <div className="flex gap-2">
                          {(s.left_ear_results || Array(5).fill('pass')).map((r: string, i: number) => (
                            <span key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${r === 'pass' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>L{i+1}</span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2">
                        <p className="text-xs uppercase text-slate-500 font-bold mb-1">Right Ear Results</p>
                        <div className="flex gap-2">
                          {(s.right_ear_results || Array(5).fill('pass')).map((r: string, i: number) => (
                            <span key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${r === 'pass' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>L{i+1}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* 6 — VIDEO VIEWS */}
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={ANIM_VIEWPORT} transition={{ duration: 0.6 }} style={SECTION_STYLE}>
          <SectionHeader num="4" title="Video Engagement Tracker" sub="Track which explainer videos users are watching" />
          <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:p-6">
            {data.videoViews.length === 0 && <p className="text-slate-500 col-span-3">No video view data yet.</p>}
            {data.videoViews.map((v, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <PlayCircle className="w-8 h-8 text-teal-400 mb-3" />
                <h3 className="text-white font-bold mb-2 line-clamp-2">{v.title}</h3>
                <div className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>{v.count} Views</div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-2">Recent Viewers:</p>
                  {v.emails.slice(0,5).map((e: string, j: number) => <p key={j} className="text-xs text-slate-300 truncate">{e}</p>)}
                  {v.emails.length > 5 && <p className="text-xs text-teal-400">+{v.emails.length - 5} more</p>}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 7 & 8 — TIMELINE & CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 gap-6 sm:p-8">
          <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={ANIM_VIEWPORT} transition={{ duration: 0.6 }} style={SECTION_STYLE} className="h-[600px] flex flex-col">
            <SectionHeader num="5" title="Recent Platform Activity" sub="A live feed of everything happening on HearWise right now" />
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {data.timelineEvents.map((ev, i) => (
                <div key={ev.id} className="flex gap-4 relative">
                  <div className="absolute left-[11px] top-5 sm:p-6 bottom-[-24px] w-px bg-white/10" />
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${ev.type === 'login' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                    {ev.type === 'login' ? <User className="w-3 h-3" /> : <Ear className="w-3 h-3" />}
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">
                      {ev.type === 'login' ? (
                        <span><strong className="text-white">{ev.data.email}</strong> logged in via {ev.data.login_method}</span>
                      ) : (
                        <span>Hearing test {ev.data.overall_result} for <strong className="text-white">{ev.data.child_name}</strong> at {ev.data.school_name}</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{ev.date.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={ANIM_VIEWPORT} transition={{ duration: 0.6 }} style={SECTION_STYLE}>
            <SectionHeader num="6" title="Login Method Analytics" sub="How users choose to sign in" />
            <div className="h-64 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.loginChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {data.loginChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} itemStyle={{ color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.loginChartData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-sm text-slate-300">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* 10 — WEBSITE ERROR MONITOR */}
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={ANIM_VIEWPORT} transition={{ duration: 0.6 }} style={SECTION_STYLE}>
          <SectionHeader num="7" title="Website Health & Error Monitor" sub="Live detection of errors, warnings, and issues" />
          
          <div className="mb-6"><h3 className="text-white font-bold mb-3 uppercase text-sm tracking-widest text-slate-400">Database Tables Health</h3>
            <div className="grid grid-cols-2 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.healthChecks.map((c, i) => (
                <div key={i} className={`p-4 rounded-xl border ${c.status === 'ok' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  <div className="flex items-center gap-2 font-bold mb-1">{c.status === 'ok' ? <CheckCircle className="w-4 h-4"/> : <AlertTriangle className="w-4 h-4"/>} {c.name}</div>
                  <div className="text-xs opacity-80">{c.message}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8"><h3 className="text-white font-bold mb-3 uppercase text-sm tracking-widest text-slate-400">Environment Config</h3>
            <div className="flex flex-wrap gap-3">
              {data.envChecks.map(c => (
                <div key={c.name} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${c.value ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {c.name}: {c.value ? 'SET' : 'MISSING'}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-teal-900/20 border border-teal-500/30 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">🤖 AI Fix Advisor</h3>
              <button onClick={handleAskAi} disabled={aiLoading} className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-lg text-sm disabled:opacity-50 transition-colors">
                {aiLoading ? 'Analyzing...' : 'Ask AI for Help'}
              </button>
            </div>
            {aiAdvice && (
              <div className="p-4 bg-black/30 rounded-xl text-sm text-teal-100 whitespace-pre-wrap leading-relaxed border border-teal-500/20">
                {aiAdvice}
              </div>
            )}
            {!aiAdvice && <p className="text-slate-400 text-sm">Click the button to send any detected errors above to Anthropic Claude for automated fix instructions.</p>}
          </div>
        </motion.section>

        {/* 11 — GITHUB COMMITS */}
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={ANIM_VIEWPORT} transition={{ duration: 0.6 }} style={SECTION_STYLE}>
          <SectionHeader num="8" title="Latest GitHub Activity" sub="Most recent code updates to the HearWise repository" />
          <div className="space-y-4">
            {data.githubCommits.map((c: any) => (
              <a key={c.sha} href={c.html_url} target="_blank" className="block p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors">
                <div className="flex items-start gap-4">
                  <GitCommit className="w-5 h-5 text-teal-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white font-bold mb-1">{c.commit.message}</p>
                    <p className="text-xs text-slate-400">Author: {c.commit.author.name} · {new Date(c.commit.author.date).toLocaleString()}</p>
                  </div>
                  <span className="px-2 py-1 bg-black/40 text-slate-400 rounded text-xs font-mono">{c.sha.substring(0,7)}</span>
                </div>
              </a>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}
