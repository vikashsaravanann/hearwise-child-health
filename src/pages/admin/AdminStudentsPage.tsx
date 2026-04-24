import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminDataTable from '@/components/AdminDataTable';
import { useAdminFilter } from '@/contexts/AdminFilterContext';

interface StudentRow {
  id: string;
  studentName: string;
  age: number;
  gender: string;
  rollNumber: string;
  schoolName: string;
  teacherName: string;
  testDate: string;
  leftResult: string;
  rightResult: string;
  overallResult: string;
  failedFreqs: string;
  deviceUsed: string;
  [key: string]: unknown;
}

function earResult(l500: boolean, l1000: boolean, l2000: boolean, l4000: boolean): string {
  const passed = [l500, l1000, l2000, l4000].filter(Boolean).length;
  if (passed === 4) return 'Normal';
  if (passed >= 2) return 'Mild';
  return 'Refer';
}

function getFailedFreqs(r: Record<string, boolean>): string {
  const freqs: string[] = [];
  if (!r.left_ear_500hz) freqs.push('L-500Hz');
  if (!r.left_ear_1000hz) freqs.push('L-1000Hz');
  if (!r.left_ear_2000hz) freqs.push('L-2000Hz');
  if (!r.left_ear_4000hz) freqs.push('L-4000Hz');
  if (!r.right_ear_500hz) freqs.push('R-500Hz');
  if (!r.right_ear_1000hz) freqs.push('R-1000Hz');
  if (!r.right_ear_2000hz) freqs.push('R-2000Hz');
  if (!r.right_ear_4000hz) freqs.push('R-4000Hz');
  return freqs.length > 0 ? freqs.join(', ') : 'None';
}

export default function AdminStudentsPage() {
  const { range } = useAdminFilter();
  const [data, setData] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');
  const [schools, setSchools] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: results } = await supabase
        .from('test_results')
        .select(`
          *,
          students ( name, age, gender, roll_number, schools ( name ) ),
          test_sessions ( session_date, device_info, teachers ( name ), schools ( name ) )
        `)
        .gte('created_at', range.from)
        .lte('created_at', `${range.to}T23:59:59`)
        .order('created_at', { ascending: false });

      if (!results) { setLoading(false); return; }

      const schoolSet = new Set<string>();
      const rows: StudentRow[] = results.map((r) => {
        const student = r.students as { name: string; age: number; gender: string; roll_number: string | null; schools: { name: string } | null } | null;
        const session = r.test_sessions as { session_date: string; device_info: string | null; teachers: { name: string } | null; schools: { name: string } | null } | null;
        const schoolName = session?.schools?.name || student?.schools?.name || '—';
        schoolSet.add(schoolName);

        const leftRes = earResult(r.left_ear_500hz, r.left_ear_1000hz, r.left_ear_2000hz, r.left_ear_4000hz);
        const rightRes = earResult(r.right_ear_500hz, r.right_ear_1000hz, r.right_ear_2000hz, r.right_ear_4000hz);

        return {
          id: r.id,
          studentName: student?.name || '—',
          age: student?.age || 0,
          gender: student?.gender || '—',
          rollNumber: student?.roll_number || '—',
          schoolName,
          teacherName: session?.teachers?.name || '—',
          testDate: r.created_at ? new Date(r.created_at).toLocaleDateString() : '—',
          leftResult: leftRes,
          rightResult: rightRes,
          overallResult: r.overall_result || '—',
          failedFreqs: getFailedFreqs(r as unknown as Record<string, boolean>),
          deviceUsed: session?.device_info || '—',
        };
      });

      setSchools(Array.from(schoolSet).sort());
      setData(rows);
      setLoading(false);
    };
    load();

    // Real-time
    const channel = supabase
      .channel('students-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'test_results' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [range.from, range.to]);

  const filtered = data.filter((r) => {
    if (schoolFilter !== 'all' && r.schoolName !== schoolFilter) return false;
    if (resultFilter !== 'all' && r.overallResult !== resultFilter) return false;
    return true;
  });

  const resultBadge = (result: string) => {
    const cls =
      result === 'normal' ? 'bg-emerald-500/15 text-emerald-400' :
      result === 'mild' ? 'bg-amber-500/15 text-amber-400' :
      'bg-red-500/15 text-red-400';
    return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${cls}`}>{result}</span>;
  };

  const columns = [
    { key: 'studentName', label: 'Student Name' },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    { key: 'rollNumber', label: 'Roll No.' },
    { key: 'schoolName', label: 'School' },
    { key: 'teacherName', label: 'Teacher' },
    { key: 'testDate', label: 'Test Date' },
    { key: 'leftResult', label: 'Left Ear', render: (r: StudentRow) => resultBadge(r.leftResult.toLowerCase()) },
    { key: 'rightResult', label: 'Right Ear', render: (r: StudentRow) => resultBadge(r.rightResult.toLowerCase()) },
    { key: 'overallResult', label: 'Overall', render: (r: StudentRow) => resultBadge(r.overallResult) },
    { key: 'failedFreqs', label: 'Failed Frequencies' },
  ];

  return (
    <AdminDataTable
      title="Students"
      description="All student test records with detailed results"
      columns={columns}
      data={filtered}
      loading={loading}
      searchPlaceholder="Search by student name..."
      searchField={(r) => r.studentName}
      filters={
        <div className="flex items-center gap-2">
          <select
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
            className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-gray-300 outline-none"
          >
            <option value="all">All Schools</option>
            {schools.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-gray-300 outline-none"
          >
            <option value="all">All Results</option>
            <option value="normal">Normal</option>
            <option value="mild">Mild</option>
            <option value="refer">Refer</option>
          </select>
        </div>
      }
    />
  );
}
