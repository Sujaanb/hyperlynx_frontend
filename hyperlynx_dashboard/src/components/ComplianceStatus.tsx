import React from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ComplianceGauge } from './ComplianceGauge';

interface ComplianceStatusProps {
  onNavigate: (view: string) => void;
}

const frameworkStatus = [
  {
    name: 'DORA',
    fullName: 'Digital Operational Resilience Act',
    currentScore: 68,
    previousScore: 62,
    trend: 'up',
    lastUpdated: '2025-10-15',
    controls: {
      total: 20,
      compliant: 12,
      partial: 5,
      nonCompliant: 3,
    },
    categories: [
      { name: 'ICT Risk Management', score: 70, status: 'in-progress' },
      { name: 'Incident Response', score: 45, status: 'needs-attention' },
      { name: 'Third-Party Risk', score: 60, status: 'in-progress' },
      { name: 'Digital Resilience Testing', score: 80, status: 'good' },
      { name: 'Information Sharing', score: 75, status: 'good' },
    ],
    recentActivity: [
      { date: '2025-10-15', activity: 'Updated incident response procedures', type: 'improvement' },
      { date: '2025-10-10', activity: 'Completed vendor risk assessment', type: 'completion' },
      { date: '2025-10-05', activity: 'Gap identified in testing framework', type: 'issue' },
    ],
  },
  {
    name: 'NIS2',
    fullName: 'Network and Information Security Directive 2',
    currentScore: 75,
    previousScore: 75,
    trend: 'stable',
    lastUpdated: '2025-10-12',
    controls: {
      total: 15,
      compliant: 10,
      partial: 3,
      nonCompliant: 2,
    },
    categories: [
      { name: 'Cybersecurity Governance', score: 85, status: 'good' },
      { name: 'Incident Reporting', score: 60, status: 'in-progress' },
      { name: 'Supply Chain Security', score: 70, status: 'in-progress' },
      { name: 'Business Continuity', score: 80, status: 'good' },
      { name: 'Network Security', score: 75, status: 'good' },
    ],
    recentActivity: [
      { date: '2025-10-12', activity: 'Board approved cybersecurity strategy', type: 'improvement' },
      { date: '2025-10-08', activity: 'Supply chain assessment initiated', type: 'in-progress' },
      { date: '2025-10-01', activity: 'Updated incident notification process', type: 'improvement' },
    ],
  },
  {
    name: 'ISO27001',
    fullName: 'Information Security Management System',
    currentScore: 82,
    previousScore: 78,
    trend: 'up',
    lastUpdated: '2025-10-18',
    controls: {
      total: 114,
      compliant: 85,
      partial: 20,
      nonCompliant: 9,
    },
    categories: [
      { name: 'Organization Security', score: 90, status: 'good' },
      { name: 'Asset Management', score: 75, status: 'in-progress' },
      { name: 'Access Control', score: 85, status: 'good' },
      { name: 'Cryptography', score: 70, status: 'in-progress' },
      { name: 'Physical Security', score: 95, status: 'excellent' },
      { name: 'Operations Security', score: 80, status: 'good' },
    ],
    recentActivity: [
      { date: '2025-10-18', activity: 'Internal audit completed successfully', type: 'completion' },
      { date: '2025-10-14', activity: 'Asset inventory updated', type: 'improvement' },
      { date: '2025-10-10', activity: 'New security controls implemented', type: 'improvement' },
    ],
  },
];

export function ComplianceStatus({ onNavigate }: ComplianceStatusProps) {
  const overallScore = Math.round(
    frameworkStatus.reduce((sum, f) => sum + f.currentScore, 0) / frameworkStatus.length
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl lg:text-3xl mb-2">Compliance Status</h2>
        <p className="text-gray-600 text-sm lg:text-base">
          Monitor progress across all compliance frameworks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-4 lg:p-6 flex flex-col items-center justify-center">
          <ComplianceGauge score={overallScore} size="md" />
          <p className="text-xs lg:text-sm text-gray-600 mt-3">Overall Compliance</p>
        </Card>

        <Card className="p-4 lg:p-6">
          <div className="flex items-center gap-3 whitespace-nowrap">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center gap-1">
              <div className="text-2xl lg:text-3xl">{frameworkStatus.length}</div>
              <p className="text-xs lg:text-sm text-gray-600">Active Frameworks</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-6">
          <div className="flex items-center gap-3 whitespace-nowrap">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-center gap-1">
              <div className="text-2xl lg:text-3xl">
                {frameworkStatus.filter(f => f.trend === 'up').length}
              </div>
              <p className="text-xs lg:text-sm text-gray-600">Improving</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-6">
          <div className="flex items-center gap-3 whitespace-nowrap">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex items-center gap-1">
              <div className="text-2xl lg:text-3xl">
                {frameworkStatus.reduce((sum, f) => sum + f.controls.nonCompliant, 0)}
              </div>
              <p className="text-xs lg:text-sm text-gray-600">Non-Compliant</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="DORA" className="space-y-6">
        <TabsList className="w-full !w-full justify-start overflow-x-auto flex-nowrap !flex-nowrap !inline-flex">
          {frameworkStatus.map((framework) => (
            <TabsTrigger key={framework.name} value={framework.name} className="whitespace-nowrap">
              {framework.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {frameworkStatus.map((framework) => (
          <TabsContent key={framework.name} value={framework.name} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-4 lg:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg lg:text-xl mb-1">{framework.fullName}</h3>
                    <p className="text-xs lg:text-sm text-gray-600">
                      Last updated: {new Date(framework.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {framework.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-600" />}
                    {framework.trend === 'down' && <TrendingDown className="w-5 h-5 text-red-600" />}
                    {framework.trend === 'stable' && <Minus className="w-5 h-5 text-gray-600" />}
                    <span className="text-sm">
                      {framework.currentScore > framework.previousScore ? '+' : ''}
                      {framework.currentScore - framework.previousScore}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center my-6">
                  <ComplianceGauge score={framework.currentScore} framework={framework.name} size="lg" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl lg:text-2xl">{framework.controls.compliant}</div>
                    <div className="text-xs text-gray-600">Compliant</div>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded-lg">
                    <div className="text-xl lg:text-2xl">{framework.controls.partial}</div>
                    <div className="text-xs text-gray-600">Partial</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-xl lg:text-2xl">{framework.controls.nonCompliant}</div>
                    <div className="text-xs text-gray-600">Non-Compliant</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 lg:p-6">
                <h4 className="mb-4 text-base lg:text-lg">Control Categories</h4>
                <div className="space-y-4">
                  {framework.categories.map((category, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs lg:text-sm">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              category.status === 'excellent' ? 'default' :
                              category.status === 'good' ? 'outline' :
                              category.status === 'in-progress' ? 'secondary' :
                              'destructive'
                            }
                            className="text-xs"
                          >
                            {category.score}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={category.score} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-4 lg:p-6">
              <h4 className="mb-4 text-base lg:text-lg">Recent Activity</h4>
              <div className="space-y-3">
                {framework.recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100">
                      {activity.type === 'completion' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {activity.type === 'improvement' && <TrendingUp className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'issue' && <AlertCircle className="w-4 h-4 text-amber-600" />}
                      {activity.type === 'in-progress' && <Clock className="w-4 h-4 text-gray-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs lg:text-sm">{activity.activity}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
