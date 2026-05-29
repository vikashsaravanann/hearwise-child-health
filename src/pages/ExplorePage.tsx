import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseHealth } from '@/hooks/useSupabaseHealth';
import { 
  Headphones, Play, CheckSquare, Gamepad2, Trophy, 
  BookOpen, Music, HeartPulse, HelpCircle, 
  Info, LayoutDashboard, FileText, BarChart, Calendar, Target,
  Volume2
} from 'lucide-react';
import mascot from '@/assets/owl-mascot.png';
import ChatAssistanceModal from '@/components/ChatAssistanceModal';

// Custom hook for scroll reveal
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return { ref, isVisible };
}

const GROUPS = [
  {
    title: '🎧 Hearing Test',
    color: '#0d9488',
    items: [
      { name: 'Start Session', path: '/setup', desc: 'Begin a new test', icon: Headphones, bg: '#E0FFF4', border: 'rgba(13, 148, 136, 0.3)' },
      { name: 'Student Entry', path: '/student-entry', desc: 'Enter student details', icon: FileText, bg: '#E8FFE8', border: 'rgba(34, 197, 94, 0.3)' },
      { name: 'Headphone Check', path: '/headphone-check', desc: 'Check volume levels', icon: Volume2, bg: '#E0F4FF', border: 'rgba(2, 132, 199, 0.3)' },
      { name: 'Practice Round', path: '/practice', desc: 'Try it out first', icon: Play, bg: '#FFF4E0', border: 'rgba(217, 119, 6, 0.3)' },
      { name: 'Take the Test', path: '/active-test', desc: 'Start the ocean journey', icon: Target, bg: '#F4E0FF', border: 'rgba(147, 51, 234, 0.3)' },
      { name: 'My Results', path: '/results', desc: 'View hearing results', icon: CheckSquare, bg: '#FFE0E8', border: 'rgba(225, 29, 72, 0.3)' },
      { name: 'Session Summary', path: '/session-summary', desc: 'Overview of tests', icon: BarChart, bg: '#FFFDE0', border: 'rgba(202, 138, 4, 0.3)' },
    ]
  },
  {
    title: '🏠 Home',
    color: '#2563eb',
    items: [
      { name: 'Home', path: '/', desc: 'Main landing page', icon: mascot, bg: '#E0F4FF', border: 'rgba(37, 99, 235, 0.3)' },
      { name: 'Dashboard', path: '/dashboard', desc: 'Your progress', icon: LayoutDashboard, bg: '#E8FFE8', border: 'rgba(34, 197, 94, 0.3)' },
      { name: 'My Report', path: '/my-report', desc: 'Detailed report card', icon: FileText, bg: '#FFF4E0', border: 'rgba(217, 119, 6, 0.3)' },
      { name: 'Leaderboard', path: '/leaderboard', desc: 'See top scores', icon: Trophy, bg: '#F4E0FF', border: 'rgba(147, 51, 234, 0.3)' },
      { name: 'Trophies', path: '/trophies', desc: 'Your achievements', icon: Trophy, bg: '#FFE0E8', border: 'rgba(225, 29, 72, 0.3)' },
    ]
  },
  {
    title: '📚 Learn & Explore',
    color: '#9333ea',
    items: [
      { name: 'Learn', path: '/learn', desc: 'Hearing basics', icon: BookOpen, bg: '#F4E0FF', border: 'rgba(147, 51, 234, 0.3)' },
      { name: 'Education', path: '/education', desc: 'School resources', icon: BookOpen, bg: '#E0F4FF', border: 'rgba(2, 132, 199, 0.3)' },
      { name: 'Sound Explorer', path: '/sound-explorer', desc: 'Discover sounds', icon: Music, bg: '#E8FFE8', border: 'rgba(34, 197, 94, 0.3)' },
      { name: 'Ear Care', path: '/ear-care', desc: 'Keep ears healthy', icon: HeartPulse, bg: '#FFF4E0', border: 'rgba(217, 119, 6, 0.3)' },
      { name: 'Headphone Safety', path: '/headphone-safety', desc: 'Safe listening', icon: Headphones, bg: '#FFE0E8', border: 'rgba(225, 29, 72, 0.3)' },
      { name: 'Noise Awareness', path: '/noise-awareness', desc: 'Protect from noise', icon: Volume2, bg: '#FFFDE0', border: 'rgba(202, 138, 4, 0.3)' },
    ]
  },
  {
    title: '🎮 Fun Zone',
    color: '#16a34a',
    items: [
      { name: 'Games', path: '/games', desc: 'Play and learn', icon: Gamepad2, bg: '#E8FFE8', border: 'rgba(22, 163, 74, 0.3)' },
      { name: 'Self Check', path: '/self-check', desc: 'Quick hearing check', icon: CheckSquare, bg: '#E0F4FF', border: 'rgba(2, 132, 199, 0.3)' },
    ]
  },
  {
    title: '📋 More',
    color: '#ea580c',
    items: [
      { name: 'Book Appointment', path: '/book-appointment', desc: 'See a doctor', icon: Calendar, bg: '#FFF4E0', border: 'rgba(234, 88, 12, 0.3)' },
      { name: 'Help', path: '#chat', desc: 'Ask Ollie for help', icon: HelpCircle, bg: '#E0F4FF', border: 'rgba(2, 132, 199, 0.3)' },
      { name: 'About', path: '/about', desc: 'About HearWise', icon: Info, bg: '#F4E0FF', border: 'rgba(147, 51, 234, 0.3)' },
    ]
  }
];

