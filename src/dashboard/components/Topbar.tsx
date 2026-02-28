import React from 'react';
import { Bell, ChevronDown, Menu } from 'lucide-react';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import profileImage from '../assets/logo_black.png';

interface TopbarProps {
  notificationCount?: number;
  onMenuClick?: () => void;
  onLogout?: () => void;
  userEmail?: string;
  onNavigate?: (view: string) => void;
}

export function Topbar({ notificationCount = 3, onMenuClick, onLogout, userEmail, onNavigate }: TopbarProps) {
  return (
    <div className="h-14 border-b bg-white px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button 
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base lg:text-lg">Hyperlynx Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          {notificationCount > 0 && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-gray-100 rounded-lg transition-colors px-2 py-1">
              <img src={profileImage} alt="Profile" className="w-8 h-8 rounded-full" />
              <span className="text-sm">Profile</span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {userEmail ? userEmail : 'My Account'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onNavigate?.('profile')}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem>Team Management</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
