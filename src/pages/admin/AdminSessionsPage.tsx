import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminDataTable from '@/components/AdminDataTable';
import { useAdminTimeFilter } from '@/contexts/AdminTimeFilterContext';

interface SessionRow {
  id: string;
  sessionDate: string;
  teacherName: string;
  schoolName: string;
  deviceInfo: string;
  studentCount: number;
  normalCount: number;
  mildCount: number;
  referCount: number;
  [key: string]: unknown;
}

export default function AdminSessionsPage() {
  const { range } = useAdminTimeFilter();
  const [data, setData] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: sessions } = await supabase
        .from('test_sessions')
        .select('*, teachers ( name ), schools ( name )')
        .gte('created_at', range.from.toISOString())
        .lte('created_at', range.to.toISOString())
        .order('created_at', { ascending: false });

      if (!sessions) { setLoading(false); return; }

      const enriched: SessionRow[] = await Promise.all(
        sessions.map(async (s) => {
          const { data: results } = await supabase
            .from('test_results')
            .select('overall_result')
            .eq('session_id', s.id);

          let normalCount = 0, mildCount = 0, referCount = 0;
          (results || []).forEach((r) => {
            if (r.overall_result === 'normal') normalCount++;
            else if (r.overall_result === 'mild') mildCount++;
            else referCount++;
          });

          const teacher = s.teachers as { name: string } | null;
          const school = s.schools as { name: string } | null;

          return {
            id: s.id,
            sessionDate: new Date(s.session_date || s.created_at).toLocaleString(),
            teacherName: teacher?.name || '—',
            schoolName: school?.name || '—',
            deviceInfo: s.device_info || '—',
            studentCount: (results || []).length,
            normalCount,
            mildCount,
            referCount,
          };
        })
      );
      setData(enriched);
      setLoading(false);
    };
    load();
  }, [range.from, range.to]);

  const columns = [
    { key: 'id', label: 'Session ID', render: (r: SessionRow) => <span className="font-mono text-xs text-gray-500">{r.id.slice(0, 8)}…</span> },
    { key: 'teacherName', label: 'Teacher' },
    { key: 'schoolName', label: 'School' },
    { key: 'sessionDate', label: 'Date & Time' },
    { key: 'studentCount', label: 'Students' },
    { key: 'deviceInfo', label: 'Device', render: (r: SessionRow) => <span className="max-w-32 truncate block text-xs">{r.deviceInfo}</span> },
    {
      key: 'results', label: 'Results',
      render: (r: SessionRow) => (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-emerald-400">{r.normalCount}N</span>
          <span className="text-amber-400">{r.mildCount}M</span>
          <span className="text-red-400">{r.referCount}R</span>
        </div>
      ),
    },
  ];

  return (
    <AdminDataTable
      title="Test Sessions"
      description="Every screening session conducted"
      columns={columns}
      data={data}
      loading={loading}
      searchPlaceholder="Search by teacher or school..."
      searchField={(r) => `${r.teacherName} ${r.schoolName}`}
    />
  );
}