function Section({ group, index, onOpenChat }: { group: typeof GROUPS[0], index: number, onOpenChat?: () => void }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`mb-12 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <h2 
        className="text-xl font-bold mb-4 flex items-center gap-2"
        style={{ color: group.color }}
      >
        {group.title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {group.items.map((item, i) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={(e) => {
              if (item.path === '#chat') {
                e.preventDefault();
                onOpenChat?.();
              }
            }}
            className={`
              flex flex-col items-center justify-center text-center p-4 rounded-2xl
              transition-all duration-200 ease-in-out hover:scale-[1.04] hover:shadow-lg
              cursor-pointer backdrop-blur-sm min-h-[160px] relative overflow-hidden
            `}
            style={{
              backgroundColor: item.bg,
              border: `2px solid ${item.border}`,
              transitionDelay: isVisible ? `${i * 60}ms` : '0ms'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            
            <div className="mb-3 relative z-10">
              {typeof item.icon === 'string' ? (
                <img src={item.icon} alt="icon" className="w-12 h-12 object-contain" />
              ) : (
                <item.icon size={48} className="text-slate-700" strokeWidth={1.5} />
              )}
            </div>
            <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1 relative z-10">{item.name}</h3>
            <p className="text-slate-600 text-xs font-medium relative z-10">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const dbStatus = useSupabaseHealth();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#e0f7fa]">
      {/* Animated Ocean Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#e0f2fe] via-[#cffafe] to-white opacity-80" />
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, #bae6fd 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7dd3fc 0%, transparent 40%)',
            animation: 'waveMove 20s infinite alternate ease-in-out',
            backgroundSize: '200% 200%'
          }}
        />
      </div>

      <style>{`
        @keyframes waveMove {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-10 max-w-[1100px] mx-auto px-4 py-8 pb-24">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 pt-4">
          <div className="relative">
            <img src={mascot} alt="HearWise Mascot" className="w-20 h-20 object-contain drop-shadow-md mb-2 animate-[bounce_3s_infinite]" />
            
            {/* DB Status Badge */}
            <div className="absolute -bottom-1 -right-2 bg-white rounded-full px-2 py-0.5 shadow-sm border border-slate-100 flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                {dbStatus === 'connected' ? 'Live' : 'Connecting'}
              </span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-2">Explore HearWise</h1>
          <p className="text-slate-500 font-medium text-sm md:text-base">Tap any card to get started</p>
        </div>

        {/* Card Grid sections */}
        <div className="space-y-4">
          {GROUPS.map((group, idx) => (
            <Section key={group.title} group={group} index={idx} onOpenChat={() => setIsChatOpen(true)} />
          ))}
        </div>

      </div>
      
      <ChatAssistanceModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
