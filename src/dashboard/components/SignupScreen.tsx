import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import hyperlynxLogo from '../assets/logo.png';
import { Progress } from './ui/progress';

interface SignupScreenProps {
  onSignup: (email: string, password: string, name: string) => Promise<void>;
  onSwitchToLogin: () => void;
  error?: string;
}

export function SignupScreen({ onSignup, onSwitchToLogin, error }: SignupScreenProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    setValidationError('');
    
    if (step === 1 && !name.trim()) {
      setValidationError('Please enter your name');
      return;
    }
    
    if (step === 2 && !email.trim()) {
      setValidationError('Please enter your email');
      return;
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await onSignup(email, password, name);
    } finally {
      setLoading(false);
    }
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center p-4">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-teal-800/40" />
      
      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <img src={hyperlynxLogo} alt="Hyperlynx" className="w-10 h-10" />
            <span className="text-white text-2xl">Hyperlynx Interest Form</span>
          </div>
          <span className="text-white/60">{step} / {totalSteps}</span>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="h-1 mb-8 bg-white/10" />

        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 lg:p-12">
          {displayError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <p className="text-white/60 text-sm mb-2">{step}</p>
                  <h2 className="text-white text-2xl mb-8">What's your name? <span className="text-red-500">*</span></h2>
                </div>
                <div className="space-y-2">
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="bg-transparent border-0 border-b border-white/20 text-white placeholder:text-white/30 focus:border-white/50 rounded-none px-0 h-12 text-lg"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <p className="text-white/60 text-sm mb-2">{step}</p>
                  <h2 className="text-white text-2xl mb-8">What's your email address? <span className="text-red-500">*</span></h2>
                </div>
                <div className="space-y-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@company.com"
                    required
                    className="bg-transparent border-0 border-b border-white/20 text-white placeholder:text-white/30 focus:border-white/50 rounded-none px-0 h-12 text-lg"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <p className="text-white/60 text-sm mb-2">{step}</p>
                  <h2 className="text-white text-2xl mb-8">Create a password <span className="text-red-500">*</span></h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/80 text-sm">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-12"
                    />
                    <p className="text-xs text-white/50">Must be at least 6 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white/80 text-sm">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-12"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-12">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSwitchToLogin}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
              
              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-white text-black hover:bg-white/90 h-12"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-white text-black hover:bg-white/90 h-12"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-white hover:text-white/80 transition-colors underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
