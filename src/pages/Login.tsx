import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

type Tab = 'google' | 'email' | 'mobile';

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('google');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Static Purple Waveform Bars matching screenshot precisely
  const WaveformBars = () => (
    <div className="flex items-center justify-center gap-1 h-8">
      {[12, 20, 14, 18, 12, 16, 12, 24, 14, 18, 12].map((h, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-[#6366f1]"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );

  // Deep purple/blue starry background perfectly matching the screenshot
  const StarBg = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, #151532 0%, #070710 100%)' }}>
      {/* Subtle floating stars */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-indigo-500"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: Math.random() > 0.8 ? '3px' : '1.5px',
            height: Math.random() > 0.8 ? '3px' : '1.5px',
            boxShadow: '0 0 10px 2px rgba(99, 102, 241, 0.4)'
          }}
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{ duration: 3 + Math.random() * 4, repeat: Infinity }}
        />
      ))}
    </div>
  );

  function handleOtpChange(val: string, idx: number) {
    const next = [...otp];
    next[idx] = val.replace(/\D/g, '').slice(-1);
    setOtp(next);
    if (val && idx < 5) {
      const el = document.getElementById(`otp-${idx + 1}`);
      el?.focus();
    }
  }

  function handleOtpKeyDown(e: React.KeyboardEvent, idx: number) {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      const el = document.getElementById(`otp-${idx - 1}`);
      el?.focus();
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError('');
    try {
      const redirectUrl = `${window.location.origin}${import.meta.env.BASE_URL}auth/callback`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (error) {
        setError(`GOOGLE SIGN-IN FAILED: ${error.message.toUpperCase()}`);
        setLoading(false);
        return;
      }
      if (data?.url) window.location.href = data.url;
    } catch {
      setError('UNEXPECTED ERROR. PLEASE TRY AGAIN.');
      setLoading(false);
    }
  }

  async function handleEmailSend() {
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('PLEASE ENTER A VALID EMAIL ADDRESS.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}auth/callback`,
        },
      });
      if (error) {
        setError(`FAILED TO SEND CODE: ${error.message.toUpperCase()}`);
      } else {
        setStep('otp');
      }
    } catch {
      setError('UNEXPECTED ERROR. PLEASE TRY AGAIN.');
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailVerify() {
    const code = otp.join('');
    if (code.length < 6) { setError('ENTER THE COMPLETE 6-DIGIT CODE.'); return; }
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.toLowerCase().trim(),
        token: code,
        type: 'email',
      });
      if (error) {
        setError(`INVALID OR EXPIRED CODE: ${error.message.toUpperCase()}`);
      } else if (data.session) {
        const userEmail = data.session.user?.email?.toLowerCase();
        const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL as string)?.toLowerCase();
        navigate(userEmail === adminEmail ? '/dashboard' : '/');
      }
    } catch {
      setError('VERIFICATION FAILED. PLEASE TRY AGAIN.');
    } finally {
      setLoading(false);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'google', label: 'Google' },
    { id: 'email', label: 'Email' },
    { id: 'mobile', label: 'Mobile' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ backgroundColor: '#070710' }}>
      <StarBg />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md z-10 flex flex-col items-center"
      >
        <div className="relative w-full rounded-2xl bg-[#0f111a] border-t-[3px] border-indigo-500 px-8 py-10 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.15)] flex flex-col">
          
          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <WaveformBars />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">Access HearWise</h1>
            <p className="text-[#8e95a5] text-[13px] px-2 leading-relaxed">
              Secure entry for school administrators and clinical staff.
            </p>
          </div>

          {/* Pill Tab Switcher exactly like screenshot */}
          <div className="flex rounded-xl border border-[#1e2336] bg-[#161825] p-1.5 mb-8">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setStep('input'); setError(''); setOtp(['','','','','','']); }}
                className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-300 ${
                  tab === t.id
                    ? 'border border-[#3b82f6] bg-[#1a2138] text-white shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                    : 'text-[#8e95a5] hover:text-gray-300 border border-transparent'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab + step}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.2 }}
              className="w-full flex-grow"
            >
              {tab === 'google' && (
                <div className="flex justify-center w-full">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-white text-[#0f111a] font-bold text-sm flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 48 48">
                          <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                          <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
                          <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.649-3.342-11.123-7.94l-6.568 4.82A19.953 19.953 0 0 0 24 44z"/>
                          <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </motion.button>
                </div>
              )}

              {tab === 'email' && step === 'input' && (
                <div className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleEmailSend()}
                    placeholder="Email Address"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#161825] border border-[#1e2336] text-white text-sm placeholder-[#5a6273] focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleEmailSend}
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-white text-[#0f111a] font-bold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : 'Continue with Email'}
                  </motion.button>
                </div>
              )}

              {tab === 'email' && step === 'otp' && (
                <div className="space-y-4">
                  <p className="text-[#8e95a5] text-xs text-center mb-2">Code sent to {email}</p>
                  <div className="flex gap-2 justify-center mb-4">
                    {otp.map((val, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={val}
                        onChange={e => handleOtpChange(e.target.value, idx)}
                        onKeyDown={e => handleOtpKeyDown(e, idx)}
                        className="w-10 h-12 rounded-lg bg-[#161825] border border-[#1e2336] text-white text-lg font-bold text-center focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleEmailVerify}
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-white text-[#0f111a] font-bold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : 'Verify Code'}
                  </motion.button>
                </div>
              )}

              {tab === 'mobile' && (
                <div className="space-y-4 text-center py-4 w-full">
                  <p className="text-[#8e95a5] text-sm">Mobile authentication is coming soon.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 pt-4 flex items-center justify-center gap-2 text-[#5a6273]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-[11px] uppercase tracking-wider font-semibold">Enterprise-grade encryption</span>
          </div>

        </div>

        <div className="mt-8 w-full flex justify-center items-center text-[#5a6273] text-[12px] font-medium gap-3">
          <a href="#" className="hover:text-[#8e95a5] transition-colors">Privacy Policy</a>
          <span className="w-1 h-1 rounded-full bg-[#5a6273] opacity-50"></span>
          <a href="#" className="hover:text-[#8e95a5] transition-colors">Terms of Service</a>
        </div>
      </motion.div>
    </div>
  );
}
