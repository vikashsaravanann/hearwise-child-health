import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Language, getLanguage, setLanguage as setLangStorage } from '@/lib/i18n';
import { syncOfflineQueue } from '@/lib/database';

interface SessionData {
  schoolName: string;
  teacherName: string;
  classGrade: string;
  district: string;
  schoolId?: string;
  teacherId?: string;
  sessionId?: string;
}

interface StudentData {
  name: string;
  age: number;
  gender: string;
  rollNumber?: string;
  studentId?: string;
}

interface SessionContextType {
  lang: Language;
  setLang: (l: Language) => void;
  session: SessionData | null;
  setSession: (s: SessionData | null) => void;
  student: StudentData | null;
  setStudent: (s: StudentData | null) => void;
  testedStudents: any[];
  addTestedStudent: (result: any) => void;
  clearTestedStudents: () => void;
  online: boolean;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getLanguage());
  const [session, setSession] = useState<SessionData | null>(null);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [testedStudents, setTestedStudents] = useState<any[]>([]);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => {
      setOnline(true);
      // Auto-sync when back online
      syncOfflineQueue().catch(console.error);
    };
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);

    // Try sync on mount
    if (navigator.onLine) syncOfflineQueue().catch(console.error);

    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    setLangStorage(l);
  };

  const addTestedStudent = (result: any) => {
    setTestedStudents(prev => [...prev, result]);
  };

  const clearTestedStudents = () => setTestedStudents([]);

  return (
    <SessionContext.Provider value={{ lang, setLang, session, setSession, student, setStudent, testedStudents, addTestedStudent, clearTestedStudents, online }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
