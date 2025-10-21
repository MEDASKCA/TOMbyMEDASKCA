'use client';

import React, { useState } from 'react';
import {
  X,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  User,
  FileText,
  TrendingUp,
  Activity
} from 'lucide-react';

interface StaffDutyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRoster?: () => void;
}

export default function StaffDutyModal({ isOpen, onClose, onNavigateToRoster }: StaffDutyModalProps) {
  const [showAvailableStaff, setShowAvailableStaff] = useState(false);
  const [selectedDate, setSelectedDate] = useState('today');

  if (!isOpen) return null;

  const staffSummary = {
    totalOnDuty: 156,
    onBreak: 7,
    arrivingLate: 3,
    sickToday: 5,
    vacantShifts: {
      tomorrow: 2,
      next7Days: 8
    }
  };

  const sickStaff = [
    {
      name: 'RN S. Williams',
      role: 'Scrub N/P',
      department: 'Main Theatres',
      reason: 'Flu symptoms',
      startDate: '2024-10-21',
      expectedReturn: '2024-10-23',
      episodes: 2,
      lastSickness: '2024-09-15 - Cold (3 days)',
      status: 'covered',
      coverBy: 'RN K. Martinez (Bank Staff)',
      shiftsCovered: ['Main Theatre 3: 08:00-18:00']
    },
    {
      name: 'ODP M. Johnson',
      role: 'Anaes N/P',
      department: 'ACAD Theatres',
      reason: 'Migraine',
      startDate: '2024-10-21',
      expectedReturn: '2024-10-21',
      episodes: 1,
      lastSickness: '2024-08-10 - Stomach bug (2 days)',
      status: 'covered',
      coverBy: 'ODP R. Thompson (Internal)',
      shiftsCovered: ['ACAD Theatre 5: 07:00-15:00']
    },
    {
      name: 'Dr. A. Patel',
      role: 'Anaesthetist',
      department: 'Anaesthetics',
      reason: 'Family emergency',
      startDate: '2024-10-21',
      expectedReturn: '2024-10-22',
      episodes: 0,
      lastSickness: 'None this year',
      status: 'covered',
      coverBy: 'Dr. S. Kumar (Locum)',
      shiftsCovered: ['Main Theatre 6: 08:00-18:00', 'ACAD Theatre 2: 08:00-18:00']
    },
    {
      name: 'HCA T. Brown',
      role: 'Healthcare Assistant',
      department: 'Main Theatres',
      reason: 'Back pain',
      startDate: '2024-10-20',
      expectedReturn: '2024-10-22',
      episodes: 3,
      lastSickness: '2024-09-05 - Back pain (2 days)',
      status: 'gap',
      shiftsCovered: []
    },
    {
      name: 'RN D. Garcia',
      role: 'Recovery Nurse',
      department: 'Recovery',
      reason: 'Covid-19',
      startDate: '2024-10-19',
      expectedReturn: '2024-10-26',
      episodes: 1,
      lastSickness: 'None',
      status: 'gap',
      shiftsCovered: []
    }
  ];

  const arrivingLate = [
    {
      name: 'Dr. F. James',
      role: 'Consultant Anaesthetist',
      assignedTo: 'Main Theatre 1',
      scheduledStart: '07:00',
      expectedArrival: '09:15',
      reason: 'Managing emergency in Theatre 5',
      cover: 'Dr. S. Patel (Locum) - confirmed',
      impact: 'No delay - covered'
    },
    {
      name: 'J. Smith',
      role: 'Consultant Surgeon',
      assignedTo: 'Main Theatre 4',
      scheduledStart: '08:00',
      expectedArrival: '08:30',
      reason: 'Traffic delay - M1 accident',
      cover: 'Surgical Registrar ready to prep',
      impact: 'Minor delay - 15 min'
    },
    {
      name: 'RN L. Anderson',
      role: 'Scrub N/P',
      assignedTo: 'ACAD Theatre 8',
      scheduledStart: '07:00',
      expectedArrival: '07:45',
      reason: 'Childcare issue',
      cover: 'ODP M. Wilson covering',
      impact: 'No delay - covered'
    }
  ];

  const vacantShifts = [
    {
      date: 'Tomorrow (22 Oct)',
      shifts: [
        { role: 'Anaes N/P', department: 'Main Theatre 5', time: '08:00-18:00', priority: 'urgent', availableCover: 3 },
        { role: 'Scrub N/P', department: 'ACAD Theatre 3', time: '12:00-20:00', priority: 'high', availableCover: 5 }
      ]
    },
    {
      date: '23 Oct',
      shifts: [
        { role: 'HCA', department: 'Main Theatre 1', time: '08:00-16:00', priority: 'medium', availableCover: 8 },
        { role: 'Anaes N/P', department: 'ACAD Theatre 7', time: '07:00-15:00', priority: 'high', availableCover: 2 }
      ]
    },
    {
      date: '24 Oct',
      shifts: [
        { role: 'Scrub N/P', department: 'Main Theatre 9', time: '08:00-18:00', priority: 'medium', availableCover: 6 },
        { role: 'Recovery Nurse', department: 'Main Recovery', time: '13:00-21:00', priority: 'urgent', availableCover: 1 }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center lg:p-4 z-50">
      <div className="bg-white lg:rounded-lg shadow-xl max-w-7xl w-full h-full lg:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold">Staff on Duty - Overview</h2>
            <p className="text-green-100 text-xs mt-1">
              Current staffing levels, sickness tracking & vacant shifts
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-800 rounded-lg transition-colors"
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
                <p className="text-[10px] text-gray-600 mb-1">Total On Duty</p>
                <p className="text-lg font-bold text-green-600">{staffSummary.totalOnDuty}</p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <p className="text-[10px] text-gray-600 mb-1">On Break</p>
                <p className="text-lg font-bold text-blue-600">{staffSummary.onBreak}</p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <p className="text-[10px] text-gray-600 mb-1">Arriving Late</p>
                <p className="text-lg font-bold text-orange-600">{staffSummary.arrivingLate}</p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <p className="text-[10px] text-gray-600 mb-1">Sick Today</p>
                <p className="text-lg font-bold text-red-600">{staffSummary.sickToday}</p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <p className="text-[10px] text-gray-600 mb-1">Vacant Shifts (7d)</p>
                <p className="text-lg font-bold text-purple-600">{staffSummary.vacantShifts.next7Days}</p>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filters - Compact, at top */}
            <div className="p-2 bg-white border-b border-gray-200 flex-shrink-0">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 flex-wrap">
                  <Activity className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">View:</span>
                  <button
                    onClick={() => setSelectedDate('today')}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                      selectedDate === 'today'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setSelectedDate('week')}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                      selectedDate === 'week'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => setSelectedDate('month')}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                      selectedDate === 'month'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    This Month
                  </button>
                </div>
                <div className="flex items-center space-x-2 flex-wrap">
                  <User className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">Options:</span>
                  <button
                    onClick={() => setShowAvailableStaff(!showAvailableStaff)}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                      showAvailableStaff
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {showAvailableStaff ? 'Hide' : 'Show'} Available Staff
                  </button>
                  <button
                    onClick={() => onNavigateToRoster?.()}
                    className="px-2 py-1 rounded text-[10px] font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                  >
                    Go to Staff Roster →
                  </button>
                </div>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="space-y-3">
                {/* Sickness Tracking */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                    Sickness Today ({sickStaff.length} staff)
                  </h3>
                  <div className="space-y-2">
                    {sickStaff.map((staff, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900 text-sm">{staff.name}</h4>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-600">{staff.role}</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                staff.status === 'covered'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {staff.status === 'covered' ? '✓ Covered' : '⚠ Gap'}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                              <div>
                                <span className="text-gray-600">Reason:</span>
                                <span className="ml-2 font-medium text-gray-900">{staff.reason}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Expected Return:</span>
                                <span className="ml-2 font-medium text-gray-900">{staff.expectedReturn}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Episodes (YTD):</span>
                                <span className="ml-2 font-medium text-gray-900">{staff.episodes}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Last Sickness:</span>
                                <span className="ml-2 text-gray-700">{staff.lastSickness}</span>
                              </div>
                            </div>
                            {staff.status === 'covered' ? (
                              <div className="mt-2 bg-green-50 rounded p-2 text-xs">
                                <CheckCircle className="w-3 h-3 inline text-green-600 mr-1" />
                                <span className="font-medium text-green-900">Covered by: {staff.coverBy}</span>
                                <div className="mt-1 text-[10px] text-green-700 ml-4">
                                  {staff.shiftsCovered.join(', ')}
                                </div>
                              </div>
                            ) : (
                              <div className="mt-2 bg-red-50 rounded p-2 text-xs flex items-center">
                                <XCircle className="w-3 h-3 text-red-600 mr-2" />
                                <span className="font-medium text-red-900">Coverage gap - requires urgent action</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arriving Late */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-orange-600" />
                    Arriving Late ({arrivingLate.length} staff)
                  </h3>
                  <div className="space-y-2">
                    {arrivingLate.map((staff, idx) => (
                      <div key={idx} className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm">{staff.name} - {staff.role}</h4>
                          <span className="text-xs text-orange-700 font-medium">
                            Due: {staff.scheduledStart} → ETA: {staff.expectedArrival}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Assigned:</span>
                            <span className="ml-2 font-medium">{staff.assignedTo}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Reason:</span>
                            <span className="ml-2">{staff.reason}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-600">Cover:</span>
                            <span className="ml-2 text-green-700 font-medium">{staff.cover}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-600">Impact:</span>
                            <span className="ml-2">{staff.impact}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vacant Shifts */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    Vacant Shifts - Next 7 Days
                  </h3>
                  <div className="space-y-2">
                    {vacantShifts.map((day, idx) => (
                      <div key={idx} className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <h4 className="font-semibold text-purple-900 mb-2 text-sm">{day.date}</h4>
                        <div className="space-y-2">
                          {day.shifts.map((shift, shiftIdx) => (
                            <div key={shiftIdx} className="bg-white rounded p-2 border border-purple-200">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className={`px-2 py-1 rounded text-[10px] font-medium ${
                                      shift.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                      shift.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                      'bg-yellow-100 text-yellow-700'
                                    }`}>
                                      {shift.priority.toUpperCase()}
                                    </span>
                                    <span className="font-medium text-gray-900 text-xs">{shift.role}</span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-xs text-gray-600">{shift.department}</span>
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {shift.time} • {shift.availableCover} staff available to cover
                                  </div>
                                </div>
                                {shift.availableCover === 0 && (
                                  <span className="text-red-600 font-medium text-xs flex items-center">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    No cover available!
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {showAvailableStaff && (
                    <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2 text-sm">Available Bank/Agency Staff</h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {['RN K. Martinez', 'ODP R. Thompson', 'RN L. Davis', 'HCA M. Wilson', 'ODP S. Ahmed', 'RN P. Robinson'].map((name, idx) => (
                          <div key={idx} className="bg-white rounded p-2 border border-blue-200 text-center">
                            {name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
