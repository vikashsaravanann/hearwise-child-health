import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

const AuthCallback = () => {
  const navigate = useNavigate()
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        if (session?.user) {
          if (session.user.email === adminEmail) {
            navigate('/admin', { replace: true })
          } else {
            navigate('/', { replace: true })
          }
        } else {
          navigate('/login', { replace: true })
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        navigate('/login', { replace: true })
      }
    }
    handleCallback()
  }, [navigate, adminEmail])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-6 animate-pulse">👂</div>
        <h2 className="text-teal-400 text-xl font-semibold mb-2">Signing you in…</h2>
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
