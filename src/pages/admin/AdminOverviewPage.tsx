/**
 * AdminOverviewPage — Main dashboard with stat cards + real-time updates.
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  School, GraduationCap, Users, AlertTriangle, ArrowRight
} from 'lucide-react';
import { useAdminFilter } from '@/contexts/AdminFilterContext';
import AdminDataTable from '@/components/AdminDataTable';

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

export default function AdminOverviewPage() {
  const navigate = useNavigate();
  const { range } = useAdminFilter();
  const [stats, setStats] = useState<Stats>({
    totalSchools: 0, totalTeachers: 0, totalStudents: 0,
    totalTestsToday: 0, normalCount: 0, mildCount: 0,
    referCount: 0, activeSessionsToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentStudents, setRecentStudents] = useState<Array<Record<string, unknown>>>([]);

  const loadStats = useCallback(async () => {
    try {
      setError('');

      const [schools, teachers, students, results, todayResults, todaySessions] = await Promise.all([
        supabase.from('schools').select('id', { count: 'exact', head: true }),
        supabase.from('teachers').select('id', { count: 'exact', head: true }),
        supabase.from('students').select('id', { count: 'exact', head: true }),
        supabase.from('test_results').select('overall_result').gte('created_at', range.from).lte('created_at', `${range.to}T23:59:59`),
        supabase.from('test_results').select('id', { count: 'exact', head: true }).gte('created_at', range.from).lte('created_at', `${range.to}T23:59:59`),
        supabase.from('test_sessions').select('id', { count: 'exact', head: true }).gte('created_at', range.from).lte('created_at', `${range.to}T23:59:59`),
      ]);

      const { data: studentsTable } = await supabase
        .from('test_results')
        .select('created_at, overall_result, students(name), test_sessions(teachers(name), schools(name))')
        .order('created_at', { ascending: false })
        .limit(8);

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
      setRecentStudents(
        (studentsTable ?? []).map((row) => ({
          studentName: (row.students as { name: string } | null)?.name ?? '—',
          schoolName: ((row.test_sessions as { schools?: { name: string } } | null)?.schools?.name) ?? '—',
          teacherName: ((row.test_sessions as { teachers?: { name: string } } | null)?.teachers?.name) ?? '—',
          testedAt: new Date(row.created_at).toLocaleString(),
          result: row.overall_result,
        })),
      );
    } catch (err) {
      console.error('Stats load error:', err);
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, [range.from, range.to]);

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
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [loadStats]);

  if (loading) {
    return <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-100" />)}</div>;
  }

  const cards = [
    { label: 'Total Schools', value: stats.totalSchools, icon: School, accent: '#2F80ED' },
    { label: 'Total Teachers', value: stats.totalTeachers, icon: GraduationCap, accent: '#27AE60' },
    { label: 'Students Tested', value: stats.totalTestsToday, icon: Users, accent: '#E2A800' },
    { label: 'Referrals Pending', value: stats.referCount, icon: AlertTriangle, accent: '#EB5757' },
  ];

  const quickActions = [
    { label: 'Manage Schools', href: '/admin/schools' },
    { label: 'Manage Teachers', href: '/admin/teachers' },
    { label: 'Student Results', href: '/admin/students' },
    { label: 'Session Records', href: '/admin/sessions' },
    { label: 'Referral Tracking', href: '/admin/referrals' },
    { label: 'Login History', href: '/admin/logins' },
  ];

  return (
    <div>
      <h2 className="text-[20px] font-medium text-[#0F172A]">Dashboard Overview</h2>
      <p className="mt-1 text-[11px] text-slate-500">Professional hearing screening analytics</p>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="relative rounded-xl border border-black/10 bg-white p-5"
          >
            <p className="text-[10px] uppercase tracking-[0.5px] text-slate-400">{card.label}</p>
            <p className={`mt-2 text-[28px] font-semibold ${card.label === 'Referrals Pending' ? 'text-[#EB5757]' : 'text-[#0F172A]'}`}>
              {card.value.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-500">Live update enabled</p>
            <div className="absolute right-3 top-1/2 h-10 w-[3px] -translate-y-1/2 rounded-sm" style={{ backgroundColor: card.accent }} />
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <p className="text-[14px] font-medium text-[#0F172A]">Normal Results</p>
          <p className="mt-2 text-2xl font-semibold text-[#27AE60]">{stats.normalCount}</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <p className="text-[14px] font-medium text-[#0F172A]">Mild Concern</p>
          <p className="mt-2 text-2xl font-semibold text-[#E2A800]">{stats.mildCount}</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <p className="text-[14px] font-medium text-[#0F172A]">Sessions Today</p>
          <p className="mt-2 text-2xl font-semibold text-[#2F80ED]">{stats.activeSessionsToday}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-black/10 bg-white p-4">
        <h3 className="text-[14px] font-medium text-[#0F172A]">Quick Actions</h3>
        <p className="mt-1 text-[11px] text-slate-500">Open sections instantly.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => navigate(item.href)}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 transition-colors hover:border-[#2F80ED]/40 hover:bg-[#EBF3FD]"
            >
              <span>{item.label}</span>
              <ArrowRight size={15} className="text-[#2F80ED]" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <AdminDataTable
          title="Recent Students"
          description="Latest screenings"
          loading={false}
          error={error}
          onRetry={loadStats}
          data={recentStudents}
          columns={[
            { key: 'studentName', label: 'Student' },
            { key: 'schoolName', label: 'School' },
            { key: 'teacherName', label: 'Teacher' },
            { key: 'testedAt', label: 'Test Date' },
            { key: 'result', label: 'Overall' },
          ]}
          searchPlaceholder="Search student..."
          searchField={(r) => String(r.studentName ?? '')}
        />
      </div>
    </div>
  );
}
