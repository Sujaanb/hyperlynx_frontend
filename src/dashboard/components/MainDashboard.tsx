import React, { useState } from 'react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { HomeTab } from './HomeTab';
import { IssuesOverview } from './IssuesOverview';
import { ComplianceStatus } from './ComplianceStatus';
import { GapAssessment } from './GapAssessment';
import { LibrariesPage } from './LibrariesPage';
import { ProfileSettings } from './ProfileSettings';
import { DocumentUpload } from './DocumentUpload';
import { GrcOverview } from '../pages/GrcOverview';
import { GrcCompliance } from '../pages/GrcCompliance';
import { GrcGapAnalysis } from '../pages/GrcGapAnalysis';
import { GrcActionPlan } from '../pages/GrcActionPlan';
import { GrcRiskAssessment } from '../pages/GrcRiskAssessment';
import { GrcDocumentIntelligence } from '../pages/GrcDocumentIntelligence';
import { GrcIntelligenceSetup } from '../pages/GrcIntelligenceSetup';
import { GrcFrameworkAdvisor } from '../pages/GrcFrameworkAdvisor';
import { GrcControls } from '../pages/GrcControls';
import { GrcAssets } from '../pages/GrcAssets';
import { GrcAudits } from '../pages/GrcAudits';
import { GrcReports } from '../pages/GrcReports';
import { GrcIntegrations } from '../pages/GrcIntegrations';
import { GrcSettings } from '../pages/GrcSettings';

interface MainDashboardProps {
  onNavigate: (view: string) => void;
  currentView?: string;
  onLogout?: () => void;
  userEmail?: string;
}

export function MainDashboard({ onNavigate, currentView = 'applicability', onLogout, userEmail }: MainDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    // grc-pulse parity routes (plus backward-compatible aliases)
    if (currentView === 'overview' || currentView === 'grc-overview') return <GrcOverview onNavigate={onNavigate} />;
    if (currentView === 'applicability' || currentView === 'intelligence-setup') return <GrcIntelligenceSetup onNavigate={onNavigate} />;
    if (currentView === 'policy-documents' || currentView === 'document-intelligence' || currentView === 'grc-documents') return <GrcDocumentIntelligence onNavigate={onNavigate} />;
    if (currentView === 'framework-advisor') return <GrcFrameworkAdvisor />;
    if (currentView === 'controls') return <GrcControls onNavigate={onNavigate} />;
    if (currentView === 'gap-analysis' || currentView === 'grc-gap-analysis') return <GrcGapAnalysis />;
    if (currentView === 'risk-assessment' || currentView === 'grc-risks') return <GrcRiskAssessment />;
    if (currentView === 'action-plan' || currentView === 'grc-action-plan') return <GrcActionPlan />;
    if (currentView === 'compliance' || currentView === 'grc-compliance') return <GrcCompliance onNavigate={onNavigate} />;
    if (currentView === 'assets') return <GrcAssets />;
    if (currentView === 'audits') return <GrcAudits />;
    if (currentView === 'reports') return <GrcReports />;
    if (currentView === 'integrations') return <GrcIntegrations />;
    if (currentView === 'settings') return <GrcSettings />;

    // Legacy routes
    switch (currentView) {
      case 'issues':
        return <IssuesOverview onNavigate={onNavigate} />;
      case 'status':
        return <ComplianceStatus onNavigate={onNavigate} />;
      case 'gaps':
        return <GapAssessment onNavigate={onNavigate} />;
      case 'documents':
        return <DocumentUpload onNavigate={onNavigate} />;
      case 'libraries':
        return <LibrariesPage />;
      case 'profile':
        return <ProfileSettings />;
      case 'home':
      default:
        return <HomeTab onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Topbar 
        notificationCount={3} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLogout={onLogout}
        userEmail={userEmail}
        onNavigate={onNavigate}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar 
          currentView={currentView} 
          onNavigate={onNavigate} 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={onLogout}
        />

        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
