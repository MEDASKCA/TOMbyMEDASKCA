'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  Filter,
  Search,
  GripVertical,
  MoreVertical,
  Users,
  FileText,
  ListOrdered,
  MessageSquare,
  ClipboardList,
  Clock,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  LayoutGrid,
  List,
  Columns
} from 'lucide-react';

interface Procedure {
  id: string;
  listOrder: number;
  theatre: string;
  scheduledTime: string;
  estimatedDuration: number;
  procedureName: string;
  specialty: string;
  surgeon: string;
  assistant: string;
  anaesthetist: string;
  anaesNP: string;
  scrubNP: string;
  equipment: string[];
  requirements: string[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'delayed';
  notes: string[];
  requests: string[];
}

interface ContextMenu {
  visible: boolean;
  x: number;
  y: number;
  procedureId: string;
}

export default function TheatreScheduleView() {
  // Set "today" as November 3, 2024
  const TODAY = new Date(2024, 10, 3); // Month is 0-indexed, so 10 = November

  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'panel'>('calendar');
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [currentMonth, setCurrentMonth] = useState(TODAY);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'surgeon' | 'anaesthetist' | 'procedure' | 'equipment' | 'requirement' | 'staff'>('all');
  const [filterValue, setFilterValue] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedTheatre, setSelectedTheatre] = useState<string>('Main Theatre 1');
  const [contextMenu, setContextMenu] = useState<ContextMenu>({ visible: false, x: 0, y: 0, procedureId: '' });
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showListOrderModal, setShowListOrderModal] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Theatre list matching dashboard
  const theatres = [
    'Main Theatre 1',
    'Main Theatre 3',
    'Main Theatre 4',
    'Main Theatre 5',
    'Main Theatre 6',
    'Main Theatre 7',
    'Main Theatre 8'
  ];

  // Mock data matching the dashboard - November 3, 2024
  const [procedures, setProcedures] = useState<Procedure[]>([
    {
      id: 'p1',
      listOrder: 1,
      theatre: 'Main Theatre 1',
      scheduledTime: '08:00',
      estimatedDuration: 150,
      procedureName: 'Total Hip Replacement',
      specialty: 'Elective Orthopaedics',
      surgeon: 'Mr. J. Smith',
      assistant: 'A. Gallagher',
      anaesthetist: 'Dr. F. James',
      anaesNP: 'L. O\'Brien',
      scrubNP: 'RN A. Flores',
      equipment: ['C-Arm', 'Orthopaedic Set', 'Hip Prosthesis'],
      requirements: ['Cell Salvage', 'Blood on standby (2 units)'],
      status: 'completed',
      notes: ['Patient metal allergy - ceramic head used'],
      requests: []
    },
    {
      id: 'p2',
      listOrder: 2,
      theatre: 'Main Theatre 1',
      scheduledTime: '10:30',
      estimatedDuration: 90,
      procedureName: 'Knee Arthroscopy',
      specialty: 'Elective Orthopaedics',
      surgeon: 'Mr. J. Smith',
      assistant: 'A. Gallagher',
      anaesthetist: 'Dr. F. James',
      anaesNP: 'L. O\'Brien',
      scrubNP: 'ODP D. Jordan',
      equipment: ['Arthroscopy Set', 'Video Tower'],
      requirements: ['Tourniquet'],
      status: 'in-progress',
      notes: [],
      requests: []
    },
    {
      id: 'p3',
      listOrder: 3,
      theatre: 'Main Theatre 1',
      scheduledTime: '12:30',
      estimatedDuration: 120,
      procedureName: 'Total Knee Replacement',
      specialty: 'Elective Orthopaedics',
      surgeon: 'Mr. J. Smith',
      assistant: 'A. Gallagher',
      anaesthetist: 'Dr. F. James',
      anaesNP: 'L. O\'Brien',
      scrubNP: 'RN A. Flores',
      equipment: ['C-Arm', 'Orthopaedic Set', 'Knee Prosthesis'],
      requirements: ['Cell Salvage', 'Tourniquet'],
      status: 'scheduled',
      notes: [],
      requests: []
    },
    {
      id: 'p4',
      listOrder: 1,
      theatre: 'Main Theatre 3',
      scheduledTime: '08:00',
      estimatedDuration: 330,
      procedureName: 'CABG x4',
      specialty: 'Cardiac Surgery',
      surgeon: 'Mr. R. Johnson',
      assistant: 'T. Wilson',
      anaesthetist: 'Dr. B. Thompson',
      anaesNP: 'H. Adams',
      scrubNP: 'RN M. Garcia',
      equipment: ['Heart-Lung Machine', 'Cardiac Set', 'Vein Harvesting Kit'],
      requirements: ['ICU bed confirmed', 'Blood products on standby (6 units)', 'Cell Salvage'],
      status: 'in-progress',
      notes: ['Complex case - 4 vessel disease'],
      requests: []
    },
    {
      id: 'p5',
      listOrder: 2,
      theatre: 'Main Theatre 3',
      scheduledTime: '14:30',
      estimatedDuration: 180,
      procedureName: 'Aortic Valve Replacement',
      specialty: 'Cardiac Surgery',
      surgeon: 'Mr. R. Johnson',
      assistant: 'T. Wilson',
      anaesthetist: 'Dr. B. Thompson',
      anaesNP: 'H. Adams',
      scrubNP: 'RN L. Brown',
      equipment: ['Heart-Lung Machine', 'Cardiac Set', 'Valve Sizer Set'],
      requirements: ['ICU bed confirmed', 'Blood products on standby (4 units)'],
      status: 'scheduled',
      notes: [],
      requests: []
    },
    {
      id: 'p6',
      listOrder: 1,
      theatre: 'Main Theatre 5',
      scheduledTime: '09:00',
      estimatedDuration: 120,
      procedureName: 'Right Hemicolectomy',
      specialty: 'Colorectal Surgery',
      surgeon: 'Ms. K. Davies',
      assistant: 'P. Martinez',
      anaesthetist: 'Dr. S. Patel',
      anaesNP: 'N. Hughes',
      scrubNP: 'RN C. Evans',
      equipment: ['Laparoscopic Tower', 'Energy Device', 'Stapling Devices'],
      requirements: ['HDU bed on standby'],
      status: 'completed',
      notes: [],
      requests: []
    },
    {
      id: 'p7',
      listOrder: 2,
      theatre: 'Main Theatre 5',
      scheduledTime: '12:00',
      estimatedDuration: 150,
      procedureName: 'Anterior Resection',
      specialty: 'Colorectal Surgery',
      surgeon: 'Ms. K. Davies',
      assistant: 'P. Martinez',
      anaesthetist: 'Dr. S. Patel',
      anaesNP: 'N. Hughes',
      scrubNP: 'RN M. Taylor',
      equipment: ['Laparoscopic Tower', 'Energy Device', 'Stapling Devices'],
      requirements: ['Stoma nurse review', 'HDU bed confirmed'],
      status: 'in-progress',
      notes: ['Complex case - extensive adhesions expected'],
      requests: []
    },
    {
      id: 'p8',
      listOrder: 3,
      theatre: 'Main Theatre 5',
      scheduledTime: '15:00',
      estimatedDuration: 90,
      procedureName: 'Inguinal Hernia Repair',
      specialty: 'General Surgery',
      surgeon: 'Ms. K. Davies',
      assistant: 'P. Martinez',
      anaesthetist: 'Dr. S. Patel',
      anaesNP: 'N. Hughes',
      scrubNP: 'RN C. Evans',
      equipment: ['Basic Laparoscopic Set'],
      requirements: [],
      status: 'scheduled',
      notes: [],
      requests: []
    }
  ]);

  // Generate calendar days for the full month
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get starting day (Sunday of the week containing the 1st)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Get ending day (Saturday of the week containing the last day)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const calendarDays = getCalendarDays();

  // Get procedures for a specific date and selected theatre
  const getProceduresForDay = (date: Date) => {
    const isToday = date.toDateString() === TODAY.toDateString();
    if (isToday) {
      return procedures.filter(p => p.theatre === selectedTheatre);
    }
    return [];
  };

  const getProcedureCountByDay = (date: Date) => {
    const isToday = date.toDateString() === TODAY.toDateString();
    if (isToday) {
      const theatreProcs = procedures.filter(p => p.theatre === selectedTheatre);
      return theatreProcs.length;
    }
    // For other days in November, return mock counts based on theatre
    if (date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear()) {
      const dayOfWeek = date.getDay();
      // Weekends (0 = Sunday, 6 = Saturday) have fewer or no procedures
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return selectedTheatre === 'Main Theatre 5' ? Math.floor(Math.random() * 3) + 1 : 0; // Emergency theatre only
      }
      return Math.floor(Math.random() * 4) + 2; // 2-5 procedures on weekdays
    }
    return 0;
  };

  const getSurgeonsForDay = (date: Date) => {
    const theatreProcs = procedures.filter(p => p.theatre === selectedTheatre);
    if (theatreProcs.length > 0) {
      return Array.from(new Set(theatreProcs.map(p => p.surgeon)));
    }
    // Return surgeon based on selected theatre (from dashboard)
    const theatreSurgeonMap: Record<string, string> = {
      'Main Theatre 1': 'Mr. J. Smith',
      'Main Theatre 3': 'Mr. R. Johnson',
      'Main Theatre 4': 'Mr. A. Robertson',
      'Main Theatre 5': 'Ms. I. Moore',
      'Main Theatre 6': 'Mr. P. Wright',
      'Main Theatre 7': 'Ms. V. Edwards',
      'Main Theatre 8': 'Ms. B. Morgan'
    };
    return [theatreSurgeonMap[selectedTheatre] || 'TBC'];
  };

  const getAnaesthetistsForDay = (date: Date) => {
    const theatreProcs = procedures.filter(p => p.theatre === selectedTheatre);
    if (theatreProcs.length > 0) {
      return Array.from(new Set(theatreProcs.map(p => p.anaesthetist)));
    }
    // Return anaesthetist based on selected theatre (from dashboard)
    const theatreAnaesthetistMap: Record<string, string> = {
      'Main Theatre 1': 'Dr. F. James',
      'Main Theatre 3': 'Dr. B. Thompson',
      'Main Theatre 4': 'Dr. D. Mitchell',
      'Main Theatre 5': 'Dr. K. Baker',
      'Main Theatre 6': 'Dr. R. Phillips',
      'Main Theatre 7': 'Dr. X. Morris',
      'Main Theatre 8': 'Dr. D. Murphy'
    };
    return [theatreAnaesthetistMap[selectedTheatre] || 'TBC'];
  };

  const handleDayClick = (day: Date) => {
    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
    if (!isCurrentMonth) return; // Don't open modal for days outside current month

    setSelectedDayData(day);
    setSelectedDate(day);
    setShowDayModal(true);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Get unique values for filter dropdowns
  const surgeons = Array.from(new Set(procedures.map(p => p.surgeon))).sort();
  const anaesthetists = Array.from(new Set(procedures.map(p => p.anaesthetist))).sort();
  const procedureNames = Array.from(new Set(procedures.map(p => p.procedureName))).sort();
  const allEquipment = Array.from(new Set(procedures.flatMap(p => p.equipment))).sort();
  const allRequirements = Array.from(new Set(procedures.flatMap(p => p.requirements))).sort();
  const allStaff = Array.from(new Set([...surgeons, ...anaesthetists])).sort();

  // Filter procedures based on selected criteria and global filter
  const filteredProcedures = procedures.filter(proc => {
    // Apply global filter (for all views)
    if (globalFilter) {
      const filterLower = globalFilter.toLowerCase();
      const matchesGlobal =
        proc.procedureName.toLowerCase().includes(filterLower) ||
        proc.specialty.toLowerCase().includes(filterLower) ||
        proc.theatre.toLowerCase().includes(filterLower) ||
        proc.surgeon.toLowerCase().includes(filterLower) ||
        proc.anaesthetist.toLowerCase().includes(filterLower) ||
        proc.assistant.toLowerCase().includes(filterLower) ||
        proc.anaesNP.toLowerCase().includes(filterLower) ||
        proc.scrubNP.toLowerCase().includes(filterLower) ||
        proc.equipment.some(eq => eq.toLowerCase().includes(filterLower)) ||
        proc.requirements.some(req => req.toLowerCase().includes(filterLower));
      if (!matchesGlobal) return false;
    }

    // Apply search term (for list view)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        proc.procedureName.toLowerCase().includes(searchLower) ||
        proc.specialty.toLowerCase().includes(searchLower) ||
        proc.theatre.toLowerCase().includes(searchLower) ||
        proc.surgeon.toLowerCase().includes(searchLower) ||
        proc.anaesthetist.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (filterType !== 'all' && filterValue) {
      switch (filterType) {
        case 'surgeon':
          return proc.surgeon === filterValue;
        case 'anaesthetist':
          return proc.anaesthetist === filterValue;
        case 'procedure':
          return proc.procedureName === filterValue;
        case 'equipment':
          return proc.equipment.includes(filterValue);
        case 'requirement':
          return proc.requirements.includes(filterValue);
        case 'staff':
          return proc.surgeon === filterValue || proc.anaesthetist === filterValue;
        default:
          return true;
      }
    }
    return true;
  }).sort((a, b) => {
    if (a.theatre !== b.theatre) {
      return a.theatre.localeCompare(b.theatre);
    }
    return a.listOrder - b.listOrder;
  });

  const proceduresByTheatre = filteredProcedures.reduce((acc, proc) => {
    if (!acc[proc.theatre]) {
      acc[proc.theatre] = [];
    }
    acc[proc.theatre].push(proc);
    return acc;
  }, {} as Record<string, Procedure[]>);

  const handleDragStart = (e: React.DragEvent, procedureId: string) => {
    setDraggedItem(procedureId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetProcedureId: string, targetTheatre: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetProcedureId) return;

    const draggedProc = procedures.find(p => p.id === draggedItem);
    const targetProc = procedures.find(p => p.id === targetProcedureId);

    if (!draggedProc || !targetProc) return;

    if (draggedProc.theatre !== targetTheatre) {
      setDraggedItem(null);
      return;
    }

    const updatedProcedures = [...procedures];
    const draggedIndex = updatedProcedures.findIndex(p => p.id === draggedItem);
    const targetIndex = updatedProcedures.findIndex(p => p.id === targetProcedureId);

    const draggedOrder = updatedProcedures[draggedIndex].listOrder;
    updatedProcedures[draggedIndex].listOrder = updatedProcedures[targetIndex].listOrder;
    updatedProcedures[targetIndex].listOrder = draggedOrder;

    setProcedures(updatedProcedures);
    setDraggedItem(null);
  };

  const handleContextMenu = (e: React.MouseEvent, procedure: Procedure) => {
    e.preventDefault();

    const menuWidth = 220;
    const menuHeight = 180;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > windowWidth) {
      x = windowWidth - menuWidth - 10;
    }

    if (y + menuHeight > windowHeight) {
      y = windowHeight - menuHeight - 10;
    }

    setContextMenu({
      visible: true,
      x,
      y,
      procedureId: procedure.id
    });
    setSelectedProcedure(procedure);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu({ visible: false, x: 0, y: 0, procedureId: '' });
      }
    };

    if (contextMenu.visible) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.visible]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'delayed':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getFilterOptions = () => {
    switch (filterType) {
      case 'surgeon':
        return surgeons;
      case 'anaesthetist':
        return anaesthetists;
      case 'procedure':
        return procedureNames;
      case 'equipment':
        return allEquipment;
      case 'requirement':
        return allRequirements;
      case 'staff':
        return allStaff;
      default:
        return [];
    }
  };

  // Render calendar grid
  const renderCalendar = () => {
    // Get theatre info for header
    const theatreProcs = procedures.filter(p => p.theatre === selectedTheatre);
    const theatreSurgeon = theatreProcs.length > 0 ? theatreProcs[0].surgeon : '';
    const theatreAnaesthetist = theatreProcs.length > 0 ? theatreProcs[0].anaesthetist : '';
    const theatreSpecialty = theatreProcs.length > 0 ? theatreProcs[0].specialty : '';

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Theatre Selector */}
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">Select Theatre</h3>
            <select
              value={selectedTheatre}
              onChange={(e) => setSelectedTheatre(e.target.value)}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium outline-none cursor-pointer"
            >
              {theatres.map((theatre) => (
                <option key={theatre} value={theatre}>{theatre}</option>
              ))}
            </select>
          </div>
          {theatreProcs.length > 0 && (
            <div className="flex items-center space-x-4 text-sm text-blue-100">
              <div className="flex items-center space-x-1">
                <span className="font-medium">Specialty:</span>
                <span>{theatreSpecialty}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <span className="font-medium">👨‍⚕️ Surgeon:</span>
                <span>{theatreSurgeon}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <span className="font-medium">💉 Anaesthetist:</span>
                <span>{theatreAnaesthetist}</span>
              </div>
            </div>
          )}
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, idx) => {
          const isToday = day.toDateString() === TODAY.toDateString();
          const isSelected = day.toDateString() === selectedDate.toDateString();
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const dayProcedures = getProceduresForDay(day);
          const procedureCount = getProcedureCountByDay(day);

          // Check if this day has procedures matching the filter
          const hasMatchingProcedures = globalFilter && dayProcedures.length > 0 && dayProcedures.some(proc => {
            const filterLower = globalFilter.toLowerCase();
            return proc.procedureName.toLowerCase().includes(filterLower) ||
                   proc.specialty.toLowerCase().includes(filterLower) ||
                   proc.surgeon.toLowerCase().includes(filterLower) ||
                   proc.anaesthetist.toLowerCase().includes(filterLower) ||
                   proc.equipment.some(eq => eq.toLowerCase().includes(filterLower)) ||
                   proc.requirements.some(req => req.toLowerCase().includes(filterLower));
          });

          const surgeons = dayProcedures.length > 0 ? Array.from(new Set(dayProcedures.map(p => p.surgeon))) : getSurgeonsForDay(day);
          const anaesthetists = dayProcedures.length > 0 ? Array.from(new Set(dayProcedures.map(p => p.anaesthetist))) : getAnaesthetistsForDay(day);
          const specialties = dayProcedures.length > 0 ? Array.from(new Set(dayProcedures.map(p => p.specialty))) : [];

          return (
            <div
              key={idx}
              onClick={() => handleDayClick(day)}
              className={`min-h-[140px] p-2 rounded-lg border-2 transition-all ${
                !isCurrentMonth
                  ? 'bg-gray-50 border-gray-100 text-gray-400'
                  : hasMatchingProcedures
                  ? 'border-yellow-500 bg-yellow-50 cursor-pointer hover:shadow-md ring-2 ring-yellow-300'
                  : isSelected
                  ? 'border-blue-600 bg-blue-50 cursor-pointer hover:shadow-md'
                  : isToday
                  ? 'border-green-500 bg-green-50 cursor-pointer hover:shadow-md'
                  : 'border-gray-200 cursor-pointer hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="text-right mb-2">
                <span className={`text-sm font-bold ${isToday ? 'text-green-700' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                  {day.getDate()}
                </span>
              </div>

              {isCurrentMonth && procedureCount > 0 && (
                <div className="space-y-1">
                  <div className={`rounded px-1.5 py-0.5 ${hasMatchingProcedures ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                    <p className={`text-xs font-semibold ${hasMatchingProcedures ? 'text-yellow-900' : 'text-blue-900'}`}>
                      {procedureCount} {procedureCount === 1 ? 'Procedure' : 'Procedures'}
                    </p>
                  </div>
                  {specialties.length > 0 && (
                    <div className="text-xs text-gray-700 font-medium truncate">
                      {specialties[0]}
                    </div>
                  )}
                  {surgeons.length > 0 && (
                    <div className="text-xs text-gray-600 truncate">
                      👨‍⚕️ {surgeons[0].split(' ').slice(1).join(' ')}
                    </div>
                  )}
                  {anaesthetists.length > 0 && (
                    <div className="text-xs text-gray-600 truncate">
                      💉 {anaesthetists[0].split(' ').slice(1).join(' ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
  };

  // Render procedure list
  const renderProcedureList = () => (
    <div className="space-y-4">
      {Object.entries(proceduresByTheatre).map(([theatre, theatreProcedures]) => {
        // Get unique specialty, surgeon, and anaesthetist for this theatre
        const specialties = Array.from(new Set(theatreProcedures.map(p => p.specialty)));
        const surgeons = Array.from(new Set(theatreProcedures.map(p => p.surgeon)));
        const anaesthetists = Array.from(new Set(theatreProcedures.map(p => p.anaesthetist)));

        // Calculate session info
        const firstProcedure = theatreProcedures[0];
        const lastProcedure = theatreProcedures[theatreProcedures.length - 1];
        const startTime = firstProcedure.scheduledTime;
        const startHour = parseInt(startTime.split(':')[0]);
        const endHour = parseInt(lastProcedure.scheduledTime.split(':')[0]) + Math.floor(lastProcedure.estimatedDuration / 60);

        // Determine session count: 08:00-18:00 = 2 sessions, 08:00-20:00 = 3 sessions
        let sessionCount = 2;
        if (endHour >= 20) {
          sessionCount = 3;
        }

        const formatTime = (time: string) => {
          const [hours, minutes] = time.split(':');
          const hour = parseInt(hours);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
          return `${displayHour}:${minutes} ${ampm}`;
        };

        const endTime = `${endHour}:00`;
        const formattedEndTime = formatTime(endTime);

        return (
          <div key={theatre} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5" />
                  <h2 className="font-bold text-lg">{theatre}</h2>
                  <span className="text-blue-100">•</span>
                  <span className="text-sm font-medium">{formatTime(startTime)} to {formattedEndTime}</span>
                  <span className="text-blue-100">•</span>
                  <span className="text-sm font-medium">{sessionCount} Sessions</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-blue-100">
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Specialty:</span>
                  <span>{specialties.join(', ')}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <span className="font-medium">👨‍⚕️ Surgeon:</span>
                  <span>{surgeons.join(', ')}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <span className="font-medium">💉 Anaesthetist:</span>
                  <span>{anaesthetists.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
            {theatreProcedures.map((proc) => (
              <div
                key={proc.id}
                draggable
                onDragStart={(e) => handleDragStart(e, proc.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, proc.id, theatre)}
                onContextMenu={(e) => handleContextMenu(e, proc)}
                className={`p-3 hover:bg-gray-50 transition-colors cursor-move ${
                  draggedItem === proc.id ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">
                      {proc.listOrder}
                    </div>
                  </div>

                  <div className="w-16 flex-shrink-0">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <Clock className="w-3 h-3 mr-1" />
                      {proc.scheduledTime}
                    </div>
                    <p className="text-xs text-gray-500">{proc.estimatedDuration}m</p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-sm text-gray-900">{proc.procedureName}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(proc.status)}`}>
                        {proc.status.replace('-', ' ')}
                      </span>
                      {proc.requirements.length > 0 && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                          {proc.requirements[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <button
                      onClick={(e) => handleContextMenu(e as any, proc)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {proc.notes.length > 0 && (
                  <div className="ml-12 mt-2">
                    {proc.notes.map((note, idx) => (
                      <div key={idx} className="flex items-start text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded">
                        <MessageSquare className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    })}

      {filteredProcedures.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No procedures found</h3>
          <p className="text-gray-600">
            {searchTerm || filterValue || globalFilter
              ? 'Try adjusting your search or filter criteria'
              : 'No procedures scheduled for this date'}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Theatre Schedule</h1>
            <p className="text-gray-600">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded flex items-center space-x-2 text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded flex items-center space-x-2 text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('panel')}
              className={`hidden lg:flex px-4 py-2 rounded items-center space-x-2 text-sm font-medium transition-colors ${
                viewMode === 'panel'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Columns className="w-4 h-4" />
              <span>Panel</span>
            </button>
          </div>
        </div>

        {/* Global Filter - Available in All Views */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Filter by surgeon, anaesthetist, procedure, specialty, equipment, requirements..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="flex-1 outline-none text-sm"
                />
                {globalFilter && (
                  <button
                    onClick={() => setGlobalFilter('')}
                    className="ml-2 p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
            {globalFilter && (
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{filteredProcedures.length}</span> of {procedures.length} procedures match
              </div>
            )}
          </div>
          {globalFilter && viewMode === 'calendar' && (
            <p className="text-xs text-yellow-700 mt-2 flex items-center">
              <Filter className="w-3 h-3 mr-1" />
              Matching dates are highlighted in yellow on the calendar
            </p>
          )}
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && renderCalendar()}

      {/* List View */}
      {viewMode === 'list' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="flex-1 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
                <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white">
                  <Search className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Procedure, surgeon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Filter By</label>
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value as any);
                    setFilterValue('');
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-sm outline-none"
                >
                  <option value="all">All Procedures</option>
                  <option value="surgeon">Surgeon</option>
                  <option value="anaesthetist">Anaesthetist</option>
                  <option value="procedure">Procedure Type</option>
                  <option value="equipment">Equipment</option>
                  <option value="requirement">Special Requirement</option>
                  <option value="staff">Any Staff Member</option>
                </select>
              </div>

              {filterType !== 'all' && (
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Select {filterType}</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-sm text-left flex items-center justify-between"
                    >
                      <span className={filterValue ? 'text-gray-900' : 'text-gray-400'}>
                        {filterValue || `Select ${filterType}...`}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {showFilterDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div
                          onClick={() => {
                            setFilterValue('');
                            setShowFilterDropdown(false);
                          }}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-500"
                        >
                          Clear filter
                        </div>
                        {getFilterOptions().map((option, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setFilterValue(option);
                              setShowFilterDropdown(false);
                            }}
                            className={`px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm ${
                              filterValue === option ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {renderProcedureList()}
        </>
      )}

      {/* Panel View */}
      {viewMode === 'panel' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Calendar - Left Side (40%) */}
          <div className="col-span-5">
            {renderCalendar()}
          </div>

          {/* List - Right Side (60%) */}
          <div className="col-span-7">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredProcedures.length}</span> procedures
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <GripVertical className="w-4 h-4" />
                <span>Drag to reorder</span>
              </div>
            </div>
            {renderProcedureList()}
          </div>
        </div>
      )}

      {/* Day Detail Modal */}
      {showDayModal && selectedDayData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {selectedDayData.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {getProcedureCountByDay(selectedDayData)} procedures in {selectedTheatre}
                </p>
              </div>
              <button
                onClick={() => setShowDayModal(false)}
                className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              {getProceduresForDay(selectedDayData).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(
                    getProceduresForDay(selectedDayData).reduce((acc, proc) => {
                      if (!acc[proc.theatre]) acc[proc.theatre] = [];
                      acc[proc.theatre].push(proc);
                      return acc;
                    }, {} as Record<string, Procedure[]>)
                  ).map(([theatre, procs]) => (
                    <div key={theatre} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-blue-600 text-white px-4 py-2 font-bold">
                        {theatre}
                      </div>
                      <div className="divide-y divide-gray-200">
                        {procs.map((proc) => (
                          <div key={proc.id} className="p-3 hover:bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-sm">{proc.scheduledTime}</span>
                                <span className="text-gray-500">•</span>
                                <span className="font-semibold">{proc.procedureName}</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(proc.status)}`}>
                                  {proc.status}
                                </span>
                              </div>
                              <span className="text-sm text-gray-600">{proc.estimatedDuration} min</span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>👨‍⚕️ {proc.surgeon} • 💉 {proc.anaesthetist}</p>
                              {proc.requirements.length > 0 && (
                                <p className="text-xs">
                                  {proc.requirements.map((req, idx) => (
                                    <span key={idx} className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 rounded mr-1">
                                      {req}
                                    </span>
                                  ))}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No procedures scheduled</h3>
                  <p className="text-gray-600">There are no procedures for this date</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          style={{
            position: 'fixed',
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            zIndex: 1000
          }}
          className="bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[200px]"
        >
          <button
            onClick={() => {
              setShowListOrderModal(true);
              setContextMenu({ visible: false, x: 0, y: 0, procedureId: '' });
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
          >
            <ListOrdered className="w-4 h-4 text-gray-600" />
            <span>Change List Order</span>
          </button>
          <button
            onClick={() => {
              setShowTeamModal(true);
              setContextMenu({ visible: false, x: 0, y: 0, procedureId: '' });
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
          >
            <Users className="w-4 h-4 text-gray-600" />
            <span>View Team & Requirements</span>
          </button>
          <div className="border-t border-gray-200 my-1"></div>
          <button
            onClick={() => {
              console.log('Add note for', contextMenu.procedureId);
              setContextMenu({ visible: false, x: 0, y: 0, procedureId: '' });
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4 text-gray-600" />
            <span>Add Note</span>
          </button>
          <button
            onClick={() => {
              console.log('Add request for', contextMenu.procedureId);
              setContextMenu({ visible: false, x: 0, y: 0, procedureId: '' });
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
          >
            <ClipboardList className="w-4 h-4 text-gray-600" />
            <span>Add Request</span>
          </button>
        </div>
      )}

      {/* Team Modal */}
      {showTeamModal && selectedProcedure && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Team & Requirements</h2>
              <button onClick={() => setShowTeamModal(false)} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{selectedProcedure.procedureName}</h3>
                <p className="text-sm text-gray-600">
                  {selectedProcedure.theatre} • {selectedProcedure.scheduledTime} • {selectedProcedure.estimatedDuration} min
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Team Members</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Surgeon:</span>
                    <span className="font-medium">{selectedProcedure.surgeon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assistant:</span>
                    <span className="font-medium">{selectedProcedure.assistant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Anaesthetist:</span>
                    <span className="font-medium">{selectedProcedure.anaesthetist}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Anaes N/P:</span>
                    <span className="font-medium">{selectedProcedure.anaesNP}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scrub N/P:</span>
                    <span className="font-medium">{selectedProcedure.scrubNP}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Equipment Required</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProcedure.equipment.map((eq, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
              {selectedProcedure.requirements.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Special Requirements</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProcedure.requirements.map((req, idx) => (
                      <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List Order Modal */}
      {showListOrderModal && selectedProcedure && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Change List Order</h2>
              <button onClick={() => setShowListOrderModal(false)} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Change the list order for: <span className="font-medium">{selectedProcedure.procedureName}</span>
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Position: {selectedProcedure.listOrder}
                </label>
                <input
                  type="number"
                  min="1"
                  defaultValue={selectedProcedure.listOrder}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowListOrderModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowListOrderModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
