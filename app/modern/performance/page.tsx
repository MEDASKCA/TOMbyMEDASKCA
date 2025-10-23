'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  Filter
} from 'lucide-react';

export default function PerformancePage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'main' | 'acad'>('all');

  const theatreData = [
    {
      theatre: 'Main Theatre 4',
      unit: 'main',
      efficiency: 94,
      target: 85,
      trend: 'improving',
      casesCompleted: 6,
      casesScheduled: 7,
      utilizationRate: 98,
      delayMinutes: 2,
      factors: [
        { factor: 'On-time starts', score: 100, status: 'excellent' },
        { factor: 'Turnover time', score: 95, status: 'excellent' },
        { factor: 'Case completion', score: 92, status: 'excellent' },
        { factor: 'Equipment ready', score: 98, status: 'excellent' }
      ]
    },
    {
      theatre: 'Main Theatre 1',
      unit: 'main',
      efficiency: 89,
      target: 85,
      trend: 'improving',
      casesCompleted: 4,
      casesScheduled: 5,
      utilizationRate: 92,
      delayMinutes: 12,
      factors: [
        { factor: 'On-time starts', score: 95, status: 'excellent' },
        { factor: 'Turnover time', score: 88, status: 'good' },
        { factor: 'Case completion', score: 85, status: 'good' },
        { factor: 'Equipment ready', score: 92, status: 'excellent' }
      ]
    },
    {
      theatre: 'Main Theatre 2',
      unit: 'main',
      efficiency: 82,
      target: 85,
      trend: 'stable',
      casesCompleted: 3,
      casesScheduled: 4,
      utilizationRate: 88,
      delayMinutes: 22,
      factors: [
        { factor: 'On-time starts', score: 75, status: 'needs-attention' },
        { factor: 'Turnover time', score: 82, status: 'good' },
        { factor: 'Case completion', score: 85, status: 'good' },
        { factor: 'Equipment ready', score: 88, status: 'good' }
      ]
    },
    {
      theatre: 'Main Theatre 7',
      unit: 'main',
      efficiency: 68,
      target: 85,
      trend: 'worsening',
      casesCompleted: 2,
      casesScheduled: 3,
      utilizationRate: 72,
      delayMinutes: 45,
      factors: [
        { factor: 'On-time starts', score: 60, status: 'critical' },
        { factor: 'Turnover time', score: 65, status: 'needs-attention' },
        { factor: 'Case completion', score: 70, status: 'needs-attention' },
        { factor: 'Equipment ready', score: 78, status: 'needs-attention' }
      ]
    },
    {
      theatre: 'DSU Theatre 1',
      unit: 'acad',
      efficiency: 85,
      target: 85,
      trend: 'stable',
      casesCompleted: 3,
      casesScheduled: 4,
      utilizationRate: 88,
      delayMinutes: 10,
      factors: [
        { factor: 'On-time starts', score: 85, status: 'good' },
        { factor: 'Turnover time', score: 85, status: 'good' },
        { factor: 'Case completion', score: 85, status: 'good' },
        { factor: 'Equipment ready', score: 88, status: 'good' }
      ]
    }
  ];

  const filteredTheatres = theatreData.filter(theatre => {
    if (selectedFilter === 'all') return true;
    return theatre.unit === selectedFilter;
  });

  const overallStats = {
    overallEfficiency: 87,
    target: 85,
    aboveTarget: theatreData.filter(t => t.efficiency >= t.target).length,
    belowTarget: theatreData.filter(t => t.efficiency < t.target).length
  };

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
    if (efficiency >= target + 5) return 'from-green-500 to-emerald-600';
    if (efficiency >= target) return 'from-blue-500 to-blue-600';
    if (efficiency >= target - 10) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-red-600';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-red-700 text-white sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Performance</h1>
              <p className="text-xs text-orange-100 mt-0.5">
                Efficiency & turnover metrics
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="px-4 pb-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-xs text-orange-100">Overall</p>
                <p className="text-lg font-bold">{overallStats.overallEfficiency}%</p>
              </div>
              <div>
                <p className="text-xs text-orange-100">Target</p>
                <p className="text-lg font-bold">{overallStats.target}%</p>
              </div>
              <div>
                <p className="text-xs text-orange-100">Above</p>
                <p className="text-lg font-bold text-green-300">{overallStats.aboveTarget}</p>
              </div>
              <div>
                <p className="text-xs text-orange-100">Below</p>
                <p className="text-lg font-bold text-red-300">{overallStats.belowTarget}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-white/80'
              }`}
            >
              All Units
            </button>
            <button
              onClick={() => setSelectedFilter('main')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'main'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-white/80'
              }`}
            >
              MAIN
            </button>
            <button
              onClick={() => setSelectedFilter('acad')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'acad'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-white/80'
              }`}
            >
              ACAD
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24 space-y-4">
        {filteredTheatres.map((theatre) => (
          <motion.div
            key={theatre.theatre}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Theatre Header with Gradient */}
            <div className={`bg-gradient-to-r ${getEfficiencyColor(theatre.efficiency, theatre.target)} text-white p-4`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{theatre.theatre}</h3>
                    {getTrendIcon(theatre.trend)}
                  </div>
                  <p className="text-xs opacity-90 capitalize">{theatre.trend} trend</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{theatre.efficiency}%</div>
                  <div className="text-xs opacity-90">vs {theatre.target}% target</div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="p-4 border-b border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-blue-700 font-semibold">Cases</p>
                  </div>
                  <p className="text-lg font-bold text-blue-900">
                    {theatre.casesCompleted}/{theatre.casesScheduled}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-green-600" />
                    <p className="text-xs text-green-700 font-semibold">Utilization</p>
                  </div>
                  <p className="text-lg font-bold text-green-900">{theatre.utilizationRate}%</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <p className="text-xs text-purple-700 font-semibold">Total Delay</p>
                  </div>
                  <p className={`text-lg font-bold ${
                    theatre.delayMinutes > 20 ? 'text-red-600' : 'text-purple-900'
                  }`}>
                    {theatre.delayMinutes} min
                  </p>
                </div>

                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <p className="text-xs text-orange-700 font-semibold">Status</p>
                  </div>
                  <p className={`text-sm font-bold ${
                    theatre.efficiency >= theatre.target ? 'text-green-600' : 'text-orange-900'
                  }`}>
                    {theatre.efficiency >= theatre.target ? 'On Target' : 'Below Target'}
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Factors */}
            <div className="p-4">
              <h4 className="text-xs font-bold text-gray-700 mb-3">Performance Factors</h4>
              <div className="space-y-2">
                {theatre.factors.map((factor, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${getFactorColor(factor.status)}`}
                  >
                    <span className="font-semibold">{factor.factor}</span>
                    <span className="font-bold">{factor.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            {theatre.efficiency < theatre.target - 10 && (
              <div className="p-4 bg-red-50 border-t border-red-100">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-red-800">
                    Critical: Efficiency {theatre.target - theatre.efficiency}% below target. Immediate action required.
                  </p>
                </div>
              </div>
            )}

            {theatre.efficiency >= theatre.target + 5 && (
              <div className="p-4 bg-green-50 border-t border-green-100">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-green-800">
                    Excellent performance - {theatre.efficiency - theatre.target}% above target
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
