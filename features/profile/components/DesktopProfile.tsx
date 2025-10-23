'use client';

import React from 'react';

export default function DesktopProfile() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Staff Profile</h1>
        <p className="text-gray-600 mb-6">
          For the best experience, please view the profile page on mobile or use the mobile view in your browser.
        </p>
        <p className="text-sm text-gray-500">
          Desktop profile view coming soon...
        </p>
        <div className="mt-8">
          <a
            href="/profile"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View on Mobile
          </a>
        </div>
      </div>
    </div>
  );
}
