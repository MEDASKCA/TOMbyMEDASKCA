# Theatre Management System

A comprehensive real-time theatre operations management dashboard for NHS theatre departments. Built with Next.js 15, React, TypeScript, and Tailwind CSS.

## Overview

This system provides Theatre Managers with a unified dashboard to monitor and manage all theatre operations across Main Theatres and Day Surgery Unit (DSU) theatres in real-time.

## Current Features

### 1. **Operations Dashboard** (`components/views/DashboardView.tsx`)
Main overview displaying real-time status of all theatres:

- **Theatre Status Cards**: Visual representation of each theatre's current state
  - Surgery status (In Surgery, Sent For, Anaesthetic Room, Standby, Closed)
  - Current procedure and estimated finish time
  - Team composition with staff names and shifts
  - Color-coded status indicators
- **Live Metrics**:
  - Total theatres running
  - Cases completed today
  - Staff on duty summary
  - Efficiency score
- **Unit Filtering**: Toggle between Main Theatres, DSU, Recovery, and All Units
- **Synchronized Date/Time Display**: Real-time clock shown in header
- **Fullscreen Layout**: Edge-to-edge design on desktop for maximum screen space

**Data Structure**:
```typescript
interface TheatreAllocation {
  theatre: string;              // "Main Theatre 1", "DSU Theatre 1"
  specialty: string;            // "Elective Orthopaedics", etc.
  session: string;              // "08:00 - 20:00" or "CLOSED"
  sessionsCount: number;        // Number of sessions scheduled
  casesCompleted: number;       // Cases completed so far
  status: 'surgery_started' | 'patient_sent' | 'anaesthetic_room' | 'standby' | 'closed';
  patientStatus: string;
  currentProcedure?: string;
  nextCase?: string;
  surgeryStartTime?: string;
  estimatedFinish?: string;
  team: {
    surgeon: { name: string; shift: string; };
    assistant?: { name: string; shift: string; };
    anaesthetist: { name: string; shift: string; };
    anaesNP?: { name: string; shift: string; };
    anaesNP2?: { name: string; shift: string; };
    scrubNP1?: { name: string; shift: string; scrubbed?: boolean; etf?: string; };
    scrubNP2?: { name: string; shift: string; scrubbed?: boolean; };
    scrubNP3?: { name: string; shift: string; scrubbed?: boolean; };
    hca?: { name: string; shift: string; };
    techSpec?: { name: string; shift: string; };
  };
  alerts?: string;
  closureReason?: string;
}
```

### 2. **Staff Competency Modal** (`components/views/StaffCompetencyModal.tsx`)
Detailed view of staff member competencies and qualifications:

- **Left Panel (Desktop)**: Fixed staff information
  - Name, role, grade
  - Contact information
  - Current assignment
  - Shift details
- **Main Content**: Scrollable competency information
  - Specialties with proficiency levels (Expert, Competent, Learning)
  - Certifications with expiry dates
  - Training history with dates
  - Performance metrics
- **Visual Indicators**: Color-coded competency levels and certification status

**Data Structure**:
```typescript
interface Competency {
  category: string;
  items: Array<{
    name: string;
    level: 'expert' | 'competent' | 'learning';
    lastAssessed: string;
  }>;
}

interface Certification {
  name: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring_soon' | 'expired';
}
```

### 3. **Theatre Operations Modal** (`components/views/TheatreOpsModal.tsx`)
Operational issue tracking and management:

- **Left Sidebar**: Quick stats
  - Running theatres count
  - Cases completed/underway/scheduled
  - Active issues count
- **Issue Types**:
  - **Operational**: Equipment faults, theatre closures, logistics
  - **Clinical**: Patient delays, clinical decisions
  - **Escalation**: Urgent issues requiring immediate attention
- **Issue Details**:
  - Status tracking (Resolved, In-Progress, Acknowledged)
  - Priority levels (Urgent, High, Medium, Low)
  - Raised by/assigned to tracking
  - Impact assessment
  - Previous occurrences
  - Resolution notes
- **Filters**: By type (Operational/Clinical/Escalation) and time period (Today/Week/Month)

**Data Structure**:
```typescript
interface Issue {
  id: number;
  type: 'operational' | 'clinical' | 'escalation';
  title: string;
  description: string;
  theatre: string;
  raisedBy: string;
  raisedAt: string;
  status: 'resolved' | 'in-progress' | 'acknowledged';
  assignedTo?: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  impact: string;
  previousOccurrences: Array<{
    date: string;
    theatre: string;
    issue: string;
    resolvedBy: string;
  }>;
  notes: string;
}
```

