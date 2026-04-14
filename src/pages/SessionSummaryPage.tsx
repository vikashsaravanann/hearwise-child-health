import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable, { type RowInput } from 'jspdf-autotable';

export default function SessionSummaryPage() {
  const navigate = useNavigate();
  const { lang, testedStudents, session, clearTestedStudents, pendingResultsCount } = useSession();

  const total = testedStudents.length;
  const normal = testedStudents.filter(s => s.results.overall === 'normal').length;
  const mild = testedStudents.filter(s => s.results.overall === 'mild').length;
  const refer = testedStudents.filter(s => s.results.overall === 'refer').length;

  const handleEndSession = () => {
    clearTestedStudents();
    navigate('/');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const reportDate = new Date().toLocaleDateString();
    const schoolName = session?.schoolName ?? '-';
    const teacherName = session?.teacherName ?? '-';

    doc.setFontSize(20);
    doc.setTextColor(22, 36, 58);
    doc.text('HearWise', 14, 18);

    doc.setFontSize(11);
    doc.setTextColor(70, 70, 70);
    doc.text(`School: ${schoolName}`, 14, 28);
    doc.text(`Teacher: ${teacherName}`, 14, 34);
    doc.text(`Date: ${reportDate}`, 14, 40);

    const tableRows: RowInput[] = testedStudents.map((entry) => {
      const resultLabel =
        entry.results.overall === 'normal'
          ? 'Normal'
          : entry.results.overall === 'mild'
            ? 'Mild Concern'
            : 'Refer to Doctor';

      return [
        entry.student?.name ?? t('unknownStudent', lang),
        resultLabel,
      ];
    });

    const tableResult = autoTable(doc, {
      startY: 48,
      head: [['Student Name', 'Result']],
      body: tableRows,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [40, 111, 255], textColor: 255 },
      didParseCell: (data) => {
        if (data.section !== 'body') return;
        const row = data.row.raw as string[];
        const resultText = row[1];
        if (resultText === 'Normal') {
          data.cell.styles.fillColor = [232, 245, 233];
        } else if (resultText === 'Mild Concern') {
          data.cell.styles.fillColor = [255, 249, 196];
        } else if (resultText === 'Refer to Doctor') {
          data.cell.styles.fillColor = [255, 235, 238];
        }
      },
    });

    const totalStartY = tableResult.finalY + 12;
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text(`Total Tested: ${total}`, 14, totalStartY);
    doc.text(`Normal: ${normal}`, 14, totalStartY + 7);
    doc.text(`Mild Concern: ${mild}`, 14, totalStartY + 14);
    doc.text(`Refer to Doctor: ${refer}`, 14, totalStartY + 21);

    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text('HearWise Technologies — Smart Hearing Care for Every Child', 14, 285);

    doc.save(`hearwise-session-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-8">
      <h2 className="text-xl font-bold text-foreground">{t('sessionSummary', lang)}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{session?.schoolName} • {t('grade', lang)} {session?.classGrade}</p>
      <p className="mt-2 text-sm font-medium text-muted-foreground">
        {pendingResultsCount > 0 ? `${pendingResultsCount} results pending sync` : 'All results saved'}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center p-4">
            <Users className="text-primary" size={28} />
            <span className="mt-2 text-2xl font-bold text-foreground">{total}</span>
            <span className="text-xs text-muted-foreground">{t('totalTested', lang)}</span>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-success/30 bg-success/5">
          <CardContent className="flex flex-col items-center p-4">
            <CheckCircle className="text-success" size={28} />
            <span className="mt-2 text-2xl font-bold text-foreground">{normal}</span>
            <span className="text-xs text-muted-foreground">{t('normalResults', lang)}</span>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-warning/30 bg-warning/5">
          <CardContent className="flex flex-col items-center p-4">
            <AlertTriangle className="text-warning" size={28} />
            <span className="mt-2 text-2xl font-bold text-foreground">{mild}</span>
            <span className="text-xs text-muted-foreground">{t('mildConcerns', lang)}</span>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-destructive/30 bg-destructive/5">
          <CardContent className="flex flex-col items-center p-4">
            <AlertOctagon className="text-destructive" size={28} />
            <span className="mt-2 text-2xl font-bold text-foreground">{refer}</span>
            <span className="text-xs text-muted-foreground">{t('needsReferral', lang)}</span>
          </CardContent>
        </Card>
      </div>

      {/* Student list */}
      <div className="mt-6 flex flex-col gap-2">
        {testedStudents.map((s, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
            <span className="text-sm font-medium">{s.student?.name ?? t('unknownStudent', lang)}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
              s.results.overall === 'normal' ? 'bg-success/10 text-success' :
              s.results.overall === 'mild' ? 'bg-warning/10 text-warning' :
              'bg-destructive/10 text-destructive'
            }`}>
              {s.results.overall.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Button variant="outline" className="h-14 rounded-2xl text-base" onClick={() => navigate('/student-entry')}>
          {t('saveTestNext', lang)}
        </Button>
        <Button variant="outline" className="h-14 rounded-2xl text-base" onClick={handleDownloadPDF}>
          Download PDF Report
        </Button>
        <Button className="h-14 rounded-2xl text-base font-semibold" onClick={handleEndSession}>
          {t('endSession', lang)}
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        © 2025 HearWise Technologies. {t('footerTagline', lang)}
      </p>
    </div>
  );
}
