import { supabase } from '@/integrations/supabase/client';

export async function checkAdminAccess(): Promise<{ allowed: boolean; email: string }> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const email = session?.user?.email?.toLowerCase() ?? '';
  if (!session || !email) return { allowed: false, email: '' };

  const { data, error } = await supabase.rpc('is_admin_whitelisted', { check_email: email });
  if (error) return { allowed: false, email };

  return { allowed: Boolean(data), email };
}
