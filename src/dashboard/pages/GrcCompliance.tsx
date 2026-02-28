import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Clock, Shield, Plus, X, ChevronRight, Target } from 'lucide-react';
import { Progress } from '../components/ui/progress';
import { hyperlynxApi } from '../services/hyperlynxApi';

interface Framework {
  id: string;
  name: string;
  ref_id: string;
  description?: string;
}

interface EnabledFramework {
  id: number;
  framework_id: string;
  compliance_score?: number;
}

const mockFrameworkStats: Record<string, any> = {
  'NIST-CSF-2.0': {
    controls: 117,
    implemented: 91,
    partial: 18,
    notStarted: 8,
    readiness: 78,
    gaps: [
      {
        id: 'gov-001',
        title: 'Establish Cybersecurity Governance',
        category: 'Govern',
        status: 'not-started',
        priority: 'critical',
        description: 'Board and leadership need formal cybersecurity governance responsibilities.',
        requiredControls: [
          'Appoint Chief Information Security Officer (CISO)',
          'Establish cybersecurity committee or governance body',
          'Define clear cybersecurity accountability',
          'Create cybersecurity strategic plan',
        ],
        estimatedEffort: '8-12 weeks',
        businessImpact: 'Essential for regulatory compliance and risk management',
      },
      {
        id: 'id-004',
        title: 'Asset Management Enhancement',
        category: 'Identify',
        status: 'partial',
        priority: 'high',
        description: 'Need to complete inventory of all IT assets and data resources.',
        requiredControls: [
          'Maintain authoritative asset inventory',
          'Tag and classify all hardware and software',
          'Track asset lifecycle (acquisition to retirement)',
          'Document critical dependencies',
        ],
        estimatedEffort: '6-8 weeks',
        businessImpact: 'Foundation for all other security controls',
      },
      {
        id: 'protect-006',
        title: 'Secure Endpoints',
        category: 'Protect',
        status: 'partial',
        priority: 'high',
        description: 'Endpoint detection and response (EDR) needs enhancement.',
        requiredControls: [
          'Deploy EDR solution to all endpoints',
          'Implement patch management automation',
          'Enable disk encryption on all devices',
          'Deploy endpoint firewall',
        ],
        estimatedEffort: '4-6 weeks',
        businessImpact: 'Reduces malware and data breach risk by 70%+',
      },
      {
        id: 'detect-008',
        title: 'Security Monitoring & Analytics',
        category: 'Detect',
        status: 'not-started',
        priority: 'critical',
        description: 'Implement 24/7 security event monitoring.',
        requiredControls: [
          'Deploy Security Information and Event Management (SIEM)',
          'Configure log collection from all systems',
          'Create detection rules for common attacks',
          'Establish Security Operations Center (SOC) procedures',
        ],
        estimatedEffort: '12-16 weeks',
        businessImpact: 'Reduces mean time to detect (MTTD) from days to minutes',
      },
      {
        id: 'respond-003',
        title: 'Incident Response Readiness',
        category: 'Respond',
        status: 'partial',
        priority: 'high',
        description: 'Need formal incident response planning and testing.',
        requiredControls: [
          'Create incident response plan document',
          'Conduct tabletop exercises quarterly',
          'Establish incident classification scheme',
          'Create playbooks for common incident types',
          'Test backup restoration procedures',
        ],
        estimatedEffort: '6-10 weeks',
        businessImpact: 'Reduces incident impact and recovery time significantly',
      },
      {
        id: 'recover-002',
        title: 'Resilience & Continuity',
        category: 'Recover',
        status: 'not-started',
        priority: 'high',
        description: 'Establish business continuity and disaster recovery.',
        requiredControls: [
          'Define Recovery Time Objective (RTO) and Recovery Point Objective (RPO)',
          'Implement offsite backup systems',
          'Test recovery procedures at least annually',
          'Maintain incident recovery toolkit',
        ],
        estimatedEffort: '8-12 weeks',
        businessImpact: 'Ensures business survives critical incidents',
      },
    ],
  },
  'ISO-27001': {
    controls: 93,
    implemented: 60,
    partial: 22,
    notStarted: 11,
    readiness: 65,
    gaps: [
      {
        id: 'iso-a5',
        title: 'Policies & Procedures Documentation',
        category: 'Organization',
        status: 'partial',
        priority: 'high',
        description: 'Complete information security policy framework.',
        requiredControls: [
          'Create comprehensive security policy',
          'Document access control procedures',
          'Establish incident handling procedures',
          'Create asset classification guidelines',
        ],
        estimatedEffort: '4-6 weeks',
        businessImpact: 'Foundation for audit readiness',
      },
      {
        id: 'iso-a6',
        title: 'Personnel Security',
        category: 'People',
        status: 'not-started',
        priority: 'medium',
        description: 'Implement background vetting for all staff.',
        requiredControls: [
          'Conduct background checks on hiring',
          'Implement security awareness training',
          'Define confidentiality agreements requirements',
          'Track security training completion',
        ],
        estimatedEffort: '3-4 weeks',
        businessImpact: 'Reduces insider threat risks',
      },
      {
        id: 'iso-a7',
        title: 'Access Control Implementation',
        category: 'Technology',
        status: 'partial',
        priority: 'critical',
        description: 'Complete role-based access control (RBAC) deployment.',
        requiredControls: [
          'Implement RBAC across all systems',
          'Enforce multi-factor authentication (MFA)',
          'Regular access reviews and certification',
          'Privileged access management (PAM)',
        ],
        estimatedEffort: '8-10 weeks',
        businessImpact: 'Critical for data protection',
      },
    ],
  },
  'GDPR': {
    controls: 72,
    implemented: 59,
    partial: 8,
    notStarted: 5,
    readiness: 82,
    gaps: [
      {
        id: 'gdpr-001',
        title: 'Data Processing Agreements',
        category: 'Contracts',
        status: 'partial',
        priority: 'high',
        description: 'Ensure all processors have signed Data Processing Agreements.',
        requiredControls: [
          'Audit all third-party processors',
          'Update processor agreements to GDPR standard clauses',
          'Document all sub-processors',
          'Annual processor compliance audits',
        ],
        estimatedEffort: '4-6 weeks',
        businessImpact: 'Required for legal compliance',
      },
      {
        id: 'gdpr-002',
        title: 'Data Subject Rights Processing',
        category: 'Operations',
        status: 'not-started',
        priority: 'critical',
        description: 'Implement process to handle subject access requests (SARs).',
        requiredControls: [
          'Create SAR request handling process',
          'Train team on response procedures',
          'Document response timelines (30 days)',
          'Create response templates and validation',
        ],
        estimatedEffort: '2-3 weeks',
        businessImpact: 'Required for GDPR compliance',
      },
    ],
  },
};

