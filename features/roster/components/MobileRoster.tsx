'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Filter,
  Plus,
  Menu,
  Bell,
  Home,
  LayoutGrid,
  User,
  Star,
  Award,
  CheckCircle,
  Search,
  X,
} from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import type { StaffProfile } from '@/types/marketplace';

// Mock data
const mockShifts = [
  {
    id: '1',
    date: new Date(2025, 9, 20),
    type: 'Early Shift',
    hours: '07:30 - 15:30',
    theatre: 'Theatre 1 - Main',
    specialty: 'Orthopaedics',
    role: 'Scrub Nurse',
    status: 'confirmed',
    staff: 'You',
  },
  {
    id: '2',
    date: new Date(2025, 9, 21),
    type: 'Early Shift',
    hours: '07:30 - 15:30',
    theatre: 'Theatre 1 - Main',
    specialty: 'Orthopaedics',
    role: 'Scrub Nurse',
    status: 'confirmed',
    staff: 'You',
  },
  {
    id: '3',
    date: new Date(2025, 9, 22),
    type: 'Long Day',
    hours: '07:30 - 19:30',
    theatre: 'Theatre 3 - Cardiac',
    specialty: 'Cardiac Surgery',
    role: 'Scrub Nurse',
    status: 'pending',
    staff: 'Sarah Johnson',
  },
];

const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i));

