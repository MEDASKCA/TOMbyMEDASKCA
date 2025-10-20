'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import type { Theatre, ReadinessCheck } from '@/types';
import { checkTheatreReadiness } from '../services/readinessChecker';
import ReadinessCard from './ReadinessCard';

export default function ReadinessDashboard() {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [readinessChecks, setReadinessChecks] = useState<Map<string, ReadinessCheck>>(new Map());
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  // Load theatres
  useEffect(() => {
    loadTheatres();
  }, []);

  async function loadTheatres() {
    try {
      setLoading(true);
      const theatresSnapshot = await getDocs(collection(db, 'theatres'));
      const theatresData: Theatre[] = [];
      theatresSnapshot.forEach((doc) => {
        theatresData.push({ id: doc.id, ...doc.data() } as Theatre);
      });
      theatresData.sort((a, b) => a.number - b.number);
      setTheatres(theatresData);

      // Check readiness for all theatres
      await checkAllReadiness(theatresData);
    } catch (error) {
      console.error('Error loading theatres:', error);
    } finally {
      setLoading(false);
    }
  }

  async function checkAllReadiness(theatresToCheck: Theatre[]) {
    setChecking(true);
    const checks = new Map<string, ReadinessCheck>();

    for (const theatre of theatresToCheck) {
      try {
        const check = await checkTheatreReadiness(theatre.id);
        checks.set(theatre.id, check);
      } catch (error) {
        console.error(`Error checking readiness for ${theatre.name}:`, error);
      }
    }

    setReadinessChecks(checks);
    setChecking(false);
  }

  // Calculate overall stats
  const stats = {
    total: theatres.length,
    ready: Array.from(readinessChecks.values()).filter((c) => c.overall === 'ready').length,
    warning: Array.from(readinessChecks.values()).filter((c) => c.overall === 'warning').length,
    notReady: Array.from(readinessChecks.values()).filter((c) => c.overall === 'not-ready').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading readiness status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Theatre Readiness</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Real-time status of all operating theatres
            </p>
          </div>

          <button
            onClick={() => checkAllReadiness(theatres)}
            disabled={checking}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Checking...' : 'Refresh All'}</span>
          </button>
        </div>

        {/* Overall Stats */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Theatres</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏥</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-400">Ready</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-300 mt-1">{stats.ready}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 dark:text-amber-400">Warning</p>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-300 mt-1">{stats.warning}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 dark:text-red-400">Not Ready</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-300 mt-1">{stats.notReady}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Readiness Score */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Readiness Score</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Based on staffing, equipment, consumables, and environment
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 dark:text-teal-400">
                {stats.total > 0 ? Math.round((stats.ready / stats.total) * 100) : 0}%
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {stats.ready} of {stats.total} ready
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Theatre Cards */}
      <div className="flex-1 overflow-y-auto p-4">
        {theatres.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <XCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Theatres Found</h3>
            <p className="text-gray-500 dark:text-gray-400">Initialize demo data to see readiness status.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {theatres.map((theatre) => (
              <ReadinessCard
                key={theatre.id}
                theatre={theatre}
                readiness={readinessChecks.get(theatre.id)}
                onRefresh={() => checkAllReadiness([theatre])}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
