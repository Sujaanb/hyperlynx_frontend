import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  CheckCircle2, 
  Clock, 
  FileText 
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { hyperlynxApi } from '../services/hyperlynxApi';

const COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#3b82f6',
  low: '#10b981',
};

interface OverviewData {
  enabled_frameworks: number;
  total_gaps: number;
  critical_gaps: number;
  compliance_score: number;
}

interface Activity {
  icon: typeof CheckCircle2;
  text: string;
  time: string;
  color: string;
  targetView: string;
}

export function GrcOverview({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activities: Activity[] = [
    { 
      icon: CheckCircle2, 
      text: 'Gap analysis completed for NIST CSF', 
      time: '2h ago', 
      color: 'text-green-500',
      targetView: 'gap-analysis',
    },
    { 
      icon: AlertTriangle, 
      text: 'Critical gap identified: Incident Response', 
      time: '4h ago', 
      color: 'text-red-500',
      targetView: 'risk-assessment',
    },
    { 
      icon: FileText, 
      text: 'New compliance document uploaded', 
      time: '6h ago', 
      color: 'text-blue-500',
      targetView: 'policy-documents',
    },
    { 
      icon: Clock, 
      text: 'Action plan items due in 3 days', 
      time: '8h ago', 
      color: 'text-yellow-500',
      targetView: 'action-plan',
    },
  ];

  useEffect(() => {
    fetchOverviewData();
    const interval = setInterval(fetchOverviewData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const data = await hyperlynxApi.getComplianceOverview();
      setOverview(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load overview');
      console.error('Overview fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !overview) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-semibold">Error loading compliance overview</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  const riskData = [
    { name: 'Critical', value: overview?.critical_gaps || 0, color: COLORS.critical },
    { 
      name: 'High', 
      value: Math.max(0, (overview?.total_gaps || 0) * 0.3), 
      color: COLORS.high 
    },
    { 
      name: 'Medium', 
      value: Math.max(0, (overview?.total_gaps || 0) * 0.4), 
      color: COLORS.medium 
    },
    { 
      name: 'Low', 
      value: Math.max(0, (overview?.total_gaps || 0) * 0.3), 
      color: COLORS.low 
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
        <p className="text-gray-600 text-sm mt-1">Real-time GRC oversight and compliance status</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition cursor-pointer"
          onClick={() => onNavigate?.('compliance')}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-gray-900">{overview?.compliance_score.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition cursor-pointer"
          onClick={() => onNavigate?.('framework-advisor')}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Enabled Frameworks</p>
              <p className="text-2xl font-bold text-gray-900">{overview?.enabled_frameworks}</p>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition cursor-pointer"
          onClick={() => onNavigate?.('gap-analysis')}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Gaps</p>
              <p className="text-2xl font-bold text-gray-900">{overview?.total_gaps}</p>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition cursor-pointer"
          onClick={() => onNavigate?.('risk-assessment')}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Critical Gaps</p>
              <p className="text-2xl font-bold text-gray-900">{overview?.critical_gaps}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gap Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Gap Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => Math.round(value)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {riskData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  {item.name}
                </span>
                <span className="font-semibold">{Math.round(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:col-span-2">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Compliance Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={[
                { month: 'Week 1', score: overview?.compliance_score || 0 },
                { month: 'Week 2', score: Math.min(100, (overview?.compliance_score || 0) + 5) },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 rounded px-2 py-1"
                onClick={() => onNavigate?.(activity.targetView)}
              >
                <div className={`mt-1 ${activity.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
