import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CounterStats {
  totalChildren: number;
  schoolsReached: number;
  teachersTrained: number;
  earlyDetections: number;
}

function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

export default function MissionBanner() {
  const [stats, setStats] = useState<CounterStats>({
    totalChildren: 0,
    schoolsReached: 0,
    teachersTrained: 0,
    earlyDetections: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const [childrenRes, schoolsRes, teachersRes, detectionsRes] = await Promise.all([
        supabase.from('test_results').select('id', { count: 'exact', head: true }),
        supabase.from('schools').select('id', { count: 'exact', head: true }),
        supabase.from('teachers').select('id', { count: 'exact', head: true }),
        supabase.from('test_results').select('id', { count: 'exact', head: true }).neq('overall_result', 'normal'),
      ]);

      setStats({
        totalChildren: childrenRes.count ?? 0,
        schoolsReached: schoolsRes.count ?? 0,
        teachersTrained: teachersRes.count ?? 0,
        earlyDetections: detectionsRes.count ?? 0,
      });
    };

    loadStats();
  }, []);

  const totalChildren = useCountUp(stats.totalChildren);
  const schoolsReached = useCountUp(stats.schoolsReached);
  const teachersTrained = useCountUp(stats.teachersTrained);
  const earlyDetections = useCountUp(stats.earlyDetections);

  const counters = [
    { label: 'Children Screened', value: totalChildren },
    { label: 'Schools Reached', value: schoolsReached },
    { label: 'Teachers Trained', value: teachersTrained },
    { label: 'Early Detections', value: earlyDetections },
  ];

  return (
    <section
      className="mb-5 flex flex-wrap items-center justify-between gap-6 rounded-xl border px-6 py-4"
      style={{
        background: 'rgba(47,128,237,0.06)',
        borderColor: 'rgba(47,128,237,0.15)',
      }}
    >
      <div>
        <p className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          HearWise — Smart Hearing Care for Every Child
        </p>
        <p className="mt-0.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Built by Vikash S. · Rathinam Technical Campus · Coimbatore
        </p>
      </div>

      <div className="flex items-center">
        {counters.map((counter, index) => (
          <div key={counter.label} className="flex items-center">
            <div className="px-4 text-center">
              <p className="text-[20px] font-semibold leading-none text-[#2F80ED]">
                {counter.value.toLocaleString()}
              </p>
              <p className="mt-1 text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {counter.label}
              </p>
            </div>
            {index < counters.length - 1 && (
              <div className="h-10 w-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
