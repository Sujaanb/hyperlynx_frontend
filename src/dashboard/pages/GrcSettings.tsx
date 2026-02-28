import React, { useEffect, useState } from 'react';
import { hyperlynxApi } from '../services/hyperlynxApi';

export function GrcSettings() {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  const [users, setUsers] = useState<Array<Record<string, unknown>>>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [org, usersResp] = await Promise.all([
        hyperlynxApi.getOrganization().catch(() => null),
        hyperlynxApi.listUsers().catch(() => ({ results: [] as Array<Record<string, unknown>> })),
      ]);
      if (org) {
        setName(org.name || '');
        setIndustry(org.industry || '');
        setCountry(org.country || '');
      }
      setUsers(usersResp.results || []);
    };
    void load();
  }, []);

  const saveOrg = async () => {
    setSaving(true);
    try {
      await hyperlynxApi.createOrganization(name, industry, country);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600 mt-1">Organization and user management.</p>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Organization Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="border rounded-md px-3 py-2" placeholder="Organization" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="border rounded-md px-3 py-2" placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          <input className="border rounded-md px-3 py-2" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
        <button onClick={saveOrg} disabled={saving || !name.trim()} className="mt-3 px-4 py-2 bg-black text-white rounded-md disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b font-semibold text-gray-900">Users ({users.length})</div>
        <div className="max-h-[420px] overflow-auto">
          {users.map((u, idx) => (
            <div key={idx} className="px-4 py-3 border-b text-sm grid grid-cols-1 md:grid-cols-4 gap-2">
              <p className="font-medium text-gray-900">{String(u.username || '')}</p>
              <p className="text-gray-600">{String(u.email || '')}</p>
              <p className="text-gray-600">{String(u.role || 'viewer')}</p>
              <p className="text-gray-500">{String(u.is_active ? 'Active' : 'Inactive')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
