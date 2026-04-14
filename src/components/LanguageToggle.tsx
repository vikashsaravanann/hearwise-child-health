import { useSession } from '@/contexts/SessionContext';

export default function LanguageToggle() {
  const { lang, setLang } = useSession();
  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
      <button
        onClick={() => setLang('en')}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${lang === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('ta')}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${lang === 'ta' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
      >
        தமிழ்
      </button>
    </div>
  );
}
