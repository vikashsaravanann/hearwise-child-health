import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import Loader from '@/components/Loader'

const AuthCallback = () => {
  const navigate = useNavigate()
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL as string

  useEffect(() => {
    async function handleCallback() {
      try {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        if (code) {
          // PKCE flow — exchange code for session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            console.error('Code exchange error:', error)
            navigate('/login', { replace: true })
            return
          }
          const email = data.session?.user?.email?.toLowerCase()
          navigate(email === adminEmail?.toLowerCase() ? '/dashboard' : '/', { replace: true })
          return
        }

        // Hash / implicit flow — Supabase auto-handles, just get session
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
          navigate('/login', { replace: true })
          return
        }
        const email = session.user?.email?.toLowerCase()
        navigate(email === adminEmail?.toLowerCase() ? '/dashboard' : '/', { replace: true })
      } catch (err) {
        console.error('Auth callback error:', err)
        navigate('/login', { replace: true })
      }
    }
    handleCallback()
  }, [navigate, adminEmail])

  return <Loader fullscreen text="SIGNING IN" />
}

export default AuthCallback
