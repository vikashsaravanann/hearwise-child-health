import { supabase } from '@/integrations/supabase/client';
import { addToQueue, isOnline, getQueue, clearQueue } from './offlineSync';
import type { TestResult } from './testEngine';

export async function getOrCreateSchool(name: string, district: string): Promise<string> {
  // Check if school exists
  const { data: existing } = await supabase
    .from('schools')
    .select('id')
    .eq('name', name)
    .eq('district', district)
    .limit(1)
    .single();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from('schools')
    .insert({ name, district })
    .select('id')
    .single();

  if (error) throw error;
  return data!.id;
}

export async function getOrCreateTeacher(name: string, schoolId: string): Promise<string> {
  const { data: existing } = await supabase
    .from('teachers')
    .select('id')
    .eq('name', name)
    .eq('school_id', schoolId)
    .limit(1)
    .single();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from('teachers')
    .insert({ name, school_id: schoolId })
    .select('id')
    .single();

  if (error) throw error;
  return data!.id;
}

export async function createSession(teacherId: string, schoolId: string): Promise<string> {
  const { data, error } = await supabase
    .from('test_sessions')
    .insert({
      teacher_id: teacherId,
      school_id: schoolId,
      device_info: navigator.userAgent,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data!.id;
}

export async function createStudent(
  name: string,
  age: number,
  gender: string,
  schoolId: string,
  rollNumber?: string
): Promise<string> {
  const { data, error } = await supabase
    .from('students')
    .insert({
      name,
      age,
      gender,
      school_id: schoolId,
      roll_number: rollNumber || null,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data!.id;
}

export async function saveTestResult(
  sessionId: string,
  studentId: string,
  results: TestResult
): Promise<string> {
  const { data, error } = await supabase
    .from('test_results')
    .insert({
      session_id: sessionId,
      student_id: studentId,
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
    })
    .select('id')
    .single();

  if (error) throw error;
  return data!.id;
}

export async function createReferral(studentId: string, resultId: string) {
  const { error } = await supabase
    .from('referrals')
    .insert({
      student_id: studentId,
      result_id: resultId,
    });

  if (error) throw error;
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
    return data.filter((r: any) => r.test_sessions?.schools?.district === district);
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

  const rows = data.map((r: any) => [
    r.students?.name, r.students?.age, r.students?.gender, r.students?.roll_number || '',
    r.test_sessions?.schools?.name, r.test_sessions?.schools?.district, r.test_sessions?.teachers?.name,
    r.test_sessions?.session_date,
    r.left_ear_500hz ? 'Pass' : 'Fail', r.left_ear_1000hz ? 'Pass' : 'Fail',
    r.left_ear_2000hz ? 'Pass' : 'Fail', r.left_ear_4000hz ? 'Pass' : 'Fail',
    r.right_ear_500hz ? 'Pass' : 'Fail', r.right_ear_1000hz ? 'Pass' : 'Fail',
    r.right_ear_2000hz ? 'Pass' : 'Fail', r.right_ear_4000hz ? 'Pass' : 'Fail',
    r.false_positive_count, r.overall_result
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

// Offline sync
export async function syncOfflineQueue() {
  const queue = getQueue();
  if (queue.length === 0 || !isOnline()) return;

  for (const item of queue) {
    try {
      const { error } = await supabase.from(item.table as any).insert(item.data as any);
      if (error) console.error('Sync error:', error);
    } catch (e) {
      console.error('Sync failed:', e);
      return; // Stop on failure, will retry later
    }
  }
  clearQueue();
}
