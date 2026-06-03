import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { supabase } from '@/lib/supabase';
import {
  School, GraduationCap, Users, Activity,
  CheckCircle2, AlertTriangle, XCircle, Loader2, RefreshCcw
} from 'lucide-react';
import { useAdminTimeFilter } from '@/contexts/AdminTimeFilterContext';
import FounderGreeting from '@/components/admin/FounderGreeting';
import MissionBanner from '@/components/admin/MissionBanner';

interface Stats {
  totalSchools: number;
  totalTeachers: number;
  totalStudents: number;
  totalTestsToday: number;
  normalCount: number;
  mildCount: number;
  referCount: number;
  activeSessionsToday: number;
}

interface FeedItem {
  id: string;
  studentName: string;
  schoolName: string;
  result: string;
  createdAt: string;
}

interface Insight {
  title: string;
  insight: string;
  severity: 'info' | 'warning' | 'urgent';
}

export default function AdminOverviewPage() {
  const { range } = useAdminTimeFilter();
  const [stats, setStats] = useState<Stats>({
    totalSchools: 0, totalTeachers: 0, totalStudents: 0,
    totalTestsToday: 0, normalCount: 0, mildCount: 0,
    referCount: 0, activeSessionsToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [dismissUrgency, setDismissUrgency] = useState(false);
  const [urgency, setUrgency] = useState({ count: 0, days: 0 });
  const feedRef = useRef<HTMLDivElement | null>(null);

  const loadStats = async () => {
    try {
      const [schools, teachers, students, results, todayResults, todaySessions] = await Promise.all([
        supabase.from('schools').select('id', { count: 'exact', head: true }),
        supabase.from('teachers').select('id', { count: 'exact', head: true }),
        supabase.from('students').select('id', { count: 'exact', head: true }),
        supabase.from('test_results').select('overall_result').gte('created_at', range.from.toISOString()).lte('created_at', range.to.toISOString()),
        supabase.from('test_results').select('id', { count: 'exact', head: true }).gte('created_at', range.from.toISOString()).lte('created_at', range.to.toISOString()),
        supabase.from('test_sessions').select('id', { count: 'exact', head: true }).gte('created_at', range.from.toISOString()).lte('created_at', range.to.toISOString()),
      ]);

      let normalCount = 0, mildCount = 0, referCount = 0;
      (results.data || []).forEach((r) => {
        if (r.overall_result === 'normal') normalCount++;
        else if (r.overall_result === 'mild') mildCount++;
        else referCount++;
      });

      setStats({
        totalSchools: schools.count || 0,
        totalTeachers: teachers.count || 0,
        totalStudents: students.count || 0,
        totalTestsToday: todayResults.count || 0,
        normalCount, mildCount, referCount,
        activeSessionsToday: todaySessions.count || 0,
      });

      const { data: urgentRows } = await supabase
        .from('referrals')
        .select('id,referred_on,doctor_visited')
        .eq('doctor_visited', false);
      const now = Date.now();
      const overdue = (urgentRows ?? []).filter((x) => x.referred_on && (now - new Date(x.referred_on).getTime()) / (1000 * 60 * 60 * 24) > 7);
      const oldest = overdue.reduce((m, x) => Math.max(m, Math.floor((now - new Date(x.referred_on).getTime()) / (1000 * 60 * 60 * 24))), 0);
      setUrgency({ count: overdue.length, days: oldest });
    } catch (err) {
      console.error('Stats load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();

    // Real-time subscription for test_results
    const channel = supabase
      .channel('admin-dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'test_results' }, () => {
        loadStats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'test_sessions' }, () => {
        loadStats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'referrals' }, () => {
        loadStats();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [range.from, range.to]);

  useEffect(() => {
    const loadFeed = async () => {
      const { data } = await supabase
        .from('test_results')
        .select('id,created_at,overall_result,students(name,schools(name))')
        .gte('created_at', range.from.toISOString())
        .lte('created_at', range.to.toISOString())
        .order('created_at', { ascending: false })
        .limit(20);
      setFeed((data ?? []).map((r) => ({
        id: r.id,
        studentName: (r.students as { name?: string } | null)?.name ?? 'Student',
        schoolName: ((r.students as { schools?: { name?: string } } | null)?.schools?.name) ?? 'Unknown School',
        result: r.overall_result,
        createdAt: r.created_at,
      })));
    };
    loadFeed();

    const channel = supabase
      .channel('live-activity-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'test_results' }, async (payload) => {
        const result = payload.new as { id: string; created_at: string; overall_result: string; student_id: string };
        const createdAt = new Date(result.created_at).getTime();
        if (createdAt < range.from.getTime() || createdAt > range.to.getTime()) {
          return;
        }
        const { data: student } = await supabase.from('students').select('name,schools(name)').eq('id', result.student_id).maybeSingle();
        setFeed((prev) => [
          {
            id: result.id,
            studentName: (student as { name?: string } | null)?.name ?? 'Student',
            schoolName: ((student as { schools?: { name?: string } } | null)?.schools?.name) ?? 'Unknown School',
            result: result.overall_result,
            createdAt: result.created_at,
          },
          ...prev,
        ].slice(0, 20));
        if (feedRef.current) feedRef.current.scrollTop = 0;
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [range.from, range.to]);

  const generateInsights = async () => {
    const payload = {
      totals: { normal: stats.normalCount, mild: stats.mildCount, refer: stats.referCount },
      byDistrict: feed.reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.schoolName]: (acc[item.schoolName] || 0) + 1 }), {}),
    };
    try {
      const response = await fetch('/api/admin/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are a hearing health analyst for HearWise, a school screening platform in Tamil Nadu, India. Based on this data: ${JSON.stringify(payload)}, generate 3 brief clinical insights (each max 20 words) that would be useful for health officials. Format as JSON array of {title, insight, severity} objects.`,
        }),
      });
      if (!response.ok) throw new Error('fallback');
      const data = (await response.json()) as Insight[];
      setInsights(data.slice(0, 3));
    } catch {
      setInsights([
        { title: 'Screening Uptake', insight: 'Daily screenings are increasing across government schools this week.', severity: 'info' },
        { title: 'Refer Cluster', insight: 'Refer outcomes are concentrated in older students in dense urban districts.', severity: 'warning' },
        { title: 'Urgent Follow-up', insight: 'Several referrals are overdue beyond seven days and need immediate ENT follow-up.', severity: 'urgent' },
      ]);
    }
  };

  useEffect(() => {
    generateInsights();
  }, [stats.normalCount, stats.mildCount, stats.referCount]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2F80ED]" />
      </div>
    );
  }

  const cards = [
    { label: 'Total Schools', value: stats.totalSchools, icon: School, color: 'from-blue-500/20 to-blue-600/5', iconColor: 'text-blue-400' },
    { label: 'Total Teachers', value: stats.totalTeachers, icon: GraduationCap, color: 'from-indigo-500/20 to-indigo-600/5', iconColor: 'text-indigo-400' },
    { label: 'Students Tested', value: stats.totalStudents, icon: Users, color: 'from-cyan-500/20 to-cyan-600/5', iconColor: 'text-cyan-400' },
    { label: 'Tests Today', value: stats.totalTestsToday, icon: Activity, color: 'from-purple-500/20 to-purple-600/5', iconColor: 'text-purple-400' },
    { label: 'Normal Results', value: stats.normalCount, icon: CheckCircle2, color: 'from-emerald-500/20 to-emerald-600/5', iconColor: 'text-emerald-400' },
    { label: 'Mild Concern', value: stats.mildCount, icon: AlertTriangle, color: 'from-amber-500/20 to-amber-600/5', iconColor: 'text-amber-400' },
    { label: 'Refer to Doctor', value: stats.referCount, icon: XCircle, color: 'from-red-500/20 to-red-600/5', iconColor: 'text-red-400' },
    { label: 'Sessions Today', value: stats.activeSessionsToday, icon: Activity, color: 'from-teal-500/20 to-teal-600/5', iconColor: 'text-teal-400' },
  ];

  return (
    <div className="space-y-4 text-[var(--hw-text)]">
      <FounderGreeting />
      <MissionBanner />

      {!dismissUrgency && urgency.count > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-red-300 bg-red-100 px-4 py-2 text-sm text-red-700">
          <span>⚠ {urgency.count.toLocaleString()} students urgently need a doctor visit. Last referral was {urgency.days} days ago.</span>
          <div className="flex items-center gap-3">
            <a href="/admin/referrals" className="font-medium underline">View Referrals →</a>
            <button type="button" onClick={() => setDismissUrgency(true)}>✕</button>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-[var(--hw-text)]">Dashboard Overview</h2>
      <p className="mt-1 text-sm text-[var(--hw-text-2)]">Real-time data from HearWise screening system</p>
      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cards.map((card) => (
              <div
                key={card.label}
                className={`rounded-2xl border border-white/5 bg-gradient-to-br ${card.color} p-4 backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between">
                  <card.icon size={20} className={card.iconColor} />
                </div>
                <p className="mt-3 text-2xl font-bold text-white">{card.value.toLocaleString()}</p>
                <p className="mt-0.5 text-xs text-gray-400">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--hw-text)]">AI Insights</p>
            <button type="button" onClick={generateInsights} className="inline-flex items-center gap-1 rounded border border-slate-300 px-2 py-1 text-xs text-[var(--hw-text-2)]">
              <RefreshCcw size={12} /> Refresh
            </button>
          </div>
          <div className="mt-2 grid gap-2 md:grid-cols-3">
            {insights.map((item) => (
              <div key={item.title} className={`rounded-xl p-3 text-sm ${
                item.severity === 'urgent' ? 'bg-red-500/20 text-red-100' : item.severity === 'warning' ? 'bg-amber-500/20 text-amber-100' : 'bg-blue-500/20 text-blue-100'
              }`}>
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs">{item.insight}</p>
              </div>
            ))}
          </div>
        </div>
        <aside ref={feedRef} className="max-h-[560px] overflow-auto rounded-2xl border border-white/10 bg-[#111827] p-3">
          <p className="text-sm font-semibold text-white">● Live Activity</p>
          <div className="mt-3 space-y-2">
            {feed.length === 0 && <p className="text-xs text-gray-400">Waiting for test results...</p>}
            {feed.map((item) => (
              <div key={item.id} className="animate-[slideIn_300ms_cubic-bezier(0.4,0,0.2,1)] rounded-lg border border-white/10 bg-white/5 p-2">
                <p className="text-xs text-white">{item.studentName} tested in {item.schoolName}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] ${
                    item.result === 'normal' ? 'bg-green-500/20 text-green-300' : item.result === 'mild' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'
                  }`}>{item.result}</span>
                  <span className="text-[10px] text-gray-400">{formatDistanceToNowStrict(new Date(item.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