### 4. **Turnover Time Analysis Modal** (`components/views/TurnoverTimeModal.tsx`)
Theatre turnover performance tracking:

- **Left Sidebar**: Summary statistics
  - Average turnover time
  - Target time
  - Total turnovers today
  - On-target vs delayed count
  - Best/worst performing theatre
- **Theatre Cards**: Individual performance
  - Current and average turnover times
  - Number of turnovers today
  - On-target vs delayed breakdown
  - Trend indicators (Improving/Worsening/Stable)
  - Delay reasons with timestamps
- **Unit Filtering**: Filter by Main/DSU/Recovery
- **Performance Color Coding**:
  - Green: ≤75% of target time
  - Yellow: 76-100% of target
  - Red: >100% of target

**Data Structure**:
```typescript
interface TheatreTurnover {
  theatre: string;
  unit: 'main' | 'acad' | 'recovery';
  currentTurnover: number;      // in minutes
  avgTurnover: number;
  target: number;
  turnoversToday: number;
  onTarget: number;
  delayed: number;
  trend: 'improving' | 'worsening' | 'stable';
  delayReasons: Array<{
    reason: string;
    time: string;
    duration: string;
  }>;
  lastTurnover: string;
  nextCase: string;
}
```

### 5. **Efficiency Score Modal** (`components/views/EfficiencyScoreModal.tsx`)
Overall theatre efficiency tracking and analytics:

- **Left Sidebar**: Key metrics
  - Overall efficiency score
  - Unit-specific scores (Main/DSU)
  - Theatre utilization percentage
  - On-time start rate
- **Theatre Performance Cards**:
  - Efficiency percentage
  - Session count and completion
  - Start time performance (On-time/Early/Delayed)
  - Turnover efficiency
  - Utilization rate
  - Contributing factors (positive/negative)
- **Performance Indicators**:
  - Green: ≥85% efficiency
  - Yellow: 70-84% efficiency
  - Red: <70% efficiency

**Data Structure**:
```typescript
interface TheatreEfficiency {
  theatre: string;
  unit: 'main' | 'acad';
  efficiency: number;           // percentage
  sessionsScheduled: number;
  sessionsCompleted: number;
  startTime: 'on_time' | 'early' | 'delayed';
  startDelay?: number;          // in minutes
  turnoverEfficiency: number;   // percentage
  utilization: number;          // percentage
  factors: {
    positive: string[];
    negative: string[];
  };
}
```

### 6. **Staff Relief & Break Management Modal** (`components/views/StaffReliefModal.tsx`)
Comprehensive staff break tracking and relief deployment:

#### **Left Panel: Relief Requests**
- Incoming relief requests from staff
- Request details:
  - Staff name, role, theatre
  - Reason for relief
  - Time of request
  - Urgency level
- **Deploy Relief Function**:
  - Click "Relieve" to see available staff
  - System matches by role and competency
  - Shows available staff with:
    - Match score percentage
    - Current location
    - Competencies
    - Estimated arrival time
    - Relief history count
- **Status Tracking**:
  - Pending → Acknowledged (with deployed staff name)
  - Relief staff name displayed when deployed

#### **Right Panel: Break Management**
6-column grid layout for managing staff breaks:

- **Filter Buttons** (top of panel):
  - All Breaks
  - No Break Taken
  - Overdue
  - Break Taken
- **Staff Cards** (73 real staff from dashboard):
  - Staff name, role, theatre
  - Shift times
  - Break buttons:
    - **Tea** (Discretionary 10-15 min)
      - Can take multiple tea breaks
      - Shows timestamp when taken
      - Authorized by Team Lead or Manager
    - **Lunch** (30 min entitlement)
      - Entitled if shift ≥9 hours (e.g., 08:00-18:00)
      - Single break only
      - Shows timestamp when taken
    - **Supper** (30 min entitlement)
      - Entitled if shift ≥11 hours (e.g., 08:00-20:00)
      - Single break only
      - Shows timestamp when taken
- **Break Authorization**: All breaks tracked with:
  - Timestamp
  - Duration
  - Authorized by (name)
  - Role of authorizer (Team Lead/Manager)
- **Grid Display**: 6 columns × 4 visible rows, vertical scrolling for 73 staff

