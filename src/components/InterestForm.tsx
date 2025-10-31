import { useState, useEffect, ReactNode } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

// ==================== TYPES ====================

interface FormData {
  name: string;
  company: string;
  email: string;
  designation: string;
  interest: string;
  complianceStandards: string[];
  otherCompliance: string;
  criticalRating: number | null;
  howDidYouHear: string;
}

interface TypeformQuestionProps {
  number: number;
  question: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
}

// ==================== CONSTANTS ====================

const TOTAL_STEPS = 9;

const COMPLIANCE_OPTIONS = [
  'GDPR',
  'PCI DSS',
  'SOC 2',
  'ISO 27001',
  'NIST',
  'Other'
];

const INITIAL_FORM_DATA: FormData = {
  name: '',
  company: '',
  email: '',
  designation: '',
  interest: '',
  complianceStandards: [],
  otherCompliance: '',
  criticalRating: null,
  howDidYouHear: ''
};

// ==================== TYPEFORM QUESTION COMPONENT ====================

function TypeformQuestion({ 
  number, 
  question, 
  description, 
  required = false, 
  children 
}: TypeformQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Question Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-start gap-2 sm:gap-3 mb-3">
          <span className="text-white/40 text-sm sm:text-base mt-1 sm:mt-0 flex-shrink-0">
            {number}
          </span>
          <div className="flex-1">
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl leading-tight">
              {question}
              {required && <span className="text-red-400 ml-1">*</span>}
            </h2>
          </div>
        </div>
        
        {description && (
          <p className="text-white/50 text-sm sm:text-base ml-6 sm:ml-8">
            {description}
          </p>
        )}
      </div>

      {/* Answer Input Area */}
      <div className="ml-6 sm:ml-8">
        {children}
      </div>
    </motion.div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function HyperlynxForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  // ==================== COMPUTED VALUES ====================

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  // ==================== FORM HANDLERS ====================

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCompliance = (option: string) => {
    setFormData(prev => ({
      ...prev,
      complianceStandards: prev.complianceStandards.includes(option)
        ? prev.complianceStandards.filter(item => item !== option)
        : [...prev.complianceStandards, option]
    }));
  };

  // ==================== NAVIGATION ====================

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0: return formData.name.trim() !== '';
      case 1: return formData.company.trim() !== '';
      case 2: return formData.email.trim() !== '' && formData.email.includes('@');
      case 3: return formData.designation.trim() !== '';
      case 4: return formData.interest.trim() !== '';
      case 5: return formData.complianceStandards.length > 0;
      case 6: return true; // Optional field
      case 7: return formData.criticalRating !== null;
      case 8: return true; // Optional field
      default: return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) return;

    if (currentStep === TOTAL_STEPS - 1) {
      handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canProceed()) {
      handleNext();
    }
  };

  // ==================== SUBMISSION ====================

  const handleSubmit = () => {
    // Prepare data for backend
    const submissionData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    console.log('Form Submission Data:', submissionData);
    
    // TODO: Send to backend API
    // Example:
    // fetch('/api/submit-form', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(submissionData)
    // });

    alert('Form submitted successfully! Check console for data.');
  };

  // ==================== KEYBOARD NAVIGATION ====================

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight' && canProceed()) handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, formData]);

  // ==================== RENDER ====================

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Glassy Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 gap-2 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <img src={logo} alt="Hyperlynx" className="h-6 sm:h-8" />
            <div className="h-6 sm:h-8 w-px bg-white/20" />
            <h1 className="text-sm sm:text-base text-white/90">Hyperlynx Interest Form</h1>
          </div>
          <div className="text-xs sm:text-sm text-white/60">
            {currentStep + 1} / {TOTAL_STEPS}
          </div>
        </div>
        <Progress value={progress} className="h-1 rounded-none bg-white/5" />
      </header>

      {/* Main Content */}
      <main className="relative z-10 h-[calc(100vh-120px)] flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-2xl">
          {/* Question 1: Name */}
          {currentStep === 0 && (
            <TypeformQuestion number={1} question="What's your name?" required>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer here..."
                className="text-base sm:text-lg bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground"
                autoFocus
              />
            </TypeformQuestion>
          )}

          {/* Question 2: Company */}
          {currentStep === 1 && (
            <TypeformQuestion number={2} question="Which company do you work for?" required>
              <Input
                type="text"
                value={formData.company}
                onChange={(e) => updateFormData('company', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer here..."
                className="text-base sm:text-lg bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground"
                autoFocus
              />
            </TypeformQuestion>
          )}

          {/* Question 3: Email */}
          {currentStep === 2 && (
            <TypeformQuestion number={3} question="What's your work email?" required>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="name@company.com"
                className="text-base sm:text-lg bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground"
                autoFocus
              />
            </TypeformQuestion>
          )}

          {/* Question 4: Designation */}
          {currentStep === 3 && (
            <TypeformQuestion number={4} question="What's your designation/position?" required>
              <Input
                type="text"
                value={formData.designation}
                onChange={(e) => updateFormData('designation', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer here..."
                className="text-base sm:text-lg bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground"
                autoFocus
              />
            </TypeformQuestion>
          )}

          {/* Question 5: Interest */}
          {currentStep === 4 && (
            <TypeformQuestion number={5} question="Why does Hyperlynx interest you?" required>
              <Textarea
                value={formData.interest}
                onChange={(e) => updateFormData('interest', e.target.value)}
                placeholder="Type your answer here..."
                className="text-base sm:text-lg bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary resize-none min-h-[80px] sm:min-h-[100px] placeholder:text-muted-foreground"
                autoFocus
              />
            </TypeformQuestion>
          )}

          {/* Question 6: Compliance Standards */}
          {currentStep === 5 && (
            <TypeformQuestion
              number={6}
              question="Which compliance standards are most relevant to your organization?"
              required
            >
              <div className="space-y-3">
                {COMPLIANCE_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center space-x-2 sm:space-x-3">
                    <Checkbox
                      id={option}
                      checked={formData.complianceStandards.includes(option)}
                      onCheckedChange={() => toggleCompliance(option)}
                      className="h-4 w-4 sm:h-5 sm:w-5 border-white/20"
                    />
                    <Label
                      htmlFor={option}
                      className="cursor-pointer select-none text-sm sm:text-base"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </TypeformQuestion>
          )}

          {/* Question 7: Other Compliance */}
          {currentStep === 6 && (
            <TypeformQuestion number={7} question="If 'Other' was selected, please specify:">
              <Input
                type="text"
                value={formData.otherCompliance}
                onChange={(e) => updateFormData('otherCompliance', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer here..."
                className="text-base sm:text-lg bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground"
                autoFocus
              />
            </TypeformQuestion>
          )}

          {/* Question 8: Critical Rating */}
          {currentStep === 7 && (
            <TypeformQuestion
              number={8}
              question="How critical is automated compliance for your fintech's security?"
              description="1 = Not Critical, 5 = Extremely Critical"
              required
            >
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => updateFormData('criticalRating', rating)}
                    className={`h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-lg border-2 transition-all text-base sm:text-lg flex items-center justify-center ${
                      formData.criticalRating === rating
                        ? 'border-white bg-white text-black'
                        : 'border-white/20 hover:border-white/40 text-white'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs sm:text-sm text-white/50 max-w-[280px] sm:max-w-full">
                <span>Not Critical</span>
                <span>Extremely Critical</span>
              </div>
            </TypeformQuestion>
          )}

          {/* Question 9: How Did You Hear */}
          {currentStep === 8 && (
            <TypeformQuestion number={9} question="How did you hear about Hyperlynx?">
              <Select value={formData.howDidYouHear} onValueChange={(value) => updateFormData('howDidYouHear', value)}>
                <SelectTrigger className="w-full max-w-md bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus:ring-0 focus:ring-offset-0 text-base sm:text-lg h-auto py-2">
                  <SelectValue placeholder="Choose an option" className="text-muted-foreground" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                  <SelectItem value="social-media" className="hover:bg-white/5">Social Media</SelectItem>
                  <SelectItem value="search-engine" className="hover:bg-white/5">Search Engine</SelectItem>
                  <SelectItem value="industry-event" className="hover:bg-white/5">Industry Event</SelectItem>
                  <SelectItem value="referral" className="hover:bg-white/5">Referral</SelectItem>
                  <SelectItem value="article-publication" className="hover:bg-white/5">Article/Publication</SelectItem>
                  <SelectItem value="other" className="hover:bg-white/5">Other</SelectItem>
                </SelectContent>
              </Select>
            </TypeformQuestion>
          )}
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="relative z-10 fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="gap-1 sm:gap-2 text-sm sm:text-base hover:bg-white/5 text-white disabled:opacity-30"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </Button>
          
          <div className="flex items-center gap-2">
            {currentStep === TOTAL_STEPS - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-1 sm:gap-2 bg-white text-black hover:bg-white/90 text-sm sm:text-base disabled:opacity-50"
              >
                Submit
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-1 sm:gap-2 bg-white text-black hover:bg-white/90 text-sm sm:text-base disabled:opacity-50"
              >
                Next
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
