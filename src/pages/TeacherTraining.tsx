import React, { useState } from 'react';
import PageWrapper from '@/components/shared/PageWrapper';
import FadeInSection from '@/components/FadeInSection';
import VideoCard from '@/components/VideoCard';
import { jsPDF } from 'jspdf';
import { 
  FileDown, CheckCircle2, AlertCircle, XCircle 
} from 'lucide-react';

const steps = [
  {
    num: 1,
    title: 'Prepare the Environment',
    icon: '🔇',
    body: "Find a quiet room or corner away from classroom noise. The room doesn't need to be silent, but background noise should be minimal. A library, corridor, or empty classroom works well."
  },
  {
    num: 2,
    title: 'Check the Device',
    icon: '📱',
    body: "Use a smartphone or tablet with a working headphone jack or Bluetooth headphone connection. Make sure the volume is set to exactly 60–70% — not too loud, not too quiet. Test the sound yourself first."
  },
  {
    num: 3,
    title: 'Use the Right Headphones',
    icon: '🎧',
    body: "Use over-ear or in-ear headphones that fully cover or sit inside the child's ears. Do not use open-back or speaker mode. The child must wear headphones for accurate results."
  },
  {
    num: 4,
    title: 'Explain to the Child',
    icon: '👋',
    body: "Tell the child: 'You will hear some sounds — like birds, ocean waves, and water. Whenever you hear a sound, raise your hand or say YES. If you don't hear anything, stay quiet.' Do a practice round first."
  },
  {
    num: 5,
    title: 'Run the Test',
    icon: '▶️',
    body: "Click 'Start Test' on the HearWise screen. The test will play sounds for the left ear first (5 levels), then the right ear (5 levels). Record the child's response for each level accurately."
  },
  {
    num: 6,
    title: 'Record Results Honestly',
    icon: '✏️',
    body: "Mark PASS only if the child clearly responds to the sound. If the child seems unsure, does not respond, or looks confused, mark REFER. It is better to over-refer than under-refer."
  },
  {
    num: 7,
    title: 'Download and Share the Report',
    icon: '📄',
    body: "After the test, click 'Download PDF Report'. Share it with the child's parents. If the result is REFER, also share the link to the HearWise Audiologist Directory."
  }
];

const quizQuestions = [
  {
    q: "What volume level should you set the device to before starting a HearWise test?",
    options: ["30-40%", "60-70%", "100%", "Any volume"],
    correct: 1
  },
  {
    q: "Which type of headphones should you use?",
    options: ["Phone speakers", "Open-back headphones", "Over-ear or in-ear headphones", "Earbuds without ear tips"],
    correct: 2
  },
  {
    q: "If a child seems unsure whether they heard a sound, what should you mark?",
    options: ["PASS", "REFER", "Skip that level", "Repeat the sound 5 times"],
    correct: 1
  },
  {
    q: "How many total sound levels does a full HearWise test have?",
    options: ["5", "8", "10", "12"],
    correct: 2
  },
  {
    q: "What should you do after a child receives a REFER result?",
    options: [
      "Re-test immediately", 
      "Ignore it", 
      "Download the PDF report and share with parents + refer to an audiologist", 
      "Send them back to class"
    ],
    correct: 2
  }
];

