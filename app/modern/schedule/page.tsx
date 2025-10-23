'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Calendar
} from 'lucide-react';

export default function SchedulePage() {
  const router = useRouter();
  const [selectedTheatre, setSelectedTheatre] = useState('Main Theatre 1');

  const theatres = [
    'Main Theatre 1',
    'Main Theatre 2',
    'Main Theatre 3',
    'Main Theatre 4',
    'Main Theatre 5',
    'DSU Theatre 1',
    'DSU Theatre 2',
    'DSU Theatre 3'
  ];

  // Mock timeline data
  const procedures = [
    {
      id: '1',
      time: '08:00',
      procedure: 'Total Hip Replacement',
      patient: 'MRN: 123456',
      surgeon: 'Smith',
      timeline: [
        { time: '07:30', event: 'Patient sent for', status: 'completed' },
        { time: '07:45', event: 'Patient arrived', status: 'completed' },
        { time: '07:55', event: 'Pre-op checks complete', status: 'completed' },
        { time: '08:00', event: 'Into theatre', status: 'in-progress' },
        { time: '08:10', event: 'Anaesthetic start', status: 'in-progress' },
        { time: '08:25', event: 'Surgery start', status: 'pending' },
        { time: '11:25', event: 'Surgery end', status: 'pending' },
        { time: '11:40', event: 'To recovery', status: 'pending' }
      ]
    },
    {
      id: '2',
      time: '12:30',
      procedure: 'Knee Arthroscopy',
      patient: 'MRN: 789012',
      surgeon: 'Johnson',
      timeline: [
        { time: '12:00', event: 'Patient sent for', status: 'pending' },
        { time: '12:15', event: 'Patient arrived', status: 'pending' },
        { time: '12:25', event: 'Pre-op checks complete', status: 'pending' },
        { time: '12:30', event: 'Into theatre', status: 'pending' },
        { time: '12:40', event: 'Anaesthetic start', status: 'pending' },
        { time: '12:55', event: 'Surgery start', status: 'pending' },
        { time: '13:55', event: 'Surgery end', status: 'pending' },
        { time: '14:10', event: 'To recovery', status: 'pending' }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600 animate-pulse" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Theatre Schedule</h1>
              <p className="text-xs text-green-100 mt-0.5">
                View all theatre operations & timelines
              </p>
            </div>
          </div>
        </div>

        {/* Theatre Selector */}
        <div className="px-4 pb-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1">
            <select
              value={selectedTheatre}
              onChange={(e) => setSelectedTheatre(e.target.value)}
              className="w-full bg-white text-gray-900 py-2 px-4 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {theatres.map((theatre) => (
                <option key={theatre} value={theatre}>
                  {theatre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-green-600" />
            <h2 className="text-sm font-bold text-gray-900">Today's Summary</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <p className="text-xs text-blue-700">Total Cases</p>
              <p className="text-lg font-bold text-blue-900">{procedures.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <p className="text-xs text-green-700">Completed</p>
              <p className="text-lg font-bold text-green-900">0</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-2 text-center">
              <p className="text-xs text-orange-700">Est. Finish</p>
              <p className="text-lg font-bold text-orange-900">18:30</p>
            </div>
          </div>
        </div>

        {/* Procedures Timeline */}
        <div className="space-y-4">
          {procedures.map((proc, idx) => (
            <div key={proc.id} className="bg-white rounded-2xl p-4 shadow-sm">
              {/* Procedure Header */}
              <div className="mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-gray-900">{proc.time}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                        Case {idx + 1}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900">{proc.procedure}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {proc.patient} • Surgeon: {proc.surgeon}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                {proc.timeline.map((event, eventIdx) => (
                  <div key={eventIdx} className="flex items-start gap-3">
                    {/* Time & Icon */}
                    <div className="flex flex-col items-center flex-shrink-0 w-16">
                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        {event.time}
                      </div>
                      {getStatusIcon(event.status)}
                      {eventIdx < proc.timeline.length - 1 && (
                        <div className={`w-0.5 h-8 mt-1 ${
                          event.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="flex-1">
                      <div className={`px-3 py-2 rounded-lg border ${getStatusColor(event.status)}`}>
                        <span className="text-sm font-semibold">{event.event}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Turnover Time (if not last procedure) */}
              {idx < procedures.length - 1 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-semibold">Turnover Time</span>
                    <span className="text-orange-600 font-bold">30 min (Target: 25 min)</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total OR Time</p>
              <p className="font-bold text-gray-900">10h 30m</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Utilization</p>
              <p className="font-bold text-gray-900">87%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Avg Turnover</p>
              <p className="font-bold text-gray-900">28 min</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">On-time Starts</p>
              <p className="font-bold text-gray-900">92%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
