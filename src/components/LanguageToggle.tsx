import { useSession } from '@/contexts/SessionContext';

export default function LanguageToggle() {
  const { lang, setLang } = useSession();
  return (
    <div className="flex items-center gap-1 rounded-full border border-border/70 bg-card/90 p-1 shadow-sm backdrop-blur-sm">
      <button
        onClick={() => setLang('en')}
        className={`rounded-full px-3 py-1 text-sm font-semibold transition-all ${lang === 'en' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('ta')}
        className={`rounded-full px-3 py-1 text-sm font-semibold transition-all ${lang === 'ta' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
      >
        தமிழ்
      </button>
    </div>
  );
}
