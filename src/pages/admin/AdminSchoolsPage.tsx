import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminDataTable from '@/components/AdminDataTable';

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
  const [data, setData] = useState<SchoolRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: schools } = await supabase.from('schools').select('*').order('created_at', { ascending: false });
      if (!schools) { setLoading(false); return; }

      const enriched: SchoolRow[] = await Promise.all(
        schools.map(async (s) => {
          const [t, st] = await Promise.all([
            supabase.from('teachers').select('id', { count: 'exact', head: true }).eq('school_id', s.id),
            supabase.from('students').select('id', { count: 'exact', head: true }).eq('school_id', s.id),
          ]);
          return { ...s, teacherCount: t.count || 0, studentCount: st.count || 0 };
        })
      );
      setData(enriched);
      setLoading(false);
    };
    load();
  }, []);

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
    <AdminDataTable
      title="Schools"
      description="All registered schools in the system"
      columns={columns}
      data={data}
      loading={loading}
      searchPlaceholder="Search by school name..."
      searchField={(r) => r.name}
    />
  );
}
