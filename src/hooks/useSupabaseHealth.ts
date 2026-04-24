import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSupabaseHealth() {
  const [status, setStatus] = useState<'checking'|'connected'|'error'>('checking');
  
  useEffect(() => {
    async function check() {
      try {
        const { error } = await supabase
          .from('schools')
          .select('id', { count: 'exact', head: true });
        setStatus(error ? 'error' : 'connected');
      } catch {
        setStatus('error');
      }
    }
    check();
  }, []);
  
  return status;
}
