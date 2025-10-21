'use client';

import React, { useState } from 'react';
import TopBar from '@/components/navigation/TopBar';
import DashboardView from '@/components/views/DashboardView';
import TheatreScheduleView from '@/components/views/TheatreScheduleView';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'schedule':
        return <TheatreScheduleView />;
      case 'roster':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Staff Roster</h2>
              <p className="text-gray-500">Staff management coming soon</p>
            </div>
          </div>
        );
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

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className={activeTab === 'schedule' ? '' : 'container mx-auto px-4 py-6'}>
        <div className={activeTab === 'schedule' ? '' : 'bg-white rounded-lg shadow-sm'}>
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2025 Theatre Operations Manager - Demo for NHS Clinical Entrepreneur Programme</p>
          <p className="text-gray-400 mt-1">Version 1.0.0 | Secure Healthcare Platform</p>
        </div>
      </footer>
    </div>
  );
}