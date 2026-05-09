import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminDataTable from '@/components/AdminDataTable';
import { Check, X } from 'lucide-react';
import { useAdminTimeFilter } from '@/contexts/AdminTimeFilterContext';

interface ReferralRow {
  id: string;
  studentName: string;
  age: number;
  schoolName: string;
  testDate: string;
  earsAffected: string;
  doctorVisited: boolean;
  followUpDate: string | null;
  notes: string | null;
  [key: string]: unknown;
}

export default function AdminReferralsPage() {
  const { range } = useAdminTimeFilter();
  const [data, setData] = useState<ReferralRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data: referrals } = await supabase
      .from('referrals')
      .select(`
        *,
        students ( name, age, schools ( name ) ),
        test_results (
          left_ear_500hz, left_ear_1000hz, left_ear_2000hz, left_ear_4000hz,
          right_ear_500hz, right_ear_1000hz, right_ear_2000hz, right_ear_4000hz
        )
      `)
      .gte('created_at', range.from.toISOString())
      .lte('created_at', range.to.toISOString())
      .order('created_at', { ascending: false });

    if (!referrals) { setLoading(false); return; }

    const rows: ReferralRow[] = referrals.map((r) => {
      const student = r.students as { name: string; age: number; schools: { name: string } | null } | null;
      const result = r.test_results as Record<string, boolean> | null;

      let leftFailed = false, rightFailed = false;
      if (result) {
        leftFailed = !result.left_ear_500hz || !result.left_ear_1000hz || !result.left_ear_2000hz || !result.left_ear_4000hz;
        rightFailed = !result.right_ear_500hz || !result.right_ear_1000hz || !result.right_ear_2000hz || !result.right_ear_4000hz;
      }

      const ears = leftFailed && rightFailed ? 'Both' : leftFailed ? 'Left' : rightFailed ? 'Right' : '—';

      return {
        id: r.id,
        studentName: student?.name || '—',
        age: student?.age || 0,
        schoolName: student?.schools?.name || '—',
        testDate: r.referred_on ? new Date(r.referred_on).toLocaleDateString() : '—',
        earsAffected: ears,
        doctorVisited: r.doctor_visited,
        followUpDate: r.follow_up_date,
        notes: r.notes,
      };
    });

    setData(rows);
    setLoading(false);
  };

  useEffect(() => { load(); }, [range.from, range.to]);

  const toggleDoctor = async (id: string, current: boolean) => {
    await supabase.from('referrals').update({ doctor_visited: !current }).eq('id', id);
    setData((prev) =>
      prev.map((r) => r.id === id ? { ...r, doctorVisited: !current } : r)
    );
  };

  const columns = [
    { key: 'studentName', label: 'Student' },
    { key: 'age', label: 'Age' },
    { key: 'schoolName', label: 'School' },
    { key: 'testDate', label: 'Test Date' },
    { key: 'earsAffected', label: 'Ears Affected' },
    {
      key: 'doctorVisited', label: 'Doctor Visited',
      render: (r: ReferralRow) => (
        <button
          onClick={() => toggleDoctor(r.id, r.doctorVisited)}
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            r.doctorVisited
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-red-500/15 text-red-400'
          }`}
        >
          {r.doctorVisited ? <Check size={12} /> : <X size={12} />}
          {r.doctorVisited ? 'Yes' : 'No'}
        </button>
      ),
    },
    { key: 'followUpDate', label: 'Follow Up', render: (r: ReferralRow) => r.followUpDate ? new Date(r.followUpDate).toLocaleDateString() : '—' },
    { key: 'notes', label: 'Notes', render: (r: ReferralRow) => r.notes || '—' },
  ];

  return (
    <AdminDataTable
      title="Referral Tracking"
      description="All students flagged for doctor referral"
      columns={columns}
      data={data}
      loading={loading}
      searchPlaceholder="Search by student name..."
      searchField={(r) => r.studentName}
    />
  );
}
