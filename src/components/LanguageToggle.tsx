import { useSession } from '@/contexts/SessionContext';

export default function LanguageToggle() {
  const { lang, setLang } = useSession();
  return (
    <div className="fixed top-4 right-4 z-[100] flex items-center gap-1 rounded-full border border-white/20 bg-black/40 backdrop-blur-md p-1 shadow-lg">
      <button
        onClick={() => setLang('en')}
        className={`rounded-full px-3 py-1 text-sm font-bold transition-all ${lang === 'en' ? 'bg-cyan-500 text-[#000b1d] shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('ta')}
        className={`rounded-full px-3 py-1 text-sm font-bold transition-all ${lang === 'ta' ? 'bg-cyan-500 text-[#000b1d] shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
      >
        தமிழ்
      </button>
    </div>
  );
}
