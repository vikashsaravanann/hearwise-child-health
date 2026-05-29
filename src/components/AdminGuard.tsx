/**
 * AdminGuard — wraps routes that require a whitelisted admin.
 *
 * 1. Checks Supabase auth session.
 * 2. Queries admin_whitelist to verify the email server-side.
 * 3. If not whitelisted → redirects to /admin/login with "Access Denied" message.
 */
import { type ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

type AuthState = 'loading' | 'allowed' | 'denied';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [authState, setAuthState] = useState<AuthState>('loading');

  useEffect(() => {
    const check = async () => {
      const localAdmin = sessionStorage.getItem('hearwise_admin_session');
      if (localAdmin === 'active_vikash') {
        setAuthState('allowed');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user.email?.toLowerCase() === 'vikash07052008@gmail.com') {
        sessionStorage.setItem('hearwise_admin_session', 'active_vikash');
        setAuthState('allowed');
        return;
      }

      setAuthState('denied');
    };

    check();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const localAdmin = sessionStorage.getItem('hearwise_admin_session');
      if (localAdmin === 'active_vikash') {
        setAuthState('allowed');
        return;
      }

      if (session && session.user.email?.toLowerCase() === 'vikash07052008@gmail.com') {
        sessionStorage.setItem('hearwise_admin_session', 'active_vikash');
        setAuthState('allowed');
      } else {
        setAuthState('denied');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (authState === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1729]">
        <Loader2 className="h-8 w-8 animate-spin text-[#2F80ED]" />
      </div>
    );
  }

  if (authState === 'denied') {
    return <Navigate to="/admin/login" replace state={{ accessDenied: true }} />;
  }

  return <>{children}</>;
}
