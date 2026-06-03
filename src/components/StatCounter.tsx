import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface StatCounterProps {
  value: number;
  label: string;
  icon: string;
  suffix?: string;
}

export default function StatCounter({ value, label, icon, suffix = '' }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 2000; // 2 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function: easeOutQuart
      const easeOut = 1 - Math.pow(1 - percentage, 4);
      
      setCount(Math.floor(easeOut * value));

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg hover:border-teal-500/30 hover:shadow-teal-900/20 transition-all text-center">
      <div className="text-4xl mb-4 opacity-90">{icon}</div>
      <div className="flex items-baseline justify-center text-5xl md:text-[3.5rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300 mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-slate-400 text-sm md:text-base font-medium">
        {label}
      </div>
    </div>
  );
}
