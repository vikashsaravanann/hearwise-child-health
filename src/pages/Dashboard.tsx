import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  LayoutDashboard, Users, School, Activity, TrendingUp,
  LogOut, Bell, Settings, ChevronRight, Ear, FileText,
  Globe, Shield, BarChart3, Map, MessageSquare, RefreshCw,
  CheckCircle, AlertTriangle, Clock, Star
} from 'lucide-react';

// ─── TYPES ───
interface DashboardStats {
  totalChildren: number;
  totalSchools: number;
  passRate: number;
  referRate: number;
  todayScreenings: number;
  totalReferrals: number;
}

interface RecentScreening {
  id: string;
  child_name: string;
  school_name: string;
  overall_result: 'pass' | 'refer';
  created_at: string;
}

// ─── SIDEBAR NAV ITEMS ───
const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'screenings', label: 'Screenings', icon: Ear },
  { id: 'schools', label: 'Schools', icon: School },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'audiologists', label: 'Audiologists', icon: Map },
  { id: 'chatbot', label: 'HearBot Logs', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// ─── STAT CARD ───
function StatCard({
  label, value, icon: Icon, color, suffix = '', trend
}: {
  label: string;
  value: number | string;
  icon: any;
  color: string;
  suffix?: string;
  trend?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      className="relative rounded-2xl p-5 border overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        borderColor: 'rgba(255,255,255,0.08)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
      }}
    >
      {/* Glow orb */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-2xl"
        style={{ background: color }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div
            className="p-2.5 rounded-xl"
            style={{ background: `${color}20`, border: `1px solid ${color}30` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          {trend && (
            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>

        <div
          className="text-3xl font-bold text-white mb-1"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {value}{suffix}
        </div>
        <div className="text-xs text-slate-400 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN DASHBOARD ───
export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalChildren: 0,
    totalSchools: 0,
    passRate: 0,
    referRate: 0,
    todayScreenings: 0,
    totalReferrals: 0,
  });
  const [recentScreenings, setRecentScreenings] = useState<RecentScreening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);

      const { count: totalChildren } = await supabase
        .from('screening_results')
        .select('*', { count: 'exact', head: true });

      const { count: totalSchools } = await supabase
        .from('schools')
        .select('*', { count: 'exact', head: true });

      const { count: passCount } = await supabase
        .from('screening_results')
        .select('*', { count: 'exact', head: true })
        .eq('overall_result', 'pass');

      const { count: referCount } = await supabase
        .from('screening_results')
        .select('*', { count: 'exact', head: true })
        .eq('overall_result', 'refer');

      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await supabase
        .from('screening_results')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      const total = (passCount || 0) + (referCount || 0);
      const passRate = total > 0 ? Math.round(((passCount || 0) / total) * 100) : 0;
      const referRate = total > 0 ? Math.round(((referCount || 0) / total) * 100) : 0;

      setStats({
        totalChildren: totalChildren || 0,
        totalSchools: totalSchools || 0,
        passRate,
        referRate,
        todayScreenings: todayCount || 0,
        totalReferrals: referCount || 0,
      });

      const { data: recent } = await supabase
        .from('screening_results')
        .select('id, child_name, school_name, overall_result, created_at')
        .order('created_at', { ascending: false })
        .limit(8);

      setRecentScreenings(recent || []);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: '#0a0f1e', fontFamily: "'DM Sans', sans-serif" }}
    >

      {/* ─── SIDEBAR ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 top-0 h-full w-64 z-40 flex flex-col"
            style={{
              background: 'linear-gradient(180deg, #0d1526 0%, #0a1020 100%)',
              borderRight: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Logo area */}
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <motion.img
                  src="/hearwise-child-health/owl-mascot.png"
                  alt="HearWise"
                  className="w-10 h-10 object-contain"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div>
                  <div
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    HearWise
                  </div>
                  <div className="text-[9px] text-teal-400 uppercase tracking-widest font-semibold">
                    Admin Console
                  </div>
                </div>
              </div>
            </div>

            {/* Nav items */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item, i) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setActiveNav(item.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(13,148,136,0.2), rgba(56,189,248,0.1))'
                        : 'transparent',
                      border: isActive ? '1px solid rgba(13,148,136,0.3)' : '1px solid transparent',
                    }}
                  >
                    <Icon
                      className="w-4 h-4 transition-colors"
                      style={{ color: isActive ? '#0d9488' : '#64748b' }}
                    />
                    <span
                      className="text-sm font-medium transition-colors"
                      style={{ color: isActive ? '#e2e8f0' : '#64748b' }}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-teal-400 ml-auto" />
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* CEO Profile Card */}
            <div
              className="m-4 p-4 rounded-2xl border"
              style={{
                background: 'linear-gradient(135deg, rgba(13,148,136,0.1), rgba(15,23,42,0.8))',
                borderColor: 'rgba(13,148,136,0.2)',
              }}
            >
              {/* CEO Avatar */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #0d9488, #3b82f6)' }}
                >
                  VS
                </div>
                <div>
                  <div className="text-white text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Vikash Saravanan
                  </div>
                  <div className="text-teal-400 text-[10px] uppercase tracking-wider font-semibold">
                    Founder & CEO
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-slate-400">Admin Access · Active</span>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-white/5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT ─── */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-350"
        style={{ marginLeft: sidebarOpen ? 256 : 0 }}
      >

        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-white/5"
          style={{ background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(12px)' }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-white/5"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
            <div>
              <h1
                className="text-lg font-bold text-white capitalize"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {navItems.find(n => n.id === activeNav)?.label || 'Overview'}
              </h1>
              <p className="text-xs text-slate-500">
                HearWise Technologies — Admin Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="p-2 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-teal-400/5 transition-all border border-white/5"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-white/5">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
            </button>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl border"
              style={{
                background: 'rgba(13,148,136,0.08)',
                borderColor: 'rgba(13,148,136,0.2)',
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                style={{ background: 'linear-gradient(135deg, #0d9488, #3b82f6)' }}
              >
                VS
              </div>
              <span className="text-xs text-slate-300 font-medium hidden md:block">
                Vikash Saravanan
              </span>
              <Shield className="w-3.5 h-3.5 text-teal-400" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">

          {/* ── OVERVIEW TAB ── */}
          {activeNav === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >

              {/* Welcome banner */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-6 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(13,148,136,0.2) 0%, rgba(56,189,248,0.1) 50%, rgba(15,23,42,0.8) 100%)',
                  border: '1px solid rgba(13,148,136,0.25)',
                }}
              >
                <div className="absolute right-6 top-0 bottom-0 flex items-center opacity-10">
                  <span style={{ fontSize: '8rem' }}>👂</span>
                </div>
                <div className="relative z-10">
                  <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-1">
                    Welcome back
                  </p>
                  <h2
                    className="text-2xl font-bold text-white mb-1"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, Vikash 👋
                  </h2>
                  <p className="text-slate-400 text-sm">
                    HearWise Technologies — Admin Control Centre · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard label="Children Screened" value={stats.totalChildren} icon={Users} color="#0d9488" suffix="+" trend="↑ Live" />
                <StatCard label="Schools Onboarded" value={stats.totalSchools} icon={School} color="#3b82f6" suffix="+" />
                <StatCard label="Pass Rate" value={stats.passRate} icon={CheckCircle} color="#22c55e" suffix="%" trend="Good" />
                <StatCard label="Refer Rate" value={stats.referRate} icon={AlertTriangle} color="#f59e0b" suffix="%" />
                <StatCard label="Today's Screenings" value={stats.todayScreenings} icon={Clock} color="#8b5cf6" />
                <StatCard label="Total Referrals" value={stats.totalReferrals} icon={TrendingUp} color="#ef4444" />
              </div>

              {/* Recent Screenings Table */}
              <div
                className="rounded-2xl border overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                  borderColor: 'rgba(255,255,255,0.07)',
                }}
              >
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <h3
                    className="text-white font-bold text-base"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Recent Screenings
                  </h3>
                  <button
                    onClick={() => setActiveNav('screenings')}
                    className="text-xs text-teal-400 hover:text-teal-300 transition-colors font-medium"
                  >
                    View All →
                  </button>
                </div>

                {loading ? (
                  <div className="p-8 text-center text-slate-500 text-sm">Loading data...</div>
                ) : recentScreenings.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No screenings yet. Data will appear here once teachers start screening children.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="px-6 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Child Name</th>
                          <th className="px-6 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">School</th>
                          <th className="px-6 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Result</th>
                          <th className="px-6 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {recentScreenings.map((s, i) => (
                          <motion.tr
                            key={s.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="hover:bg-white/2 transition-colors"
                          >
                            <td className="px-6 py-3 text-slate-200 font-medium">{s.child_name}</td>
                            <td className="px-6 py-3 text-slate-400">{s.school_name}</td>
                            <td className="px-6 py-3">
                              <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide"
                                style={{
                                  background: s.overall_result === 'pass' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                                  color: s.overall_result === 'pass' ? '#4ade80' : '#f87171',
                                  border: `1px solid ${s.overall_result === 'pass' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                }}
                              >
                                {s.overall_result === 'pass' ? '✓' : '⚠'} {s.overall_result}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-slate-500 text-xs">
                              {new Date(s.created_at).toLocaleDateString('en-IN')}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* CEO Profile Section */}
              <div
                className="rounded-2xl border p-6 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(13,148,136,0.08) 0%, rgba(59,130,246,0.05) 100%)',
                  borderColor: 'rgba(13,148,136,0.2)',
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 blur-2xl rounded-full"
                  style={{ background: 'radial-gradient(circle, #0d9488, transparent)' }} />

                <div className="flex items-start gap-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0d9488 0%, #3b82f6 100%)', fontFamily: "'Syne', sans-serif" }}
                  >
                    VS
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>
                        Vikash Saravanan
                      </h3>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                        style={{ background: 'rgba(13,148,136,0.2)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.3)' }}
                      >
                        Founder & CEO
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                      >
                        Admin
                      </span>
                    </div>
                    <p className="text-teal-400 text-xs font-semibold mb-2">
                      HearWise Technologies Pvt. Ltd. · Coimbatore, Tamil Nadu, India
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed mb-3">
                      B.Tech AI & Data Science student at Rathinam Technical Campus, Coimbatore (Class of 2029).
                      AI Engineer, Prompt Engineer, and Full-Stack Web Developer. Building India's first mobile school
                      hearing screening platform to eliminate undetected childhood hearing loss.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Python', 'React', 'TypeScript', 'Supabase', 'n8n', 'Prompt Engineering', 'AI Automation'].map(skill => (
                        <span
                          key={skill}
                          className="text-[10px] px-2.5 py-1 rounded-lg font-medium"
                          style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-5 border-t border-white/5">
                  {[
                    { label: 'Hackathon', value: 'Finalist', sub: 'Meta PyTorch OpenEnv' },
                    { label: 'Certifications', value: '15+', sub: 'Professional certs' },
                    { label: 'Live Projects', value: '3+', sub: 'Production ready' },
                    { label: 'Focus', value: 'AI + Health', sub: 'HearWise + Automation' },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="text-white font-bold text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {item.value}
                      </div>
                      <div className="text-teal-400 text-[10px] font-semibold">{item.label}</div>
                      <div className="text-slate-500 text-[10px]">{item.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-4">
                  <a
                    href="https://vikashsaravanann.github.io/Portfolio_Information/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                    style={{ background: 'rgba(13,148,136,0.15)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.25)' }}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Portfolio
                  </a>
                  <a
                    href="https://github.com/vikashsaravanann"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com/in/vikash-saravanan-j7528"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                    style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}
                  >
                    LinkedIn
                  </a>
                </div>
              </div>

            </motion.div>
          )}

          {/* ── OTHER TABS — placeholder panels ── */}
          {activeNav !== 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[50vh] text-center"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.2)' }}
              >
                {(() => {
                  const item = navItems.find(n => n.id === activeNav);
                  const Icon = item?.icon || LayoutDashboard;
                  return <Icon className="w-8 h-8 text-teal-400" />;
                })()}
              </div>
              <h3 className="text-white font-bold text-xl mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                {navItems.find(n => n.id === activeNav)?.label}
              </h3>
              <p className="text-slate-500 text-sm max-w-xs">
                This section is being built. Data from Supabase will appear here once the relevant tables are populated.
              </p>
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
}
