// TOM Marketplace Platform Types
// "LinkedIn + Uber for NHS Healthcare Staffing"

// ===== STAFF PROFILE TYPES =====

export interface StaffProfile {
  id: string;

  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nhsNumber?: string;

  // Professional Details
  role: 'Scrub Nurse' | 'Anaesthetic Nurse' | 'ODP' | 'HCA' | 'Recovery Nurse' | 'Theatre Nurse';
  band: 'Band 3' | 'Band 4' | 'Band 5' | 'Band 6' | 'Band 7' | 'Band 8a' | 'Band 8b';
  employmentType: 'permanent' | 'bank' | 'agency' | 'both';
  yearsExperience: number;

  // Current Employment
  currentTrust?: string;
  currentDepartment?: string;

  // Location
  location: {
    address: string;
    postcode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  // Availability Preferences
  availability: {
    preferredRadius: number; // miles
    preferredShifts: ('early' | 'late' | 'night' | 'long-day')[];
    preferredSpecialties: string[];
    unavailableDates: string[]; // YYYY-MM-DD
    availableDates?: { // Specific dates available for sharing
      date: string; // YYYY-MM-DD
      shiftType: ('early' | 'late' | 'night' | 'long-day')[];
      notes?: string;
    }[];
    sicknessRecords?: {
      startDate: string; // YYYY-MM-DD
      endDate?: string; // YYYY-MM-DD (null if ongoing)
      reason?: 'sickness' | 'injury' | 'other';
      returnToWorkDate?: string;
    }[];
    maxHoursPerWeek?: number;
    minHourlyRate: number;
  };

  // Deep Competencies
  competencies: {
    procedures: ProcedureCompetency[];
    equipment: EquipmentCompetency[];
    surgicalSystems: SurgicalSystemCompetency[];
  };

  // Compliance & Certifications
  compliance: StaffCompliance;

  // Platform Performance
  performance: {
    totalShifts: number;
    completedShifts: number;
    cancelledShifts: number;
    rating: number; // 0-5
    reviews: Review[];
    endorsements: Endorsement[];
  };

  // Settings
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    distanceAlerts: boolean;
    instantBook: boolean; // Auto-accept shifts matching criteria
  };

  // Profile Status
  profileComplete: boolean;
  verified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcedureCompetency {
  id: string;
  procedureName: string;
  specialty: string; // 'Orthopaedics' | 'Cardiac' | 'General' | 'Neurosurgery' | etc
  level: 'training' | 'competent' | 'proficient' | 'expert';
  timesPerformed: number;
  lastPerformed?: Date;
  verifiedBy?: string; // Manager/Line Manager ID
  verifiedByName?: string;
  verifiedDate?: Date;
  notes?: string;
}

export interface EquipmentCompetency {
  id: string;
  equipmentName: string;
  manufacturer: string;
  type: 'operating-table' | 'anaesthetic-machine' | 'laparoscopy-tower' | 'diathermy' | 'suction' | 'other';
  level: 'basic' | 'advanced' | 'expert';
  certified: boolean;
  certificationDate?: Date;
  expiryDate?: Date;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedDate?: Date;
}

export interface SurgicalSystemCompetency {
  id: string;
  systemName: string; // 'Da Vinci Xi' | 'Mako Robot' | 'Stryker Hip System'
  manufacturer: string;
  specialty: string;
  certified: boolean;
  certificationDate?: Date;
  expiryDate?: Date;
  certificateNumber?: string;
  verifiedBy?: string;
  verifiedByName?: string;
}

export interface StaffCompliance {
  dbs: {
    status: 'valid' | 'expired' | 'pending';
    expiryDate?: Date;
    certificateNumber?: string;
    updateService: boolean; // DBS Update Service subscribed
  };

  professionalRegistration: {
    body: 'NMC' | 'HCPC' | 'GMC';
    registrationNumber: string;
    expiryDate: Date;
    status: 'active' | 'lapsed' | 'suspended';
  };

  mandatoryTraining: MandatoryTraining[];

  occupationalHealth: {
    status: 'fit' | 'restrictions' | 'expired';
    lastAssessment: Date;
    nextDue: Date;
    restrictions?: string[];
    immunisations: Immunisation[];
  };