export function GrcCompliance({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [enabledFrameworks, setEnabledFrameworks] = useState<EnabledFramework[]>([]);
  const [loadingFrameworks, setLoadingFrameworks] = useState(true);
  const [enablingFramework, setEnablingFramework] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFrameworkRefId, setSelectedFrameworkRefId] = useState<string | null>(null);

  useEffect(() => {
    fetchFrameworks();
  }, []);

  const fetchFrameworks = async () => {
    try {
      setLoadingFrameworks(true);
      const data = await hyperlynxApi.getFrameworks();
      setFrameworks(data.results || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load frameworks');
      console.error('Frameworks fetch error:', err);
    } finally {
      setLoadingFrameworks(false);
    }
  };

  const handleEnableFramework = async (frameworkId: string) => {
    try {
      setEnablingFramework(frameworkId);
      await hyperlynxApi.enableFramework(frameworkId);
      await fetchFrameworks();
    } catch (err) {
      console.error('Enable framework error:', err);
    } finally {
      setEnablingFramework(null);
    }
  };

  const isFrameworkEnabled = (frameworkId: string) => {
    return frameworks.some((f) => f.id === frameworkId);
  };

  if (loadingFrameworks) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-96"></div>
        </div>
      </div>
    );
  }

  const overallReadiness = frameworks.length > 0
    ? Math.round(frameworks.reduce((sum, fw) => sum + (mockFrameworkStats[fw.ref_id]?.readiness || 0), 0) / frameworks.length)
    : 0;

  const implementedCount = frameworks.reduce((sum, fw) => sum + (mockFrameworkStats[fw.ref_id]?.implemented || 0), 0);
  const gapsCount = frameworks.reduce((sum, fw) => sum + (mockFrameworkStats[fw.ref_id]?.notStarted || 0), 0);

  if (selectedFrameworkRefId) {
    const selectedFramework = frameworks.find((f) => f.ref_id === selectedFrameworkRefId);
    return (
      <FrameworkDetailModal
        frameworkRefId={selectedFrameworkRefId}
        frameworkName={selectedFramework?.name || selectedFrameworkRefId}
        stats={mockFrameworkStats[selectedFrameworkRefId]}
        onClose={() => setSelectedFrameworkRefId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
        <p className="text-gray-600 text-sm mt-1">Track compliance progress across all enabled frameworks</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-semibold">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition"
          onClick={() => onNavigate?.('overview')}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Overall Readiness</p>
              <p className="text-2xl font-bold text-gray-900">{overallReadiness}%</p>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition"
          onClick={() => onNavigate?.('controls')}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Implemented</p>
              <p className="text-2xl font-bold text-gray-900">{implementedCount}</p>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition"
          onClick={() => onNavigate?.('gap-analysis')}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Gaps Remaining</p>
              <p className="text-2xl font-bold text-gray-900">{gapsCount}</p>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition"
          onClick={() => onNavigate?.('audits')}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Audit Ready</p>
              <p className="text-2xl font-bold text-gray-900">{frameworks.filter((f) => (mockFrameworkStats[f.ref_id]?.readiness || 0) >= 70).length} of {frameworks.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Framework Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Active Frameworks</h2>
          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {frameworks.length} enabled
          </span>
        </div>

        {frameworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {frameworks.map((fw) => {
              const stats = mockFrameworkStats[fw.ref_id] || {
                controls: 0,
                implemented: 0,
                partial: 0,
                notStarted: 0,
                readiness: 0,
              };

              return (
                <div
                  key={fw.id}
                  onClick={() => setSelectedFrameworkRefId(fw.ref_id)}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{fw.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{fw.ref_id}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                      stats.readiness >= 70
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {stats.readiness >= 70 ? 'Audit Ready' : 'In Progress'}
                    </span>
                  </div>

                  {/* Readiness Score */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Readiness Score</span>
                      <span className="font-semibold text-sm text-gray-900">{stats.readiness}%</span>
                    </div>
                    <Progress value={stats.readiness} className="h-2" />
                  </div>

                  {/* Control Status Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-3 text-center">
                      <p className="text-lg font-bold text-green-700">{stats.implemented}</p>
                      <p className="text-[10px] text-green-600 font-medium mt-1">Implemented</p>
                    </div>
                    <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 text-center">
                      <p className="text-lg font-bold text-yellow-700">{stats.partial}</p>
                      <p className="text-[10px] text-yellow-600 font-medium mt-1">Partial</p>
                    </div>
                    <div className="rounded-lg bg-gradient-to-br from-red-50 to-red-100 p-3 text-center">
                      <p className="text-lg font-bold text-red-700">{stats.notStarted}</p>
                      <p className="text-[10px] text-red-600 font-medium mt-1">Not Started</p>
                    </div>
                  </div>

                  {/* Click indicator */}
                  <div className="text-xs text-blue-600 font-medium flex items-center justify-end gap-1 pt-2 border-t border-gray-100">
                    View Details <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No frameworks enabled yet</p>
            <p className="text-sm text-gray-500 mt-1">Select a framework below to get started</p>
          </div>
        )}
      </div>

      {/* Available Frameworks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Available Frameworks</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {frameworks.length < 4 && (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6 text-center hover:shadow-md transition cursor-pointer">
              <div className="h-12 w-12 rounded-lg bg-purple-200 flex items-center justify-center mx-auto mb-3">
                <Plus className="h-6 w-6 text-purple-700" />
              </div>
              <p className="font-medium text-purple-900">Add More Frameworks</p>
              <p className="text-xs text-purple-700 mt-1">Expand your compliance coverage</p>
            </div>
          )}

          {['NIST-CSF-2.0', 'ISO-27001', 'GDPR'].map((refId) => {
            const framework = frameworks.find((f) => f.ref_id === refId);
            if (framework) return null;

            const names: Record<string, string> = {
              'NIST-CSF-2.0': 'NIST Cybersecurity Framework v2.0',
              'ISO-27001': 'ISO/IEC 27001:2022',
              'GDPR': 'General Data Protection Regulation',
            };

            return (
              <div key={refId} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
                <h3 className="text-base font-semibold text-gray-900 mb-2">{names[refId]}</h3>
                <p className="text-xs text-gray-600 mb-4">
                  {refId === 'NIST-CSF-2.0'
                    ? 'Manage cybersecurity risk with NIST guidance'
                    : refId === 'ISO-27001'
                      ? 'Information security management system'
                      : 'Privacy and data protection requirements'}
                </p>
                <button
                  onClick={() => handleEnableFramework(refId)}
                  disabled={enablingFramework === refId}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition text-sm font-medium"
                >
                  {enablingFramework === refId ? 'Enabling...' : 'Enable'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal - Framework Gaps & Controls */}
      {selectedFrameworkRefId && (
        <FrameworkDetailModal
          frameworkRefId={selectedFrameworkRefId}
          frameworkName={frameworks.find((f) => f.ref_id === selectedFrameworkRefId)?.name || ''}
          stats={mockFrameworkStats[selectedFrameworkRefId]}
          onClose={() => setSelectedFrameworkRefId(null)}
        />
      )}
    </div>
  );
}

/**
 * Modal component showing detailed gap analysis and required controls
 */
function FrameworkDetailModal({
  frameworkRefId,
  frameworkName,
  stats,
  onClose,
}: {
  frameworkRefId: string;
  frameworkName: string;
  stats: any;
  onClose: () => void;
}) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'not-started' | 'partial'>('all');

  if (!stats) {
    return null;
  }

  const gaps = stats.gaps || [];
  const filteredGaps = filterStatus === 'all' ? gaps : gaps.filter((g: any) => g.status === filterStatus);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not-started':
        return '⭕';
      case 'partial':
        return '⚠️';
      default:
        return '✅';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{frameworkName}</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">{frameworkRefId} • Gap Analysis & Required Controls</p>
        </div>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
        >
          <X className="h-4 w-4 text-gray-600" />
          Close
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-700">{stats.implemented}</p>
              <p className="text-xs text-green-600 font-medium mt-1">Implemented</p>
              <p className="text-[10px] text-green-600 mt-2">{Math.round((stats.implemented / stats.controls) * 100)}% of controls</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-2xl font-bold text-red-700">{stats.notStarted + stats.partial}</p>
              <p className="text-xs text-red-600 font-medium mt-1">Action Needed</p>
              <p className="text-[10px] text-red-600 mt-2">{((stats.notStarted + stats.partial) / stats.controls * 100).toFixed(0)}% of controls</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Gaps ({gaps.length})
            </button>
            <button
              onClick={() => setFilterStatus('not-started')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'not-started'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Not Started ({gaps.filter((g: any) => g.status === 'not-started').length})
            </button>
            <button
              onClick={() => setFilterStatus('partial')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'partial'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Partial ({gaps.filter((g: any) => g.status === 'partial').length})
            </button>
          </div>

          {/* Gaps List */}
          <div className="space-y-4">
            {filteredGaps.length > 0 ? (
              filteredGaps.map((gap: any) => (
                <div key={gap.id} className={`border rounded-lg p-4 ${getPriorityColor(gap.priority)}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-xl mt-1">{getStatusIcon(gap.status)}</div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{gap.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityBadgeColor(gap.priority)}`}>
                          {gap.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs opacity-90 mb-3">{gap.description}</p>

                      {/* Category & Effort */}
                      <div className="flex flex-wrap gap-4 mb-3 text-xs">
                        <div>
                          <p className="font-medium">Category:</p>
                          <p className="text-opacity-80">{gap.category}</p>
                        </div>
                        <div>
                          <p className="font-medium">Est. Effort:</p>
                          <p className="text-opacity-80">{gap.estimatedEffort}</p>
                        </div>
                      </div>

                      {/* Business Impact */}
                      <div className="mb-3 p-2 bg-black bg-opacity-10 rounded">
                        <p className="text-xs font-medium flex items-center gap-1 mb-1">
                          <Target className="h-3 w-3" /> Business Impact
                        </p>
                        <p className="text-xs text-opacity-90">{gap.businessImpact}</p>
                      </div>

                      {/* Required Controls */}
                      <div>
                        <p className="text-xs font-semibold mb-2">Required Controls:</p>
                        <ul className="space-y-1">
                          {gap.requiredControls.map((control: string, idx: number) => (
                            <li key={idx} className="text-xs flex gap-2">
                              <span className="font-semibold">•</span>
                              <span>{control}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">All gaps completed!</p>
                <p className="text-xs text-gray-500 mt-1">No gaps found in this category.</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition text-sm">
              Create Implementation Plan
            </button>
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition text-sm">
              Export Gap Report
            </button>
          </div>
      </div>
    </div>
  );
}
