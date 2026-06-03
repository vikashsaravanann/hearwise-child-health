import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, RefreshCw, Wifi, Bug, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

/**
 * Dev-only toolbar to manually trigger PWA prompts for testing.
 * Only renders when import.meta.env.DEV is true.
 */
export default function PWADevPreview() {
  const [showToolbar, setShowToolbar] = useState(false);

  if (!import.meta.env.DEV) return null;

  const handleShowInstallPrompt = () => {
    // Dispatch a synthetic beforeinstallprompt event so the PWAInstallPrompt picks it up
    const event = new Event('beforeinstallprompt');
    // Override prompt and userChoice to simulate the native dialog
    (event as any).prompt = async () => {};
    (event as any).userChoice = Promise.resolve({ outcome: 'accepted' });
    window.dispatchEvent(event);
    toast('Install prompt triggered (simulated)', {
      description: 'The PWAInstallPrompt component should now appear',
      duration: 3000,
    });
  };

  const handleShowUpdatePrompt = () => {
    // Dispatch a custom event that our SWUpdatePrompt can listen for
    window.dispatchEvent(new CustomEvent('sw:simulate-update'));
    toast('Update prompt triggered (simulated)', {
      description: 'The SW update banner should appear momentarily',
      duration: 3000,
    });
  };

  const handleShowOfflineToast = () => {
    toast.success('Ready to work offline!', {
      description: 'HearWise is now cached and available without internet.',
      duration: 4000,
      icon: <Wifi className="h-4 w-4 text-emerald-400" />,
    });
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setShowToolbar(!showToolbar)}
        className="fixed left-4 top-4 z-[200] rounded-full bg-amber-500/90 p-2.5 text-white shadow-2xl shadow-amber-900/50 hover:bg-amber-400 transition-all active:scale-90"
        title="PWA Dev Tools"
      >
        <Bug size={18} />
      </button>

      <AnimatePresence>
        {showToolbar && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            className="fixed left-4 top-20 z-[200] w-56 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 to-[#0d2137] shadow-2xl shadow-amber-900/20 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-amber-500/10 border-b border-amber-500/20">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                PWA Dev Tools
              </span>
              <button
                onClick={() => setShowToolbar(false)}
                className="rounded-full bg-white/5 p-1 text-white/40 hover:bg-white/10 hover:text-white/70 transition-all"
              >
                <X size={12} />
              </button>
            </div>

            {/* Actions */}
            <div className="p-3 space-y-2">
              <Button
                onClick={handleShowInstallPrompt}
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 border-teal-500/30 text-teal-300 hover:bg-teal-500/10 hover:text-teal-200 text-xs font-bold"
              >
                <Smartphone size={14} />
                Show Install Prompt
              </Button>

              <Button
                onClick={handleShowUpdatePrompt}
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200 text-xs font-bold"
              >
                <RefreshCw size={14} />
                Show Update Prompt
              </Button>

              <Button
                onClick={handleShowOfflineToast}
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:text-blue-200 text-xs font-bold"
              >
                <Wifi size={14} />
                Show Offline Toast
              </Button>

              <div className="pt-2 border-t border-white/5">
                <p className="text-[10px] text-slate-500 text-center">
                  Dev only · <span className="text-green-400">active</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
