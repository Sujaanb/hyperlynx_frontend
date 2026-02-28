import React, { useEffect, useState } from 'react';
import { hyperlynxApi } from '../services/hyperlynxApi';

export function GrcReports() {
  const [reports, setReports] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await hyperlynxApi.getReports();
      setReports(data.results || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const generate = async () => {
    setGenerating(true);
    try {
      await hyperlynxApi.generateReport('compliance-summary');
      await load();
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-600 mt-1">Generate and review GRC reports.</p>
        </div>
        <button onClick={generate} disabled={generating} className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50">
          {generating ? 'Generating…' : 'Generate Report'}
        </button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b font-semibold text-gray-900">Generated Reports ({reports.length})</div>
        <div className="max-h-[560px] overflow-auto">
          {loading ? (
            <div className="p-4 text-sm text-gray-500">Loading reports…</div>
          ) : (
            reports.map((report, idx) => (
              <div key={idx} className="px-4 py-3 border-b text-sm grid grid-cols-1 md:grid-cols-4 gap-2">
                <p className="font-medium text-gray-900">{String(report.title || report.name || `Report ${idx + 1}`)}</p>
                <p className="text-gray-600">{String(report.report_type || 'compliance-summary')}</p>
                <p className="text-gray-600">{String(report.status || 'ready')}</p>
                <p className="text-gray-500">{String(report.created_at || '')}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
