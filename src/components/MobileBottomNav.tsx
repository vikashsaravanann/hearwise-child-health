import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const MOBILE_TABS = [
  { icon: '🏠', label: 'HOME', path: '/' },
  { icon: '👂', label: 'TEST', path: '/hearing-test' },
  { icon: '📚', label: 'LEARN', path: '/learning-hub' },
  { icon: '🤖', label: 'HELP', path: '/get-assistance' },
  { icon: '👤', label: 'SIGN IN', path: '/login' },
];

export default function MobileBottomNav() {
  const location = useLocation();

  // Hide on dashboard, login, and auth callback
  const hideOn = ['/dashboard', '/login', '/auth/callback', '/admin'];
  if (hideOn.includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      {/* Safe area padding for iPhone home bar */}
      <div
        className="bg-[#020817]/95 backdrop-blur-xl border-t border-white/8"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {MOBILE_TABS.map(tab => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[56px]"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 rounded-xl bg-teal-500/15"
                  />
                )}
                <span className={`text-xl transition-all ${isActive ? 'scale-110' : 'scale-100 opacity-60'}`}>
                  {tab.icon}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-widest transition-all ${
                  isActive ? 'text-teal-400' : 'text-slate-500'
                }`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
