/**
 * AdminLayout — Dark sidebar navigation shell for all /admin/* pages.
 */
import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  LayoutDashboard,
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
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Schools', path: '/admin/schools', icon: School },
  { label: 'Teachers', path: '/admin/teachers', icon: GraduationCap },
  { label: 'Students', path: '/admin/students', icon: Users },
  { label: 'Sessions', path: '/admin/sessions', icon: ClipboardList },
  { label: 'Referrals', path: '/admin/referrals', icon: AlertTriangle },
  { label: 'Login History', path: '/admin/logins', icon: History },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLive, setIsLive] = useState(true);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#0f1729]">
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
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                      ${active
                        ? 'bg-[#2F80ED]/15 text-[#2F80ED]'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'}
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
          <p className="truncate text-xs text-gray-500">{userEmail}</p>
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
        <header className="flex h-14 items-center justify-between border-b border-white/5 px-4 lg:px-6">
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
                className={`h-2 w-2 rounded-full transition-opacity duration-300 ${isLive ? 'bg-emerald-400 opacity-100' : 'bg-emerald-400 opacity-30'}`}
              />
              <span className="text-xs font-medium text-emerald-400">Live</span>
            </div>
            <span className="hidden sm:block text-xs text-gray-500 truncate max-w-48">{userEmail}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
