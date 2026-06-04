import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL as string;
  const [status, setStatus] = useState('Completing sign-in...');

  useEffect(() => {
    async function handleCallback() {
      try {
        // Handle the OAuth code exchange — CRITICAL step
        // Supabase automatically handles the code in the URL hash/params
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error.message);
          setStatus('Sign-in failed. Redirecting...');
          setTimeout(() => navigate('/login?error=auth_failed'), 2000);
          return;
        }

        if (!session) {
          // Try exchanging the code manually if session is not ready yet
          // This handles the PKCE flow used by Supabase OAuth
          const hashParams = new URLSearchParams(
            window.location.hash.includes('?') 
              ? window.location.hash.split('?')[1] 
              : window.location.hash.substring(1)
          );
          const queryParams = new URLSearchParams(window.location.search);
          
          const code = queryParams.get('code') || hashParams.get('code');
          
          if (code) {
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError || !data.session) {
              console.error('Exchange code error:', exchangeError?.message || 'No session returned');
              setStatus('Sign-in failed. Redirecting...');
              setTimeout(() => navigate('/login?error=code_exchange_failed'), 2000);
              return;
            }
            // Session established via code exchange
            
            try {
              await supabase.from('login_logs').insert({
                user_id: data.session.user.id,
                email: data.session.user.email || '',
                full_name: data.session.user.user_metadata?.full_name || '',
                login_method: 'google',
                phone_number: data.session.user.phone || null,
                device_info: navigator.userAgent.substring(0, 100),
              });
            } catch (e) {
              console.error('Failed to log login', e);
            }

            const userEmail = data.session.user.email?.toLowerCase();
            if (userEmail === adminEmail?.toLowerCase()) {
              navigate('/dashboard', { replace: true });
            } else {
              navigate('/', { replace: true });
            }
            return;
          }

          setStatus('No session found. Redirecting to login...');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // Session exists — redirect based on role
        try {
          await supabase.from('login_logs').insert({
            user_id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || '',
            login_method: 'google',
            phone_number: session.user.phone || null,
            device_info: navigator.userAgent.substring(0, 100),
          });
        } catch (e) {
          console.error('Failed to log login', e);
        }

        setStatus('Signed in! Redirecting...');
        const userEmail = session.user.email?.toLowerCase();
        if (userEmail === adminEmail?.toLowerCase()) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }

      } catch (err) {
        console.error('Unexpected auth callback error:', err);
        navigate('/login', { replace: true });
      }
    }

    handleCallback();
  }, [navigate, adminEmail]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: '#0f172a' }}
    >
      <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-white text-sm font-medium">{status}</p>
      <p className="text-slate-500 text-xs mt-2">HearWise Technologies</p>
    </div>
  );
}
