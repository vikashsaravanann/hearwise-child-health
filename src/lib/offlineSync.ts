const QUEUE_KEY = 'hearwise-offline-queue';

interface QueueItem {
  id: string;
  table: string;
  data: any;
  timestamp: number;
}

export function addToQueue(table: string, data: any) {
  const queue = getQueue();
  queue.push({ id: crypto.randomUUID(), table, data, timestamp: Date.now() });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function getQueue(): QueueItem[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearQueue() {
  localStorage.setItem(QUEUE_KEY, '[]');
}

export function isOnline(): boolean {
  return navigator.onLine;
}