**Data Structure**:
```typescript
interface ReliefRequest {
  id: string;
  staffName: string;
  role: string;
  theatre: string;
  reason: string;
  requestTime: string;
  urgency: 'high' | 'medium' | 'low';
  status: 'pending' | 'acknowledged';
  deployedStaff?: string;
}

interface AvailableStaff {
  id: string;
  name: string;
  role: string;
  currentLocation: string;
  breakStatus: string;
  lastBreak: string;
  competencies: string[];
  matchScore: number;           // percentage
  estimatedArrival: string;
  reliefHistory: number;
}

interface StaffMember {
  id: string;
  name: string;
  role: 'Anaes N/P' | 'Scrub N/P' | 'HCA';
  theatre: string;
  shiftStart: string;
  shiftEnd: string;
  hoursWorked: number;
  teaBreaks: Array<{
    time: string;
    duration: string;
    authorizedBy: string;
    authorizedByRole: 'Team Lead' | 'Manager';
  }>;
  lunchBreak?: {
    time: string;
    duration: string;
    authorizedBy: string;
  };
  supperBreak?: {
    time: string;
    duration: string;
    authorizedBy: string;
  };
  lunchEntitled: boolean;       // true if shift ≥9 hours
  supperEntitled: boolean;      // true if shift ≥11 hours
  breakStatus: 'no_break' | 'overdue' | 'taken';
}
```

### 7. **Theatre Timeline Modal** (`components/views/TheatreTimelineModal.tsx`)
Visual timeline of theatre schedules and case progression:

- Timeline view of all scheduled cases
- Real-time progress tracking
- Case duration and delays visualization

### 8. **Staff on Duty Modal** (`components/views/StaffDutyModal.tsx`)
Complete overview of all staff currently on duty:

- Staff list with roles and assignments
- Shift times and break status
- Quick filtering by role/unit

## Tech Stack

- **Frontend Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState)
- **Date/Time**: Native JavaScript Date API

## Project Structure

```
projectsocial/
├── app/
│   ├── page.tsx                    # Main application entry (Theatre Manager Dashboard)
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   └── views/
│       ├── DashboardView.tsx       # Main operations dashboard
│       ├── StaffCompetencyModal.tsx    # Staff competency viewer
│       ├── TheatreOpsModal.tsx     # Operations issue tracker
│       ├── TurnoverTimeModal.tsx   # Turnover time analysis
│       ├── EfficiencyScoreModal.tsx    # Efficiency metrics
│       ├── StaffReliefModal.tsx    # Relief requests & break management
│       ├── TheatreTimelineModal.tsx    # Timeline view
│       └── StaffDutyModal.tsx      # Staff on duty summary
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd projectsocial
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Data Integration Guide

### Connecting Real Data

When integrating with actual hospital systems, replace the static data arrays with API calls or database queries:

#### 1. **Theatre Allocations** (Dashboard)
Replace `theatreAllocations` array in `DashboardView.tsx` with:
```typescript
// Example API integration
const [theatres, setTheatres] = useState<TheatreAllocation[]>([]);

