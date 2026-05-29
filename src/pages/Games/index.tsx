import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/shared/PageWrapper';
import { useSession } from '@/contexts/SessionContext';

/* ---------- GAME DATA ---------- */
const SOUND_ITEMS = [
  { id: 1, emoji: '🐱', label: 'Cat',    labelTa: 'பூனை',    sound: 'meow' },
  { id: 2, emoji: '🐶', label: 'Dog',    labelTa: 'நாய்',    sound: 'bark' },
  { id: 3, emoji: '🥁', label: 'Drum',   labelTa: 'மேளம்',   sound: 'drum' },
  { id: 4, emoji: '🌧️', label: 'Rain',   labelTa: 'மழை',     sound: 'rain' },
  { id: 5, emoji: '🔔', label: 'Bell',   labelTa: 'மணி',     sound: 'bell' },
  { id: 6, emoji: '🐸', label: 'Frog',   labelTa: 'தவளை',   sound: 'frog' },
  { id: 7, emoji: '🚂', label: 'Train',  labelTa: 'ரயில்',   sound: 'train' },
  { id: 8, emoji: '👏', label: 'Clap',   labelTa: 'கைதட்டல்', sound: 'clap' },
  { id: 9, emoji: '💨', label: 'Wind',   labelTa: 'காற்று',  sound: 'wind' },
  { id: 10,emoji: '🌊', label: 'Ocean',  labelTa: 'கடல்',    sound: 'ocean' },
];

type Game = 'menu' | 'whatSound' | 'tapSound' | 'highLow';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/* ---------- GAME 1 — What Sound Is This? ---------- */
function WhatSoundGame({ lang, onBack }: { lang: string; onBack: () => void }) {
  const [round, setRound] = useState(0);
  const [options, setOptions] = useState<typeof SOUND_ITEMS>([]);
  const [answer, setAnswer] = useState<typeof SOUND_ITEMS[0] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const startRound = useCallback(() => {
    const shuffled = shuffle(SOUND_ITEMS);
    const correct = shuffled[0];
    const opts = shuffle([correct, ...shuffled.slice(1, 4)]);
    setAnswer(correct);
    setOptions(opts);
    setSelected(null);
  }, []);

  React.useEffect(() => { startRound(); }, [startRound]);

  const handleSelect = (id: number) => {
    if (selected !== null) return;
    setSelected(id);
    const correct = id === answer?.id;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (round + 1 >= 10) { setDone(true); return; }
      setRound((r) => r + 1);
      startRound();
    }, 1200);
  };

  if (done) return (
    <div className="text-center py-12">
      <div className="text-7xl mb-4">🎉</div>
      <h2 className="text-4xl font-black text-white mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
        {score}/10
      </h2>
      <p className="text-white/80 text-lg mb-6">{score >= 8 ? '🌟 Amazing!' : score >= 5 ? '👏 Great!' : '💪 Keep trying!'}</p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => { setRound(0); setScore(0); setDone(false); startRound(); }}
          className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-2xl font-black hover:scale-105 transition-all">
          🔄 {lang === 'ta' ? 'மீண்டும்' : 'Play Again'}
        </button>
        <button onClick={onBack} className="px-6 py-3 bg-white/20 text-white rounded-2xl font-bold hover:bg-white/30 transition-all">
          ← {lang === 'ta' ? 'திரும்பு' : 'Back'}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between text-white/80 text-sm mb-4">
        <span>{lang === 'ta' ? 'சுற்று' : 'Round'} {round + 1}/10</span>
        <span>⭐ {score}</span>
      </div>
      {/* Sound display */}
      <div className="ocean-panel p-8 text-center mb-6">
        <p className="text-white/70 text-sm mb-3">{lang === 'ta' ? 'இந்த ஒலி என்ன?' : 'What sound is this?'}</p>
        <div className="text-8xl mb-4 animate-bounce-celebration">{answer?.emoji}</div>
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center text-3xl shadow-xl cursor-pointer hover:scale-110 transition-all active:scale-95"
          onClick={() => {}}>
          🔊
        </div>
        <p className="text-white/50 text-xs mt-2">{lang === 'ta' ? 'ஒலியை கேள்' : 'Listen to the sound'}</p>
      </div>
      {/* Options */}
      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
          <button key={opt.id} onClick={() => handleSelect(opt.id)}
            className={`p-5 rounded-3xl text-center font-black text-xl transition-all duration-300 border-4 ${
              selected === opt.id
                ? opt.id === answer?.id
                  ? 'bg-green-500 text-white border-green-300 scale-110'
                  : 'bg-red-500 text-white border-red-300 scale-95'
                : selected !== null && opt.id === answer?.id
                ? 'bg-green-400 text-white border-green-300'
                : 'bg-white/20 text-white border-white/30 hover:bg-white/30 hover:scale-105'
            }`}>
            <div className="text-5xl mb-2">{opt.emoji}</div>
            <div className="text-base">{lang === 'ta' ? opt.labelTa : opt.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- GAME 3 — High or Low ---------- */
function HighLowGame({ lang, onBack }: { lang: string; onBack: () => void }) {
  const questions = [
    { answer: 'high', emoji: '🎻', label: 'Violin' },
    { answer: 'low', emoji: '🥁', label: 'Drum Bass' },
    { answer: 'high', emoji: '🔔', label: 'Bell' },
    { answer: 'low', emoji: '🐸', label: 'Frog' },
    { answer: 'high', emoji: '🐦', label: 'Bird' },
    { answer: 'low', emoji: '🐻', label: 'Bear growl' },
    { answer: 'high', emoji: '💨', label: 'Whistle' },
    { answer: 'low', emoji: '⚡', label: 'Thunder' },
  ];
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[round];

  const handleSelect = (choice: string) => {
    if (selected !== null) return;
    setSelected(choice);
    if (choice === q.answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (round + 1 >= questions.length) { setDone(true); return; }
      setRound((r) => r + 1);
      setSelected(null);
    }, 1000);
  };

  if (done) return (
    <div className="text-center py-12">
      <div className="text-7xl mb-4">{score >= 6 ? '🏆' : '⭐'}</div>
      <h2 className="text-4xl font-black text-white mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>{score}/8</h2>
      <div className="flex gap-3 justify-center mt-6">
        <button onClick={() => { setRound(0); setScore(0); setDone(false); setSelected(null); }}
          className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-2xl font-black hover:scale-105 transition-all">
          🔄 {lang === 'ta' ? 'மீண்டும்' : 'Play Again'}
        </button>
        <button onClick={onBack} className="px-6 py-3 bg-white/20 text-white rounded-2xl font-bold">← Back</button>
      </div>
    </div>
  );

  return (
    <div className="text-center">
      <div className="flex justify-between text-white/80 text-sm mb-4">
        <span>Round {round + 1}/8</span><span>⭐ {score}</span>
      </div>
      <div className="ocean-panel p-8 mb-6">
        <div className="text-8xl mb-3">{q.emoji}</div>
        <p className="text-white font-bold text-xl">{q.label}</p>
        <p className="text-white/60 text-sm mt-2">{lang === 'ta' ? 'இந்த ஒலி உயர்வா அல்லது தாழ்வா?' : 'Is this sound HIGH or LOW?'}</p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <button onClick={() => handleSelect('high')}
          className={`p-8 rounded-3xl font-black text-2xl transition-all border-4 ${
            selected === 'high' ? (q.answer === 'high' ? 'bg-green-500 border-green-300' : 'bg-red-500 border-red-300') : 'bg-gradient-to-t from-blue-600 to-blue-300 border-blue-200 hover:scale-105'
          } text-white`}>
          <div className="text-5xl mb-2">🚀</div>
          {lang === 'ta' ? 'உயர்வு' : 'HIGH'}
        </button>
        <button onClick={() => handleSelect('low')}
          className={`p-8 rounded-3xl font-black text-2xl transition-all border-4 ${
            selected === 'low' ? (q.answer === 'low' ? 'bg-green-500 border-green-300' : 'bg-red-500 border-red-300') : 'bg-gradient-to-b from-blue-600 to-blue-900 border-blue-700 hover:scale-105'
          } text-white`}>
          <div className="text-5xl mb-2">🤿</div>
          {lang === 'ta' ? 'தாழ்வு' : 'LOW'}
        </button>
      </div>
    </div>
  );
}

