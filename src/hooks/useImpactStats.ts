import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface ImpactStats {
  childrenScreened: number;
  schoolsOnboarded: number;
  hearingIssuesDetected: number;
  statesCovered: number;
}

export function useImpactStats() {
  const [stats, setStats] = useState<ImpactStats>({
    childrenScreened: 0,
    schoolsOnboarded: 0,
    hearingIssuesDetected: 0,
    statesCovered: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Count total screening results
        const { count: childrenCount } = await supabase
          .from('screening_results')
          .select('*', { count: 'exact', head: true });

        // Count distinct schools
        const { count: schoolCount } = await supabase
          .from('schools')
          .select('*', { count: 'exact', head: true });

        // Count results where overall_result = 'refer'
        const { count: issuesCount } = await supabase
          .from('screening_results')
          .select('*', { count: 'exact', head: true })
          .eq('overall_result', 'refer');

        setStats({
          childrenScreened: childrenCount || 0,
          schoolsOnboarded: schoolCount || 0,
          hearingIssuesDetected: issuesCount || 0,
          statesCovered: 1,
        });
      } catch (err) {
        console.error('Failed to fetch impact stats:', err);
        // Show fallback numbers if DB is empty (for demo/launch)
        setStats({
          childrenScreened: 0,
          schoolsOnboarded: 0,
          hearingIssuesDetected: 0,
          statesCovered: 1,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return { stats, loading };
}
