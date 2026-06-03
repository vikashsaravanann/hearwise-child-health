import { useEffect, useState, useRef } from 'react';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';

interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
}

function AnimatedCounter({ end, suffix = '', prefix = '', label, duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) observer.unobserve(elementRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutQuad
      const easeProgress = progress * (2 - progress);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  return (
    <div ref={elementRef} className="flex flex-col items-center justify-center p-4 text-center">
      <div className="text-4xl md:text-5xl font-bold text-teal-400 mb-2 font-mono">
        {prefix}{count}{suffix}
      </div>
      <div className="text-sm md:text-base text-slate-400 font-medium">
        {label}
      </div>
    </div>
  );
}

export default function ImpactSection() {
  const { lang } = useSession();

  return (
    <section className="w-full bg-gradient-to-r from-slate-900 to-teal-950 border-y border-teal-500/20 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4 mb-12 divide-x-0 lg:divide-x divide-teal-500/20">
          <AnimatedCounter end={63} suffix="M+" label={t('stat63MDesc', lang)} />
          <AnimatedCounter prefix="1 in " end={8} label={t('statAffected', lang)} />
          <AnimatedCounter end={90} suffix="%" label={t('stat90PctDesc', lang)} />
          <AnimatedCounter end={50} label={t('statScreenedPerHr', lang)} />
          <AnimatedCounter end={2} label={t('statLanguages', lang)} />
          <AnimatedCounter end={0} label={t('statCost', lang)} />
        </div>

        <div className="max-w-4xl mx-auto">
          <blockquote className="border-l-4 border-teal-500 pl-6 py-2">
            <p className="text-lg md:text-xl italic text-slate-400 leading-relaxed mb-4">
              "{t('impactQuote', lang)}"
            </p>
            <footer className="text-teal-400 font-medium text-sm">
              {t('impactAttribution', lang)}
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
