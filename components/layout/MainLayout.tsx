'use client';

import React, { useState, useEffect } from 'react';
import TopNavbar from './TopNavbar';
import MicrosoftTeamsEmbed from '@/components/teams/MicrosoftTeamsEmbed';
import TheatreSchedule from '@/features/schedule/components/TheatreSchedule';
import ReadinessDashboard from '@/features/readiness/components/ReadinessDashboard';
import StaffRoster from '@/features/roster/components/StaffRoster';
import InventoryList from '@/features/inventory/components/InventoryList';
import ProcedureList from '@/features/procedures/components/ProcedureList';
import AnalyticsDashboard from '@/features/analytics/components/AnalyticsDashboard';
import ErrorBoundary from '@/components/ErrorBoundary';
import { initializeTomData } from '@/lib/initializeTomData';
import { LayoutDashboard } from 'lucide-react';

export default function MainLayout() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Initialize TOM demo data on first load
    async function initialize() {
      try {
        await initializeTomData();
      } catch (error) {
        console.error('Error initializing TOM data:', error);
      } finally {
        setIsInitializing(false);
      }
    }
    initialize();
  }, []);

  const renderContent = () => {
    // Microsoft Teams
    if (activeView === 'msteams') {
      return <MicrosoftTeamsEmbed />;
    }

    // NHSmail
    if (activeView === 'nhsmail') {
      return (
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
          <iframe
            src="https://mail.nhs.net"
            className="w-full h-full border-0"
            title="NHSmail"
            allow="microphone; camera"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
          />
        </div>
      );
    }

    // TOM Features
    if (isInitializing) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Initializing TOM
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Setting up theatre operations data...
            </p>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case 'dashboard':
        return <ReadinessDashboard />;

      case 'schedule':
        return <TheatreSchedule />;

      case 'roster':
        return <StaffRoster />;

      case 'inventory':
        return <InventoryList />;

      case 'procedures':
        return <ProcedureList />;

      case 'analytics':
        return <AnalyticsDashboard />;

      default:
        return (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
            <div className="text-center">
              <LayoutDashboard className="w-20 h-20 text-teal-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to TOM
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                Theatre Operations Manager
              </p>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Intelligent theatre management for NHS trusts. Manage schedules, staff, inventory, and readiness in one platform.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-gray-900">
      {/* Top Navbar */}
      <TopNavbar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <ErrorBoundary>
          {renderContent()}
        </ErrorBoundary>
      </div>
    </div>
  );
}
