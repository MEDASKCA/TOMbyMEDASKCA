'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import type { Theatre, Case } from '@/types';
import TheatreCard from './TheatreCard';

export default function TheatreSchedule() {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const today = new Date().toISOString().split('T')[0];

  // Load theatres
  useEffect(() => {
    const theatresRef = collection(db, 'theatres');
    const unsubscribe = onSnapshot(theatresRef, (snapshot) => {
      const theatresData: Theatre[] = [];
      snapshot.forEach((doc) => {
        theatresData.push({ id: doc.id, ...doc.data() } as Theatre);
      });
      // Sort by theatre number
      theatresData.sort((a, b) => a.number - b.number);
      setTheatres(theatresData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load today's cases
  useEffect(() => {
    const casesRef = collection(db, 'cases');
    const q = query(casesRef, where('date', '==', today));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const casesData: Case[] = [];
      snapshot.forEach((doc) => {
        casesData.push({ id: doc.id, ...doc.data() } as Case);
      });
      setCases(casesData);
    });

    return () => unsubscribe();
  }, [today]);

  // Get cases for a specific theatre
  const getTheatreCases = (theatreId: string) => {
    return cases
      .filter((c) => c.theatreId === theatreId)
      .sort((a, b) => a.scheduledStartTime.localeCompare(b.scheduledStartTime));
  };

  // Calculate readiness summary
  const readinessStats = theatres.reduce(
    (acc, theatre) => {
      if (theatre.status === 'ready') acc.ready++;
      else if (theatre.status === 'in-use') acc.inUse++;
      else if (theatre.status === 'maintenance' || theatre.status === 'cleaning') acc.notReady++;
      return acc;
    },
    { ready: 0, inUse: 0, notReady: 0 }
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading theatre schedule...</p>
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Theatre Schedule</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4">
            <div className="text-center px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">{readinessStats.ready}</div>
              <div className="text-xs text-green-600 dark:text-green-500">Ready</div>
            </div>
            <div className="text-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{readinessStats.inUse}</div>
              <div className="text-xs text-blue-600 dark:text-blue-500">In Use</div>
            </div>
            <div className="text-center px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{readinessStats.notReady}</div>
              <div className="text-xs text-amber-600 dark:text-amber-500">Not Ready</div>
            </div>
            <div className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{cases.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Cases Today</div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="mt-4 flex items-center space-x-2">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'daily'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Daily View
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'weekly'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            disabled
          >
            Weekly View (Coming Soon)
          </button>
        </div>
      </div>

      {/* Theatre List */}
      <div className="flex-1 overflow-y-auto p-4">
        {theatres.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Theatres Found</h3>
            <p className="text-gray-500 dark:text-gray-400">Initialize demo data to see theatre schedule.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {theatres.map((theatre) => (
              <TheatreCard
                key={theatre.id}
                theatre={theatre}
                cases={getTheatreCases(theatre.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
