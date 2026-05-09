import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { endOfDay, startOfDay, subDays } from 'date-fns';

type FilterPreset = 'today' | 'week' | 'month' | 'year' | 'custom';

export interface TimeRange {
  from: Date;
  to: Date;
}

interface AdminTimeFilterValue {
  preset: FilterPreset;
  range: TimeRange;
  setPreset: (preset: FilterPreset) => void;
  setCustom: (from: Date, to: Date) => void;
}

const AdminTimeFilterContext = createContext<AdminTimeFilterValue | null>(null);

function buildRange(preset: FilterPreset): TimeRange {
  const now = new Date();
  if (preset === 'today') {
    return { from: startOfDay(now), to: endOfDay(now) };
  }
  if (preset === 'week') {
    return { from: startOfDay(subDays(now, 6)), to: endOfDay(now) };
  }
  if (preset === 'month') {
    return { from: startOfDay(subDays(now, 29)), to: endOfDay(now) };
  }
  return { from: startOfDay(subDays(now, 364)), to: endOfDay(now) };
}

export function AdminTimeFilterProvider({ children }: { children: ReactNode }) {
  const [preset, setPresetState] = useState<FilterPreset>('today');
  const [range, setRange] = useState<TimeRange>(buildRange('today'));

  const setPreset = (next: FilterPreset) => {
    setPresetState(next);
    if (next !== 'custom') {
      setRange(buildRange(next));
    }
  };

  const setCustom = (from: Date, to: Date) => {
    setPresetState('custom');
    setRange({ from, to });
  };

  const value = useMemo(() => ({ preset, range, setPreset, setCustom }), [preset, range]);

  return <AdminTimeFilterContext.Provider value={value}>{children}</AdminTimeFilterContext.Provider>;
}

export function useAdminTimeFilter() {
  const ctx = useContext(AdminTimeFilterContext);
  if (!ctx) throw new Error('useAdminTimeFilter must be used within AdminTimeFilterProvider');
  return ctx;
}
