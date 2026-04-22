/**
 * AdminOverviewPage — Main dashboard with stat cards + real-time updates.
 */
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  School, GraduationCap, Users, Activity,
  CheckCircle2, AlertTriangle, XCircle, Loader2
} from 'lucide-react';

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
  const [stats, setStats] = useState<Stats>({
    totalSchools: 0, totalTeachers: 0, totalStudents: 0,
    totalTestsToday: 0, normalCount: 0, mildCount: 0,
    referCount: 0, activeSessionsToday: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);

      const [schools, teachers, students, results, todayResults, todaySessions] = await Promise.all([
        supabase.from('schools').select('id', { count: 'exact', head: true }),
        supabase.from('teachers').select('id', { count: 'exact', head: true }),
        supabase.from('students').select('id', { count: 'exact', head: true }),
        supabase.from('test_results').select('overall_result'),
        supabase.from('test_results').select('id', { count: 'exact', head: true }).gte('created_at', today),
        supabase.from('test_sessions').select('id', { count: 'exact', head: true }).gte('created_at', today),
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
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

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
    <div>
      <h2 className="text-xl font-bold text-white">Dashboard Overview</h2>
      <p className="mt-1 text-sm text-gray-500">Real-time data from HearWise screening system</p>

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
    </div>
  );
}
