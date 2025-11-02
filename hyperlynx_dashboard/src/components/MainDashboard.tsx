import React, { useState } from 'react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { HomeTab } from './HomeTab';
import { IssuesOverview } from './IssuesOverview';
import { ComplianceStatus } from './ComplianceStatus';
import { DocumentsPage } from './DocumentsPage';
import { ProfileSettings } from './ProfileSettings';

interface MainDashboardProps {
  onNavigate: (view: string) => void;
  currentView?: string;
  onLogout?: () => void;
  userEmail?: string;
}

export function MainDashboard({ onNavigate, currentView = 'home', onLogout, userEmail }: MainDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case 'issues':
        return <IssuesOverview onNavigate={onNavigate} />;
      case 'status':
        return <ComplianceStatus onNavigate={onNavigate} />;
      case 'documents':
        return <DocumentsPage />;
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
