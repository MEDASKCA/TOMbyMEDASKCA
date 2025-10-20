'use client';

import React from 'react';
import { Users, MessageSquare, Calendar, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'teams', icon: Users, label: 'Teams' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'files', icon: FileText, label: 'Files' },
  ];

  return (
    <div className="w-16 bg-gradient-to-b from-blue-700 via-cyan-600 to-purple-700 flex flex-col items-center py-4 space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
              activeView === item.id
                ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
            title={item.label}
          >
            <Icon size={24} />
          </button>
        );
      })}

      <div className="flex-1" />

      <button
        onClick={() => setActiveView('settings')}
        className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
          activeView === 'settings'
            ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
        title="Settings"
      >
        <Settings size={24} />
      </button>

      <button
        onClick={logout}
        className="w-12 h-12 rounded-lg flex items-center justify-center text-white/70 hover:bg-red-500 hover:text-white transition-colors"
        title="Logout"
      >
        <LogOut size={24} />
      </button>
    </div>
  );
}
