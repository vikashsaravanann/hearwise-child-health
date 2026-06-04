import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const NAV_LINKS = [
  { label: 'FEATURES', path: '/features' },
  { label: 'ABOUT HEARWISE', path: '/about' },
  { label: 'HEALTH OPERATIONS', path: '/hearing-health' },
  { label: 'REGISTER SCHOOL', path: '/register-school' },
];

const LANG_OPTIONS = ['EN', 'தமிழ்', 'हिंदी'];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState('EN');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Scroll detection for navbar background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Dynamic nav links
  const activeNavLinks = [
    { label: 'FEATURES', path: '/features' },
    { label: 'ABOUT HEARWISE', path: '/about' },
    { label: 'HEALTH OPERATIONS', path: '/hearing-health' },
    ...(isAdmin ? [{ label: 'DASHBOARD', path: '/dashboard' }] : []),
    { label: 'REGISTER SCHOOL', path: '/register-school' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? 'bg-[#020817]/95 backdrop-blur-xl border-b border-white/10 shadow-xl shadow-black/30'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}owl-mascot.png`}
                  alt="HearWise"
                  className="w-full h-full object-cover"
                  loading="eager"
                  width={36}
                  height={36}
                />
              </div>
              <span className="text-white font-black text-lg uppercase tracking-widest hidden xs:block">
                HEARWISE
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {activeNavLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all ${
                    location.pathname === link.path
                      ? 'text-teal-400 bg-teal-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop right side */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Auth buttons */}
              {user ? (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-black font-black text-xs uppercase tracking-widest"
                    >
                      DASHBOARD
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 rounded-xl border border-white/20 text-slate-400 text-xs font-semibold uppercase tracking-widest hover:text-white hover:border-white/40 transition-all"
                  >
                    SIGN OUT
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl border border-teal-500/50 text-teal-400 font-black text-xs uppercase tracking-widest hover:bg-teal-500/10 transition-all"
                >
                  SIGN IN
                </Link>
              )}
            </div>

            {/* Mobile right side */}
            <div className="flex lg:hidden items-center gap-3">
              {/* Hamburger button */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Toggle menu"
                className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5"
              >
                <motion.span
                  animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className="w-5 h-0.5 bg-white rounded-full origin-center block"
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  className="w-5 h-0.5 bg-white rounded-full block"
                />
                <motion.span
                  animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className="w-5 h-0.5 bg-white rounded-full origin-center block"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#020817] flex flex-col pt-20 pb-8 px-6 overflow-y-auto lg:hidden"
          >
            {/* Nav links */}
            <div className="flex flex-col gap-2 mb-8">
              {activeNavLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center justify-between w-full px-5 py-4 rounded-2xl border transition-all text-sm font-black uppercase tracking-widest ${
                      location.pathname === link.path
                        ? 'border-teal-500/50 bg-teal-500/10 text-teal-400'
                        : 'border-white/8 bg-white/3 text-slate-300 hover:border-teal-500/30 hover:text-white'
                    }`}
                  >
                    {link.label}
                    <span className="text-slate-600">→</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/8 mb-8" />

            {/* Auth section */}
            <div className="flex flex-col gap-3">
              {user ? (
                <>
                  <p className="text-slate-500 text-xs uppercase tracking-widest text-center mb-1">
                    SIGNED IN AS {user.email?.split('@')[0].toUpperCase()}
                  </p>
                  {isAdmin && (
                    <Link
                      to="/dashboard"
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-black font-black text-sm uppercase tracking-widest text-center"
                    >
                      OPEN DASHBOARD
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="w-full py-4 rounded-2xl border border-white/15 text-slate-400 font-semibold text-sm uppercase tracking-widest"
                  >
                    SIGN OUT
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-black font-black text-sm uppercase tracking-widest text-center"
                >
                  SIGN IN
                </Link>
              )}
            </div>

            {/* Bottom brand */}
            <div className="mt-auto pt-8 text-center">
              <p className="text-slate-700 text-xs uppercase tracking-widest">
                HEARWISE TECHNOLOGIES · INDIA
              </p>
              <p className="text-slate-800 text-[10px] mt-1 uppercase tracking-wider">
                HEAR EVERY CHILD. REACH EVERY SCHOOL.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
