import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminDataTable from '@/components/AdminDataTable';
import { Phone } from 'lucide-react';

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
              .in('session_id', sessionIds);
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
  }, []);

  const columns = [
    { key: 'name', label: 'Teacher Name', render: (r: TeacherRow) => <span className="text-[13px] font-medium text-[#0F172A]">{r.name}</span> },
    { key: 'schoolName', label: 'School' },
    { key: 'phone', label: 'Phone', render: (r: TeacherRow) => <span className="inline-flex items-center gap-1"><Phone size={12} />{r.phone || '—'}</span> },
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
