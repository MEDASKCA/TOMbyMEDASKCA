'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Users, Package, Box, Building } from 'lucide-react';
import type { Theatre, ReadinessCheck, ReadinessLevel } from '@/types';

interface ReadinessCardProps {
  theatre: Theatre;
  readiness?: ReadinessCheck;
  onRefresh: () => void;
}

export default function ReadinessCard({ theatre, readiness }: ReadinessCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getStatusConfig = (status: ReadinessLevel) => {
    switch (status) {
      case 'ready':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-300 dark:border-green-700',
          text: 'text-green-700 dark:text-green-400',
          icon: '🟢',
          label: 'Ready',
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-300 dark:border-amber-700',
          text: 'text-amber-700 dark:text-amber-400',
          icon: '🟡',
          label: 'Warning',
        };
      case 'not-ready':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-300 dark:border-red-700',
          text: 'text-red-700 dark:text-red-400',
          icon: '🔴',
          label: 'Not Ready',
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          border: 'border-gray-300 dark:border-gray-700',
          text: 'text-gray-700 dark:text-gray-400',
          icon: '⚪',
          label: 'Unknown',
        };
    }
  };

  const overallConfig = readiness ? getStatusConfig(readiness.overall) : getStatusConfig('not-ready' as ReadinessLevel);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'staffing':
        return <Users className="w-4 h-4" />;
      case 'equipment':
        return <Box className="w-4 h-4" />;
      case 'consumables':
        return <Package className="w-4 h-4" />;
      case 'environment':
        return <Building className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className={`${overallConfig.bg} border-2 ${overallConfig.border} rounded-lg overflow-hidden hover:shadow-lg transition-shadow`}>
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{overallConfig.icon}</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{theatre.name}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{theatre.specialty}</p>
          </div>
          <div className={`px-3 py-1 rounded-full ${overallConfig.bg} border ${overallConfig.border}`}>
            <span className={`text-xs font-medium ${overallConfig.text}`}>{overallConfig.label}</span>
          </div>
        </div>

        {/* Quick Summary */}
        {readiness && (
          <div className="grid grid-cols-4 gap-2 mb-3">
            {readiness.checks.map((check) => {
              const config = getStatusConfig(check.status);
              return (
                <div
                  key={check.category}
                  className={`p-2 rounded ${config.bg} border ${config.border} text-center`}
                  title={check.category}
                >
                  {getCategoryIcon(check.category)}
                  <p className={`text-xs font-medium ${config.text} mt-1 capitalize`}>
                    {check.category === 'staffing' ? 'Staff' : check.category}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center space-x-2 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <span>{expanded ? 'Hide Details' : 'Show Details'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Details */}
      {expanded && readiness && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-4">
          {readiness.checks.map((check) => (
            <div key={check.category}>
              <div className="flex items-center space-x-2 mb-2">
                {getCategoryIcon(check.category)}
                <h4 className="font-semibold text-gray-900 dark:text-white capitalize">{check.category}</h4>
                <span
                  className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${
                    check.status === 'ready'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : check.status === 'warning'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {check.status === 'ready' ? '✓' : check.status === 'warning' ? '⚠' : '✗'}
                </span>
              </div>

              <div className="space-y-1 pl-6">
                {check.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`text-sm p-2 rounded ${
                      item.status === 'ready'
                        ? 'bg-green-50 dark:bg-green-900/10'
                        : item.status === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-900/10'
                        : 'bg-red-50 dark:bg-red-900/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-gray-900 dark:text-white font-medium">{item.name}</span>
                      <span className="text-gray-600 dark:text-gray-400 text-xs">
                        {typeof item.actual === 'number' && typeof item.required === 'number'
                          ? `${item.actual}/${item.required}`
                          : item.actual
                          ? '✓'
                          : '✗'}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Suggestions */}
          {readiness.overall !== 'ready' && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Suggested Actions:</h4>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                {readiness.checks
                  .filter((c) => c.status !== 'ready')
                  .flatMap((c) =>
                    c.items
                      .filter((i) => i.status !== 'ready')
                      .map((i, idx) => (
                        <li key={`${c.category}-${idx}`}>
                          <span className="font-medium">{c.category}:</span> {i.notes || `Check ${i.name}`}
                        </li>
                      ))
                  )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
