'use client';

import React from 'react';
import { X, Activity, Calendar, Users, ClipboardList, Bell, Package, FileText, Target, BarChart3 } from 'lucide-react';

interface SubMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuType: 'menu' | null;
  onNavigate: (page: string) => void;
}

export default function SubMenuModal({ isOpen, onClose, menuType, onNavigate }: SubMenuModalProps) {
  if (!isOpen || !menuType) return null;

  const menuItems = {
    menu: [
      { id: 'inventory', icon: Package, label: 'Inventory', description: 'Equipment & supplies' },
      { id: 'procedures', icon: FileText, label: 'Procedures', description: 'Clinical procedures list' },
      { id: 'readiness', icon: Target, label: 'Readiness', description: 'Theatre readiness status' },
      { id: 'analytics', icon: BarChart3, label: 'Analytics', description: 'Performance metrics' }
    ]
  };

  const items = menuItems[menuType];
  const title = 'Menu';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-[100]">
      <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-3 pb-6">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className="w-full bg-white border border-gray-200 rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-50 hover:border-blue-300 transition-all shadow-sm"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
