import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateHearWiseReport } from '@/utils/generateReport';
import { FileText, Loader2 } from 'lucide-react';
import type { EarResult, ReportData } from '@/utils/generateReport';

interface DownloadReportButtonProps {
  result: ReportData;
}

export default function DownloadReportButton({ result }: DownloadReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        generateHearWiseReport(result);
      } catch (error) {
        console.error("Failed to generate PDF:", error);
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  return (
    <Button 
      onClick={handleDownload} 
      disabled={isGenerating}
      className="h-16 px-6 rounded-2xl text-base font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-xl flex items-center justify-center gap-2 transition-all"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          📄 Download PDF Report
        </>
      )}
    </Button>
  );
}
