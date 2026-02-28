import React from 'react';
import { 
  Home,
  BarChart3,
  Settings,
  LogOut,
  AlertTriangle,
  Shield,
  TrendingUp,
  File,
  Compass,
  ClipboardList,
  Server,
  ClipboardCheck,
  FileBarChart2,
  Plug,
  Brain,
} from 'lucide-react';
import { cn } from './ui/utils';
import hyperlynxLogo from '../assets/logo_black.png';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

const navGroups = [
  {
    label: 'Intelligence',
    items: [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'applicability', label: 'Applicability', icon: Brain },
      { id: 'policy-documents', label: 'Policy Documents', icon: File },
      { id: 'framework-advisor', label: 'Framework Advisor', icon: Compass },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { id: 'controls', label: 'Controls', icon: Shield },
      { id: 'gap-analysis', label: 'Gap Analysis', icon: AlertTriangle },
      { id: 'risk-assessment', label: 'Risk Assessment', icon: TrendingUp },
      { id: 'action-plan', label: 'Action Plan', icon: ClipboardList },
      { id: 'compliance', label: 'Compliance Dashboard', icon: BarChart3 },
    ],
  },
  {
    label: 'Manage',
    items: [
      { id: 'assets', label: 'Assets', icon: Server },
      { id: 'audits', label: 'Audits', icon: ClipboardCheck },
      { id: 'reports', label: 'Reports', icon: FileBarChart2 },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'integrations', label: 'Integrations', icon: Plug },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function Sidebar({ currentView, onNavigate, isOpen = true, onClose, onLogout }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "w-72 bg-white border-r h-full flex flex-col fixed lg:relative z-50 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-4 lg:p-6 flex-1 min-h-0 flex flex-col overflow-y-auto">
          <div className="flex items-center gap-2 mb-8">
            <img src={hyperlynxLogo} alt="Hyperlynx" className="w-6 h-6" />
            <span className="text-lg">Hyperlynx</span>
          </div>
          
          <nav className="space-y-4 pr-1">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 mb-1 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          onClose?.();
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm whitespace-nowrap overflow-hidden text-ellipsis',
                          isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                        )}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 lg:p-6 space-y-1">
          <button 
            onClick={() => {
              onNavigate('profile');
              onClose?.();
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              currentView === 'profile' 
                ? "bg-black text-white" 
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button 
            onClick={() => {
              onLogout?.();
              onClose?.();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </>
  );
}
