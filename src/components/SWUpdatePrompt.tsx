import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, RotateCcw, Wifi } from 'lucide-react';
import { toast } from 'sonner';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function SWUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
    offlineReady: [offlineReady, setOfflineReady],
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW registered:', r);
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  const handleRefresh = () => updateServiceWorker(true);
  const handleDismiss = () => setNeedRefresh(false);

  // Show a toast when the app is ready to work offline
  const hasShownOfflineToast = useRef(false);
  useEffect(() => {
    if (offlineReady && !hasShownOfflineToast.current) {
      hasShownOfflineToast.current = true;
      // Use a brief delay to let the app settle before showing the toast
      const timer = setTimeout(() => {
        toast.success('Ready to work offline!', {
          description: 'HearWise is now cached and available without internet.',
          duration: 4000,
          icon: <Wifi className="h-4 w-4 text-emerald-400" />,
        });
        setOfflineReady(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [offlineReady, setOfflineReady]);

  // Listen for simulated update events from PWADevPreview (dev mode only)
  useEffect(() => {
    const handler = () => setNeedRefresh(true);
    window.addEventListener('sw:simulate-update', handler);
    return () => window.removeEventListener('sw:simulate-update', handler);
  }, [setNeedRefresh]);

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[99] w-[calc(100%-2rem)] max-w-sm"
        >
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-[#0a1f14] shadow-2xl shadow-emerald-900/30">
            {/* Glow orbs */}
            <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-teal-500/10 blur-xl" />

            {/* Shimmer line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

            <div className="relative p-4">
              <div className="flex items-start gap-3.5">
                {/* Animated spinning update icon */}
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20"
                >
                  <RefreshCw className="h-5 w-5 text-emerald-400" />
                </motion.div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <h4 className="text-sm font-bold text-white leading-tight">Update available</h4>
                  <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">
                    A new version is ready. Refresh to get the latest features.
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  className="flex-1 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.97] flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="h-4 w-4" />
                  Refresh
                </button>
                <button
                  onClick={handleDismiss}
                  className="h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-semibold text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-[0.97] whitespace-nowrap"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
