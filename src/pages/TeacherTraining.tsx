import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '@/contexts/SessionContext';
import PageWrapper from '@/components/shared/PageWrapper';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle2, 
  Smartphone, 
  Headphones, 
  ClipboardList, 
  VolumeX, 
  Clock, 
  AlertTriangle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Do you need medical training to conduct a HearWise screening?",
    options: [
      "Yes, you must be a doctor.",
      "Yes, you must be a nurse.",
      "No, any teacher can do it after this 10-minute training."
    ],
    answer: 2
  },
  {
    id: 2,
    question: "What equipment do you need?",
    options: [
      "A laptop and a quiet room.",
      "An Android smartphone and standard wired headphones.",
      "An iPad and Bluetooth headphones."
    ],
    answer: 1
  },
  {
    id: 3,
    question: "During the test, if the child does not raise their hand within 3 seconds, what should you do?",
    options: [
      "Tap 'Not Heard'.",
      "Tap 'Heard'.",
      "Point to their ear to remind them."
    ],
    answer: 0
  },
  {
    id: 4,
    question: "Is it okay if there is a lot of background noise?",
    options: [
      "Yes, it doesn't matter.",
      "No, you should find a reasonably quiet corner or room.",
      "You must test them outside."
    ],
    answer: 1
  },
  {
    id: 5,
    question: "What does an 'Amber / Refer' result mean?",
    options: [
      "The child definitely has permanent hearing loss.",
      "The child failed the test and has to repeat a grade.",
      "A possible hearing concern was detected and an audiologist should evaluate the child."
    ],
    answer: 2
  }
];

