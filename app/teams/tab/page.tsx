'use client';

import React, { useEffect, useState } from 'react';
import { initializeTeamsSDK, getTeamsContext, notifyAppLoaded, notifySuccess } from '@/lib/teamsSDK';
import MainLayout from '@/components/layout/MainLayout';
import { Loader2, AlertCircle } from 'lucide-react';

interface TeamsContext {
  user?: {
    displayName?: string;
  };
  team?: {
    displayName?: string;
  };
  channel?: {
    displayName?: string;
  };
}

export default function TeamsTabPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamsContext, setTeamsContext] = useState<TeamsContext | null>(null);

  useEffect(() => {
    const initTeams = async () => {
      try {
        setIsLoading(true);

        // Initialize Teams SDK
        const success = await initializeTeamsSDK();

        if (success) {
          // Notify Teams that app is loaded
          notifyAppLoaded();

          // Get Teams context
          const context = await getTeamsContext();
          setTeamsContext(context);

          // Notify success
          notifySuccess();

          setError(null);
        } else {
          setError('Failed to initialize Teams SDK. This page must be loaded within Microsoft Teams.');
        }
      } catch (err) {
        console.error('Teams initialization error:', err);
        setError('An error occurred while initializing Teams integration.');
      } finally {
        setIsLoading(false);
      }
    };

    initTeams();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading Microsoft Teams integration...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Teams Integration Error
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {error}
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note:</strong> This page is designed to be used as a Microsoft Teams tab.
                  Make sure you&apos;ve:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-400 list-disc list-inside">
                  <li>Registered your app in Azure AD</li>
                  <li>Created a Teams app in Teams Developer Portal</li>
                  <li>Installed the app in your Teams environment</li>
                  <li>Configured the correct Content URL pointing to this page</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - show the main app
  return (
    <div className="h-screen overflow-hidden">
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && teamsContext && (
        <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-4 py-2 text-xs">
          <strong>Teams Context:</strong> User: {teamsContext.user?.displayName},
          Team: {teamsContext.team?.displayName || 'N/A'},
          Channel: {teamsContext.channel?.displayName || 'N/A'}
        </div>
      )}

      {/* Main application */}
      <MainLayout />
    </div>
  );
}
