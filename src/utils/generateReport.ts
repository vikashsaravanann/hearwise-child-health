import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Assuming ScreeningResult type exists or we define a simplified version
export interface ScreeningResult {
  id?: string;
  studentName?: string;
  age?: string;
  schoolName?: string;
  classSection?: string;
  teacherName?: string;
  overallResult: 'PASS' | 'REFER';
  date?: string;
  rightEar: Array<{ level: number, sound: string, frequency: string, result: 'Pass' | 'Refer' | 'Did not hear' }>;
  leftEar: Array<{ level: number, sound: string, frequency: string, result: 'Pass' | 'Refer' | 'Did not hear' }>;
}

export function generateReport(result: ScreeningResult) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // HEADER SECTION
  doc.setFillColor(15, 118, 110); // dark teal (teal-700)
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("HearWise", 15, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("HEARING SCREENING REPORT", pageWidth - 15, 25, { align: "right" });
  
  // REPORT TITLE
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Child Hearing Screening Certificate", pageWidth / 2, 55, { align: "center" });
  
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Conducted using HearWise Mobile Screening Platform", pageWidth / 2, 62, { align: "center" });
  
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
  doc.setFontSize(9);
  doc.text(`Generated on: ${currentDate}`, pageWidth / 2, 68, { align: "center" });

  // CHILD INFORMATION BOX
  doc.setFillColor(240, 253, 250); // light teal (teal-50)
  doc.setDrawColor(20, 184, 166); // teal-500
  doc.rect(15, 75, pageWidth - 30, 45, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  
  const col1X = 20;
  const col2X = pageWidth / 2;
  
  doc.text(`Child Name: ${result.studentName || 'N/A'}`, col1X, 85);
  doc.text(`Age: ${result.age || 'N/A'}`, col1X, 95);
  doc.text(`School Name: ${result.schoolName || 'N/A'}`, col1X, 105);
  doc.text(`Class / Section: ${result.classSection || 'N/A'}`, col1X, 115);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Screening Date: ${result.date || currentDate}`, col2X, 85);
  doc.text(`Screened By: ${result.teacherName || 'N/A'}`, col2X, 95);
  doc.text(`Report ID: HW-${Date.now().toString().slice(-6)}`, col2X, 105);

  // RESULTS TABLE
  const tableData = [];
  
  // Right Ear Data
  result.rightEar?.forEach((r, i) => {
    tableData.push([
      i === 0 ? { content: 'Right Ear', rowSpan: result.rightEar.length } : '',
      r.level,
      r.sound,
      r.frequency,
      r.result
    ]);
  });
  
  // Left Ear Data
  result.leftEar?.forEach((r, i) => {
    tableData.push([
      i === 0 ? { content: 'Left Ear', rowSpan: result.leftEar.length } : '',
      r.level,
      r.sound,
      r.frequency,
      r.result
    ]);
  });

  autoTable(doc, {
    startY: 130,
    head: [['Ear', 'Level', 'Sound', 'Frequency', 'Result']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [15, 118, 110] }, // teal-700
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', valign: 'middle' }
    },
    didParseCell: function (data) {
      if (data.section === 'body' && data.column.index === 4) {
        if (data.cell.raw === 'Pass' || data.cell.raw === 'PASS') {
          data.cell.styles.fillColor = [220, 252, 231]; // green-100
          data.cell.styles.textColor = [21, 128, 61]; // green-700
        } else if (data.cell.raw === 'Refer' || data.cell.raw === 'REFER' || data.cell.raw === 'Did not hear') {
          data.cell.styles.fillColor = [254, 243, 199]; // amber-100
          data.cell.styles.textColor = [180, 83, 9]; // amber-700
        }
      }
    }
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`OVERALL RESULT: ${result.overallResult}`, 15, finalY);

  // RESULT INTERPRETATION
  const interpY = finalY + 10;
  
  if (result.overallResult === 'PASS') {
    doc.setFillColor(220, 252, 231); // green-100
    doc.setDrawColor(34, 197, 94); // green-600
    doc.rect(15, interpY, pageWidth - 30, 30, 'FD');
    
    doc.setTextColor(21, 128, 61); // green-700
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("PASS — No hearing concerns detected at this screening.", 20, interpY + 10);
    doc.setFont("helvetica", "normal");
    doc.text("This result indicates that the child responded normally to all sound levels tested.", 20, interpY + 18);
    doc.text("We recommend re-screening annually. This is a screening result and not a full clinical audiogram.", 20, interpY + 24);
  } else {
    doc.setFillColor(254, 243, 199); // amber-100
    doc.setDrawColor(245, 158, 11); // amber-500
    doc.rect(15, interpY, pageWidth - 30, 35, 'FD');
    
    doc.setTextColor(180, 83, 9); // amber-700
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("REFER — Further evaluation recommended.", 20, interpY + 10);
    doc.setFont("helvetica", "normal");
    const splitText = doc.splitTextToSize("This result indicates that the child did not respond to one or more sound levels during screening. This does NOT confirm hearing loss. Please arrange a full clinical audiological evaluation at the earliest. Early assessment leads to significantly better outcomes.", pageWidth - 40);
    doc.text(splitText, 20, interpY + 18);
  }

  // NEXT STEPS
  const nextStepsY = interpY + 45;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("NEXT STEPS", 15, nextStepsY);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  if (result.overallResult === 'PASS') {
    doc.text("• Continue annual hearing screening", 20, nextStepsY + 10);
    doc.text("• Watch for warning signs (delayed speech, asking for repetition, loud TV)", 20, nextStepsY + 18);
    doc.text("• Contact your school health officer if concerns arise", 20, nextStepsY + 26);
  } else {
    doc.text("• Visit a certified audiologist within 2–4 weeks", 20, nextStepsY + 10);
    doc.text("• Bring this report to the audiologist appointment", 20, nextStepsY + 18);
    doc.text("• Contact HearWise support: support@hearwise.in", 20, nextStepsY + 26);
    doc.text("• Visit the HearWise referral directory at hearwise.in/audiologists", 20, nextStepsY + 34);
  }

  // FOOTER
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("This report was generated by HearWise Technologies Pvt. Ltd.", 15, pageHeight - 25);
  doc.text("Platform: hearwise-child-health.vercel.app", 15, pageHeight - 20);
  doc.text("Disclaimer: HearWise is a screening tool and does not replace a full clinical audiological evaluation.", 15, pageHeight - 15);
  
  doc.text("Page 1 of 1", pageWidth - 15, pageHeight - 15, { align: "right" });

  // SAVE PDF
  const filename = `HearWise_Report_${result.studentName?.replace(/\s+/g, '_') || 'Student'}.pdf`;
  doc.save(filename);
}
