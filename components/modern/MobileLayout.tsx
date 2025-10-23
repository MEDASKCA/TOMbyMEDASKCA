'use client';

import React, { useState } from 'react';
import BottomNav from './BottomNav';
import ModernDashboard from './ModernDashboard';
import MobileRoster from '@/features/roster/components/MobileRoster';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileLayout() {
  const [activeTab, setActiveTab] = useState('home');

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <ModernDashboard />;
      case 'theatres':
        return (
          <div className="p-4 text-center text-gray-500">
            <p>Theatres view coming soon...</p>
          </div>
        );
      case 'staff':
        return <MobileRoster />;
      case 'alerts':
        return (
          <div className="p-4 text-center text-gray-500">
            <p>Alerts view coming soon...</p>
          </div>
        );
      case 'menu':
        return (
          <div className="p-4 text-center text-gray-500">
            <p>Menu view coming soon...</p>
          </div>
        );
      default:
        return <ModernDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Main content area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="min-h-screen"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Bottom navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notificationCount={3}
      />
    </div>
  );
}
