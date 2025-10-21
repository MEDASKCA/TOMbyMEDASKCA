'use client';

import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Filter,
  BarChart3,
  Target,
  Clock,
  Users,
  Activity
} from 'lucide-react';

interface EfficiencyScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterUnit = 'all' | 'main' | 'acad' | 'recovery';

export default function EfficiencyScoreModal({ isOpen, onClose }: EfficiencyScoreModalProps) {
  const [selectedUnit, setSelectedUnit] = useState<FilterUnit>('all');

  if (!isOpen) return null;

  const todaysSummary = {
    overallEfficiency: 87,
    target: 85,
    bestTheatre: 'Main Theatre 4',
    worstTheatre: 'Main Theatre 7',
    aboveTarget: 7,
    belowTarget: 3
  };

  const theatreData = [
    {
      theatre: 'Main Theatre 1',
      unit: 'main',
      efficiency: 89,
      target: 85,
      trend: 'improving',
      casesScheduled: 5,
      casesCompleted: 4,
      casesInProgress: 1,
      utilizationRate: 92,
      avgCaseTime: 78, // minutes
      scheduledTime: 85, // minutes
      delayMinutes: 12,
      factors: [
        { factor: 'On-time starts', score: 95, status: 'excellent' },
        { factor: 'Turnover time', score: 88, status: 'good' },
        { factor: 'Case completion rate', score: 85, status: 'good' },
        { factor: 'Equipment ready', score: 92, status: 'excellent' }
      ]
    },
    {
      theatre: 'Main Theatre 2',
      unit: 'main',
      efficiency: 82,
      target: 85,
      trend: 'stable',
      casesScheduled: 4,
      casesCompleted: 3,
      casesInProgress: 1,
      utilizationRate: 88,
      avgCaseTime: 92,
      scheduledTime: 90,
      delayMinutes: 22,
      factors: [
        { factor: 'On-time starts', score: 75, status: 'needs-attention' },
        { factor: 'Turnover time', score: 82, status: 'good' },
        { factor: 'Case completion rate', score: 85, status: 'good' },
        { factor: 'Equipment ready', score: 88, status: 'good' }
      ]
    },
    {
      theatre: 'Main Theatre 3',
      unit: 'main',
      efficiency: 91,
      target: 85,
      trend: 'improving',
      casesScheduled: 6,
      casesCompleted: 5,
      casesInProgress: 1,
      utilizationRate: 95,
      avgCaseTime: 68,
      scheduledTime: 70,
      delayMinutes: 5,
      factors: [
        { factor: 'On-time starts', score: 100, status: 'excellent' },
        { factor: 'Turnover time', score: 92, status: 'excellent' },
        { factor: 'Case completion rate', score: 88, status: 'good' },
        { factor: 'Equipment ready', score: 95, status: 'excellent' }
      ]
    },
    {
      theatre: 'Main Theatre 4',
      unit: 'main',
      efficiency: 94,
      target: 85,
      trend: 'improving',
      casesScheduled: 7,
      casesCompleted: 6,
      casesInProgress: 1,
      utilizationRate: 98,
      avgCaseTime: 62,
      scheduledTime: 65,
      delayMinutes: 2,
      factors: [
        { factor: 'On-time starts', score: 100, status: 'excellent' },
        { factor: 'Turnover time', score: 95, status: 'excellent' },
        { factor: 'Case completion rate', score: 92, status: 'excellent' },
        { factor: 'Equipment ready', score: 98, status: 'excellent' }
      ]
    },
    {
      theatre: 'Main Theatre 5',
      unit: 'main',
      efficiency: 86,
      target: 85,
      trend: 'stable',
      casesScheduled: 5,
      casesCompleted: 4,
      casesInProgress: 1,
      utilizationRate: 90,
      avgCaseTime: 75,
      scheduledTime: 80,
      delayMinutes: 15,
      factors: [
        { factor: 'On-time starts', score: 85, status: 'good' },
        { factor: 'Turnover time', score: 88, status: 'good' },
        { factor: 'Case completion rate', score: 85, status: 'good' },
        { factor: 'Equipment ready', score: 90, status: 'excellent' }
      ]
    },
    {
      theatre: 'Main Theatre 7',
      unit: 'main',
      efficiency: 68,
      target: 85,
      trend: 'worsening',
      casesScheduled: 3,
      casesCompleted: 2,
      casesInProgress: 1,
      utilizationRate: 72,
      avgCaseTime: 105,
      scheduledTime: 90,
      delayMinutes: 45,
      factors: [
        { factor: 'On-time starts', score: 60, status: 'critical' },
        { factor: 'Turnover time', score: 65, status: 'needs-attention' },
        { factor: 'Case completion rate', score: 70, status: 'needs-attention' },
        { factor: 'Equipment ready', score: 78, status: 'needs-attention' }
      ]
    },
    {
      theatre: 'Main Theatre 8',
      unit: 'main',
      efficiency: 88,
      target: 85,
      trend: 'stable',
      casesScheduled: 6,
      casesCompleted: 5,
      casesInProgress: 1,
      utilizationRate: 93,
      avgCaseTime: 70,
      scheduledTime: 75,
      delayMinutes: 8,
      factors: [
        { factor: 'On-time starts', score: 90, status: 'excellent' },
        { factor: 'Turnover time', score: 88, status: 'good' },
        { factor: 'Case completion rate', score: 88, status: 'good' },
        { factor: 'Equipment ready', score: 92, status: 'excellent' }
      ]
    },
    {
      theatre: 'DSU Theatre 1',
      unit: 'acad',
      efficiency: 85,
      target: 85,
      trend: 'stable',
      casesScheduled: 4,
      casesCompleted: 3,
      casesInProgress: 1,
      utilizationRate: 88,
      avgCaseTime: 80,
      scheduledTime: 85,
      delayMinutes: 10,
      factors: [
        { factor: 'On-time starts', score: 85, status: 'good' },
        { factor: 'Turnover time', score: 85, status: 'good' },
        { factor: 'Case completion rate', score: 85, status: 'good' },
        { factor: 'Equipment ready', score: 88, status: 'good' }
      ]
    },
    {
      theatre: 'DSU Theatre 2',
      unit: 'acad',
      efficiency: 83,
      target: 85,
      trend: 'stable',
      casesScheduled: 4,
      casesCompleted: 3,
      casesInProgress: 1,
      utilizationRate: 86,
      avgCaseTime: 85,
      scheduledTime: 88,
      delayMinutes: 18,
      factors: [
        { factor: 'On-time starts', score: 80, status: 'good' },
        { factor: 'Turnover time', score: 82, status: 'good' },
        { factor: 'Case completion rate', score: 85, status: 'good' },
        { factor: 'Equipment ready', score: 86, status: 'good' }
      ]
    },
    {
      theatre: 'DSU Theatre 3',
      unit: 'acad',
      efficiency: 90,
      target: 85,
      trend: 'improving',
      casesScheduled: 5,
      casesCompleted: 4,
      casesInProgress: 1,
      utilizationRate: 94,
      avgCaseTime: 72,
      scheduledTime: 75,
      delayMinutes: 6,
      factors: [
        { factor: 'On-time starts', score: 92, status: 'excellent' },
        { factor: 'Turnover time', score: 90, status: 'excellent' },
        { factor: 'Case completion rate', score: 88, status: 'good' },
        { factor: 'Equipment ready', score: 92, status: 'excellent' }
      ]
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

  const getEfficiencyColor = (efficiency: number, target: number) => {
    if (efficiency >= target + 5) return 'bg-green-100 border-green-300 text-green-700';
    if (efficiency >= target) return 'bg-blue-100 border-blue-300 text-blue-700';
    if (efficiency >= target - 10) return 'bg-yellow-100 border-yellow-300 text-yellow-700';
    return 'bg-red-100 border-red-300 text-red-700';
  };

  const getFactorColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'good':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'needs-attention':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-95 flex items-center justify-center lg:p-4 z-50">
      <div className="bg-white lg:rounded-lg shadow-xl max-w-[95vw] w-full h-full lg:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-3 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold">Theatre Efficiency Score Analysis</h2>
            <p className="text-orange-100 text-xs mt-1">
              Real-time efficiency metrics and performance factors - Today's Summary
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-800 rounded-lg transition-colors"
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
                <p className="text-[10px] text-gray-600 mb-1">Overall Efficiency</p>
                <p className="text-lg font-bold text-orange-600">{todaysSummary.overallEfficiency}%</p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <p className="text-[10px] text-gray-600 mb-1">Target Score</p>
                <p className="text-lg font-bold text-gray-700">{todaysSummary.target}%</p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <p className="text-[10px] text-gray-600 mb-1">Above Target</p>
                <p className="text-lg font-bold text-green-600">{todaysSummary.aboveTarget}</p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <p className="text-[10px] text-gray-600 mb-1">Below Target</p>
                <p className="text-lg font-bold text-red-600">{todaysSummary.belowTarget}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                <p className="text-[10px] text-green-700 font-semibold mb-1">Top Performer</p>
                <p className="text-xs font-bold text-green-900">{todaysSummary.bestTheatre}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-2 border border-red-200">
                <p className="text-[10px] text-red-700 font-semibold mb-1">Needs Support</p>
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
                          ? 'bg-orange-600 text-white'
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
                    className={`rounded-lg p-4 border-2 ${getEfficiencyColor(theatre.efficiency, theatre.target)}`}
                  >
                    {/* Theatre Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-bold text-gray-900">{theatre.theatre}</h3>
                          {getTrendIcon(theatre.trend)}
                          <span className="text-xs font-medium capitalize">({theatre.trend})</span>
                          <span className="text-2xl font-bold ml-auto">{theatre.efficiency}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-5 gap-3 mb-3 text-sm">
                      <div className="bg-white bg-opacity-50 rounded p-2">
                        <p className="text-xs text-gray-600 flex items-center">
                          <Target className="w-3 h-3 mr-1" />
                          Cases
                        </p>
                        <p className="font-bold">
                          {theatre.casesCompleted}/{theatre.casesScheduled}
                        </p>
                      </div>
                      <div className="bg-white bg-opacity-50 rounded p-2">
                        <p className="text-xs text-gray-600 flex items-center">
                          <Activity className="w-3 h-3 mr-1" />
                          Utilization
                        </p>
                        <p className="font-bold">{theatre.utilizationRate}%</p>
                      </div>
                      <div className="bg-white bg-opacity-50 rounded p-2">
                        <p className="text-xs text-gray-600 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Avg Time
                        </p>
                        <p className="font-bold">{theatre.avgCaseTime} min</p>
                      </div>
                      <div className="bg-white bg-opacity-50 rounded p-2">
                        <p className="text-xs text-gray-600">Scheduled</p>
                        <p className="font-bold">{theatre.scheduledTime} min</p>
                      </div>
                      <div className="bg-white bg-opacity-50 rounded p-2">
                        <p className="text-xs text-gray-600">Total Delay</p>
                        <p className={`font-bold ${theatre.delayMinutes > 20 ? 'text-red-600' : 'text-gray-700'}`}>
                          {theatre.delayMinutes} min
                        </p>
                      </div>
                    </div>

                    {/* Performance Factors */}
                    <div className="border-t border-gray-300 pt-3">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Performance Factors</p>
                      <div className="grid grid-cols-2 gap-2">
                        {theatre.factors.map((factor, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between px-3 py-2 rounded border text-xs ${getFactorColor(factor.status)}`}
                          >
                            <span className="font-medium">{factor.factor}</span>
                            <span className="font-bold">{factor.score}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Alerts */}
                    {theatre.efficiency < theatre.target - 10 && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <div className="bg-red-50 rounded p-2 text-xs text-red-800 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          <span className="font-semibold">
                            Critical: Efficiency {theatre.target - theatre.efficiency}% below target. Immediate action required.
                          </span>
                        </div>
                      </div>
                    )}

                    {theatre.efficiency >= theatre.target + 5 && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="text-xs font-medium text-green-700 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Excellent performance - {theatre.efficiency - theatre.target}% above target
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
