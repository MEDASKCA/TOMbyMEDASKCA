# TOM Platform - Technical Architecture
## "LinkedIn + Uber for NHS Healthcare Staffing"

---

## System Overview

TOM (Theatre Operations Management) Platform is a comprehensive healthcare staffing solution that combines:
- Deep competency management (LinkedIn)
- Geo-location based shift matching (Uber)
- Marketplace bidding system (Upwork)
- Intelligent allocation engine (AI-powered)
- NHS Universal Bank (cross-organization)

---

## Core Modules

### 1. Staff Management
- Professional profiles
- Deep competency tracking
- Equipment/system certifications
- Compliance management
- Location/availability
- Performance metrics

### 2. Shift Marketplace
- Real-time shift posting
- Geo-location matching
- Distance-based notifications
- Bidding/negotiation system
- Auto-allocation engine
- Payment processing

### 3. Competency Engine
- Procedure-specific skills
- Equipment expertise
- Surgical systems knowledge
- Instrument familiarity
- Endorsement system
- Manager verification

### 4. Geo-Location Services
- Live staff availability map
- Distance calculations
- Travel expense automation
- Radius-based alerts
- Heat maps for coverage

### 5. Analytics & Optimization
- Cost savings tracking
- Skills gap analysis
- Allocation efficiency
- Development recommendations
- Budget forecasting

---

## Database Schema

