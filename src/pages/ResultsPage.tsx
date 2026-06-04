import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { t } from '@/lib/i18n';
import { getParentSummary } from '@/lib/clinicalSafety';
import type { TestResult } from '@/lib/testEngine';
import LanguageToggle from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Share2, ArrowRight, UserRoundPlus, Home, ShieldCheck, Hospital } from 'lucide-react';
import DownloadReportButton from '@/components/DownloadReportButton';
import type { ReportData } from '@/utils/generateReport';
const freqs = ['500', '1000', '2000', '4000'] as const;



export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, student, session } = useSession();
  const { user } = useAuth();
  const state = location.state as { results?: TestResult } | null;
  const results = state?.results;



  if (!results || !student) {
    navigate('/');
    return null;
  }

  const titleMessage = results.overall === 'normal' 
    ? (lang === 'ta' ? 'அருமை! கேள்வித்திறன் சாதாரணம்' : 'EXCELLENT HEARING!') 
    : results.overall === 'mild' 
    ? (lang === 'ta' ? 'சிறிய கவலை கண்டறியப்பட்டது' : 'MILD CONCERN') 
    : (lang === 'ta' ? 'மருத்துவ பரிந்துரை தேவை' : 'CLINICAL REFERRAL RECOMMENDED');

  const descMessage = results.overall === 'normal' 
    ? t('excellent', lang) 
    : results.overall === 'mild' 
    ? t('mildConcern', lang) 
    : t('hearingIssue', lang);

  const parentSummary = getParentSummary(results, lang);

  const shareWhatsApp = () => {
    const isEarNormal = (ear: TestResult['left']) => ear['500'] && ear['1000'] && ear['2000'] && ear['4000'];
    const leftResult = isEarNormal(results.left) ? t('normal', lang) : t('mildConcernLabel', lang);
    const rightResult = isEarNormal(results.right) ? t('normal', lang) : t('mildConcernLabel', lang);
    const overallLabel = results.overall === 'normal' ? t('normal', lang) : results.overall === 'mild' ? t('mildConcernLabel', lang) : t('referToDoctor', lang);
    const studentName = student?.name || t('unknownStudent', lang) || 'Unknown Student';
    const studentAge = student?.age || 'N/A';
    const text = `${t('hearingReportTitle', lang)}\n${t('student', lang)}: ${studentName}\n${t('age', lang)}: ${studentAge}\n${t('school', lang)}: ${session?.schoolName ?? '-'}\n${t('date', lang)}: ${new Date().toLocaleDateString()}\n${t('leftEar', lang)}: ${leftResult}\n${t('rightEar', lang)}: ${rightResult}\n${t('overallResult', lang)}: ${overallLabel}\n\n${t('poweredByHearWise', lang)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const screeningResultData: ReportData = {
    childName: student?.name || t('unknownStudent', lang) || 'Unknown Student',
    age: student?.age?.toString() || 'N/A',
    schoolName: session?.schoolName || 'N/A',
    className: 'N/A',
    testDate: new Date().toLocaleDateString('en-IN'),
    overallResult: results.overall === 'normal' ? 'pass' : 'refer',
    conductedBy: user?.email || session?.teacherName || 'HearWise Screener',
    rightEarResults: freqs.map(f => ({
      level: 40,
      frequency: `${f} Hz`,
      result: results.right[f] ? 'pass' : 'refer'
    })),
    leftEarResults: freqs.map(f => ({
      level: 40,
      frequency: `${f} Hz`,
      result: results.left[f] ? 'pass' : 'refer'
    }))
  };

  return (
    <div className="page-shell relative min-h-screen flex flex-col justify-between overflow-x-hidden pb-12 bg-gray-50">
      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-6 flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center shadow-md">
            <span className="text-xl text-white font-black">HW</span>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">HearWise Technologies</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
        </div>
      </header>

      {/* Main Clinical Receipt Panel */}
      <main className="relative z-10 w-full max-w-3xl mx-auto px-4 flex flex-col items-center mb-8">
        
        <div className="w-full bg-white border-2 border-black p-8 sm:p-10 shadow-2xl relative">
          {/* Header */}
          <div className="text-center border-b-2 border-black pb-6 mb-6">
            <h1 className="text-3xl sm:text-4xl font-black text-black tracking-widest uppercase mb-2">
              HEARWISE TECHNOLOGIES
            </h1>
            <p className="text-sm font-bold text-gray-700 uppercase tracking-widest">
              Digital Pure Tone Audiometry - Screening Report
            </p>
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-8">
            <div className="flex border-b border-gray-300 pb-1">
              <span className="w-32 font-bold text-gray-600 uppercase text-xs tracking-wider self-end">Teacher Name:</span>
              <span className="flex-1 font-black text-black text-base">{session?.teacherName || 'N/A'}</span>
            </div>
            <div className="flex border-b border-gray-300 pb-1">
              <span className="w-32 font-bold text-gray-600 uppercase text-xs tracking-wider self-end">Student Name:</span>
              <span className="flex-1 font-black text-black text-base">{student?.name || 'N/A'}</span>
            </div>
            <div className="flex border-b border-gray-300 pb-1">
              <span className="w-32 font-bold text-gray-600 uppercase text-xs tracking-wider self-end">Age:</span>
              <span className="flex-1 font-black text-black text-base">{student?.age || 'N/A'}</span>
            </div>
            <div className="flex border-b border-gray-300 pb-1">
              <span className="w-32 font-bold text-gray-600 uppercase text-xs tracking-wider self-end">Grade:</span>
              <span className="flex-1 font-black text-black text-base">{session?.classGrade || 'N/A'}</span>
            </div>
            <div className="flex border-b border-gray-300 pb-1">
              <span className="w-32 font-bold text-gray-600 uppercase text-xs tracking-wider self-end">Roll Number:</span>
              <span className="flex-1 font-black text-black text-base">{student?.rollNumber || 'N/A'}</span>
            </div>
            <div className="flex border-b border-gray-300 pb-1">
              <span className="w-32 font-bold text-gray-600 uppercase text-xs tracking-wider self-end">School:</span>
              <span className="flex-1 font-black text-black text-base">{session?.schoolName || 'N/A'}</span>
            </div>
            <div className="flex border-b border-gray-300 pb-1">
              <span className="w-32 font-bold text-gray-600 uppercase text-xs tracking-wider self-end">District:</span>
              <span className="flex-1 font-black text-black text-base">{session?.district || 'N/A'}</span>
            </div>
            <div className="flex border-b border-gray-300 pb-1">
              <span className="w-32 font-bold text-gray-600 uppercase text-xs tracking-wider self-end">State/Country:</span>
              <span className="flex-1 font-black text-black text-base">Tamil Nadu, India</span>
            </div>
            <div className="flex border-b border-gray-300 pb-1">
              <span className="w-32 font-bold text-gray-600 uppercase text-xs tracking-wider self-end">Date:</span>
              <span className="flex-1 font-black text-black text-base">{new Date().toLocaleDateString('en-IN')}</span>
            </div>
          </div>

          {/* Clinical Result */}
          <div className="border-2 border-black p-6 mb-8 bg-gray-50 text-center">
            <h2 className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-2">Overall Assessment</h2>
            <div className={`text-2xl sm:text-3xl font-black uppercase tracking-wide ${results.overall === 'normal' ? 'text-green-700' : 'text-red-700'}`}>
              {titleMessage}
            </div>
            <p className="mt-4 text-base font-bold text-gray-800 leading-relaxed">
              {parentSummary}
            </p>
          </div>

          {/* Frequencies Details Table */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-3 border-b-2 border-black pb-1">Frequency Sweep Details (40 dB HL)</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-black text-black mb-2 uppercase text-sm">Left Ear</h4>
                {freqs.map(f => (
                  <div key={`l-${f}`} className="flex justify-between items-center py-1 border-b border-gray-200">
                    <span className="font-bold text-gray-700 text-sm">{f} Hz</span>
                    <span className={`font-black text-sm uppercase ${results.left[f] ? 'text-green-700' : 'text-red-700'}`}>
                      {results.left[f] ? 'PASS' : 'REFER'}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-black text-black mb-2 uppercase text-sm">Right Ear</h4>
                {freqs.map(f => (
                  <div key={`r-${f}`} className="flex justify-between items-center py-1 border-b border-gray-200">
                    <span className="font-bold text-gray-700 text-sm">{f} Hz</span>
                    <span className={`font-black text-sm uppercase ${results.right[f] ? 'text-green-700' : 'text-red-700'}`}>
                      {results.right[f] ? 'PASS' : 'REFER'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer of Receipt */}
          <div className="text-center mt-12 pt-6 border-t-2 border-black">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Generated by HearWise Technologies Pvt. Ltd.
            </p>
            <p className="text-xs font-bold text-gray-400 mt-1">
              Note: This is a screening report, not a diagnostic medical evaluation.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full flex flex-col sm:flex-row flex-wrap gap-4 justify-center mt-8">
          <DownloadReportButton result={screeningResultData} />

          {results.overall !== 'normal' && (
            <Button 
              className="bg-red-700 hover:bg-red-800 text-white font-bold h-14 px-8 rounded-none border-2 border-transparent"
              onClick={() => navigate('/audiologists?refer=true')}
            >
              <Hospital className="mr-2 h-4 w-4" />
              Find an Audiologist Near You →
            </Button>
          )}

          <Button 
            className="bg-black hover:bg-gray-800 text-white font-bold h-14 px-8 rounded-none border-2 border-black"
            onClick={() => navigate('/student-entry')}
          >
            <UserRoundPlus className="mr-2 h-5 w-5" />
            {t('nextStudent', lang)}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button 
            variant="outline" 
            className="h-14 px-8 rounded-none text-base font-bold border-2 border-black text-black hover:bg-gray-100"
            onClick={shareWhatsApp}
          >
            <Share2 className="mr-2 h-5 w-5" />
            {t('shareWhatsApp', lang)}
          </Button>

          <Button 
            variant="ghost" 
            className="h-14 px-6 rounded-none text-base font-bold text-gray-500 hover:text-black hover:bg-gray-200"
            onClick={() => navigate('/session-summary')}
          >
            <Home className="w-4 h-4 mr-2" />
            {t('endSession', lang)}
          </Button>
        </div>

      </main>

      {/* Verification footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-4 flex justify-center text-center mt-6">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
          HearWise Technologies Pvt. Ltd. • ISO 8253 Screening Protocol
        </p>
      </footer>
    </div>
  );
}

