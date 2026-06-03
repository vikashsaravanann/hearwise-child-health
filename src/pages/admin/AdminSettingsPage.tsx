import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AdminEmail {
  id: string;
  email: string;
  created_at?: string;
}

export default function AdminSettingsPage() {
  const [currentEmail, setCurrentEmail] = useState('');
  const [admins, setAdmins] = useState<AdminEmail[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [exportFormat, setExportFormat] = useState<'CSV' | 'PDF'>('CSV');
  const [includeLogo, setIncludeLogo] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);

  const load = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setCurrentEmail(session?.user?.email ?? '');
    const { data } = await supabase.rpc('get_admin_whitelist');
    setAdmins(data ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const addAdmin = async () => {
    if (!newEmail.trim()) return;
    await supabase.rpc('add_admin_whitelist', { target_email: newEmail.trim().toLowerCase() });
    setNewEmail('');
    await load();
  };

  const removeAdmin = async (id: string, email: string) => {
    if (email === currentEmail) return;
    await supabase.rpc('remove_admin_whitelist', { target_id: id });
    await load();
  };

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-black/10 bg-white p-4">
        <p className="text-[14px] font-medium">Admin Account</p>
        <div className="mt-3 text-[13px] text-slate-600">
          <p>Email: {currentEmail || '—'}</p>
        </div>
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-medium">Admin Whitelist</p>
          <div className="flex items-center gap-2">
            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Add admin email"
              className="h-9 rounded-md border border-slate-200 px-3 text-[12px] outline-none"
            />
            <button type="button" onClick={addAdmin} className="rounded-md bg-[#2F80ED] px-3 py-2 text-[12px] text-white">
              Add
            </button>
          </div>
        </div>
        <div className="mt-3 divide-y divide-slate-100 rounded-md border border-slate-100">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between px-3 py-2 text-[12px]">
              <span>{admin.email}</span>
              <button
                type="button"
                disabled={admin.email === currentEmail}
                onClick={() => removeAdmin(admin.id, admin.email)}
                className="rounded-md border border-slate-200 px-2 py-1 text-[11px] disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-4">
        <p className="text-[14px] font-medium">Export Settings</p>
        <div className="mt-3 flex items-center gap-2 text-[12px]">
          <button type="button" onClick={() => setExportFormat('CSV')} className={`rounded-full px-3 py-1 ${exportFormat === 'CSV' ? 'bg-[#2F80ED] text-white' : 'border border-slate-200 text-slate-500'}`}>CSV</button>
          <button type="button" onClick={() => setExportFormat('PDF')} className={`rounded-full px-3 py-1 ${exportFormat === 'PDF' ? 'bg-[#2F80ED] text-white' : 'border border-slate-200 text-slate-500'}`}>PDF</button>
          <label className="ml-3 inline-flex items-center gap-2">
            <input type="checkbox" checked={includeLogo} onChange={(e) => setIncludeLogo(e.target.checked)} />
            Include school logo
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-4">
        <p className="text-[14px] font-medium">Notifications</p>
        <div className="mt-3 space-y-2 text-[12px]">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
            Email alert when new referral added
          </label>
          <label className="block">
            <span className="inline-flex items-center gap-2">
              <input type="checkbox" checked={dailySummary} onChange={(e) => setDailySummary(e.target.checked)} />
              Daily summary email
            </span>
          </label>
        </div>
      </section>
    </div>
  );
}