  indemnityInsurance?: {
    provider: string;
    policyNumber: string;
    expiryDate: Date;
  };
}

export interface MandatoryTraining {
  name: string;
  category: 'statutory' | 'mandatory' | 'role-specific';
  completed: boolean;
  completionDate?: Date;
  expiryDate?: Date;
  certificateUrl?: string;
}

export interface Immunisation {
  name: string;
  date: Date;
  boosterDue?: Date;
  status: 'current' | 'due' | 'overdue';
}

export interface Review {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserType: 'employer' | 'staff';
  shiftId: string;
  rating: number; // 1-5
  punctuality?: number; // 1-5
  competence?: number; // 1-5
  professionalism?: number; // 1-5
  communication?: number; // 1-5
  comment?: string;
  date: Date;
}

export interface Endorsement {
  id: string;
  fromStaffId: string;
  fromStaffName: string;
  fromStaffRole: string;
  competencyType: 'procedure' | 'equipment' | 'system' | 'general';
  competencyName: string;
  comment: string;
  date: Date;
}

// ===== SHIFT MARKETPLACE TYPES =====

export interface Shift {
  id: string;

  // Employer Details
  employerId: string;
  employerName: string; // 'Royal London Hospital'
  employerType: 'nhs-trust' | 'private-hospital' | 'clinic';
  department: string; // 'Main Theatres' | 'DSU' | 'Cardiac Theatres'
  theatreNumber?: string;

  // Location
  location: {
    hospitalName: string;
    address: string;
    postcode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    parkingInfo?: string;
    accessInstructions?: string;
  };

  // Timing
  date: string; // YYYY-MM-DD
  shiftType: 'early' | 'late' | 'night' | 'long-day' | 'on-call';
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  breakDuration: number; // minutes
  totalHours: number;

  // Requirements
  requirements: {
    role: string;
    band: string;
    minimumBand?: string;
    yearsExperience?: number;

    requiredProcedures?: string[]; // Must have
    preferredProcedures?: string[]; // Nice to have

    requiredEquipment?: string[];
    requiredSystems?: string[];

    specialty: string;
    sessionType?: string; // 'General List' | 'Trauma' | 'Emergency'

    additionalRequirements?: string;
  };

  // Pricing
  pricing: {
    baseRate: number; // £/hr
    specialtyPremium: number; // Extra for specialty
    urgencyMultiplier: number; // 1.0-2.0
    maxTravelReimbursement: number; // Max distance willing to pay for
    totalRate: number; // Final offered rate
    platformFee: number; // TOM fee (5%)
    totalCostToEmployer: number;
  };

  // Status
  status: 'open' | 'pending' | 'filled' | 'completed' | 'cancelled';
  postedDate: Date;
  fillByDate: Date; // Deadline

  // Applications
  applications: ShiftApplication[];

  // Assignment
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedRate?: number;
  assignedDate?: Date;
  confirmationSent?: boolean;

  // Completion
  completedDate?: Date;
  actualStartTime?: string;
  actualEndTime?: string;
  actualHours?: number;

  // Review
  review?: Review;

  createdAt: Date;
  updatedAt: Date;
}

export interface ShiftApplication {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  staffBand: string;
  staffRating: number;

  appliedDate: Date;

  // Matching
  distance: number; // miles
  travelTime: number; // minutes
  competencyMatchScore: number; // 0-100

  // Pricing
  proposedRate?: number; // If negotiating
  travelExpenses: number;
  totalCost: number;
  message?: string; // Justification

  // Status
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  respondedDate?: Date;
  responseMessage?: string;
}

// ===== NOTIFICATION TYPES =====

export interface Notification {
  id: string;
  userId: string;

  type: 'shift-alert' | 'shift-filled' | 'shift-cancelled' | 'application-update' |
        'endorsement' | 'review' | 'compliance-expiry' | 'payment-received';

  priority: 'low' | 'medium' | 'high' | 'urgent';

  title: string;
  message: string;

  data: {
    shiftId?: string;
    distance?: number;
    rate?: number;
    competencyMatch?: number;
    actionUrl?: string;
  };

  read: boolean;
  readAt?: Date;

  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };

  createdAt: Date;
}

// ===== ORGANIZATION TYPES =====

export interface Organization {
  id: string;
  name: string;
  type: 'nhs-trust' | 'private-hospital' | 'clinic' | 'care-home';

  location: {
    address: string;
    postcode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };

  departments: {
    name: string;
    theatreCount?: number;
    specialties: string[];
  }[];

  // Platform Settings
  settings: {
    autoApproveVerifiedStaff: boolean;
    maxRateMultiplier: number;
    preferredAgencies?: string[];
    blacklistedStaff?: string[];
  };

