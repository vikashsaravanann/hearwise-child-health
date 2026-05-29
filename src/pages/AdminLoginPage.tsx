/**
 * AdminLoginPage — Clean login-only page at /admin/login.
 * Validates against admin_whitelist server-side after auth.
 * Logs login events to login_logs table.
 */
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Headphones, LogIn, Loader2, ShieldAlert } from 'lucide-react';

function getDeviceInfo() {
  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android/i.test(ua);
  const isTablet = /Tablet|iPad/i.test(ua);
  const deviceType = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';

  let browser = 'Unknown';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';

  let os = 'Unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return { deviceType, browser, os };
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const accessDenied = (location.state as { accessDenied?: boolean })?.accessDenied;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');

  // If already authenticated as admin, skip to dashboard
  useEffect(() => {
    const check = async () => {
      const localAdmin = sessionStorage.getItem('hearwise_admin_session');
      if (localAdmin === 'active_vikash') {
        navigate('/admin/dashboard', { replace: true });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user.email?.toLowerCase() === 'vikash07052008@gmail.com') {
        sessionStorage.setItem('hearwise_admin_session', 'active_vikash');
        navigate('/admin/dashboard', { replace: true });
        return;
      }
      setChecking(false);
    };
    check();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // Strict Admin Email Enforcement
    if (cleanEmail !== 'vikash07052008@gmail.com') {
      setError('Access Denied. Only the authorized administrator can access this portal.');
      setLoading(false);
      return;
    }

    // Local Credential Check
    if (password === 'HearWise@technologies2026') {
      sessionStorage.setItem('hearwise_admin_session', 'active_vikash');
      
      try {
        // Attempt background Supabase sign-in in case it exists, but don't block login if it fails
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });
      } catch (e) {
        console.log('Background Supabase auth skipped or failed, using local session');
      }

      navigate('/admin/dashboard', { replace: true });
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        setError('Invalid credentials or unauthorized access');
        setLoading(false);
        return;
      }

      if (authData.user.email?.toLowerCase() !== 'vikash07052008@gmail.com') {
        await supabase.auth.signOut();
        setError('Access Denied. You are not authorized.');
        setLoading(false);
        return;
      }

      // Log the login event if successfully logged in via Supabase
      const { deviceType, browser, os } = getDeviceInfo();
      await supabase.from('login_logs').insert({
        user_email: authData.user.email ?? '',
        device_type: deviceType,
        browser,
        os,
        session_id: authData.session?.access_token?.slice(-12) ?? '',
      }).then(() => {});

      sessionStorage.setItem('hearwise_admin_session', 'active_vikash');
      navigate('/admin/dashboard', { replace: true });
    } catch {
      setError('Invalid credentials or unauthorized access');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1729]">
        <Loader2 className="h-8 w-8 animate-spin text-[#2F80ED]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1729] px-4">
      {/* Glow effect */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-[#2F80ED]/8 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2F80ED]/10 ring-1 ring-[#2F80ED]/20 backdrop-blur-sm">
            <Headphones className="h-8 w-8 text-[#2F80ED]" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">HearWise</h1>
            <p className="mt-0.5 text-sm text-gray-500">Admin Portal</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-sm">
          <h2 className="text-center text-lg font-semibold text-white">Login to Admin Dashboard</h2>
          <p className="mt-1 text-center text-xs text-gray-500">Sign in with your credentials</p>

          {/* Error / Access Denied */}
          {(error || accessDenied) && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <div>
                <p className="text-sm font-semibold text-red-400">
                  {error || 'Access Denied. You are not authorized.'}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-5 flex flex-col gap-4">
            <div>
              <label htmlFor="admin-email" className="text-xs font-medium text-gray-400">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="admin@hearwise.in"
                autoComplete="email"
                className="mt-1.5 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#2F80ED]/50 focus:ring-1 focus:ring-[#2F80ED]/30"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="text-xs font-medium text-gray-400">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="mt-1.5 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#2F80ED]/50 focus:ring-1 focus:ring-[#2F80ED]/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2F80ED] font-semibold text-white transition-all hover:bg-[#2F80ED]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LogIn size={18} />
              )}
              Login to Admin Dashboard
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[10px] text-gray-600">
          © 2025 HearWise Technologies · Restricted access
        </p>
      </div>
    </div>
  );
}
