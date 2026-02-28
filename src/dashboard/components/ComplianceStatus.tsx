import React, { useState } from 'react';
import { Shield, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ComplianceGauge } from './ComplianceGauge';

interface ComplianceStatusProps {
  onNavigate: (view: string) => void;
}

const frameworkStatuses = [
  {
    name: 'DORA',
    fullName: 'Digital Operational Resilience Act',
    compliance: 45,
    status: 'in-progress',
    dueDate: '2025-01-17',
    controls: { total: 120, implemented: 54, inProgress: 32, pending: 34 },
    lastUpdated: '2026-02-20',
  },
  {
    name: 'NIS2',
    fullName: 'Network and Information Security Directive',
    compliance: 62,
    status: 'in-progress',
    dueDate: '2025-10-17',
    controls: { total: 85, implemented: 53, inProgress: 18, pending: 14 },
    lastUpdated: '2026-02-22',
  },
  {
    name: 'ISO 27001',
    fullName: 'Information Security Management',
    compliance: 78,
    status: 'active',
    dueDate: '2026-06-30',
    controls: { total: 114, implemented: 89, inProgress: 15, pending: 10 },
    lastUpdated: '2026-02-23',
  },
  {
    name: 'GDPR',
    fullName: 'General Data Protection Regulation',
    compliance: 85,
    status: 'active',
    dueDate: null,
    controls: { total: 48, implemented: 41, inProgress: 5, pending: 2 },
    lastUpdated: '2026-02-21',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getComplianceColor = (compliance: number) => {
  if (compliance >= 80) return 'text-green-600';
  if (compliance >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export function ComplianceStatus({ onNavigate }: ComplianceStatusProps) {
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);

  const overallCompliance = Math.round(
    frameworkStatuses.reduce((sum, f) => sum + f.compliance, 0) / frameworkStatuses.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Status</h1>
          <p className="text-gray-600 mt-1">Track compliance across all frameworks</p>
        </div>
        <Button onClick={() => onNavigate('home')} variant="outline">
          View Dashboard
        </Button>
      </div>

      {/* Overall Status Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Overall Compliance</h2>
                <p className="text-gray-600 text-sm">Across all active frameworks</p>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-bold ${getComplianceColor(overallCompliance)}`}>
                {overallCompliance}%
              </span>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">+5% this month</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <ComplianceGauge compliance={overallCompliance} size={160} />
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Implemented</p>
              <p className="text-2xl font-bold text-gray-900">237</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">70</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">60</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Controls</p>
              <p className="text-2xl font-bold text-gray-900">367</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Framework Status Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Framework Status</h2>
        {frameworkStatuses.map((framework) => (
          <Card
            key={framework.name}
            className="p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedFramework(framework.name)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{framework.name}</h3>
                  <Badge className={getStatusColor(framework.status)}>
                    {framework.status.replace('-', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">{framework.fullName}</p>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Compliance Progress</span>
                    <span className={`font-semibold ${getComplianceColor(framework.compliance)}`}>
                      {framework.compliance}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        framework.compliance >= 80
                          ? 'bg-green-600'
                          : framework.compliance >= 60
                          ? 'bg-yellow-600'
                          : 'bg-red-600'
                      }`}
                      style={{ width: `${framework.compliance}%` }}
                    />
                  </div>
                </div>

                {/* Controls Breakdown */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-500">Implemented</p>
                    <p className="text-lg font-semibold text-green-600">
                      {framework.controls.implemented}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">In Progress</p>
                    <p className="text-lg font-semibold text-yellow-600">
                      {framework.controls.inProgress}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pending</p>
                    <p className="text-lg font-semibold text-red-600">
                      {framework.controls.pending}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date(framework.lastUpdated).toLocaleDateString()}
                  </div>
                  {framework.dueDate && (
                    <div className="text-sm text-gray-500">
                      Due: {new Date(framework.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <ComplianceGauge compliance={framework.compliance} size={100} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 border-blue-200 bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Start New Assessment</h3>
          <p className="text-gray-600 text-sm mb-4">
            Run a comprehensive compliance assessment using AI-powered analysis
          </p>
          <Button onClick={() => onNavigate('home')} className="w-full">
            Start Assessment
          </Button>
        </Card>
        <Card className="p-6 border-purple-200 bg-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">View Issues</h3>
          <p className="text-gray-600 text-sm mb-4">
            Review and address compliance gaps and open issues
          </p>
          <Button onClick={() => onNavigate('issues')} variant="outline" className="w-full">
            View All Issues
          </Button>
        </Card>
      </div>
    </div>
  );
}