  // Billing
  billing: {
    accountNumber: string;
    invoiceEmail: string;
    paymentTerms: number; // days
    monthlySpend: number;
    savingsVsAgency: number;
  };

  contactPerson: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };

  // Stats
  stats: {
    totalShiftsPosted: number;
    totalShiftsFilled: number;
    averageFillTime: number; // hours
    averageRating: number;
  };

  isActive: boolean;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ===== ANALYTICS TYPES =====

export interface PlatformAnalytics {
  period: 'day' | 'week' | 'month' | 'year';
  startDate: Date;
  endDate: Date;

  shifts: {
    totalPosted: number;
    totalFilled: number;
    totalCancelled: number;
    fillRate: number; // percentage
    averageFillTime: number; // hours
  };

  financial: {
    totalValue: number; // Total shift value
    platformRevenue: number; // 5% fees
    staffEarnings: number;
    employerSavings: number; // vs agency
  };

  users: {
    totalStaff: number;
    activeStaff: number;
    newStaff: number;
    totalEmployers: number;
    activeEmployers: number;
  };

  quality: {
    averageStaffRating: number;
    averageEmployerRating: number;
    completionRate: number; // % of shifts actually worked
  };
}

// ===== BOOKING REQUEST TYPES =====

export type BookingRequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

export interface BookingRequest {
  id: string;
  staffId: string;
  staffName: string;
  requestedBy: string; // TOM/Manager ID
  requestedByName: string;

  // Shift Details
  date: string; // YYYY-MM-DD
  shiftType: 'early' | 'late' | 'night' | 'long-day';
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // hours

  // Location & Role
  hospital: string;
  department: string;
  specialty: string;
  role: string;

  // Financial
  hourlyRate: number;
  totalCost: number;

  // Status & Timestamps
  status: BookingRequestStatus;
  requestedAt: Date;
  respondedAt?: Date;
  confirmedAt?: Date;

  // Additional Info
  notes?: string;
  declineReason?: string;

  // HealthRoster Integration
  healthRosterShiftId?: string; // Link to HealthRoster if imported
  healthRosterDutyId?: string;
}

// ===== ALLOCATION TYPES (HealthRoster Interoperability) =====

export interface StaffAllocation {
  id: string;
  staffId: string;
  staffName: string;
  allocatedBy: string; // TOM/Manager ID
  allocatedByName: string;

  // Shift Details
  date: string; // YYYY-MM-DD
  shiftType: 'early' | 'late' | 'night' | 'long-day';
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // hours

  // Location & Role
  hospital: string;
  department: string;
  theatre?: string; // Theatre number/name
  specialty: string;
  role: string;

  // HealthRoster Data (for interoperability)
  healthRosterData?: {
    shiftId: string;
    dutyId: string;
    rosterPeriod: string; // e.g., "2024-W45"
    costCentre: string;
    assignmentType: 'planned' | 'additional' | 'overtime' | 'bank';
    approvalStatus: 'draft' | 'approved' | 'published';
    lastSyncedAt: Date;
  };

  // Status
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  completedAt?: Date;

  // Notes
  notes?: string;
}

// ===== HEALTHROSTER IMPORT TYPES =====

export interface HealthRosterImport {
  id: string;
  importedBy: string;
  importedByName: string;
  importedAt: Date;

  // Source
  sourceSystem: 'healthroster' | 'manual' | 'csv';
  sourceFile?: string;
  rosterPeriod: string; // e.g., "2024-W45"

  // Summary
  totalShifts: number;
  successfulImports: number;
  failedImports: number;
  duplicatesSkipped: number;

  // Data
  shifts: HealthRosterShift[];
  errors?: {
    row: number;
    error: string;
    data: any;
  }[];

  status: 'processing' | 'completed' | 'failed';
}

export interface HealthRosterShift {
  // HealthRoster IDs
  shiftId: string;
  dutyId: string;
  employeeId?: string; // If assigned

  // Date & Time
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // hours
  shiftType: 'early' | 'late' | 'night' | 'long-day' | 'other';

  // Location
  costCentre: string;
  department: string;
  location: string;

  // Role
  role: string;
  band: string;
  specialty?: string;

  // Assignment
  assignmentType: 'planned' | 'additional' | 'overtime' | 'bank' | 'unfilled';
  approvalStatus: 'draft' | 'approved' | 'published';

  // Financial
  standardRate?: number;
  actualRate?: number;

  // Additional
  notes?: string;
  requirements?: string[];
}
