'use client';

import React, { useState } from 'react';
import TopBar from '@/components/navigation/TopBar';
import DashboardView from '@/components/views/DashboardView';
import TheatreScheduleView from '@/components/views/TheatreScheduleView';
import DesktopRoster from '@/features/roster/components/DesktopRoster';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'schedule':
        return <TheatreScheduleView />;
      case 'roster':
        return <DesktopRoster />;
      case 'inventory':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Inventory Management</h2>
              <p className="text-gray-500">Inventory tracking coming soon</p>
            </div>
          </div>
        );
      case 'procedures':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Procedure Cards</h2>
              <p className="text-gray-500">Procedure management coming soon</p>
            </div>
          </div>
        );
      case 'readiness':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Readiness Dashboard</h2>
              <p className="text-gray-500">Theatre readiness monitoring coming soon</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Analytics & Reports</h2>
              <p className="text-gray-500">Performance analytics coming soon</p>
            </div>
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  // Full-screen layout for roster and dashboard tabs
  if (activeTab === 'roster' || activeTab === 'dashboard') {
    return (
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-100">
        {/* TopBar Navigation */}
        <TopBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'roster' ? <DesktopRoster /> : <DashboardView />}
        </div>
      </div>
    );
  }

  // Standard layout for other tabs
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <TopBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className={activeTab === 'schedule' ? 'flex-1' : 'container mx-auto px-2 sm:px-4 py-3 sm:py-6 flex-1'}>
        <div className={activeTab === 'schedule' ? '' : 'bg-white rounded-lg shadow-sm p-2 sm:p-4'}>
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-3 sm:py-4 mt-auto">
        <div className="container mx-auto px-2 sm:px-4 text-center text-xs sm:text-sm">
          <p className="hidden sm:block">© 2025 Theatre Operations Manager - Demo for NHS Clinical Entrepreneur Programme</p>
          <p className="sm:hidden">© 2025 TOM - NHS CEP Demo</p>
          <p className="text-gray-400 mt-1 text-[10px] sm:text-xs">Version 1.0.0 | Secure Healthcare Platform</p>
        </div>
      </footer>
    </div>
  );
}