'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Search,
  Filter,
  Star,
  CheckCircle,
  X,
  Users,
  User,
  Navigation,
  Briefcase,
  Award,
  TrendingUp,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  MapPinned,
  Clock,
  Shield,
  Zap,
} from 'lucide-react';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import type { StaffProfile } from '@/types/marketplace';

// Dynamically import map component
const MapView = dynamic(() => import('./MapView'), { ssr: false });

export default function DesktopRoster() {
  const [activeSection, setActiveSection] = useState<'directory' | 'allocation' | 'requests' | 'active'>('directory');
  const [staffProfiles, setStaffProfiles] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<string>(''); // Date range start
  const [filterDateTo, setFilterDateTo] = useState<string>(''); // Date range end
  const [filterBookingStatus, setFilterBookingStatus] = useState<string>('all'); // Booking status filter
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffProfile | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'feed'>('map');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showFullProfile, setShowFullProfile] = useState(false);

  // Mock booking requests state (in production, this would come from Firebase)
  const [bookingRequests] = useState([
    { staffId: '1', status: 'pending', date: '2024-11-15' },
    { staffId: '2', status: 'accepted', date: '2024-11-16' },
    { staffId: '3', status: 'declined', date: '2024-11-17' },
  ]);

  // Fetch staff from Firebase
  useEffect(() => {
    const fetchStaff = async () => {
      console.log('🔍 Firebase configured:', isFirebaseConfigured);
      if (!isFirebaseConfigured || !db) {
        console.log('⚠️ Firebase not configured');
        return;
      }
      setLoading(true);
      try {
        const staffRef = collection(db, 'staff');
        const q = query(staffRef, limit(50));
        console.log('📡 Fetching staff from Firebase...');
        const querySnapshot = await getDocs(q);
        const profiles: StaffProfile[] = [];
        querySnapshot.forEach((doc) => {
          profiles.push({ ...doc.data(), id: doc.id } as StaffProfile);
        });
        console.log('✅ Fetched', profiles.length, 'staff profiles');
        setStaffProfiles(profiles);
      } catch (error) {
        console.error('❌ Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  // Request location
  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error('Error getting location:', error)
      );
    }
  };

  // Calculate distance
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get booking status for a staff member
  const getBookingStatus = (staffId: string): string | null => {
    const request = bookingRequests.find(req => req.staffId === staffId);
    return request ? request.status : null;
  };

  // Check if staff is available in date range
  const isAvailableInDateRange = (staff: StaffProfile, dateFrom: string, dateTo: string): boolean => {
    if (!dateFrom && !dateTo) return true; // No date filter = show all

    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : fromDate; // If only from date, check that single day

    if (!fromDate) return true;

    // Check each date in the range
    const currentDate = new Date(fromDate);
    while (currentDate <= toDate!) {
      const dateStr = currentDate.toISOString().split('T')[0];

      // If any date in range is unavailable, staff is not available
      if (staff.availability?.unavailableDates?.includes(dateStr)) {
        return false;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // If availableDates exists and has entries, check if any date in range is explicitly available
    if (staff.availability?.availableDates && staff.availability.availableDates.length > 0) {
      const rangeDate = new Date(fromDate);
      while (rangeDate <= toDate!) {
        const dateStr = rangeDate.toISOString().split('T')[0];
        if (staff.availability.availableDates.some(avail => avail.date === dateStr)) {
          return true;
        }
        rangeDate.setDate(rangeDate.getDate() + 1);
      }
      return false;
    }

    // If no availableDates specified, assume available unless in unavailableDates
    return true;
  };

  // Filter and sort staff
  const filteredStaff = staffProfiles
    .filter((staff) => {
      // Enhanced keyword search across multiple fields
      const matchesSearch =
        searchQuery === '' ||
        // Basic info
        `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.currentTrust?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.currentDepartment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.band.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // Equipment competencies
        staff.competencies?.equipment?.some(eq =>
          eq.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          eq.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          eq.type.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        // Procedure competencies
        staff.competencies?.procedures?.some(proc =>
          proc.procedureName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          proc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        // Surgical system competencies
        staff.competencies?.surgicalSystems?.some(sys =>
          sys.systemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sys.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sys.specialty.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        // Preferred specialties
        staff.availability?.preferredSpecialties?.some(spec =>
          spec.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesRole = filterRole === 'all' || staff.role === filterRole;
      const matchesSpecialty = filterSpecialty === 'all' ||
        staff.availability?.preferredSpecialties?.includes(filterSpecialty);
      const matchesDateRange = isAvailableInDateRange(staff, filterDateFrom, filterDateTo);
      const bookingStatus = getBookingStatus(staff.id);
      const matchesBookingStatus = filterBookingStatus === 'all' || bookingStatus === filterBookingStatus;
      return matchesSearch && matchesRole && matchesSpecialty && matchesDateRange && matchesBookingStatus && staff.isActive;
    })
    .map((staff) => {
      if (userLocation && staff.location?.coordinates) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          staff.location.coordinates.lat,
          staff.location.coordinates.lng
        );
        return { ...staff, distance };
      }
      return staff;
    })
    .sort((a, b) => {
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return (b.performance?.rating || 0) - (a.performance?.rating || 0);
    });

  const uniqueRoles = Array.from(new Set(staffProfiles.map((s) => s.role)));
  const allSpecialties = Array.from(new Set(staffProfiles.flatMap((s) => s.availability?.preferredSpecialties || [])));

  // Handle staff selection
  const handleStaffSelect = (staff: StaffProfile) => {
    setSelectedStaff(staff);
    setDrawerOpen(true);
  };

  return (
    <div className="h-full w-full flex bg-gray-50 overflow-hidden">
      {/* Navigation Sidebar */}
      <div className="w-64 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-white/20">
          <h1 className="text-xl font-bold">Live Search</h1>
          <p className="text-sm text-teal-50 mt-1">Find Available Staff</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveSection('directory')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeSection === 'directory' ? 'bg-white/20 text-white shadow-lg' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Staff Directory</span>
          </button>

          <button
            onClick={() => setActiveSection('allocation')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeSection === 'allocation' ? 'bg-white/20 text-white shadow-lg' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Award className="w-5 h-5" />
            <span className="font-medium">Create Allocation</span>
          </button>

          <button
            onClick={() => setActiveSection('requests')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeSection === 'requests' ? 'bg-white/20 text-white shadow-lg' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <div className="flex-1 text-left">
              <span className="font-medium">Booking Requests</span>
              {bookingRequests.filter(r => r.status === 'pending').length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-gray-900 text-xs rounded-full font-semibold">
                  {bookingRequests.filter(r => r.status === 'pending').length}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => setActiveSection('active')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeSection === 'active' ? 'bg-white/20 text-white shadow-lg' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Active Allocations</span>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      {activeSection === 'directory' && (
        <div className="flex-1 flex bg-gray-50">
          {/* Left Sidebar - Filters & Search */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, role, equipment, procedures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          {!userLocation && (
            <button
              onClick={requestLocation}
              className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all text-sm font-medium flex items-center justify-center shadow-md"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Enable Location
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Date Range
              </label>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">From</label>
                  <input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">To</label>
                  <input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    min={filterDateFrom}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              {(filterDateFrom || filterDateTo) && (
                <button
                  onClick={() => {
                    setFilterDateFrom('');
                    setFilterDateTo('');
                  }}
                  className="mt-2 text-xs text-gray-600 hover:text-teal-600 underline"
                >
                  Clear date range
                </button>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Specialty</label>
              <select
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Specialties</option>
                {allSpecialties.map((specialty) => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Booking Status</label>
              <select
                value={filterBookingStatus}
                onChange={(e) => setFilterBookingStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">⏳ Pending</option>
                <option value="accepted">✅ Accepted</option>
                <option value="declined">❌ Declined</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 border-b border-gray-200">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-700">{filteredStaff.length}</div>
            <div className="text-xs text-green-600 font-medium">Available Staff</div>
          </div>
        </div>

        {/* Staff List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                <p className="mt-2 text-sm text-gray-600">Loading...</p>
              </div>
            </div>
          ) : staffProfiles.length === 0 ? (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-gray-900 mb-1">No Staff Data</h3>
                <p className="text-xs text-gray-600 mb-3">Add staff to get started</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg text-xs font-medium hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md"
                >
                  Reload
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredStaff.map((person) => (
                <button
                  key={person.id}
                  onClick={() => handleStaffSelect(person)}
                  className={`w-full p-3 hover:bg-gray-50 transition-colors text-left ${
                    selectedStaff?.id === person.id ? 'bg-blue-50 hover:bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {person.firstName[0]}{person.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {person.firstName} {person.lastName}
                          </p>
                          <p className="text-xs text-gray-600 truncate">{person.role} • {person.band}</p>
                          {person.currentTrust && (
                            <p className="text-xs text-teal-600 truncate flex items-center mt-0.5 font-medium">
                              <Briefcase className="w-3 h-3 mr-1" />
                              {person.currentTrust}
                            </p>
                          )}
                        </div>
                        {person.performance?.rating && (
                          <div className="ml-2 flex items-center text-xs text-yellow-600 flex-shrink-0">
                            <Star className="w-3 h-3 fill-current mr-0.5" />
                            {person.performance.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                      {person.distance !== undefined && (
                        <p className="text-xs text-blue-600 font-medium mt-1">
                          {person.distance.toFixed(1)} miles away
                        </p>
                      )}
                      {/* Booking Status Badge */}
                      {getBookingStatus(person.id) && (
                        <div className="mt-1.5">
                          {getBookingStatus(person.id) === 'pending' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              ⏳ Pending Request
                            </span>
                          )}
                          {getBookingStatus(person.id) === 'accepted' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              ✅ Accepted
                            </span>
                          )}
                          {getBookingStatus(person.id) === 'declined' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              ❌ Declined
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Middle - Map */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              <p className="mt-4 text-gray-600">Finding theatre professionals...</p>
            </div>
          </div>
        ) : staffProfiles.length === 0 ? (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md px-4">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Staff Data</h3>
              <p className="text-gray-600">No staff profiles in the system</p>
            </div>
          </div>
        ) : (
          <MapView
            staff={filteredStaff.map(s => ({ ...s, bookingStatus: getBookingStatus(s.id) }))}
            userLocation={userLocation}
            selectedStaff={selectedStaff}
            onSelectStaff={handleStaffSelect}
          />
        )}
      </div>

          {/* Right Sidebar - Staff Details */}
          {selectedStaff && (
            <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                <h2 className="text-lg font-bold text-gray-900 pr-8">Staff Details</h2>
              </div>
              <StaffProfileDrawer
                staff={selectedStaff}
                onClose={() => setSelectedStaff(null)}
                onViewFullProfile={() => setShowFullProfile(true)}
              />
            </div>
          )}
        </div>
      )}

    {/* Create Allocation Section */}
    {activeSection === 'allocation' && (
        <div className="flex-1 bg-white">
          <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Allocation</h2>
              <p className="text-gray-600">Create shift allocations manually or import from HealthRoster</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Manual Allocation */}
              <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-teal-500 hover:shadow-lg transition-all cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Manual Allocation</h3>
                <p className="text-gray-600 mb-4">Create individual shift allocations for specific staff members</p>
                <button className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md">
                  Create Manual Allocation
                </button>
              </div>

              {/* Import from HealthRoster */}
              <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Import from HealthRoster</h3>
                <p className="text-gray-600 mb-4">Upload shift data from HealthRoster CSV or connect via API</p>
                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md">
                  Import Roster Data
                </button>
              </div>
            </div>

            {/* Recent Allocations */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Allocations</h3>
              <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
                No allocations created yet
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Requests Section */}
      {activeSection === 'requests' && (
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="max-w-6xl mx-auto p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Requests</h2>
              <p className="text-gray-600">Manage staff booking requests and allocations</p>
            </div>

            {/* Tabs for different request statuses */}
            <div className="flex space-x-4 mb-6 border-b border-gray-200">
              <button className="px-4 py-3 font-semibold text-yellow-600 border-b-2 border-yellow-600">
                Pending ({bookingRequests.filter(r => r.status === 'pending').length})
              </button>
              <button className="px-4 py-3 font-semibold text-gray-500 hover:text-gray-700">
                Accepted ({bookingRequests.filter(r => r.status === 'accepted').length})
              </button>
              <button className="px-4 py-3 font-semibold text-gray-500 hover:text-gray-700">
                Declined ({bookingRequests.filter(r => r.status === 'declined').length})
              </button>
            </div>

            {/* Request List */}
            <div className="space-y-4">
              {bookingRequests.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
                  No booking requests yet
                </div>
              ) : (
                bookingRequests.map((request, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">Request #{idx + 1}</h4>
                        <p className="text-sm text-gray-600">Staff ID: {request.staffId}</p>
                        <p className="text-sm text-gray-600">Date: {request.date}</p>
                      </div>
                      <div>
                        {request.status === 'pending' && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                            ⏳ Pending
                          </span>
                        )}
                        {request.status === 'accepted' && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            ✅ Accepted
                          </span>
                        )}
                        {request.status === 'declined' && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                            ❌ Declined
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Allocations Section */}
      {activeSection === 'active' && (
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="max-w-6xl mx-auto p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Active Allocations</h2>
              <p className="text-gray-600">View and manage currently scheduled staff allocations</p>
            </div>

            {/* Calendar view or list view */}
            <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
              No active allocations
            </div>
          </div>
        </div>
      )}

      {/* Full Profile Modal */}
      {showFullProfile && selectedStaff && (
        <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Full Staff Profile</h2>
              <button
                onClick={() => setShowFullProfile(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8">
              <FullStaffProfile staff={selectedStaff} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// LinkedIn-Style Feed View
function LinkedInFeedView({
  staff,
  onSelectStaff,
}: {
  staff: (StaffProfile & { distance?: number })[];
  onSelectStaff: (staff: StaffProfile) => void;
}) {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 pt-40 pb-6">
      <div className="max-w-2xl mx-auto px-4 space-y-4">
        {staff.map((person) => (
          <div
            key={person.id}
            onClick={() => onSelectStaff(person)}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
          >
            {/* Cover Photo */}
            <div className="h-24 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500"></div>

            {/* Profile Content */}
            <div className="px-6 pb-6">
              {/* Profile Photo */}
              <div className="flex items-start -mt-12 mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-3xl shadow-xl border-4 border-white">
                    {person.firstName?.[0] || ''}
                    {person.lastName?.[0] || ''}
                  </div>
                  {person.isActive && (
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                  )}
                </div>

                <div className="flex-1"></div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 mt-14">
                  {person.distance !== undefined && (
                    <div className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 rounded-full">
                      <MapPinned className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{person.distance.toFixed(1)} km</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {person.firstName || ''} {person.lastName || ''}
                  </h2>
                  {person.verified && (
                    <Shield className="w-5 h-5 text-blue-500 fill-current" />
                  )}
                </div>
                <p className="text-lg text-gray-700 font-medium mb-1">{person.role}</p>
                <p className="text-gray-600">{person.currentTrust} • {person.currentDepartment}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 mb-4 pb-4 border-b border-gray-100">
                <div className="text-center">
                  <div className="flex items-center space-x-1 text-amber-500 mb-1">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-xl font-bold text-gray-900">
                      {person.performance?.rating?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{person.performance?.completedShifts || 0}</p>
                  <p className="text-xs text-gray-600">Shifts</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{person.yearsExperience}</p>
                  <p className="text-xs text-gray-600">Years</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{person.band}</p>
                  <p className="text-xs text-gray-600">Band</p>
                </div>
              </div>

              {/* Skills */}
              {person.availability?.preferredSpecialties && person.availability.preferredSpecialties.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {person.availability.preferredSpecialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                  Request Staff Share
                </button>
                <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {staff.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No staff found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Staff Profile Drawer - Preview Version
function StaffProfileDrawer({
  staff,
  onClose,
  onViewFullProfile,
}: {
  staff: StaffProfile;
  onClose: () => void;
  onViewFullProfile: () => void;
}) {
  return (
    <div className="px-6 pb-8">
      {/* Quick Info Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {staff.firstName?.[0] || ''}
              {staff.lastName?.[0] || ''}
            </div>
            {staff.isActive && (
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-3 border-white"></div>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900">
                {staff.firstName || ''} {staff.lastName || ''}
              </h3>
              {staff.verified && (
                <Shield className="w-5 h-5 text-blue-500 fill-current" />
              )}
            </div>
            <p className="text-gray-700 font-medium">{staff.role}</p>
            <p className="text-sm text-gray-600">{staff.currentTrust}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-center space-x-1 text-amber-500 mb-1">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-lg font-bold text-gray-900">
              {staff.performance?.rating?.toFixed(1) || 'N/A'}
            </span>
          </div>
          <p className="text-xs text-gray-600">Rating</p>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <p className="text-lg font-bold text-gray-900">{staff.performance?.completedShifts || 0}</p>
          <p className="text-xs text-gray-600">Shifts</p>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <p className="text-lg font-bold text-gray-900">{staff.yearsExperience}</p>
          <p className="text-xs text-gray-600">Years</p>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <p className="text-lg font-bold text-gray-900">{staff.band}</p>
          <p className="text-xs text-gray-600">Band</p>
        </div>
      </div>

      {/* About */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">About</h4>
        <p className="text-gray-700 leading-relaxed">
          {staff.role} with {staff.yearsExperience} years of experience in theatre nursing.
          Currently working at {staff.currentTrust} in {staff.currentDepartment}.
          Specializing in{' '}
          {staff.availability?.preferredSpecialties?.slice(0, 3).join(', ') || 'multiple specialties'}.
        </p>
      </div>

      {/* Specialties */}
      {staff.availability?.preferredSpecialties && staff.availability.preferredSpecialties.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Specialties</h4>
          <div className="flex flex-wrap gap-2">
            {staff.availability.preferredSpecialties.map((specialty, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      {staff.availability && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Availability
          </h4>

          {/* Preferred Shifts */}
          {staff.availability.preferredShifts && staff.availability.preferredShifts.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Preferred Shifts</p>
              <div className="flex flex-wrap gap-2">
                {staff.availability.preferredShifts.map((shift, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium capitalize"
                  >
                    {shift.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Available Dates */}
          {staff.availability.availableDates && staff.availability.availableDates.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Upcoming Available Dates</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {staff.availability.availableDates
                  .filter(avail => new Date(avail.date) >= new Date())
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 10)
                  .map((avail, idx) => (
                    <div key={idx} className="p-2.5 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(avail.date).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {avail.shiftType.map((shift, sidx) => (
                          <span
                            key={sidx}
                            className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium capitalize"
                          >
                            {shift.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                      {avail.notes && (
                        <p className="text-xs text-gray-600 mt-1.5">{avail.notes}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Unavailable Dates */}
          {staff.availability.unavailableDates && staff.availability.unavailableDates.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Unavailable Dates</p>
              <div className="flex flex-wrap gap-2">
                {staff.availability.unavailableDates
                  .filter(date => new Date(date) >= new Date())
                  .sort()
                  .slice(0, 5)
                  .map((date, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium"
                    >
                      {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Preferred Radius</p>
              <p className="text-sm font-semibold text-gray-900">{staff.availability.preferredRadius} miles</p>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Min Rate</p>
              <p className="text-sm font-semibold text-gray-900">£{staff.availability.minHourlyRate}/hr</p>
            </div>
          </div>
        </div>
      )}

      {/* Compliance */}
      {staff.compliance && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Credentials</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {staff.compliance.professionalRegistration?.body} Registration
                  </p>
                  <p className="text-xs text-gray-600">
                    {staff.compliance.professionalRegistration?.registrationNumber}
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-green-700 uppercase">Verified</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">DBS Check</p>
                  <p className="text-xs text-gray-600">Enhanced clearance</p>
                </div>
              </div>
              <span className="text-xs font-medium text-green-700 uppercase">Valid</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg flex items-center justify-center">
          <Briefcase className="w-5 h-5 mr-2" />
          Request to Book
        </button>
        <button className="w-full py-3.5 border-2 border-teal-300 text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-all flex items-center justify-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Send Message
        </button>
        <button
          onClick={onViewFullProfile}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md flex items-center justify-center"
        >
          <User className="w-5 h-5 mr-2" />
          View Full Profile
        </button>
      </div>
    </div>
  );
}

// Full Staff Profile Component - Comprehensive LinkedIn-Style View
function FullStaffProfile({ staff }: { staff: StaffProfile }) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['about', 'competencies', 'compliance']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 rounded-2xl p-8 text-white">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white shadow-2xl">
              {staff.firstName?.[0] || ''}{staff.lastName?.[0] || ''}
            </div>
            {staff.isActive && (
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white"></div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-4xl font-bold">{staff.firstName} {staff.lastName}</h1>
              {staff.verified && (
                <Shield className="w-8 h-8 fill-current" />
              )}
            </div>
            <p className="text-2xl text-white/90 mb-2">{staff.role}</p>
            <p className="text-lg text-white/80">{staff.currentTrust} • {staff.currentDepartment}</p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 fill-current" />
                <span className="text-2xl font-bold">{staff.performance?.rating?.toFixed(1) || 'N/A'}</span>
              </div>
              <div className="text-white/90">
                <span className="text-xl font-semibold">{staff.performance?.completedShifts || 0}</span> shifts completed
              </div>
              <div className="text-white/90">
                <span className="text-xl font-semibold">{staff.yearsExperience}</span> years experience
              </div>
              <div className="px-4 py-2 bg-white/20 rounded-full">
                <span className="font-semibold">{staff.band}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <button
          onClick={() => toggleSection('about')}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-2xl"
        >
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-bold text-gray-900">About</h2>
          </div>
          {expandedSections.includes('about') ? (
            <ChevronDown className="w-6 h-6 text-gray-400" />
          ) : (
            <ChevronRight className="w-6 h-6 text-gray-400" />
          )}
        </button>
        {expandedSections.includes('about') && (
          <div className="px-6 pb-6 space-y-4">
            <p className="text-gray-700 leading-relaxed text-lg">
              {staff.role} with {staff.yearsExperience} years of comprehensive theatre nursing experience.
              Currently working at {staff.currentTrust} in {staff.currentDepartment}.
              Specializing in {staff.availability?.preferredSpecialties?.slice(0, 3).join(', ') || 'multiple specialties'}.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-teal-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  <p className="text-sm font-semibold text-gray-700">Location</p>
                </div>
                <p className="text-gray-900">{staff.location?.address}</p>
                <p className="text-sm text-gray-600">{staff.location?.postcode}</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Briefcase className="w-5 h-5 text-cyan-600" />
                  <p className="text-sm font-semibold text-gray-700">Employment Type</p>
                </div>
                <p className="text-gray-900 capitalize">{staff.employmentType}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Skills & Competencies Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <button
          onClick={() => toggleSection('competencies')}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Award className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-bold text-gray-900">Skills & Competencies</h2>
          </div>
          {expandedSections.includes('competencies') ? (
            <ChevronDown className="w-6 h-6 text-gray-400" />
          ) : (
            <ChevronRight className="w-6 h-6 text-gray-400" />
          )}
        </button>
        {expandedSections.includes('competencies') && (
          <div className="px-6 pb-6">
            {/* Procedures */}
            {staff.competencies?.procedures && staff.competencies.procedures.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Surgical Procedures</h3>
                <div className="space-y-3">
                  {staff.competencies.procedures.slice(0, 10).map((proc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{proc.procedureName}</p>
                        <p className="text-sm text-gray-600">{proc.specialty}</p>
                        {proc.verifiedByName && (
                          <p className="text-xs text-teal-600 mt-1">✓ Verified by {proc.verifiedByName}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-700 capitalize">{proc.level}</p>
                          <p className="text-xs text-gray-500">{proc.timesPerformed} times</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          proc.level === 'expert' ? 'bg-green-100 text-green-700' :
                          proc.level === 'proficient' ? 'bg-blue-100 text-blue-700' :
                          proc.level === 'competent' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {proc.level}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferred Specialties */}
            {staff.availability?.preferredSpecialties && staff.availability.preferredSpecialties.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {staff.availability.preferredSpecialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 rounded-lg text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compliance & Credentials */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <button
          onClick={() => toggleSection('compliance')}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-bold text-gray-900">Compliance & Credentials</h2>
          </div>
          {expandedSections.includes('compliance') ? (
            <ChevronDown className="w-6 h-6 text-gray-400" />
          ) : (
            <ChevronRight className="w-6 h-6 text-gray-400" />
          )}
        </button>
        {expandedSections.includes('compliance') && staff.compliance && (
          <div className="px-6 pb-6 space-y-4">
            {/* Professional Registration */}
            {staff.compliance.professionalRegistration && (
              <div className="p-5 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {staff.compliance.professionalRegistration.body} Registration
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {staff.compliance.professionalRegistration.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-700">
                  Registration Number: <span className="font-semibold">{staff.compliance.professionalRegistration.registrationNumber}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Expires: {new Date(staff.compliance.professionalRegistration.expiryDate).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* DBS Check */}
            {staff.compliance.dbs && (
              <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">DBS Check</h3>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {staff.compliance.dbs.status.toUpperCase()}
                  </span>
                </div>
                {staff.compliance.dbs.certificateNumber && (
                  <p className="text-gray-700 mb-1">
                    Certificate: <span className="font-semibold">{staff.compliance.dbs.certificateNumber}</span>
                  </p>
                )}
                {staff.compliance.dbs.updateService && (
                  <p className="text-sm text-blue-600 mt-1">✓ DBS Update Service Active</p>
                )}
              </div>
            )}

            {/* Mandatory Training */}
            {staff.compliance.mandatoryTraining && staff.compliance.mandatoryTraining.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mandatory Training</h3>
                <div className="grid grid-cols-2 gap-3">
                  {staff.compliance.mandatoryTraining.map((training, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${
                      training.completed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-gray-900 text-sm">{training.name}</p>
                        {training.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 capitalize mb-1">{training.category}</p>
                      {training.expiryDate && (
                        <p className="text-xs text-gray-500">
                          Expires: {new Date(training.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Performance & Reviews */}
      {staff.performance && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <button
            onClick={() => toggleSection('performance')}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-900">Performance & Reviews</h2>
            </div>
            {expandedSections.includes('performance') ? (
              <ChevronDown className="w-6 h-6 text-gray-400" />
            ) : (
              <ChevronRight className="w-6 h-6 text-gray-400" />
            )}
          </button>
          {expandedSections.includes('performance') && (
            <div className="px-6 pb-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <div className="flex items-center justify-center space-x-1 text-amber-500 mb-2">
                    <Star className="w-6 h-6 fill-current" />
                    <span className="text-3xl font-bold text-gray-900">{staff.performance.rating?.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-gray-600">Overall Rating</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-3xl font-bold text-gray-900">{staff.performance.completedShifts}</p>
                  <p className="text-sm text-gray-600">Completed Shifts</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-3xl font-bold text-gray-900">{staff.performance.totalShifts}</p>
                  <p className="text-sm text-gray-600">Total Shifts</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <p className="text-3xl font-bold text-gray-900">{staff.performance.cancelledShifts || 0}</p>
                  <p className="text-sm text-gray-600">Cancelled</p>
                </div>
              </div>

              {/* Reviews */}
              {staff.performance.reviews && staff.performance.reviews.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
                  {staff.performance.reviews.slice(0, 5).map((review, idx) => (
                    <div key={idx} className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{review.fromUserName}</p>
                          <p className="text-sm text-gray-600 capitalize">{review.fromUserType}</p>
                        </div>
                        <div className="flex items-center space-x-1 text-amber-500">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="font-bold text-gray-900">{review.rating}</span>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-3">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Endorsements */}
              {staff.performance.endorsements && staff.performance.endorsements.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Endorsements</h3>
                  <div className="space-y-3">
                    {staff.performance.endorsements.slice(0, 5).map((endorsement, idx) => (
                      <div key={idx} className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{endorsement.fromStaffName}</p>
                            <p className="text-sm text-gray-600">{endorsement.fromStaffRole}</p>
                          </div>
                          <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                            {endorsement.competencyType}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-teal-700 mb-1">{endorsement.competencyName}</p>
                        <p className="text-gray-700">{endorsement.comment}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(endorsement.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
