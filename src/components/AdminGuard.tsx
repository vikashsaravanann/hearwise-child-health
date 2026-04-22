/**
 * AdminGuard — wraps routes that require the admin to be authenticated.
 *
 * Behaviour:
 *  • While the Supabase session is loading → shows a full-screen spinner.
 *  • If not authenticated (or wrong account) → redirects to /admin.
 *  • If authenticated as the allowed admin email → renders children normally.
 */

import { type ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const ALLOWED_ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.trim().toLowerCase() ?? '';

type AuthState = 'loading' | 'allowed' | 'denied';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [authState, setAuthState] = useState<AuthState>('loading');

  useEffect(() => {
    // Initial check
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user.email?.toLowerCase() === ALLOWED_ADMIN_EMAIL) {
        setAuthState('allowed');
      } else {
        if (session) await supabase.auth.signOut(); // clean up wrong account
        setAuthState('denied');
      }
    };

    check();

    // Listen for future auth state changes (logout, token refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user.email?.toLowerCase() === ALLOWED_ADMIN_EMAIL) {
        setAuthState('allowed');
      } else {
        setAuthState('denied');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (authState === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (authState === 'denied') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
