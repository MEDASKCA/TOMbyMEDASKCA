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

  // Calculate smart positioning to keep card in viewport
  const calculatePosition = () => {
    if (!position) return { left: 0, top: 0 };

    const cardWidth = 384; // w-96 = 384px
    const cardMaxHeight = window.innerHeight * 0.8; // 80vh
    const margin = 20; // spacing from edge

    let left = position.x;
    let top = position.y + 10; // 10px below cursor

    // Check if card would go off right edge
    if (left + cardWidth / 2 > window.innerWidth - margin) {
      left = window.innerWidth - cardWidth - margin;
    }

    // Check if card would go off left edge
    if (left - cardWidth / 2 < margin) {
      left = cardWidth / 2 + margin;
    }

    // Check if card would go off bottom edge
    if (top + cardMaxHeight > window.innerHeight - margin) {
      // Position above cursor instead
      top = position.y - cardMaxHeight - 10;

      // If still off top, just position it with margin
      if (top < margin) {
        top = margin;
      }
    }

    return { left, top };
  };

  const smartPosition = calculatePosition();

  // Determine role type
  const isConsultant = staff.role.includes('Consultant');
  const isAssistant = staff.role.includes('Assistant');
  const isAnaesthetist = staff.role.includes('Anaesthetist') && !staff.role.includes('Nurse') && !staff.role.includes('N/P');
  const isSeniorStaff = isConsultant || isAssistant || isAnaesthetist;

  // Mock detailed staff data - in production, this would come from database
  const getStaffDetails = () => {
    // Different data for senior staff vs nursing/practitioner staff
    if (isConsultant) {
      return {
        employeeId: 'NHS-4521',
        department: 'Surgery',
        grade: 'Consultant Surgeon',
        currentLocation: 'Main Theatre 1',
        shiftStart: '08:00',
        shiftEnd: '18:00',
        status: 'On Time',
        arrivingLate: false,
        lateReason: '',
        message: 'Proceed with WHO checklist - Happy with current list order',
        additionalNotes: 'Patient 3 may need extended time - complex revision',
        todaysActivity: {
          casesScheduled: 3,
          casesCompleted: 1,
          currentCase: 'Total Hip Replacement',
          estimatedFinish: '10:30'
        }
      };
    } else if (isAssistant) {
      return {
        employeeId: 'NHS-3892',
        department: 'Surgery',
        grade: 'Surgical Registrar',
        currentLocation: 'Main Theatre 1',
        shiftStart: '08:00',
        shiftEnd: '16:00',
        status: 'On Time',
        arrivingLate: false,
        lateReason: '',
        message: 'Ready to assist - All pre-op notes reviewed',
        additionalNotes: '',
        todaysActivity: {
          casesScheduled: 3,
          casesCompleted: 1,
          currentCase: 'Total Hip Replacement',
          estimatedFinish: '10:30'
        }
      };
    } else if (isAnaesthetist) {
      return {
        employeeId: 'NHS-5673',
        department: 'Anaesthetics',
        grade: 'Consultant Anaesthetist',
        currentLocation: 'Main Theatre 1',
        shiftStart: '07:00',
        shiftEnd: '19:00',
        status: 'Arriving Late',
        arrivingLate: true,
        lateReason: 'In Theatre 5 managing emergency case - ETA 09:15',
        message: 'Contact Anaesthetic Coordinator (Ext. 2299) for cover',
        additionalNotes: 'Locum arranged - Dr. S. Patel covering until arrival',
        todaysActivity: {
          casesScheduled: 4,
          casesCompleted: 0,
          currentCase: 'Emergency laparotomy (Theatre 5)',
          estimatedFinish: '09:00'
        }
      };
    } else {
      // Nursing/Practitioner staff
      return {
        employeeId: 'NHS-2847',
        department: 'Anaesthetics',
        grade: 'Band 6',
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
    }
  };

  const staffDetails = getStaffDetails();

  const getCompetencyColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-100 text-green-700 border-green-300';
      case 'Competent': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Learning': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Determine if this role should show competencies
  const showCompetencies = staff.role.includes('Scrub') || staff.role.includes('Anaes N/P') || staff.role.includes('Anaesthetic Nurse');
  const isScrubRole = staff.role.includes('Scrub');
  const isAnaesNP = staff.role.includes('Anaes N/P') || staff.role.includes('Anaesthetic Nurse');

  return (
    <div
      className="fixed z-[60] bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-[80vh] overflow-y-auto p-4"
      style={{
        left: `${smartPosition.left}px`,
        top: `${smartPosition.top}px`,
        transform: 'translate(-50%, 0)'
      }}
      onMouseEnter={(e) => e.stopPropagation()}
      onMouseLeave={(e) => e.stopPropagation()}
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

      {/* Status - Different for senior staff vs N/P */}
      {isSeniorStaff ? (
        <>
          {/* Senior Staff Status */}
          <div className={`rounded-lg p-3 mb-3 ${(staffDetails as any).arrivingLate ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">Status</span>
              <span className={`text-xs font-medium px-2 py-1 rounded ${(staffDetails as any).arrivingLate ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                {(staffDetails as any).status}
              </span>
            </div>
            {(staffDetails as any).arrivingLate && (staffDetails as any).lateReason && (
              <div className="bg-white rounded p-2 text-xs text-orange-800 mb-2">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                <strong>Reason:</strong> {(staffDetails as any).lateReason}
              </div>
            )}
          </div>

          {/* Message/Instructions */}
          {(staffDetails as any).message && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <h4 className="text-xs font-semibold text-blue-900 mb-1 flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                Message
              </h4>
              <p className="text-xs text-blue-800">{(staffDetails as any).message}</p>
            </div>
          )}

          {/* Additional Notes */}
          {(staffDetails as any).additionalNotes && (
            <div className="bg-gray-50 rounded-lg p-2 mb-3">
              <p className="text-xs text-gray-700">
                <strong>Note:</strong> {(staffDetails as any).additionalNotes}
              </p>
            </div>
          )}

          {/* Today's Activity for Senior Staff */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Today's Activity</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600">Cases Scheduled:</span>
                <span className="font-medium ml-1">{(staffDetails as any).todaysActivity.casesScheduled}</span>
              </div>
              <div>
                <span className="text-gray-600">Completed:</span>
                <span className="font-medium ml-1">{(staffDetails as any).todaysActivity.casesCompleted}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Current:</span>
                <span className="font-medium ml-1">{(staffDetails as any).todaysActivity.currentCase}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* N/P Staff Status */}
          <div className="bg-gray-50 rounded-lg p-2 mb-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="font-medium">Location:</span>
                <span className="text-gray-600">{(staffDetails as any).currentLocation}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Coffee className="w-3 h-3 text-gray-400" />
                <span className="font-medium">Breaks:</span>
                <span className={(staffDetails as any).breakStatus.taken ? 'text-green-600' : 'text-orange-600'}>
                  {(staffDetails as any).breakStatus.totalBreaks}
                </span>
              </div>
            </div>
            {!(staffDetails as any).breakStatus.taken && (
              <div className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                ⚠️ Break overdue - Last break at {(staffDetails as any).breakStatus.lastBreak}
              </div>
            )}
          </div>
        </>
      )}

      {/* Competencies - Only show for Scrub N/P and Anaes N/P */}
      {showCompetencies && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
            <Award className="w-3 h-3 mr-1" />
            {isScrubRole ? 'Scrub Competencies & Certifications' : 'Anaesthetic Skills & Certifications'}
          </h4>
          <div className="space-y-1">
            {isScrubRole ? (
              // Scrub staff - show surgical specialties
              staffDetails.competencies.map((comp, idx) => (
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
              ))
            ) : (
              // Anaes N/P - show anaesthetic skills
              [
                { specialty: 'General Anaesthesia', level: 'Expert', certified: true },
                { specialty: 'Regional Anaesthesia', level: 'Expert', certified: true },
                { specialty: 'Paediatric Anaesthesia', level: 'Competent', certified: true },
                { specialty: 'Airway Management', level: 'Expert', certified: true },
                { specialty: 'Crisis Management', level: 'Competent', certified: false }
              ].map((comp, idx) => (
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
              ))
            )}
          </div>
        </div>
      )}

      {/* Relief Availability - Only for N/P staff */}
      {!isSeniorStaff && (
        <>
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
              <Activity className="w-3 h-3 mr-1" />
              Can Provide Relief In:
            </h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {(staffDetails as any).canRelieveIn.map((theatre: any, idx: number) => (
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

          {/* Today's Activity - N/P version */}
          <div className="bg-blue-50 rounded-lg p-2 mb-3">
            <h4 className="text-xs font-semibold text-blue-700 mb-1">Today&apos;s Activity</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600">Cases:</span>
                <span className="font-medium ml-1">{(staffDetails as any).todaysActivity.casesCompleted}</span>
              </div>
              <div>
                <span className="text-gray-600">Reliefs:</span>
                <span className="font-medium ml-1">{(staffDetails as any).todaysActivity.reliefProvided}</span>
              </div>
              <div>
                <span className="text-gray-600">Efficiency:</span>
                <span className="font-medium ml-1 text-green-600">{(staffDetails as any).todaysActivity.averageEfficiency}</span>
              </div>
              <div>
                <span className="text-gray-600">Overtime:</span>
                <span className="font-medium ml-1">{(staffDetails as any).todaysActivity.overtime}</span>
              </div>
            </div>
          </div>

          {/* Last Relief Provided */}
          {(staffDetails as any).reliefHistory.length > 0 && (
            <div className="border-t border-gray-200 pt-2">
              <h4 className="text-xs font-semibold text-gray-700 mb-1">Last Relief Provided</h4>
              <div className="text-xs text-gray-600">
                {(staffDetails as any).reliefHistory[0].time} - Relieved {(staffDetails as any).reliefHistory[0].relieved} in{' '}
                {(staffDetails as any).reliefHistory[0].theatre} ({(staffDetails as any).reliefHistory[0].duration})
              </div>
            </div>
          )}
        </>
      )}

      {/* Audit Note */}
      <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500 italic">
        <AlertCircle className="w-3 h-3 inline mr-1" />
        All relief activities logged for compliance & documentation
      </div>
    </div>
  );
}