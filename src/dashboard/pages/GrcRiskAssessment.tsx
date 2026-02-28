import React, { useEffect, useState } from 'react';
import { AlertTriangle, Zap, TrendingUp, Shield, ArrowLeft, Target } from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { hyperlynxApi } from '../services/hyperlynxApi';

interface Risk {
  id: number;
  title: string;
  description: string;
  likelihood: number;
  impact: number;
  status: string;
}

const riskLevels = {
  critical: { color: '#ef4444', label: 'Critical', threshold: 15 },
  high: { color: '#f97316', label: 'High', threshold: 10 },
  medium: { color: '#eab308', label: 'Medium', threshold: 6 },
  low: { color: '#10b981', label: 'Low', threshold: 0 },
};

function getRiskLevel(score: number) {
  if (score >= riskLevels.critical.threshold) return 'critical';
  if (score >= riskLevels.high.threshold) return 'high';
  if (score >= riskLevels.medium.threshold) return 'medium';
  return 'low';
}

function getRiskScore(likelihood: number, impact: number) {
  return likelihood * impact;
}

export function GrcRiskAssessment() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      setLoading(true);
      const data = await hyperlynxApi.getRisks();
      setRisks(data.results || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load risks');
      console.error('Risks fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock risk data for heatmap
  const mockRisks: Risk[] = [
    { id: 1, title: 'Data Breach', description: 'Unauthorized access to customer data', likelihood: 5, impact: 5, status: 'open' },
    { id: 2, title: 'Ransomware Attack', description: 'System encryption and extortion', likelihood: 4, impact: 5, status: 'open' },
    { id: 3, title: 'Insider Threat', description: 'Malicious employee actions', likelihood: 3, impact: 4, status: 'mitigating' },
    { id: 4, title: 'DDoS Attack', description: 'Service availability disruption', likelihood: 4, impact: 3, status: 'open' },
    { id: 5, title: 'Compliance Violation', description: 'Breach of regulatory requirements', likelihood: 2, impact: 4, status: 'open' },
    { id: 6, title: 'Third-party Compromise', description: 'Vendor security failure', likelihood: 3, impact: 3, status: 'mitigating' },
    { id: 7, title: 'API Exploitation', description: 'Abuse of API endpoints', likelihood: 4, impact: 2, status: 'open' },
    { id: 8, title: 'Social Engineering', description: 'Phishing and pretexting', likelihood: 5, impact: 2, status: 'open' },
  ];

  const chartData = mockRisks.map((risk) => ({
    ...risk,
    score: getRiskScore(risk.likelihood, risk.impact),
    riskLevel: getRiskLevel(getRiskScore(risk.likelihood, risk.impact)),
  }));

  const riskStats = {
    critical: mockRisks.filter((r) => getRiskLevel(getRiskScore(r.likelihood, r.impact)) === 'critical').length,
    high: mockRisks.filter((r) => getRiskLevel(getRiskScore(r.likelihood, r.impact)) === 'high').length,
    medium: mockRisks.filter((r) => getRiskLevel(getRiskScore(r.likelihood, r.impact)) === 'medium').length,
    low: mockRisks.filter((r) => getRiskLevel(getRiskScore(r.likelihood, r.impact)) === 'low').length,
  };

  if (selectedRisk) {
    const score = getRiskScore(selectedRisk.likelihood, selectedRisk.impact);
    const level = getRiskLevel(score);
    const levelMeta = riskLevels[level as keyof typeof riskLevels];

    const mitigationSuggestions = [
      `Assign risk owner for ${selectedRisk.title}.`,
      'Define mitigation controls and implementation timeline.',
      'Track mitigation progress weekly in risk register.',
      selectedRisk.status === 'open' ? 'Escalate to leadership review if risk remains open.' : 'Validate mitigation effectiveness with control testing.',
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Detailed Risk Assessment</h1>
            <p className="text-gray-600 text-sm mt-1">{selectedRisk.title}</p>
          </div>
          <button
            onClick={() => setSelectedRisk(null)}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Risks
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-5">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <p className="text-lg font-semibold text-gray-900">{selectedRisk.title}</p>
            <span className="px-2 py-1 rounded text-xs font-semibold text-white" style={{ backgroundColor: levelMeta.color }}>
              {levelMeta.label}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Likelihood</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{selectedRisk.likelihood}/5</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Impact</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{selectedRisk.impact}/5</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Risk Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{score}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Status</p>
              <p className="text-base font-semibold text-gray-900 mt-2">{selectedRisk.status === 'open' ? 'Open' : 'Mitigating'}</p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" /> Risk Description
            </p>
            <p className="text-sm text-gray-700">{selectedRisk.description}</p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">Recommended Mitigation Controls</p>
            <ul className="space-y-2">
              {mitigationSuggestions.map((item, idx) => (
                <li key={`${selectedRisk.id}-${idx}`} className="text-sm text-gray-700 flex gap-2">
                  <span className="font-bold text-green-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (loading && mockRisks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Risk Assessment</h1>
        <p className="text-gray-600 text-sm mt-1">Identify and manage organizational risks</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-semibold">Error loading risks</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Zap className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Critical Risks</p>
              <p className="text-2xl font-bold text-gray-900">{riskStats.critical}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">High Risks</p>
              <p className="text-2xl font-bold text-gray-900">{riskStats.high}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Medium Risks</p>
              <p className="text-2xl font-bold text-gray-900">{riskStats.medium}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Low Risks</p>
              <p className="text-2xl font-bold text-gray-900">{riskStats.low}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Heatmap */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Risk Heatmap (Likelihood vs Impact)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              dataKey="likelihood"
              name="Likelihood"
              domain={[1, 5]}
              label={{ value: 'Likelihood →', position: 'insideBottomRight', offset: -10 }}
              stroke="#6b7280"
            />
            <YAxis
              type="number"
              dataKey="impact"
              name="Impact"
              domain={[1, 5]}
              label={{ value: 'Impact →', angle: -90, position: 'insideLeft' }}
              stroke="#6b7280"
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  const data = payload[0].payload as typeof chartData[0];
                  return (
                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg">
                      <p className="font-semibold text-gray-900 text-sm">{data.title}</p>
                      <p className="text-xs text-gray-600">{data.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Score: {data.score} | Level: {data.riskLevel.toUpperCase()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Risks" data={chartData} fill="#3b82f6">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={riskLevels[entry.riskLevel as keyof typeof riskLevels].color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          {Object.entries(riskLevels).map(([level, { color, label }]) => (
            <div key={level} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="text-xs font-medium text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Details Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Risk Register</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Risk Title</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 w-24">Likelihood</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 w-24">Impact</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 w-24">Score</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 w-28">Level</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 w-28">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockRisks.map((risk) => {
                const score = getRiskScore(risk.likelihood, risk.impact);
                const level = getRiskLevel(score);
                return (
                  <tr
                    key={risk.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelectedRisk(risk)}
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">{risk.title}</td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{risk.description}</td>
                    <td className="py-3 px-4 text-center">{risk.likelihood}/5</td>
                    <td className="py-3 px-4 text-center">{risk.impact}/5</td>
                    <td className="py-3 px-4 text-center font-semibold text-gray-900">{score}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold text-white"
                        style={{ backgroundColor: riskLevels[level as keyof typeof riskLevels].color }}
                      >
                        {riskLevels[level as keyof typeof riskLevels].label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          risk.status === 'open'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {risk.status === 'open' ? 'Open' : 'Mitigating'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