useEffect(() => {
  fetch('/api/theatres/current')
    .then(res => res.json())
    .then(data => setTheatres(data));
}, []);
```

**Expected API Endpoints**:
- `GET /api/theatres/current` - Current status of all theatres
- `GET /api/theatres/{id}/team` - Team members for specific theatre
- `GET /api/theatres/{id}/schedule` - Cases scheduled for theatre

#### 2. **Staff Competencies**
Replace static data in `StaffCompetencyModal.tsx`:
```typescript
// Example
const fetchStaffCompetencies = async (staffId: string) => {
  const response = await fetch(`/api/staff/${staffId}/competencies`);
  return response.json();
};
```

**Expected API Endpoints**:
- `GET /api/staff/{id}/competencies` - Competencies and proficiency levels
- `GET /api/staff/{id}/certifications` - Certifications with expiry dates
- `GET /api/staff/{id}/training` - Training history

#### 3. **Theatre Operations Issues**
Replace `issues` array in `TheatreOpsModal.tsx`:

**Expected API Endpoints**:
- `GET /api/operations/issues?period={today|week|month}` - All issues
- `POST /api/operations/issues` - Create new issue
- `PATCH /api/operations/issues/{id}` - Update issue status
- `GET /api/operations/issues/{id}/history` - Previous occurrences

#### 4. **Turnover Times**
Replace `theatreData` array in `TurnoverTimeModal.tsx`:

**Expected API Endpoints**:
- `GET /api/turnover/current` - Current turnover times
- `GET /api/turnover/analytics?period={today|week|month}` - Historical analytics
- `GET /api/turnover/{theatreId}/delays` - Delay reasons

#### 5. **Efficiency Scores**
Replace efficiency data in `EfficiencyScoreModal.tsx`:

**Expected API Endpoints**:
- `GET /api/efficiency/theatres` - Theatre efficiency scores
- `GET /api/efficiency/summary` - Overall summary metrics
- `GET /api/efficiency/{theatreId}/factors` - Contributing factors

#### 6. **Staff Relief & Breaks**
Replace `reliefRequests` and `staffMembers` arrays in `StaffReliefModal.tsx`:

**Expected API Endpoints**:
- `GET /api/relief/requests` - Active relief requests
- `POST /api/relief/requests/{id}/deploy` - Deploy staff for relief
- `GET /api/relief/available?role={role}` - Available staff for relief
- `GET /api/staff/breaks` - All staff break status
- `POST /api/staff/{id}/break` - Send staff for break
- `GET /api/staff/{id}/break-history` - Break history

#### 7. **Real-time Updates**
For live updates, consider implementing WebSocket connections:
```typescript
// Example WebSocket integration
useEffect(() => {
  const ws = new WebSocket('wss://your-server/theatre-updates');

  ws.onmessage = (event) => {
    const update = JSON.parse(event.data);
    // Update relevant state based on update type
  };

  return () => ws.close();
}, []);
```

### Database Schema Suggestions

For backend implementation, consider these core tables:

1. **Theatres**
   - id, name, unit (main/dsu), status, current_case_id

2. **Cases**
   - id, theatre_id, procedure, patient_id, scheduled_start, actual_start, estimated_finish, status

3. **Staff**
   - id, name, role, grade, contact_info

4. **Staff_Competencies**
   - staff_id, specialty, proficiency_level, last_assessed

5. **Staff_Certifications**
   - staff_id, certification_name, issue_date, expiry_date

6. **Theatre_Assignments**
   - theatre_id, case_id, staff_id, role_in_theatre, shift_start, shift_end

7. **Operational_Issues**
   - id, theatre_id, type, priority, status, raised_by, raised_at, resolved_at, description

8. **Turnover_Times**
   - id, theatre_id, case_from, case_to, start_time, end_time, duration, delay_reason

9. **Staff_Breaks**
   - id, staff_id, break_type, start_time, duration, authorized_by

10. **Relief_Requests**
    - id, staff_id, theatre_id, reason, request_time, status, deployed_staff_id

## Current Implementation Status

### Completed Features ✅
- Fullscreen responsive dashboard layout
- Real-time synchronized clock
- Unit filtering (Main/DSU/Recovery)
- All 8 modal views implemented
- Staff competency tracking
- Operations issue management
- Turnover time analysis
- Efficiency score tracking
- Relief request system
- Break management system (73 real staff)
- Theatre timeline visualization
- Staff on duty summary

### Data Status 🔄
- **Static Data**: Currently using mock data for demonstration
- **73 Real Staff Names**: Populated from theatre allocations across all theatres
- **Realistic Scenarios**: Mock data represents real-world theatre operations
- **Ready for Integration**: Data structures match expected API responses

### Next Steps for Production 🚀

1. **Backend Integration**
   - Connect to hospital Theatre Management System (TMS)
   - Implement real-time data sync
   - Set up WebSocket for live updates

2. **Authentication & Authorization**
   - Implement role-based access (Manager, Team Lead, Staff)
   - Secure API endpoints
   - Audit logging

3. **Database Setup**
   - Design and implement database schema
   - Set up data migration from legacy systems
   - Implement backup and recovery

4. **Enhanced Features**
   - Export reports (PDF/Excel)
   - Historical data analytics
   - Predictive modeling for staffing
   - Mobile responsive improvements
   - Push notifications for urgent issues

5. **Testing & Validation**
   - User acceptance testing with Theatre Managers
   - Load testing for concurrent users
   - Security penetration testing
   - Compliance validation (NHS data standards)

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
1. Push to GitHub
2. Import to Vercel
3. Configure environment variables (if needed)
4. Deploy

## License

MIT License

## Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history and deployment notes.

**Current Version**: 0.3.0 (Development)

## Support & Documentation

For questions about integrating with hospital systems or customizing features, refer to the data structures documented above or contact the development team.

---

## Before GitHub Deployment

**Important**: Before pushing to GitHub, always:

1. ✅ Update [CHANGELOG.md](CHANGELOG.md) with new features
2. ✅ Update version number and date
3. ✅ Move unreleased items to versioned section
4. ✅ Test all features locally
5. ✅ Update README.md if data structures changed
6. ✅ Use descriptive commit message: "Release vX.X.X - [Brief description]"

See [CHANGELOG.md](CHANGELOG.md) for full deployment checklist.

---

**Note**: This system currently uses static mock data for demonstration. All data structures are designed to match expected formats from hospital Theatre Management Systems for seamless integration when real data sources become available.
