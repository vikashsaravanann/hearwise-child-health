import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseHealth } from '@/hooks/useSupabaseHealth';
import {
  LayoutDashboard,
  BarChart3,
  School,
  GraduationCap,
  Users,
  ClipboardList,
  AlertTriangle,
  History,
  LogOut,
  Menu,
  X,
  Headphones,
  Moon,
  Sun,
  UserCircle2,
  ExternalLink,
  Github,
  Instagram,
  Linkedin,
  Mail,
} from 'lucide-react';
import { format } from 'date-fns';
import { AdminTimeFilterProvider, useAdminTimeFilter } from '@/contexts/AdminTimeFilterContext';

const DATA_NAV_ITEMS = [
  { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { label: 'Schools', path: '/admin/schools', icon: School },
  { label: 'Teachers', path: '/admin/teachers', icon: GraduationCap },
  { label: 'Students', path: '/admin/students', icon: Users },
  { label: 'Sessions', path: '/admin/sessions', icon: ClipboardList },
  { label: 'Referrals', path: '/admin/referrals', icon: AlertTriangle },
  { label: 'About Developer', path: '/admin/about', icon: UserCircle2 },
  { label: 'Build in Public', href: 'https://instagram.com/startupwithvikash', icon: ExternalLink, external: true },
];

const SYSTEM_NAV_ITEMS = [
  { label: 'Login History', path: '/admin/logins', icon: History },
];

function TimeFilterBar() {
  const { preset, setPreset, setCustom, range } = useAdminTimeFilter();
  const [showCustom, setShowCustom] = useState(false);
  const [from, setFrom] = useState(format(range.from, 'yyyy-MM-dd'));
  const [to, setTo] = useState(format(range.to, 'yyyy-MM-dd'));

  useEffect(() => {
    setFrom(format(range.from, 'yyyy-MM-dd'));
    setTo(format(range.to, 'yyyy-MM-dd'));
  }, [range.from, range.to]);

  return (
    <div className="border-b border-black/10 bg-[var(--hw-surface)] px-4 py-2">
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        {[
          ['today', 'Today'],
          ['week', 'This Week'],
          ['month', 'This Month'],
          ['year', '2024-25'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setPreset(value as 'today' | 'week' | 'month' | 'year')}
            className={`rounded-full border px-3 py-1 ${preset === value ? 'border-[#2F80ED] bg-[#2F80ED] text-white' : 'border-slate-200 text-slate-500'}`}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowCustom((v) => !v)}
          className={`rounded-full border px-3 py-1 ${preset === 'custom' ? 'border-[#2F80ED] bg-[#2F80ED] text-white' : 'border-slate-200 text-slate-500'}`}
        >
          Custom
        </button>
        {showCustom && (
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded border border-slate-200 px-2 py-1" />
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded border border-slate-200 px-2 py-1" />
            <button
              type="button"
              onClick={() => {
                setCustom(new Date(`${from}T00:00:00`), new Date(`${to}T23:59:59`));
                setShowCustom(false);
              }}
              className="rounded bg-[#2F80ED] px-2 py-1 text-white"
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminLayoutInner() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('hw_admin_dark') === 'true');
  const supabaseStatus = useSupabaseHealth();

  // Blink the live indicator
  useEffect(() => {
    const iv = setInterval(() => setIsLive((v) => !v), 1500);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('hw_admin_dark', String(darkMode));
  }, [darkMode]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[var(--hw-bg)] text-[var(--hw-text)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0d1321] border-r border-white/5
          transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2F80ED]/15">
            <Headphones className="h-5 w-5 text-[#2F80ED]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">HearWise</h1>
            <p className="text-[10px] text-gray-500 -mt-0.5">Admin Portal</p>
          </div>
          <button
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[1px] text-gray-500">Data</p>
          <ul className="mt-2 space-y-1">
            {DATA_NAV_ITEMS.map(({ label, path, href, icon: Icon, external }) => {
              const active = !!path && location.pathname === path;
              const itemClasses = `
                flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
                ${active ? 'bg-[#2F80ED]/15 text-[#2F80ED]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
              `;

              if (external && href) {
                return (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={itemClasses}
                    >
                      <Icon size={18} />
                      <span className="inline-flex items-center gap-1">
                        {label}
                        <span>↗</span>
                      </span>
                    </a>
                  </li>
                );
              }

              return (
                <li key={path}>
                  <Link to={path!} onClick={() => setSidebarOpen(false)} className={itemClasses}>
                    <Icon size={18} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mt-5 px-3 text-[10px] font-semibold uppercase tracking-[1px] text-gray-500">System</p>
          <ul className="mt-2 space-y-1">
            {SYSTEM_NAV_ITEMS.map(({ label, path, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
                      ${active ? 'bg-[#2F80ED]/15 text-[#2F80ED]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/5 px-4 py-4">
          <p className="text-sm font-medium text-white">Vikash S.</p>
          <p className="text-xs text-gray-500">Super Admin</p>
          <div className="mt-2 flex items-center gap-[10px]">
            {[
              { icon: Github, href: 'https://github.com/vikashsaravanann', label: 'GitHub' },
              { icon: Instagram, href: 'https://instagram.com/startupwithvikash', label: 'Instagram' },
              { icon: Linkedin, href: 'https://www.linkedin.com/in/vikash-saravanan-j7528/', label: 'LinkedIn' },
              { icon: Mail, href: 'mailto:vikash752008@icloud.com', label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-[rgba(255,255,255,0.3)] transition-all duration-200 hover:text-[rgba(255,255,255,0.8)]"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-black/10 bg-[var(--hw-surface)] px-4 lg:px-6">
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  supabaseStatus === 'connected'
                    ? 'bg-emerald-400'
                    : supabaseStatus === 'error'
                      ? 'bg-red-400'
                      : 'bg-gray-400'
                }`}
              />
              <span className={`text-xs font-medium ${
                supabaseStatus === 'connected'
                  ? 'text-emerald-400'
                  : supabaseStatus === 'error'
                    ? 'text-red-400'
                    : 'text-gray-400'
              }`}>
                {supabaseStatus === 'connected'
                  ? 'Supabase Connected'
                  : supabaseStatus === 'error'
                    ? 'Database Error'
                    : 'Checking...'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDarkMode((v) => !v)}
              className="rounded-md border border-slate-300 p-1.5 text-slate-500 hover:text-slate-800"
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full transition-opacity duration-300 ${isLive ? 'bg-emerald-400 opacity-100' : 'bg-emerald-400 opacity-30'}`}
              />
              <span className="text-xs font-medium text-emerald-400">Live</span>
            </div>
            <span className="hidden sm:block text-xs text-gray-500 truncate max-w-48">{format(new Date(), 'dd MMM yyyy, h:mm a')}</span>
          </div>
        </header>
        <TimeFilterBar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AdminTimeFilterProvider>
      <AdminLayoutInner />
    </AdminTimeFilterProvider>
  );
}
