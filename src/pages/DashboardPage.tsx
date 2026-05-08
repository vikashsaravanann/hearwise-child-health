import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  exportCSV,
  getDashboardStats,
  getRecentSessions,
  getMonthlyTrend,
  getDetailedStudentResults,
  type DetailedStudentResult,
} from '@/lib/database';
import { TAMIL_NADU_DISTRICTS } from '@/lib/districts';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { School, AlertOctagon, LogIn, Download, Loader2, LogOut, ArrowLeft, Activity, CheckCircle2, XCircle, AlertTriangle, UserCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.toLowerCase() ?? 'vikash07052008@gmail.com';

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

function buildHearingProblemDescription(row: DetailedStudentResult, lang: 'en' | 'ta'): string {
  if (row.overallResult === 'normal') return t('noIssue', lang);

  const leftFailed: string[] = [];
  if (!row.leftEar500) leftFailed.push('500Hz');
  if (!row.leftEar1000) leftFailed.push('1kHz');
  if (!row.leftEar2000) leftFailed.push('2kHz');
  if (!row.leftEar4000) leftFailed.push('4kHz');

  const rightFailed: string[] = [];
  if (!row.rightEar500) rightFailed.push('500Hz');
  if (!row.rightEar1000) rightFailed.push('1kHz');
  if (!row.rightEar2000) rightFailed.push('2kHz');
  if (!row.rightEar4000) rightFailed.push('4kHz');

  const parts: string[] = [];
  if (leftFailed.length > 0) parts.push(`${t('leftEarShort', lang)}: ${leftFailed.join(', ')}`);
  if (rightFailed.length > 0) parts.push(`${t('rightEarShort', lang)}: ${rightFailed.join(', ')}`);

  if (parts.length === 0) {
    return row.overallResult === 'refer'
      ? (lang === 'ta' ? 'அதிக பொய் நேர்மறை – மருத்துவர் பரிந்துரை' : 'High false positives – refer to doctor')
      : (lang === 'ta' ? 'சில அலைவரிசைகள் பலவீனமாக உள்ளன' : 'Some frequencies weak');
  }

  return parts.join(' | ');
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
  const [studentResults, setStudentResults] = useState<DetailedStudentResult[]>([]);
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
      const [s, sess, tr, sr] = await Promise.all([
        getDashboardStats(),
        getRecentSessions(),
        getMonthlyTrend(),
        getDetailedStudentResults(200),
      ]);
      setStats(s);
      setSessions(sess);
      setTrend(tr);
      setStudentResults(sr);
    } catch (e) {
      console.error('Dashboard load error:', e);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async () => {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      toast({ title: t('loginFailed', lang), description: t('unauthorizedEmail', lang), variant: 'destructive' });
      return;
    }
    setLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
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
              <Input className="mt-1.5 h-12 rounded-xl" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={ADMIN_EMAIL} />
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

  const filteredStudentResults = filterDistrict === 'all'
    ? studentResults
    : studentResults.filter((r) => r.district === filterDistrict);

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
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card className="rounded-2xl">
              <CardContent className="flex flex-col items-center p-4">
                <School className="text-primary" size={24} />
                <span className="mt-1 text-2xl font-bold">{stats.totalSchools}</span>
                <span className="text-[11px] text-muted-foreground">{t('totalSchools', lang)}</span>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardContent className="flex flex-col items-center p-4">
                <UserCheck className="text-primary" size={24} />
                <span className="mt-1 text-2xl font-bold">{stats.totalStudents}</span>
                <span className="text-[11px] text-muted-foreground">{t('studentsChecked', lang)}</span>
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
                <Activity className="text-secondary" size={24} />
                <span className="mt-1 text-2xl font-bold">{stats.totalSessions}</span>
                <span className="text-[11px] text-muted-foreground">{t('appUsageCount', lang)}</span>
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

          {/* Student Hearing Results */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">{t('studentResults', lang)}</h3>
                <p className="text-[11px] text-muted-foreground">{t('studentResultsDesc', lang)}</p>
              </div>
              <Select value={filterDistrict} onValueChange={setFilterDistrict}>
                <SelectTrigger className="h-8 w-36 text-xs rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allDistricts', lang)}</SelectItem>
                  {TAMIL_NADU_DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {filteredStudentResults.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">{t('noStudentResults', lang)}</p>
              ) : (
                filteredStudentResults.map((sr) => {
                  const isRefer = sr.overallResult === 'refer';
                  const isMild = sr.overallResult === 'mild';
                  const resultColor = isRefer
                    ? 'border-destructive/30 bg-destructive/5'
                    : isMild
                      ? 'border-warning/30 bg-warning/5'
                      : 'border-success/30 bg-success/5';
                  const resultIcon = isRefer
                    ? <XCircle className="h-4 w-4 text-destructive shrink-0" />
                    : isMild
                      ? <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                      : <CheckCircle2 className="h-4 w-4 text-success shrink-0" />;
                  const resultLabel = isRefer
                    ? t('refer', lang)
                    : isMild
                      ? t('mild', lang)
                      : t('normal', lang);
                  const problemDesc = buildHearingProblemDescription(sr, lang);

                  return (
                    <Card key={sr.id} className={`rounded-xl border ${resultColor}`}>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {resultIcon}
                              <p className="text-sm font-semibold truncate">{sr.studentName}</p>
                              {sr.studentAge !== null && (
                                <span className="text-xs text-muted-foreground shrink-0">({sr.studentAge}y)</span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {t('teacherName', lang)}: <span className="font-medium text-foreground">{sr.teacherName}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {sr.schoolName}{sr.district ? ` • ${sr.district}` : ''}
                            </p>
                            {!isRefer && !isMild ? null : (
                              <p className="mt-1 text-xs font-medium text-foreground">
                                {t('problemDescription', lang)}: {problemDesc}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${isRefer ? 'bg-destructive/15 text-destructive' : isMild ? 'bg-warning/20 text-warning-foreground' : 'bg-success/15 text-success'}`}>
                              {resultLabel}
                            </span>
                            {sr.referred && (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                {sr.doctorVisited ? t('doctorVisited', lang) : t('referred', lang)}
                              </span>
                            )}
                            {sr.sessionDate && (
                              <span className="text-[10px] text-muted-foreground">{sr.sessionDate}</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Filter & Sessions */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold">{t('recentSessions', lang)}</h3>
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
