/**
 * Shared admin data table component with CSV/PDF export and filters.
 */
import { useState } from 'react';
import { Download, FileText, Search, DatabaseZap, RotateCcw } from 'lucide-react';

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
  error?: string;
  onRetry?: () => void;
}

function escapeCsv(val: unknown): string {
  if (val === null || val === undefined) return '';
  const s = String(val);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export default function AdminDataTable<T extends Record<string, unknown>>({
  title, description, columns, data, loading, searchPlaceholder, searchField, filters,
  error, onRetry,
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

  const handleExportPDF = () => {
    const reportWindow = window.open('', '_blank', 'noopener,noreferrer,width=1200,height=800');
    if (!reportWindow) return;

    const printableRows = filtered.map((row) => {
      const cells = columns.map((col) => {
        const rawValue = col.render ? row[col.key] : row[col.key];
        return `<td style="border:1px solid #d4d4d8;padding:8px;font-size:12px;">${escapeCsv(rawValue ?? '—')}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    const headerCells = columns
      .map((col) => `<th style="border:1px solid #d4d4d8;padding:8px;background:#f4f4f5;text-align:left;font-size:12px;">${col.label}</th>`)
      .join('');

    reportWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${title} Report</title>
        </head>
        <body style="font-family:Arial,sans-serif;padding:20px;color:#111827;">
          <h2 style="margin:0 0 6px;">${title}</h2>
          <p style="margin:0 0 16px;font-size:12px;color:#6b7280;">Generated on ${new Date().toLocaleString()}</p>
          <table style="width:100%;border-collapse:collapse;">
            <thead><tr>${headerCells}</tr></thead>
            <tbody>${printableRows}</tbody>
          </table>
        </body>
      </html>
    `);
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.print();
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={exporting || filtered.length === 0}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10 disabled:opacity-40"
          >
            {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            CSV
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10 disabled:opacity-40"
            title="Export table as printable PDF"
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
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-[#2F80ED]/40"
            />
          </div>
        )}
        {filters}
      </div>

      {/* Table */}
      {error && (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-[#EB5757]/30 bg-[#FDEDEC] px-3 py-2 text-[11px] text-[#922B21]">
          <span>Failed to load data. Retrying...</span>
          {onRetry && (
            <button type="button" onClick={onRetry} className="inline-flex items-center gap-1 rounded-md border border-[#EB5757]/30 px-2 py-1">
              <RotateCcw size={12} />
              Retry
            </button>
          )}
        </div>
      )}
      <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-white">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-9 animate-pulse rounded-md bg-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-44 flex-col items-center justify-center gap-2 text-slate-400">
            <DatabaseZap size={20} />
            <p className="text-sm text-slate-600">No {title.toLowerCase()} yet</p>
            <p className="text-xs">Data will appear here once testing begins</p>
          </div>
        ) : (
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-black/10 bg-[#F8FAFF]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="sticky top-0 bg-[#F3F7FF] px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.5px] text-slate-500"
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
                  className={`h-12 border-b border-black/[0.05] text-[12px] transition-colors duration-150 ease-in-out hover:bg-[#F8FAFF] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFC]'}`}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-[12px] text-slate-600"
                      style={{ animation: `fadeIn 150ms ease ${Math.min(i * 20 + colIdx * 10, 300)}ms both` }}
                    >
                      {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-2 text-xs text-gray-600">
        Showing {filtered.length} of {data.length} records
      </p>
    </div>
  );
}
