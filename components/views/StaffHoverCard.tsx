'use client';

import React from 'react';
import {
  User,
  Clock,
  Coffee,
  Award,
  MapPin,
  Calendar,
  Shield,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface StaffHoverCardProps {
  staff: {
    name: string;
    role: string;
    id: string;
  };
  visible: boolean;
  position?: { x: number; y: number };
}

export default function StaffHoverCard({ staff, visible, position }: StaffHoverCardProps) {
  if (!visible) return null;

  // Mock detailed staff data - in production, this would come from database
  const staffDetails = {
    employeeId: 'NHS-2847',
    department: 'Anaesthetics',
    grade: 'Consultant',
    currentLocation: 'Theatre 1 - Orthopaedics',
    shiftStart: '07:00',
    shiftEnd: '19:00',
    breakStatus: {
      taken: false,
      lastBreak: '07:00',
      nextDue: '11:00',
      totalBreaks: '0/3'
    },
    competencies: [
      { specialty: 'Orthopaedics', level: 'Expert', certified: true },
      { specialty: 'General Surgery', level: 'Expert', certified: true },
      { specialty: 'Emergency', level: 'Competent', certified: true },
      { specialty: 'Neurosurgery', level: 'Learning', certified: false }
    ],
    canRelieveIn: [
      { theatre: 'Theatre 1', available: true, reason: 'Primary theatre' },
      { theatre: 'Theatre 2', available: true, reason: 'Competent in General' },
      { theatre: 'Theatre 3', available: false, reason: 'Not certified for Cardiac' },
      { theatre: 'Theatre 4', available: false, reason: 'Neuro - Learning only' },
      { theatre: 'Theatre 5', available: true, reason: 'Emergency certified' }
    ],
    todaysActivity: {
      casesCompleted: 3,
      reliefProvided: 1,
      averageEfficiency: '94%',
      overtime: '0 hrs'
    },
    reliefHistory: [
      { time: '09:30', relieved: 'Dr. Smith', theatre: 'Theatre 1', duration: '15 min', reason: 'Break' },
    ]
  };

  const getCompetencyColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-100 text-green-700 border-green-300';
      case 'Competent': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Learning': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div
      className="fixed z-[60] bg-white rounded-lg shadow-2xl border border-gray-200 w-96 p-4"
      style={{
        left: position?.x || 0,
        top: position?.y || 0,
        transform: 'translate(-50%, 10px)'
      }}
    >
      {/* Header */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{staff.name}</h3>
            <p className="text-sm text-gray-600">{staff.role} • {staffDetails.grade}</p>
            <p className="text-xs text-gray-500 mt-1">ID: {staffDetails.employeeId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Shift</p>
            <p className="text-sm font-medium">{staffDetails.shiftStart} - {staffDetails.shiftEnd}</p>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-gray-50 rounded-lg p-2 mb-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span className="font-medium">Location:</span>
            <span className="text-gray-600">{staffDetails.currentLocation}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Coffee className="w-3 h-3 text-gray-400" />
            <span className="font-medium">Breaks:</span>
            <span className={staffDetails.breakStatus.taken ? 'text-green-600' : 'text-orange-600'}>
              {staffDetails.breakStatus.totalBreaks}
            </span>
          </div>
        </div>
        {!staffDetails.breakStatus.taken && (
          <div className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
            ⚠️ Break overdue - Last break at {staffDetails.breakStatus.lastBreak}
          </div>
        )}
      </div>

      {/* Competencies */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
          <Award className="w-3 h-3 mr-1" />
          Competencies & Certifications
        </h4>
        <div className="space-y-1">
          {staffDetails.competencies.map((comp, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between px-2 py-1 rounded border text-xs ${getCompetencyColor(comp.level)}`}
            >
              <span className="font-medium">{comp.specialty}</span>
              <div className="flex items-center space-x-1">
                <span>{comp.level}</span>
                {comp.certified && <Shield className="w-3 h-3" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Relief Availability */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
          <Activity className="w-3 h-3 mr-1" />
          Can Provide Relief In:
        </h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {staffDetails.canRelieveIn.map((theatre, idx) => (
            <div
              key={idx}
              className={`flex items-center space-x-1 p-1 rounded ${
                theatre.available ? 'bg-green-50' : 'bg-gray-50'
              }`}
              title={theatre.reason}
            >
              {theatre.available ? (
                <CheckCircle className="w-3 h-3 text-green-600" />
              ) : (
                <XCircle className="w-3 h-3 text-gray-400" />
              )}
              <span className={theatre.available ? 'text-green-700' : 'text-gray-500'}>
                {theatre.theatre}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Activity */}
      <div className="bg-blue-50 rounded-lg p-2 mb-3">
        <h4 className="text-xs font-semibold text-blue-700 mb-1">Today&apos;s Activity</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-600">Cases:</span>
            <span className="font-medium ml-1">{staffDetails.todaysActivity.casesCompleted}</span>
          </div>
          <div>
            <span className="text-gray-600">Reliefs:</span>
            <span className="font-medium ml-1">{staffDetails.todaysActivity.reliefProvided}</span>
          </div>
          <div>
            <span className="text-gray-600">Efficiency:</span>
            <span className="font-medium ml-1 text-green-600">{staffDetails.todaysActivity.averageEfficiency}</span>
          </div>
          <div>
            <span className="text-gray-600">Overtime:</span>
            <span className="font-medium ml-1">{staffDetails.todaysActivity.overtime}</span>
          </div>
        </div>
      </div>

      {/* Last Relief Provided */}
      {staffDetails.reliefHistory.length > 0 && (
        <div className="border-t border-gray-200 pt-2">
          <h4 className="text-xs font-semibold text-gray-700 mb-1">Last Relief Provided</h4>
          <div className="text-xs text-gray-600">
            {staffDetails.reliefHistory[0].time} - Relieved {staffDetails.reliefHistory[0].relieved} in{' '}
            {staffDetails.reliefHistory[0].theatre} ({staffDetails.reliefHistory[0].duration})
          </div>
        </div>
      )}

      {/* Audit Note */}
      <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500 italic">
        <AlertCircle className="w-3 h-3 inline mr-1" />
        All relief activities logged for compliance & documentation
      </div>
    </div>
  );
}