import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

type Tab = 'google' | 'email';

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Animated waveform bars
  const WaveformBars = () => (
    <div className="flex items-end gap-0.5 h-8">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-teal-500/40"
          animate={{ height: ['4px', `${8 + Math.sin(i) * 16}px`, '4px'] }}
          transition={{ duration: 1.2 + i * 0.08, repeat: Infinity, delay: i * 0.06 }}
        />
      ))}
    </div>
  );

  // Floating grid dots background
  const GridBg = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #14b8a6 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />
      <motion.div
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-teal-500/5 blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-cyan-500/5 blur-[80px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, delay: 3 }}
      />
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
      const redirectUrl = `${window.location.origin}/auth/callback`;
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
          emailRedirectTo: `${window.location.origin}/auth/callback`,
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

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL as string;
  const tabs: { id: Tab; label: string }[] = [
    { id: 'google', label: 'GOOGLE' },
    { id: 'email', label: 'EMAIL OTP' },
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative">
      <GridBg />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={mounted ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md z-10"
      >
        {/* Glow behind card */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-teal-500/20 to-transparent blur-sm" />

        <div className="relative rounded-3xl border border-[#1a1a1a] bg-[#0a0a0a] p-8 shadow-2xl">

          {/* Logo + Title */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-teal-500/30 mb-4"
            >
              <img src="/owl-mascot.png" alt="HearWise" className="w-full h-full object-cover" />
            </motion.div>
            <h1 className="text-2xl font-black text-white uppercase tracking-widest">HEARWISE</h1>
            <div className="flex justify-center mt-2 mb-1">
              <WaveformBars />
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">SECURE ACCESS PORTAL</p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl border border-[#1a1a1a] bg-[#111111] p-1 mb-6 gap-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setStep('input'); setError(''); setOtp(['','','','','','']); }}
                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                  tab === t.id
                    ? 'bg-teal-500 text-black shadow-lg shadow-teal-500/30'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center uppercase tracking-wide"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab + step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >

              {/* GOOGLE TAB */}
              {tab === 'google' && (
                <div className="space-y-4">
                  <p className="text-gray-500 text-xs text-center uppercase tracking-widest mb-6">
                    SIGN IN WITH YOUR GOOGLE ACCOUNT
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-4 rounded-xl border border-[#2a2a2a] bg-[#111111] text-white font-bold text-sm flex items-center justify-center gap-3 hover:border-teal-500/50 hover:bg-teal-500/5 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        CONTINUE WITH GOOGLE
                      </>
                    )}
                  </motion.button>
                  <p className="text-gray-600 text-xs text-center">
                    ADMIN ACCESS REQUIRES {adminEmail ? adminEmail.split('@')[0].toUpperCase() + '@...' : 'AUTHORISED EMAIL'}
                  </p>
                </div>
              )}

              {/* EMAIL TAB — STEP: INPUT */}
              {tab === 'email' && step === 'input' && (
                <div className="space-y-4">
                  <p className="text-gray-500 text-xs text-center uppercase tracking-widest mb-4">
                    ENTER YOUR EMAIL — WE'LL SEND A 6-DIGIT CODE
                  </p>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleEmailSend()}
                    placeholder="YOUR EMAIL ADDRESS"
                    className="w-full px-4 py-4 rounded-xl bg-[#111111] border border-[#222222] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleEmailSend}
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-black font-black text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-teal-500/30"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : 'SEND VERIFICATION CODE →'}
                  </motion.button>
                </div>
              )}

              {/* EMAIL TAB — STEP: OTP */}
              {tab === 'email' && step === 'otp' && (
                <div className="space-y-4">
                  <p className="text-gray-500 text-xs text-center uppercase tracking-widest mb-2">
                    CODE SENT TO
                  </p>
                  <p className="text-teal-400 text-sm text-center font-black uppercase tracking-wider mb-6">
                    {email}
                  </p>
                  <div className="flex gap-2 justify-center">
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
                        className="w-11 h-14 rounded-xl bg-[#111111] border border-[#222222] text-white text-xl font-black text-center focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleEmailVerify}
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-black font-black text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-teal-500/30"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : 'VERIFY & SIGN IN →'}
                  </motion.button>
                  <button
                    onClick={() => { setStep('input'); setOtp(['','','','','','']); setError(''); }}
                    className="w-full text-gray-500 text-xs uppercase tracking-widest hover:text-gray-300 transition-colors py-2"
                  >
                    ← CHANGE EMAIL
                  </button>
                  <button
                    onClick={async () => { setOtp(['','','','','','']); setError(''); await handleEmailSend(); }}
                    disabled={loading}
                    className="w-full text-teal-500 text-xs uppercase tracking-widest hover:text-teal-300 transition-colors disabled:opacity-50"
                  >
                    RESEND CODE
                  </button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[#1a1a1a] text-center">
            <p className="text-gray-600 text-xs uppercase tracking-widest">
              INDIA'S FIRST SCHOOL HEARING SCREENING PLATFORM
            </p>
            <div className="flex justify-center gap-4 mt-3">
              <span className="text-gray-700 text-xs">🦉 HEARWISE TECHNOLOGIES</span>
              <span className="text-gray-700 text-xs">CHENNAI, INDIA 🇮🇳</span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
