import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL as string)?.toLowerCase();

  useEffect(() => {
    async function handle() {
      try {
        // Wait a moment for Supabase to process the URL tokens automatically
        await new Promise(r => setTimeout(r, 500));

        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const errorParam = params.get('error');

        // Handle error from OAuth provider
        if (errorParam) {
          console.error('OAuth error:', errorParam, params.get('error_description'));
          navigate('/login');
          return;
        }

        // PKCE flow: exchange code for session
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error('Code exchange failed:', error.message);
            navigate('/login');
            return;
          }
          const email = data.session?.user?.email?.toLowerCase();
          navigate(email === adminEmail ? '/dashboard' : '/', { replace: true });
          return;
        }

        // Implicit flow or already handled by detectSessionInUrl
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          console.error('No session found after callback');
          navigate('/login');
          return;
        }
        const email = session.user?.email?.toLowerCase();
        navigate(email === adminEmail ? '/dashboard' : '/', { replace: true });

      } catch (err) {
        console.error('AuthCallback error:', err);
        navigate('/login');
      }
    }
    handle();
  }, [navigate, adminEmail]);

  // Professional 3-dot loader (no ear animation)
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#020817] gap-5">
      <img
        src={`${import.meta.env.BASE_URL}owl-mascot.png`}
        alt="HearWise"
        className="w-12 h-12 object-contain opacity-70 animate-pulse"
      />
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-teal-400"
            style={{
              animation: `bounce 0.8s ease-in-out infinite`,
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </div>
      <p className="text-slate-500 text-xs uppercase tracking-[0.3em]">SIGNING IN</p>
    </div>
  );
}
