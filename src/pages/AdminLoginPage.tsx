import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Loader2, ShieldAlert, ArrowLeft, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ALLOWED_ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.trim().toLowerCase() ?? '';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { lang } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // If already authenticated as the admin, skip login
  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user.email?.toLowerCase() === ALLOWED_ADMIN_EMAIL) {
        navigate('/dashboard', { replace: true });
      } else if (session) {
        // Someone else is signed in — sign them out silently
        await supabase.auth.signOut();
      }
      setAuthLoading(false);
    };
    check();
  }, [navigate]);

  const handleLogin = async () => {
    setAccessDenied(false);
    const trimmedEmail = email.trim().toLowerCase();

    // ── Guard 1: email must match env variable BEFORE touching Supabase ──
    if (trimmedEmail !== ALLOWED_ADMIN_EMAIL) {
      setAccessDenied(true);
      return;
    }

    setLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password });
      if (error) {
        toast({
          title: t('loginFailed', lang),
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      // Supabase accepted — navigate to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('unexpectedAuthError', lang);
      toast({ title: t('loginFailed', lang), description: message, variant: 'destructive' });
    } finally {
      setLoginLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-8">
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, hsl(221 83% 53% / 0.12) 0%, transparent 70%), hsl(var(--background))',
        }}
      />

      {/* Shield icon + branding */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">HearWise</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Admin Portal</p>
        </div>
      </div>

      <Card className="w-full max-w-sm rounded-2xl shadow-xl ring-1 ring-border/50">
        <CardHeader className="pb-4 text-center">
          <CardTitle className="text-lg font-semibold">{t('adminDashboard', lang)}</CardTitle>
          <p className="text-xs text-muted-foreground">{t('signInWithCredentials', lang)}</p>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {/* Access Denied Banner */}
          {accessDenied && (
            <div
              id="access-denied-banner"
              className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/8 px-4 py-3"
              role="alert"
            >
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-destructive">Access Denied.</p>
                <p className="text-xs text-destructive/80">Unauthorized user.</p>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="admin-email">{t('email', lang)}</Label>
            <Input
              id="admin-email"
              className="mt-1.5 h-12 rounded-xl"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setAccessDenied(false);
              }}
              placeholder="admin@hearwise.in"
              autoComplete="email"
            />
          </div>

          <div>
            <Label htmlFor="admin-password">{t('password', lang)}</Label>
            <Input
              id="admin-password"
              className="mt-1.5 h-12 rounded-xl"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loginLoading && handleLogin()}
              autoComplete="current-password"
            />
          </div>

          <Button
            id="admin-login-btn"
            className="h-14 rounded-2xl text-base font-semibold"
            onClick={handleLogin}
            disabled={loginLoading || !email || !password}
          >
            {loginLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <LogIn size={18} className="mr-2" />
            )}
            {t('signIn', lang)}
          </Button>

          <Button variant="ghost" className="h-10" onClick={() => navigate('/')}>
            <ArrowLeft size={16} className="mr-1" />
            {t('backToHome', lang)}
          </Button>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-[10px] text-muted-foreground">
        © 2025 HearWise Technologies · Restricted access
      </p>
    </div>
  );
}
