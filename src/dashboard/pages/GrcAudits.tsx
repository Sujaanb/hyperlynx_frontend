import React, { useEffect, useMemo, useState } from 'react';
import { hyperlynxApi } from '../services/hyperlynxApi';

export function GrcAudits() {
  const [documents, setDocuments] = useState<Array<{ id: number; filename: string }>>([]);
  const [reports, setReports] = useState<Array<Record<string, unknown>>>([]);
  const [tasks, setTasks] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    const load = async () => {
      const [docs, reps, plan] = await Promise.all([
        hyperlynxApi.getDocuments().catch(() => ({ results: [] as Array<{ id: number; filename: string }> })),
        hyperlynxApi.getReports().catch(() => ({ results: [] as Array<Record<string, unknown>> })),
        hyperlynxApi.getActionPlan().catch(() => ({ results: [] as Array<Record<string, unknown>> })),
      ]);
      setDocuments(docs.results || []);
      setReports((reps.results || []) as Array<Record<string, unknown>>);
      setTasks((plan.results || []) as Array<Record<string, unknown>>);
    };
    void load();
  }, []);

  const evidenceCount = useMemo(() => documents.length + reports.length, [documents.length, reports.length]);
  const openFindings = useMemo(() => tasks.filter((t) => String(t.status) !== 'done').length, [tasks]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Audits</h1>
        <p className="text-sm text-gray-600 mt-1">Audit readiness and evidence trail based on current GRC records.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4"><p className="text-xs text-gray-500">Evidence Items</p><p className="text-2xl font-bold">{evidenceCount}</p></div>
        <div className="bg-white border rounded-lg p-4"><p className="text-xs text-gray-500">Open Findings</p><p className="text-2xl font-bold">{openFindings}</p></div>
        <div className="bg-white border rounded-lg p-4"><p className="text-xs text-gray-500">Reports Available</p><p className="text-2xl font-bold">{reports.length}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Document Evidence</h2>
          <div className="space-y-2 max-h-80 overflow-auto">
            {documents.map((doc) => (
              <div key={doc.id} className="text-sm border rounded-md px-3 py-2">{doc.filename}</div>
            ))}
            {!documents.length && <p className="text-sm text-gray-500">No documents uploaded yet.</p>}
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Findings from Action Plan</h2>
          <div className="space-y-2 max-h-80 overflow-auto">
            {tasks.map((task, idx) => (
              <div key={idx} className="text-sm border rounded-md px-3 py-2">
                <p className="font-medium">{String(task.title || `Task ${idx + 1}`)}</p>
                <p className="text-xs text-gray-500">Status: {String(task.status || 'todo')}</p>
              </div>
            ))}
            {!tasks.length && <p className="text-sm text-gray-500">No findings/tasks available yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
