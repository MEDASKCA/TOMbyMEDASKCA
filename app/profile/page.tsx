'use client';

import React, { useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import DesktopProfile from '@/features/profile/components/DesktopProfile';
import MobileProfile from '@/features/profile/components/MobileProfile';

export default function ProfilePage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return isMobile ? <MobileProfile /> : <DesktopProfile />;
}
