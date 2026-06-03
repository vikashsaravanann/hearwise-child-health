import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ MISSING SUPABASE ENV VARS.\n' +
    'Make sure your .env file has:\n' +
    'VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
    'VITE_SUPABASE_ANON_KEY=your-anon-key'
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      detectSessionInUrl: true,   // CRITICAL — handles OAuth callback tokens from URL
      persistSession: true,        // keeps user logged in after refresh
      autoRefreshToken: true,      // silently refreshes expired tokens
      flowType: 'pkce',            // most secure OAuth flow, works on all browsers
      storageKey: 'hearwise-auth', // namespaced key to avoid collisions
    },
  }
);
