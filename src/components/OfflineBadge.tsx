import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';

export default function OfflineBadge() {
  const { syncState, pendingResultsCount, failedResultsCount, lang } = useSession();
  const isOffline = syncState === 'offline';
  const isPending = syncState === 'pending';
  const hasFailures = failedResultsCount > 0;
  const badgeText = isOffline
    ? t('offlineMode', lang)
    : hasFailures
      ? `${failedResultsCount} ${t('syncFailures', lang)}`
      : isPending
        ? `${pendingResultsCount} ${t('pendingSync', lang)}`
        : t('allSynced', lang);
  const dotClass = isOffline ? 'bg-destructive' : hasFailures ? 'bg-destructive' : isPending ? 'bg-warning' : 'bg-success';
  const badgeClass = isOffline || hasFailures
    ? 'bg-destructive/15 text-destructive'
    : isPending
      ? 'bg-warning/15 text-warning'
      : 'bg-success/15 text-success';

  return (
    <div className={`fixed right-2 top-2 z-50 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg ${badgeClass}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
      {badgeText}
    </div>
  );
}
