import { useSession } from '@/contexts/SessionContext';
import { Wifi, WifiOff } from 'lucide-react';

export default function OfflineBadge() {
  const { online } = useSession();
  if (online) return null;
  return (
    <div className="fixed top-2 right-2 z-50 flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground shadow-lg">
      <WifiOff size={14} />
      Offline
    </div>
  );
}
