import React, { useState } from 'react';
import { AlertTriangle, Filter, Search, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface IssuesOverviewProps {
  onNavigate: (view: string) => void;
}

const issues = [
  {
    id: 1,
    title: 'Incident response times not defined',
    framework: 'DORA',
    severity: 'critical',
    category: 'Incident Management',
    description: 'No documented SLAs for incident detection, response, and resolution timelines',
    impact: 'Non-compliance with DORA Article 17 requirements',
    affectedSystems: ['All ICT systems', 'Financial trading platforms'],
    dueDate: '2025-11-01',
    status: 'open',
  },
  {
    id: 2,
    title: 'ICT risk assessment framework incomplete',
    framework: 'DORA',
    severity: 'critical',
    category: 'Risk Management',
    description: 'Current risk assessment lacks coverage of all ICT systems and third-party dependencies',
    impact: 'Inadequate identification of ICT-related risks',
    affectedSystems: ['Cloud infrastructure', 'Third-party integrations'],
    dueDate: '2025-11-15',
    status: 'in-progress',
  },
  {
    id: 3,
    title: 'Security incident reporting process unclear',
    framework: 'NIS2',
    severity: 'high',
    category: 'Incident Reporting',
    description: 'Missing clear escalation procedures and notification timelines to authorities',
    impact: 'Risk of non-compliance with NIS2 incident reporting obligations',
    affectedSystems: ['Security Operations Center'],
    dueDate: '2025-10-30',
    status: 'open',
  },
  {
    id: 4,
    title: 'Third-party vendor agreements lack security SLAs',
    framework: 'DORA',
    severity: 'high',
    category: 'Vendor Management',
    description: 'Vendor contracts missing specific security and resilience requirements',
    impact: 'Insufficient oversight of critical ICT service providers',
    affectedSystems: ['Payment processing', 'Data storage services'],
    dueDate: '2025-11-20',
    status: 'in-progress',
  },
  {
    id: 5,
    title: 'Supply chain security measures insufficient',
    framework: 'NIS2',
    severity: 'medium',
    category: 'Supply Chain',
    description: 'Lack of comprehensive security assessment for supply chain partners',
    impact: 'Potential vulnerabilities through supply chain',
    affectedSystems: ['Vendor systems', 'External APIs'],
    dueDate: '2025-12-01',
    status: 'open',
  },
  {
    id: 6,
    title: 'Business continuity plan needs update',
    framework: 'DORA',
    severity: 'medium',
    category: 'Resilience',
    description: 'BCP documentation outdated and not tested regularly',
    impact: 'Inadequate preparedness for major disruptions',
    affectedSystems: ['All business operations'],
    dueDate: '2025-11-25',
    status: 'open',
  },
  {
    id: 7,
    title: 'Asset inventory not fully documented',
    framework: 'ISO27001',
    severity: 'low',
    category: 'Asset Management',
    description: 'Cloud assets and shadow IT not included in inventory',
    impact: 'Incomplete view of information assets',
    affectedSystems: ['Cloud infrastructure'],
    dueDate: '2025-12-01',
    status: 'in-progress',
  },
  {
    id: 8,
    title: 'Vulnerability management policy outdated',
    framework: 'NIS2',
    severity: 'low',
    category: 'Security',
    description: 'Policy does not reflect current threat landscape',
    impact: 'Suboptimal vulnerability handling procedures',
    affectedSystems: ['IT infrastructure'],
    dueDate: '2025-12-10',
    status: 'open',
  },
];

export function IssuesOverview({ onNavigate }: IssuesOverviewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [frameworkFilter, setFrameworkFilter] = useState('all');

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || issue.severity === severityFilter;
    const matchesFramework = frameworkFilter === 'all' || issue.framework === frameworkFilter;
    return matchesSearch && matchesSeverity && matchesFramework;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const highCount = issues.filter(i => i.severity === 'high').length;
  const openCount = issues.filter(i => i.status === 'open').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl lg:text-3xl mb-2">Issues Overview</h2>
        <p className="text-gray-600 text-sm lg:text-base">
          Track and manage compliance gaps across all frameworks
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 lg:p-6 border-l-4 border-l-red-500">
          <div className="text-2xl lg:text-3xl mb-1">{criticalCount}</div>
          <p className="text-xs lg:text-sm text-gray-600">Critical Issues</p>
        </Card>
        <Card className="p-4 lg:p-6 border-l-4 border-l-orange-500">
          <div className="text-2xl lg:text-3xl mb-1">{highCount}</div>
          <p className="text-xs lg:text-sm text-gray-600">High Priority</p>
        </Card>
        <Card className="p-4 lg:p-6 border-l-4 border-l-blue-500">
          <div className="text-2xl lg:text-3xl mb-1">{openCount}</div>
          <p className="text-xs lg:text-sm text-gray-600">Open Issues</p>
        </Card>
      </div>

      <Card className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={frameworkFilter} onValueChange={setFrameworkFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frameworks</SelectItem>
                <SelectItem value="DORA">DORA</SelectItem>
                <SelectItem value="NIS2">NIS2</SelectItem>
                <SelectItem value="ISO27001">ISO27001</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <Card key={issue.id} className="p-4 lg:p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start gap-2 mb-3">
                    <div className={`w-1 h-6 rounded ${
                      issue.severity === 'critical' ? 'bg-red-500' :
                      issue.severity === 'high' ? 'bg-orange-500' :
                      issue.severity === 'medium' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm lg:text-base mb-2">{issue.title}</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{issue.framework}</Badge>
                        <Badge className={`text-xs ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">{issue.category}</Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs lg:text-sm text-gray-600 mb-2">{issue.description}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Impact: {issue.impact}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <span>Due: {new Date(issue.dueDate).toLocaleDateString()}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="capitalize">{issue.status.replace('-', ' ')}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-1">Affected Systems:</p>
                    <div className="flex flex-wrap gap-1">
                      {issue.affectedSystems.map((system, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {system}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="self-start">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No issues found matching your filters</p>
          </div>
        )}
      </Card>
    </div>
  );
}
