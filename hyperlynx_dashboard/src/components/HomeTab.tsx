import React from 'react';
import { CheckCircle, AlertCircle, Clock, FileText, Shield, Server, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

interface HomeTabProps {
  onNavigate: (view: string) => void;
}

const applicableFrameworks = [
  { 
    name: 'DORA', 
    fullName: 'Digital Operational Resilience Act',
    status: 'applicable',
    progress: 68,
    icon: Shield,
    requirements: 'ICT risk management, incident response, third-party oversight',
    deadline: 'January 17, 2025',
  },
  { 
    name: 'NIS2', 
    fullName: 'Network and Information Security Directive 2',
    status: 'partial',
    progress: 75,
    icon: Server,
    requirements: 'Cybersecurity measures, incident reporting, supply chain security',
    deadline: 'October 17, 2024',
  },
  { 
    name: 'ISO27001', 
    fullName: 'Information Security Management System',
    status: 'applicable',
    progress: 82,
    icon: FileText,
    requirements: 'ISMS implementation, risk assessment, security controls',
    deadline: 'Ongoing certification',
  },
];

const recentTasks = [
  { 
    id: 1, 
    title: 'Define incident response time SLAs', 
    framework: 'DORA', 
    priority: 'high',
    status: 'pending',
    dueDate: '2025-11-01',
  },
  { 
    id: 2, 
    title: 'Update ICT risk assessment framework', 
    framework: 'DORA', 
    priority: 'high',
    status: 'in-progress',
    dueDate: '2025-11-15',
    progress: 45,
  },
  { 
    id: 3, 
    title: 'Implement security incident reporting', 
    framework: 'NIS2', 
    priority: 'high',
    status: 'pending',
    dueDate: '2025-10-30',
  },
  { 
    id: 4, 
    title: 'Review vendor SLA agreements', 
    framework: 'DORA', 
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2025-11-20',
    progress: 20,
  },
  { 
    id: 5, 
    title: 'Complete asset inventory', 
    framework: 'ISO27001', 
    priority: 'low',
    status: 'in-progress',
    dueDate: '2025-12-01',
    progress: 80,
  },
];

export function HomeTab({ onNavigate }: HomeTabProps) {
  const overallProgress = Math.round(
    applicableFrameworks.reduce((sum, f) => sum + f.progress, 0) / applicableFrameworks.length
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl lg:text-3xl mb-2">Welcome Back</h2>
        <p className="text-gray-600 text-sm lg:text-base">
          Here's your compliance overview and active tasks
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl lg:text-3xl">{overallProgress}%</div>
              <p className="text-xs lg:text-sm text-gray-600">Overall Progress</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl lg:text-3xl">{applicableFrameworks.length}</div>
              <p className="text-xs lg:text-sm text-gray-600">Active Frameworks</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl lg:text-3xl">{recentTasks.filter(t => t.status === 'pending').length}</div>
              <p className="text-xs lg:text-sm text-gray-600">Pending Tasks</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg lg:text-xl">Applicable Compliance Frameworks</h3>
          <Button variant="link" onClick={() => onNavigate('reasoning')} className="text-xs lg:text-sm">
            View Details
          </Button>
        </div>

        <div className="space-y-4">
          {applicableFrameworks.map((framework) => {
            const Icon = framework.icon;
            return (
              <Card key={framework.name} className="p-4 lg:p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="text-base lg:text-lg">{framework.name}</h4>
                        <Badge variant={framework.status === 'applicable' ? 'default' : 'outline'} className="text-xs">
                          {framework.status === 'applicable' ? 'Applicable' : 'Partial'}
                        </Badge>
                      </div>
                      <p className="text-xs lg:text-sm text-gray-600 mb-2">{framework.fullName}</p>
                      <p className="text-xs text-gray-500 mb-3">{framework.requirements}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>Deadline: {framework.deadline}</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-32">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 text-xs">Progress</span>
                      <span className="text-xs">{framework.progress}%</span>
                    </div>
                    <Progress value={framework.progress} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="mb-1 text-sm lg:text-base">Next Steps</h4>
              <p className="text-xs lg:text-sm text-gray-700">
                Focus on DORA compliance - you have high priority tasks pending for incident response and ICT risk management.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg lg:text-xl">Active Tasks</h3>
          <Button variant="link" onClick={() => onNavigate('copilot')} className="text-xs lg:text-sm">
            Get AI Help
          </Button>
        </div>

        <div className="space-y-3">
          {recentTasks.map((task) => (
            <Card key={task.id} className="p-4 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2 flex-wrap">
                    <h4 className="text-sm lg:text-base">{task.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {task.framework}
                    </Badge>
                    <Badge
                      variant={
                        task.priority === 'high' ? 'destructive' :
                        task.priority === 'medium' ? 'outline' :
                        'secondary'
                      }
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    <span className="capitalize">{task.status.replace('-', ' ')}</span>
                  </div>
                </div>
                {task.progress !== undefined && (
                  <div className="w-full sm:w-32">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
