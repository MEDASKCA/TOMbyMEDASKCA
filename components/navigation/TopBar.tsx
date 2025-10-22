'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Package,
  ClipboardList,
  BarChart3,
  Bell,
  Settings,
  HelpCircle,
  Menu,
  Activity,
  X
} from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TopBar({ activeTab, setActiveTab }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', name: 'Theatre Schedule', icon: CalendarDays },
    { id: 'roster', name: 'Staff Roster', icon: Users },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'procedures', name: 'Procedures', icon: ClipboardList },
    { id: 'readiness', name: 'Readiness', icon: Activity },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="bg-white shadow-lg border-b border-gray-200">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-2 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 hover:bg-blue-800 rounded-lg transition-colors"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo/Title */}
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-xl font-bold truncate"><span className="font-bold">TOM</span> by <span className="font-bold">MEDASKCA™</span></h1>
              <p className="text-xs sm:text-sm text-blue-200">Theatre Operations Manager</p>
              <p className="text-[10px] sm:text-xs text-blue-300 italic hidden sm:block">Demo for NHS Clinical Entrepreneur Programme</p>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-blue-800 rounded-lg transition-colors"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white text-gray-800 rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-3 hover:bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-medium">Low inventory alert</p>
                      <p className="text-xs text-gray-600">Hip implants running low in Theatre 1</p>
                      <p className="text-xs text-blue-600 mt-1">2 minutes ago</p>
                    </div>
                    <div className="p-3 hover:bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-medium">Staff update</p>
                      <p className="text-xs text-gray-600">Dr. Smith has checked in for morning shift</p>
                      <p className="text-xs text-blue-600 mt-1">15 minutes ago</p>
                    </div>
                    <div className="p-3 hover:bg-gray-50">
                      <p className="text-sm font-medium">Schedule change</p>
                      <p className="text-xs text-gray-600">Case 3 moved from Theatre 2 to Theatre 3</p>
                      <p className="text-xs text-blue-600 mt-1">1 hour ago</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Help - Hidden on small screens */}
            <button className="hidden sm:block p-2 hover:bg-blue-800 rounded-lg transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Settings - Hidden on small screens */}
            <button className="hidden sm:block p-2 hover:bg-blue-800 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* User Profile - Simplified on mobile */}
            <div className="flex items-center space-x-2 pl-2 sm:pl-4 border-l border-blue-600">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold">Alexander Monterubio</p>
                <p className="text-xs text-blue-200">Theatre Manager/Innovator</p>
                <p className="text-xs text-blue-200">NHSCEP Hospital</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-xs sm:text-base">
                AM
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Tabs */}
      <div className="bg-gray-50 border-b border-gray-200 hidden lg:block">
        <div className="px-4">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                    border-b-2 hover:bg-white
                    ${activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowMobileMenu(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all
                    ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
