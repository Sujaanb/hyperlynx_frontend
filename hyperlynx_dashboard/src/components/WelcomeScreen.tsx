import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-12 text-center">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-3xl text-white">H</span>
          </div>
        </div>
        
        <h1 className="text-4xl mb-4">Welcome to Hyperlynx Copilot</h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Let's determine your applicable frameworks first.
        </p>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
          <p className="text-gray-700">
            We'll guide you through a quick assessment to identify which compliance frameworks 
            (DORA, NIS2, ISO27001, etc.) apply to your organization. This will help us provide 
            tailored guidance and actionable insights.
          </p>
        </div>
        
        <Button 
          onClick={onStart} 
          size="lg"
          className="gap-2"
        >
          Start Applicability Assessment
          <ArrowRight className="w-5 h-5" />
        </Button>
        
        <p className="text-sm text-gray-500 mt-6">
          Already have an account? Your dashboard will be ready shortly.
        </p>
      </Card>
    </div>
  );
}
