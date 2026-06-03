import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminDataTable from '@/components/AdminDataTable';
import { useAdminTimeFilter } from '@/contexts/AdminTimeFilterContext';

interface SchoolRow {
  id: string;
  name: string;
  district: string;
  state: string;
  type: string | null;
  created_at: string;
  teacherCount: number;
  studentCount: number;
  [key: string]: unknown;
}

export default function AdminSchoolsPage() {
  const { range } = useAdminTimeFilter();
  const [data, setData] = useState<SchoolRow[]>([]);
  const [leaderboard, setLeaderboard] = useState<Array<{ name: string; students: number; normalRate: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: schools } = await supabase.from('schools').select('*').order('created_at', { ascending: false });
      if (!schools) { setLoading(false); return; }

      const enriched: SchoolRow[] = await Promise.all(
        schools.map(async (s) => {
          const { data: schoolStudents } = await supabase.from('students').select('id').eq('school_id', s.id);
          const studentIds = (schoolStudents ?? []).map((x) => x.id);
          const [t, st] = await Promise.all([
            supabase.from('teachers').select('id', { count: 'exact', head: true }).eq('school_id', s.id),
            supabase.from('test_results').select('id,overall_result').in('student_id', studentIds.length ? studentIds : ['']).gte('created_at', range.from.toISOString()).lte('created_at', range.to.toISOString()),
          ]);
          const rows = st.data ?? [];
          const normalRate = rows.length ? Math.round((rows.filter((x) => x.overall_result === 'normal').length / rows.length) * 100) : 0;
          return { ...s, teacherCount: t.count || 0, studentCount: rows.length || 0, normalRate };
        })
      );
      setData(enriched);
      const top = [...enriched]
        .sort((a, b) => b.studentCount - a.studentCount)
        .slice(0, 5)
        .map((x) => ({ name: x.name, students: x.studentCount, normalRate: (x as SchoolRow & { normalRate?: number }).normalRate ?? 0 }));
      setLeaderboard(top);
      setLoading(false);
    };
    load();
  }, [range.from, range.to]);

  const columns = [
    { key: 'name', label: 'School Name' },
    { key: 'district', label: 'District' },
    { key: 'state', label: 'State' },
    { key: 'type', label: 'Type', render: (r: SchoolRow) => <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs">{r.type || 'N/A'}</span> },
    { key: 'teacherCount', label: 'Teachers' },
    { key: 'studentCount', label: 'Students Tested' },
    { key: 'created_at', label: 'Registered', render: (r: SchoolRow) => new Date(r.created_at).toLocaleDateString() },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-black/10 bg-[var(--hw-surface)] p-4 text-[var(--hw-text)]">
        <h3 className="text-sm font-semibold">School Performance Leaderboard</h3>
        <div className="mt-3 space-y-2">
          {leaderboard.map((s, idx) => (
            <div key={s.name} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
              <div className="flex items-center justify-between">
                <p>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`} {s.name}</p>
                <span>{s.students.toLocaleString()} students</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-[#2F80ED]" style={{ width: `${s.normalRate}%` }} />
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                <span>{s.normalRate}% normal rate</span>
                {idx === 0 && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">Most Active This Week</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <AdminDataTable
        title="Schools"
        description="All registered schools in the system"
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="Search schools by name or district..."
        searchField={(r) => `${r.name} ${r.district}`}
      />
    </div>
  );
}
