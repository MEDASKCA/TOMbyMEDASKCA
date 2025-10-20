'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Staff } from '@/types';
import StaffCard from './StaffCard';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Award,
} from 'lucide-react';

export default function StaffRoster() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [showInactiveOnly, setShowInactiveOnly] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  // Load staff with real-time updates
  useEffect(() => {
    const staffRef = collection(db, 'staff');
    const unsubscribe = onSnapshot(staffRef, (snapshot) => {
      const staffData: Staff[] = [];
      snapshot.forEach((doc) => {
        staffData.push({ id: doc.id, ...doc.data() } as Staff);
      });
      staffData.sort((a, b) => a.lastName.localeCompare(b.lastName));
      setStaff(staffData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Get unique values for filters
  const roles = useMemo(() => {
    const uniqueRoles = new Set(staff.map((s) => s.role));
    return Array.from(uniqueRoles).sort();
  }, [staff]);

  const specialties = useMemo(() => {
    const uniqueSpecialties = new Set(staff.flatMap((s) => s.specialties || []));
    return Array.from(uniqueSpecialties).sort();
  }, [staff]);

  const grades = useMemo(() => {
    const uniqueGrades = new Set(staff.map((s) => s.grade).filter(Boolean));
    return Array.from(uniqueGrades).sort();
  }, [staff]);

  // Filter and search staff
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        s.firstName.toLowerCase().includes(searchLower) ||
        s.lastName.toLowerCase().includes(searchLower) ||
        s.email.toLowerCase().includes(searchLower) ||
        s.role.toLowerCase().includes(searchLower) ||
        (s.specialties || []).some((spec) => spec.toLowerCase().includes(searchLower)) ||
        s.competencies.some((comp) => comp.procedureName.toLowerCase().includes(searchLower));

      // Role filter
      const matchesRole = selectedRole === 'all' || s.role === selectedRole;

      // Specialty filter
      const matchesSpecialty =
        selectedSpecialty === 'all' || (s.specialties || []).includes(selectedSpecialty);

      // Grade filter
      const matchesGrade = selectedGrade === 'all' || s.grade === selectedGrade;

      // Active/Inactive filter
      const matchesStatus =
        (!showActiveOnly && !showInactiveOnly) ||
        (showActiveOnly && s.isActive) ||
        (showInactiveOnly && !s.isActive);

      return matchesSearch && matchesRole && matchesSpecialty && matchesGrade && matchesStatus;
    });
  }, [staff, searchQuery, selectedRole, selectedSpecialty, selectedGrade, showActiveOnly, showInactiveOnly]);

  // Calculate stats
  const stats = useMemo(() => {
    const active = staff.filter((s) => s.isActive).length;
    const totalCompetencies = staff.reduce((sum, s) => sum + s.competencies.length, 0);
    const avgCompetencies = staff.length > 0 ? (totalCompetencies / staff.length).toFixed(1) : '0';

    return {
      total: staff.length,
      active,
      inactive: staff.length - active,
      totalCompetencies,
      avgCompetencies,
    };
  }, [staff]);

  const formatRole = (role: string) => {
    return role
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading staff roster...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Roster</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage theatre staff and competencies
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              title="Export roster (Coming soon)"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
              title="Add staff member (Coming soon)"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Staff</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Staff</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
              </div>
              <Users className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-400">Active</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-300 mt-1">{stats.active}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 dark:text-red-400">Inactive</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-300 mt-1">{stats.inactive}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 dark:text-purple-400">Total Competencies</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-300 mt-1">{stats.totalCompetencies}</p>
              </div>
              <Award className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-400">Avg per Staff</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-300 mt-1">{stats.avgCompetencies}</p>
              </div>
              <Award className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-12 gap-3">
          {/* Search */}
          <div className="col-span-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff by name, email, role, specialty, or procedure..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div className="col-span-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {formatRole(role)}
                </option>
              ))}
            </select>
          </div>

          {/* Specialty Filter */}
          <div className="col-span-2">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Grade Filter */}
          <div className="col-span-2">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Grades</option>
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filters */}
          <div className="col-span-2 flex items-center space-x-2">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => {
                  setShowActiveOnly(e.target.checked);
                  if (e.target.checked) setShowInactiveOnly(false);
                }}
                className="w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showInactiveOnly}
                onChange={(e) => {
                  setShowInactiveOnly(e.target.checked);
                  if (e.target.checked) setShowActiveOnly(false);
                }}
                className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Inactive</span>
            </label>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            Showing {filteredStaff.length} of {staff.length} staff members
          </span>
          {(searchQuery || selectedRole !== 'all' || selectedSpecialty !== 'all' || selectedGrade !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRole('all');
                setSelectedSpecialty('all');
                setSelectedGrade('all');
              }}
              className="text-teal-600 dark:text-teal-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Staff Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredStaff.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Filter className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Staff Found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters to find staff members.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredStaff.map((s) => (
              <StaffCard key={s.id} staff={s} showShifts />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
