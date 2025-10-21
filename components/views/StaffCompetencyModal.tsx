'use client';

import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  Star,
  Award,
  Book,
  Briefcase,
  AlertCircle,
  CheckCircle,
  Users,
  Clock,
  TrendingUp,
  Calendar,
  ChevronLeft,
  User,
  MapPin,
  Coffee,
  Shield,
  Activity
} from 'lucide-react';

interface StaffCompetencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: {
    name: string;
    role: string;
    theatre?: string;
  };
}

type ViewMode = 'specialties' | 'procedures' | 'systems';

interface Specialty {
  id: string;
  name: string;
  level: 'Expert' | 'Competent' | 'Learning';
  certified: boolean;
  lastAssessed: string;
  procedureCount: number;
}

interface Procedure {
  id: string;
  name: string;
  specialtyId: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Rarely';
  lastPerformed: string;
  totalPerformed: number;
  complexity: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface SystemRating {
  id: string;
  procedureId: string;
  name: string;
  manufacturer: string;
  rating: 1 | 2 | 3 | 4 | 5;
  lastUsed: string;
  casesCompleted: number;
  notes?: string;
}

export default function StaffCompetencyModal({ isOpen, onClose, staff }: StaffCompetencyModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('specialties');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [showSpecialtyDetail, setShowSpecialtyDetail] = useState(false);
  const [selectedSpecialtyForDetail, setSelectedSpecialtyForDetail] = useState<any>(null);

  if (!isOpen) return null;

  // Only show competency modal for Scrub N/P and Anaes N/P roles
  const showCompetencies = staff.role.includes('Scrub') || staff.role.includes('Anaes N/P') || staff.role.includes('Anaesthetic Nurse');
  const isAnaesNP = staff.role.includes('Anaes N/P') || staff.role.includes('Anaesthetic Nurse');

  if (!showCompetencies) {
    return null;
  }

  // Mock comprehensive competency data - would come from database in production
  const getStaffData = (staffName: string) => {
    // Anaesthetic N/P competencies - focused on anaesthetic skills
    const anaestheticSpecialties: Specialty[] = [
      {
        id: 'general-anaes',
        name: 'General Anaesthesia',
        level: 'Expert',
        certified: true,
        lastAssessed: '2024-09-15',
        procedureCount: 125
      },
      {
        id: 'regional-anaes',
        name: 'Regional Anaesthesia',
        level: 'Expert',
        certified: true,
        lastAssessed: '2024-08-20',
        procedureCount: 87
      },
      {
        id: 'paed-anaes',
        name: 'Paediatric Anaesthesia',
        level: 'Competent',
        certified: true,
        lastAssessed: '2024-07-10',
        procedureCount: 42
      },
      {
        id: 'airway-mgmt',
        name: 'Advanced Airway Management',
        level: 'Expert',
        certified: true,
        lastAssessed: '2024-09-01',
        procedureCount: 156
      },
      {
        id: 'sedation',
        name: 'Procedural Sedation',
        level: 'Expert',
        certified: true,
        lastAssessed: '2024-08-15',
        procedureCount: 93
      },
      {
        id: 'cardiac-anaes',
        name: 'Cardiac Anaesthesia',
        level: 'Competent',
        certified: false,
        lastAssessed: '2024-06-01',
        procedureCount: 18
      },
      {
        id: 'neuro-anaes',
        name: 'Neuroanaesthesia',
        level: 'Learning',
        certified: false,
        lastAssessed: '2024-10-01',
        procedureCount: 8
      }
    ];

    // Scrub N/P competencies - focused on surgical specialties
    const scrubSpecialties: Specialty[] = [
      {
        id: 'ortho-trauma',
        name: 'Orthopaedic Trauma',
        level: 'Expert',
        certified: true,
        lastAssessed: '2024-09-15',
        procedureCount: 47
      },
      {
        id: 'elective-ortho',
        name: 'Elective Orthopaedics',
        level: 'Expert',
        certified: true,
        lastAssessed: '2024-08-20',
        procedureCount: 35
      },
      {
        id: 'omfs',
        name: 'Oral & Maxillofacial Surgery',
        level: 'Competent',
        certified: true,
        lastAssessed: '2024-07-10',
        procedureCount: 18
      },
      {
        id: 'plastics',
        name: 'Plastic Surgery',
        level: 'Competent',
        certified: false,
        lastAssessed: '2024-06-01',
        procedureCount: 12
      },
      {
        id: 'general',
        name: 'General Surgery',
        level: 'Expert',
        certified: true,
        lastAssessed: '2024-09-01',
        procedureCount: 28
      },
      {
        id: 'neuro',
        name: 'Neurosurgery',
        level: 'Learning',
        certified: false,
        lastAssessed: '2024-10-01',
        procedureCount: 5
      }
    ];

    const specialties = isAnaesNP ? anaestheticSpecialties : scrubSpecialties;

    // Anaesthetic procedures
    const anaestheticProcedures: Record<string, Procedure[]> = {
      'general-anaes': [
        {
          id: 'ga-intubation',
          name: 'General Anaesthesia with Intubation',
          specialtyId: 'general-anaes',
          frequency: 'Daily',
          lastPerformed: '2024-10-19',
          totalPerformed: 456,
          complexity: 'Intermediate'
        },
        {
          id: 'ga-lma',
          name: 'General Anaesthesia with LMA',
          specialtyId: 'general-anaes',
          frequency: 'Daily',
          lastPerformed: '2024-10-19',
          totalPerformed: 342,
          complexity: 'Intermediate'
        },
        {
          id: 'rapid-sequence',
          name: 'Rapid Sequence Induction',
          specialtyId: 'general-anaes',
          frequency: 'Weekly',
          lastPerformed: '2024-10-17',
          totalPerformed: 89,
          complexity: 'Advanced'
        }
      ],
      'regional-anaes': [
        {
          id: 'spinal',
          name: 'Spinal Anaesthesia',
          specialtyId: 'regional-anaes',
          frequency: 'Daily',
          lastPerformed: '2024-10-18',
          totalPerformed: 234,
          complexity: 'Intermediate'
        },
        {
          id: 'epidural',
          name: 'Epidural Anaesthesia',
          specialtyId: 'regional-anaes',
          frequency: 'Weekly',
          lastPerformed: '2024-10-15',
          totalPerformed: 145,
          complexity: 'Advanced'
        },
        {
          id: 'nerve-block',
          name: 'Peripheral Nerve Block',
          specialtyId: 'regional-anaes',
          frequency: 'Daily',
          lastPerformed: '2024-10-19',
          totalPerformed: 198,
          complexity: 'Advanced'
        }
      ],
      'airway-mgmt': [
        {
          id: 'difficult-airway',
          name: 'Difficult Airway Management',
          specialtyId: 'airway-mgmt',
          frequency: 'Weekly',
          lastPerformed: '2024-10-16',
          totalPerformed: 67,
          complexity: 'Expert'
        },
        {
          id: 'fibreoptic',
          name: 'Fibreoptic Intubation',
          specialtyId: 'airway-mgmt',
          frequency: 'Monthly',
          lastPerformed: '2024-10-08',
          totalPerformed: 34,
          complexity: 'Expert'
        }
      ],
      'sedation': [
        {
          id: 'conscious-sedation',
          name: 'Conscious Sedation',
          specialtyId: 'sedation',
          frequency: 'Daily',
          lastPerformed: '2024-10-19',
          totalPerformed: 276,
          complexity: 'Intermediate'
        },
        {
          id: 'deep-sedation',
          name: 'Deep Sedation',
          specialtyId: 'sedation',
          frequency: 'Weekly',
          lastPerformed: '2024-10-17',
          totalPerformed: 123,
          complexity: 'Advanced'
        }
      ]
    };

    // Scrub procedures
    const scrubProcedures: Record<string, Procedure[]> = {
      'ortho-trauma': [
        {
          id: 'tibial-nail',
          name: 'Tibial Intramedullary Nailing',
          specialtyId: 'ortho-trauma',
          frequency: 'Weekly',
          lastPerformed: '2024-10-18',
          totalPerformed: 145,
          complexity: 'Advanced'
        },
        {
          id: 'femoral-nail',
          name: 'Femoral Intramedullary Nailing',
          specialtyId: 'ortho-trauma',
          frequency: 'Weekly',
          lastPerformed: '2024-10-17',
          totalPerformed: 132,
          complexity: 'Advanced'
        },
        {
          id: 'dhs',
          name: 'Dynamic Hip Screw',
          specialtyId: 'ortho-trauma',
          frequency: 'Daily',
          lastPerformed: '2024-10-19',
          totalPerformed: 256,
          complexity: 'Intermediate'
        },
        {
          id: 'ankle-orif',
          name: 'Ankle ORIF',
          specialtyId: 'ortho-trauma',
          frequency: 'Weekly',
          lastPerformed: '2024-10-15',
          totalPerformed: 98,
          complexity: 'Intermediate'
        },
        {
          id: 'wrist-orif',
          name: 'Distal Radius ORIF',
          specialtyId: 'ortho-trauma',
          frequency: 'Weekly',
          lastPerformed: '2024-10-16',
          totalPerformed: 87,
          complexity: 'Intermediate'
        }
      ],
      'elective-ortho': [
        {
          id: 'thr',
          name: 'Total Hip Replacement',
          specialtyId: 'elective-ortho',
          frequency: 'Daily',
          lastPerformed: '2024-10-19',
          totalPerformed: 342,
          complexity: 'Advanced'
        },
        {
          id: 'tkr',
          name: 'Total Knee Replacement',
          specialtyId: 'elective-ortho',
          frequency: 'Daily',
          lastPerformed: '2024-10-18',
          totalPerformed: 298,
          complexity: 'Advanced'
        },
        {
          id: 'acl',
          name: 'ACL Reconstruction',
          specialtyId: 'elective-ortho',
          frequency: 'Weekly',
          lastPerformed: '2024-10-14',
          totalPerformed: 76,
          complexity: 'Advanced'
        },
        {
          id: 'shoulder-arthro',
          name: 'Shoulder Arthroscopy',
          specialtyId: 'elective-ortho',
          frequency: 'Weekly',
          lastPerformed: '2024-10-12',
          totalPerformed: 89,
          complexity: 'Intermediate'
        }
      ],
      'omfs': [
        {
          id: 'mandible-orif',
          name: 'Mandibular ORIF',
          specialtyId: 'omfs',
          frequency: 'Monthly',
          lastPerformed: '2024-09-28',
          totalPerformed: 23,
          complexity: 'Expert'
        },
        {
          id: 'wisdom',
          name: 'Wisdom Tooth Extraction',
          specialtyId: 'omfs',
          frequency: 'Weekly',
          lastPerformed: '2024-10-17',
          totalPerformed: 156,
          complexity: 'Basic'
        }
      ]
    };

    const systems: Record<string, SystemRating[]> = {
      'tibial-nail': [
        {
          id: 'synthes-expert',
          procedureId: 'tibial-nail',
          name: 'Expert Tibial Nailing System',
          manufacturer: 'DePuy Synthes',
          rating: 5,
          lastUsed: '2024-10-18',
          casesCompleted: 89,
          notes: 'Can mentor others on this system'
        },
        {
          id: 'stryker-t2',
          procedureId: 'tibial-nail',
          name: 'T2 Alpha Tibial Nailing System',
          manufacturer: 'Stryker',
          rating: 4,
          lastUsed: '2024-10-15',
          casesCompleted: 45,
          notes: 'Proficient without supervision'
        },
        {
          id: 'smith-nephew-trigen',
          procedureId: 'tibial-nail',
          name: 'TRIGEN META-NAIL',
          manufacturer: 'Smith & Nephew',
          rating: 3,
          lastUsed: '2024-09-20',
          casesCompleted: 12,
          notes: 'Requires supervision for complex cases'
        },
        {
          id: 'zimmer-natural',
          procedureId: 'tibial-nail',
          name: 'Natural Nail System',
          manufacturer: 'Zimmer Biomet',
          rating: 2,
          lastUsed: '2024-06-10',
          casesCompleted: 3,
          notes: 'Novice - basic familiarity only'
        }
      ],
      'thr': [
        {
          id: 'depuy-corail',
          procedureId: 'thr',
          name: 'Corail Hip System',
          manufacturer: 'DePuy Synthes',
          rating: 5,
          lastUsed: '2024-10-19',
          casesCompleted: 145,
          notes: 'Expert - teaches on courses'
        },
        {
          id: 'zimmer-ml-taper',
          procedureId: 'thr',
          name: 'M/L Taper Hip Prosthesis',
          manufacturer: 'Zimmer Biomet',
          rating: 4,
          lastUsed: '2024-10-17',
          casesCompleted: 87,
          notes: 'Independent practice'
        },
        {
          id: 'stryker-accolade',
          procedureId: 'thr',
          name: 'Accolade II Hip System',
          manufacturer: 'Stryker',
          rating: 4,
          lastUsed: '2024-10-14',
          casesCompleted: 65,
          notes: 'Proficient with all approaches'
        },
        {
          id: 'smith-nephew-polar',
          procedureId: 'thr',
          name: 'POLAR Hip System',
          manufacturer: 'Smith & Nephew',
          rating: 1,
          lastUsed: 'Never',
          casesCompleted: 0,
          notes: 'No experience - training scheduled'
        }
      ]
    };

    const procedures = isAnaesNP ? anaestheticProcedures : scrubProcedures;

    return { specialties, procedures, systems };
  };

  const { specialties, procedures, systems } = getStaffData(staff.name);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-100 text-green-700 border-green-300';
      case 'Competent': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Learning': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Expert': return 'text-purple-600 bg-purple-50';
      case 'Advanced': return 'text-red-600 bg-red-50';
      case 'Intermediate': return 'text-orange-600 bg-orange-50';
      case 'Basic': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRatingDescription = (rating: number) => {
    switch (rating) {
      case 1: return 'No experience';
      case 2: return 'Novice';
      case 3: return 'With supervision';
      case 4: return 'Without supervision';
      case 5: return 'Mentor';
      default: return '';
    }
  };

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 5: return 'text-green-600';
      case 4: return 'text-blue-600';
      case 3: return 'text-yellow-600';
      case 2: return 'text-orange-600';
      case 1: return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const handleSpecialtyClick = (specialty: Specialty) => {
    setSelectedSpecialtyForDetail(specialty);
    setSelectedSpecialty(specialty);
    setViewMode('procedures');
    setShowSpecialtyDetail(true);
  };

  const handleProcedureClick = (procedure: Procedure) => {
    setSelectedProcedure(procedure);
    setViewMode('systems');
  };

  const handleBack = () => {
    if (viewMode === 'systems') {
      setViewMode('procedures');
      setSelectedProcedure(null);
    } else if (viewMode === 'procedures') {
      setViewMode('specialties');
      setSelectedSpecialty(null);
      setShowSpecialtyDetail(false);
      setSelectedSpecialtyForDetail(null);
    }
  };

  const handleBackToList = () => {
    setShowSpecialtyDetail(false);
    setSelectedSpecialtyForDetail(null);
  };

  // Get staff details for context menu (similar to StaffHoverCard)
  const getStaffDetailsForContext = () => {
    return {
      employeeId: 'NHS-2847',
      department: 'Anaesthetics',
      grade: 'Band 6',
      currentLocation: staff.theatre || 'Theatre 1 - Orthopaedics',
      shiftStart: '07:00',
      shiftEnd: '19:00',
      breakStatus: {
        taken: false,
        lastBreak: '07:00',
        nextDue: '11:00',
        totalBreaks: '0/3'
      },
      todaysActivity: {
        casesCompleted: 3,
        reliefProvided: 1,
        averageEfficiency: '94%',
        overtime: '0 hrs'
      }
    };
  };

  const staffDetailsForContext = getStaffDetailsForContext();

  const getCompetencyColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-100 text-green-700 border-green-300';
      case 'Competent': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Learning': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center lg:p-4 z-50">
      <div className="bg-white lg:rounded-lg shadow-xl max-w-5xl w-full h-full lg:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Staff Competency Profile</h2>
                <p className="text-indigo-100 text-sm">
                  {staff.name} • {staff.role}
                  {viewMode === 'procedures' && selectedSpecialty && ` • ${selectedSpecialty.name}`}
                  {viewMode === 'systems' && selectedProcedure && ` • ${selectedProcedure.name}`}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-indigo-800 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        {(viewMode !== 'specialties') && (
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>
                Back to {viewMode === 'systems' ? 'Procedures' : 'Specialties'}
              </span>
            </button>
          </div>
        )}

        {/* Content - 2-column layout on mobile */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Context Menu - Only on mobile, hidden when specialty detail is shown */}
          <div className={`lg:hidden w-2/5 bg-gray-50 border-r border-gray-200 overflow-y-auto p-3 ${showSpecialtyDetail ? 'hidden' : 'block'}`}>
            {/* Staff Header */}
            <div className="border-b border-gray-200 pb-3 mb-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{staff.name}</h3>
                  <p className="text-xs text-gray-600">{staff.role}</p>
                  <p className="text-xs text-gray-500 mt-1">ID: {staffDetailsForContext.employeeId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Shift</p>
                  <p className="text-xs font-medium">{staffDetailsForContext.shiftStart} - {staffDetailsForContext.shiftEnd}</p>
                </div>
              </div>
            </div>

            {/* Location and Breaks */}
            <div className="bg-white rounded-lg p-2 mb-3 border border-gray-200">
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="font-medium">Location:</span>
                  <span className="text-gray-600 text-xs">{staffDetailsForContext.currentLocation}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Coffee className="w-3 h-3 text-gray-400" />
                  <span className="font-medium">Breaks:</span>
                  <span className={staffDetailsForContext.breakStatus.taken ? 'text-green-600' : 'text-orange-600'}>
                    {staffDetailsForContext.breakStatus.totalBreaks}
                  </span>
                </div>
              </div>
              {!staffDetailsForContext.breakStatus.taken && (
                <div className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                  Break overdue
                </div>
              )}
            </div>

            {/* Competencies Summary */}
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                <Award className="w-3 h-3 mr-1" />
                Top Competencies
              </h4>
              <div className="space-y-1">
                {specialties.filter(s => s.level === 'Expert').slice(0, 3).map((comp) => (
                  <div
                    key={comp.id}
                    className={`flex items-center justify-between px-2 py-1 rounded border text-xs ${getCompetencyColor(comp.level)}`}
                  >
                    <span className="font-medium text-xs truncate">{comp.name}</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">{comp.level}</span>
                      {comp.certified && <Shield className="w-3 h-3" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Activity */}
            <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
              <h4 className="text-xs font-semibold text-blue-700 mb-1">Today&apos;s Activity</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Cases:</span>
                  <span className="font-medium ml-1">{staffDetailsForContext.todaysActivity.casesCompleted}</span>
                </div>
                <div>
                  <span className="text-gray-600">Reliefs:</span>
                  <span className="font-medium ml-1">{staffDetailsForContext.todaysActivity.reliefProvided}</span>
                </div>
                <div>
                  <span className="text-gray-600">Efficiency:</span>
                  <span className="font-medium ml-1 text-green-600">{staffDetailsForContext.todaysActivity.averageEfficiency}</span>
                </div>
                <div>
                  <span className="text-gray-600">Overtime:</span>
                  <span className="font-medium ml-1">{staffDetailsForContext.todaysActivity.overtime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className={`flex-1 overflow-y-auto p-6 ${showSpecialtyDetail ? 'w-full' : ''}`}>
            {/* Back button for mobile specialty detail view */}
            {showSpecialtyDetail && (
              <div className="lg:hidden mb-4">
                <button
                  onClick={handleBackToList}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to List</span>
                </button>
              </div>
            )}

          {/* Specialties View */}
          {viewMode === 'specialties' && (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Specialties</h3>
                <div className="grid gap-3">
                  {specialties.map((specialty) => (
                    <button
                      key={specialty.id}
                      onClick={() => handleSpecialtyClick(specialty)}
                      className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:shadow-md transition-all text-left"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{specialty.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(specialty.level)}`}>
                              {specialty.level}
                            </span>
                            {specialty.certified && (
                              <CheckCircle className="w-4 h-4 text-green-600" title="Certified" />
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Briefcase className="w-4 h-4 mr-1" />
                              {specialty.procedureCount} procedures
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Last assessed: {new Date(specialty.lastAssessed).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                <h4 className="text-sm font-semibold text-indigo-900 mb-3">Competency Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-indigo-600 font-medium">Expert:</span>
                    <span className="ml-2">{specialties.filter(s => s.level === 'Expert').length} specialties</span>
                  </div>
                  <div>
                    <span className="text-indigo-600 font-medium">Certified:</span>
                    <span className="ml-2">{specialties.filter(s => s.certified).length} specialties</span>
                  </div>
                  <div>
                    <span className="text-indigo-600 font-medium">Total Procedures:</span>
                    <span className="ml-2">{specialties.reduce((sum, s) => sum + s.procedureCount, 0)}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Procedures View */}
          {viewMode === 'procedures' && selectedSpecialty && (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Procedures - {selectedSpecialty.name}
                </h3>
                <div className="grid gap-3">
                  {procedures[selectedSpecialty.id]?.map((procedure) => (
                    <button
                      key={procedure.id}
                      onClick={() => handleProcedureClick(procedure)}
                      className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:shadow-md transition-all text-left"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{procedure.name}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getComplexityColor(procedure.complexity)}`}>
                              {procedure.complexity}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {procedure.frequency}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Last: {new Date(procedure.lastPerformed).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              {procedure.totalPerformed} completed
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Systems/Equipment View */}
          {viewMode === 'systems' && selectedProcedure && (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Equipment & Systems - {selectedProcedure.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Proficiency ratings for surgical systems and equipment
                </p>
                <div className="space-y-4">
                  {systems[selectedProcedure.id]?.map((system) => (
                    <div
                      key={system.id}
                      className="bg-white border-2 border-gray-200 rounded-lg p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{system.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Manufacturer: <span className="font-medium">{system.manufacturer}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < system.rating
                                    ? `fill-current ${getRatingColor(system.rating)}`
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className={`text-sm font-medium mt-1 ${getRatingColor(system.rating)}`}>
                            {getRatingDescription(system.rating)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
                        <div className="text-sm">
                          <span className="text-gray-500">Cases Completed:</span>
                          <span className="ml-2 font-medium">{system.casesCompleted}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Last Used:</span>
                          <span className="ml-2 font-medium">
                            {system.lastUsed === 'Never' ? 'Never' : new Date(system.lastUsed).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Status:</span>
                          <span className={`ml-2 font-medium ${
                            system.rating >= 4 ? 'text-green-600' :
                            system.rating >= 3 ? 'text-yellow-600' : 'text-orange-600'
                          }`}>
                            {system.rating >= 4 ? 'Current' :
                             system.rating >= 3 ? 'Needs Practice' : 'Training Required'}
                          </span>
                        </div>
                      </div>

                      {system.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700 italic">
                          <AlertCircle className="w-4 h-4 inline mr-1 text-gray-500" />
                          {system.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Training Recommendations */}
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center">
                  <Book className="w-4 h-4 mr-2" />
                  Training Recommendations
                </h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  {systems[selectedProcedure.id]?.filter(s => s.rating <= 2).map((system) => (
                    <li key={system.id}>
                      • Schedule training for {system.manufacturer} {system.name}
                    </li>
                  ))}
                  {systems[selectedProcedure.id]?.filter(s => s.rating === 3).map((system) => (
                    <li key={system.id}>
                      • Practice sessions recommended for {system.manufacturer} {system.name}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>Competency data verified by Education & Training Department</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-3 h-3" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}