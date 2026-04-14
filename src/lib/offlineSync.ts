const PENDING_RESULTS_KEY = 'hearwise_pending_results';
const LOCAL_ENTITIES_KEY = 'hearwise_local_entities';
const LOCAL_ID_MAP_KEY = 'hearwise_local_id_map';
const SYNC_QUEUE_EVENT = 'hearwise-sync-queue-updated';

type LocalIdPrefix = 'local_school_' | 'local_teacher_' | 'local_session_' | 'local_student_';

interface LocalSchool {
  localId: string;
  name: string;
  district: string;
  createdAt: string;
}

interface LocalTeacher {
  localId: string;
  schoolLocalId: string;
  name: string;
  createdAt: string;
}

interface LocalSession {
  localId: string;
  schoolLocalId: string;
  teacherLocalId: string;
  createdAt: string;
  deviceInfo: string;
}

interface LocalStudent {
  localId: string;
  schoolLocalId: string;
  name: string;
  age: number;
  gender: string;
  rollNumber?: string;
  createdAt: string;
}

interface LocalEntitiesStore {
  schools: Record<string, LocalSchool>;
  teachers: Record<string, LocalTeacher>;
  sessions: Record<string, LocalSession>;
  students: Record<string, LocalStudent>;
}

interface LocalIdMapStore {
  schools: Record<string, string>;
  teachers: Record<string, string>;
  sessions: Record<string, string>;
  students: Record<string, string>;
}

export interface PendingResultItem {
  localId: string;
  sessionLocalId: string;
  studentLocalId: string;
  result: Record<string, unknown>;
  timestamp: number;
  synced: boolean;
}

function createUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

export function generateLocalId(prefix: LocalIdPrefix): string {
  return `${prefix}${createUuid()}`;
}

function emitQueueUpdated() {
  window.dispatchEvent(new Event(SYNC_QUEUE_EVENT));
}

function getLocalEntitiesStore(): LocalEntitiesStore {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_ENTITIES_KEY) || '{}') as Partial<LocalEntitiesStore>;
    return {
      schools: parsed.schools || {},
      teachers: parsed.teachers || {},
      sessions: parsed.sessions || {},
      students: parsed.students || {},
    };
  } catch {
    return { schools: {}, teachers: {}, sessions: {}, students: {} };
  }
}

function setLocalEntitiesStore(store: LocalEntitiesStore) {
  localStorage.setItem(LOCAL_ENTITIES_KEY, JSON.stringify(store));
}

function getIdMapStore(): LocalIdMapStore {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_ID_MAP_KEY) || '{}') as Partial<LocalIdMapStore>;
    return {
      schools: parsed.schools || {},
      teachers: parsed.teachers || {},
      sessions: parsed.sessions || {},
      students: parsed.students || {},
    };
  } catch {
    return { schools: {}, teachers: {}, sessions: {}, students: {} };
  }
}

function setIdMapStore(store: LocalIdMapStore) {
  localStorage.setItem(LOCAL_ID_MAP_KEY, JSON.stringify(store));
}

export function createLocalSchool(name: string, district: string): string {
  const localId = generateLocalId('local_school_');
  const store = getLocalEntitiesStore();
  store.schools[localId] = { localId, name, district, createdAt: new Date().toISOString() };
  setLocalEntitiesStore(store);
  return localId;
}

export function createLocalTeacher(name: string, schoolLocalId: string): string {
  const localId = generateLocalId('local_teacher_');
  const store = getLocalEntitiesStore();
  store.teachers[localId] = { localId, name, schoolLocalId, createdAt: new Date().toISOString() };
  setLocalEntitiesStore(store);
  return localId;
}

export function createLocalSession(teacherLocalId: string, schoolLocalId: string): string {
  const localId = generateLocalId('local_session_');
  const store = getLocalEntitiesStore();
  store.sessions[localId] = {
    localId,
    teacherLocalId,
    schoolLocalId,
    createdAt: new Date().toISOString(),
    deviceInfo: navigator.userAgent,
  };
  setLocalEntitiesStore(store);
  return localId;
}

export function createLocalStudent(
  name: string,
  age: number,
  gender: string,
  schoolLocalId: string,
  rollNumber?: string
): string {
  const localId = generateLocalId('local_student_');
  const store = getLocalEntitiesStore();
  store.students[localId] = {
    localId,
    schoolLocalId,
    name,
    age,
    gender,
    rollNumber,
    createdAt: new Date().toISOString(),
  };
  setLocalEntitiesStore(store);
  return localId;
}

export function getLocalSchool(localId: string) {
  return getLocalEntitiesStore().schools[localId];
}

export function getLocalTeacher(localId: string) {
  return getLocalEntitiesStore().teachers[localId];
}

export function getLocalSession(localId: string) {
  return getLocalEntitiesStore().sessions[localId];
}

export function getLocalStudent(localId: string) {
  return getLocalEntitiesStore().students[localId];
}

export function setServerId(
  table: keyof LocalIdMapStore,
  localId: string,
  serverId: string
) {
  const store = getIdMapStore();
  store[table][localId] = serverId;
  setIdMapStore(store);
}

export function getServerId(table: keyof LocalIdMapStore, localId: string): string | undefined {
  return getIdMapStore()[table][localId];
}

export function getPendingResults(): PendingResultItem[] {
  try {
    return JSON.parse(localStorage.getItem(PENDING_RESULTS_KEY) || '[]') as PendingResultItem[];
  } catch {
    return [];
  }
}

export function setPendingResults(queue: PendingResultItem[]) {
  localStorage.setItem(PENDING_RESULTS_KEY, JSON.stringify(queue));
  emitQueueUpdated();
}

export function enqueuePendingResult(item: Omit<PendingResultItem, 'synced'>) {
  const queue = getPendingResults();
  queue.push({ ...item, synced: false });
  setPendingResults(queue);
}

export function getPendingResultCount(): number {
  return getPendingResults().filter((item) => !item.synced).length;
}

export function getSyncQueueEventName(): string {
  return SYNC_QUEUE_EVENT;
}

export function isOnline(): boolean {
  return navigator.onLine;
}
