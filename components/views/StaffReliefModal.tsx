'use client';

import React, { useState } from 'react';
import {
  X,
  Bell,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Coffee,
  Heart,
  UserCheck,
  Shield,
  Award,
  Calendar,
  Send,
  ChevronDown
} from 'lucide-react';

interface StaffReliefModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffMember?: {
    name: string;
    role: string;
    theatre: string;
  };
}

interface AvailableStaff {
  id: string;
  name: string;
  role: string;
  currentLocation: string;
  breakStatus: 'not_taken' | 'taken' | 'overdue';
  lastBreak: string;
  competencies: string[];
  matchScore: number;
  estimatedArrival: string;
  reliefHistory: number;
}

export default function StaffReliefModal({ isOpen, onClose, staffMember }: StaffReliefModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [duration, setDuration] = useState('15');
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<'routine' | 'urgent' | 'emergency'>('routine');

  if (!isOpen) return null;

  const reliefReasons = [
    { id: 'break', label: 'Coffee/Rest Break', icon: Coffee, color: 'blue' },
    { id: 'lunch', label: 'Lunch Break', icon: Coffee, color: 'green' },
    { id: 'toilet', label: 'Toilet Break', icon: User, color: 'yellow' },
    { id: 'medical', label: 'Medical/Health', icon: Heart, color: 'red' },
    { id: 'emergency', label: 'Personal Emergency', icon: AlertCircle, color: 'red' },
    { id: 'admin', label: 'Admin/Documentation', icon: Calendar, color: 'purple' },
    { id: 'other', label: 'Other (specify)', icon: ChevronDown, color: 'gray' }
  ];

  // Smart matching algorithm results
  const availableStaff: AvailableStaff[] = [
    {
      id: '1',
      name: 'S. Patel',
      role: 'Anaesthetist',
      currentLocation: 'Break Room',
      breakStatus: 'taken',
      lastBreak: '09:30',
      competencies: ['Orthopaedics', 'General', 'Emergency'],
      matchScore: 95,
      estimatedArrival: '2 min',
      reliefHistory: 3
    },
    {
      id: '2',
      name: 'M. O\'Connor',
      role: 'Anaesthetist',
      currentLocation: 'Theatre 4',
      breakStatus: 'not_taken',
      lastBreak: 'Not taken',
      competencies: ['Orthopaedics', 'Neuro'],
      matchScore: 85,
      estimatedArrival: '5 min',
      reliefHistory: 1
    },
    {
      id: '3',
      name: 'K. Thompson',
      role: 'Anaesthetist',
      currentLocation: 'Recovery',
      breakStatus: 'overdue',
      lastBreak: '07:00',
      competencies: ['General', 'Emergency'],
      matchScore: 60,
      estimatedArrival: '3 min',
      reliefHistory: 5
    }
  ];

  const getBreakStatusColor = (status: string) => {
    switch (status) {
      case 'taken': return 'text-green-600 bg-green-50';
      case 'not_taken': return 'text-yellow-600 bg-yellow-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const handleSendRequest = () => {
    if (selectedStaff && (selectedReason || customReason)) {
      console.log('Sending relief request:', {
        requestor: staffMember,
        reliefStaff: availableStaff.find(s => s.id === selectedStaff),
        reason: customReason || selectedReason,
        duration,
        urgency,
        timestamp: new Date().toISOString()
      });
      alert('Relief request sent! Notification dispatched to selected staff.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Staff Relief Request</h2>
              <p className="text-blue-100 text-sm">
                Requesting relief for: {staffMember?.name} ({staffMember?.role}) - {staffMember?.theatre}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-blue-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Urgency Level */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
            <div className="flex space-x-2">
              {(['routine', 'urgent', 'emergency'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setUrgency(level)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                    urgency === level
                      ? level === 'emergency'
                        ? 'bg-red-600 text-white'
                        : level === 'urgent'
                        ? 'bg-orange-600 text-white'
                        : 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Relief Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Relief</label>
            <div className="grid grid-cols-3 gap-2">
              {reliefReasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <button
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.id)}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-2 ${
                      selectedReason === reason.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{reason.label}</span>
                  </button>
                );
              })}
            </div>
            {selectedReason === 'other' && (
              <input
                type="text"
                placeholder="Please specify reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Duration (minutes)
            </label>
            <div className="flex space-x-2">
              {['15', '30', '45', '60', '90'].map((time) => (
                <button
                  key={time}
                  onClick={() => setDuration(time)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    duration === time
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time}m
                </button>
              ))}
            </div>
          </div>

          {/* Available Staff - Smart Matching */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Available Staff (AI-Matched by Competency)
              </label>
              <span className="text-xs text-gray-500">
                <Shield className="w-3 h-3 inline mr-1" />
                Competency-verified matches
              </span>
            </div>

            <div className="space-y-2">
              {availableStaff.map((staff) => (
                <div
                  key={staff.id}
                  onClick={() => setSelectedStaff(staff.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedStaff === staff.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{staff.name}</h4>
                        <span className="text-sm text-gray-600">({staff.role})</span>

                        {/* Match Score */}
                        <div className="flex items-center space-x-1">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getMatchScoreColor(staff.matchScore)}`}
                              style={{ width: `${staff.matchScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{staff.matchScore}%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3 text-gray-400" />
                            <span>Currently: {staff.currentLocation}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span>ETA: {staff.estimatedArrival}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <Coffee className="w-3 h-3 text-gray-400" />
                            <span className={`px-2 py-0.5 rounded text-xs ${getBreakStatusColor(staff.breakStatus)}`}>
                              Break: {staff.lastBreak}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <UserCheck className="w-3 h-3 text-gray-400" />
                            <span>Relieved {staff.reliefHistory}x today</span>
                          </div>
                        </div>
                      </div>

                      {/* Competencies */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {staff.competencies.map((comp) => (
                          <span key={comp} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            <Award className="w-3 h-3 inline mr-1" />
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedStaff === staff.id && (
                      <CheckCircle className="w-5 h-5 text-blue-600 ml-3" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              Request will be logged in audit trail and staff transcript
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                disabled={!selectedStaff || (!selectedReason && !customReason)}
                className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                  selectedStaff && (selectedReason || customReason)
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Send Relief Request</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}