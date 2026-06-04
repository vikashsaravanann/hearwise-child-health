import { useSession } from '@/contexts/SessionContext';

export default function LanguageToggle() {
  const { lang, setLang } = useSession();
  
  const handleToggle = () => {
    if (lang === 'en') setLang('ta');
    else if (lang === 'ta') setLang('hi');
    else setLang('en');
  };

  return (
    <div className="fixed bottom-4 left-4 z-[100] flex items-center gap-1 rounded-full border border-white/20 bg-black/60 backdrop-blur-md p-1 shadow-xl">
      <button
        onClick={() => setLang('en')}
        className={`rounded-full px-3 py-1 font-bold transition-all uppercase tracking-widest text-xs ${lang === 'en' ? 'bg-cyan-500 text-[#000b1d] shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('ta')}
        className={`rounded-full px-3 py-1 font-bold transition-all uppercase tracking-widest text-xs ${lang === 'ta' ? 'bg-cyan-500 text-[#000b1d] shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
      >
        தமிழ்
      </button>
      <button
        onClick={() => setLang('hi')}
        className={`rounded-full px-3 py-1 font-bold transition-all uppercase tracking-widest text-xs ${lang === 'hi' ? 'bg-cyan-500 text-[#000b1d] shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
      >
        हिंदी
      </button>
    </div>
  );
}

