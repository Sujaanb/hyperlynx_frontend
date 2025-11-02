import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, TrendingUp, FileText, Shield, Server } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import type { ApplicabilityResults } from './ApplicabilityModule';

interface ReasoningModuleProps {
  applicabilityResults: ApplicabilityResults;
  onNavigate: (view: string) => void;
}

const frameworkReasons = {
  DORA: {
    fullName: 'Digital Operational Resilience Act',
    applicable: {
      reason: 'Your organization operates in the financial sector and handles financial data, making you subject to DORA requirements.',
      scope: [
        'Financial entities must establish robust ICT risk management frameworks',
        'Incident reporting to supervisory authorities within strict timelines',
        'Third-party ICT service provider oversight and risk management',
        'Digital operational resilience testing programs',
      ],
      keyRequirements: [
        { title: 'ICT Risk Management', description: 'Comprehensive framework for identifying and managing ICT risks', priority: 'high' },
        { title: 'Incident Response', description: 'Defined procedures and timelines for incident detection and response', priority: 'high' },
        { title: 'Digital Resilience Testing', description: 'Regular testing including threat-led penetration testing', priority: 'medium' },
        { title: 'Third-Party Risk', description: 'Due diligence and monitoring of ICT service providers', priority: 'high' },
      ],
    },
    partial: {
      reason: 'Some aspects of DORA may apply to your organization due to indirect financial services involvement.',
      scope: ['Limited ICT risk management requirements', 'Potential third-party oversight obligations'],
      keyRequirements: [],
    },
  },
  NIS2: {
    fullName: 'Network and Information Security Directive 2',
    applicable: {
      reason: 'Your organization provides essential services or operates critical infrastructure, falling under NIS2 scope.',
      scope: [
        'Cybersecurity risk management measures implementation',
        'Security incident reporting to national authorities',
        'Supply chain security and vendor risk assessment',
        'Business continuity and crisis management procedures',
      ],
      keyRequirements: [
        { title: 'Cybersecurity Governance', description: 'Board-level oversight and accountability for cybersecurity', priority: 'high' },
        { title: 'Incident Reporting', description: '24-hour incident notification to authorities for significant incidents', priority: 'high' },
        { title: 'Supply Chain Security', description: 'Security measures for suppliers and service providers', priority: 'medium' },
        { title: 'Business Continuity', description: 'Backup management and disaster recovery procedures', priority: 'medium' },
      ],
    },
    partial: {
      reason: 'Your organization may be classified as an important entity under NIS2 with proportionate obligations.',
      scope: ['Proportionate cybersecurity measures', 'Incident reporting for significant events'],
      keyRequirements: [],
    },
  },
  ISO27001: {
    fullName: 'Information Security Management System',
    applicable: {
      reason: 'Handling sensitive data and requiring structured information security management makes ISO27001 highly relevant.',
      scope: [
        'Systematic approach to managing sensitive information',
        'Risk assessment and treatment processes',
        'Information security policies and procedures',
        'Continuous improvement of security posture',
      ],
      keyRequirements: [
        { title: 'ISMS Establishment', description: 'Implement comprehensive information security management system', priority: 'high' },
        { title: 'Risk Assessment', description: 'Regular identification and evaluation of information security risks', priority: 'high' },
        { title: 'Security Controls', description: 'Implementation of Annex A controls as applicable', priority: 'medium' },
        { title: 'Internal Audits', description: 'Regular audits to ensure ISMS effectiveness', priority: 'low' },
      ],
    },
    partial: {
      reason: 'ISO27001 certification would strengthen your security posture though not legally mandated.',
      scope: ['Voluntary adoption for competitive advantage', 'Best practice security framework'],
      keyRequirements: [],
    },
  },
};

export function ReasoningModule({ applicabilityResults, onNavigate }: ReasoningModuleProps) {
  const [activeFramework, setActiveFramework] = useState<keyof typeof frameworkReasons>('DORA');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const applicableFrameworks = Object.entries(applicabilityResults)
    .filter(([key, status]) => key !== 'companyName' && status !== 'not-applicable')
    .map(([framework]) => framework as keyof typeof frameworkReasons);

  const getFrameworkData = (framework: keyof typeof frameworkReasons) => {
    const status = applicabilityResults[framework];
    const data = frameworkReasons[framework];
    return status === 'applicable' ? data.applicable : data.partial;
  };

  const currentFramework = frameworkReasons[activeFramework];
  const currentData = getFrameworkData(activeFramework);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          currentView="reasoning" 
          onNavigate={onNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-4 lg:p-8">
            <div className="mb-6 lg:mb-8">
              <h1 className="text-2xl lg:text-3xl mb-2">Compliance Reasoning & Scope</h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Understand why these frameworks apply to {applicabilityResults.companyName} and what's required
              </p>
            </div>

            <Tabs value={activeFramework} onValueChange={(v) => setActiveFramework(v as keyof typeof frameworkReasons)} className="space-y-6">
              <TabsList>
                {applicableFrameworks.map((framework) => (
                  <TabsTrigger key={framework} value={framework} className="gap-2">
                    {framework}
                    <Badge variant={applicabilityResults[framework] === 'applicable' ? 'default' : 'outline'}>
                      {applicabilityResults[framework] === 'applicable' ? 'Applicable' : 'Partial'}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>

              {applicableFrameworks.map((framework) => {
                const data = getFrameworkData(framework);
                const frameworkInfo = frameworkReasons[framework];
                
                return (
                  <TabsContent key={framework} value={framework} className="space-y-6">
                    <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                          <Info className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl mb-2">{frameworkInfo.fullName}</h3>
                          <p className="text-gray-700">{data.reason}</p>
                        </div>
                      </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl">Scope of Application</h3>
                        </div>
                        <ul className="space-y-3">
                          {data.scope.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>

                      <Card className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl">Compliance Status</h3>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm">Overall Readiness</span>
                              <span className="text-sm">65%</span>
                            </div>
                            <Progress value={65} />
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-2xl">12</div>
                              <div className="text-xs text-gray-600">Compliant</div>
                            </div>
                            <div className="text-center p-3 bg-amber-50 rounded-lg">
                              <div className="text-2xl">8</div>
                              <div className="text-xs text-gray-600">In Progress</div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {data.keyRequirements && data.keyRequirements.length > 0 && (
                      <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl">Key Requirements & Gaps</h3>
                        </div>

                        <div className="space-y-4">
                          {data.keyRequirements.map((req, index) => (
                            <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4>{req.title}</h4>
                                    <Badge
                                      variant={
                                        req.priority === 'high' ? 'destructive' :
                                        req.priority === 'medium' ? 'outline' :
                                        'secondary'
                                      }
                                      className="text-xs"
                                    >
                                      {req.priority} priority
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">{req.description}</p>
                                </div>
                                {req.priority === 'high' && (
                                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </Card>
                    )}

                    <Card className="p-6 bg-gray-50">
                      <div className="flex items-start gap-4">
                        <Server className="w-6 h-6 text-gray-600" />
                        <div>
                          <h4 className="mb-2">Next Steps</h4>
                          <p className="text-sm text-gray-700 mb-4">
                            Based on this analysis, we recommend prioritizing high-priority requirements 
                            and addressing compliance gaps systematically. Our Copilot can help you create 
                            an action plan and provide guidance on implementation.
                          </p>
                          <Button onClick={() => onNavigate('copilot')} className="gap-2">
                            Get AI Guidance
                            <TrendingUp className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
