// Theatre Operations Management Types

// ===== STAFF TYPES =====
export interface StaffMember {
  id: string;
  name: string;
  role: 'Anaes N/P' | 'Scrub N/P' | 'HCA' | 'Recovery Nurse' | 'ODP' | 'Consultant Anaesthetist' | 'Consultant Surgeon';
  department: 'Main Theatres' | 'DSU Theatres' | 'Recovery' | 'Anaesthetics';
  theatre?: string;
  shiftStart?: string;
  shiftEnd?: string;
  hoursWorked?: number;
  competencies?: string[];
  employmentType: 'permanent' | 'bank' | 'agency' | 'locum';
  contactNumber?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaffBreak {
  id: string;
  staffId: string;
  type: 'tea' | 'lunch' | 'supper';
  startTime: string;
  duration: number; // minutes
  authorizedBy: string;
  authorizedByRole: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  date: string; // YYYY-MM-DD
  createdAt: Date;
}

export interface ReliefRequest {
  id: string;
  requestedBy: string; // staffId
  requestedByName: string;
  requestedByRole: string;
  theatre: string;
  reason: string;
  duration: number; // minutes
  urgency: 'routine' | 'urgent' | 'emergency';
  requestedAt: Date;
  status: 'pending' | 'acknowledged' | 'deployed' | 'completed' | 'cancelled';
  deployedStaffId?: string;
  deployedStaffName?: string;
  acknowledgedAt?: Date;
  completedAt?: Date;
  notes?: string;
}

export interface SickLeave {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  department: string;
  reason: string;
  startDate: string; // YYYY-MM-DD
  expectedReturn: string; // YYYY-MM-DD
  actualReturn?: string; // YYYY-MM-DD
  status: 'active' | 'returned' | 'extended';
  coverStaffId?: string;
  coverStaffName?: string;
  episodesThisYear: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LateArrival {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  assignedTheatre: string;
  scheduledStart: string; // HH:mm
  expectedArrival: string; // HH:mm
  actualArrival?: string; // HH:mm
  reason: string;
  coverArranged: boolean;
  coverDetails?: string;
  impact: string;
  date: string; // YYYY-MM-DD
  createdAt: Date;
}

export interface VacantShift {
  id: string;
  role: string;
  department: string;
  theatre?: string;
  date: string; // YYYY-MM-DD
  shiftStart: string; // HH:mm
  shiftEnd: string; // HH:mm
  priority: 'urgent' | 'high' | 'medium' | 'low';
  availableCover: number;
  status: 'open' | 'covered' | 'cancelled';
  coverStaffId?: string;
  coverStaffName?: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== THEATRE TYPES =====
export interface Theatre {
  id: string;
  name: string;
  type: 'Main Theatre' | 'DSU Theatre' | 'Emergency Theatre';
  status: 'active' | 'inactive' | 'maintenance' | 'emergency_only';
  capacity?: number;
  specializations?: string[];
  equipment?: string[];
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Procedure {
  id: string;
  theatreId: string;
  theatreName: string;
  date: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  actualStartTime?: string; // HH:mm
  actualEndTime?: string; // HH:mm
  procedureName: string;
  procedureType: string;
  specialty: string;
  patientMRN: string;
  patientAge?: number;
  surgeonId: string;
  surgeonName: string;
  assistantId?: string;
  assistantName?: string;
  anaesthetistId: string;
  anaesthetistName: string;
  scrubNurseId: string;
  scrubNurseName: string;
  anaesNurseId: string;
  anaesNurseName: string;
  estimatedDuration: number; // minutes
  actualDuration?: number; // minutes
  status: 'scheduled' | 'patient_sent' | 'patient_arrived' | 'pre_op_checks' | 'in_theatre' | 'anaesthetic' | 'surgery' | 'recovery' | 'completed' | 'cancelled';
  priority: 'routine' | 'urgent' | 'emergency';
  notes?: string[];
  timeline?: ProcedureTimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcedureTimelineEvent {
  id: string;
  procedureId: string;
  eventType: 'patient_sent' | 'patient_arrived' | 'pre_op_checks' | 'into_theatre' | 'anaesthetic_start' | 'surgery_start' | 'surgery_end' | 'to_recovery' | 'discharged';
  scheduledTime?: string; // HH:mm
  actualTime?: string; // HH:mm
  status: 'pending' | 'in_progress' | 'completed';
  performedBy?: string;
  notes?: string;
  wardLocation?: string;
  createdAt: Date;
}

export interface TheatreEfficiency {
  id: string;
  theatreId: string;
  theatreName: string;
  date: string; // YYYY-MM-DD
  efficiencyScore: number; // percentage
  targetScore: number; // percentage
  trend: 'improving' | 'stable' | 'worsening';
  casesScheduled: number;
  casesCompleted: number;
  casesInProgress: number;
  casesCancelled: number;
  utilizationRate: number; // percentage
  avgCaseTime: number; // minutes
  avgScheduledTime: number; // minutes
  totalDelayMinutes: number;
  onTimeStarts: number; // percentage
  turnoverTime: number; // average minutes
  targetTurnoverTime: number; // minutes
  factors: EfficiencyFactor[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EfficiencyFactor {
  factor: string;
  score: number; // percentage
  status: 'excellent' | 'good' | 'needs-attention' | 'critical';
}

// ===== INVENTORY TYPES =====
export interface InstrumentItem {
  itemId: string;
  name: string;
  type: string;
  quantity: number;
  category: 'Instruments' | 'Consumables' | 'Containers/Inserts' | 'Wrap' | 'Uncategorized';
}

export interface InventoryItem {
  id: string;
  name: string;
  physicalRef?: string; // Physical reference code (e.g., ZE1030) - what's on the wall
  trayRef?: string; // System reference (e.g., U029310755121) - Synergy Trak internal ID
  instanceId?: string; // Unique instance identifier
  category: string;
  specialty?: string;
  location: string;
  quantity: number;
  minQuantity?: number;
  status: 'available' | 'in_use' | 'sterilizing' | 'maintenance' | 'missing';
  notes?: string;
  facility?: string;
  trayType?: string; // Tray, Loan Tray, Supplementary
  instruments?: InstrumentItem[]; // Checklist of items in this tray
  lastChecked?: Date;
  turnaroundId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Legacy inventory interface (keeping for backwards compatibility)
export interface SimpleInventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  location: string;
  supplier?: string;
  cost?: number;
  expiryDate?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired';
  lastRestocked?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ===== DASHBOARD/ANALYTICS TYPES =====
export interface DashboardStats {
  id: string;
  date: string; // YYYY-MM-DD
  activeTheatres: number;
  totalTheatres: number;
  staffOnDuty: number;
  staffOnBreak: number;
  staffSick: number;
  reliefRequestsPending: number;
  proceduresScheduled: number;
  proceduresCompleted: number;
  overallEfficiency: number;
  averageTurnoverTime: number;
  createdAt: Date;
}

// ===== FIRESTORE COLLECTION NAMES =====
export const COLLECTIONS = {
  STAFF: 'staff',
  STAFF_BREAKS: 'staff_breaks',
  RELIEF_REQUESTS: 'relief_requests',
  SICK_LEAVE: 'sick_leave',
  LATE_ARRIVALS: 'late_arrivals',
  VACANT_SHIFTS: 'vacant_shifts',
  THEATRES: 'theatres',
  PROCEDURES: 'procedures',
  PROCEDURE_TIMELINE: 'procedure_timeline',
  THEATRE_EFFICIENCY: 'theatre_efficiency',
  INVENTORY: 'inventory',
  DASHBOARD_STATS: 'dashboard_stats',
} as const;
