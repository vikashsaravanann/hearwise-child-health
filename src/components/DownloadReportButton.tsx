import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateReport, ScreeningResult } from '@/utils/generateReport';
import { FileText, Loader2 } from 'lucide-react';

interface DownloadReportButtonProps {
  result: ScreeningResult;
}

export default function DownloadReportButton({ result }: DownloadReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = () => {
    setIsGenerating(true);
    // Add a small delay to show the loading state before synchronous PDF generation blocks the thread
    setTimeout(() => {
      try {
        generateReport(result);
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
      className="bg-teal-600 hover:bg-teal-500 text-white font-medium"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          📄 Download Report (PDF)
        </>
      )}
    </Button>
  );
}
