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
  Activity
} from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TopBar({ activeTab, setActiveTab }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

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
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* NHS Logo Placeholder */}
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl font-bold">Theatre Operations Manager</h1>
                <p className="text-xs text-blue-200">Demo for NHS Clinical Entrepreneur Programme</p>
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Live Status Indicator */}
            <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">All Systems Operational</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-blue-800 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-xl z-50">
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

            {/* Help */}
            <button className="p-2 hover:bg-blue-800 rounded-lg transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Settings */}
            <button className="p-2 hover:bg-blue-800 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2 pl-4 border-l border-blue-600">
              <div className="text-right">
                <p className="text-sm font-semibold">Theatre Manager</p>
                <p className="text-xs text-blue-200">Royal London Hospital</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                TM
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="px-4">
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all
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
    </div>
  );
}