'use client';

import React from 'react';
import { Home, Sparkles, Activity, Package, Bell, Menu } from 'lucide-react';

interface BottomNavProps {
  currentPage: 'feeds' | 'chat' | 'theatres' | 'staff' | 'alerts' | 'menu';
  onNavigate: (page: 'feeds' | 'chat' | 'theatres' | 'staff' | 'alerts' | 'menu') => void;
  alertCount?: number;
}

export default function BottomNav({ currentPage, onNavigate, alertCount = 0 }: BottomNavProps) {
  const navItems = [
    { id: 'feeds' as const, icon: Home, label: 'Home' },
    { id: 'chat' as const, icon: Sparkles, label: 'TOM AI' },
    { id: 'theatres' as const, icon: Activity, label: 'Ops' },
    { id: 'staff' as const, icon: Package, label: 'Logistics' },
    { id: 'alerts' as const, icon: Bell, label: 'Alerts', badge: alertCount },
    { id: 'menu' as const, icon: Menu, label: 'Menu' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="grid grid-cols-6 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors relative ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
