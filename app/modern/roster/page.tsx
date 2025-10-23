'use client';

import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import DesktopRoster from '@/features/roster/components/DesktopRoster';
import MobileRoster from '@/features/roster/components/MobileRoster';
import Link from 'next/link';

export default function RosterPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* TOM Header */}
      <header className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white px-6 py-3 shadow-lg flex items-center justify-between flex-shrink-0">
        <Link href="/" className="flex items-center space-x-3">
          <div className="text-2xl font-bold">TOM</div>
          <div className="text-sm opacity-90">by MEDASKCA</div>
        </Link>
        <div className="text-sm font-medium">Staff Roster - Live Search</div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {isMobile ? <MobileRoster /> : <DesktopRoster />}
      </div>
    </div>
  );
}
