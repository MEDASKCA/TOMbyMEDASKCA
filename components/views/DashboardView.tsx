'use client';

import React, { useState } from 'react';
import {
  Activity,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  Package,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Coffee,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import TheatreTimelineModal from './TheatreTimelineModal';
import StaffReliefModal from './StaffReliefModal';
import StaffHoverCard from './StaffHoverCard';
import StaffCompetencyModal from './StaffCompetencyModal';
import { Bell } from 'lucide-react';

export default function DashboardView() {
  const [selectedTheatre, setSelectedTheatre] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showReliefModal, setShowReliefModal] = useState(false);
  const [selectedStaffForRelief, setSelectedStaffForRelief] = useState<any>(null);
  const [hoveredStaff, setHoveredStaff] = useState<any>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [showCompetencyModal, setShowCompetencyModal] = useState(false);
  const [selectedStaffForCompetency, setSelectedStaffForCompetency] = useState<any>(null);

  const handleTheatreClick = (theatreName: string) => {
    setSelectedTheatre(theatreName);
    setShowTimeline(true);
  };

  const handleReliefRequest = (staffName: string, role: string, theatre: string) => {
    setSelectedStaffForRelief({ name: staffName, role, theatre });
    setShowReliefModal(true);
  };

  const handleStaffHover = (event: React.MouseEvent, staffName: string, role: string) => {
    setHoveredStaff({ name: staffName, role, id: staffName });
    setHoverPosition({ x: event.clientX, y: event.clientY });
  };

  const handleStaffClick = (staffName: string, role: string, theatre: string) => {
    setSelectedStaffForCompetency({ name: staffName, role, theatre });
    setShowCompetencyModal(true);
  };

  const theatreAllocations = [
    {
      theatre: 'Theatre 1 - Ortho',
      status: 'active',
      team: {
        surgeon: 'J. Smith',
        assistant: 'A. Gallagher',
        anaesthetist: 'F. James ☕',
        anaesNP: 'L. O\'Brien',
        scrubNP1: 'A. Flores',
        scrubNP2: 'D. Jordan',
        hca: 'T. Chikukwe'
      },
      alerts: 'F. James on break (15 min)'
    },
    {
      theatre: 'Theatre 2 - General',
      status: 'closed',
      team: {
        surgeon: 'VACANT',
        assistant: 'VACANT',
        anaesthetist: 'VACANT',
        anaesNP: 'VACANT',
        scrubNP1: 'VACANT',
        scrubNP2: 'VACANT',
        hca: 'VACANT'
      },
      alerts: 'THEATRE CLOSED - Unpopulated list, no cases scheduled',
      closureReason: 'No surgical cases booked for today'
    },
    {
      theatre: 'Theatre 3 - Cardio',
      status: 'active',
      team: {
        surgeon: 'R. Johnson',
        assistant: 'T. Wilson',
        anaesthetist: 'B. Thompson',
        anaesNP: 'H. Adams',
        scrubNP1: 'M. Garcia ☕',
        scrubNP2: 'L. Brown',
        scrubNP3: 'K. White',
        hca: 'S. Ali'
      },
      alerts: 'M. Garcia break overdue'
    },
    {
      theatre: 'Theatre 4 - Neuro',
      status: 'active',
      team: {
        surgeon: 'A. Robertson',
        assistant: 'C. Lewis',
        anaesthetist: 'D. Mitchell',
        anaesNP: 'E. Cooper',
        scrubNP1: 'F. Harrison',
        scrubNP2: 'G. Walker',
        hca: 'H. Green'
      }
    },
    {
      theatre: 'Theatre 5 - Emergency',
      status: 'standby',
      team: {
        surgeon: 'I. Moore',
        assistant: 'J. Clark',
        anaesthetist: 'K. Baker ☕',
        anaesNP: 'L. Hill',
        scrubNP1: 'M. Scott',
        scrubNP2: 'N. Young',
        hca: 'O. King'
      }
    },
    {
      theatre: 'Theatre 6 - Ophthalmology',
      status: 'active',
      team: {
        surgeon: 'P. Wright',
        assistant: 'Q. Turner',
        anaesthetist: 'R. Phillips',
        anaesNP: 'S. Campbell',
        scrubNP1: 'T. Parker',
        scrubNP2: 'U. Evans'
      }
    },
    {
      theatre: 'Theatre 7 - ENT',
      status: 'active',
      team: {
        surgeon: 'V. Edwards',
        assistant: 'W. Collins',
        anaesthetist: 'X. Morris',
        anaesNP: 'Y. Rogers',
        scrubNP1: 'Z. Reed ⚠️',
        scrubNP2: 'A. Cook'
      },
      alerts: 'Z. Reed break overdue'
    },
    {
      theatre: 'Theatre 8 - Gynae',
      status: 'active',
      team: {
        surgeon: 'B. Morgan',
        assistant: 'C. Bell',
        anaesthetist: 'D. Murphy',
        anaesNP: 'E. Bailey',
        scrubNP1: 'F. Rivera',
        scrubNP2: 'G. Cooper',
        hca: 'H. Ward'
      }
    },
    {
      theatre: 'Theatre 9 - Urology',
      status: 'closed',
      team: {
        surgeon: 'I. Torres',
        assistant: 'VACANT',
        anaesthetist: 'K. Gray',
        anaesNP: 'VACANT',
        scrubNP1: 'VACANT',
        scrubNP2: 'VACANT'
      },
      alerts: 'THEATRE CLOSED - Critical equipment failure & staff shortage',
      closureReason: 'Laser system malfunction, insufficient scrub staff coverage'
    },
    {
      theatre: 'Theatre 10 - Plastics',
      status: 'active',
      team: {
        surgeon: 'O. Brooks',
        assistant: 'P. Kelly',
        anaesthetist: 'Q. Sanders',
        anaesNP: 'R. Price',
        scrubNP1: 'S. Bennett',
        scrubNP2: 'T. Wood',
        scrubNP3: 'U. Barnes'
      }
    },
    {
      theatre: 'Theatre 11 - Vascular',
      status: 'active',
      team: {
        surgeon: 'V. Ross',
        assistant: 'W. Henderson',
        anaesthetist: 'X. Coleman ☕',
        anaesNP: 'Y. Jenkins',
        anaesNP2: 'Z. Perry',
        scrubNP1: 'A. Powell',
        scrubNP2: 'B. Long'
      }
    },
    {
      theatre: 'Theatre 12 - Thoracic',
      status: 'active',
      team: {
        surgeon: 'C. Patterson',
        assistant: 'D. Hughes',
        anaesthetist: 'E. Flores',
        anaesNP: 'F. Washington',
        scrubNP1: 'G. Butler',
        scrubNP2: 'H. Simmons'
      }
    },
    {
      theatre: 'Theatre 13 - Paeds',
      status: 'active',
      team: {
        surgeon: 'I. Foster',
        assistant: 'J. Gonzales',
        anaesthetist: 'K. Bryant',
        anaesNP: 'L. Alexander',
        scrubNP1: 'M. Russell',
        scrubNP2: 'N. Griffin',
        hca: 'O. Diaz'
      }
    },
    {
      theatre: 'Theatre 14 - Dental',
      status: 'standby',
      team: {
        surgeon: 'P. Hayes',
        assistant: 'Q. Myers',
        anaesthetist: 'R. Ford',
        anaesNP: 'S. Hamilton',
        scrubNP1: 'T. Graham'
      }
    },
    {
      theatre: 'Theatre 15 - Maxfax',
      status: 'active',
      team: {
        surgeon: 'U. Sullivan',
        assistant: 'V. Pierce',
        anaesthetist: 'W. Jordan',
        anaesNP: 'X. Owens',
        scrubNP1: 'Y. Reynolds ⚠️',
        scrubNP2: 'Z. Fisher'
      },
      alerts: 'Y. Reynolds delayed'
    },
    {
      theatre: 'Theatre 16 - Colorectal',
      status: 'active',
      team: {
        surgeon: 'A. Ellis',
        assistant: 'B. Stevens',
        anaesthetist: 'C. Chapman',
        anaesNP: 'D. Payne',
        scrubNP1: 'E. Hunter',
        scrubNP2: 'F. Lawson',
        scrubNP3: 'G. Berry'
      }
    },
    {
      theatre: 'Theatre 17 - Hepatobiliary',
      status: 'active',
      team: {
        surgeon: 'H. Arnold',
        assistant: 'I. Willis',
        anaesthetist: 'J. Ray',
        anaesNP: 'K. Burns',
        anaesNP2: 'L. Stanley',
        scrubNP1: 'M. Webb',
        scrubNP2: 'N. Tucker'
      }
    },
    {
      theatre: 'Theatre 18 - Transplant',
      status: 'standby',
      team: {
        surgeon: 'O. Porter',
        assistant: 'P. Hunter',
        anaesthetist: 'Q. Holmes',
        anaesNP: 'R. Rice',
        scrubNP1: 'S. Black',
        scrubNP2: 'T. Mills',
        scrubNP3: 'U. Grant',
        hca: 'V. West'
      }
    },
    {
      theatre: 'Theatre 19 - Robotics',
      status: 'active',
      team: {
        surgeon: 'W. Stone',
        assistant: 'X. Hicks',
        anaesthetist: 'Y. Crawford',
        anaesNP: 'Z. Reyes',
        scrubNP1: 'A. Little',
        scrubNP2: 'B. Fowler',
        techSpec: 'C. Sharp'
      }
    },
    {
      theatre: 'Theatre 20 - Hybrid',
      status: 'active',
      team: {
        surgeon: 'D. Wells',
        assistant: 'E. Shaw',
        anaesthetist: 'F. Ramos',
        anaesNP: 'G. Holland',
        scrubNP1: 'H. Newman ☕',
        scrubNP2: 'I. Barrett'
      },
      alerts: 'H. Newman on break'
    },
    {
      theatre: 'Theatre 21 - Spine',
      status: 'active',
      team: {
        surgeon: 'J. Murray',
        assistant: 'K. Freeman',
        anaesthetist: 'L. Wells',
        anaesNP: 'M. Castillo',
        scrubNP1: 'N. Webb',
        scrubNP2: 'O. Duncan',
        scrubNP3: 'P. Graves'
      }
    },
    {
      theatre: 'Theatre 22 - Hand',
      status: 'active',
      team: {
        surgeon: 'Q. Lynch',
        assistant: 'R. Lawson',
        anaesthetist: 'S. Simpson',
        anaesNP: 'T. Kim',
        scrubNP1: 'U. Mendoza',
        scrubNP2: 'V. Burke'
      }
    },
    {
      theatre: 'Theatre 23 - Breast',
      status: 'active',
      team: {
        surgeon: 'W. Hart',
        assistant: 'X. Cunningham',
        anaesthetist: 'Y. Bradley',
        anaesNP: 'Z. Andrews',
        scrubNP1: 'A. Stephens',
        scrubNP2: 'B. Moreno'
      }
    },
    {
      theatre: 'Theatre 24 - Bariatric',
      status: 'delayed',
      team: {
        surgeon: 'C. Knight',
        assistant: 'D. Lawrence',
        anaesthetist: 'E. Vargas',
        anaesNP: 'F. Austin',
        anaesNP2: 'G. Peters',
        scrubNP1: 'H. Hawkins',
        scrubNP2: 'I. Fields'
      },
      alerts: 'Awaiting special equipment'
    },
    {
      theatre: 'Theatre 25 - Day Surgery',
      status: 'active',
      team: {
        surgeon: 'J. Weaver',
        assistant: 'K. Mason',
        anaesthetist: 'L. Dixon ⚠️',
        anaesNP: 'M. Hunt',
        scrubNP1: 'N. Gibson',
        scrubNP2: 'O. Marshall'
      },
      alerts: 'L. Dixon break overdue'
    },
    {
      theatre: 'Theatre 26 - Endoscopy',
      status: 'active',
      team: {
        surgeon: 'P. Wagner',
        assistant: 'Q. Pearson',
        anaesthetist: 'R. Kelley',
        anaesNP: 'S. Dunn',
        scrubNP1: 'T. Oliver',
        scrubNP2: 'U. Silva'
      }
    }
  ];

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Operations Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Real-time theatre management and monitoring</p>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Live</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">24/26</h3>
          <p className="text-sm text-gray-600">Theatres Operational</p>
          <p className="text-xs text-orange-600 mt-2">2 theatres closed</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-green-600" />
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Optimal</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">156</h3>
          <p className="text-sm text-gray-600">Staff On Duty</p>
          <p className="text-xs text-orange-600 mt-2">7 on break</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-purple-600" />
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">On Track</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">18 min</h3>
          <p className="text-sm text-gray-600">Avg Turnover Time</p>
          <p className="text-xs text-green-600 mt-2">↓ 5 min vs target</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-orange-600" />
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">High</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">94%</h3>
          <p className="text-sm text-gray-600">Efficiency Score</p>
          <p className="text-xs text-green-600 mt-2">↑ 3% from yesterday</p>
        </div>
      </div>

      {/* Theatre Team Allocations - Full Width */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
          <span className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Theatre Team Allocations - All 26 Theatres
          </span>
          <span className="text-xs font-normal text-gray-500">
            {theatreAllocations.filter(t => t.status === 'active').length} Active |
            {' '}{theatreAllocations.filter(t => t.status === 'delayed').length} Delayed |
            {' '}{theatreAllocations.filter(t => t.status === 'standby').length} Standby |
            {' '}{theatreAllocations.filter(t => t.status === 'closed').length} Closed
          </span>
        </h2>
        <div className="max-h-[600px] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
            {theatreAllocations.map((allocation, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg transition-colors cursor-pointer group border ${
                  allocation.status === 'closed'
                    ? 'bg-gray-100 border-gray-400 opacity-75'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => handleTheatreClick(allocation.theatre)}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm flex items-center">
                    {allocation.theatre}
                    <ChevronRight className="w-4 h-4 ml-1 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    allocation.status === 'active' ? 'bg-green-100 text-green-700' :
                    allocation.status === 'delayed' ? 'bg-orange-100 text-orange-700' :
                    allocation.status === 'standby' ? 'bg-yellow-100 text-yellow-700' :
                    allocation.status === 'closed' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {allocation.status === 'closed' ? 'CLOSED' : allocation.status}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  {Object.entries({
                    'Consultant': { name: allocation.team.surgeon, role: 'Consultant Surgeon' },
                    'Assistant': { name: allocation.team.assistant, role: 'Assistant Surgeon' },
                    'Anaesthetist': { name: allocation.team.anaesthetist, role: 'Anaesthetist' },
                    'Anaes N/P': { name: allocation.team.anaesNP, role: 'Anaesthetic Nurse/Practitioner' },
                    ...(allocation.team.anaesNP2 ? {'Anaes N/P 2': { name: allocation.team.anaesNP2, role: 'Anaesthetic Nurse/Practitioner' }} : {}),
                    'Scrub N/P 1': { name: allocation.team.scrubNP1, role: 'Scrub Nurse/Practitioner' },
                    'Scrub N/P 2': { name: allocation.team.scrubNP2, role: 'Scrub Nurse/Practitioner' },
                    ...(allocation.team.scrubNP3 ? {'Scrub N/P 3': { name: allocation.team.scrubNP3, role: 'Scrub Nurse/Practitioner' }} : {}),
                    ...(allocation.team.hca ? {'HCA': { name: allocation.team.hca, role: 'Healthcare Assistant' }} : {}),
                    ...(allocation.team.techSpec ? {'Tech Spec': { name: allocation.team.techSpec, role: 'Technical Specialist' }} : {})
                  }).map(([label, staff]) => {
                    // Add null check for staff object
                    if (!staff || !staff.name) {
                      return null;
                    }

                    return (
                      <div key={label} className="flex items-center group/staff">
                        <span className={`mr-1 min-w-[85px] ${staff.name === 'VACANT' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {label}:
                        </span>
                        {staff.name === 'VACANT' ? (
                          <span className="text-gray-400 italic">Vacant</span>
                        ) : (
                          <>
                            <span
                              className="cursor-pointer hover:text-blue-600 hover:underline flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStaffClick(staff.name.replace(/[☕⚠️]/g, '').trim(), staff.role, allocation.theatre);
                              }}
                              onMouseEnter={(e) => handleStaffHover(e, staff.name.replace(/[☕⚠️]/g, '').trim(), staff.role)}
                              onMouseLeave={() => setHoveredStaff(null)}
                            >
                              {staff.name}
                            </span>
                            {(staff.name.includes('☕') || staff.name.includes('⚠️')) ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReliefRequest(staff.name.replace(/[☕⚠️]/g, '').trim(), staff.role, allocation.theatre);
                                }}
                                className="ml-1 opacity-0 group-hover/staff:opacity-100 transition-opacity"
                                title="Request relief"
                              >
                                <Bell className="w-3 h-3 text-orange-500 hover:text-orange-600" />
                              </button>
                            ) : null}
                          </>
                        )}
                      </div>
                    );
                  }).filter(Boolean)}
                </div>
                {allocation.alerts && (
                  <div className={`mt-2 text-xs px-2 py-1 rounded ${
                    allocation.status === 'closed'
                      ? 'text-red-700 bg-red-50 font-medium'
                      : 'text-orange-600 bg-orange-50'
                  }`}>
                    {allocation.status === 'closed' ? '⛔' : '⚠️'} {allocation.alerts}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Alerts */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            Critical Alerts
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex items-start">
                <XCircle className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Theatre Closures</p>
                  <p className="text-xs text-red-700 mt-1">Theatre 2 - Unpopulated list</p>
                  <p className="text-xs text-red-700">Theatre 9 - Equipment failure & staff shortage</p>
                  <p className="text-xs text-red-600 mt-2">Action: Cases rescheduled, maintenance notified</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex items-start">
                <XCircle className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Low Inventory Alert</p>
                  <p className="text-xs text-red-700 mt-1">Hip implants (size L) - Only 2 units remaining</p>
                  <p className="text-xs text-red-600 mt-2">Action: Order placed, ETA 2 hours</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <div className="flex items-start">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Staff Shortage Warning</p>
                  <p className="text-xs text-yellow-700 mt-1">Night shift - 1 scrub nurse short</p>
                  <p className="text-xs text-yellow-600 mt-2">Action: Agency staff requested</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">Issue Resolved</p>
                  <p className="text-xs text-green-700 mt-1">Theatre 2 HVAC system restored</p>
                  <p className="text-xs text-green-600 mt-2">Resolved 10 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Cases */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-600" />
            Upcoming Cases
          </h2>
          <div className="space-y-3">
            {[
              { time: '14:00', procedure: 'Total Knee Replacement', surgeon: 'Mr. Johnson', theatre: 'Theatre 1', duration: '2h' },
              { time: '14:30', procedure: 'Cholecystectomy', surgeon: 'Ms. Chen', theatre: 'Theatre 2', duration: '1h 30m' },
              { time: '15:00', procedure: 'Cataract Surgery', surgeon: 'Dr. Patel', theatre: 'Theatre 4', duration: '45m' },
              { time: '16:00', procedure: 'Hernia Repair', surgeon: 'Mr. Williams', theatre: 'Theatre 2', duration: '1h' },
              { time: '16:30', procedure: 'Carpal Tunnel Release', surgeon: 'Ms. Brown', theatre: 'Theatre 5', duration: '30m' },
            ].map((caseItem, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Start</p>
                    <p className="font-bold text-sm">{caseItem.time}</p>
                  </div>
                  <div className="border-l pl-3">
                    <p className="font-medium text-sm">{caseItem.procedure}</p>
                    <p className="text-xs text-gray-600">{caseItem.surgeon} • {caseItem.theatre}</p>
                  </div>
                </div>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">{caseItem.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Equipment Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-green-600" />
            Critical Equipment Status
          </h2>
          <div className="space-y-3">
            {[
              { item: 'Anaesthesia Machines', available: 26, total: 30, status: 'good' },
              { item: 'C-Arms', available: 8, total: 10, status: 'good' },
              { item: 'Laparoscopic Towers', available: 12, total: 15, status: 'good' },
              { item: 'Microscopes', available: 5, total: 8, status: 'limited' },
              { item: 'Da Vinci Robots', available: 2, total: 2, status: 'optimal' },
              { item: 'Hybrid Lab Equipment', available: 1, total: 1, status: 'optimal' },
            ].map((equipment, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm">{equipment.item}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">{equipment.available}/{equipment.total}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    equipment.status === 'optimal' ? 'bg-green-100 text-green-700' :
                    equipment.status === 'good' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {equipment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TheatreTimelineModal
        isOpen={showTimeline}
        onClose={() => {
          setShowTimeline(false);
          setSelectedTheatre(null);
        }}
        theatre={selectedTheatre || ''}
      />

      {/* Staff Relief Request Modal */}
      <StaffReliefModal
        isOpen={showReliefModal}
        onClose={() => {
          setShowReliefModal(false);
          setSelectedStaffForRelief(null);
        }}
        staffMember={selectedStaffForRelief}
      />

      {/* Staff Hover Card */}
      <StaffHoverCard
        staff={hoveredStaff}
        visible={!!hoveredStaff}
        position={hoverPosition}
      />

      {/* Staff Competency Modal */}
      <StaffCompetencyModal
        isOpen={showCompetencyModal}
        onClose={() => {
          setShowCompetencyModal(false);
          setSelectedStaffForCompetency(null);
        }}
        staff={selectedStaffForCompetency}
      />
    </div>
  );
}