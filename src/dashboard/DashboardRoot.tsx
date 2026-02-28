import React from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import { AnalysisProvider } from './components/AnalysisContext';
import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { ReasoningModule } from './components/ReasoningModule';
import { CopilotModule } from './components/CopilotModule';
import { MainDashboard } from './components/MainDashboard';
import { Toaster } from './components/ui/sonner';
import { hyperlynxApi } from './services/hyperlynxApi';

type AppView = string;

const fallbackApplicability = {
  DORA: 'applicable',
  NIS2: 'partial',
  ISO27001: 'applicable',
  companyName: 'Your Organization',
};

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/dashboard/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function DashboardEntryRedirect() {
  const [target, setTarget] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const resolveTarget = async () => {
      if (hyperlynxApi.isDemoMode()) {
        if (!cancelled) {
          setTarget('/dashboard/overview');
        }
        return;
      }

      try {
        const questionnaire = await hyperlynxApi.getIntelligenceQuestionnaire();
        const answeredCount = (questionnaire.results || []).filter((row) => (row.answer || '').trim().length > 0).length;
        const hasCompletedApplicability = answeredCount >= 5;
        if (!cancelled) {
          setTarget(hasCompletedApplicability ? '/dashboard/overview' : '/dashboard/applicability');
        }
      } catch {
        if (!cancelled) {
          setTarget('/dashboard/applicability');
        }
      }
    };

    void resolveTarget();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!target) {
    return <LoadingScreen />;
  }

  return <Navigate to={target} replace />;
}

function DashboardRoutes() {
  const { user, login, signup, logout, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = (view: string) => {
    navigate(`/dashboard/${view}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/dashboard/login');
  };

  const renderMain = (view: AppView) => (
    <AuthGate>
      <MainDashboard
        onNavigate={handleNavigate}
        currentView={view}
        onLogout={handleLogout}
        userEmail={user?.email}
      />
    </AuthGate>
  );

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AuthGate>
              <DashboardEntryRedirect />
            </AuthGate>
          }
        />
        <Route
          path="login"
          element={
            <PublicOnly>
              <LoginScreen
                onLogin={async (email, password) => {
                  await login(email, password);
                }}
                onSwitchToSignup={() => {
                  clearError();
                  navigate('/dashboard/signup');
                }}
                error={error || undefined}
              />
            </PublicOnly>
          }
        />
        <Route
          path="signup"
          element={
            <PublicOnly>
              <SignupScreen
                onSignup={async (email, password, name) => {
                  await signup(email, password, name);
                }}
                onSwitchToLogin={() => {
                  clearError();
                  navigate('/dashboard/login');
                }}
                error={error || undefined}
              />
            </PublicOnly>
          }
        />
        <Route path="applicability" element={renderMain('applicability')} />
        <Route
          path="reasoning"
          element={
            <AuthGate>
              <ReasoningModule
                applicabilityResults={fallbackApplicability}
                onNavigate={handleNavigate}
              />
            </AuthGate>
          }
        />
        <Route
          path="copilot"
          element={
            <AuthGate>
              <CopilotModule onNavigate={handleNavigate} />
            </AuthGate>
          }
        />
        <Route path="home" element={<Navigate to="/dashboard/overview" replace />} />
        <Route path="overview" element={renderMain('overview')} />
        <Route path="intelligence-setup" element={<Navigate to="/dashboard/applicability" replace />} />
        <Route path="policy-documents" element={renderMain('policy-documents')} />
        <Route path="document-intelligence" element={renderMain('document-intelligence')} />
        <Route path="framework-advisor" element={renderMain('framework-advisor')} />
        <Route path="controls" element={renderMain('controls')} />
        <Route path="gap-analysis" element={renderMain('gap-analysis')} />
        <Route path="risk-assessment" element={renderMain('risk-assessment')} />
        <Route path="action-plan" element={renderMain('action-plan')} />
        <Route path="compliance" element={renderMain('compliance')} />
        <Route path="assets" element={renderMain('assets')} />
        <Route path="audits" element={renderMain('audits')} />
        <Route path="reports" element={renderMain('reports')} />
        <Route path="integrations" element={renderMain('integrations')} />
        <Route path="settings" element={renderMain('settings')} />
        <Route path="grc-overview" element={renderMain('grc-overview')} />
        <Route path="grc-compliance" element={renderMain('grc-compliance')} />
        <Route path="grc-gap-analysis" element={renderMain('grc-gap-analysis')} />
        <Route path="grc-risks" element={renderMain('grc-risks')} />
        <Route path="grc-action-plan" element={renderMain('grc-action-plan')} />
        <Route path="grc-documents" element={renderMain('grc-documents')} />
        <Route path="issues" element={renderMain('issues')} />
        <Route path="status" element={renderMain('status')} />
        <Route path="gaps" element={renderMain('gaps')} />
        <Route path="documents" element={renderMain('documents')} />
        <Route path="libraries" element={renderMain('libraries')} />
        <Route path="profile" element={renderMain('profile')} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export function DashboardRoot() {
  return (
    <AuthProvider>
      <AnalysisProvider>
        <DashboardRoutes />
      </AnalysisProvider>
    </AuthProvider>
  );
}
