import React, { useEffect, useState } from 'react';
import { AlertTriangle, TrendingDown, Shield, ArrowLeft, Target, ClipboardCheck } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { hyperlynxApi } from '../services/hyperlynxApi';

interface GapItem {
  id: number;
  control_name: string;
  framework_id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'missing' | 'covered' | 'in_progress' | 'resolved';
  recommendation: string;
  gap_score?: number;
}

interface FrameworkGapData {
  framework: string;
  total: number;
  covered: number;
  gaps: number;
}

const severityColors: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#3b82f6',
  low: '#10b981',
};

const severityBgColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-blue-100 text-blue-800',
  low: 'bg-green-100 text-green-800',
};

export function GrcGapAnalysis() {
  const [gaps, setGaps] = useState<GapItem[]>([]);
  const [selectedGap, setSelectedGap] = useState<GapItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGapData();
  }, []);

  const fetchGapData = async () => {
    try {
      setLoading(true);
      const data = await hyperlynxApi.getGapAnalysis();
      setGaps((data.results || []) as unknown as GapItem[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gaps');
      console.error('Gap fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const frameworkCounts = gaps.reduce((acc, gap) => {
    const fw = acc.find((f) => f.framework === gap.framework_id);
    if (fw) {
      fw.total++;
        if (gap.status === 'resolved' || gap.status === 'covered') fw.covered++;
        if (gap.status !== 'resolved' && gap.status !== 'covered') fw.gaps++;
    } else {
      acc.push({
        framework: gap.framework_id,
        total: 1,
          covered: gap.status === 'resolved' || gap.status === 'covered' ? 1 : 0,
          gaps: gap.status !== 'resolved' && gap.status !== 'covered' ? 1 : 0,
      });
    }
    return acc;
  }, [] as FrameworkGapData[]);

  const criticalGaps = gaps.filter((g) => g.severity === 'critical' || g.severity === 'high');
  const lowGaps = gaps.filter((g) => g.severity !== 'critical' && g.severity !== 'high');
  const totalGaps = gaps.length;
  const criticalCount = criticalGaps.length;
  const highPriorityCount = gaps.filter((g) => g.severity === 'high').length;
  const coveragePercent =
    totalGaps > 0 ? Math.round((gaps.filter((g) => g.status === 'resolved' || g.status === 'covered').length / totalGaps) * 100) : 0;

  if (selectedGap) {
    const statusClass =
      selectedGap.status === 'resolved' || selectedGap.status === 'covered'
        ? 'bg-green-100 text-green-800'
        : selectedGap.status === 'in_progress'
          ? 'bg-blue-100 text-blue-800'
          : 'bg-gray-100 text-gray-800';

    const recommendationSteps = selectedGap.recommendation
      .split(/\n|;|\.|\u2022|•/)
      .map((step) => step.trim())
      .filter(Boolean);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Detailed Gap Analysis</h1>
            <p className="text-gray-600 text-sm mt-1">Framework: {selectedGap.framework_id}</p>
          </div>
          <button
            onClick={() => setSelectedGap(null)}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Gaps
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Control</p>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{selectedGap.control_name}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${severityBgColors[selectedGap.severity]}`}>
                {selectedGap.severity.charAt(0).toUpperCase() + selectedGap.severity.slice(1)}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${statusClass}`}>
                {selectedGap.status.charAt(0).toUpperCase() + selectedGap.status.slice(1).replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs text-blue-700">Gap Score</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{selectedGap.gap_score ?? '-'}</p>
            </div>
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <p className="text-xs text-purple-700">Framework</p>
              <p className="text-base font-semibold text-purple-900 mt-1 break-words">{selectedGap.framework_id}</p>
            </div>
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <p className="text-xs text-orange-700">Priority</p>
              <p className="text-base font-semibold text-orange-900 mt-1">
                {selectedGap.severity === 'critical' || selectedGap.severity === 'high' ? 'Immediate' : 'Planned'}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" /> Gap Description
            </p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedGap.recommendation}</p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <ClipboardCheck className="h-4 w-4 text-green-600" /> Controls to Implement
            </p>
            {recommendationSteps.length > 0 ? (
              <ul className="space-y-2">
                {recommendationSteps.map((step, index) => (
                  <li key={`${selectedGap.id}-${index}`} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No control guidance available for this gap yet.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading && gaps.length === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gap Analysis</h1>
          <p className="text-gray-600 text-sm mt-1">Identify compliance gaps across enabled frameworks</p>
        </div>
        <button
          onClick={fetchGapData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-semibold">Error loading gaps</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-600">Total Gaps</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalGaps}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-600">Critical</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{gaps.filter((g) => g.severity === 'critical').length}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-600">High Priority</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">{highPriorityCount}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-600">Coverage</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{coveragePercent}%</p>
        </div>
      </div>

      {/* Framework Coverage Chart */}
      {frameworkCounts.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Gap Coverage by Framework</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={frameworkCounts}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="framework" type="category" stroke="#6b7280" width={140} />
              <Tooltip />
              <Legend />
              <Bar dataKey="covered" fill="#10b981" name="Resolved" radius={[0, 8, 8, 0]} />
              <Bar dataKey="gaps" fill="#ef4444" name="Open" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Critical & High Priority Gaps Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          Critical & High Priority Gaps
        </h3>
        {criticalGaps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Control</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Framework</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Severity</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {criticalGaps.map((gap) => (
                  <tr
                    key={gap.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelectedGap(gap)}
                  >
                    <td className="py-3 px-4 text-xs text-gray-700">{gap.control_name}</td>
                    <td className="py-3 px-4 text-gray-700 max-w-md whitespace-pre-wrap">{gap.recommendation}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {gap.framework_id}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${severityBgColors[gap.severity]}`}>
                        {gap.severity.charAt(0).toUpperCase() + gap.severity.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          gap.status === 'resolved' || gap.status === 'covered'
                            ? 'bg-green-100 text-green-800'
                            : gap.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {gap.status.charAt(0).toUpperCase() + gap.status.slice(1).replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No critical or high priority gaps</p>
        )}
      </div>

      {/* All Gaps with Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-green-600" />
          All Gaps (Detailed) ({gaps.length})
        </h3>
        {gaps.length > 0 ? (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {gaps.map((gap) => (
              <div
                key={gap.id}
                className="flex items-center justify-between p-3 rounded border border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedGap(gap)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: severityColors[gap.severity] }}
                  ></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-700">{gap.control_name}</p>
                    <p className="text-xs text-gray-600">{gap.recommendation}</p>
                    <p className="text-xs text-gray-500 mt-1">Framework: {gap.framework_id}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2 ${severityBgColors[gap.severity]}`}>
                  {gap.severity}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No gaps yet. Complete applicability, upload policy documents, and run analysis.</p>
        )}
      </div>
    </div>
  );
}
