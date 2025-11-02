import React from 'react';
import { Home, AlertCircle, BarChart3, Settings, LogOut, CheckSquare, Lightbulb, Bot, Menu, FileText } from 'lucide-react';
import { cn } from './ui/utils';
import hyperlynxLogo from '../assets/logo_black.png';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'applicability', label: 'Applicability', icon: CheckSquare },
  { id: 'reasoning', label: 'Reasoning', icon: Lightbulb },
  { id: 'copilot', label: 'Copilot', icon: Bot },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'issues', label: 'Issues Overview', icon: AlertCircle },
  { id: 'status', label: 'Compliance Status', icon: BarChart3 },
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
        "w-56 bg-white border-r h-full flex flex-col fixed lg:relative z-50 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-4 lg:p-6">
          <div className="flex items-center gap-2 mb-8">
            <img src={hyperlynxLogo} alt="Hyperlynx" className="w-6 h-6" />
            <span className="text-lg">Hyperlynx</span>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (currentView === 'dashboard' && item.id === 'home');
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose?.();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                    isActive 
                      ? "bg-black text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
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
