import React, { useEffect, useState } from 'react';
import { hyperlynxApi } from '../services/hyperlynxApi';

export function GrcIntegrations() {
  const [apiHealth, setApiHealth] = useState('unknown');
  const [aiHealth, setAiHealth] = useState('unknown');

  const plugins = [
    { name: 'Jira Connector', category: 'Ticketing', status: 'Demo', description: 'Sync remediation tasks to Jira issues.' },
    { name: 'Slack Alerts', category: 'Notifications', status: 'Demo', description: 'Send compliance and risk alerts to Slack channels.' },
    { name: 'Microsoft Teams', category: 'Notifications', status: 'Demo', description: 'Push action plan updates to Teams.' },
    { name: 'ServiceNow GRC', category: 'GRC', status: 'Demo', description: 'Map controls and findings to ServiceNow records.' },
    { name: 'Okta IAM', category: 'Identity', status: 'Demo', description: 'Import identity posture and MFA evidence.' },
    { name: 'AWS Security Hub', category: 'Cloud', status: 'Demo', description: 'Ingest cloud findings for risk enrichment.' },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        await hyperlynxApi.health();
        setApiHealth('connected');
      } catch {
        setApiHealth('offline');
      }

      try {
        await hyperlynxApi.aiHealth();
        setAiHealth('connected');
      } catch {
        setAiHealth('offline');
      }
    };
    void load();
  }, []);

  const Badge = ({ status }: { status: string }) => (
    <span className={`px-2 py-1 rounded text-xs ${status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {status}
    </span>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
        <p className="text-sm text-gray-600 mt-1">System connectivity and integration status.</p>
      </div>

      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between"><p className="text-sm text-gray-900">Core API</p><Badge status={apiHealth} /></div>
        <div className="flex items-center justify-between"><p className="text-sm text-gray-900">AI Content Service</p><Badge status={aiHealth} /></div>
        <div className="flex items-center justify-between"><p className="text-sm text-gray-900">Authentication</p><Badge status={apiHealth} /></div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Plugin Marketplace (Demo)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plugins.map((plugin) => (
            <div key={plugin.name} className="border rounded-md p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-gray-900 text-sm">{plugin.name}</p>
                <span className="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">{plugin.status}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{plugin.category}</p>
              <p className="text-xs text-gray-700 mt-2">{plugin.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
