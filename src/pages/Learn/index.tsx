import React, { useState } from 'react';
import PageWrapper from '@/components/shared/PageWrapper';
import { useSession } from '@/contexts/SessionContext';
import { CheckCircle2, XCircle, Volume2, Shield, Activity, Bell } from 'lucide-react';

const QUESTIONS = [
  { id: 1, text: 'Listening to loud music for hours is safe.', answer: false },
  { id: 2, text: 'Cleaning your ears with cotton swabs is recommended.', answer: false },
  { id: 3, text: 'Hearing loss only affects old people.', answer: false },
  { id: 4, text: 'Whales use their jawbones to hear.', answer: true },
  { id: 5, text: 'Your ears never stop hearing, even when asleep.', answer: true }
];

export default function LearnPage() {
  const { lang } = useSession();
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<boolean | null>(null);

  const handleAnswer = (answer: boolean) => {
    setSelected(answer);
    if (answer === QUESTIONS[currentQ].answer) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      setSelected(null);
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  return (
    <PageWrapper
      title={lang === 'ta' ? '📚 கற்றல்' : '📚 Learn'}
      subtitle={lang === 'ta' ? 'KG – Grade 12' : 'KG – Grade 12'}
      owlState="idle"
      owlSpeech={lang === 'ta' ? 'அறிவை கண்டறிவோம்!' : 'Let’s explore knowledge!'}
    >
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-12">
        
        {/* Mini Game Section */}
        <div className="bg-white/10 backdrop-blur-md border-4 border-white/20 rounded-3xl p-6 sm:p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-6" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            {lang === 'ta' ? 'உண்மை அல்லது பொய் விளையாட்டு' : 'True or False Mini-Game'}
          </h2>
          
          {showResult ? (
            <div className="bg-white rounded-2xl p-6 sm:p-8">
              <h3 className="text-3xl font-black text-blue-900 mb-2">Quiz Complete!</h3>
              <p className="text-xl text-blue-700 font-bold mb-6">Your Score: {score} / 5</p>
              <button 
                onClick={() => { setCurrentQ(0); setScore(0); setShowResult(false); }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform active:scale-95"
              >
                Play Again
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 sm:p-8">
              <p className="text-sm font-bold text-blue-400 mb-2">Question {currentQ + 1} of 5</p>
              <p className="text-xl sm:text-2xl font-black text-blue-900 mb-8 min-h-[4rem] flex items-center justify-center">
                {QUESTIONS[currentQ].text}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  disabled={selected !== null}
                  onClick={() => handleAnswer(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-black text-lg border-4 transition-all ${
                    selected === true
                      ? (QUESTIONS[currentQ].answer === true ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700')
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300'
                  }`}
                >
                  <CheckCircle2 className="w-6 h-6" /> TRUE
                </button>
                <button
                  disabled={selected !== null}
                  onClick={() => handleAnswer(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-black text-lg border-4 transition-all ${
                    selected === false
                      ? (QUESTIONS[currentQ].answer === false ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700')
                      : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 hover:border-rose-300'
                  }`}
                >
                  <XCircle className="w-6 h-6" /> FALSE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Ear Care Tips Grid */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 text-center" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            {lang === 'ta' ? 'காது பராமரிப்பு குறிப்புகள்' : 'Ear Care Tips'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-blue-50 hover:border-blue-200 transition-all group">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Volume2 className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-blue-900 mb-2">60/60 Rule</h3>
              <p className="text-blue-700/80 font-medium">Listen at no more than 60% volume for a maximum of 60 minutes at a time.</p>
            </div>
            
            <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-emerald-50 hover:border-emerald-200 transition-all group">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="text-emerald-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-blue-900 mb-2">Use Earplugs</h3>
              <p className="text-blue-700/80 font-medium">Wear protective earplugs in loud environments like concerts or construction sites.</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-amber-50 hover:border-amber-200 transition-all group">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="text-amber-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-blue-900 mb-2">Dry Your Ears</h3>
              <p className="text-blue-700/80 font-medium">After swimming or bathing, gently towel-dry your ears to prevent infections.</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-50 hover:border-purple-200 transition-all group">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bell className="text-purple-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-blue-900 mb-2">Give Ears a Rest</h3>
              <p className="text-blue-700/80 font-medium">Step away from continuous noise for at least 15 minutes to let your ears recover.</p>
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
