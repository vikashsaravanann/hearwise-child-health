import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getRecentSessions, getMonthlyTrend, exportCSV } from '@/lib/database';
import { TAMIL_NADU_DISTRICTS } from '@/lib/districts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Users, School, AlertOctagon, LogIn, Download, Loader2, LogOut, ArrowLeft, TrendingUp, Activity, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface Stats {
  totalSchools: number;
  totalStudents: number;
  totalReferrals: number;
  totalSessions: number;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  // Using sessionStorage to persist login across reloads during the session
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isAdminLoggedIn') === 'true');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [stats, setStats] = useState<Stats>({ totalSchools: 0, totalStudents: 0, totalReferrals: 0, totalSessions: 0 });
  const [sessions, setSessions] = useState<any[]>([]);
  const [trend, setTrend] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

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
      // Format trend for recharts
      const formattedTrend = t.map((item: any) => ({
        name: item.month.slice(5),
        Normal: item.normal,
        Mild: item.mild,
        Refer: item.refer,
        Total: item.normal + item.mild + item.refer
      }));
      setTrend(formattedTrend);
    } catch (e) {
      console.error('Dashboard load error:', e);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    // Hardcoded Admin Credentials
    setTimeout(() => {
      if (email === 'vikash07052008@gmail.com' && password === 'HearWise@technologies.2026') {
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        setIsLoggedIn(true);
        toast({ title: 'Welcome Admin', description: 'Logged in successfully.' });
      } else {
        toast({ title: 'Login failed', description: 'Invalid email or password. Access restricted to admin only.', variant: 'destructive' });
      }
      setLoginLoading(false);
    }, 800); // simulate network request for effect
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    setIsLoggedIn(false);
    toast({ title: 'Logged out successfully' });
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const csv = await exportCSV();
      if (!csv) {
        toast({ title: 'No data to export' });
        return;
      }
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hearwise-data-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Export Successful', description: 'Data downloaded as CSV.' });
    } catch (e) {
      toast({ title: 'Export failed', variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted px-6 py-8">
        <div className="absolute top-4 left-4">
          <Button variant="ghost" className="h-10 text-muted-foreground hover:text-foreground transition-colors" onClick={() => navigate('/')}>
            <ArrowLeft size={16} className="mr-2" /> Back to Home
          </Button>
        </div>
        <Card className="w-full max-w-md rounded-[24px] shadow-2xl border-border/50 bg-background/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <Activity className="text-primary w-8 h-8" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Admin Portal</CardTitle>
            <p className="text-sm text-muted-foreground">Authorized Access Only</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</Label>
              <Input className="h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary transition-all focus:bg-background" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@hearwise.in" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</Label>
              <Input className="h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary transition-all focus:bg-background" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <Button className="mt-4 h-14 rounded-xl text-base font-bold shadow-lg hover:shadow-primary/25 transition-all" onClick={handleLogin} disabled={loginLoading || !email || !password}>
              {loginLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn size={20} className="mr-2" />}
              Access Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredSessions = filterDistrict === 'all'
    ? sessions
    : sessions.filter((s: any) => s.schools?.district === filterDistrict);

  return (
    <div className="min-h-screen bg-muted/20 px-4 py-6 sm:px-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-in slide-in-from-top-4 fade-in duration-500">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">HearWise HQ</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time Hearing Health Analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-border/50 bg-background/50 backdrop-blur" onClick={() => navigate('/')}>
            <ArrowLeft size={16} className="mr-2" /> Home
          </Button>
          <Button variant="default" className="rounded-xl shadow-md" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" /> Logout
          </Button>
        </div>
      </div>

      {dataLoading ? (
        <div className="mt-32 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Synchronizing Data...</p>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
          {/* Top KPI Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-none shadow-sm bg-gradient-to-br from-blue-500/10 to-transparent">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Schools</p>
                    <p className="text-4xl font-black">{stats.totalSchools}</p>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-2xl">
                    <School className="text-blue-600 h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-blue-600 font-medium">
                  <TrendingUp className="mr-1 h-4 w-4" /> +12% this month
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none shadow-sm bg-gradient-to-br from-indigo-500/10 to-transparent">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Children Screened</p>
                    <p className="text-4xl font-black">{stats.totalStudents}</p>
                  </div>
                  <div className="bg-indigo-500/20 p-3 rounded-2xl">
                    <Users className="text-indigo-600 h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-indigo-600 font-medium">
                  <TrendingUp className="mr-1 h-4 w-4" /> Impact growing
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none shadow-sm bg-gradient-to-br from-emerald-500/10 to-transparent">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Normal Hearing</p>
                    <p className="text-4xl font-black">{stats.totalStudents - stats.totalReferrals}</p>
                  </div>
                  <div className="bg-emerald-500/20 p-3 rounded-2xl">
                    <CheckCircle2 className="text-emerald-600 h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium">
                  Majority healthy
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none shadow-sm bg-gradient-to-br from-rose-500/10 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-rose-600/80">Action Required (Referrals)</p>
                    <p className="text-4xl font-black text-rose-600">{stats.totalReferrals}</p>
                  </div>
                  <div className="bg-rose-500/20 p-3 rounded-2xl">
                    <AlertOctagon className="text-rose-600 h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-rose-600 font-medium">
                  Needs medical follow-up
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="lg:col-span-2 rounded-3xl border-border/50 shadow-sm overflow-hidden bg-background/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Monthly Screening Trends</CardTitle>
                <CardDescription>Visualizing outcomes over recent months</CardDescription>
              </CardHeader>
              <CardContent>
                {trend.length > 0 ? (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="Total" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">Not enough data to display trend</div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden bg-background/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Outcome Distribution</CardTitle>
                <CardDescription>Breakdown by result severity</CardDescription>
              </CardHeader>
              <CardContent>
                {trend.length > 0 ? (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                        <Bar dataKey="Normal" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="Mild" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="Refer" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data available</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Session Data Table */}
          <Card className="rounded-3xl border-border/50 shadow-sm mt-6 overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 pb-4">
              <div>
                <CardTitle className="text-xl">Field Sessions Log</CardTitle>
                <CardDescription>Detailed records of screening activities across districts</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Select value={filterDistrict} onValueChange={setFilterDistrict}>
                  <SelectTrigger className="w-[180px] h-10 rounded-xl bg-background border-border/50 shadow-sm font-medium">
                    <SelectValue placeholder="Filter by District" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Districts</SelectItem>
                    {TAMIL_NADU_DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button className="h-10 gap-2 rounded-xl shadow-sm" onClick={handleExportCSV} disabled={exporting}>
                  {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download size={16} />}
                  <span className="hidden sm:inline">Export CSV</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
                    <tr>
                      <th className="px-6 py-4 font-semibold">School Name</th>
                      <th className="px-6 py-4 font-semibold">District</th>
                      <th className="px-6 py-4 font-semibold">Assigned Teacher</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSessions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                          No screening sessions found in this district.
                        </td>
                      </tr>
                    ) : (
                      filteredSessions.map((s: any, idx: number) => (
                        <tr key={s.id} className={`border-b border-border/40 hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}>
                          <td className="px-6 py-4 font-medium text-foreground">{s.schools?.name || 'Unknown School'}</td>
                          <td className="px-6 py-4 text-muted-foreground">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/20 text-secondary-foreground">
                              {s.schools?.district || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                              {s.teachers?.name ? s.teachers.name.charAt(0).toUpperCase() : 'T'}
                            </div>
                            {s.teachers?.name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{new Date(s.session_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                          <td className="px-6 py-4 text-muted-foreground">{s.student_count || 0}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <div className="mt-16 text-center animate-in fade-in duration-1000 delay-300">
        <div className="h-px w-24 bg-border mx-auto mb-6"></div>
        <p className="text-sm font-semibold text-foreground">HearWise Technologies</p>
        <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
          Empowering educational institutions with accessible audiometry. Officially launching <strong>June 7th, 2026</strong> at <strong>Rathinam Technical Campus (University)</strong>.
        </p>
      </div>
    </div>
  );
}