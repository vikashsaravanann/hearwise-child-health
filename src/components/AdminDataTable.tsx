/**
 * Shared admin data table component with CSV/PDF export and filters.
 */
import { useState } from 'react';
import { Download, FileText, Loader2, Search } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface AdminDataTableProps<T> {
  title: string;
  description?: string;
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  searchPlaceholder?: string;
  searchField?: (row: T) => string;
  filters?: React.ReactNode;
}

function escapeCsv(val: unknown): string {
  if (val === null || val === undefined) return '';
  const s = String(val);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export default function AdminDataTable<T extends Record<string, unknown>>({
  title, description, columns, data, loading, searchPlaceholder, searchField, filters,
}: AdminDataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);

  const filtered = search && searchField
    ? data.filter((row) => searchField(row).toLowerCase().includes(search.toLowerCase()))
    : data;

  const handleExportCSV = () => {
    setExporting(true);
    try {
      const header = columns.map((c) => escapeCsv(c.label)).join(',');
      const rows = filtered.map((row) =>
        columns.map((col) => {
          const cell = col.render ? '' : (row[col.key] ?? '');
          return escapeCsv(cell);
        }).join(',')
      );
      const csv = [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hearwise-${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--hw-text)]">{title}</h2>
          {description && <p className="mt-1 text-sm text-[var(--hw-text-2)]">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={exporting || filtered.length === 0}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-[var(--hw-surface)] px-4 py-2 text-xs font-medium text-[var(--hw-text-2)] transition-colors hover:bg-slate-50 disabled:opacity-40"
          >
            {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            CSV
          </button>
          <button
            disabled
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-[var(--hw-surface)] px-4 py-2 text-xs font-medium text-[var(--hw-text-2)] opacity-40"
            title="PDF export coming soon"
          >
            <FileText size={14} />
            PDF
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        {searchField && (
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder={searchPlaceholder || 'Search...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-[var(--hw-surface)] pl-9 pr-4 text-sm text-[var(--hw-text)] placeholder-gray-400 outline-none focus:border-[#2F80ED]/40"
            />
          </div>
        )}
        {filters}
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-[var(--hw-surface)]">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#2F80ED]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-gray-500">
            No data found
          </div>
        ) : (
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5">
                {columns.map((col) => (
                  <th
                    key={col.key}
                  className="sticky top-0 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--hw-text-2)]"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${i % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/40'}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-[var(--hw-text-2)]">
                      {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-2 text-xs text-[var(--hw-text-2)]">
        Showing {filtered.length} of {data.length} records
      </p>
    </div>
  );
}