### **Staff Collection** (`staff`)
```typescript
{
  id: string;

  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nhsNumber?: string;

  // Employment
  role: string; // 'scrub-nurse' | 'anaesthetic-nurse' | 'ODP' | 'HCA'
  band: string; // 'Band 5' | 'Band 6' | 'Band 7'
  employmentType: 'permanent' | 'bank' | 'agency';
  homeOrganization?: string; // Trust name

  // Location
  location: {
    address: string;
    postcode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };

  // Availability
  availability: {
    preferredRadius: number; // miles
    preferredShifts: string[]; // 'early' | 'late' | 'night' | 'long-day'
    preferredSpecialties: string[];
    unavailableDates: Date[];
    maxHoursPerWeek?: number;
  };

  // Competencies
  competencies: {
    procedures: {
      procedureId: string;
      procedureName: string;
      specialty: string;
      level: 'training' | 'competent' | 'proficient' | 'expert';
      verifiedBy?: string; // Manager ID
      verifiedDate?: Date;
      lastPerformed?: Date;
      timesPerformed: number;
    }[];

    equipment: {
      equipmentId: string;
      equipmentName: string;
      manufacturer: string;
      type: string; // 'operating-table' | 'anaesthetic-machine' | 'laparoscopy-tower'
      level: 'basic' | 'advanced' | 'expert';
      verifiedBy?: string;
      verifiedDate?: Date;
    }[];

    surgicalSystems: {
      systemId: string;
      systemName: string; // 'Da Vinci Xi' | 'Mako Robot' | 'Stryker Hip System'
      manufacturer: string;
      specialty: string;
      certified: boolean;
      certificationDate?: Date;
      expiryDate?: Date;
      verifiedBy?: string;
    }[];

    instrumentSets: {
      trayId: string; // From Synergy Trak
      trayName: string;
      physicalRef: string; // e.g., ZE1030
      familiarity: 'basic' | 'intermediate' | 'expert';
      lastUsed?: Date;
    }[];
  };

  // Compliance
  compliance: {
    dbs: {
      status: 'valid' | 'expired' | 'pending';
      expiryDate?: Date;
      certificateNumber?: string;
    };
    mandatoryTraining: {
      name: string;
      completed: boolean;
      completionDate?: Date;
      expiryDate?: Date;
    }[];
    professionalRegistration: {
      body: 'NMC' | 'HCPC';
      registrationNumber: string;
      expiryDate: Date;
      status: 'active' | 'lapsed';
    };
    occupationalHealth: {
      status: 'fit' | 'restrictions' | 'expired';
      lastAssessment: Date;
      nextDue: Date;
      restrictions?: string[];
    };
  };

  // Performance
  performance: {
    totalShifts: number;
    completedShifts: number;
    cancelledShifts: number;
    rating: number; // 0-5
    reviews: {
      employerId: string;
      shiftId: string;
      rating: number;
      comment?: string;
      date: Date;
    }[];
    endorsements: {
      fromStaffId: string;
      fromStaffName: string;
      competencyType: string;
      competencyName: string;
      comment: string;
      date: Date;
    }[];
  };

  // Platform Settings
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    distanceAlerts: boolean;
    competencyMatches: boolean;
    shiftReminders: boolean;
  };

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### **Shifts Collection** (`shifts`)
```typescript
{
  id: string;

  // Shift Details
  employerId: string; // Trust/Hospital ID
  employerName: string;
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
  date: Date;
  shiftType: 'early' | 'late' | 'night' | 'long-day' | 'on-call';
  startTime: string; // '07:30'
  endTime: string; // '17:00'
  breakDuration: number; // minutes

  // Requirements
  requirements: {
    role: string;
    band: string;
    minimumBand?: string;

    requiredProcedures: string[]; // Procedure IDs
    requiredEquipment: string[]; // Equipment IDs
    requiredSystems: string[]; // System IDs

    specialty: string;
    sessionType?: string; // 'General List' | 'Trauma' | 'Emergency'

    additionalRequirements?: string;
  };

  // Pricing
  pricing: {
    baseRate: number; // £/hr based on band
    specialtyPremium?: number; // Extra for hard-to-fill specialties
    urgencyMultiplier?: number; // 1.0 (normal) to 2.0 (emergency)
    maxTravelReimbursement: number; // Max distance willing to pay for

    calculatedRates: {
      within5Miles: number;
      within10Miles: number;
      within15Miles: number;
      within20Miles: number;
    };

    platformFee: number; // TOM platform fee (e.g., 5%)
    totalCostToEmployer: number;
  };

  // Status
  status: 'open' | 'pending' | 'filled' | 'completed' | 'cancelled';
  postedDate: Date;
  fillByDate: Date; // Deadline for filling

  // Applications
  applications: {
    staffId: string;
    staffName: string;
    appliedDate: Date;
    distance: number; // miles
    travelTime: number; // minutes
    competencyMatchScore: number; // 0-100

    proposedRate: number;
    travelExpenses: number;
    totalCost: number;

    status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
    message?: string; // Justification for counter-offer
  }[];

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
  review?: {
    rating: number;
    punctuality: number;
    competence: number;
    professionalism: number;
    communication: number;
    comment?: string;
    reviewDate: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}
```

### **Procedures Database** (`procedures`)
```typescript
{
  id: string;
  name: string;
  category: string; // 'Orthopaedic' | 'Cardiac' | 'General' | 'Neurosurgery'
  specialty: string;

  complexity: 'basic' | 'intermediate' | 'advanced' | 'specialist';
  averageDuration: number; // minutes

  requiredEquipment: string[]; // Equipment IDs
  requiredSystems: string[]; // System IDs
  instrumentTrays: string[]; // Tray IDs from Synergy Trak

  requiredRoles: {
    role: string;
    minimumLevel: string;
    count: number;
  }[];

  commonComplications?: string[];
  specialConsiderations?: string[];

  createdAt: Date;
  updatedAt: Date;
}
```

### **Equipment Database** (`equipment`)
```typescript
{
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  type: 'operating-table' | 'anaesthetic-machine' | 'laparoscopy-tower' | 'diathermy' | 'suction';

  specialty?: string;
  trainingRequired: boolean;
  certificationRequired: boolean;

  locations: string[]; // Which hospitals have this

  relatedProcedures: string[]; // Procedure IDs

  documentation?: {
    manualUrl?: string;
    trainingVideoUrl?: string;
    quickReferenceGuide?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}
```

### **Organizations Collection** (`organizations`)
```typescript
{
  id: string;
  name: string; // 'Royal London Hospital'
  type: 'trust' | 'hospital' | 'clinic';

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
    theatreCount: number;
    specialties: string[];
  }[];

  // Platform Settings
  platformSettings: {
    autoApproveVerifiedStaff: boolean;
    maxRateMultiplier: number; // Max they'll pay above base rate
    preferredAgencies?: string[]; // If using agencies through platform
    blacklistedStaff?: string[]; // Staff IDs not to show shifts to
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

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### **Notifications Collection** (`notifications`)
```typescript
{
  id: string;
  staffId: string;

  type: 'shift-alert' | 'shift-filled' | 'shift-cancelled' | 'endorsement' | 'compliance-expiry';
  priority: 'low' | 'medium' | 'high' | 'urgent';

  title: string;
  message: string;

  data: {
    shiftId?: string;
    distance?: number;
    rate?: number;
    competencyMatch?: number;
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
```

---

## API Endpoints

### **Staff APIs**
```
GET    /api/staff/:id                    - Get staff profile
PUT    /api/staff/:id                    - Update staff profile
POST   /api/staff/:id/competencies       - Add competency
PUT    /api/staff/:id/competencies/:compId - Update competency
DELETE /api/staff/:id/competencies/:compId - Remove competency
POST   /api/staff/:id/availability       - Update availability
GET    /api/staff/:id/shifts             - Get staff's shifts
POST   /api/staff/:id/endorse            - Endorse staff competency
```

### **Shift APIs**
```
GET    /api/shifts                       - List available shifts (with filters)
GET    /api/shifts/nearby                - Get shifts near staff location
POST   /api/shifts                       - Create new shift (employer)
GET    /api/shifts/:id                   - Get shift details
PUT    /api/shifts/:id                   - Update shift
DELETE /api/shifts/:id                   - Cancel shift
POST   /api/shifts/:id/apply             - Apply for shift (staff)
POST   /api/shifts/:id/accept            - Accept application (employer)
POST   /api/shifts/:id/complete          - Mark shift complete
POST   /api/shifts/:id/review            - Review staff performance
```

### **Matching APIs**
```
POST   /api/matching/calculate           - Calculate competency match score
GET    /api/matching/suggest/:shiftId    - Get suggested staff for shift
GET    /api/matching/suggest/:staffId    - Get suggested shifts for staff
POST   /api/matching/auto-allocate       - Run auto-allocation algorithm
```

### **Geo-Location APIs**
```
GET    /api/location/staff/nearby        - Get available staff near location
GET    /api/location/shifts/nearby       - Get shifts near staff
POST   /api/location/calculate-travel    - Calculate travel time/cost
GET    /api/location/heatmap             - Get coverage heatmap data
```

### **Analytics APIs**
```
GET    /api/analytics/cost-savings       - Cost savings vs agency
GET    /api/analytics/skills-gap         - Skills gap analysis
GET    /api/analytics/utilization        - Staff utilization metrics
GET    /api/analytics/fill-rate          - Shift fill rate over time
```

---

## Technology Stack

### **Frontend**
- **Framework:** Next.js 15 (React 19)
- **UI Library:** Tailwind CSS + shadcn/ui
- **Maps:** Google Maps API / Mapbox
- **Real-time:** Firebase Realtime Database
- **State Management:** React Context + Zustand
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts / Chart.js

### **Backend**
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Storage:** Firebase Storage
- **Functions:** Firebase Cloud Functions
- **Notifications:** Firebase Cloud Messaging
- **Email:** SendGrid / AWS SES
- **SMS:** Twilio

### **Integrations**
- **Payment:** Stripe Connect (for marketplace payments)
- **Geolocation:** Google Maps Distance Matrix API
- **Compliance:** NHS Spine (future - for NMC verification)
- **Employee Online:** Custom parser (CSV/Excel import)
- **Allocate/Optima:** API integration (if available)

### **AI/ML**
- **Matching Algorithm:** Custom scoring engine
- **Auto-Allocation:** Linear programming optimization
- **Pricing Optimization:** Dynamic pricing model
- **Skills Gap Analysis:** Data analytics

---

## Key Features Implementation

### **1. Geo-Location Shift Alerts**

**Algorithm:**
```typescript
// When new shift posted:
1. Get shift location coordinates
2. Query all active staff with:
   - availability.preferredRadius >= distance to shift
   - competencies matching shift requirements
   - status = 'available' for that date/time
3. Calculate:
   - Distance (straight line + road distance)
   - Travel time (Google Maps API)
   - Travel cost (distance × mileage rate)
   - Competency match score (0-100)
4. Sort by competency match × (1 / distance)
5. Send notifications to top 20 matches
```

**Notification Example:**
```
🏥 Cardiac Theatre Shift Alert
📍 4.2 miles away (12 min drive)
💰 £48/hr + £8.40 travel = £56.40/hr
⏰ Tomorrow 07:30-17:00
✅ 95% competency match

Requires:
- CABG procedures (Expert ✓)
- Cardiac bypass machine (Advanced ✓)
- Maquet operating table (Expert ✓)

[Accept £56.40] [Negotiate] [Decline]
```

### **2. Competency Match Scoring**

```typescript
function calculateCompetencyMatch(staff, shift): number {
  let score = 0;
  let maxScore = 0;

  // Procedures (40% weight)
  shift.requirements.requiredProcedures.forEach(procId => {
    maxScore += 40;
    const staffProc = staff.competencies.procedures.find(p => p.procedureId === procId);
    if (staffProc) {
      const levelScores = { training: 10, competent: 25, proficient: 35, expert: 40 };
      score += levelScores[staffProc.level];
    }
  });

  // Equipment (30% weight)
  shift.requirements.requiredEquipment.forEach(eqId => {
    maxScore += 30;
    const staffEq = staff.competencies.equipment.find(e => e.equipmentId === eqId);
    if (staffEq) {
      const levelScores = { basic: 15, advanced: 25, expert: 30 };
      score += levelScores[staffEq.level];
    }
  });

  // Systems (30% weight)
  shift.requirements.requiredSystems.forEach(sysId => {
    maxScore += 30;
    const staffSys = staff.competencies.surgicalSystems.find(s => s.systemId === sysId);
    if (staffSys && staffSys.certified) {
      score += 30;
    } else if (staffSys) {
      score += 15;
    }
  });

  return maxScore > 0 ? (score / maxScore) * 100 : 0;
}
```

### **3. Dynamic Pricing**

```typescript
function calculateShiftRate(shift, staff): number {
  // Base rate from AFC band
  const baseRate = getBandRate(shift.requirements.band);

  // Distance premium
  const distance = calculateDistance(shift.location, staff.location);
  const mileageRate = 0.45; // £0.45 per mile (HMRC rate)
  const travelCost = distance * 2 * mileageRate; // Round trip
  const travelCostPerHour = travelCost / shift.duration;

  // Specialty premium (hard-to-fill specialties)
  const specialtyMultiplier = getSpecialtyMultiplier(shift.specialty); // 1.0 - 1.3

  // Urgency multiplier (how soon shift is)
  const hoursUntilShift = (shift.date - new Date()) / (1000 * 60 * 60);
  const urgencyMultiplier = hoursUntilShift < 24 ? 1.5 :
                           hoursUntilShift < 72 ? 1.2 : 1.0;

  const totalRate = (baseRate * specialtyMultiplier * urgencyMultiplier) + travelCostPerHour;

  return Math.round(totalRate * 100) / 100;
}
```

### **4. Auto-Allocation Algorithm**

```typescript
function autoAllocateStaff(shifts, availableStaff) {
  // This uses a modified Hungarian algorithm for optimal matching

  // 1. Create cost matrix
  const costMatrix = shifts.map(shift =>
    availableStaff.map(staff => {
      const competencyScore = calculateCompetencyMatch(staff, shift);
      const distance = calculateDistance(shift.location, staff.location);
      const cost = calculateShiftRate(shift, staff);

      // Optimize for: high competency, low distance, low cost
      return (100 - competencyScore) + (distance * 2) + (cost / 10);
    })
  );

  // 2. Run Hungarian algorithm
  const assignments = hungarianAlgorithm(costMatrix);

  // 3. Return optimal allocations
  return assignments.map((staffIndex, shiftIndex) => ({
    shiftId: shifts[shiftIndex].id,
    staffId: availableStaff[staffIndex].id,
    competencyMatch: calculateCompetencyMatch(availableStaff[staffIndex], shifts[shiftIndex]),
    cost: calculateShiftRate(shifts[shiftIndex], availableStaff[staffIndex])
  }));
}
```

---

## Mobile App Features

### **Staff App (React Native / PWA)**
- Live shift map
- Push notifications for nearby shifts
- One-tap shift acceptance
- Earnings tracker
- Competency portfolio
- Compliance dashboard
- Chat with employers

### **Employer App**
- Post shifts quickly
- See available staff on map
- Review applications
- Auto-approve trusted staff
- Real-time shift status
- Cost analytics dashboard

---

## Security & Compliance

### **Data Protection**
- GDPR compliant
- NHS Data Security & Protection Toolkit
- End-to-end encryption for sensitive data
- Role-based access control (RBAC)
- Audit logging

### **NHS Integration**
- NHS Spine integration (future)
- NMC PIN verification
- HCPC registration checking
- NHS Mail integration
- Single Sign-On (NHS Identity)

---

## Roadmap

### **Phase 1: Foundation (Months 1-3)**
- Staff profiles with deep competencies
- Shift posting & application
- Basic matching algorithm
- Web app (desktop + mobile web)

### **Phase 2: Intelligence (Months 4-6)**
- Geo-location services
- Distance-based alerts
- Dynamic pricing
- Auto-allocation engine
- Analytics dashboard

### **Phase 3: Marketplace (Months 7-9)**
- Bidding/negotiation system
- Payment integration
- Rating & review system
- Endorsement system
- Mobile apps (iOS + Android)

### **Phase 4: Scale (Months 10-12)**
- Multi-trust support
- NHS Universal Bank
- API for third-party integrations
- Employee Online parser
- Allocate/Optima integration

### **Phase 5: AI & Optimization (Year 2)**
- ML-powered matching
- Predictive analytics
- Skills gap forecasting
- Career development pathways
- Compliance automation

---

## Success Metrics

### **Platform Health**
- **Fill Rate:** % of shifts filled within 24 hours
- **Match Quality:** Average competency match score
- **Response Time:** Time from shift posted to filled
- **Staff Utilization:** Average hours worked per active staff
- **Employer Satisfaction:** NPS score from hospitals

### **Cost Savings**
- **Agency Replacement Rate:** % shifts filled via platform vs agency
- **Cost per Shift:** Platform vs traditional agency
- **Total NHS Savings:** Cumulative cost savings
- **Staff Earnings:** Average increase in take-home pay

### **Quality Metrics**
- **Competency Match:** Average match score for filled shifts
- **Staff Ratings:** Average rating from employers
- **Shift Completion Rate:** % of accepted shifts completed
- **Compliance Rate:** % of staff with up-to-date compliance

---

## Revenue Model

### **Platform Fee Structure:**
- **Transaction Fee:** 5% of total shift cost (vs 30% agency fee)
- **Subscription (Optional):**
  - **Staff Premium:** £9.99/month (priority alerts, advanced analytics)
  - **Employer Pro:** £299/month (unlimited shifts, auto-allocation, analytics)

### **Value Proposition:**
- **For NHS:** Save 18-25% vs agency costs
- **For Staff:** Earn 10-15% more than agency rates
- **For Platform:** Sustainable 5% fee on growing marketplace

---

This is the complete technical architecture for the TOM Platform. Ready to build this revolutionary system!
