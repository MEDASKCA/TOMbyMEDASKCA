'use client';

import React from 'react';
import { Home, Calendar, Users, Bell, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationCount?: number;
}

export default function BottomNav({ activeTab, onTabChange, notificationCount = 0 }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'theatres', label: 'Theatres', icon: Calendar },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: notificationCount },
    { id: 'menu', label: 'Menu', icon: Menu },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full relative focus:outline-none active:bg-gray-50 transition-colors"
            >
              {/* Notification badge */}
              {tab.badge && tab.badge > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-1/4 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {tab.badge > 9 ? '9+' : tab.badge}
                </motion.div>
              )}

              {/* Icon */}
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />

              {/* Label */}
              <span
                className={`text-xs mt-1 font-medium transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
