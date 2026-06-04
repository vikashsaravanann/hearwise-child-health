import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGS = [
  { code: 'EN', label: 'EN', full: 'ENGLISH' },
  { code: 'TA', label: 'தமிழ்', full: 'TAMIL' },
  { code: 'HI', label: 'हिंदी', full: 'HINDI' },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('EN');

  return (
    <div
      className="fixed bottom-6 left-4 sm:left-6 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-2 flex flex-col gap-1.5"
          >
            {LANGS.filter(l => l.code !== current).map((lang, i) => (
              <motion.button
                key={lang.code}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => {
                  setCurrent(lang.code);
                  setOpen(false);
                  // Dispatch custom event for app-wide language change
                  window.dispatchEvent(new CustomEvent('hearwise-lang-change', { detail: lang.code }));
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#0a0a0a] border border-white/15 text-white text-xs font-bold uppercase tracking-widest hover:border-teal-500/50 hover:bg-teal-500/10 transition-all shadow-lg backdrop-blur-sm whitespace-nowrap"
              >
                <span className="text-sm">{lang.label}</span>
                <span className="text-slate-500 text-[9px]">{lang.full}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main language button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#0a0a0a] border border-white/15 shadow-xl shadow-black/40 backdrop-blur-sm hover:border-teal-500/40 transition-all group"
      >
        {/* Globe icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-teal-400 flex-shrink-0">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 2C12 2 8 7 8 12C8 17 12 22 12 22" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 2C12 2 16 7 16 12C16 17 12 22 12 22" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M2 12H22" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M3.5 7H20.5M3.5 17H20.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <span className="text-white font-black text-xs uppercase tracking-widest">
          {LANGS.find(l => l.code === current)?.label}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="text-slate-500 text-[10px]"
        >
          ▲
        </motion.span>
      </motion.button>
    </div>
  );
}
