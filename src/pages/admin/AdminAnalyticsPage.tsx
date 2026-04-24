import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminFilter } from '@/contexts/AdminFilterContext';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

export default function AdminAnalyticsPage() {
  const { range } = useAdminFilter();
  const [daily, setDaily] = useState<Array<{ day: string; count: number }>>([]);
  const [distribution, setDistribution] = useState<Array<{ name: string; value: number }>>([]);
  const [schools, setSchools] = useState<Array<{ school: string; tests: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('test_results')
        .select('created_at, overall_result, test_sessions(schools(name))')
        .gte('created_at', range.from)
        .lte('created_at', `${range.to}T23:59:59`)
        .order('created_at', { ascending: true });

      const byDay = new Map<string, number>();
      const resultMap = { normal: 0, mild: 0, refer: 0 };
      const schoolMap = new Map<string, number>();

      (data ?? []).forEach((row) => {
        const day = row.created_at.slice(0, 10);
        byDay.set(day, (byDay.get(day) ?? 0) + 1);
        const key = (row.overall_result as 'normal' | 'mild' | 'refer') ?? 'refer';
        resultMap[key] = (resultMap[key] ?? 0) + 1;
        const schoolName = ((row.test_sessions as { schools?: { name?: string } } | null)?.schools?.name) ?? 'Unknown';
        schoolMap.set(schoolName, (schoolMap.get(schoolName) ?? 0) + 1);
      });

      setDaily(Array.from(byDay.entries()).map(([day, count]) => ({ day, count })));
      setDistribution([
        { name: 'Normal', value: resultMap.normal },
        { name: 'Mild', value: resultMap.mild },
        { name: 'Refer', value: resultMap.refer },
      ]);
      setSchools(
        Array.from(schoolMap.entries())
          .map(([school, tests]) => ({ school, tests }))
          .sort((a, b) => b.tests - a.tests)
          .slice(0, 10),
      );
      setLoading(false);
    };
    load();
  }, [range.from, range.to]);

  if (loading) return <div className="h-64 animate-pulse rounded-xl bg-slate-100" />;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-black/10 bg-white p-4">
        <p className="mb-3 text-[14px] font-medium">Students tested per day</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daily}>
              <CartesianGrid stroke="#E2E8F0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2F80ED" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-black/10 bg-white p-4">
        <p className="mb-3 text-[14px] font-medium">Result distribution</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={distribution} dataKey="value" nameKey="name" outerRadius={96}>
                <Cell fill="#27AE60" />
                <Cell fill="#E2A800" />
                <Cell fill="#EB5757" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-black/10 bg-white p-4 lg:col-span-2">
        <p className="mb-3 text-[14px] font-medium">Tests by school (top 10)</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={schools}>
              <CartesianGrid stroke="#E2E8F0" />
              <XAxis dataKey="school" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tests" fill="#2F80ED" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
