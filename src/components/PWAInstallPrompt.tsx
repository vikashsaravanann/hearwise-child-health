import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    // Show after a short delay even if beforeinstallprompt hasn't fired yet
    // (some browsers don't fire the event but still support PWA install)
    const fallbackTimer = setTimeout(() => {
      if (!showPrompt && !dismissed) {
        setShowPrompt(true);
      }
    }, 4000);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(fallbackTimer);
    };
  }, [showPrompt, dismissed]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    setDismissed(true);
  }, []);

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          role="alert"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm"
        >
          <div className="relative overflow-hidden rounded-2xl border border-teal-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-[#0d2137] shadow-2xl shadow-teal-900/30">
            {/* Glow orbs */}
            <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-teal-500/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-cyan-500/10 blur-xl" />

            {/* Shimmer line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />

            <div className="relative p-4">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute right-2 top-2 rounded-full bg-white/5 p-1.5 text-white/40 hover:bg-white/10 hover:text-white/70 transition-all"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>

              <div className="flex items-start gap-3.5">
                {/* Icon */}
                <motion.div
                  animate={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
                  className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border border-teal-500/20"
                >
                  <Waves className="h-5 w-5 text-teal-400" />
                  {/* Tiny pulse ring */}
                  <span className="absolute inset-0 rounded-xl border border-teal-400/20 animate-ping opacity-40" />
                </motion.div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <h4 className="text-sm font-bold text-white leading-tight">Install HearWise</h4>
                  <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">
                    Get the app offline, just like a native app
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button
                  onClick={handleInstall}
                  className="flex-1 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-teal-600/20 transition-all active:scale-[0.97]"
                >
                  <Smartphone className="mr-1.5 h-4 w-4" />
                  Install
                </Button>
                <button
                  onClick={handleDismiss}
                  className="h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-semibold text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-[0.97] whitespace-nowrap"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
