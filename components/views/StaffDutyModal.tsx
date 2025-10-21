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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Staff on Duty - Overview</h2>
            <p className="text-green-100 text-sm mt-1">
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

        {/* Summary Cards */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Total On Duty</p>
              <p className="text-2xl font-bold text-green-600">{staffSummary.totalOnDuty}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">On Break</p>
              <p className="text-2xl font-bold text-blue-600">{staffSummary.onBreak}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Arriving Late</p>
              <p className="text-2xl font-bold text-orange-600">{staffSummary.arrivingLate}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Sick Today</p>
              <p className="text-2xl font-bold text-red-600">{staffSummary.sickToday}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Vacant Shifts (7d)</p>
              <p className="text-2xl font-bold text-purple-600">{staffSummary.vacantShifts.next7Days}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-300px)]">
          {/* Sickness Tracking */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Sickness Today ({sickStaff.length} staff)
              </h3>
            </div>
            <div className="space-y-3">
              {sickStaff.map((staff, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{staff.name}</h4>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-sm text-gray-600">{staff.role}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          staff.status === 'covered'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {staff.status === 'covered' ? '✓ Covered' : '⚠ Gap'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
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
                        <div className="mt-3 bg-green-50 rounded p-2 text-sm">
                          <CheckCircle className="w-4 h-4 inline text-green-600 mr-1" />
                          <span className="font-medium text-green-900">Covered by: {staff.coverBy}</span>
                          <div className="mt-1 text-xs text-green-700 ml-5">
                            {staff.shiftsCovered.join(', ')}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 bg-red-50 rounded p-2 text-sm flex items-center">
                          <XCircle className="w-4 h-4 text-red-600 mr-2" />
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
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-600" />
              Arriving Late ({arrivingLate.length} staff)
            </h3>
            <div className="space-y-3">
              {arrivingLate.map((staff, idx) => (
                <div key={idx} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{staff.name} - {staff.role}</h4>
                    <span className="text-sm text-orange-700 font-medium">
                      Due: {staff.scheduledStart} → ETA: {staff.expectedArrival}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
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
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                Vacant Shifts - Next 7 Days
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAvailableStaff(!showAvailableStaff)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                >
                  {showAvailableStaff ? 'Hide' : 'Show'} Available Staff
                </button>
                <button
                  onClick={() => onNavigateToRoster?.()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors"
                >
                  Go to Staff Roster →
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {vacantShifts.map((day, idx) => (
                <div key={idx} className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-3">{day.date}</h4>
                  <div className="space-y-2">
                    {day.shifts.map((shift, shiftIdx) => (
                      <div key={shiftIdx} className="bg-white rounded p-3 border border-purple-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                shift.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                shift.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {shift.priority.toUpperCase()}
                              </span>
                              <span className="font-medium text-gray-900">{shift.role}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-sm text-gray-600">{shift.department}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {shift.time} • {shift.availableCover} staff available to cover
                            </div>
                          </div>
                          {shift.availableCover === 0 && (
                            <span className="text-red-600 font-medium text-sm flex items-center">
                              <XCircle className="w-4 h-4 mr-1" />
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
              <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">Available Bank/Agency Staff</h4>
                <div className="grid grid-cols-3 gap-3 text-sm">
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
  );
}
