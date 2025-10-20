'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, AlertCircle, Settings, FileText } from 'lucide-react';
import { useTeams } from '@/contexts/TeamsContext';

export default function MicrosoftTeamsEmbed() {
  const [isConfigured, setIsConfigured] = useState(false);
  const { isAuthenticated, userAccount, signIn } = useTeams();

  useEffect(() => {
    // Check if Azure AD is configured
    const clientId = process.env.NEXT_PUBLIC_AZURE_CLIENT_ID;
    const tenantId = process.env.NEXT_PUBLIC_AZURE_TENANT_ID;
    setIsConfigured(!!(clientId && tenantId));
  }, []);

  const openInNewWindow = () => {
    window.open('https://teams.microsoft.com', '_blank', 'noopener,noreferrer');
  };

  const handleSignIn = async () => {
    try {
      await signIn(true);
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 relative">
      {/* Attempt to load Teams */}
      <iframe
        src="https://teams.microsoft.com"
        className="w-full h-full border-0"
        title="Microsoft Teams"
        allow="microphone; camera; display-capture"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
      />

      {/* Error overlay - shown when iframe fails to load */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 p-8">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Microsoft Teams Cannot Be Embedded
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                For security reasons, Microsoft Teams blocks embedding in iframes. This is a security
                feature that Microsoft has in place to protect your data.
              </p>

              {/* Configuration Status */}
              {!isConfigured && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-600 p-4 mb-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 font-semibold mb-2">
                    Azure AD Not Configured
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-3">
                    To enable proper Microsoft Teams integration, you need to set up Azure AD credentials.
                    We&apos;ve created a comprehensive setup guide for you.
                  </p>
                  <a
                    href="/TEAMS_INTEGRATION_SETUP.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded transition-colors"
                  >
                    <FileText size={14} />
                    <span>View Setup Guide</span>
                  </a>
                </div>
              )}

              {/* Authentication Status */}
              {isConfigured && !isAuthenticated && (
                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-600 p-4 mb-4">
                  <p className="text-sm text-green-800 dark:text-green-300 font-semibold mb-2">
                    Azure AD Configured!
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-400 mb-3">
                    Your Azure credentials are set up. Sign in with Microsoft to access Teams integration features.
                  </p>
                  <button
                    onClick={handleSignIn}
                    className="inline-flex items-center space-x-2 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors"
                  >
                    <Settings size={14} />
                    <span>Sign In with Microsoft</span>
                  </button>
                </div>
              )}

              {/* Authenticated */}
              {isAuthenticated && userAccount && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 mb-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300 font-semibold mb-1">
                    Signed In
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    {userAccount.name || userAccount.username}
                  </p>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Alternative Options:</strong>
                </p>
                <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-400 list-disc list-inside">
                  <li>Open Teams in a new window for full functionality</li>
                  <li>Use Microsoft Teams Desktop App alongside this app</li>
                  <li>Complete Azure AD setup for deeper integration</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={openInNewWindow}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-teal-600 transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <ExternalLink size={20} />
                  <span>Open Teams in New Window</span>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <strong>For Developers:</strong> Check the{' '}
                  <a
                    href="/TEAMS_INTEGRATION_SETUP.md"
                    target="_blank"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    TEAMS_INTEGRATION_SETUP.md
                  </a>{' '}
                  file for detailed instructions on setting up proper Teams integration with Azure AD.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
