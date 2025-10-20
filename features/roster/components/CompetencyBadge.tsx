'use client';

import React from 'react';
import { Award, TrendingUp, Users, Star } from 'lucide-react';
import type { Competency } from '@/types';

interface CompetencyBadgeProps {
  competency: Competency;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export default function CompetencyBadge({ competency, size = 'md', showDetails = false }: CompetencyBadgeProps) {
  const getLevelConfig = (level: Competency['level']) => {
    switch (level) {
      case 'expert':
        return {
          color: 'purple',
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          text: 'text-purple-700 dark:text-purple-400',
          border: 'border-purple-300 dark:border-purple-700',
          icon: Star,
          label: 'Expert',
          description: 'Can perform independently and teach others',
        };
      case 'competent':
        return {
          color: 'green',
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-400',
          border: 'border-green-300 dark:border-green-700',
          icon: Award,
          label: 'Competent',
          description: 'Certified to perform independently',
        };
      case 'assisted':
        return {
          color: 'amber',
          bg: 'bg-amber-100 dark:bg-amber-900/30',
          text: 'text-amber-700 dark:text-amber-400',
          border: 'border-amber-300 dark:border-amber-700',
          icon: TrendingUp,
          label: 'Assisted',
          description: 'Requires supervision',
        };
      case 'learning':
        return {
          color: 'blue',
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-700 dark:text-blue-400',
          border: 'border-blue-300 dark:border-blue-700',
          icon: Users,
          label: 'Learning',
          description: 'In training phase',
        };
    }
  };

  const config = getLevelConfig(competency.level);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (showDetails) {
    return (
      <div className={`${config.bg} border ${config.border} rounded-lg p-3`}>
        <div className="flex items-start space-x-3">
          <div className={`${config.bg} border ${config.border} rounded-full p-2`}>
            <Icon className={`${iconSizes.md} ${config.text}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className={`font-semibold ${config.text}`}>{competency.procedureName}</h4>
              <span className={`text-xs font-medium ${config.text} ${config.bg} border ${config.border} px-2 py-0.5 rounded-full`}>
                {config.label}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{config.description}</p>

            {competency.certifiedDate && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Certified: {new Date(competency.certifiedDate).toLocaleDateString('en-GB')}
              </p>
            )}

            {competency.equipmentFamiliarity && competency.equipmentFamiliarity.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Equipment:</p>
                <div className="flex flex-wrap gap-1">
                  {competency.equipmentFamiliarity.map((eq, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {competency.supplierTraining && competency.supplierTraining.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Supplier Training:</p>
                <div className="flex flex-wrap gap-1">
                  {competency.supplierTraining.map((supplier, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded"
                    >
                      {supplier}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center space-x-1.5 ${config.bg} border ${config.border} ${config.text} rounded-full ${sizeClasses[size]} font-medium`}
      title={`${competency.procedureName} - ${config.description}`}
    >
      <Icon className={iconSizes[size]} />
      <span>{competency.procedureName}</span>
      {size !== 'sm' && (
        <span className={`text-xs ${config.bg} border ${config.border} px-1.5 py-0.5 rounded-full`}>
          {config.label}
        </span>
      )}
    </div>
  );
}
