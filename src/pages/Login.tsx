import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Mail, Smartphone, ArrowRight, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-indigo-500/20"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

const AudioWaveform = () => {
  return (
    <div className="flex items-center justify-center gap-1 h-12 mb-8">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-indigo-500/80 rounded-full"
          animate={{
            height: [12, Math.random() * 32 + 16, 12],
          }}
          transition={{
            duration: Math.random() * 0.5 + 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
};

export default function Login() {
  const [activeTab, setActiveTab] = useState<'google' | 'email' | 'mobile'>('google');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback'
        }
      });
      if (error) throw error;
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Google sign-in failed.');
      setIsLoading(false);
    }
  };

  const handleEmailRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      z.string().email('Please enter a valid email address').parse(email);
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setSuccessMsg(`✅ Code sent to ${email}`);
      setStep('verify');
      setCountdown(60);
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[], message: string };
      setErrorMsg(error.errors ? error.errors[0].message : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerify = async (val: string) => {
    setOtp(val);
    if (val.length === 6) {
      setIsLoading(true);
      setErrorMsg('');
      try {
        const { error } = await supabase.auth.verifyOtp({ email, token: val, type: 'email' });
        if (error) throw error;
        window.location.href = '/auth/callback';
      } catch (err: unknown) {
        setErrorMsg('Invalid or expired code. Please try again.');
        setOtp('');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMobileRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      z.string().length(10, 'Enter exactly 10 digits').regex(/^[6-9]\d{9}$/, 'Enter a valid Indian mobile number').parse(phone);
      setSuccessMsg('📱 SMS OTP requires Twilio setup. Please use Email OTP or Google Sign-In for now.');
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[], message: string };
      setErrorMsg(error.errors ? error.errors[0].message : 'Invalid mobile number.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden font-['DM_Sans']">
      
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/40 blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/30 blur-[120px] mix-blend-screen pointer-events-none"></div>
      
      <FloatingParticles />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10 mx-4"
      >
        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.05] shadow-2xl rounded-3xl p-8 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>

          <div className="text-center mb-8">
            <AudioWaveform />
            <h1 className="text-3xl font-bold text-white mb-2 font-['Syne'] tracking-tight">Access HearWise</h1>
            <p className="text-slate-400">Secure entry for school administrators and clinical staff.</p>
          </div>

          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
              {errorMsg}
            </motion.div>
          )}
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm text-center">
              {successMsg}
            </motion.div>
          )}

          <div className="flex bg-white/[0.03] p-1 rounded-2xl mb-8 border border-white/[0.05]">
            <button
              onClick={() => { setActiveTab('google'); setStep('request'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'google' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Google
            </button>
            <button
              onClick={() => { setActiveTab('email'); setStep('request'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'email' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Email
            </button>
            <button
              onClick={() => { setActiveTab('mobile'); setStep('request'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'mobile' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Mobile
            </button>
          </div>

          {activeTab === 'google' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-4 px-4 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-70"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" className="w-6 h-6" />
                <span>Continue with Google</span>
              </button>
              <div className="flex items-center gap-2 justify-center text-slate-500 text-sm mt-6">
                <ShieldCheck size={16} /> <span>Enterprise-grade encryption</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'email' && step === 'request' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <form onSubmit={handleEmailRequest} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@school.edu.in"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? 'Sending Code...' : 'Send Magic Code'}
                  {!isLoading && <ArrowRight size={18} />}
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'email' && step === 'verify' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 flex flex-col items-center">
              <p className="text-slate-300 text-center text-sm">Enter the 6-digit code sent to <br/><span className="text-white font-bold">{email}</span></p>
              
              <InputOTP maxLength={6} value={otp} onChange={handleEmailVerify}>
                <InputOTPGroup className="gap-2">
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot key={i} index={i} className="w-12 h-14 bg-white/[0.03] border-white/10 text-white text-xl rounded-xl" />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              <div className="text-center w-full">
                {countdown > 0 ? (
                  <p className="text-sm text-slate-500">Resend code in {countdown}s</p>
                ) : (
                  <button onClick={handleEmailRequest} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">Resend Code</button>
                )}
                <button onClick={() => { setStep('request'); setOtp(''); setSuccessMsg(''); setErrorMsg(''); }} className="block mx-auto mt-4 text-sm text-slate-500 hover:text-white transition-colors">Change Email</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'mobile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <form onSubmit={handleMobileRequest} className="space-y-4">
                <div>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400 font-medium">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0,10))}
                      placeholder="98765 43210"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all tracking-wider"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
                >
                  Request SMS OTP
                </button>
              </form>
            </motion.div>
          )}

        </div>
        
        <div className="mt-8 text-center text-slate-500 text-sm flex items-center justify-center gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <span>&bull;</span>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </motion.div>
    </div>
  );
}
