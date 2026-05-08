import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getDashboardStats, getRecentSessions, getMonthlyTrend, exportCSV } from '@/lib/database';
import { TAMIL_NADU_DISTRICTS } from '@/lib/districts';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Users, School, AlertOctagon, LogIn, Download, Loader2, LogOut, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Stats {
  totalSchools: number;
  totalStudents: number;
  totalReferrals: number;
  totalSessions: number;
}

interface SessionRow {
  id: string;
  session_date: string;
  schools: { name: string; district: string } | null;
  teachers: { name: string } | null;
}

interface TrendRow {
  month: string;
  normal: number;
  mild: number;
  refer: number;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { lang } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [stats, setStats] = useState<Stats>({ totalSchools: 0, totalStudents: 0, totalReferrals: 0, totalSessions: 0 });
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [trend, setTrend] = useState<TrendRow[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [exporting, setExporting] = useState(false);

  // Check existing auth
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        loadData();
      }
      setAuthLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsLoggedIn(true);
        loadData();
      } else {
        setIsLoggedIn(false);
      }
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, []);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const [s, sess, t] = await Promise.all([
        getDashboardStats(),
        getRecentSessions(),
        getMonthlyTrend(),
      ]);
      setStats(s);
      setSessions(sess);
      setTrend(t);
    } catch (e) {
      console.error('Dashboard load error:', e);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('unexpectedAuthError', lang);
      toast({ title: t('loginFailed', lang), description: message, variant: 'destructive' });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const csv = await exportCSV();
      if (!csv) {
        toast({ title: t('noDataToExport', lang) });
        return;
      }
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hearwise-data-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      toast({ title: t('exportFailed', lang), variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
        <Card className="w-full max-w-sm rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t('adminDashboard', lang)}</CardTitle>
            <p className="text-sm text-muted-foreground">{t('signInWithCredentials', lang)}</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label>{t('email', lang)}</Label>
              <Input className="mt-1.5 h-12 rounded-xl" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@hearwise.in" />
            </div>
            <div>
              <Label>{t('password', lang)}</Label>
              <Input className="mt-1.5 h-12 rounded-xl" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <Button className="h-14 rounded-2xl text-base font-semibold" onClick={handleLogin} disabled={loginLoading || !email || !password}>
              {loginLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn size={18} className="mr-2" />}
              {t('signIn', lang)}
            </Button>
            <Button variant="ghost" className="h-10" onClick={() => navigate('/')}>
              <ArrowLeft size={16} className="mr-1" /> {t('backToHome', lang)}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredSessions = filterDistrict === 'all'
    ? sessions
    : sessions.filter((s) => s.schools?.district === filterDistrict);

  // Simple bar chart via divs
  const maxTrendVal = Math.max(1, ...trend.map(t => t.normal + t.mild + t.refer));

  return (
    <div className="min-h-screen px-4 py-6 pb-20 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">{t('adminDashboard', lang)}</h1>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut size={16} className="mr-1" /> {t('logout', lang)}
        </Button>
      </div>

      {dataLoading ? (
        <div className="mt-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Card className="rounded-2xl">
              <CardContent className="flex flex-col items-center p-4">
                <School className="text-primary" size={24} />
                <span className="mt-1 text-2xl font-bold">{stats.totalSchools}</span>
                <span className="text-[11px] text-muted-foreground">{t('totalSchools', lang)}</span>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardContent className="flex flex-col items-center p-4">
                <Users className="text-primary" size={24} />
                <span className="mt-1 text-2xl font-bold">{stats.totalStudents}</span>
                <span className="text-[11px] text-muted-foreground">{t('studentsTested', lang)}</span>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-destructive/20">
              <CardContent className="flex flex-col items-center p-4">
                <AlertOctagon className="text-destructive" size={24} />
                <span className="mt-1 text-2xl font-bold">{stats.totalReferrals}</span>
                <span className="text-[11px] text-muted-foreground">{t('totalReferrals', lang)}</span>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardContent className="flex flex-col items-center p-4">
                <BarChart3 className="text-secondary" size={24} />
                <span className="mt-1 text-2xl font-bold">{stats.totalSessions}</span>
                <span className="text-[11px] text-muted-foreground">{t('sessions', lang)}</span>
              </CardContent>
            </Card>
          </div>

          {/* Trend chart */}
          {trend.length > 0 && (
            <Card className="mt-6 rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{t('hearingHealthTrend', lang)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 h-32">
                  {trend.map((t, i) => {
                    const total = t.normal + t.mild + t.refer;
                    return (
                      <div key={i} className="flex flex-1 flex-col items-center gap-1">
                        <div className="flex w-full flex-col-reverse" style={{ height: `${(total / maxTrendVal) * 100}%` }}>
                          {t.refer > 0 && <div className="bg-destructive rounded-t" style={{ height: `${(t.refer / total) * 100}%`, minHeight: 2 }} />}
                          {t.mild > 0 && <div className="bg-warning" style={{ height: `${(t.mild / total) * 100}%`, minHeight: 2 }} />}
                          {t.normal > 0 && <div className="bg-success rounded-b" style={{ height: `${(t.normal / total) * 100}%`, minHeight: 2 }} />}
                        </div>
                        <span className="text-[9px] text-muted-foreground">{t.month.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex gap-4 text-[10px]">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> {t('normal', lang)}</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" /> {t('mild', lang)}</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" /> {t('refer', lang)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filter & Sessions */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{t('recentSessions', lang)}</h3>
              <Select value={filterDistrict} onValueChange={setFilterDistrict}>
                <SelectTrigger className="h-8 w-36 text-xs rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allDistricts', lang)}</SelectItem>
                  {TAMIL_NADU_DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {filteredSessions.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">{t('noSessionsFound', lang)}</p>
              ) : (
                filteredSessions.map((s) => (
                  <Card key={s.id} className="rounded-xl">
                    <CardContent className="flex items-center justify-between p-3">
                      <div>
                        <p className="text-sm font-medium">{s.schools?.name}</p>
                        <p className="text-xs text-muted-foreground">{s.teachers?.name} • {s.schools?.district}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{s.session_date}</span>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Export */}
          <div className="mt-6 flex flex-col gap-3">
            <Button variant="outline" className="h-12 gap-2 rounded-xl" onClick={handleExportCSV} disabled={exporting}>
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download size={16} />}
              {t('exportDataCsv', lang)}
            </Button>
          </div>
        </>
      )}

      <div className="mt-8 text-center">
        <p className="text-[10px] text-muted-foreground">© 2025 HearWise Technologies. {t('footerTagline', lang)}</p>
        <p className="mt-1 text-[10px] text-muted-foreground">{t('dataPrivacyNote', lang)}</p>
      </div>
    </div>
  );
}
