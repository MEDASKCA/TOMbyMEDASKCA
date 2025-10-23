'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Coffee,
  Utensils,
  CheckCircle,
  Clock,
  Filter,
  Send,
  Bell
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  theatre: string;
  shiftStart: string;
  shiftEnd: string;
  hoursWorked: number;
  teaBreaks: Array<{
    time: string;
    duration: string;
    authorizedBy: string;
    authorizedByRole: string;
  }>;
  lunchBreak?: {
    time: string;
    duration: string;
    authorizedBy: string;
  };
  supperBreak?: {
    time: string;
    duration: string;
    authorizedBy: string;
  };
  lunchEntitled: boolean;
  supperEntitled: boolean;
  breakStatus: 'no_break' | 'overdue' | 'taken';
}

interface ReliefRequest {
  id: string;
  requestedBy: {
    name: string;
    role: string;
    theatre: string;
  };
  reason: string;
  duration: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  requestedAt: string;
  status: 'pending' | 'acknowledged';
}

export default function WellbeingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'requests' | 'breaks'>('requests');
  const [breakFilter, setBreakFilter] = useState<'all' | 'no_break' | 'overdue'>('all');

  // Mock data
  const reliefRequests: ReliefRequest[] = [
    {
      id: '1',
      requestedBy: {
        name: 'S. Patel',
        role: 'Anaes N/P',
        theatre: 'Main Theatre 3'
      },
      reason: 'Coffee/Rest Break',
      duration: '15 min',
      urgency: 'routine',
      requestedAt: '10:45',
      status: 'pending'
    },
    {
      id: '2',
      requestedBy: {
        name: 'RN M. Johnson',
        role: 'Scrub N/P',
        theatre: 'DSU Theatre 5'
      },
      reason: 'Toilet Break',
      duration: '15 min',
      urgency: 'urgent',
      requestedAt: '11:02',
      status: 'pending'
    }
  ];

  const staffMembers: StaffMember[] = [
    { id: '1', name: 'L. O\'Brien', role: 'Anaes N/P', theatre: 'Main Theatre 1', shiftStart: '10:00', shiftEnd: '18:00', hoursWorked: 2.5, teaBreaks: [], lunchEntitled: false, supperEntitled: false, breakStatus: 'no_break' },
    { id: '3', name: 'ODP D. Jordan', role: 'Scrub N/P', theatre: 'Main Theatre 1', shiftStart: '08:00', shiftEnd: '18:00', hoursWorked: 4.5, teaBreaks: [], lunchEntitled: true, supperEntitled: false, breakStatus: 'overdue' },
    { id: '7', name: 'RN L. Brown', role: 'Scrub N/P', theatre: 'Main Theatre 3', shiftStart: '08:00', shiftEnd: '18:00', hoursWorked: 4.5, teaBreaks: [{ time: '09:00', duration: '10 min', authorizedBy: 'R. Johnson', authorizedByRole: 'Team Lead' }], lunchEntitled: true, supperEntitled: false, breakStatus: 'overdue' },
    { id: '10', name: 'E. Cooper', role: 'Anaes N/P', theatre: 'Main Theatre 4', shiftStart: '08:00', shiftEnd: '18:00', hoursWorked: 4.5, teaBreaks: [], lunchEntitled: true, supperEntitled: false, breakStatus: 'overdue' }
  ];

  const filteredStaff = staffMembers.filter(staff => {
    if (breakFilter === 'all') return true;
    return staff.breakStatus === breakFilter;
  });

  const breakCounts = {
    no_break: staffMembers.filter(s => s.breakStatus === 'no_break').length,
    overdue: staffMembers.filter(s => s.breakStatus === 'overdue').length,
    taken: staffMembers.filter(s => s.breakStatus === 'taken').length
  };

  const handleSendForBreak = (staff: StaffMember, breakType: 'tea' | 'lunch' | 'supper') => {
    const breakLabel = breakType === 'tea' ? 'Tea Break' : breakType === 'lunch' ? 'Lunch Break' : 'Supper Break';
    alert(`Sending ${staff.name} for ${breakLabel}. Relief staff will be deployed.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Staff Wellbeing</h1>
              <p className="text-xs text-blue-100 mt-0.5">
                Manage breaks & relief requests
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'requests'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-white/80'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Bell className="w-4 h-4" />
                <span>Requests ({reliefRequests.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('breaks')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'breaks'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-white/80'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Coffee className="w-4 h-4" />
                <span>Breaks</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {activeTab === 'requests' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-gray-700">Active Relief Requests</h2>
              <div className="text-xs text-gray-500">Updated just now</div>
            </div>

            {reliefRequests.map((request) => (
              <motion.div
                key={request.id}
                whileTap={{ scale: 0.98 }}
                className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${
                  request.urgency === 'urgent' ? 'border-red-500' : 'border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{request.requestedBy.name}</h3>
                    <p className="text-xs text-gray-600">
                      {request.requestedBy.role} • {request.requestedBy.theatre}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                    request.urgency === 'urgent'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {request.urgency.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Coffee className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{request.reason}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{request.duration} • Requested {request.requestedAt}</span>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 active:bg-blue-700 transition-colors">
                  <Send className="w-4 h-4" />
                  Deploy Relief Staff
                </button>
              </motion.div>
            ))}

            {reliefRequests.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">No pending relief requests</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Filter Buttons */}
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold text-gray-700">Filter by Status</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setBreakFilter('all')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    breakFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  All ({staffMembers.length})
                </button>
                <button
                  onClick={() => setBreakFilter('no_break')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    breakFilter === 'no_break'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  No Break ({breakCounts.no_break})
                </button>
                <button
                  onClick={() => setBreakFilter('overdue')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    breakFilter === 'overdue'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Overdue ({breakCounts.overdue})
                </button>
              </div>
            </div>

            {/* Staff List */}
            <div className="space-y-3">
              {filteredStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-900">{staff.name}</h3>
                    <p className="text-xs text-gray-600">{staff.role} • {staff.theatre}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {staff.shiftStart} - {staff.shiftEnd} ({staff.hoursWorked}h worked)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* Tea Button */}
                    <button
                      onClick={() => handleSendForBreak(staff, 'tea')}
                      className={`w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                        staff.teaBreaks.length > 0
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 active:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Coffee className="w-4 h-4" />
                          Tea Break
                        </span>
                        {staff.teaBreaks.length > 0 && (
                          <span className="text-xs">✓ {staff.teaBreaks.length}x</span>
                        )}
                      </div>
                    </button>

                    {/* Lunch Button */}
                    {staff.lunchEntitled && (
                      <button
                        onClick={() => !staff.lunchBreak && handleSendForBreak(staff, 'lunch')}
                        disabled={!!staff.lunchBreak}
                        className={`w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                          staff.lunchBreak
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-50 text-gray-700 border border-gray-200 active:bg-green-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Utensils className="w-4 h-4" />
                            Lunch Break
                          </span>
                          {staff.lunchBreak && <span className="text-xs">✓ {staff.lunchBreak.time}</span>}
                        </div>
                      </button>
                    )}

                    {/* Supper Button */}
                    {staff.supperEntitled && (
                      <button
                        onClick={() => !staff.supperBreak && handleSendForBreak(staff, 'supper')}
                        disabled={!!staff.supperBreak}
                        className={`w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                          staff.supperBreak
                            ? 'bg-purple-100 text-purple-700 border border-purple-300'
                            : 'bg-gray-50 text-gray-700 border border-gray-200 active:bg-purple-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Utensils className="w-4 h-4" />
                            Supper Break
                          </span>
                          {staff.supperBreak && <span className="text-xs">✓ {staff.supperBreak.time}</span>}
                        </div>
                      </button>
                    )}
                  </div>

                  {staff.breakStatus === 'overdue' && (
                    <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-2 text-xs text-orange-700">
                      ⚠ Break overdue - priority scheduling required
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
