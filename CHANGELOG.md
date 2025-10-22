# Changelog

All notable changes to the Theatre Management System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive README.md documentation with all features, data structures, and integration guide
- CHANGELOG.md for tracking version history and deployments

## [0.3.0] - 2025-01-XX (Current Development)

### Added - Staff Relief & Break Management System
- **Staff Relief Request Panel** (`StaffReliefModal.tsx` - Left Panel)
  - View incoming relief requests from staff
  - Request details: name, role, theatre, reason, urgency
  - Deploy relief staff functionality
  - Available staff matching by role and competency
  - Match scoring system (percentage)
  - Status tracking: Pending → Acknowledged
  - Shows deployed staff name when acknowledged

- **Break Management System** (`StaffReliefModal.tsx` - Right Panel)
  - 6-column grid layout for scalability (handles 100+ staff)
  - 73 real staff members populated from theatre allocations
  - Break type tracking:
    - **Tea/Coffee**: Discretionary 10-15 min breaks (multiple allowed)
    - **Lunch**: 30 min entitlement for shifts ≥9 hours
    - **Supper**: 30 min entitlement for shifts ≥11 hours
  - Break authorization tracking with timestamps
  - Authorized by tracking (Team Lead/Manager)
  - Filter system: All / No Break / Overdue / Taken
  - Visual status indicators with color coding
  - Automatic entitlement calculation based on shift duration

### Changed
- Replaced "ACAD" terminology with "DSU" (Day Surgery Unit) across all components
- All modals now fullscreen on desktop (edge-to-edge layout)
- Dashboard fullscreen layout with no padding on desktop view
- Static left panel added to StaffReliefModal on desktop for better UX

## [0.2.0] - 2025-01-XX

### Added - Core Modal Features

- **Operations Dashboard** (`DashboardView.tsx`)
  - Real-time theatre status cards for Main Theatres 1-12 and DSU Theatres 1-10
  - Live metrics: Running theatres, cases completed, staff on duty, efficiency score
  - Unit filtering: Main / DSU / Recovery / All
  - Synchronized date/time display in header
  - Color-coded status indicators
  - Team composition display with staff names and shifts
  - Theatre closure tracking with reasons

- **Staff Competency Modal** (`StaffCompetencyModal.tsx`)
  - Fixed left panel (desktop) with staff information
  - Scrollable competency details
  - Proficiency levels: Expert / Competent / Learning
  - Certifications with expiry tracking
  - Training history
  - Performance metrics
  - Color-coded competency and certification status

- **Theatre Operations Modal** (`TheatreOpsModal.tsx`)
  - Operational issue tracking system
  - Issue types: Operational / Clinical / Escalation
  - Priority levels: Urgent / High / Medium / Low
  - Status tracking: Resolved / In-Progress / Acknowledged
  - Impact assessment
  - Previous occurrence tracking
  - Resolution notes
  - Assigned to tracking
  - Filter by type and time period (Today/Week/Month)

- **Turnover Time Analysis Modal** (`TurnoverTimeModal.tsx`)
  - Real-time turnover time tracking
  - Summary statistics: Average, target, total turnovers
  - Best/worst performing theatre identification
  - Individual theatre performance cards
  - Trend indicators: Improving / Worsening / Stable
  - Delay reason tracking with timestamps
  - Performance color coding (Green ≤75%, Yellow 76-100%, Red >100%)
  - Unit filtering

- **Efficiency Score Modal** (`EfficiencyScoreModal.tsx`)
  - Overall efficiency scoring system
  - Unit-specific scores (Main/DSU)
  - Theatre utilization tracking
  - On-time start rate monitoring
  - Session completion tracking
  - Start time performance (On-time/Early/Delayed)
  - Turnover efficiency metrics
  - Contributing factors (positive/negative)
  - Performance color coding (Green ≥85%, Yellow 70-84%, Red <70%)

- **Theatre Timeline Modal** (`TheatreTimelineModal.tsx`)
  - Visual timeline of scheduled cases
  - Real-time progress tracking
  - Case duration visualization
  - Delay tracking

- **Staff on Duty Modal** (`StaffDutyModal.tsx`)
  - Complete staff overview
  - Role-based filtering
  - Shift time display
  - Break status tracking
  - Unit filtering

### Changed
- Improved responsive design across all modals
- Standardized color coding system across features
- Enhanced visual hierarchy with consistent spacing

## [0.1.0] - 2025-01-XX

### Added - Initial Setup

- **Project Initialization**
  - Next.js 15.5.6 with App Router
  - TypeScript configuration
  - Tailwind CSS setup
  - Lucide React icons integration

- **Basic Structure**
  - Main dashboard layout
  - Component architecture established
  - Mock data structure for theatre operations
  - Theatre allocation data model (22 theatres)
    - Main Theatres 1-12
    - DSU Theatres 1-10

- **Core Data Models**
  - TheatreAllocation interface
  - Team member structure
  - Staff roles: Surgeon, Assistant, Anaesthetist, Anaes N/P, Scrub N/P, HCA, Tech Specialist
  - Status types: Surgery Started, Patient Sent For, Anaesthetic Room, Standby, Closed

---

## Deployment Notes

### Before Each GitHub Deployment:
1. Update version number in this CHANGELOG
2. Move items from [Unreleased] to new version section with date
3. Add deployment notes if applicable
4. Update README.md if data structures changed
5. Commit with message: "Release vX.X.X - [Brief description]"

### Version Numbering Guide:
- **Major (X.0.0)**: Breaking changes, major feature overhauls
- **Minor (0.X.0)**: New features, modal additions, significant enhancements
- **Patch (0.0.X)**: Bug fixes, minor tweaks, documentation updates

### Deployment Checklist:
- [ ] All features tested locally
- [ ] Version number updated in CHANGELOG
- [ ] README updated with new features/data structures
- [ ] No console errors or warnings
- [ ] Code formatted and linted
- [ ] Git commit with descriptive message
- [ ] Push to GitHub
- [ ] Verify deployment on hosting platform (if applicable)

---

## Future Versions (Planned)

### [0.4.0] - Backend Integration (Planned)
- API endpoint implementations
- Real-time WebSocket connections
- Database integration
- Authentication system
- Role-based access control

### [0.5.0] - Enhanced Features (Planned)
- Export functionality (PDF/Excel reports)
- Historical data analytics
- Predictive staffing models
- Mobile responsive improvements
- Push notifications for urgent issues

### [1.0.0] - Production Release (Planned)
- Full backend integration with hospital TMS
- User acceptance testing completed
- Security penetration testing passed
- NHS data standards compliance validated
- Performance optimization
- Production deployment ready

---

## Data Integration Status

### Currently Using Mock Data:
- ✅ Theatre allocations (22 theatres)
- ✅ Staff assignments (73 staff members)
- ✅ Operational issues
- ✅ Turnover times
- ✅ Efficiency scores
- ✅ Relief requests
- ✅ Break tracking
- ✅ Competencies and certifications

### Ready for Integration:
All data structures documented in README.md with expected API endpoints and database schema.

---

## Notes

- **Theatre Count**: 22 total (12 Main + 10 DSU)
- **Staff Count**: 73 real staff names across all theatres
- **Roles Tracked**: Anaes N/P, Scrub N/P, HCA (for relief/breaks)
- **Break Policy**:
  - Tea: Discretionary 10-15 min
  - Lunch: 30 min for shifts ≥9 hours
  - Supper: 30 min for shifts ≥11 hours
