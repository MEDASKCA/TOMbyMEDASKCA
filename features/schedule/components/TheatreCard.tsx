'use client';

import React from 'react';
import { Clock, Users, AlertCircle, CheckCircle, Wrench, Sparkles } from 'lucide-react';
import type { Theatre, Case } from '@/types';

interface TheatreCardProps {
  theatre: Theatre;
  cases: Case[];
}

export default function TheatreCard({ theatre, cases }: TheatreCardProps) {
  // Status configuration
  const statusConfig = {
    ready: {
      color: 'green',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-300 dark:border-green-700',
      text: 'text-green-700 dark:text-green-400',
      icon: CheckCircle,
      label: 'Ready',
    },
    'in-use': {
      color: 'blue',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-300 dark:border-blue-700',
      text: 'text-blue-700 dark:text-blue-400',
      icon: Users,
      label: 'In Use',
    },
    cleaning: {
      color: 'purple',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-300 dark:border-purple-700',
      text: 'text-purple-700 dark:text-purple-400',
      icon: Sparkles,
      label: 'Cleaning',
    },
    maintenance: {
      color: 'amber',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-300 dark:border-amber-700',
      text: 'text-amber-700 dark:text-amber-400',
      icon: Wrench,
      label: 'Maintenance',
    },
    emergency: {
      color: 'red',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-300 dark:border-red-700',
      text: 'text-red-700 dark:text-red-400',
      icon: AlertCircle,
      label: 'Emergency',
    },
  };

  const config = statusConfig[theatre.status];
  const StatusIcon = config.icon;

  // Current case
  const currentCase = cases.find((c) => c.status === 'in-progress');
  const nextCase = cases.find((c) => c.status === 'scheduled');

  // Traffic light indicator
  const getTrafficLight = () => {
    if (theatre.status === 'ready') return '🟢';
    if (theatre.status === 'in-use') return '🔵';
    if (theatre.status === 'cleaning') return '🟣';
    if (theatre.status === 'maintenance') return '🟡';
    if (theatre.status === 'emergency') return '🔴';
    return '⚪';
  };

  return (
    <div
      className={`${config.bg} border-2 ${config.border} rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getTrafficLight()}</span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{theatre.name}</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{theatre.specialty}</p>
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${config.bg} border ${config.border}`}>
          <StatusIcon className={`w-4 h-4 ${config.text}`} />
          <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
        </div>
      </div>

      {/* Current Case */}
      {currentCase && (
        <div className="mb-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">Now Operating</span>
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              {currentCase.scheduledStartTime} - {currentCase.scheduledEndTime}
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentCase.procedureName}</p>
          {currentCase.notes && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{currentCase.notes}</p>
          )}
        </div>
      )}

      {/* Next Case */}
      {nextCase && !currentCase && (
        <div className="mb-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Next Case</span>
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              {nextCase.scheduledStartTime}
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{nextCase.procedureName}</p>
        </div>
      )}

      {/* Case List */}
      {cases.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Today's Schedule</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white">{cases.length} cases</span>
          </div>
          <div className="space-y-1">
            {cases.map((c) => (
              <div
                key={c.id}
                className={`text-xs p-2 rounded ${
                  c.status === 'in-progress'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 font-medium'
                    : c.status === 'completed'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-300 line-through'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{c.scheduledStartTime}</span>
                  <span className="truncate ml-2">{c.procedureName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">No cases scheduled</p>
        </div>
      )}

      {/* Location */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">{theatre.location}</p>
      </div>
    </div>
  );
}
