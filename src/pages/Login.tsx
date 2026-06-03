import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

export default function Login() {
  const [activeTab, setActiveTab] = useState<'google' | 'email' | 'mobile'>('google')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [countdown, setCountdown] = useState(0)

  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setErrorMsg('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback'
        }
      })
      if (error) throw error
    } catch (err: unknown) {
      const error = err as Error
      setErrorMsg(error.message || 'Google sign-in failed.')
      setIsLoading(false)
    }
  }

  const handleEmailRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    try {
      z.string().email('Please enter a valid email address').parse(email)
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
      setSuccessMsg(`✅ Code sent to ${email}`)
      setStep('verify')
      setCountdown(60)
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[], message: string }
      setErrorMsg(error.errors ? error.errors[0].message : error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailVerify = async (val: string) => {
    setOtp(val)
    if (val.length === 6) {
      setIsLoading(true)
      setErrorMsg('')
      try {
        const { error } = await supabase.auth.verifyOtp({ email, token: val, type: 'email' })
        if (error) throw error
        // On success, AuthCallback handles the redirect via auth state change or just reload.
        window.location.href = '/auth/callback'
      } catch (err: unknown) {
        setErrorMsg('Invalid or expired code. Please try again.')
        setOtp('')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleMobileRequest = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    try {
      z.string().length(10, 'Enter exactly 10 digits').regex(/^[6-9]\d{9}$/, 'Enter a valid Indian mobile number').parse(phone)
      setSuccessMsg('📱 SMS OTP requires Twilio setup. Please use Email OTP or Google Sign-In for now.')
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[], message: string }
      setErrorMsg(error.errors ? error.errors[0].message : 'Invalid mobile number')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-[440px] p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-pulse duration-2000">👂</div>
          <h1 className="text-teal-400 font-bold text-3xl mb-1">HearWise</h1>
          <p className="text-slate-400 text-sm font-medium">School Hearing Screening Platform</p>
          <p className="text-white/60 text-xs mt-2 italic">India's First Mobile-Based Hearing Test for Schools</p>
        </div>

        <div className="flex border-b border-white/10 mb-6">
          {(['google', 'email', 'mobile'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setStep('request'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === tab ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              {tab === 'google' && '🔵 Google'}
              {tab === 'email' && '📧 Email OTP'}
              {tab === 'mobile' && '📱 Mobile OTP'}
            </button>
          ))}
        </div>

        <div className="min-h-[160px]">
          {activeTab === 'google' && (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <button 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="bg-white text-slate-800 font-semibold rounded-xl px-6 py-3 w-full flex items-center justify-center gap-3 hover:bg-slate-100 transition-all shadow-lg disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="animate-spin border-2 border-slate-400 border-t-slate-800 rounded-full w-5 h-5" />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
              <div className="flex items-center w-full my-4">
                <div className="flex-1 border-t border-white/10"></div>
                <span className="px-3 text-slate-500 text-xs">or sign in another way</span>
                <div className="flex-1 border-t border-white/10"></div>
              </div>
            </div>
          )}

          {activeTab === 'email' && step === 'request' && (
            <form onSubmit={handleEmailRequest} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm mb-2">Enter your email address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@school.edu.in" 
                  className="bg-white/10 border border-white/20 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 w-full transition-all"
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl px-6 py-3 w-full transition-all disabled:opacity-70 flex justify-center items-center"
              >
                {isLoading ? <div className="animate-spin border-2 border-slate-950 border-t-transparent rounded-full w-5 h-5" /> : 'Send Verification Code →'}
              </button>
            </form>
          )}

          {activeTab === 'email' && step === 'verify' && (
            <div className="space-y-4 text-center">
              <p className="text-teal-400 text-sm mb-4">We sent a 6-digit code to {email}</p>
              <div className="flex justify-center mb-6">
                <InputOTP maxLength={6} value={otp} onChange={handleEmailVerify} disabled={isLoading}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-10 h-12 text-lg bg-white/10 border-white/20 text-white mx-1 rounded-md" />
                    <InputOTPSlot index={1} className="w-10 h-12 text-lg bg-white/10 border-white/20 text-white mx-1 rounded-md" />
                    <InputOTPSlot index={2} className="w-10 h-12 text-lg bg-white/10 border-white/20 text-white mx-1 rounded-md" />
                    <InputOTPSlot index={3} className="w-10 h-12 text-lg bg-white/10 border-white/20 text-white mx-1 rounded-md" />
                    <InputOTPSlot index={4} className="w-10 h-12 text-lg bg-white/10 border-white/20 text-white mx-1 rounded-md" />
                    <InputOTPSlot index={5} className="w-10 h-12 text-lg bg-white/10 border-white/20 text-white mx-1 rounded-md" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleEmailRequest}
                  disabled={countdown > 0 || isLoading}
                  className="text-slate-400 hover:text-white text-sm transition-colors disabled:opacity-50"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                </button>
                <button 
                  onClick={() => { setStep('request'); setOtp(''); setErrorMsg(''); }}
                  className="text-teal-500 hover:text-teal-400 text-sm font-medium transition-colors"
                >
                  ← Change email
                </button>
              </div>
            </div>
          )}

          {activeTab === 'mobile' && (
            <form onSubmit={handleMobileRequest} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm mb-2">Enter your mobile number</label>
                <div className="flex">
                  <div className="bg-white/5 border border-white/20 border-r-0 rounded-l-xl px-4 py-3 text-slate-400 flex items-center justify-center font-medium">
                    +91
                  </div>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210" 
                    className="flex-1 bg-white/10 border border-white/20 text-white placeholder-slate-500 rounded-r-xl px-4 py-3 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl px-6 py-3 w-full transition-all"
              >
                Send OTP →
              </button>
              <p className="text-slate-500 text-xs text-center mt-4">
                📌 Mobile OTP requires Twilio configuration. Use Email OTP or Google Sign-In to get started now.
              </p>
            </form>
          )}
        </div>

        {errorMsg && <div className="text-red-400 text-sm mt-4 text-center p-2 bg-red-400/10 rounded-lg">{errorMsg}</div>}
        {successMsg && <div className={`${successMsg.includes('Twilio') ? 'text-amber-400 bg-amber-400/10' : 'text-teal-400 bg-teal-400/10'} text-sm mt-4 text-center p-2 rounded-lg`}>{successMsg}</div>}

        <div className="mt-8 text-center text-xs text-slate-500">
          By signing in, you agree to our <a href="#" className="text-teal-400 hover:underline">Privacy Policy</a> and <a href="#" className="text-teal-400 hover:underline">Terms of Service</a>.
        </div>
      </motion.div>
    </div>
  )
}
