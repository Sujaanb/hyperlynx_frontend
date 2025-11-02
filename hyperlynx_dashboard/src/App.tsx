import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { ApplicabilityModule, type ApplicabilityResults } from './components/ApplicabilityModule';
import { ReasoningModule } from './components/ReasoningModule';
import { CopilotModule } from './components/CopilotModule';
import { MainDashboard } from './components/MainDashboard';
import { Toaster } from './components/ui/sonner';

type AppView = 'applicability' | 'reasoning' | 'copilot' | 'home' | 'issues' | 'status' | 'documents' | 'profile';
type AuthView = 'login' | 'signup';

function AppContent() {
  const { user, loading, login, signup, logout, error, clearError } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [applicabilityResults, setApplicabilityResults] = useState<ApplicabilityResults | null>(null);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login/signup screens if not authenticated
  if (!user) {
    if (authView === 'signup') {
      return (
        <SignupScreen
          onSignup={async (email, password, name) => {
            await signup(email, password, name);
          }}
          onSwitchToLogin={() => {
            clearError();
            setAuthView('login');
          }}
          error={error || undefined}
        />
      );
    }

    return (
      <LoginScreen
        onLogin={async (email, password) => {
          await login(email, password);
        }}
        onSwitchToSignup={() => {
          clearError();
          setAuthView('signup');
        }}
        error={error || undefined}
      />
    );
  }

  // User is authenticated - show the app
  const handleApplicabilityComplete = (results: ApplicabilityResults) => {
    setApplicabilityResults(results);
    setCurrentView('home');
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as AppView);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView('home');
    setApplicabilityResults(null);
  };

  if (currentView === 'applicability') {
    return <ApplicabilityModule onComplete={handleApplicabilityComplete} onNavigate={handleNavigate} />;
  }

  if (currentView === 'reasoning') {
    const results = applicabilityResults || {
      DORA: 'applicable' as const,
      NIS2: 'partial' as const,
      ISO27001: 'applicable' as const,
      companyName: 'Your Organization',
    };
    return (
      <ReasoningModule
        applicabilityResults={results}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentView === 'copilot') {
    return <CopilotModule onNavigate={handleNavigate} />;
  }

  if (currentView === 'home' || currentView === 'issues' || currentView === 'status' || currentView === 'documents' || currentView === 'profile') {
    return (
      <MainDashboard 
        onNavigate={handleNavigate} 
        currentView={currentView}
        onLogout={handleLogout}
        userEmail={user.email}
      />
    );
  }

  return (
    <MainDashboard 
      onNavigate={handleNavigate} 
      currentView="home"
      onLogout={handleLogout}
      userEmail={user.email}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}
