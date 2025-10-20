'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ProcedureCard as ProcedureCardType } from '@/types';
import ProcedureCard from './ProcedureCard';
import {
  Search,
  Filter,
  Clipboard,
  AlertTriangle,
  Clock,
  Shield,
  RefreshCw,
  Plus,
  Download,
} from 'lucide-react';

export default function ProcedureList() {
  const [procedures, setProcedures] = useState<ProcedureCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');
  const [selectedAnesthesia, setSelectedAnesthesia] = useState<string>('all');

  // Real-time procedures updates
  useEffect(() => {
    const proceduresRef = collection(db, 'procedures');
    const unsubscribe = onSnapshot(proceduresRef, (snapshot) => {
      const proceduresData: ProcedureCardType[] = [];
      snapshot.forEach((doc) => {
        proceduresData.push({ id: doc.id, ...doc.data() } as ProcedureCardType);
      });
      proceduresData.sort((a, b) => a.name.localeCompare(b.name));
      setProcedures(proceduresData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Get unique values for filters
  const specialties = useMemo(() => {
    const uniqueSpecialties = new Set(procedures.map((p) => p.specialty));
    return Array.from(uniqueSpecialties).sort();
  }, [procedures]);

  // Filter and search procedures
  const filteredProcedures = useMemo(() => {
    return procedures.filter((proc) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        proc.name.toLowerCase().includes(searchLower) ||
        proc.specialty.toLowerCase().includes(searchLower) ||
        proc.requiredStaff.some((s) => s.role.toLowerCase().includes(searchLower)) ||
        proc.requiredEquipment.some((e) => e.itemName.toLowerCase().includes(searchLower)) ||
        proc.requiredConsumables.some((c) => c.itemName.toLowerCase().includes(searchLower)) ||
        (proc.specialRequirements || []).some((r) => r.toLowerCase().includes(searchLower));

      // Specialty filter
      const matchesSpecialty = selectedSpecialty === 'all' || proc.specialty === selectedSpecialty;

      // Risk level filter
      const matchesRisk = selectedRiskLevel === 'all' || proc.riskLevel === selectedRiskLevel;

      // Anesthesia filter
      const matchesAnesthesia = selectedAnesthesia === 'all' || proc.anesthesiaType === selectedAnesthesia;

      return matchesSearch && matchesSpecialty && matchesRisk && matchesAnesthesia;
    });
  }, [procedures, searchQuery, selectedSpecialty, selectedRiskLevel, selectedAnesthesia]);

  // Calculate stats
  const stats = useMemo(() => {
    const highRisk = procedures.filter((p) => p.riskLevel === 'high').length;
    const mediumRisk = procedures.filter((p) => p.riskLevel === 'medium').length;
    const lowRisk = procedures.filter((p) => p.riskLevel === 'low').length;
    const avgDuration =
      procedures.length > 0
        ? Math.round(procedures.reduce((sum, p) => sum + p.expectedDuration, 0) / procedures.length)
        : 0;

    return {
      total: procedures.length,
      highRisk,
      mediumRisk,
      lowRisk,
      avgDuration,
    };
  }, [procedures]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading procedures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Procedure Cards</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive procedure requirements and resource planning
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              title="Export procedures (Coming soon)"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
              title="Add procedure card (Coming soon)"
            >
              <Plus className="w-4 h-4" />
              <span>Add Procedure</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Procedures</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
              </div>
              <Clipboard className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 dark:text-red-400">High Risk</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-300 mt-1">{stats.highRisk}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 dark:text-amber-400">Medium Risk</p>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-300 mt-1">{stats.mediumRisk}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-400">Low Risk</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-300 mt-1">{stats.lowRisk}</p>
              </div>
              <Shield className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-400">Avg Duration</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-300 mt-1">
                  {formatDuration(stats.avgDuration)}
                </p>
              </div>
              <Clock className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-12 gap-3">
          {/* Search */}
          <div className="col-span-5 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search procedures by name, specialty, staff, equipment, or requirements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Specialty Filter */}
          <div className="col-span-3">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div className="col-span-2">
            <select
              value={selectedRiskLevel}
              onChange={(e) => setSelectedRiskLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>

          {/* Anesthesia Filter */}
          <div className="col-span-2">
            <select
              value={selectedAnesthesia}
              onChange={(e) => setSelectedAnesthesia(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Anesthesia</option>
              <option value="general">General</option>
              <option value="regional">Regional</option>
              <option value="local">Local</option>
              <option value="sedation">Sedation</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            Showing {filteredProcedures.length} of {procedures.length} procedures
          </span>
          {(searchQuery || selectedSpecialty !== 'all' || selectedRiskLevel !== 'all' || selectedAnesthesia !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('all');
                setSelectedRiskLevel('all');
                setSelectedAnesthesia('all');
              }}
              className="text-teal-600 dark:text-teal-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Procedures Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredProcedures.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Filter className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Procedures Found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters to find procedure cards.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProcedures.map((proc) => (
              <ProcedureCard key={proc.id} procedure={proc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
