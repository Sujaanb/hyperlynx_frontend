import React from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle2, Shield, Zap, TrendingUp, Filter } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useAnalysis, type GRCElement } from './AnalysisContext';

interface GapAssessmentProps {
  onNavigate: (view: string) => void;
}

export function GapAssessment({ onNavigate }: GapAssessmentProps) {
  const { analysisResults } = useAnalysis();
  const [selectedFramework, setSelectedFramework] = React.useState<string | null>(null);
  const [filterType, setFilterType] = React.useState<'all' | 'gaps' | 'controls' | 'requirements'>('all');

  if (!analysisResults) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        <Card className="p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analysis Results</h3>
          <p className="text-gray-600 mb-6">Please run compliance analysis first to view gap assessment.</p>
          <Button onClick={() => onNavigate('documents')}>Upload Documents & Analyze</Button>
        </Card>
      </div>
    );
  }

  // Separate elements by type
  const gaps = analysisResults.grcElements.filter((e) => e.type === 'gap');
  const controls = analysisResults.grcElements.filter((e) => e.type === 'control');
  const requirements = analysisResults.grcElements.filter((e) => e.type === 'requirement');

  // Filter by selected framework
  const filteredGaps = selectedFramework
    ? gaps.filter((g) => g.framework === selectedFramework)
    : gaps;

  const filteredControls = selectedFramework
    ? controls.filter((c) => c.framework === selectedFramework)
    : controls;

  const filteredRequirements = selectedFramework
    ? requirements.filter((r) => r.framework === selectedFramework)
    : requirements;

  // Get all unique frameworks
  const frameworks = Array.from(
    new Set(analysisResults.grcElements.map((e) => e.framework))
  ).filter(Boolean);

  // Apply type filter
  let displayElements: GRCElement[] = [];
  let displayTitle = '';

  switch (filterType) {
    case 'gaps':
      displayElements = filteredGaps;
      displayTitle = `Compliance Gaps (${filteredGaps.length})`;
      break;
    case 'controls':
      displayElements = filteredControls;
      displayTitle = `Controls Required (${filteredControls.length})`;
      break;
    case 'requirements':
      displayElements = filteredRequirements;
      displayTitle = `Requirements (${filteredRequirements.length})`;
      break;
    default:
      displayElements = [...filteredGaps, ...filteredControls, ...filteredRequirements];
      displayTitle = `All Elements (${displayElements.length})`;
  }

  // Prioritize elements
  const prioritizedElements = displayElements.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Gap Assessment</h1>
          </div>
          <p className="text-gray-600">
            Comprehensive compliance gaps and required controls for your organization
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <p className="text-sm text-red-700 font-medium">Critical Gaps</p>
              <p className="text-2xl font-bold text-red-600">
                {gaps.filter((g) => g.priority === 'high').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-blue-200 bg-blue-50">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-blue-700 font-medium">Controls Needed</p>
              <p className="text-2xl font-bold text-blue-600">{controls.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-green-200 bg-green-50">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-sm text-green-700 font-medium">Requirements</p>
              <p className="text-2xl font-bold text-green-600">{requirements.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-purple-200 bg-purple-50">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="h-6 w-6 text-purple-600" />
            <div>
              <p className="text-sm text-purple-700 font-medium">Total Elements</p>
              <p className="text-2xl font-bold text-purple-600">
                {gaps.length + controls.length + requirements.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter by Framework
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedFramework === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFramework(null)}
              >
                All Frameworks
              </Button>
              {frameworks.map((fw) => (
                <Button
                  key={fw}
                  variant={selectedFramework === fw ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFramework(fw)}
                >
                  {fw}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Filter by Type</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                All Types
              </Button>
              <Button
                variant={filterType === 'gaps' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('gaps')}
              >
                Gaps ({gaps.length})
              </Button>
              <Button
                variant={filterType === 'controls' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('controls')}
              >
                Controls ({controls.length})
              </Button>
              <Button
                variant={filterType === 'requirements' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('requirements')}
              >
                Requirements ({requirements.length})
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Elements List */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{displayTitle}</h2>

        {prioritizedElements.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No elements found for selected filters</p>
            <p className="text-sm text-gray-500">Try adjusting your filter selection</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prioritizedElements.map((element) => (
              <div
                key={element.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {element.type === 'gap' && (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                      {element.type === 'control' && (
                        <Shield className="h-5 w-5 text-blue-600" />
                      )}
                      {element.type === 'requirement' && (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                      <h3 className="text-lg font-semibold text-gray-900">{element.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 ml-7">{element.description}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Badge
                      className={`text-xs ${
                        element.type === 'gap'
                          ? 'bg-red-100 text-red-700'
                          : element.type === 'control'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {element.type}
                    </Badge>
                    <Badge
                      className={`text-xs ${
                        element.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : element.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {element.priority}
                    </Badge>
                  </div>
                </div>

                {/* Framework and Category */}
                <div className="flex items-center gap-4 text-sm text-gray-600 ml-7 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Framework:</span>
                    <Badge variant="secondary">{element.framework}</Badge>
                  </div>
                  {element.category && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Category:</span>
                      <span className="text-gray-700">{element.category}</span>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 ml-7">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                    element.status === 'compliant'
                      ? 'bg-green-100 text-green-700'
                      : element.status === 'partial'
                      ? 'bg-yellow-100 text-yellow-700'
                      : element.status === 'non-compliant'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {element.status === 'compliant' && <CheckCircle2 className="h-3 w-3" />}
                    {element.status === 'non-compliant' && <AlertTriangle className="h-3 w-3" />}
                    Status: {element.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 border-blue-200 bg-blue-50">
          <Zap className="h-6 w-6 text-blue-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Remediation Plan</h3>
          <p className="text-sm text-gray-700 mb-4">
            Create an action plan to address identified gaps and implement required controls
          </p>
          <Button onClick={() => onNavigate('home')} className="w-full">
            Create Remediation Plan
          </Button>
        </Card>

        <Card className="p-6 border-green-200 bg-green-50">
          <CheckCircle2 className="h-6 w-6 text-green-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Implementation Roadmap</h3>
          <p className="text-sm text-gray-700 mb-4">
            View prioritized timeline for control implementation and compliance milestones
          </p>
          <Button onClick={() => onNavigate('status')} variant="outline" className="w-full">
            View Roadmap
          </Button>
        </Card>
      </div>
    </div>
  );
}
