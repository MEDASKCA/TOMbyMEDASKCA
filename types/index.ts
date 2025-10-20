// TOM - Theatre Operations Manager
// Comprehensive TypeScript Types

// ============================================
// ENUMS & STATUS TYPES
// ============================================

export type TheatreStatus = 'ready' | 'in-use' | 'cleaning' | 'maintenance' | 'emergency';
export type ShiftType = 'early' | 'late' | 'long-day' | 'on-call' | 'night';
export type StaffRole = 'surgeon' | 'anesthetist' | 'scrub-nurse' | 'odp' | 'recovery-nurse' | 'hca' | 'coordinator';
export type StaffGrade = 'consultant' | 'registrar' | 'staff-nurse' | 'senior-nurse' | 'junior' | 'assistant';
export type CaseStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'delayed';
export type ItemCategory = 'instrument' | 'consumable' | 'equipment' | 'drug' | 'implant';
export type SterilizationStatus = 'clean' | 'dirty' | 'in-process' | 'sterile' | 'expired';
export type ReadinessLevel = 'ready' | 'warning' | 'not-ready';

// ============================================
// CORE ENTITIES
// ============================================

export interface Theatre {
  id: string;
  name: string;
  number: number;
  specialty: string;
  status: TheatreStatus;
  location: string;
  capacity: number;
  equipment: string[]; // IDs of permanently assigned equipment
  features: string[]; // e.g., 'laminar-flow', 'imaging-capable'
  currentCase?: string; // Case ID
  nextCase?: string; // Case ID
  createdAt: Date;
  updatedAt: Date;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: StaffRole;
  grade: StaffGrade;
  specialties: string[];
  competencies: Competency[];
  availability: StaffAvailability;
  photoURL?: string;
  phoneNumber?: string;
  employeeNumber: string;
  department: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Competency {
  procedureId?: string;
  procedureName: string;
  level: 'learning' | 'assisted' | 'competent' | 'expert';
  certifiedDate?: Date;
  expiryDate?: Date;
  assessorName?: string;
  equipmentFamiliarity?: string[]; // Equipment IDs
  supplierTraining?: string[]; // Supplier IDs
}

export interface StaffAvailability {
  [date: string]: { // YYYY-MM-DD
    available: boolean;
    reason?: string; // 'leave', 'sick', 'training', etc.
    shifts?: ShiftType[];
  };
}

export interface Shift {
  id: string;
  staffId: string;
  theatreId?: string;
  date: string; // YYYY-MM-DD
  type: ShiftType;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  role: StaffRole;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  swapRequest?: ShiftSwapRequest;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShiftSwapRequest {
  requestedBy: string; // Staff ID
  requestedWith?: string; // Staff ID (if specific person)
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string; // Manager ID
  reviewedAt?: Date;
}

// ============================================
// PROCEDURES & CASES
// ============================================

export interface ProcedureCard {
  id: string;
  name: string;
  specialty: string;
  code?: string; // OPCS code
  description: string;
  expectedDuration: number; // minutes
  requiredStaff: RequiredStaffRole[];
  requiredEquipment: RequiredItem[];
  requiredConsumables: RequiredItem[];
  requiredImplants?: RequiredItem[];
  specialRequirements?: string[];
  riskLevel: 'low' | 'medium' | 'high';
  anesthesiaType: 'local' | 'general' | 'regional' | 'sedation';
  postOpCare: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequiredStaffRole {
  role: StaffRole;
  grade?: StaffGrade;
  count: number;
  requiredCompetency?: string;
}

export interface RequiredItem {
  itemId?: string;
  itemName: string;
  quantity: number;
  isCritical: boolean;
  alternatives?: string[]; // Alternative item IDs
}

export interface Case {
  id: string;
  theatreId: string;
  procedureId: string;
  procedureName: string;
  date: string; // YYYY-MM-DD
  scheduledStartTime: string; // HH:MM
  scheduledEndTime: string; // HH:MM
  actualStartTime?: string;
  actualEndTime?: string;
  status: CaseStatus;
  patientId?: string; // Anonymized or reference
  surgeonId: string;
  anesthetistId: string;
  teamIds: string[]; // Staff IDs
  notes?: string;
  specialRequirements?: string[];
  isEmergency: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// INVENTORY & EQUIPMENT
// ============================================

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  subcategory?: string;
  description?: string;
  manufacturer?: string;
  supplierId?: string;
  udi?: string; // Universal Device Identifier
  catalogNumber?: string;
  batchNumber?: string;
  quantity: number;
  minQuantity: number;
  unit: string; // 'pcs', 'box', 'kit', etc.
  location: string;
  sublocation?: string; // Specific shelf, drawer, etc.
  cost?: number;
  expiryDate?: Date;
  sterilizationStatus?: SterilizationStatus;
  lastSterilized?: Date;
  isTracked: boolean; // Individual tracking vs batch
  isCritical: boolean;
  linkedProcedures?: string[]; // Procedure IDs
  images?: string[];
  documents?: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InstrumentTray {
  id: string;
  name: string;
  code: string;
  specialty: string;
  contents: TrayContent[];
  location: string;
  sterilizationStatus: SterilizationStatus;
  lastSterilized?: Date;
  nextSterilizationDue?: Date;
  autocycleId?: string;
  condition: 'excellent' | 'good' | 'fair' | 'needs-repair';
  maintenanceHistory: MaintenanceRecord[];
  linkedProcedures: string[]; // Procedure IDs
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TrayContent {
  itemId: string;
  itemName: string;
  quantity: number;
  isPresent: boolean;
  lastChecked?: Date;
  checkedBy?: string;
}

export interface MaintenanceRecord {
  date: Date;
  type: 'routine' | 'repair' | 'replacement';
  description: string;
  performedBy: string;
  cost?: number;
  nextDueDate?: Date;
}

export interface SterilizationCycle {
  id: string;
  autocycleNumber: string;
  autoclaveId: string;
  date: Date;
  startTime: string;
  endTime: string;
  temperature: number;
  pressure: number;
  duration: number; // minutes
  itemIds: string[]; // Tray/item IDs
  status: 'pass' | 'fail';
  testResults?: string;
  operatorId: string;
  notes?: string;
  createdAt: Date;
}

export interface UsageLog {
  id: string;
  itemId: string;
  caseId?: string;
  theatreId: string;
  quantity: number;
  usedBy: string; // Staff ID
  usedAt: Date;
  returned: boolean;
  returnedAt?: Date;
  notes?: string;
}

// ============================================
// SUPPLIERS & DIRECTORY
// ============================================

export interface Supplier {
  id: string;
  name: string;
  type: 'consumables' | 'implants' | 'equipment' | 'pharmaceuticals' | 'services';
  contactName?: string;
  email?: string;
  phone?: string;
  address?: Address;
  website?: string;
  accountNumber?: string;
  paymentTerms?: string;
  products: string[]; // Product IDs
  contracts?: Contract[];
  representatives: Representative[];
  documents: Document[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Representative {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  territory?: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  startDate: Date;
  endDate: Date;
  value?: number;
  terms: string;
  documentUrl?: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'ifu' | 'msds' | 'certificate' | 'spec-sheet' | 'invoice' | 'other';
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
  expiryDate?: Date;
}

// ============================================
// ANALYTICS & REPORTING
// ============================================

export interface TheatreMetrics {
  theatreId: string;
  date: string;
  utilizationRate: number; // percentage
  casesCompleted: number;
  casesScheduled: number;
  casesCancelled: number;
  averageTurnoverTime: number; // minutes
  firstCaseStartDelay: number; // minutes
  totalOperatingTime: number; // minutes
}

export interface StaffMetrics {
  staffId: string;
  month: string; // YYYY-MM
  shiftsScheduled: number;
  shiftsCompleted: number;
  hoursWorked: number;
  overtimeHours: number;
  casesParticipated: number;
}

export interface InventoryMetrics {
  itemId: string;
  month: string;
  quantityUsed: number;
  averageUsagePerCase: number;
  stockOuts: number;
  wasteCount: number;
  cost: number;
}

// ============================================
// AUDIT & COMPLIANCE
// ============================================

export interface AuditForm {
  id: string;
  name: string;
  category: 'safety' | 'infection-control' | 'equipment' | 'compliance' | 'other';
  questions: AuditQuestion[];
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'ad-hoc';
  assignedTo?: string[]; // Staff IDs or roles
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditQuestion {
  id: string;
  question: string;
  type: 'yes-no' | 'text' | 'number' | 'multiple-choice' | 'checklist';
  options?: string[];
  isRequired: boolean;
  requiresEvidence?: boolean; // Photo/document
}

export interface AuditResponse {
  id: string;
  formId: string;
  date: Date;
  completedBy: string;
  theatreId?: string;
  responses: {
    questionId: string;
    answer: any;
    evidence?: string[]; // URLs
    notes?: string;
  }[];
  status: 'draft' | 'submitted' | 'reviewed';
  reviewedBy?: string;
  reviewedAt?: Date;
  overallRating?: 'excellent' | 'good' | 'satisfactory' | 'needs-improvement';
}

// ============================================
// NOTIFICATIONS & ALERTS
// ============================================

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'schedule' | 'roster' | 'inventory' | 'equipment' | 'case' | 'system';
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: Date;
  expiresAt?: Date;
}

export interface Alert {
  id: string;
  type: 'staffing-gap' | 'low-stock' | 'equipment-unavailable' | 'delay' | 'cancellation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affectedEntity: {
    type: 'theatre' | 'case' | 'staff' | 'item';
    id: string;
  };
  suggestedActions?: string[];
  resolvedAt?: Date;
  resolvedBy?: string;
  createdAt: Date;
}

// ============================================
// AI & OPTIMIZATION
// ============================================

export interface AllocationSuggestion {
  caseId: string;
  suggestedTeam: {
    role: StaffRole;
    staffId: string;
    staffName: string;
    matchScore: number; // 0-100
    reasons: string[];
  }[];
  confidence: number; // 0-100
  alternatives: {
    role: StaffRole;
    options: {
      staffId: string;
      staffName: string;
      matchScore: number;
    }[];
  }[];
  warnings?: string[];
}

export interface ForecastPrediction {
  type: 'staffing' | 'inventory' | 'utilization';
  period: string; // Date range
  predictions: {
    date: string;
    value: number;
    confidence: number;
    factors: string[];
  }[];
  recommendations: string[];
}

// ============================================
// UI STATE & FILTERS
// ============================================

export interface TheatreFilters {
  status?: TheatreStatus[];
  specialty?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface StaffFilters {
  role?: StaffRole[];
  grade?: StaffGrade[];
  specialty?: string[];
  availability?: 'available' | 'unavailable' | 'all';
}

export interface InventoryFilters {
  category?: ItemCategory[];
  location?: string[];
  status?: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expiring-soon';
  critical?: boolean;
}

// ============================================
// READINESS CHECKS
// ============================================

export interface ReadinessCheck {
  theatreId: string;
  caseId: string;
  timestamp: Date;
  overall: ReadinessLevel;
  checks: {
    category: 'staffing' | 'equipment' | 'consumables' | 'environment';
    status: ReadinessLevel;
    items: {
      name: string;
      required: boolean | number;
      actual: boolean | number;
      status: ReadinessLevel;
      notes?: string;
    }[];
  }[];
}
