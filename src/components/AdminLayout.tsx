import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  LayoutGrid,
  ChartSpline,
  Building2,
  UserRound,
  UsersRound,
  Clock3,
  BadgeCheck,
  Shield,
  Settings,
  Download,
  LogOut,
  Menu,
  X,
  Headset,
} from 'lucide-react';
import { AdminFilterProvider, useAdminFilter, type AdminRangePreset } from '@/contexts/AdminFilterContext';

const NAV_SECTIONS = [
  {
    section: 'MAIN',
    items: [
      { label: 'Overview', path: '/admin/dashboard', icon: LayoutGrid },
      { label: 'Analytics', path: '/admin/analytics', icon: ChartSpline },
    ],
  },
  {
    section: 'DATA',
    items: [
      { label: 'Schools', path: '/admin/schools', icon: Building2 },
      { label: 'Teachers', path: '/admin/teachers', icon: UserRound },
      { label: 'Students', path: '/admin/students', icon: UsersRound, badgeKey: 'referrals' as const },
      { label: 'Test Sessions', path: '/admin/sessions', icon: Clock3 },
      { label: 'Referrals', path: '/admin/referrals', icon: BadgeCheck },
      { label: 'Login History', path: '/admin/logins', icon: Shield },
    ],
  },
  {
    section: 'SYSTEM',
    items: [
      { label: 'Settings', path: '/admin/settings', icon: Settings },
      { label: 'Export Data', path: '/admin/export', icon: Download },
    ],
  },
] as const;

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Overview',
  '/admin/analytics': 'Analytics',
  '/admin/schools': 'Schools',
  '/admin/teachers': 'Teachers',
  '/admin/students': 'Students',
  '/admin/sessions': 'Test Sessions',
  '/admin/referrals': 'Referrals',
  '/admin/logins': 'Login History',
  '/admin/settings': 'Settings',
  '/admin/export': 'Export Data',
};

function TimeFilterBar() {
  const { preset, setPreset, range, setCustomRange } = useAdminFilter();
  const buttons: { id: AdminRangePreset; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: '2024-25' },
  ];

  return (
    <div className="border-b border-black/10 bg-white px-4 py-2 lg:px-6">
      <div className="flex flex-wrap items-center gap-2">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => setPreset(btn.id)}
            className={`rounded-full border px-3 py-1 text-[11px] transition-colors ${
              preset === btn.id
                ? 'border-[#2F80ED] bg-[#2F80ED] text-white'
                : 'border-slate-200 bg-white text-slate-500 hover:border-[#2F80ED]/40 hover:text-[#2F80ED]'
            }`}
          >
            {btn.label}
          </button>
        ))}
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1">
          <input
            type="date"
            value={range.from}
            onChange={(e) => setCustomRange(e.target.value, range.to)}
            className="bg-transparent text-[11px] text-slate-500 outline-none"
          />
          <span className="text-[11px] text-slate-400">to</span>
          <input
            type="date"
            value={range.to}
            onChange={(e) => setCustomRange(range.from, e.target.value)}
            className="bg-transparent text-[11px] text-slate-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLive, setIsLive] = useState(true);
  const [referralCount, setReferralCount] = useState(0);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? '');
    });
  }, []);

  // Blink the live indicator
  useEffect(() => {
    const iv = setInterval(() => setIsLive((v) => !v), 1500);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const loadReferrals = async () => {
      const { count } = await supabase
        .from('referrals')
        .select('id', { head: true, count: 'exact' })
        .eq('doctor_visited', false);
      setReferralCount(count ?? 0);
    };

    loadReferrals();
    const channel = supabase
      .channel('admin-nav-referrals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'referrals' }, () => loadReferrals())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Admin Console';
  const displayTime = now.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <AdminFilterProvider>
      <div className="flex min-h-screen bg-[#F8FAFF] text-[#0F172A]">
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
          fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col bg-[#0F172A] border-r border-white/10
          transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-[18px] py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2F80ED]/20">
            <Headset className="h-4 w-4 text-[#2F80ED]" />
          </div>
          <div>
            <h1 className="text-[15px] font-medium text-white">HearWise</h1>
            <p className="text-[10px] text-white/35">Admin Console</p>
          </div>
          <button
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_SECTIONS.map((group) => (
            <div key={group.section}>
              <p className="px-[18px] pb-1 pt-3 text-[9px] uppercase tracking-[1.5px] text-white/30">
                {group.section}
              </p>
              <ul>
                {group.items.map(({ label, path, icon: Icon, badgeKey }) => {
                  const active = location.pathname === path;
                  return (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={() => setSidebarOpen(false)}
                        className={`mx-2 my-0.5 flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] transition-all ${
                          active
                            ? 'bg-[#2F80ED] text-white shadow-[0_2px_8px_rgba(47,128,237,0.3)]'
                            : 'text-white/55 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon size={15} />
                        <span className="truncate">{label}</span>
                        {badgeKey === 'referrals' && referralCount > 0 && (
                          <span className="ml-auto rounded-full bg-[rgba(235,87,87,0.2)] px-1.5 py-0.5 text-[9px] text-[#F87171]">
                            {referralCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2F80ED] text-[11px] font-medium text-white">
              VS
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-white/80">Vikash S.</p>
              <p className="truncate text-[10px] text-white/35">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-50 flex h-[52px] items-center justify-between border-b border-black/10 bg-white px-4 lg:px-6">
          <button
            className="text-slate-500 hover:text-slate-800 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <p className="text-sm font-medium text-[#0F172A]">{pageTitle}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span
                className={`h-1.5 w-1.5 rounded-full bg-[#27AE60] transition-opacity duration-300 ${isLive ? 'opacity-100' : 'opacity-30'}`}
              />
              <span className="text-[11px] text-[#27AE60]">Live</span>
            </div>
            <span className="hidden text-[11px] text-slate-400 sm:block">{displayTime}</span>
          </div>
        </header>
        <TimeFilterBar />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
    </AdminFilterProvider>
  );
}
