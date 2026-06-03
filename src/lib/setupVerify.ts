import { supabase } from '@/lib/supabase';

export async function verifySupabaseSetup() {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  let connected = false;
  let tablesReady = false;
  let adminReady = false;

  try {
    const { error: schoolsError } = await supabase.from('schools').select('id').limit(1);
    connected = !schoolsError;
    tablesReady = !schoolsError;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
  }

  try {
    if (!adminEmail) {
      console.warn('VITE_ADMIN_EMAIL is not configured');
    } else {
      const { data, error } = await supabase.rpc('is_admin_whitelisted', {
        check_email: adminEmail,
      });
      adminReady = !error && !!data;
    }
  } catch (error) {
    console.error('Admin whitelist check failed:', error);
  }

  const result = { connected, tablesReady, adminReady };
  console.log('verifySupabaseSetup result:', result);
  return result;
}
