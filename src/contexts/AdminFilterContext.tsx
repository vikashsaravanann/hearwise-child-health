import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type AdminRangePreset = 'today' | 'week' | 'month' | 'year' | 'custom';

interface AdminRange {
  from: string;
  to: string;
}

interface AdminFilterContextValue {
  preset: AdminRangePreset;
  range: AdminRange;
  setPreset: (preset: AdminRangePreset) => void;
  setCustomRange: (from: string, to: string) => void;
}

const AdminFilterContext = createContext<AdminFilterContextValue | null>(null);

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildRange(preset: AdminRangePreset): AdminRange {
  const now = new Date();
  const to = toDateOnly(now);
  const from = new Date(now);

  if (preset === 'today') return { from: to, to };
  if (preset === 'week') from.setDate(from.getDate() - 6);
  if (preset === 'month') from.setDate(from.getDate() - 29);
  if (preset === 'year') from.setFullYear(from.getFullYear() - 1);

  return { from: toDateOnly(from), to };
}

export function AdminFilterProvider({ children }: { children: ReactNode }) {
  const [preset, setPresetState] = useState<AdminRangePreset>('today');
  const [range, setRange] = useState<AdminRange>(buildRange('today'));

  const setPreset = (next: AdminRangePreset) => {
    setPresetState(next);
    if (next !== 'custom') setRange(buildRange(next));
  };

  const setCustomRange = (from: string, to: string) => {
    setPresetState('custom');
    setRange({ from, to });
  };

  const value = useMemo(
    () => ({ preset, range, setPreset, setCustomRange }),
    [preset, range],
  );

  return <AdminFilterContext.Provider value={value}>{children}</AdminFilterContext.Provider>;
}

export function useAdminFilter() {
  const context = useContext(AdminFilterContext);
  if (!context) throw new Error('useAdminFilter must be used within AdminFilterProvider');
  return context;
}