export default function MobileRoster() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'roster' | 'shifts' | 'team' | 'profile'>('roster');
  const [staffProfiles, setStaffProfiles] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterBand, setFilterBand] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffProfile | null>(null);

  const todayShifts = mockShifts.filter((shift) => isSameDay(shift.date, selectedDate));

  // Fetch staff from Firebase
  useEffect(() => {
    const fetchStaff = async () => {
      if (!isFirebaseConfigured || !db) {
        console.log('Firebase not configured, using mock data');
        return;
      }

      setLoading(true);
      try {
        const staffRef = collection(db, 'staff');
        const q = query(staffRef, limit(50));
        const querySnapshot = await getDocs(q);

        const profiles: StaffProfile[] = [];
        querySnapshot.forEach((doc) => {
          profiles.push({ ...doc.data(), id: doc.id } as StaffProfile);
        });

        setStaffProfiles(profiles);
        console.log(`Loaded ${profiles.length} staff profiles from Firebase`);
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'team') {
      fetchStaff();
    }
  }, [activeTab]);

  // Filter staff based on search and filters
  const filteredStaff = staffProfiles.filter(staff => {
    const matchesSearch = searchQuery === '' ||
      `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.currentTrust?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === 'all' || staff.role === filterRole;
    const matchesBand = filterBand === 'all' || staff.band === filterBand;

    return matchesSearch && matchesRole && matchesBand;
  });

  const getShiftColor = (type: string) => {
    if (type.includes('Early')) return 'from-blue-600 to-blue-700';
    if (type.includes('Late')) return 'from-orange-600 to-orange-700';
    if (type.includes('Night')) return 'from-purple-800 to-purple-900';
    if (type.includes('Long')) return 'from-teal-600 to-teal-700';
    return 'from-gray-600 to-gray-700';
  };

  const getStatusColor = (status: string) => {
    if (status === 'confirmed') return 'bg-green-500';
    if (status === 'pending') return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  // Render Team Tab Content
  const renderTeamTab = () => (
    <>
      {/* Search and Filter Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white font-bold text-lg">Available Staff</h1>
            <p className="text-teal-100 text-xs">{filteredStaff.length} Theatre Professionals</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
          >
            <Filter className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-700" />
          <input
            type="text"
            placeholder="Search by name, role, or hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-3 bg-white/10 backdrop-blur-md rounded-xl p-3 space-y-3">
            <div>
              <label className="block text-xs font-medium text-teal-100 mb-1.5">Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                <option value="all">All Roles</option>
                <option value="Scrub Nurse">Scrub Nurse</option>
                <option value="Anaesthetic Nurse">Anaesthetic Nurse</option>
                <option value="ODP">ODP</option>
                <option value="HCA">HCA</option>
                <option value="Recovery Nurse">Recovery Nurse</option>
                <option value="Theatre Nurse">Theatre Nurse</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-teal-100 mb-1.5">Band</label>
              <select
                value={filterBand}
                onChange={(e) => setFilterBand(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                <option value="all">All Bands</option>
                <option value="Band 3">Band 3</option>
                <option value="Band 4">Band 4</option>
                <option value="Band 5">Band 5</option>
                <option value="Band 6">Band 6</option>
                <option value="Band 7">Band 7</option>
                <option value="Band 8a">Band 8a</option>
                <option value="Band 8b">Band 8b</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Staff List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
            <p className="text-gray-400 text-sm">Loading staff profiles...</p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-gray-400 font-semibold text-lg mb-2">No Staff Found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredStaff.map((staff) => (
            <div
              key={staff.id}
              onClick={() => setSelectedStaff(staff)}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700 shadow-xl active:scale-95 transition-transform"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                    {staff.firstName[0]}{staff.lastName[0]}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-bold">
                        {staff.firstName} {staff.lastName}
                      </h3>
                      {staff.verified && (
                        <CheckCircle className="w-4 h-4 text-teal-400" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{staff.role} • {staff.band}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{staff.id}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 bg-gray-700/50 px-2 py-1 rounded-lg">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-xs font-semibold">
                    {staff.performance?.rating?.toFixed(1) || '5.0'}
                  </span>
                </div>
              </div>

              {/* Experience & Location */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-blue-600/20 rounded-lg p-2">
                  <div className="text-blue-400 text-xs uppercase font-medium mb-0.5">Experience</div>
                  <div className="text-white font-semibold">{staff.yearsExperience} years</div>
                </div>
                <div className="bg-purple-600/20 rounded-lg p-2">
                  <div className="text-purple-400 text-xs uppercase font-medium mb-0.5">Shifts</div>
                  <div className="text-white font-semibold">{staff.performance?.completedShifts || 0}</div>
                </div>
              </div>

              {/* Current Location */}
              <div className="flex items-center space-x-2 text-gray-400 text-sm mb-3">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{staff.currentTrust}</span>
              </div>

              {/* Specialties */}
              {staff.availability?.preferredSpecialties && staff.availability.preferredSpecialties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {staff.availability.preferredSpecialties.slice(0, 3).map((specialty, idx) => (
                    <span
                      key={idx}
                      className="bg-teal-600/30 text-teal-300 px-2 py-1 rounded-md text-xs font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                  {staff.availability.preferredSpecialties.length > 3 && (
                    <span className="bg-gray-700/50 text-gray-400 px-2 py-1 rounded-md text-xs">
                      +{staff.availability.preferredSpecialties.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 text-sm font-medium transition-colors">
                  View Profile
                </button>
                <button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg py-2 text-sm font-medium transition-colors">
                  Book Shift
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Roster Tab Content */}
      {activeTab === 'roster' && (
        <>
          {/* Epic-style Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Menu className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg">Staff Roster</h1>
                  <p className="text-teal-100 text-xs">Theatre Operations</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm relative">
                  <Bell className="w-5 h-5 text-white" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>

        {/* Week Slider */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
          <div className="flex items-center justify-between mb-3">
            <button className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="text-center">
              <p className="text-white font-semibold">{format(selectedDate, 'MMMM yyyy')}</p>
              <p className="text-teal-100 text-xs">Week {format(selectedDate, 'w')}</p>
            </div>
            <button className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Day Pills */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => {
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              const hasShift = mockShifts.some((s) => isSameDay(s.date, day));

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`relative rounded-lg p-2 transition-all ${
                    isSelected
                      ? 'bg-white text-teal-700 shadow-lg scale-110'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <div className="text-[10px] uppercase font-medium opacity-70">{format(day, 'EEE')}</div>
                  <div className={`text-lg font-bold mt-0.5 ${isToday && !isSelected ? 'text-teal-300' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  {hasShift && (
                    <div
                      className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                        isSelected ? 'bg-teal-600' : 'bg-teal-300'
                      }`}
                    ></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-800 px-4 py-3 grid grid-cols-3 gap-3 border-b border-gray-700">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-3 text-white">
          <div className="text-2xl font-bold">8</div>
          <div className="text-xs opacity-90">This Week</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-3 text-white">
          <div className="text-2xl font-bold">42</div>
          <div className="text-xs opacity-90">This Month</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-3 text-white">
          <div className="text-2xl font-bold">38h</div>
          <div className="text-xs opacity-90">Total Hours</div>
        </div>
      </div>

      {/* Shifts List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {todayShifts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-gray-400 font-semibold text-lg mb-2">No Shifts Today</h3>
            <p className="text-gray-500 text-sm">Select a different date to view shifts</p>
          </div>
        ) : (
          todayShifts.map((shift) => (
            <div
              key={shift.id}
              className={`bg-gradient-to-r ${getShiftColor(
                shift.type
              )} rounded-2xl p-4 text-white shadow-xl transform transition-all active:scale-95`}
            >
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 ${getStatusColor(shift.status)} rounded-full animate-pulse`}></div>
                  <span className="text-xs font-medium uppercase opacity-90">
                    {shift.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
                <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  {shift.staff}
                </span>
              </div>

              {/* Shift Type */}
              <h3 className="text-xl font-bold mb-1">{shift.type}</h3>

              {/* Time */}
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="w-4 h-4 opacity-80" />
                <span className="text-sm font-medium">{shift.hours}</span>
              </div>

              {/* Location & Specialty */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 opacity-80 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{shift.theatre}</div>
                    <div className="text-xs opacity-75">{shift.specialty}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 opacity-80" />
                  <span className="text-sm">{shift.role}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg py-2 text-sm font-medium transition-colors">
                  View Details
                </button>
                <button className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg py-2 text-sm font-medium transition-colors">
                  Check In
                </button>
              </div>
            </div>
          ))
        )}
      </div>

        </>
      )}

      {/* Team Tab Content */}
      {activeTab === 'team' && renderTeamTab()}

      {/* Shifts Tab Placeholder */}
      {activeTab === 'shifts' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LayoutGrid className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-gray-400 font-semibold text-lg mb-2">Shifts View</h3>
            <p className="text-gray-500 text-sm">Coming soon...</p>
          </div>
        </div>
      )}

      {/* Profile Tab Placeholder */}
      {activeTab === 'profile' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-gray-400 font-semibold text-lg mb-2">Profile</h3>
            <p className="text-gray-500 text-sm">Coming soon...</p>
          </div>
        </div>
      )}

      {/* Floating Action Button (only on roster/team tabs) */}
      {(activeTab === 'roster' || activeTab === 'team') && (
        <button className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full shadow-2xl flex items-center justify-center text-white active:scale-90 transition-transform">
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Epic-style Bottom Navigation */}
      <div className="bg-gray-900 border-t border-gray-800 px-2 py-2 safe-bottom">
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => setActiveTab('roster')}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              activeTab === 'roster'
                ? 'bg-gradient-to-br from-teal-600 to-cyan-600 text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Roster</span>
          </button>

          <button
            onClick={() => setActiveTab('shifts')}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              activeTab === 'shifts'
                ? 'bg-gradient-to-br from-teal-600 to-cyan-600 text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <LayoutGrid className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Shifts</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              activeTab === 'team'
                ? 'bg-gradient-to-br from-teal-600 to-cyan-600 text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Users className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Team</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-to-br from-teal-600 to-cyan-600 text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
