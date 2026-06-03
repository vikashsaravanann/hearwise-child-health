import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, ArrowRight, Loader2, KeyRound, Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import mascot from '@/assets/owl-mascot.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import OceanBackground from '@/components/OceanBackground';

type AuthMethod = 'google' | 'email' | 'phone';

export default function LoginPage() {
  const navigate = useNavigate();
  const { lang } = useSession();
  
  const [method, setMethod] = useState<AuthMethod>('google');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/setup`
        }
      });
      if (error) throw error;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast({ title: t('loginFailed', lang), description: errorMessage, variant: 'destructive' });
      setIsLoading(false);
    }
  };

  const handleEmailOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/setup`
        }
      });
      if (error) throw error;
      toast({ title: t('magicLinkSent', lang), description: t('checkEmail', lang) });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast({ title: t('loginFailed', lang), description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    const phoneWithCode = phone.startsWith('+91') ? phone : `+91${phone}`;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneWithCode
      });
      if (error) throw error;
      toast({ title: t('otpSent', lang), description: t('checkPhone', lang) });
      // In a real app, you would show a step 2 to verify the OTP.
      // We will redirect for now or just show success.
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast({ title: t('loginFailed', lang), description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <OceanBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-4xl bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side - Mascot & Branding */}
        <div className="md:w-1/2 p-10 flex flex-col items-center justify-center bg-gradient-to-b from-blue-900/40 to-blue-900/80 border-r border-white/10">
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full" />
            <img src={mascot} alt="HearWise Mascot" className="w-48 h-48 object-contain relative z-10 drop-shadow-2xl" />
          </motion.div>
          <div className="mt-8 text-center text-white">
            <h1 className="text-4xl font-black mb-2 tracking-tight">HearWise</h1>
            <p className="text-blue-100 font-medium">{t('tagline', lang) || "India's first mobile-based school hearing screening platform."}</p>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="md:w-1/2 p-8 sm:p-12 bg-white flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-blue-950 mb-2">{t('welcomeBack', lang) || 'Welcome Back'}</h2>
            <p className="text-slate-500 font-medium">{t('loginToContinue', lang) || 'Sign in to access your screening tools'}</p>
          </div>

          <div className="flex gap-2 mb-8 p-1.5 bg-slate-100 rounded-2xl">
            {(['google', 'email', 'phone'] as AuthMethod[]).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-bold transition-all ${
                  method === m 
                    ? 'bg-white text-blue-700 shadow-md' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m === 'google' ? 'Google' : m === 'email' ? 'Email' : 'Mobile'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {method === 'google' && (
              <motion.div
                key="google"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4"
              >
                <Button 
                  onClick={handleGoogleLogin} 
                  disabled={isLoading}
                  className="h-14 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold text-lg shadow-sm w-full relative group transition-all"
                >
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Continue with Google'}
                  <ArrowRight className="absolute right-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all text-slate-400" />
                </Button>
              </motion.div>
            )}

            {method === 'email' && (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleEmailOTP}
                className="flex flex-col gap-5"
              >
                <div className="space-y-2">
                  <Label className="text-slate-600 font-bold">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <Input 
                      type="email" 
                      placeholder="teacher@school.edu" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white font-medium text-lg"
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit"
                  disabled={isLoading || !email}
                  className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : (
                    <>
                      <KeyRound className="mr-2" size={20} />
                      Send Magic Link
                    </>
                  )}
                </Button>
              </motion.form>
            )}

            {method === 'phone' && (
              <motion.form
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handlePhoneOTP}
                className="flex flex-col gap-5"
              >
                <div className="space-y-2">
                  <Label className="text-slate-600 font-bold">Mobile Number</Label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 border-r border-slate-200 pr-3">
                      +91
                    </div>
                    <Input 
                      type="tel" 
                      placeholder="9876543210" 
                      value={phone.replace('+91', '')}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      maxLength={10}
                      className="h-14 pl-16 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white font-medium text-lg tracking-wide"
                      required
                    />
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  </div>
                </div>
                <Button 
                  type="submit"
                  disabled={isLoading || phone.length < 10}
                  className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : (
                    <>
                      <Smartphone className="mr-2" size={20} />
                      Send OTP
                    </>
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="mt-8 text-center text-sm font-medium text-slate-400">
            By signing in, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms</a> & <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
