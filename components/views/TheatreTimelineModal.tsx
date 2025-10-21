'use client';

import React from 'react';
import {
  X,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Coffee,
  ArrowRight,
  Activity,
  Users,
  UserCheck,
  UserX
} from 'lucide-react';

interface TheatreTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  theatre: string;
}

export default function TheatreTimelineModal({ isOpen, onClose, theatre }: TheatreTimelineModalProps) {
  if (!isOpen) return null;

  const procedures = [
    {
      id: '1',
      time: '08:00',
      procedure: 'Total Hip Replacement',
      patient: 'MRN: 12345678',
      surgeon: 'J. Smith',
      timeline: [
        { time: '07:30', event: 'Patient sent for', status: 'completed', ward: 'Ward 7B', comment: 'Request sent to porter (J. Williams)' },
        { time: '07:45', event: 'Patient arrived in reception', status: 'completed', comment: 'Accepted by RN M. Johnson' },
        { time: '07:50', event: 'Pre-op checks complete', status: 'completed', staff: 'A. Flores (RN1)', comment: 'Patient with slightly elevated BP 145/92 - Anaesthetist informed' },
        { time: '08:00', event: 'Into theatre', status: 'completed' },
        { time: '08:10', event: 'Anaesthetic start', status: 'completed', staff: 'F. James', note: 'WHO checklist completed', comment: 'General anaesthesia induced, no complications' },
        { time: '08:45', event: 'Staff relief', status: 'relief', staff: 'F. James relieved by S. Patel (coffee break)' },
        { time: '08:50', event: 'Surgery start', status: 'completed', staff: 'J. Smith (Lead), A. Gallagher (Assist)', comment: 'Incision made, prosthesis prepared' },
        { time: '09:00', event: 'Staff returned', status: 'relief', staff: 'F. James returned from break' },
        { time: '10:30', event: 'Surgery end', status: 'completed', comment: 'Procedure completed successfully, minimal blood loss' },
        { time: '10:45', event: 'To recovery', status: 'completed', staff: 'Handover to M. Wilson (Recovery RN)', comment: 'Patient stable, vital signs normal' },
        { time: '11:30', event: 'Discharged to ward', status: 'completed', ward: 'HDU Level 2', comment: 'Patient mobilising well, pain controlled' }
      ],
      alerts: [
        { type: 'delay', message: '15 min delay - awaiting implant delivery', time: '08:35' }
      ]
    },
    {
      id: '2',
      time: '12:00',
      procedure: 'Knee Arthroscopy',
      patient: 'MRN: 87654321',
      surgeon: 'J. Smith',
      timeline: [
        { time: '11:30', event: 'Patient sent for', status: 'completed', ward: 'Day Surgery Unit', comment: 'Porter assigned (K. Thomas)' },
        { time: '11:45', event: 'Patient arrived in reception', status: 'completed', comment: 'Pre-op fasting confirmed 6+ hours' },
        { time: '12:00', event: 'Into theatre', status: 'in-progress', comment: 'Patient transfer in progress' },
        { time: '12:10', event: 'Anaesthetic start', status: 'pending', staff: 'S. Patel' },
        { time: '12:25', event: 'Surgery start', status: 'pending' },
        { time: '13:00', event: 'Surgery end', status: 'pending' },
        { time: '13:15', event: 'To recovery', status: 'pending' },
        { time: '14:00', event: 'Discharge to ward', status: 'pending', ward: 'Day Surgery Unit' }
      ],
      alerts: []
    },
    {
      id: '3',
      time: '14:30',
      procedure: 'Revision Hip Replacement',
      patient: 'MRN: 11223344',
      surgeon: 'J. Smith',
      timeline: [
        { time: '14:00', event: 'Patient sent for', status: 'pending', ward: 'Ward 5A' },
        { time: '14:15', event: 'Patient arrival', status: 'pending' },
        { time: '14:30', event: 'Into theatre', status: 'pending' },
        { time: '14:40', event: 'Anaesthetic start', status: 'pending', staff: 'F. James' },
        { time: '15:00', event: 'Surgery start', status: 'pending' },
        { time: '17:30', event: 'Surgery end (est)', status: 'pending' },
        { time: '17:45', event: 'To recovery', status: 'pending' },
        { time: '18:30', event: 'Discharge to ward', status: 'pending', ward: 'Ortho Ward 6' }
      ],
      alerts: [
        { type: 'warning', message: 'Complex case - may overrun', time: '' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-500 border-gray-200';
      case 'relief': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600 animate-pulse" />;
      case 'relief': return <Users className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-95 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{theatre} - Detailed Timeline</h2>
            <p className="text-blue-100 text-sm mt-1">
              Current Time: {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} |
              Cases: {procedures.length} | Est. Finish: 18:30
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {procedures.map((proc, idx) => (
            <div key={proc.id} className="border-b border-gray-200 last:border-b-0">
              {/* Procedure Header */}
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-gray-800">{proc.time}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{proc.procedure}</h3>
                    <p className="text-sm text-gray-600">
                      {proc.patient} | Surgeon: {proc.surgeon}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {proc.alerts.map((alert, i) => (
                    <div key={i} className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                      alert.type === 'delay' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      <AlertCircle className="w-3 h-3" />
                      <span>{alert.message}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="px-6 py-4">
                <div className="relative">
                  {/* Timeline line - gray for whole timeline */}
                  <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                  {/* Colored line for completed stages */}
                  {proc.timeline.map((event, eventIdx) => {
                    const isCompleted = event.status === 'completed';
                    const nextEventCompleted = eventIdx < proc.timeline.length - 1 && proc.timeline[eventIdx + 1].status === 'completed';

                    return isCompleted && eventIdx < proc.timeline.length - 1 ? (
                      <div
                        key={`line-${eventIdx}`}
                        className="absolute left-16 w-0.5 bg-green-500"
                        style={{
                          top: `${eventIdx * 80}px`,
                          height: nextEventCompleted ? '80px' : '40px'
                        }}
                      ></div>
                    ) : null;
                  })}

                  {proc.timeline.map((event, eventIdx) => (
                    <div key={eventIdx} className="relative flex items-start mb-4 last:mb-0">
                      {/* Time */}
                      <div className="w-14 text-sm font-medium text-gray-600 text-right">
                        {event.time}
                      </div>

                      {/* Icon */}
                      <div className="ml-2 mr-4 z-10 bg-white">
                        {getStatusIcon(event.status)}
                      </div>

                      {/* Event Details */}
                      <div className="flex-1">
                        <div className={`inline-block px-3 py-1.5 rounded-lg border ${getStatusColor(event.status)}`}>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{event.event}</span>
                            {event.ward && (
                              <span className="text-xs bg-white px-2 py-0.5 rounded">
                                📍 {event.ward}
                              </span>
                            )}
                          </div>
                          {event.staff && (
                            <div className="text-xs mt-1 flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{event.staff}</span>
                            </div>
                          )}
                          {event.note && (
                            <div className="text-xs mt-1 italic text-gray-600">
                              {event.note}
                            </div>
                          )}
                          {event.comment && (
                            <div className="text-xs mt-1 text-blue-700 bg-blue-50 px-2 py-1 rounded">
                              💬 {event.comment}
                            </div>
                          )}
                        </div>

                        {/* Calculate gap to next event */}
                        {eventIdx < proc.timeline.length - 1 && (
                          <div className="mt-2 mb-2 text-xs text-gray-500 flex items-center">
                            <ArrowRight className="w-3 h-3 mr-1" />
                            {(() => {
                              const current = proc.timeline[eventIdx].time.split(':').map(Number);
                              const next = proc.timeline[eventIdx + 1].time.split(':').map(Number);
                              const diffMinutes = (next[0] - current[0]) * 60 + (next[1] - current[1]);
                              if (diffMinutes > 0) {
                                return `${diffMinutes} min`;
                              }
                              return '';
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Turnover Time */}
              {idx < procedures.length - 1 && (
                <div className="bg-yellow-50 px-6 py-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-yellow-800">
                    Turnover Time
                  </span>
                  <span className="text-sm text-yellow-700">
                    30 minutes (Target: 25 min)
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <span className="text-gray-600">
                <strong>Total OR Time:</strong> 10h 30m
              </span>
              <span className="text-gray-600">
                <strong>Utilization:</strong> 87%
              </span>
              <span className="text-gray-600">
                <strong>Avg Turnover:</strong> 28 min
              </span>
            </div>
            <button className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Export Timeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}