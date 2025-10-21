'use client';

import React, { useState } from 'react';
import {
  X,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Filter,
  BarChart3,
  Calendar
} from 'lucide-react';

interface TurnoverTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterUnit = 'all' | 'main' | 'acad' | 'recovery';

export default function TurnoverTimeModal({ isOpen, onClose }: TurnoverTimeModalProps) {
  const [selectedUnit, setSelectedUnit] = useState<FilterUnit>('all');

  if (!isOpen) return null;

  const todaysSummary = {
    averageTurnover: 18,
    target: 20,
    bestTheatre: 'Main Theatre 4',
    worstTheatre: 'Main Theatre 7',
    totalTurnovers: 47,
    onTarget: 34,
    delayed: 13
  };

  const theatreData = [
    {
      theatre: 'Main Theatre 1',
      unit: 'main',
      currentTurnover: 15,
      avgTurnover: 16,
      target: 20,
      turnoversToday: 4,
      onTarget: 3,
      delayed: 1,
      trend: 'improving',
      delayReasons: [
        { reason: 'Equipment setup delay', time: '09:30', duration: '8 min' }
      ],
      lastTurnover: '11:45',
      nextCase: '12:00'
    },
    {
      theatre: 'Main Theatre 2',
      unit: 'main',
      currentTurnover: 22,
      avgTurnover: 19,
      target: 20,
      turnoversToday: 3,
      onTarget: 2,
      delayed: 1,
      trend: 'worsening',
      delayReasons: [
        { reason: 'Cleaning required - spillage', time: '10:15', duration: '5 min' }
      ],
      lastTurnover: '10:37',
      nextCase: '11:00'
    },
    {
      theatre: 'Main Theatre 3',
      unit: 'main',
      currentTurnover: 17,
      avgTurnover: 17,
      target: 20,
      turnoversToday: 5,
      onTarget: 5,
      delayed: 0,
      trend: 'stable',
      delayReasons: [],
      lastTurnover: '13:12',
      nextCase: '13:30'
    },
    {
      theatre: 'Main Theatre 4',
      unit: 'main',
      currentTurnover: 12,
      avgTurnover: 14,
      target: 20,
      turnoversToday: 6,
      onTarget: 6,
      delayed: 0,
      trend: 'improving',
      delayReasons: [],
      lastTurnover: '14:20',
      nextCase: '14:35'
    },
    {
      theatre: 'Main Theatre 5',
      unit: 'main',
      currentTurnover: 19,
      avgTurnover: 18,
      target: 20,
      turnoversToday: 4,
      onTarget: 3,
      delayed: 1,
      trend: 'stable',
      delayReasons: [
        { reason: 'Patient handover delay', time: '11:05', duration: '3 min' }
      ],
      lastTurnover: '11:08',
      nextCase: '11:30'
    },
    {
      theatre: 'Main Theatre 7',
      unit: 'main',
      currentTurnover: 28,
      avgTurnover: 25,
      target: 20,
      turnoversToday: 2,
      onTarget: 0,
      delayed: 2,
      trend: 'worsening',
      delayReasons: [
        { reason: 'Porter delay', time: '08:45', duration: '10 min' },
        { reason: 'Missing equipment', time: '10:30', duration: '8 min' }
      ],
      lastTurnover: '10:38',
      nextCase: '11:15'
    },
    {
      theatre: 'Main Theatre 8',
      unit: 'main',
      currentTurnover: 16,
      avgTurnover: 16,
      target: 20,
      turnoversToday: 5,
      onTarget: 5,
      delayed: 0,
      trend: 'stable',
      delayReasons: [],
      lastTurnover: '12:50',
      nextCase: '13:10'
    },
    {
      theatre: 'DSU Theatre 1',
      unit: 'acad',
      currentTurnover: 20,
      avgTurnover: 19,
      target: 20,
      turnoversToday: 3,
      onTarget: 3,
      delayed: 0,
      trend: 'stable',
      delayReasons: [],
      lastTurnover: '11:30',
      nextCase: '11:50'
    },
    {
      theatre: 'DSU Theatre 2',
      unit: 'acad',
      currentTurnover: 21,
      avgTurnover: 20,
      target: 20,
      turnoversToday: 3,
      onTarget: 2,
      delayed: 1,
      trend: 'stable',
      delayReasons: [
        { reason: 'Implant preparation', time: '09:20', duration: '4 min' }
      ],
      lastTurnover: '09:24',
      nextCase: '09:45'
    },
    {
      theatre: 'DSU Theatre 3',
      unit: 'acad',
      currentTurnover: 18,
      avgTurnover: 17,
      target: 20,
      turnoversToday: 4,
      onTarget: 4,
      delayed: 0,
      trend: 'improving',
      delayReasons: [],
      lastTurnover: '13:45',
      nextCase: '14:05'
    }
  ];

  const filteredTheatres = theatreData.filter(theatre => {
    if (selectedUnit === 'all') return true;
    return theatre.unit === selectedUnit;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'worsening':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getPerformanceColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage <= 75) return 'bg-green-100 border-green-300 text-green-700';
    if (percentage <= 100) return 'bg-yellow-100 border-yellow-300 text-yellow-700';
    return 'bg-red-100 border-red-300 text-red-700';
  };

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-95 flex items-center justify-center lg:p-4 z-50">
      <div className="bg-white lg:rounded-lg shadow-xl max-w-[95vw] w-full h-full lg:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold">Average Turnover Time Analysis</h2>
            <p className="text-purple-100 text-xs mt-1">
              Real-time theatre turnover performance - Today's Summary
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area - Flex Row */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Stats (Fixed, Compact) */}
          <div className="w-48 bg-gray-50 border-r border-gray-200 p-3 flex-shrink-0 overflow-y-auto">
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <p className="text-[10px] text-gray-600 mb-1">Average Turnover</p>
                <p className="text-lg font-bold text-purple-600">{todaysSummary.averageTurnover} min</p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <p className="text-[10px] text-gray-600 mb-1">Target Time</p>
                <p className="text-lg font-bold text-gray-700">{todaysSummary.target} min</p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <p className="text-[10px] text-gray-600 mb-1">Total Turnovers</p>
                <p className="text-lg font-bold text-blue-600">{todaysSummary.totalTurnovers}</p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <p className="text-[10px] text-gray-600 mb-1">On Target</p>
                <p className="text-lg font-bold text-green-600">{todaysSummary.onTarget}</p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <p className="text-[10px] text-gray-600 mb-1">Delayed</p>
                <p className="text-lg font-bold text-red-600">{todaysSummary.delayed}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                <p className="text-[10px] text-green-700 font-semibold mb-1">Best Performance</p>
                <p className="text-xs font-bold text-green-900">{todaysSummary.bestTheatre}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-2 border border-red-200">
                <p className="text-[10px] text-red-700 font-semibold mb-1">Needs Attention</p>
                <p className="text-xs font-bold text-red-900">{todaysSummary.worstTheatre}</p>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filters - Compact, at top */}
            <div className="p-2 bg-white border-b border-gray-200 flex-shrink-0">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 flex-wrap">
                  <Filter className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">Filter by Unit:</span>
                  {(['all', 'main', 'acad', 'recovery'] as const).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setSelectedUnit(unit)}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                        selectedUnit === unit
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {unit === 'all' ? 'All Units' : unit.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="flex items-center space-x-2 flex-wrap">
                  <BarChart3 className="w-3 h-3 text-gray-500" />
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Period Analytics
                  </button>
                </div>
              </div>
            </div>

            {/* Theatre List - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="space-y-3">
                {filteredTheatres.map((theatre) => (
                  <div
                    key={theatre.theatre}
                    className={`rounded-lg p-4 border-2 ${getPerformanceColor(theatre.currentTurnover, theatre.target)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-bold text-gray-900">{theatre.theatre}</h3>
                          {getTrendIcon(theatre.trend)}
                          <span className="text-xs font-medium capitalize">({theatre.trend})</span>
                        </div>
                        <div className="grid grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-gray-600">Current Turnover</p>
                            <p className="font-bold">{theatre.currentTurnover} min</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Today's Average</p>
                            <p className="font-bold">{theatre.avgTurnover} min</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Turnovers Today</p>
                            <p className="font-bold">{theatre.turnoversToday}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">On Target / Delayed</p>
                            <p className="font-bold">
                              <span className="text-green-600">{theatre.onTarget}</span>
                              {' / '}
                              <span className="text-red-600">{theatre.delayed}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs text-gray-600">Last Turnover</p>
                        <p className="text-sm font-bold">{theatre.lastTurnover}</p>
                        <p className="text-xs text-blue-600 mt-1">Next: {theatre.nextCase}</p>
                      </div>
                    </div>

                    {/* Delay Reasons */}
                    {theatre.delayReasons.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Delays Today
                        </p>
                        <div className="space-y-1">
                          {theatre.delayReasons.map((delay, idx) => (
                            <div key={idx} className="bg-white bg-opacity-50 rounded p-2 text-xs">
                              <span className="font-medium">{delay.time}</span>
                              {' - '}
                              <span>{delay.reason}</span>
                              {' '}
                              <span className="text-red-600 font-semibold">(+{delay.duration})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Success indicator */}
                    {theatre.delayed === 0 && theatre.turnoversToday > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="text-xs font-medium text-green-700 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          All turnovers on target today
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
