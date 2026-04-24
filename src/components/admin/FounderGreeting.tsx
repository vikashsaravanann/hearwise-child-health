import { useMemo } from 'react';

function getGreetingByHour(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Working late, Vikash?';
}

export default function FounderGreeting() {
  const timeGreeting = useMemo(() => getGreetingByHour(new Date().getHours()), []);

  return (
    <section
      className="mb-5 flex items-start justify-between gap-6 rounded-[14px] border px-7 py-6"
      style={{
        background: '#0F172A',
        borderColor: 'rgba(47,128,237,0.2)',
      }}
    >
      <div className="min-w-0 flex-1">
        <p
          className="text-[10px] uppercase"
          style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '1.5px' }}
        >
          WELCOME BACK, FOUNDER
        </p>
        <h2 className="mt-1 text-[28px] font-semibold text-white">
          Hi, <span style={{ color: '#2F80ED' }}>Vikash</span> 👋
        </h2>
        <p className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Founder &amp; Developer · HearWise Technologies · Coimbatore
        </p>

        <div
          className="mt-4 border-l-2 pl-[14px] text-xs leading-[1.7]"
          style={{ borderColor: '#2F80ED', color: 'rgba(255,255,255,0.55)' }}
        >
          I architected and developed HearWise to bridge the critical gap between
          advanced digital health solutions and resource-constrained school systems.
          My focus is building scalable, offline-first applications that deliver
          reliable clinical screening workflows regardless of network connectivity
          — making hearing care accessible to every child in Tamil Nadu.
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end">
        <div
          className="flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 text-[20px] font-semibold text-white"
          style={{
            background: '#2F80ED',
            borderColor: 'rgba(255,255,255,0.15)',
          }}
        >
          VS
        </div>
        <span
          className="mt-[10px] rounded-[20px] border px-3 py-[3px] text-[10px]"
          style={{
            background: 'rgba(47,128,237,0.2)',
            borderColor: 'rgba(47,128,237,0.4)',
            color: '#60A5FA',
          }}
        >
          Founder
        </span>
        <span
          className="mt-[6px] rounded-[20px] border px-3 py-[3px] text-[10px]"
          style={{
            background: 'rgba(39,174,96,0.15)',
            borderColor: 'rgba(39,174,96,0.3)',
            color: '#4ADE80',
          }}
        >
          Super Admin
        </span>
        <p className="mt-2 text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {timeGreeting}
        </p>
      </div>
    </section>
  );
}
