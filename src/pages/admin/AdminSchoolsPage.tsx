import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminDataTable from '@/components/AdminDataTable';
import { useAdminFilter } from '@/contexts/AdminFilterContext';

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
  const { range } = useAdminFilter();
  const [data, setData] = useState<SchoolRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const { data: schools } = await supabase.from('schools').select('*').order('created_at', { ascending: false });
      if (!schools) { setLoading(false); return; }

      const enriched: SchoolRow[] = await Promise.all(
        schools.map(async (s) => {
          const [t, st] = await Promise.all([
            supabase.from('teachers').select('id', { count: 'exact', head: true }).eq('school_id', s.id),
            supabase.from('test_results').select('id', { count: 'exact', head: true }).gte('created_at', range.from).lte('created_at', `${range.to}T23:59:59`).in('student_id', (await supabase.from('students').select('id').eq('school_id', s.id)).data?.map((st) => st.id) ?? []),
          ]);
          return { ...s, teacherCount: t.count || 0, studentCount: st.count || 0 };
        })
      );
      setData(enriched);
      setLoading(false);
    } catch {
      setError('Failed to load schools');
    }
  };

  useEffect(() => {
    load();
  }, [range.from, range.to]);

  const columns = [
    { key: 'name', label: 'School Name' },
    { key: 'district', label: 'District' },
    { key: 'state', label: 'State' },
    { key: 'type', label: 'Type', render: (r: SchoolRow) => <span className="rounded-full bg-[#EBF3FD] px-2 py-0.5 text-[10px] text-[#2F80ED]">{r.type || 'N/A'}</span> },
    { key: 'teacherCount', label: 'Teachers' },
    { key: 'studentCount', label: 'Students Tested' },
    { key: 'created_at', label: 'Registered', render: (r: SchoolRow) => new Date(r.created_at).toLocaleDateString() },
  ];

  return (
    <AdminDataTable
      title="Schools"
      description="All registered schools in the system"
      columns={columns}
      data={data}
      loading={loading}
      error={error}
      onRetry={load}
      searchPlaceholder="Search by school name..."
      searchField={(r) => r.name}
    />
  );
}
