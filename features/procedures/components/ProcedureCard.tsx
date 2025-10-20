'use client';

import React, { useState } from 'react';
import {
  Clipboard,
  Users,
  Package,
  Box,
  Pill,
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Shield,
} from 'lucide-react';
import type { ProcedureCard as ProcedureCardType } from '@/types';

interface ProcedureCardProps {
  procedure: ProcedureCardType;
  onSelect?: (procedure: ProcedureCardType) => void;
  selectable?: boolean;
}

export default function ProcedureCard({ procedure, onSelect, selectable = false }: ProcedureCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getRiskColor = (risk: ProcedureCardType['riskLevel']) => {
    switch (risk) {
      case 'high':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-400',
          border: 'border-red-300 dark:border-red-700',
          icon: AlertTriangle,
        };
      case 'medium':
        return {
          bg: 'bg-amber-100 dark:bg-amber-900/30',
          text: 'text-amber-700 dark:text-amber-400',
          border: 'border-amber-300 dark:border-amber-700',
          icon: AlertTriangle,
        };
      case 'low':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-400',
          border: 'border-green-300 dark:border-green-700',
          icon: CheckCircle,
        };
    }
  };

  const riskConfig = getRiskColor(procedure.riskLevel);
  const RiskIcon = riskConfig.icon;

  const getAnesthesiaColor = (type: ProcedureCardType['anesthesiaType']) => {
    switch (type) {
      case 'general':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700';
      case 'regional':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700';
      case 'local':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700';
      case 'sedation':
        return 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-700';
    }
  };

  const formatRole = (role: string) => {
    return role
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 border-2 ${riskConfig.border} rounded-lg overflow-hidden hover:shadow-lg transition-all ${
        selectable ? 'cursor-pointer' : ''
      }`}
      onClick={selectable ? () => onSelect?.(procedure) : undefined}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`${riskConfig.bg} border-2 ${riskConfig.border} rounded-lg p-2.5`}>
              <Clipboard className={`w-5 h-5 ${riskConfig.text}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{procedure.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{procedure.specialty}</p>
            </div>
          </div>
        </div>

        {/* Key Info Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {/* Risk Level */}
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border ${riskConfig.bg} ${riskConfig.border}`}>
            <RiskIcon className={`w-4 h-4 ${riskConfig.text}`} />
            <span className={`text-xs font-medium ${riskConfig.text} uppercase`}>{procedure.riskLevel} Risk</span>
          </div>

          {/* Duration */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full border bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700">
            <Clock className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
              {formatDuration(procedure.expectedDuration)}
            </span>
          </div>

          {/* Anesthesia */}
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border ${getAnesthesiaColor(procedure.anesthesiaType)}`}>
            <Shield className="w-4 h-4" />
            <span className="text-xs font-medium capitalize">{procedure.anesthesiaType} Anesthesia</span>
          </div>
        </div>

        {/* Requirements Summary */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {/* Staff Required */}
          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 p-2 rounded text-center">
            <Users className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Staff</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{procedure.requiredStaff.length}</p>
          </div>

          {/* Equipment */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-2 rounded text-center">
            <Box className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Equipment</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{procedure.requiredEquipment.length}</p>
          </div>

          {/* Consumables */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-2 rounded text-center">
            <Package className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Consumables</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{procedure.requiredConsumables.length}</p>
          </div>

          {/* Implants */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-2 rounded text-center">
            <Pill className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Implants</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {procedure.requiredImplants?.length || 0}
            </p>
          </div>
        </div>

        {/* Special Requirements */}
        {procedure.specialRequirements && procedure.specialRequirements.length > 0 && (
          <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
            <p className="text-xs font-semibold text-amber-900 dark:text-amber-300 mb-1">Special Requirements:</p>
            <ul className="text-xs text-amber-800 dark:text-amber-400 space-y-0.5 list-disc list-inside">
              {procedure.specialRequirements.slice(0, 3).map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
              {procedure.specialRequirements.length > 3 && !expanded && (
                <li className="font-medium">+{procedure.specialRequirements.length - 3} more...</li>
              )}
            </ul>
          </div>
        )}

        {/* Expand Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="w-full flex items-center justify-center space-x-2 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors border-t border-gray-200 dark:border-gray-700 -mx-4 -mb-4 mt-3 px-4 pt-3"
        >
          <span>{expanded ? 'Hide Details' : 'Show Full Requirements'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 space-y-4">
          {/* Required Staff */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
              <Users className="w-4 h-4 text-teal-500" />
              <span>Required Staff ({procedure.requiredStaff.length})</span>
            </h4>
            <div className="space-y-2">
              {procedure.requiredStaff.map((staff, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formatRole(staff.role)}</p>
                    {staff.grade && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">Grade: {staff.grade}</p>
                    )}
                    {staff.requiredCompetency && (
                      <p className="text-xs text-teal-600 dark:text-teal-400">Competency required</p>
                    )}
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">×{staff.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Equipment */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
              <Box className="w-4 h-4 text-blue-500" />
              <span>Required Equipment ({procedure.requiredEquipment.length})</span>
            </h4>
            <div className="space-y-2">
              {procedure.requiredEquipment.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded border ${
                    item.isCritical
                      ? 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-700'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.itemName}</p>
                    {item.isCritical && (
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium">Critical Item</p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">×{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Consumables */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
              <Package className="w-4 h-4 text-green-500" />
              <span>Required Consumables ({procedure.requiredConsumables.length})</span>
            </h4>
            <div className="space-y-2">
              {procedure.requiredConsumables.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded border ${
                    item.isCritical
                      ? 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-700'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.itemName}</p>
                    {item.isCritical && (
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium">Critical Item</p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">×{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Implants */}
          {procedure.requiredImplants && procedure.requiredImplants.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                <Pill className="w-4 h-4 text-purple-500" />
                <span>Required Implants ({procedure.requiredImplants.length})</span>
              </h4>
              <div className="space-y-2">
                {procedure.requiredImplants.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/10 rounded border border-purple-300 dark:border-purple-700"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.itemName}</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">UDI tracking required</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">×{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Special Requirements */}
          {procedure.specialRequirements && procedure.specialRequirements.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">All Special Requirements</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                {procedure.specialRequirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
