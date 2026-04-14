import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Language, getLanguage, setLanguage as setLangStorage } from '@/lib/i18n';
import { syncPendingResults } from '@/lib/database';
import { getPendingResultCount, getSyncQueueEventName } from '@/lib/offlineSync';
import { toast } from '@/hooks/use-toast';

interface SessionData {
  schoolName: string;
  teacherName: string;
  classGrade: string;
  district: string;
  schoolLocalId: string;
  teacherLocalId: string;
  sessionLocalId: string;
  schoolId?: string;
  teacherId?: string;
  sessionId?: string;
}

interface StudentData {
  name: string;
  age: number;
  gender: string;
  studentLocalId: string;
  schoolLocalId: string;
  rollNumber?: string;
  studentId?: string;
}

interface TestedStudentResult {
  overall: 'normal' | 'mild' | 'refer';
}

interface TestedStudent {
  student: StudentData | null;
  results: TestedStudentResult;
  timestamp: string;
}

export interface ScreeningReadiness {
  headphoneChecklistComplete: boolean;
  sampleTonePlayed: boolean;
  practicePassed: boolean;
}

interface SessionContextType {
  lang: Language;
  setLang: (l: Language) => void;
  session: SessionData | null;
  setSession: (s: SessionData | null) => void;
  student: StudentData | null;
  setStudent: (s: StudentData | null) => void;
  testedStudents: TestedStudent[];
  addTestedStudent: (result: TestedStudent) => void;
  clearTestedStudents: () => void;
  readiness: ScreeningReadiness;
  setReadiness: React.Dispatch<React.SetStateAction<ScreeningReadiness>>;
  resetReadiness: () => void;
  online: boolean;
  pendingResultsCount: number;
  syncState: 'offline' | 'pending' | 'synced';
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getLanguage());
  const [session, setSession] = useState<SessionData | null>(null);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [testedStudents, setTestedStudents] = useState<TestedStudent[]>([]);
  const [readiness, setReadiness] = useState<ScreeningReadiness>({
    headphoneChecklistComplete: false,
    sampleTonePlayed: false,
    practicePassed: false,
  });
  const [online, setOnline] = useState(navigator.onLine);
  const [pendingResultsCount, setPendingResultsCount] = useState(getPendingResultCount());

  useEffect(() => {
    const queueEvent = getSyncQueueEventName();
    const refreshPendingCount = () => setPendingResultsCount(getPendingResultCount());

    const on = async () => {
      setOnline(true);
      refreshPendingCount();
      try {
        const { synced } = await syncPendingResults();
        refreshPendingCount();
        if (synced > 0) {
          toast({ title: `${synced} results synced` });
        }
      } catch (error) {
        console.error(error);
      }
    };
    const off = () => {
      setOnline(false);
      refreshPendingCount();
    };
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    window.addEventListener(queueEvent, refreshPendingCount);

    // Run sync pass on every app load.
    syncPendingResults()
      .then(({ synced }) => {
        refreshPendingCount();
        if (synced > 0) {
          toast({ title: `${synced} results synced` });
        }
      })
      .catch(() => refreshPendingCount());

    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
      window.removeEventListener(queueEvent, refreshPendingCount);
    };
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    setLangStorage(l);
  };

  const addTestedStudent = (result: TestedStudent) => {
    setTestedStudents(prev => [...prev, result]);
  };

  const clearTestedStudents = () => setTestedStudents([]);
  const resetReadiness = () => {
    setReadiness({
      headphoneChecklistComplete: false,
      sampleTonePlayed: false,
      practicePassed: false,
    });
  };
  const syncState: 'offline' | 'pending' | 'synced' = !online ? 'offline' : pendingResultsCount > 0 ? 'pending' : 'synced';

  return (
    <SessionContext.Provider
      value={{
        lang,
        setLang,
        session,
        setSession,
        student,
        setStudent,
        testedStudents,
        addTestedStudent,
        clearTestedStudents,
        readiness,
        setReadiness,
        resetReadiness,
        online,
        pendingResultsCount,
        syncState,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
