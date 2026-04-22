import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminDataTable from '@/components/AdminDataTable';

interface LoginLogRow {
  id: string;
  user_email: string;
  login_time: string;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  ip_address: string | null;
  session_id: string | null;
  [key: string]: unknown;
}

export default function AdminLoginsPage() {
  const [data, setData] = useState<LoginLogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: logs } = await supabase
        .from('login_logs')
        .select('*')
        .order('login_time', { ascending: false });

      setData(logs || []);
      setLoading(false);
    };
    load();
  }, []);

  const columns = [
    { key: 'user_email', label: 'User Email' },
    { key: 'login_time', label: 'Login Time', render: (r: LoginLogRow) => new Date(r.login_time).toLocaleString() },
    {
      key: 'device_type', label: 'Device',
      render: (r: LoginLogRow) => {
        const cls = r.device_type === 'Mobile' ? 'bg-blue-500/15 text-blue-400' :
                    r.device_type === 'Tablet' ? 'bg-purple-500/15 text-purple-400' :
                    'bg-gray-500/15 text-gray-400';
        return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{r.device_type || '—'}</span>;
      },
    },
    { key: 'browser', label: 'Browser' },
    { key: 'os', label: 'OS' },
    { key: 'ip_address', label: 'IP Address', render: (r: LoginLogRow) => r.ip_address || '—' },
    { key: 'session_id', label: 'Session', render: (r: LoginLogRow) => <span className="font-mono text-xs text-gray-500">{r.session_id || '—'}</span> },
  ];

  return (
    <AdminDataTable
      title="Login History"
      description="Every login event recorded in the system"
      columns={columns}
      data={data}
      loading={loading}
      searchPlaceholder="Search by email..."
      searchField={(r) => r.user_email}
    />
  );
}
