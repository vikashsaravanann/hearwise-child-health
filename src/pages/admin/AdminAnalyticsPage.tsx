import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAdminTimeFilter } from '@/contexts/AdminTimeFilterContext';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const DISTRICT_POINTS = [
  { name: 'Chennai', x: 82, y: 18 },
  { name: 'Kanchipuram', x: 74, y: 28 },
  { name: 'Vellore', x: 66, y: 20 },
  { name: 'Salem', x: 60, y: 36 },
  { name: 'Erode', x: 50, y: 42 },
  { name: 'Coimbatore', x: 40, y: 50 },
  { name: 'Tiruppur', x: 46, y: 48 },
  { name: 'Tiruchirappalli', x: 57, y: 56 },
  { name: 'Thanjavur', x: 64, y: 62 },
  { name: 'Madurai', x: 56, y: 70 },
  { name: 'Dindigul', x: 50, y: 64 },
  { name: 'Tirunelveli', x: 58, y: 88 },
];

type Row = {
  district: string;
  left500: boolean;
  left1000: boolean;
  left2000: boolean;
  left4000: boolean;
  right500: boolean;
  right1000: boolean;
  right2000: boolean;
  right4000: boolean;
  overall: string;
};

export default function AdminAnalyticsPage() {
  const { range } = useAdminTimeFilter();
  const [rows, setRows] = useState<Row[]>([]);
  const [hoverDistrict, setHoverDistrict] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('test_results')
        .select(`
          overall_result,
          left_500hz, left_1000hz, left_2000hz, left_4000hz,
          right_500hz, right_1000hz, right_2000hz, right_4000hz,
          students ( schools ( district ) )
        `)
        .gte('created_at', range.from.toISOString())
        .lte('created_at', range.to.toISOString());

      const mapped = (data ?? []).map((r) => ({
        district: ((r.students as { schools?: { district?: string } } | null)?.schools?.district) ?? 'Unknown',
        left500: r.left_500hz,
        left1000: r.left_1000hz,
        left2000: r.left_2000hz,
        left4000: r.left_4000hz,
        right500: r.right_500hz,
        right1000: r.right_1000hz,
        right2000: r.right_2000hz,
        right4000: r.right_4000hz,
        overall: r.overall_result,
      }));
      setRows(mapped);
    };
    load();
  }, [range.from, range.to]);

  const frequencyData = useMemo(() => {
    const counts = {
      '500Hz': { frequency: '500Hz', left: 0, right: 0 },
      '1000Hz': { frequency: '1000Hz', left: 0, right: 0 },
      '2000Hz': { frequency: '2000Hz', left: 0, right: 0 },
      '4000Hz': { frequency: '4000Hz', left: 0, right: 0 },
    };
    rows.forEach((r) => {
      if (!r.left500) counts['500Hz'].left += 1;
      if (!r.right500) counts['500Hz'].right += 1;
      if (!r.left1000) counts['1000Hz'].left += 1;
      if (!r.right1000) counts['1000Hz'].right += 1;
      if (!r.left2000) counts['2000Hz'].left += 1;
      if (!r.right2000) counts['2000Hz'].right += 1;
      if (!r.left4000) counts['4000Hz'].left += 1;
      if (!r.right4000) counts['4000Hz'].right += 1;
    });
    return Object.values(counts);
  }, [rows]);

  const districtMap = useMemo(() => {
    const map = new Map<string, { total: number; refer: number }>();
    rows.forEach((r) => {
      const curr = map.get(r.district) ?? { total: 0, refer: 0 };
      curr.total += 1;
      if (r.overall === 'refer') curr.refer += 1;
      map.set(r.district, curr);
    });
    return map;
  }, [rows]);

  const districtFrequency = useMemo(() => {
    const agg = new Map<string, { district: string; failures: number }>();
    rows.forEach((r) => {
      const failures = [r.left500, r.left1000, r.left2000, r.left4000, r.right500, r.right1000, r.right2000, r.right4000].filter((x) => !x).length;
      const current = agg.get(r.district) ?? { district: r.district, failures: 0 };
      current.failures += failures;
      agg.set(r.district, current);
    });
    return Array.from(agg.values()).sort((a, b) => b.failures - a.failures).slice(0, 5);
  }, [rows]);

  return (
    <div className="space-y-4 text-[var(--hw-text)]">
      <div className="rounded-xl border border-black/10 bg-[var(--hw-surface)] p-4">
        <h3 className="text-sm font-semibold">Tamil Nadu District Map</h3>
        <div className="relative mt-3 h-[320px] w-full overflow-hidden rounded-lg bg-slate-50">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            {DISTRICT_POINTS.map((d) => {
              const stats = districtMap.get(d.name) ?? { total: 0, refer: 0 };
              const rate = stats.total ? stats.refer / stats.total : 0;
              const fill = rate > 0.3 ? '#EB5757' : rate > 0.15 ? '#E2A800' : '#27AE60';
              const radius = Math.max(2.8, Math.min(8, 2 + stats.total / 12));
              return (
                <g key={d.name} onMouseEnter={() => setHoverDistrict(d.name)} onMouseLeave={() => setHoverDistrict(null)}>
                  <circle cx={d.x} cy={d.y} r={radius} fill={fill} opacity={0.82} />
                  <text x={d.x + 1.6} y={d.y - 1.8} fontSize="2.2" fill="#0F172A">{d.name}</text>
                </g>
              );
            })}
          </svg>
          {hoverDistrict && (
            <div className="absolute right-3 top-3 rounded-lg border border-black/10 bg-white p-2 text-xs">
              <p className="font-semibold">{hoverDistrict}</p>
              <p>Students: {(districtMap.get(hoverDistrict)?.total ?? 0).toLocaleString()}</p>
              <p>Refer cases: {(districtMap.get(hoverDistrict)?.refer ?? 0).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-black/10 bg-[var(--hw-surface)] p-4">
        <h3 className="text-sm font-semibold">Frequency Failure Breakdown</h3>
        <div className="mt-3 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={frequencyData}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="frequency" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="left" fill="#2F80ED" name="Left Ear" />
              <Bar dataKey="right" fill="#27AE60" name="Right Ear" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-black/10 bg-[var(--hw-surface)] p-4">
        <h3 className="text-sm font-semibold">Top 5 Districts by Frequency Failures</h3>
        <div className="mt-3 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={districtFrequency}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="district" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="failures" fill="#2F80ED" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
