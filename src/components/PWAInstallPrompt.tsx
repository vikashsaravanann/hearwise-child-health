import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download, X } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('pwa_dismissed');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isDismissed || isStandalone) {
      return;
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa_dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-teal-900 border-t border-teal-500/30 p-4 shadow-2xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom">
      <div className="flex items-center gap-3 text-white">
        <span className="text-2xl">📱</span>
        <p className="text-sm md:text-base font-medium">Install HearWise on your phone — works offline!</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button onClick={handleInstall} className="bg-white text-teal-900 hover:bg-teal-50 font-bold whitespace-nowrap">
          <Download className="w-4 h-4 mr-2" />
          Install
        </Button>
        <Button variant="ghost" size="icon" onClick={handleDismiss} className="text-white hover:bg-teal-800">
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
