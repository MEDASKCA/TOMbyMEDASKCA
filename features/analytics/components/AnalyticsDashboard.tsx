'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Theatre, Case, Staff, InventoryItem, ProcedureCard as ProcedureCardType } from '@/types';
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  Clipboard,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Calendar,
  DollarSign,
  Target,
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [procedures, setProcedures] = useState<ProcedureCardType[]>([]);

  // Load all data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Load theatres
        const theatresSnapshot = await getDocs(collection(db, 'theatres'));
        const theatresData: Theatre[] = [];
        theatresSnapshot.forEach((doc) => {
          theatresData.push({ id: doc.id, ...doc.data() } as Theatre);
        });

        // Load cases
        const casesSnapshot = await getDocs(collection(db, 'cases'));
        const casesData: Case[] = [];
        casesSnapshot.forEach((doc) => {
          casesData.push({ id: doc.id, ...doc.data() } as Case);
        });

        // Load staff
        const staffSnapshot = await getDocs(collection(db, 'staff'));
        const staffData: Staff[] = [];
        staffSnapshot.forEach((doc) => {
          staffData.push({ id: doc.id, ...doc.data() } as Staff);
        });

        // Load inventory
        const inventorySnapshot = await getDocs(collection(db, 'inventory'));
        const inventoryData: InventoryItem[] = [];
        inventorySnapshot.forEach((doc) => {
          inventoryData.push({ id: doc.id, ...doc.data() } as InventoryItem);
        });

        // Load procedures
        const proceduresSnapshot = await getDocs(collection(db, 'procedures'));
        const proceduresData: ProcedureCardType[] = [];
        proceduresSnapshot.forEach((doc) => {
          proceduresData.push({ id: doc.id, ...doc.data() } as ProcedureCardType);
        });

        setTheatres(theatresData);
        setCases(casesData);
        setStaff(staffData);
        setInventory(inventoryData);
        setProcedures(proceduresData);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Calculate analytics
  const analytics = useMemo(() => {
    // Theatre utilization
    const totalTheatres = theatres.length;
    const inUseTheatres = theatres.filter((t) => t.status === 'in-use').length;
    const readyTheatres = theatres.filter((t) => t.status === 'ready').length;
    const utilizationRate = totalTheatres > 0 ? Math.round((inUseTheatres / totalTheatres) * 100) : 0;

    // Case statistics
    const totalCases = cases.length;
    const completedCases = cases.filter((c) => c.status === 'completed').length;
    const inProgressCases = cases.filter((c) => c.status === 'in-progress').length;
    const scheduledCases = cases.filter((c) => c.status === 'scheduled').length;
    const completionRate = totalCases > 0 ? Math.round((completedCases / totalCases) * 100) : 0;

    // Staff metrics
    const totalStaff = staff.length;
    const activeStaff = staff.filter((s) => s.isActive).length;
    const totalCompetencies = staff.reduce((sum, s) => sum + s.competencies.length, 0);
    const avgCompetenciesPerStaff = totalStaff > 0 ? (totalCompetencies / totalStaff).toFixed(1) : '0';

    // Competency breakdown
    const expertStaff = staff.filter((s) => s.competencies.some((c) => c.level === 'expert')).length;
    const competentStaff = staff.filter((s) => s.competencies.some((c) => c.level === 'competent')).length;

    // Inventory metrics
    const totalItems = inventory.length;
    const outOfStock = inventory.filter((i) => i.quantity === 0).length;
    const lowStock = inventory.filter((i) => {
      const stockPercentage = (i.quantity / i.minQuantity) * 100;
      return stockPercentage <= 50 && i.quantity > 0;
    }).length;
    const criticalItems = inventory.filter((i) => i.isCritical).length;
    const stockHealthRate = totalItems > 0 ? Math.round(((totalItems - outOfStock - lowStock) / totalItems) * 100) : 0;

    // Procedure metrics
    const totalProcedures = procedures.length;
    const highRiskProcedures = procedures.filter((p) => p.riskLevel === 'high').length;
    const avgProcedureDuration =
      totalProcedures > 0
        ? Math.round(procedures.reduce((sum, p) => sum + p.expectedDuration, 0) / totalProcedures)
        : 0;

    // Specialty breakdown - get specialty from procedures
    const procedureMap = new Map(procedures.map(p => [p.id, p]));
    const specialties = new Map<string, number>();
    cases.forEach((c) => {
      const procedure = procedureMap.get(c.procedureId);
      if (procedure) {
        const count = specialties.get(procedure.specialty) || 0;
        specialties.set(procedure.specialty, count + 1);
      }
    });

    const topSpecialties = Array.from(specialties.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      theatre: {
        total: totalTheatres,
        inUse: inUseTheatres,
        ready: readyTheatres,
        utilizationRate,
      },
      cases: {
        total: totalCases,
        completed: completedCases,
        inProgress: inProgressCases,
        scheduled: scheduledCases,
        completionRate,
      },
      staff: {
        total: totalStaff,
        active: activeStaff,
        totalCompetencies,
        avgCompetenciesPerStaff,
        expert: expertStaff,
        competent: competentStaff,
      },
      inventory: {
        total: totalItems,
        outOfStock,
        lowStock,
        critical: criticalItems,
        stockHealthRate,
      },
      procedures: {
        total: totalProcedures,
        highRisk: highRiskProcedures,
        avgDuration: avgProcedureDuration,
      },
      topSpecialties,
    };
  }, [theatres, cases, staff, inventory, procedures]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Insights</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive theatre operations metrics and performance indicators
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              <Calendar className="w-4 h-4" />
              <span>Custom Date Range</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors">
              <TrendingUp className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Performance Indicators */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Performance Indicators</h2>
          <div className="grid grid-cols-4 gap-4">
            {/* Theatre Utilization */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.theatre.utilizationRate}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Utilization</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {analytics.theatre.inUse} of {analytics.theatre.total} in use
                </span>
                <span className="text-green-600 dark:text-green-400 font-medium">+12%</span>
              </div>
            </div>

            {/* Case Completion */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.cases.completionRate}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completion</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {analytics.cases.completed} of {analytics.cases.total} cases
                </span>
                <span className="text-green-600 dark:text-green-400 font-medium">+8%</span>
              </div>
            </div>

            {/* Stock Health */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                  <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.inventory.stockHealthRate}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Stock Health</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {analytics.inventory.outOfStock + analytics.inventory.lowStock} alerts
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">-5%</span>
              </div>
            </div>

            {/* Staff Competency */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.staff.avgCompetenciesPerStaff}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Competencies</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{analytics.staff.expert} expert staff</span>
                <span className="text-green-600 dark:text-green-400 font-medium">+18%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Theatre Operations */}
        <div className="grid grid-cols-2 gap-6">
          {/* Theatre Status Breakdown */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span>Theatre Status Breakdown</span>
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">In Use</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {analytics.theatre.inUse} ({Math.round((analytics.theatre.inUse / analytics.theatre.total) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(analytics.theatre.inUse / analytics.theatre.total) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Ready</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {analytics.theatre.ready} ({Math.round((analytics.theatre.ready / analytics.theatre.total) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${(analytics.theatre.ready / analytics.theatre.total) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Other</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {analytics.theatre.total - analytics.theatre.inUse - analytics.theatre.ready} (
                    {Math.round(
                      ((analytics.theatre.total - analytics.theatre.inUse - analytics.theatre.ready) /
                        analytics.theatre.total) *
                        100
                    )}
                    %)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        ((analytics.theatre.total - analytics.theatre.inUse - analytics.theatre.ready) /
                          analytics.theatre.total) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Case Status Breakdown */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Clipboard className="w-5 h-5 text-green-500" />
              <span>Case Status Distribution</span>
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Completed</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {analytics.cases.completed} ({analytics.cases.completionRate}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${analytics.cases.completionRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">In Progress</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {analytics.cases.inProgress} (
                    {Math.round((analytics.cases.inProgress / analytics.cases.total) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(analytics.cases.inProgress / analytics.cases.total) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Scheduled</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {analytics.cases.scheduled} ({Math.round((analytics.cases.scheduled / analytics.cases.total) * 100)}
                    %)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all"
                    style={{ width: `${(analytics.cases.scheduled / analytics.cases.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Specialties & Inventory Alerts */}
        <div className="grid grid-cols-2 gap-6">
          {/* Top Specialties */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Specialties by Case Volume</h3>
            <div className="space-y-3">
              {analytics.topSpecialties.map(([specialty, count], idx) => (
                <div key={specialty} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center">
                      #{idx + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{specialty}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{count} cases</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Inventory Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-900 dark:text-red-300">Out of Stock</span>
                </div>
                <span className="text-lg font-bold text-red-900 dark:text-red-300">{analytics.inventory.outOfStock}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-amber-900 dark:text-amber-300">Low Stock</span>
                </div>
                <span className="text-lg font-bold text-amber-900 dark:text-amber-300">{analytics.inventory.lowStock}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-900 dark:text-purple-300">Critical Items</span>
                </div>
                <span className="text-lg font-bold text-purple-900 dark:text-purple-300">{analytics.inventory.critical}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Metrics */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5 text-teal-500" />
            <span>Staff Competency Distribution</span>
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-300 mb-1">{analytics.staff.expert}</p>
              <p className="text-sm text-purple-700 dark:text-purple-400">Expert Level</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-3xl font-bold text-green-900 dark:text-green-300 mb-1">{analytics.staff.competent}</p>
              <p className="text-sm text-green-700 dark:text-green-400">Competent</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-300 mb-1">{analytics.staff.active}</p>
              <p className="text-sm text-blue-700 dark:text-blue-400">Active Staff</p>
            </div>
            <div className="text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
              <p className="text-3xl font-bold text-teal-900 dark:text-teal-300 mb-1">{analytics.staff.totalCompetencies}</p>
              <p className="text-sm text-teal-700 dark:text-teal-400">Total Competencies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
