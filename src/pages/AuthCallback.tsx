import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

const AuthCallback = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // PKCE flow: exchange code for session
        // Supabase with detectSessionInUrl: true handles this automatically
        // We just need to wait for the session to be established
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          setTimeout(() => navigate('/login'), 3000)
          return
        }

        if (session?.user) {
          // Admin check
          if (session.user.email === adminEmail) {
            navigate('/dashboard', { replace: true })
          } else {
            navigate('/', { replace: true })
          }
        } else {
          // Session not ready yet — wait for onAuthStateChange
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
              subscription.unsubscribe()
              if (session?.user) {
                if (session.user.email === adminEmail) {
                  navigate('/dashboard', { replace: true })
                } else {
                  navigate('/', { replace: true })
                }
              } else {
                navigate('/login', { replace: true })
              }
            }
          )
        }
      } catch (err) {
        console.error('Auth callback exception:', err)
        setStatus('error')
        setTimeout(() => navigate('/login'), 3000)
      }
    }

    handleCallback()
  }, [navigate, adminEmail])

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="text-5xl">❌</div>
          <h2 className="text-red-400 text-xl font-semibold">Sign-in Failed</h2>
          <p className="text-slate-400 text-sm">
            Something went wrong. Redirecting you back to login…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-pulse">👂</div>
        <h2 className="text-teal-400 text-xl font-semibold">
          Signing you in…
        </h2>
        <p className="text-slate-500 text-sm">Please wait a moment</p>
        <div className="mt-4 flex gap-1 justify-center">
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
        </div>
      </div>
    </div>
  )
}

export default AuthCallback
