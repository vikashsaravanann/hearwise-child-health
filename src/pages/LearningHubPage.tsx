import BackButton from '../components/BackButton';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Volume2, Sparkles, Music, Star } from 'lucide-react';
import owlMascot from '@/assets/owl-mascot.png';
import confetti from 'canvas-confetti';

export default function LearningHubPage() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [activeGame, setActiveGame] = useState<'none' | 'soundMatch'>('none');
  const [soundMatchState, setSoundMatchState] = useState<'idle' | 'playing' | 'won'>('idle');

  const playFunSound = () => {
    // In a real app we would play an audio file, here we'll just simulate with an animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFC107', '#ec4899', '#3b82f6', '#10b981']
    });
    setScore(s => s + 10);
  };

  const startSoundMatch = () => {
    setActiveGame('soundMatch');
    setSoundMatchState('playing');
  };

  const winGame = () => {
    setSoundMatchState('won');
    setScore(s => s + 50);
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#6366f1', '#a855f7', '#ec4899']
    });
  };

  return (
    <div className="pt-20 min-h-screen bg-[#f8fafc] overflow-x-hidden font-sans selection:bg-purple-300 relative">
      <BackButton />
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/50 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/50 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-pink-200/50 blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <div className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-purple-100 shadow-sm px-4 py-4 flex items-center justify-between">
        <Button variant="ghost" className="rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-5 w-5" /> Back Home
        </Button>
        <div className="flex items-center gap-3 bg-yellow-100 px-4 py-2 rounded-full border-2 border-yellow-300 shadow-sm">
          <Star className="text-yellow-500 fill-yellow-500 w-5 h-5 animate-bounce" />
          <span className="font-black text-yellow-700 text-lg">{score} Points</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:p-8 mb-16 animate-in slide-in-from-bottom-10 duration-1000">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <img loading="eager" src={owlMascot} alt="HearWise Mascot" className="w-48 h-48 md:w-64 md:h-64 object-contain relative z-10 hover:scale-110 transition-transform cursor-pointer drop-shadow-2xl" onClick={playFunSound} />
          </div>
          <div className="text-center md:text-left space-y-4 max-w-md">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
              <Sparkles size={16} /> Welcome to the Fun Zone!
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-700 to-pink-600 leading-tight">
              Learning Hub
            </h1>
            <p className="text-xl text-slate-600 font-medium">
              Tap the owl, play games, and discover the amazing world of sounds!
            </p>
          </div>
        </div>

        {/* Games Section */}
        <div className="w-full space-y-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 text-center mb-8">🎮 Choose a Game</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 gap-5 sm:p-6 w-full">
            
            {/* Game Card 1 */}
            <Card className="rounded-[2rem] border-4 border-blue-200 bg-white overflow-hidden shadow-xl hover:shadow-2xl hover:border-blue-400 hover:-translate-y-2 transition-all duration-300 group">
              <div className="h-32 bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <Music className="w-16 h-16 text-white animate-bounce" />
              </div>
              <CardContent className="p-5 sm:p-6 text-center space-y-4">
                <h3 className="text-2xl font-bold text-slate-800">Sound Match</h3>
                <p className="text-slate-500 font-medium">Listen carefully! Can you find the matching sound?</p>
                <Button 
                  className="w-full h-14 rounded-2xl text-lg font-bold bg-blue-500 hover:bg-blue-600 shadow-[0_4px_0_rgb(37,99,235)] active:shadow-[0_0px_0_rgb(37,99,235)] active:translate-y-1 transition-all"
                  onClick={startSoundMatch}
                >
                  Play Now
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Active Game Area (Sound Match) */}
        {activeGame === 'soundMatch' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] p-6 sm:p-8 shadow-2xl relative flex flex-col items-center animate-in zoom-in-95 duration-500">
              <Button variant="ghost" className="absolute top-5 sm:p-6 left-6 rounded-full bg-slate-100 hover:bg-slate-200 w-12 h-12 p-0" onClick={() => setActiveGame('none')}>
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </Button>
              
              <h2 className="text-3xl sm:text-4xl font-black text-center text-blue-600 mb-2 mt-4">Sound Match!</h2>
              <p className="text-lg text-slate-500 mb-8 font-medium text-center">Tap the cards to find the matching pairs.</p>

              {soundMatchState === 'playing' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-4 mb-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        if (i === 6) winGame(); // Just a simple mock win condition
                      }}
                      className="aspect-square bg-gradient-to-br from-indigo-100 to-blue-100 rounded-3xl border-4 border-blue-200 flex items-center justify-center cursor-pointer hover:scale-105 hover:border-blue-400 transition-all shadow-md active:scale-95"
                    >
                      <Music className="w-12 h-12 text-blue-400" />
                    </div>
                  ))}
                </div>
              )}

              {soundMatchState === 'won' && (
                <div className="flex flex-col items-center justify-center py-10 space-y-6">
                  <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.6)] animate-bounce">
                    <Star className="w-20 h-20 text-yellow-500 fill-yellow-500" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black text-green-500">You Won!</h3>
                  <p className="text-xl text-slate-600 font-bold">+50 Points</p>
                  <Button 
                    className="h-14 px-10 rounded-2xl text-xl font-bold bg-green-500 hover:bg-green-600 shadow-[0_4px_0_rgb(22,163,74)] active:translate-y-1 active:shadow-[0_0px_0_rgb(22,163,74)] transition-all"
                    onClick={() => { setActiveGame('none'); setSoundMatchState('idle'); }}
                  >
                    Play Again
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}