/* ---------- GAME 4 — Save the Sea Creatures ---------- */
function SaveSeaCreaturesGame({ lang, onBack }: { lang: string; onBack: () => void }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [creaturePos, setCreaturePos] = useState({ x: 50, y: 50 });
  
  const creatures = ['🐠', '🐙', '🦀', '🐚', '🐋', '🐢'];
  const currentCreature = creatures[round % creatures.length];

  const startLevel = () => {
    setIsPlaying(true);
    setCreaturePos({ x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 });
    // Play a sound logic here
    setTimeout(() => {
      setIsPlaying(false);
    }, 1500);
  };

  const handleRescue = () => {
    if (isPlaying) return;
    setScore(s => s + 1);
    if (round + 1 >= 5) {
      setDone(true);
    } else {
      setRound(r => r + 1);
      startLevel();
    }
  };

  if (done) return (
    <div className="text-center py-12">
      <div className="text-7xl mb-4">🌊</div>
      <h2 className="text-4xl font-black text-white mb-2">Ocean Hero!</h2>
      <p className="text-white/80 text-lg mb-6">You saved {score} sea creatures!</p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => { setRound(0); setScore(0); setDone(false); }}
          className="px-8 py-4 bg-cyan-400 text-gray-900 rounded-[2rem] font-black hover:scale-105 transition-all shadow-xl">
          🔄 Play Again
        </button>
        <button onClick={onBack} className="px-8 py-4 bg-white/20 text-white rounded-[2rem] font-bold">Back</button>
      </div>
    </div>
  );

  return (
    <div className="relative h-[400px] w-full bg-blue-900/40 rounded-[3rem] border-4 border-white/40 overflow-hidden cursor-pointer"
         onClick={handleRescue}>
      <div className="absolute top-4 left-6 text-white font-black">Score: {score}/5</div>
      <div className="absolute inset-0 flex items-center justify-center">
         {!isPlaying && (
           <motion.div 
             animate={{ scale: [1, 1.1, 1] }}
             transition={{ repeat: Infinity, duration: 1.5 }}
             className="text-white font-black text-xl bg-blue-500/40 px-6 py-3 rounded-full backdrop-blur-sm"
           >
             Tap to Rescue!
           </motion.div>
         )}
      </div>
      <motion.div
        animate={{ 
          x: `${creaturePos.x}%`, 
          y: `${creaturePos.y}%`,
          scale: isPlaying ? [1, 1.5, 1] : 1,
          opacity: isPlaying ? 0.5 : 1
        }}
        className="absolute text-6xl"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        {currentCreature}
      </motion.div>
    </div>
  );
}