export default function TeacherTraining() {
  const navigate = useNavigate();
  const { lang } = useSession();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnswer = (qId: number, answerIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: answerIdx }));
  };

  const submitQuiz = () => {
    let currentScore = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.answer) currentScore++;
    });
    setScore(currentScore);
    setShowResults(true);

    if (currentScore >= 4) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <PageWrapper title="Teacher Training" backPath="/">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-teal-500 z-50 transition-all duration-150" style={{ width: `${scrollProgress}%` }} />

      <div className="bg-[#000b1d] min-h-screen text-slate-300 py-12 px-4 md:px-8 pb-32">
        <div className="max-w-3xl mx-auto space-y-20">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Teacher Training Guide</h1>
            <p className="text-lg text-teal-400">Learn how to conduct a HearWise hearing screening in 10 minutes</p>
          </div>

          {/* MODULE 1 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-lg">1</span>
              Welcome, Teacher! 👩‍🏫
            </h2>
            <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 text-lg leading-relaxed">
              <p className="mb-6">
                You are about to make a real difference in a child's life. This guide will teach you everything you need to know to conduct a HearWise hearing screening. The entire process takes about 5–10 minutes per child, and you need no prior medical knowledge. Just follow the steps carefully.
              </p>
              <ul className="space-y-3 font-medium">
                <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-400 w-6 h-6" /> No medical training required</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-400 w-6 h-6" /> Works on any Android smartphone</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-400 w-6 h-6" /> Children find it fun and engaging</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-400 w-6 h-6" /> Results are instant and automatic</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-400 w-6 h-6" /> You can screen 50 children per hour</li>
              </ul>
            </div>
          </section>

          {/* MODULE 2 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-lg">2</span>
              What You Need
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-panel p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                <Smartphone className="w-10 h-10 text-cyan-400 shrink-0" />
                <span className="font-bold text-white">One Android smartphone (charged &gt;50%)</span>
              </div>
              <div className="glass-panel p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                <Headphones className="w-10 h-10 text-pink-400 shrink-0" />
                <span className="font-bold text-white">Standard wired headphones (3.5mm jack)</span>
              </div>
              <div className="glass-panel p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                <ClipboardList className="w-10 h-10 text-emerald-400 shrink-0" />
                <span className="font-bold text-white">Student list with names and ages</span>
              </div>
              <div className="glass-panel p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                <VolumeX className="w-10 h-10 text-orange-400 shrink-0" />
                <span className="font-bold text-white">A reasonably quiet room or corner</span>
              </div>
              <div className="glass-panel p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 sm:col-span-2">
                <Clock className="w-10 h-10 text-blue-400 shrink-0" />
                <span className="font-bold text-white">5–10 minutes per student</span>
              </div>
            </div>
            <div className="bg-amber-900/30 border border-amber-500/30 rounded-2xl p-6 flex gap-4 mt-6">
              <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0" />
              <p className="text-amber-100 font-medium">
                The room does not need to be completely silent, but avoid loud ongoing noise like a running fan directly next to the student or a noisy classroom next door.
              </p>
            </div>
          </section>

          {/* MODULE 3 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-lg">3</span>
              Step by Step Guide
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Open the HearWise App', desc: 'Open the HearWise app on your smartphone. Make sure the device is connected to the internet at least once to sync any previous results. The app works offline — data will sync later.' },
                { title: 'Create a New Session', desc: 'Tap "New Screening Session". Enter your school name and your name as the teacher. This will be saved with all results.' },
                { title: 'Seat the Student Correctly', desc: 'Have the student sit comfortably in a chair facing away from any windows or distractions. Make sure they are calm and not anxious. Explain that this is not a test they can pass or fail — it is just a check-up.' },
                { title: 'Put On the Headphones', desc: 'Place the headphones on the student. Make sure: RIGHT ear cup is on the RIGHT ear (look for R). LEFT ear cup on LEFT. Cable is not tangled.' },
                { title: 'Complete the Headphone Check', desc: 'The app will play a brief check tone in each ear. Ask the student: "Did you hear that? Which ear?" This confirms the headphones are working correctly.' },
                { title: 'Practice Round', desc: 'The app runs a practice round. Tell the student: "Every time you hear a sound — raise your hand. If you hear it in your right ear, raise your right hand. Left ear, left hand." Let them do 2-3 practice responses.' },
                { title: 'Run the Hearing Test', desc: 'The test will start automatically. For each sound, tap "Heard" if the student raises their hand, "Not Heard" if they do not respond after 3 seconds. Do NOT prompt or gesture to the student.' },
                { title: 'View and Share Results', desc: 'Results appear immediately. Green = Pass. Amber = Refer. Download the PDF report and send it to the parent. All results save automatically.' },
              ].map((step, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl bg-white/5 border border-white/10 flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xl shrink-0 mt-1">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* MODULE 4 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-lg">4</span>
              Do's and Don'ts
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl bg-emerald-900/20 border border-emerald-500/30">
                <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">✅ DO</h3>
                <ul className="space-y-3 text-slate-300">
                  <li>• Keep the room reasonably quiet</li>
                  <li>• Speak calmly and reassuringly</li>
                  <li>• Wait a full 3 seconds before marking 'Not Heard'</li>
                  <li>• Test both ears for every child</li>
                  <li>• Download and share the report</li>
                </ul>
              </div>
              <div className="glass-panel p-6 rounded-2xl bg-rose-900/20 border border-rose-500/30">
                <h3 className="text-xl font-bold text-rose-400 mb-4 flex items-center gap-2">❌ DON'T</h3>
                <ul className="space-y-3 text-slate-300">
                  <li>• Don't tell the child whether they passed or failed during the test</li>
                  <li>• Don't gesture or give visual cues</li>
                  <li>• Don't test a sick child</li>
                  <li>• Don't share results with other students</li>
                  <li>• Don't skip the practice round</li>
                </ul>
              </div>
            </div>
          </section>

          {/* MODULE 5 - QUIZ */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-lg">5</span>
              Certification Quiz
            </h2>
            <p className="text-lg">Score 4/5 to receive your Certified Screener badge!</p>

            <div className="space-y-8">
              {QUIZ_QUESTIONS.map((q, i) => (
                <div key={q.id} className="glass-panel p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">{i + 1}. {q.question}</h3>
                  <RadioGroup value={answers[q.id]?.toString()} onValueChange={v => handleAnswer(q.id, parseInt(v))} className="space-y-3">
                    {q.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center space-x-3 bg-black/20 p-3 rounded-lg border border-white/5">
                        <RadioGroupItem value={idx.toString()} id={`q${q.id}-opt${idx}`} />
                        <Label htmlFor={`q${q.id}-opt${idx}`} className="cursor-pointer font-normal text-base w-full">{opt}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}

              {!showResults ? (
                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-2xl"
                  onClick={submitQuiz}
                  disabled={Object.keys(answers).length < 5}
                >
                  Submit Answers
                </Button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-8 rounded-3xl border-2 text-center space-y-4 ${score >= 4 ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-rose-900/30 border-rose-500/50'}`}
                >
                  {score >= 4 ? (
                    <>
                      <Award className="w-20 h-20 text-yellow-400 mx-auto" />
                      <h3 className="text-3xl font-black text-white">HearWise Certified Screener 🏆</h3>
                      <p className="text-lg text-emerald-400 font-bold">You scored {score}/5!</p>
                      <p className="text-slate-300">You are fully prepared to conduct hearing screenings. Thank you for your dedication!</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-3xl font-black text-white">Please Review and Try Again</h3>
                      <p className="text-lg text-rose-400 font-bold">You scored {score}/5.</p>
                      <p className="text-slate-300">You need 4/5 to be certified. Please read through the guide again.</p>
                      <Button variant="outline" className="mt-4 border-white/20" onClick={() => { setShowResults(false); setAnswers({}); setScore(0); }}>
                        Retake Quiz
                      </Button>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </section>

        </div>
      </div>
    </PageWrapper>
  );
}
