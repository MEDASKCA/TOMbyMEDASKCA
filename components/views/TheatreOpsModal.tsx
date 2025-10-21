'use client';

import React, { useState } from 'react';
import {
  X,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Calendar,
  User,
  FileText
} from 'lucide-react';

interface TheatreOpsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type IssueType = 'operational' | 'clinical' | 'escalation';
type FilterPeriod = 'today' | 'week' | 'month';

export default function TheatreOpsModal({ isOpen, onClose }: TheatreOpsModalProps) {
  const [selectedFilter, setSelectedFilter] = useState<IssueType | 'all'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>('today');
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  if (!isOpen) return null;

  const operationalSummary = {
    runningTheatres: 24,
    totalTheatres: 26,
    casesCompleted: 47,
    casesUnderway: 18,
    casesScheduled: 89
  };

  const issues = [
    {
      id: 1,
      type: 'operational' as IssueType,
      title: 'Main Theatre 2 - Equipment Fault',
      description: 'Anaesthetic machine pressure sensor malfunction',
      theatre: 'Main Theatre 2',
      raisedBy: 'RN A. Flores',
      raisedAt: '08:15',
      status: 'resolved',
      resolvedAt: '09:30',
      resolvedBy: 'Biomed Engineer - J. Chen',
      priority: 'high',
      impact: 'Theatre closed for 75 minutes',
      previousOccurrences: [
        { date: '2024-10-15', theatre: 'Main Theatre 2', issue: 'Same sensor issue', resolvedBy: 'J. Chen' },
        { date: '2024-09-28', theatre: 'Main Theatre 5', issue: 'Pressure sensor fault', resolvedBy: 'K. Williams' }
      ],
      notes: 'Sensor replaced. Preventative maintenance scheduled for all machines'
    },
    {
      id: 2,
      type: 'operational' as IssueType,
      title: 'Main Theatre 7 - CLOSED',
      description: 'Unpopulated list - No cases booked',
      theatre: 'Main Theatre 7',
      raisedBy: 'System Auto-flagged',
      raisedAt: '07:00',
      status: 'acknowledged',
      assignedTo: 'Theatre Coordinator',
      priority: 'low',
      impact: 'Theatre available for emergency cases',
      previousOccurrences: [],
      notes: 'Staff reallocated to other theatres'
    },
    {
      id: 3,
      type: 'clinical' as IssueType,
      title: 'ACAD Theatre 3 - Delayed Start',
      description: 'Patient arrived with elevated blood pressure',
      theatre: 'ACAD Theatre 3',
      raisedBy: 'Dr. F. James (Anaesthetist)',
      raisedAt: '08:45',
      status: 'resolved',
      resolvedAt: '09:30',
      priority: 'medium',
      impact: '45 minute delay to list',
      previousOccurrences: [],
      notes: 'Patient observed. BP stabilized. Consultant approval obtained. Surgery proceeded'
    },
    {
      id: 4,
      type: 'escalation' as IssueType,
      title: 'Main Theatre 1 - Implant Not Available',
      description: 'Specific hip prosthesis not in stock',
      theatre: 'Main Theatre 1',
      raisedBy: 'J. Smith (Consultant)',
      raisedAt: '08:35',
      status: 'in-progress',
      assignedTo: 'Procurement Manager',
      priority: 'urgent',
      impact: '15 min delay - alternative implant sourced',
      previousOccurrences: [
        { date: '2024-10-10', theatre: 'Main Theatre 1', issue: 'Knee implant stockout', resolvedBy: 'Procurement' }
      ],
      notes: 'Escalated to supply chain. Emergency stock protocol activated'
    },
    {
      id: 5,
      type: 'clinical' as IssueType,
      title: 'Main Theatre 8 - Post-op Complication',
      description: 'Patient requires HDU admission',
      theatre: 'Main Theatre 8',
      raisedBy: 'Dr. B. Morgan (Surgeon)',
      raisedAt: '11:15',
      status: 'resolved',
      resolvedAt: '11:45',
      priority: 'high',
      impact: 'HDU bed secured - No delay to next case',
      previousOccurrences: [],
      notes: 'Patient transferred to HDU. Next case started on time'
    }
  ];

  const filteredIssues = issues.filter(issue => {
    if (selectedFilter === 'all') return true;
    return issue.type === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-700 border-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold">Theatre Operations Summary</h2>
            <p className="text-blue-100 text-xs mt-1">Live operational status and issue tracking</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area - Flex Row */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Stats (Fixed, Compact) */}
          <div className="w-48 bg-gray-50 border-r border-gray-200 p-3 flex-shrink-0 overflow-y-auto">
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <p className="text-[10px] text-gray-600 mb-1">Running Theatres</p>
                <p className="text-lg font-bold text-green-600">
                  {operationalSummary.runningTheatres}/{operationalSummary.totalTheatres}
                </p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <p className="text-[10px] text-gray-600 mb-1">Cases Completed</p>
                <p className="text-lg font-bold text-blue-600">{operationalSummary.casesCompleted}</p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <p className="text-[10px] text-gray-600 mb-1">Cases Underway</p>
                <p className="text-lg font-bold text-orange-600">{operationalSummary.casesUnderway}</p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <p className="text-[10px] text-gray-600 mb-1">Total Scheduled</p>
                <p className="text-lg font-bold text-gray-700">{operationalSummary.casesScheduled}</p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <p className="text-[10px] text-gray-600 mb-1">Active Issues</p>
                <p className="text-lg font-bold text-red-600">{issues.filter(i => i.status !== 'resolved').length}</p>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filters - Compact, at top */}
            <div className="p-2 bg-white border-b border-gray-200 flex-shrink-0">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 flex-wrap">
                  <Filter className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">Type:</span>
                  {(['all', 'operational', 'clinical', 'escalation'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                        selectedFilter === filter
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex items-center space-x-2 flex-wrap">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">Period:</span>
                  {(['today', 'week', 'month'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                        selectedPeriod === period
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Issues List - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => setSelectedIssue(selectedIssue?.id === issue.id ? null : issue)}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                        {issue.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(issue.status)}`}>
                        {issue.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{issue.theatre}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{issue.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        Raised by: {issue.raisedBy}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {issue.raisedAt}
                      </span>
                      {issue.previousOccurrences.length > 0 && (
                        <span className="flex items-center text-orange-600 font-medium">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {issue.previousOccurrences.length} previous occurrence{issue.previousOccurrences.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedIssue?.id === issue.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    <div className="bg-blue-50 rounded p-3">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Impact</p>
                      <p className="text-sm text-blue-800">{issue.impact}</p>
                    </div>

                    {issue.notes && (
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center">
                          <FileText className="w-3 h-3 mr-1" />
                          Notes
                        </p>
                        <p className="text-sm text-gray-700">{issue.notes}</p>
                      </div>
                    )}

                    {issue.resolvedBy && (
                      <div className="bg-green-50 rounded p-3">
                        <p className="text-xs font-semibold text-green-900 mb-1">Resolution</p>
                        <p className="text-sm text-green-800">
                          Resolved by {issue.resolvedBy} at {issue.resolvedAt}
                        </p>
                      </div>
                    )}

                    {issue.previousOccurrences.length > 0 && (
                      <div className="bg-orange-50 rounded p-3">
                        <p className="text-xs font-semibold text-orange-900 mb-2 flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Previous Occurrences
                        </p>
                        <div className="space-y-2">
                          {issue.previousOccurrences.map((occurrence, idx) => (
                            <div key={idx} className="text-xs text-orange-800 pl-4 border-l-2 border-orange-300">
                              <p className="font-medium">{occurrence.date} - {occurrence.theatre}</p>
                              <p>{occurrence.issue} • Resolved by: {occurrence.resolvedBy}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
