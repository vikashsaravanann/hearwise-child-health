import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to notify the user they can add to home screen
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We no longer need the prompt. Clear it up.
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-teal-500/20 p-4 flex flex-col gap-3">
        <button 
          onClick={handleClose}
          className="absolute -top-2 -right-2 bg-slate-100 text-slate-500 hover:text-slate-700 rounded-full p-1 border border-slate-200 shadow-sm"
        >
          <X size={16} />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl shadow-inner">
            🌊
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-tight">Install HearWise</h4>
            <p className="text-xs text-slate-500 mt-0.5">Use it offline like a native app</p>
          </div>
        </div>
        
        <Button 
          onClick={handleInstallClick}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2"
        >
          <Download size={16} />
          Install App Now
        </Button>
      </div>
    </div>
  );
}
