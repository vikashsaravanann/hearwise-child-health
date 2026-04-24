import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const EXPORT_CARDS = [
  { key: 'students', title: 'All Students Data', description: 'Export complete student screening records.' },
  { key: 'schools', title: 'Schools Report', description: 'Export school registry and performance stats.' },
  { key: 'teachers', title: 'Teachers Report', description: 'Export teachers and session counts.' },
  { key: 'referrals', title: 'Referrals Report', description: 'Export referral follow-up status report.' },
  { key: 'analytics', title: 'Full Analytics Report', description: 'Export trend and distribution summaries.' },
];

export default function AdminExportPage() {
  const [formatByCard, setFormatByCard] = useState<Record<string, 'csv' | 'pdf'>>({
    students: 'csv',
    schools: 'csv',
    teachers: 'csv',
    referrals: 'pdf',
    analytics: 'pdf',
  });

  const exportCard = (key: string) => {
    const format = formatByCard[key];
    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.text('HearWise', 14, 14);
      doc.text('Confidential — Admin Export', 140, 14);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
      autoTable(doc, {
        startY: 28,
        head: [['Section', 'Format']],
        body: [[key, 'PDF']],
      });
      doc.text('Smart Hearing Care for Every Child', 14, 285);
      doc.save(`hearwise-${key}.pdf`);
      return;
    }
    const csv = `section,format\n${key},CSV`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hearwise-${key}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {EXPORT_CARDS.map((card) => (
        <div key={card.key} className="rounded-xl border border-black/10 bg-white p-4">
          <p className="text-[14px] font-medium">{card.title}</p>
          <p className="mt-1 text-[11px] text-slate-500">{card.description}</p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFormatByCard((prev) => ({ ...prev, [card.key]: 'csv' }))}
              className={`rounded-full px-3 py-1 text-[11px] ${formatByCard[card.key] === 'csv' ? 'bg-[#2F80ED] text-white' : 'border border-slate-200 text-slate-500'}`}
            >
              CSV
            </button>
            <button
              type="button"
              onClick={() => setFormatByCard((prev) => ({ ...prev, [card.key]: 'pdf' }))}
              className={`rounded-full px-3 py-1 text-[11px] ${formatByCard[card.key] === 'pdf' ? 'bg-[#2F80ED] text-white' : 'border border-slate-200 text-slate-500'}`}
            >
              PDF
            </button>
            <button type="button" onClick={() => exportCard(card.key)} className="ml-auto rounded-md border border-slate-200 px-3 py-1.5 text-[11px]">
              Export
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