export default function TeacherTraining() {

  // Quiz State
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);

    if (currentQ < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 600);
    } else {
      setTimeout(() => setShowResult(true), 600);
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, idx) => {
      return score + (answer === quizQuestions[idx].correct ? 1 : 0);
    }, 0);
  };

  const score = calculateScore();

  const downloadGuide = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("HearWise Teacher Guide", 20, 20);
    
    doc.setFontSize(12);
    let y = 40;
    steps.forEach((step) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${step.num}. ${step.title}`, 20, y);
      doc.setFont("helvetica", "normal");
      
      const splitText = doc.splitTextToSize(step.body, 170);
      doc.text(splitText, 20, y + 7);
      
      y += 15 + (splitText.length * 5);
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("HearWise_Teacher_Guide.pdf");
  };

  return (
    <PageWrapper title="Teacher Training" showBack={true} backTo="/">
      <div className="min-h-screen bg-slate-50 pb-20">
        
        {/* Section 1: Video */}
        <div className="bg-slate-900 pt-24 pb-16 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-white text-center mb-4 font-['Syne']">
              Watch Before You Start — 3 Minute Training Video
            </h1>
            <p className="text-slate-400 text-center text-lg mb-12">
              Complete Teacher Training — How to Use HearWise
            </p>
            
            <VideoCard
              title="HOW TO CONDUCT THE HEARING TEST — TEACHER GUIDE"
              description="Watch this once before conducting your first hearing test. Covers device setup, headphone placement, test flow, and how to interpret results."
              duration="3:30 MIN"
              category="TEACHER TRAINING"
              icon="🎧"
              gradientFrom="#1a0550"
              gradientTo="#0d4f6e"
              stats={[{ label: 'STEPS', value: '5' }, { label: 'DIFFICULTY', value: 'EASY' }, { label: 'TRAINING TIME', value: '3 MIN' }]}
            />
          </div>
        </div>

        {/* Section 2: Step-by-Step Guide */}
        <div className="max-w-4xl mx-auto px-6 mt-20">
          <FadeInSection delay={0.1}>
            <div className="text-center mb-12">
              <h2 className="hw-section-title text-slate-900">How to Conduct a HearWise Hearing Test</h2>
              <p className="text-slate-500 text-lg">Follow these 7 steps carefully before starting any child's test.</p>
            </div>
            
            <div className="space-y-6">
              {steps.map((step, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex gap-6 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-teal-50 text-3xl flex items-center justify-center border border-teal-100">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 font-['Syne'] flex items-center gap-2">
                      <span className="text-teal-600">Step {step.num}:</span> {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Section 4: Download Guide */}
            <div className="mt-10 flex justify-center">
              <button 
                onClick={downloadGuide}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-teal-600/20"
              >
                <FileDown size={20} />
                Download Teacher Guide PDF
              </button>
            </div>
          </FadeInSection>
        </div>

        {/* Section 3: Quick Quiz */}
        <div className="max-w-3xl mx-auto px-6 mt-32">
          <FadeInSection delay={0.2}>
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
              <div className="text-center mb-10">
                <h2 className="hw-section-title text-slate-900 !mb-2">Quick Knowledge Check</h2>
                <p className="text-slate-500">Answer these 5 questions to confirm you are ready to conduct screenings.</p>
              </div>

              {!showResult ? (
                <div>
                  <div className="mb-8">
                    <div className="flex justify-between text-sm font-bold text-teal-600 mb-2">
                      <span>Question {currentQ + 1} of {quizQuestions.length}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-teal-500 h-full transition-all duration-500" 
                        style={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 leading-relaxed">
                    {quizQuestions[currentQ].q}
                  </h3>

                  <div className="space-y-3">
                    {quizQuestions[currentQ].options.map((opt, idx) => {
                      const isSelected = answers[currentQ] === idx;
                      const isCorrect = quizQuestions[currentQ].correct === idx;
                      const showFeedback = answers[currentQ] !== undefined;

                      let btnClass = "w-full text-left px-6 py-4 rounded-xl border-2 transition-all font-medium text-slate-700 ";
                      
                      if (!showFeedback) {
                        btnClass += "border-slate-200 hover:border-teal-500 hover:bg-teal-50";
                      } else if (isCorrect) {
                        btnClass += "border-emerald-500 bg-emerald-50 text-emerald-800";
                      } else if (isSelected && !isCorrect) {
                        btnClass += "border-rose-500 bg-rose-50 text-rose-800";
                      } else {
                        btnClass += "border-slate-200 opacity-50";
                      }

                      return (
                        <button
                          key={idx}
                          disabled={showFeedback}
                          onClick={() => handleAnswer(idx)}
                          className={btnClass}
                        >
                          <div className="flex items-center justify-between">
                            <span>{opt}</span>
                            {showFeedback && isCorrect && <CheckCircle2 className="text-emerald-600" />}
                            {showFeedback && isSelected && !isCorrect && <XCircle className="text-rose-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 animate-fade-in">
                  {score === 5 ? (
                    <>
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 text-emerald-500 mb-6">
                        <CheckCircle2 size={48} />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-4">🎉 Excellent!</h3>
                      <p className="text-lg text-slate-600 mb-8">You are ready to conduct HearWise screenings.</p>
                      <div className="inline-block bg-emerald-500 text-white px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm">
                        Certified Ready
                      </div>
                    </>
                  ) : score >= 3 ? (
                    <>
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-100 text-amber-500 mb-6">
                        <AlertCircle size={48} />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-4">👍 Good!</h3>
                      <p className="text-lg text-slate-600 mb-8">You scored {score}/5. Review the steps above and try again.</p>
                      <button onClick={() => { setShowResult(false); setCurrentQ(0); setAnswers([]); }} className="text-teal-600 font-bold hover:underline">
                        Retake Quiz
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-rose-100 text-rose-500 mb-6">
                        <XCircle size={48} />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-4">📖 Keep Learning</h3>
                      <p className="text-lg text-slate-600 mb-8">You scored {score}/5. Please read the guide carefully and retake the quiz.</p>
                      <button onClick={() => { setShowResult(false); setCurrentQ(0); setAnswers([]); }} className="text-teal-600 font-bold hover:underline">
                        Retake Quiz
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </FadeInSection>
        </div>

      </div>
      
    </PageWrapper>
  );
}
