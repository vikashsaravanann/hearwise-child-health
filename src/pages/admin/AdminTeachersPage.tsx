import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminDataTable from '@/components/AdminDataTable';
import { useAdminTimeFilter } from '@/contexts/AdminTimeFilterContext';

interface TeacherRow {
  id: string;
  name: string;
  phone: string | null;
  created_at: string;
  schoolName: string;
  sessionCount: number;
  studentCount: number;
  [key: string]: unknown;
}

export default function AdminTeachersPage() {
  const { range } = useAdminTimeFilter();
  const [data, setData] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: teachers } = await supabase
        .from('teachers')
        .select('*, schools ( name )')
        .order('created_at', { ascending: false });

      if (!teachers) { setLoading(false); return; }

      const enriched: TeacherRow[] = await Promise.all(
        teachers.map(async (t) => {
          const [sessions, results] = await Promise.all([
            supabase.from('test_sessions').select('id', { count: 'exact', head: true }).eq('teacher_id', t.id),
            supabase.from('test_sessions').select('id').eq('teacher_id', t.id),
          ]);

          let studentCount = 0;
          if (results.data && results.data.length > 0) {
            const sessionIds = results.data.map((s) => s.id);
            const { count } = await supabase
              .from('test_results')
              .select('id', { count: 'exact', head: true })
              .in('session_id', sessionIds)
              .gte('created_at', range.from.toISOString())
              .lte('created_at', range.to.toISOString());
            studentCount = count || 0;
          }

          const schoolData = t.schools as { name: string } | null;
          return {
            ...t,
            schoolName: schoolData?.name || '—',
            sessionCount: sessions.count || 0,
            studentCount,
          };
        })
      );
      setData(enriched);
      setLoading(false);
    };
    load();
  }, [range.from, range.to]);

  const columns = [
    { key: 'name', label: 'Teacher Name' },
    { key: 'schoolName', label: 'School' },
    { key: 'phone', label: 'Phone', render: (r: TeacherRow) => r.phone || '—' },
    { key: 'sessionCount', label: 'Sessions' },
    { key: 'studentCount', label: 'Students Tested' },
    { key: 'created_at', label: 'Registered', render: (r: TeacherRow) => new Date(r.created_at).toLocaleDateString() },
  ];

  return (
    <AdminDataTable
      title="Teachers"
      description="All registered teachers and their test activity"
      columns={columns}
      data={data}
      loading={loading}
      searchPlaceholder="Search by teacher name..."
      searchField={(r) => r.name}
    />
  );
}
