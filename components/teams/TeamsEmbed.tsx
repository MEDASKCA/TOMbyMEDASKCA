'use client';

import React from 'react';
import { X } from 'lucide-react';

interface TeamsEmbedProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamsEmbed({ isOpen, onClose }: TeamsEmbedProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-gradient-to-r from-blue-600 to-teal-500">
          <div className="flex items-center space-x-3">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
              <path d="M20.625 8.127v7.746a2.252 2.252 0 01-2.25 2.25h-1.125v-6.75h-4.5V6.627h5.625a2.252 2.252 0 012.25 2.25zm-9.75-1.5v4.5h-4.5v-4.5h4.5zm0 9v4.5h-4.5v-4.5h4.5zm7.875-7.5H13.5v10.746h5.25a.75.75 0 00.75-.75V8.877a.75.75 0 00-.75-.75zm-15 3.75a2.252 2.252 0 012.25-2.25h4.5v10.5h-4.5a2.252 2.252 0 01-2.25-2.25v-6zm7.5-3.75h-4.5a3.754 3.754 0 00-3.75 3.75v6a3.754 3.754 0 003.75 3.75h4.5v.75a1.5 1.5 0 001.5 1.5h7.5a1.5 1.5 0 001.5-1.5V8.127a3.754 3.754 0 00-3.75-3.75h-7.5v1.5z" />
            </svg>
            <h2 className="text-xl font-semibold text-white">Microsoft Teams</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src="https://teams.microsoft.com"
            className="w-full h-full border-0"
            title="Microsoft Teams"
            allow="microphone; camera; display-capture"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>

        {/* Info Message */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t dark:border-gray-700">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Note:</strong> You&apos;ll need to sign in to Microsoft Teams separately.
            For full integration, consider setting up the Teams JavaScript SDK with your organization&apos;s app registration.
          </p>
        </div>
      </div>
    </div>
  );
}
