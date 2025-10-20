'use client';

import React from 'react';
import Image from 'next/image';
import { LayoutDashboard, CalendarDays, Users, Package, ClipboardList, BarChart3, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface TopNavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

// Microsoft Teams SVG Icon Component
const MicrosoftTeamsIcon = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 2228.833 2073.333" width={size} height={size}>
    <g transform="translate(0,-283.46429)">
      <path fill="#5059C9" d="M1554.637,777.5h575.713c54.391,0,98.483,44.092,98.483,98.483v524.398 c0,199.901-162.051,361.952-361.952,361.952h0c-199.901,0-361.952-162.051-361.952-361.952V828.971 C1505.923,801.032,1527.866,777.5,1554.637,777.5z"/>
      <circle fill="#5059C9" cx="1943.75" cy="440.583" r="233.25"/>
      <circle fill="#7B83EB" cx="1218.083" cy="336.917" r="336.917"/>
      <path fill="#7B83EB" d="M1667.323,777.5H717.01c-53.743,0-97.291,43.548-97.291,97.291v516.677 c0,217.557,176.326,393.883,393.883,393.883h0c217.557,0,393.883-176.326,393.883-393.883V894.375 C1407.485,828.992,1601.934,777.5,1667.323,777.5z"/>
      <path opacity="0.1" d="M1244,777.5v838.145c-136.906-37.462-256.088-150.683-311.032-288.563 c-54.944-137.88-41.623-293.284,36.288-418.245C1050.157,908.876,1146.128,848.938,1244,777.5z"/>
      <path fill="#7B83EB" d="M1244,777.5L1244,777.5c170.688,0,309.021,138.333,309.021,309.021v342.541 c0,170.688-138.333,309.021-309.021,309.021h0v-960.583H1244z"/>
      <g opacity="0.05">
        <path d="M1553.021,845.165v571.666c-180.039-34.624-326.725-181.31-361.349-361.349h346.378 C1543.887,1055.483,1553.021,1059.651,1553.021,845.165z"/>
      </g>
      <g opacity="0.05">
        <path d="M1553.021,816.582v599.083c-192.882-35.632-349.01-191.76-384.642-384.642h369.671 C1543.887,1031.022,1553.021,1027.019,1553.021,816.582z"/>
      </g>
      <g opacity="0.05">
        <path d="M1553.021,786.833v628.832c-205.725-36.639-371.509-202.423-408.148-408.148h393.177 C1543.887,1007.517,1553.021,1001.095,1553.021,786.833z"/>
      </g>
      <path fill="#4B53BC" d="M1244,777.5L1244,777.5c170.688,0,309.021,138.333,309.021,309.021v316.869 c0,170.688-138.333,309.021-309.021,309.021l0,0L1244,777.5L1244,777.5z"/>
      <path opacity="0.1" d="M1192.167,777.5v549.333h0c-102.49,0-194.876-52.192-248.254-138.878 C890.535,1101.269,877.553,995.98,917.25,900.938C956.947,805.897,1043.525,744.617,1192.167,777.5z"/>
      <path fill="white" d="M1192.167,777.5L1192.167,777.5c142.924,0,258.833,115.909,258.833,258.833v0 c0,142.924-115.909,258.833-258.833,258.833h-0.129V777.5z"/>
      <path fill="#4B53BC" d="M1192.167,1053.833h258.833c0,142.924-115.909,258.833-258.833,258.833"/>
      <circle fill="#4B53BC" cx="1192.167" cy="1053.833" r="103.167"/>
    </g>
  </svg>
);

// NHSmail Icon Component
const NHSmailIcon = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect x="0" y="0" width="24" height="24" rx="2" fill="#005EB8"/>
    <path d="M4 8l8 5 8-5v10H4V8z" fill="white"/>
    <path d="M4 8l8 5 8-5H4z" fill="#FFD700"/>
    <text x="12" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">NHS</text>
  </svg>
);

export default function TopNavbar({ activeView, setActiveView }: TopNavbarProps) {
  const { logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', isCustom: false },
    { id: 'schedule', icon: CalendarDays, label: 'Theatre Schedule', isCustom: false },
    { id: 'roster', icon: Users, label: 'Staff Roster', isCustom: false },
    { id: 'inventory', icon: Package, label: 'Inventory', isCustom: false },
    { id: 'procedures', icon: ClipboardList, label: 'Procedures', isCustom: false },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', isCustom: false },
    { id: 'msteams', icon: MicrosoftTeamsIcon, label: 'Microsoft Teams', isCustom: true },
    { id: 'nhsmail', icon: NHSmailIcon, label: 'NHSmail', isCustom: true },
  ];

  return (
    <nav className="h-14 bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-800 dark:to-teal-700 shadow-lg flex items-center justify-between px-4">
      {/* Left: Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">TOM</span>
        </div>
        <div className="hidden sm:block">
          <h1 className="text-white font-bold text-lg leading-tight">TOM</h1>
          <p className="text-white/80 text-xs leading-tight">Theatre Operations</p>
        </div>
      </div>

      {/* Center: Navigation Items */}
      <div className="flex items-center space-x-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => setActiveView(item.id)}
                className={`p-2.5 rounded-lg transition-all ${
                  activeView === item.id
                    ? 'bg-white/20 backdrop-blur-sm text-white shadow-md'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={24} />
              </button>
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right: Theme Toggle, Settings, User */}
      <div className="flex items-center space-x-1">
        {/* Theme Toggle */}
        <div className="relative group">
          <button
            onClick={toggleTheme}
            className="p-2.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </div>
        </div>

        {/* Settings */}
        <div className="relative group">
          <button
            onClick={() => setActiveView('settings')}
            className={`p-2.5 rounded-lg transition-colors ${
              activeView === 'settings'
                ? 'bg-white/20 text-white'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Settings size={24} />
          </button>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
            Settings
          </div>
        </div>

        {/* User Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-white/20">
          {user?.photoURL ? (
            <div className="relative w-8 h-8">
              <Image
                src={user.photoURL}
                alt="User"
                fill
                className="rounded-full border-2 border-white/30 object-cover"
                sizes="32px"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}

          {/* Logout */}
          <div className="relative group">
            <button
              onClick={logout}
              className="p-2 hover:bg-red-500/80 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <LogOut size={22} />
            </button>
            <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Logout
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