/* ---------- MAIN GAMES HUB ---------- */
export default function GamesPage() {
  const { lang } = useSession();
  const [activeGame, setActiveGame] = useState<Game | 'saveSea'>('menu');

  const games = [
    {
      id: 'saveSea' as const,
      emoji: '🌊',
      title: lang === 'ta' ? 'கடல் உயிரினங்களைக் காப்போம்!' : 'Save Sea Creatures!',
      desc: lang === 'ta' ? 'ஒலியைக் கேட்டு உயிரினங்களை மீட்கவும்' : 'Listen for sounds and rescue the animals',
      difficulty: '🐟',
      color: 'from-cyan-400 to-blue-600',
    },
    {
      id: 'whatSound' as Game,
      emoji: '❓',
      title: lang === 'ta' ? 'இந்த ஒலி என்ன?' : 'What Sound Is This?',
      desc: lang === 'ta' ? '4 படங்களில் சரியான ஒலியை தேர்ந்தெடு' : 'Pick the right picture for each sound',
      difficulty: '🐟🐟',
      color: 'from-blue-400 to-indigo-600',
    },
    {
      id: 'highLow' as Game,
      emoji: '📻',
      title: lang === 'ta' ? 'உயர்வா? தாழ்வா?' : 'High or Low?',
      desc: lang === 'ta' ? 'ஒலி உயர்வா தாழ்வா என்று சொல்' : 'Is the sound high or low pitch?',
      difficulty: '🐟',
      color: 'from-teal-400 to-emerald-600',
    },
  ];

  if (activeGame === 'saveSea') return (
    <PageWrapper title="Save Sea Creatures" owlState="excited" backTo="/games">
      <SaveSeaCreaturesGame lang={lang} onBack={() => setActiveGame('menu')} />
    </PageWrapper>
  );

  if (activeGame === 'whatSound') return (
    <PageWrapper title={lang === 'ta' ? 'இந்த ஒலி என்ன?' : 'What Sound Is This?'} owlState="excited" backTo="/games">
      <WhatSoundGame lang={lang} onBack={() => setActiveGame('menu')} />
    </PageWrapper>
  );

  if (activeGame === 'highLow') return (
    <PageWrapper title={lang === 'ta' ? 'உயர்வா? தாழ்வா?' : 'High or Low?'} owlState="cheering" backTo="/games">
      <HighLowGame lang={lang} onBack={() => setActiveGame('menu')} />
    </PageWrapper>
  );

  return (
    <PageWrapper
      title={lang === 'ta' ? '🎮 கேளுங்கள் விளையாடுங்கள்!' : '🎮 Fun Hearing Games!'}
      subtitle={lang === 'ta' ? 'KG – வகுப்பு 2' : 'Underwater Sound Adventure'}
      owlState="cheering"
      owlSpeech={lang === 'ta' ? 'விளையாட ஆரம்பிக்கலாம்! 🎮' : "Let's play and learn! 🎮"}
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-blue-900 font-black mb-12 text-2xl tracking-tight"
        >
          {lang === 'ta' ? 'விளையாட்டை தேர்ந்தெடு!' : 'Choose Your Adventure!'}
        </motion.p>
        <div className="grid md:grid-cols-1 gap-6">
          {games.map((g, i) => (
            <motion.button 
              key={g.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveGame(g.id)}
              className={`w-full p-8 rounded-[3rem] bg-gradient-to-r ${g.color} text-white text-left shadow-2xl hover:scale-[1.02] transition-all active:scale-95 border-4 border-white/40 group`}
            >
              <div className="flex items-center gap-8">
                <div className="text-7xl group-hover:scale-110 transition-transform duration-500">{g.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-black mb-2 tracking-tight" style={{ fontFamily: 'Fredoka, sans-serif' }}>{g.title}</h3>
                  <p className="text-white/80 text-lg font-bold mb-4">{g.desc}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-white/20 rounded-full px-4 py-1.5 font-black uppercase tracking-widest">
                      {lang === 'ta' ? 'கஷ்டம்:' : 'Level:'} {g.difficulty}
                    </span>
                    <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: g.id === 'saveSea' ? '30%' : g.id === 'whatSound' ? '60%' : '40%' }}
                         className="h-full bg-white"
                       />
                    </div>
                  </div>
                </div>
                <div className="text-4xl opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">→</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
