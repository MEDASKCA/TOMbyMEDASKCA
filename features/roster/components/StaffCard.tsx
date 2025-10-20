'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Staff, Shift } from '@/types';
import CompetencyBadge from './CompetencyBadge';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface StaffCardProps {
  staff: Staff;
  onSelect?: (staff: Staff) => void;
  selectable?: boolean;
  showShifts?: boolean;
}

export default function StaffCard({ staff, onSelect, selectable = false, showShifts = true }: StaffCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loadingShifts, setLoadingShifts] = useState(false);

  useEffect(() => {
    if (showShifts && expanded) {
      loadShifts();
    }
  }, [expanded, showShifts]);

  async function loadShifts() {
    setLoadingShifts(true);
    try {
      // Get shifts for next 7 days
      const today = new Date();
      const shiftsSnapshot = await getDocs(
        query(collection(db, 'shifts'), where('staffId', '==', staff.id))
      );
      const shiftsData: Shift[] = [];
      shiftsSnapshot.forEach((doc) => {
        shiftsData.push({ id: doc.id, ...doc.data() } as Shift);
      });
      shiftsData.sort((a, b) => a.date.localeCompare(b.date));
      setShifts(shiftsData);
    } catch (error) {
      console.error('Error loading shifts:', error);
    } finally {
      setLoadingShifts(false);
    }
  }

  const getRoleColor = (role: Staff['role']) => {
    switch (role) {
      case 'surgeon':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-700 dark:text-blue-400',
          border: 'border-blue-300 dark:border-blue-700',
        };
      case 'anesthetist':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          text: 'text-purple-700 dark:text-purple-400',
          border: 'border-purple-300 dark:border-purple-700',
        };
      case 'scrub-nurse':
      case 'recovery-nurse':
        return {
          bg: 'bg-teal-100 dark:bg-teal-900/30',
          text: 'text-teal-700 dark:text-teal-400',
          border: 'border-teal-300 dark:border-teal-700',
        };
      case 'odp':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-400',
          border: 'border-green-300 dark:border-green-700',
        };
      case 'coordinator':
        return {
          bg: 'bg-amber-100 dark:bg-amber-900/30',
          text: 'text-amber-700 dark:text-amber-400',
          border: 'border-amber-300 dark:border-amber-700',
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-300 dark:border-gray-600',
        };
    }
  };

  const roleConfig = getRoleColor(staff.role);

  const formatRole = (role: string) => {
    return role
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 border-2 ${
        staff.isActive ? 'border-gray-200 dark:border-gray-700' : 'border-red-300 dark:border-red-700'
      } rounded-lg overflow-hidden hover:shadow-lg transition-all ${selectable ? 'cursor-pointer' : ''}`}
      onClick={selectable ? () => onSelect?.(staff) : undefined}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3">
            <div className={`${roleConfig.bg} border-2 ${roleConfig.border} rounded-full p-3`}>
              <User className={`w-6 h-6 ${roleConfig.text}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {staff.firstName} {staff.lastName}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs font-medium ${roleConfig.text} ${roleConfig.bg} border ${roleConfig.border} px-2 py-0.5 rounded-full`}>
                  {formatRole(staff.role)}
                </span>
                {staff.grade && (
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                    {staff.grade}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-1">
            {staff.isActive ? (
              <CheckCircle className="w-5 h-5 text-green-500" aria-label="Active" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" aria-label="Inactive" />
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span className="truncate">{staff.email}</span>
          </div>
          {staff.phoneNumber && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{staff.phoneNumber}</span>
            </div>
          )}
        </div>

        {/* Specialties */}
        {staff.specialties && staff.specialties.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Specialties:</p>
            <div className="flex flex-wrap gap-1">
              {staff.specialties.map((specialty, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Competencies Summary */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Competencies:</p>
            <div className="flex items-center space-x-1">
              <Award className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{staff.competencies.length}</span>
            </div>
          </div>
          {staff.competencies.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {staff.competencies.slice(0, 3).map((comp, idx) => (
                <CompetencyBadge key={idx} competency={comp} size="sm" />
              ))}
              {staff.competencies.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                  +{staff.competencies.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">No competencies recorded</p>
          )}
        </div>

        {/* Availability */}
        {staff.availability && Object.keys(staff.availability).length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Availability:</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(staff.availability).slice(0, 5).map(([date, info]) => (
                <span
                  key={date}
                  className={`text-xs px-2 py-0.5 rounded border ${
                    info.available
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                  }`}
                >
                  {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="w-full flex items-center justify-center space-x-2 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors border-t border-gray-200 dark:border-gray-700 -mx-4 -mb-4 mt-3 px-4 pt-3"
        >
          <span>{expanded ? 'Hide Details' : 'Show Details'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 space-y-4">
          {/* All Competencies */}
          {staff.competencies.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">All Competencies</h4>
              <div className="space-y-2">
                {staff.competencies.map((comp, idx) => (
                  <CompetencyBadge key={idx} competency={comp} showDetails />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Shifts */}
          {showShifts && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Upcoming Shifts</h4>
              {loadingShifts ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div>
                </div>
              ) : shifts.length > 0 ? (
                <div className="space-y-2">
                  {shifts.map((shift) => (
                    <div
                      key={shift.id}
                      className={`p-2 rounded text-sm ${
                        shift.status === 'confirmed'
                          ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800'
                          : shift.status === 'scheduled'
                          ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800'
                          : shift.status === 'completed'
                          ? 'bg-gray-50 dark:bg-gray-900/10 border border-gray-200 dark:border-gray-800'
                          : 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {new Date(shift.date).toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {shift.startTime} - {shift.endTime}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 capitalize">
                        Status: {shift.status}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No upcoming shifts</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
