import { supabase } from '@/integrations/supabase/client';
import {
  createLocalSchool,
  createLocalSession,
  createLocalStudent,
  createLocalTeacher,
  enqueuePendingResult,
  type PendingResultItem,
  getLocalSchool,
  getLocalSession,
  getLocalStudent,
  getLocalTeacher,
  getPendingResults,
  getServerId,
  isOnline,
  setPendingResults,
  setServerId,
} from './offlineSync';
import type { TestResult } from './testEngine';

interface DateRangeResultRow {
  test_sessions?: {
    schools?: {
      district?: string;
    };
  };
}

interface ExportResultRow {
  students?: {
    name?: string;
    age?: number;
    gender?: string;
    roll_number?: string;
  };
  test_sessions?: {
    session_date?: string;
    schools?: { name?: string; district?: string };
    teachers?: { name?: string };
  };
  left_ear_500hz: boolean;
  left_ear_1000hz: boolean;
  left_ear_2000hz: boolean;
  left_ear_4000hz: boolean;
  right_ear_500hz: boolean;
  right_ear_1000hz: boolean;
  right_ear_2000hz: boolean;
  right_ear_4000hz: boolean;
  false_positive_count: number;
  overall_result: string;
}

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (!/[",\n\r]/.test(stringValue)) return stringValue;
  return `"${stringValue.replace(/"/g, '""')}"`;
}

export async function getOrCreateSchool(name: string, district: string): Promise<string> {
  const localId = createLocalSchool(name, district);
  if (!isOnline()) return localId;

  try {
    await ensureSchoolSynced(localId);
  } catch (error) {
    console.error('School sync failed:', error);
  }

  return localId;
}

export async function getOrCreateTeacher(name: string, schoolId: string): Promise<string> {
  const localId = createLocalTeacher(name, schoolId);
  if (!isOnline()) return localId;

  try {
    await ensureTeacherSynced(localId);
  } catch (error) {
    console.error('Teacher sync failed:', error);
  }

  return localId;
}

export async function createSession(teacherId: string, schoolId: string): Promise<string> {
  const localId = createLocalSession(teacherId, schoolId);
  if (!isOnline()) return localId;

  try {
    await ensureSessionSynced(localId);
  } catch (error) {
    console.error('Session sync failed:', error);
  }

  return localId;
}

export async function createStudent(
  name: string,
  age: number,
  gender: string,
  schoolId: string,
  rollNumber?: string
): Promise<string> {
  const localId = createLocalStudent(name, age, gender, schoolId, rollNumber);
  if (!isOnline()) return localId;

  try {
    await ensureStudentSynced(localId);
  } catch (error) {
    console.error('Student sync failed:', error);
  }

  return localId;
}

export async function saveTestResult(
  sessionId: string,
  studentId: string,
  results: TestResult,
  options?: {
    readinessChecklist?: {
      headphoneChecklistComplete: boolean;
      sampleTonePlayed: boolean;
      practicePassed: boolean;
    };
    parentSummaryEn?: string;
    parentSummaryTa?: string;
  }
): Promise<string> {
  const queueItemLocalId = `local_result_${createResultIdSuffix()}`;
  const clientResultId = queueItemLocalId;
  const queuePayload = {
    localId: queueItemLocalId,
    clientResultId,
    sessionLocalId: sessionId,
    studentLocalId: studentId,
    result: {
      left_ear_500hz: results.left['500'],
      left_ear_1000hz: results.left['1000'],
      left_ear_2000hz: results.left['2000'],
      left_ear_4000hz: results.left['4000'],
      right_ear_500hz: results.right['500'],
      right_ear_1000hz: results.right['1000'],
      right_ear_2000hz: results.right['2000'],
      right_ear_4000hz: results.right['4000'],
      false_positive_count: results.left.falsePositives + results.right.falsePositives,
      overall_result: results.overall,
      left_false_positive_count: results.left.falsePositives,
      right_false_positive_count: results.right.falsePositives,
      screening_version: 'phase1_clinical_safe',
      readiness_checklist: options?.readinessChecklist || null,
      practice_passed: options?.readinessChecklist?.practicePassed ?? false,
      parent_summary_en: options?.parentSummaryEn || null,
      parent_summary_ta: options?.parentSummaryTa || null,
    },
    timestamp: Date.now(),
  };

  enqueuePendingResult(queuePayload);
  if (!isOnline()) return queueItemLocalId;

  const { serverResultId } = await syncPendingResultByLocalId(queueItemLocalId);
  return serverResultId || queueItemLocalId;
}

export async function createReferral(studentId: string, resultId: string) {
  const resolvedStudentId = studentId.startsWith('local_student_')
    ? await ensureStudentSynced(studentId)
    : studentId;

  const { error } = await supabase
    .from('referrals')
    .insert({
      student_id: resolvedStudentId,
      result_id: resultId,
    });

  if (error) throw error;
}

function createResultIdSuffix() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

// Dashboard queries
export async function getDashboardStats() {
  const [schools, students, referrals, sessions] = await Promise.all([
    supabase.from('schools').select('id', { count: 'exact', head: true }),
    supabase.from('students').select('id', { count: 'exact', head: true }),
    supabase.from('referrals').select('id', { count: 'exact', head: true }),
    supabase.from('test_sessions').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalSchools: schools.count || 0,
    totalStudents: students.count || 0,
    totalReferrals: referrals.count || 0,
    totalSessions: sessions.count || 0,
  };
}

export async function getRecentSessions(limit = 20) {
  const { data, error } = await supabase
    .from('test_sessions')
    .select(`
      id,
      session_date,
      device_info,
      created_at,
      schools ( name, district ),
      teachers ( name )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getSessionResults(sessionId: string) {
  const { data, error } = await supabase
    .from('test_results')
    .select(`
      id,
      overall_result,
      students ( name, age, gender )
    `)
    .eq('session_id', sessionId);

  if (error) throw error;
  return data || [];
}

export async function getResultsByDateRange(from?: string, to?: string, district?: string) {
  let query = supabase
    .from('test_results')
    .select(`
      id,
      overall_result,
      created_at,
      test_sessions!inner ( session_date, schools!inner ( name, district ) )
    `);

  if (from) query = query.gte('created_at', from);
  if (to) query = query.lte('created_at', to);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;

  // Filter by district client-side since nested filtering is limited
  if (district && data) {
    return (data as DateRangeResultRow[]).filter((r) => r.test_sessions?.schools?.district === district);
  }
  return data || [];
}

export async function getMonthlyTrend() {
  const { data, error } = await supabase
    .from('test_results')
    .select('overall_result, created_at');

  if (error) throw error;
  if (!data) return [];

  // Group by month
  const months: Record<string, { normal: number; mild: number; refer: number }> = {};
  data.forEach((r) => {
    const month = r.created_at.substring(0, 7); // YYYY-MM
    if (!months[month]) months[month] = { normal: 0, mild: 0, refer: 0 };
    if (r.overall_result === 'normal') months[month].normal++;
    else if (r.overall_result === 'mild') months[month].mild++;
    else months[month].refer++;
  });

  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, counts]) => ({ month, ...counts }));
}

export async function exportCSV() {
  const { data, error } = await supabase
    .from('test_results')
    .select(`
      id,
      overall_result,
      left_ear_500hz, left_ear_1000hz, left_ear_2000hz, left_ear_4000hz,
      right_ear_500hz, right_ear_1000hz, right_ear_2000hz, right_ear_4000hz,
      false_positive_count,
      created_at,
      students ( name, age, gender, roll_number ),
      test_sessions ( session_date, schools ( name, district ), teachers ( name ) )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) return '';

  const headers = [
    'Student Name', 'Age', 'Gender', 'Roll Number',
    'School', 'District', 'Teacher', 'Date',
    'L-500', 'L-1000', 'L-2000', 'L-4000',
    'R-500', 'R-1000', 'R-2000', 'R-4000',
    'False Positives', 'Overall Result'
  ];

  const rows = (data as ExportResultRow[]).map((r) => [
    r.students?.name, r.students?.age, r.students?.gender, r.students?.roll_number || '',
    r.test_sessions?.schools?.name, r.test_sessions?.schools?.district, r.test_sessions?.teachers?.name,
    r.test_sessions?.session_date,
    r.left_ear_500hz ? 'Pass' : 'Fail', r.left_ear_1000hz ? 'Pass' : 'Fail',
    r.left_ear_2000hz ? 'Pass' : 'Fail', r.left_ear_4000hz ? 'Pass' : 'Fail',
    r.right_ear_500hz ? 'Pass' : 'Fail', r.right_ear_1000hz ? 'Pass' : 'Fail',
    r.right_ear_2000hz ? 'Pass' : 'Fail', r.right_ear_4000hz ? 'Pass' : 'Fail',
    r.false_positive_count, r.overall_result
  ]);

  const serializedHeader = headers.map(escapeCsvCell).join(',');
  const serializedRows = rows.map((row) => row.map(escapeCsvCell).join(','));
  return [serializedHeader, ...serializedRows].join('\n');
}

// Offline sync
export async function syncPendingResults(): Promise<{ synced: number }> {
  const queue = getPendingResults();
  if (queue.length === 0 || !isOnline()) return { synced: 0 };

  let synced = 0;
  const updatedQueue = [...queue];

  for (let i = 0; i < updatedQueue.length; i += 1) {
    const item = updatedQueue[i];
    if (item.synced) continue;
    if (!isItemEligibleForRetry(item)) continue;

    try {
      const { synced: itemSynced } = await syncOnePendingResult(item);
      if (itemSynced) synced += 1;
    } catch (error) {
      console.error('Result sync failed:', error);
      item.status = 'failed';
      item.lastError = error instanceof Error ? error.message : 'Unknown sync error';
      item.nextRetryAt = Date.now() + getRetryDelayMs((item.attempts || 0) + 1);
    }
  }

  setPendingResults(updatedQueue);
  return { synced };
}

async function syncPendingResultByLocalId(localResultId: string): Promise<{ serverResultId?: string }> {
  const queue = getPendingResults();
  const updatedQueue = [...queue];
  const index = updatedQueue.findIndex((item) => item.localId === localResultId);
  if (index === -1) return {};

  const item = updatedQueue[index];
  if (item.synced) return {};
  if (!isItemEligibleForRetry(item)) return {};

  let result: { serverResultId?: string } = {};
  try {
    result = await syncOnePendingResult(item);
  } catch (error) {
    item.status = 'failed';
    item.lastError = error instanceof Error ? error.message : 'Unknown sync error';
    item.nextRetryAt = Date.now() + getRetryDelayMs((item.attempts || 0) + 1);
  }
  setPendingResults(updatedQueue);
  return { serverResultId: result.serverResultId };
}

async function syncOnePendingResult(item: PendingResultItem) {
  item.status = 'syncing';
  item.lastAttemptAt = Date.now();
  item.attempts = (item.attempts || 0) + 1;

  const sessionServerId = await ensureSessionSynced(item.sessionLocalId);
  const studentServerId = await ensureStudentSynced(item.studentLocalId);

  const { data, error } = await supabase
    .from('test_results')
    .upsert({
      session_id: sessionServerId,
      student_id: studentServerId,
      client_result_id: item.clientResultId,
      ...(item.result as Record<string, unknown>),
    }, { onConflict: 'client_result_id' })
    .select('id')
    .single();

  if (error) {
    console.error('Result sync error:', error);
    item.status = 'failed';
    item.lastError = error.message;
    item.nextRetryAt = Date.now() + getRetryDelayMs(item.attempts);
    return { synced: false as const };
  }

  item.synced = true;
  item.status = 'synced';
  item.nextRetryAt = undefined;
  item.lastError = undefined;
  return { synced: true as const, serverResultId: data.id };
}

function getRetryDelayMs(attempts: number): number {
  const base = 2000;
  const max = 5 * 60 * 1000;
  const delay = Math.min(max, base * Math.pow(2, Math.max(0, attempts - 1)));
  const jitter = Math.floor(Math.random() * 500);
  return delay + jitter;
}

function isItemEligibleForRetry(item: PendingResultItem): boolean {
  const nextRetryAt = item.nextRetryAt || 0;
  return Date.now() >= nextRetryAt;
}

async function ensureSchoolSynced(localSchoolId: string): Promise<string> {
  const existing = getServerId('schools', localSchoolId);
  if (existing) return existing;

  const localSchool = getLocalSchool(localSchoolId);
  if (!localSchool) throw new Error(`Missing local school: ${localSchoolId}`);

  const { data: found } = await supabase
    .from('schools')
    .select('id')
    .eq('name', localSchool.name)
    .eq('district', localSchool.district)
    .limit(1)
    .maybeSingle();

  if (found?.id) {
    setServerId('schools', localSchoolId, found.id);
    return found.id;
  }

  const { data, error } = await supabase
    .from('schools')
    .insert({
      name: localSchool.name,
      district: localSchool.district,
    })
    .select('id')
    .single();

  if (error) throw error;
  setServerId('schools', localSchoolId, data.id);
  return data.id;
}

async function ensureTeacherSynced(localTeacherId: string): Promise<string> {
  const existing = getServerId('teachers', localTeacherId);
  if (existing) return existing;

  const localTeacher = getLocalTeacher(localTeacherId);
  if (!localTeacher) throw new Error(`Missing local teacher: ${localTeacherId}`);

  const schoolServerId = await ensureSchoolSynced(localTeacher.schoolLocalId);

  const { data: found } = await supabase
    .from('teachers')
    .select('id')
    .eq('name', localTeacher.name)
    .eq('school_id', schoolServerId)
    .limit(1)
    .maybeSingle();

  if (found?.id) {
    setServerId('teachers', localTeacherId, found.id);
    return found.id;
  }

  const { data, error } = await supabase
    .from('teachers')
    .insert({
      name: localTeacher.name,
      school_id: schoolServerId,
    })
    .select('id')
    .single();

  if (error) throw error;
  setServerId('teachers', localTeacherId, data.id);
  return data.id;
}

async function ensureSessionSynced(localSessionId: string): Promise<string> {
  const existing = getServerId('sessions', localSessionId);
  if (existing) return existing;

  const localSession = getLocalSession(localSessionId);
  if (!localSession) throw new Error(`Missing local session: ${localSessionId}`);

  const schoolServerId = await ensureSchoolSynced(localSession.schoolLocalId);
  const teacherServerId = await ensureTeacherSynced(localSession.teacherLocalId);
  const taggedDeviceInfo = `${localSession.deviceInfo} | local:${localSession.localId}`;

  const { data: found } = await supabase
    .from('test_sessions')
    .select('id')
    .eq('teacher_id', teacherServerId)
    .eq('school_id', schoolServerId)
    .eq('device_info', taggedDeviceInfo)
    .limit(1)
    .maybeSingle();

  if (found?.id) {
    setServerId('sessions', localSessionId, found.id);
    return found.id;
  }

  const { data, error } = await supabase
    .from('test_sessions')
    .insert({
      teacher_id: teacherServerId,
      school_id: schoolServerId,
      device_info: taggedDeviceInfo,
    })
    .select('id')
    .single();

  if (error) throw error;
  setServerId('sessions', localSessionId, data.id);
  return data.id;
}

async function ensureStudentSynced(localStudentId: string): Promise<string> {
  const existing = getServerId('students', localStudentId);
  if (existing) return existing;

  const localStudent = getLocalStudent(localStudentId);
  if (!localStudent) throw new Error(`Missing local student: ${localStudentId}`);
  const schoolServerId = await ensureSchoolSynced(localStudent.schoolLocalId);

  let query = supabase
    .from('students')
    .select('id')
    .eq('name', localStudent.name)
    .eq('age', localStudent.age)
    .eq('gender', localStudent.gender)
    .eq('school_id', schoolServerId);

  if (localStudent.rollNumber) {
    query = query.eq('roll_number', localStudent.rollNumber);
  }

  const { data: found } = await query.limit(1).maybeSingle();
  if (found?.id) {
    setServerId('students', localStudentId, found.id);
    return found.id;
  }

  const { data, error } = await supabase
    .from('students')
    .insert({
      name: localStudent.name,
      age: localStudent.age,
      gender: localStudent.gender,
      school_id: schoolServerId,
      roll_number: localStudent.rollNumber || null,
    })
    .select('id')
    .single();

  if (error) throw error;
  setServerId('students', localStudentId, data.id);
  return data.id;
}
