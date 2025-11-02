import React, { useState } from 'react';
import { ArrowRight, Building2, MapPin, Users, DollarSign, Server, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { Progress } from './ui/progress';
import { useAuth } from './AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface ApplicabilityModuleProps {
  onComplete: (results: ApplicabilityResults) => void;
  onNavigate: (view: string) => void;
}

export interface ApplicabilityResults {
  DORA: 'applicable' | 'partial' | 'not-applicable';
  NIS2: 'applicable' | 'partial' | 'not-applicable';
  ISO27001: 'applicable' | 'partial' | 'not-applicable';
  companyName: string;
}

const questions = [
  {
    id: 'company-info',
    title: 'Company Information',
    icon: Building2,
    fields: [
      { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Enter company name' },
      { id: 'address', label: 'Company Address', type: 'text', placeholder: 'Enter company address' },
    ]
  },
  {
    id: 'industry',
    title: 'Industry & Operations',
    icon: Users,
    question: 'What is your primary industry?',
    options: [
      { value: 'financial', label: 'Financial Services / Banking', description: 'Banks, payment institutions, investment firms' },
      { value: 'healthcare', label: 'Healthcare', description: 'Hospitals, clinics, health tech' },
      { value: 'technology', label: 'Technology / Software', description: 'SaaS, software development, IT services' },
      { value: 'energy', label: 'Energy / Utilities', description: 'Power, water, gas providers' },
      { value: 'other', label: 'Other Industries', description: 'Manufacturing, retail, etc.' },
    ],
  },
  {
    id: 'size',
    title: 'Company Size',
    icon: Users,
    question: 'How many employees does your organization have?',
    options: [
      { value: 'small', label: 'Less than 50', description: 'Small enterprise' },
      { value: 'medium', label: '50-250', description: 'Medium enterprise' },
      { value: 'large', label: '250+', description: 'Large enterprise' },
    ],
  },
  {
    id: 'data',
    title: 'Data Handling',
    icon: Shield,
    question: 'What type of data do you handle?',
    options: [
      { value: 'financial', label: 'Financial Data', description: 'Payment information, transactions' },
      { value: 'personal', label: 'Personal Data', description: 'PII, customer information' },
      { value: 'both', label: 'Both Financial & Personal', description: 'Comprehensive data handling' },
      { value: 'none', label: 'Minimal Sensitive Data', description: 'General business data only' },
    ],
  },
  {
    id: 'services',
    title: 'Critical Services',
    icon: Server,
    question: 'Do you provide essential services or critical infrastructure?',
    options: [
      { value: 'yes', label: 'Yes, Essential Services', description: 'Critical infrastructure provider' },
      { value: 'partial', label: 'Partially Critical', description: 'Some critical components' },
      { value: 'no', label: 'Non-Essential', description: 'Standard business services' },
    ],
  },
];

export function ApplicabilityModule({ onComplete, onNavigate }: ApplicabilityModuleProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { accessToken } = useAuth();

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];
  const Icon = currentQuestion.icon;

  const handleFieldChange = (fieldId: string, value: string) => {
    setAnswers({ ...answers, [fieldId]: value });
  };

  const handleOptionSelect = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const canProceed = () => {
    if (currentQuestion.fields) {
      return currentQuestion.fields.every(field => answers[field.id]?.trim());
    }
    return !!answers[currentQuestion.id];
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate results
      const industry = answers.industry;
      const data = answers.data;
      const services = answers.services;
      
      const results: ApplicabilityResults = {
        DORA: industry === 'financial' || data === 'financial' || data === 'both' ? 'applicable' : 'not-applicable',
        NIS2: services === 'yes' || industry === 'energy' ? 'applicable' : services === 'partial' ? 'partial' : 'not-applicable',
        ISO27001: data !== 'none' || services !== 'no' ? 'applicable' : 'partial',
        companyName: answers.companyName || 'Your Organization',
      };
      
      // Save to database
      setSaving(true);
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-7f9a4697/applicability`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ answers, results }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to save assessment');
        }

        toast.success('Assessment saved successfully');
        onComplete(results);
      } catch (error) {
        console.error('Error saving assessment:', error);
        toast.error('Failed to save assessment, but you can continue');
        onComplete(results);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          currentView="applicability" 
          onNavigate={onNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-4 lg:p-8">
            <div className="mb-6 lg:mb-8">
              <h1 className="text-2xl lg:text-3xl mb-2">Framework Applicability Assessment</h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Help us understand your organization to determine which compliance frameworks apply
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Step {currentStep + 1} of {questions.length}</span>
                <span className="text-sm">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Card className="p-4 lg:p-8">
              <div className="flex items-center gap-4 mb-6 lg:mb-8">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl lg:text-2xl">{currentQuestion.title}</h2>
                  {currentQuestion.question && (
                    <p className="text-gray-600 mt-1">{currentQuestion.question}</p>
                  )}
                </div>
              </div>

              {currentQuestion.fields ? (
                <div className="space-y-6">
                  {currentQuestion.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Input
                        id={field.id}
                        type={field.type}
                        value={answers[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="h-12"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <RadioGroup
                  value={answers[currentQuestion.id] || ''}
                  onValueChange={handleOptionSelect}
                  className="space-y-3"
                >
                  {currentQuestion.options?.map((option) => (
                    <div
                      key={option.value}
                      className={`relative flex items-start gap-4 p-5 border-2 rounded-lg cursor-pointer transition-all ${
                        answers[currentQuestion.id] === option.value
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleOptionSelect(option.value)}
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={option.value}
                          className="cursor-pointer block mb-1"
                        >
                          {option.label}
                        </Label>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </Card>

            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed() || saving}
                className="gap-2"
                size="lg"
              >
                {saving ? 'Saving...' : currentStep === questions.length - 1 ? 'Complete Assessment' : 'Continue'}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
