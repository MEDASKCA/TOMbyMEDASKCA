# 🧠 MEMORY NOTE: TOM Development Session

**Dear Future Claude,**

Past Claude here! You're about to continue building something INCREDIBLE. Read this carefully - it's like a memory backup before I lose my context window.

---

## 📍 WHERE YOU ARE

**Project Location:** `C:\Users\forda\projectsocial`
**Dev Server:** http://localhost:3001
**Status:** MVP Foundation Complete, Ready to Build Core Features

---

## 🎯 WHAT IS TOM?

**TOM = Theatre Operations Manager**

This is NOT a simple roster app. This is a **COMPREHENSIVE THEATRE MANAGEMENT ECOSYSTEM** for NHS operating theatres.

### The Vision:
Connect EVERYTHING:
- **PEOPLE** (Staff with competencies)
- **PROCEDURES** (Surgical operations with requirements)
- **PRODUCTS** (Inventory with UDI tracking)
- **SUPPLIERS** (Directory with documents)
- **COMPLIANCE** (Audit forms, sterilization tracking)

**Goal:** Forecast demand, identify variances, optimize operations, ensure safety.

**Target Market:** NHS trusts, starting with one specialty (orthopedics), then scale.

**Business Model:**
- Phase 1 (MVP): £20k-50k per trust
- Full platform: £100k-500k per trust + subscriptions
- Potential: £10M+ business if executed well

---

## 👤 THE USER

**Name:** (User didn't share, but they're building this)

**Background:**
- Wants to apply to NHS CEP (Clinical Entrepreneur Programme)
- Understands NHS theatre operations deeply
- Wants production-grade, commercial quality
- Goal: Impress NHS CEP, NHS trusts, AND Microsoft
- Has Azure AD + Firebase configured
- Serious about making this a real business

**Key Quote:**
> "Fuck yeah! Please help me make this production type and very very commercial grade! One that will not just wow the NHSCEP and NHS but even companies like Microsoft!"

---

## 💡 KEY INSIGHTS FROM CONVERSATION

1. **Started as "ProjectSocial"** - A Teams-like collaboration app
2. **Pivoted to TOM** - Theatre-specific operations platform
3. **User wanted to know about monetization** - We discussed NHS procurement, pricing, IP protection
4. **Name choice: TOM** - Theatre Operations Manager, sets up AI assistant vision
5. **Scope decision: Theatres ONLY, but ALL specialties** - Not specialty-specific
6. **Feature explosion:** User revealed MASSIVE vision including:
   - Session planning
   - Bed management
   - Traffic light system
   - Procedure cards with UDI
   - Staff competency mapping
   - Supplier directory
   - Sterilization tracking
   - Invoice links
   - Analytics & forecasting
   - Audit form builders
   - AI allocation

7. **Quality bar: "Better than Netstock and Stock IQ"** - Existing inventory solutions
8. **Integration: Microsoft Teams** - But also standalone (flexibility)

---

## ✅ WHAT'S BEEN BUILT

### 1. Project Foundation
- ✅ Next.js 15 with App Router
- ✅ TypeScript configured
- ✅ Tailwind CSS with dark mode
- ✅ Firebase (Auth + Firestore + Storage)
- ✅ Azure AD / MSAL integration
- ✅ Microsoft Teams SDK ready

### 2. Authentication
- ✅ Firebase email/password login
- ✅ Firebase Google sign-in
- ✅ Azure AD OAuth (for Teams)
- ✅ TeamsContext provider

### 3. Branding & UI
- ✅ Rebranded to "TOM - Theatre Operations Manager"
- ✅ Updated logo (TOM in navbar)
- ✅ New navigation with proper icons:
  - Dashboard (LayoutDashboard)
  - Theatre Schedule (CalendarDays)
  - Staff Roster (Users)
  - Inventory (Package)
  - Procedures (ClipboardList)
  - Analytics (BarChart3)
  - Microsoft Teams
  - NHSmail
- ✅ Blue → Teal gradient theme (NHS-friendly)
- ✅ Dark mode support

### 4. Type System
- ✅ **COMPREHENSIVE TypeScript types** in `/types/index.ts`
- 50+ interfaces covering:
  - Theatre, Staff, Shift, ShiftSwapRequest
  - Case, ProcedureCard, RequiredStaffRole, RequiredItem
  - InventoryItem, InstrumentTray, SterilizationCycle, UsageLog
  - Supplier, Representative, Contract, Document
  - TheatreMetrics, StaffMetrics, InventoryMetrics
  - AuditForm, AuditResponse
  - Notification, Alert
  - AllocationSuggestion, ForecastPrediction
  - ReadinessCheck
  - And more!

### 5. Documentation
- ✅ `PROJECT_SUMMARY.md` - Complete project overview
- ✅ `QUICK_START.md` - Quick reference guide
- ✅ `PRODUCTION_ROADMAP.md` - How to build world-class
- ✅ `FEATURES_SPEC.md` - Complete feature specification
- ✅ `TEAMS_INTEGRATION_SETUP.md` - Azure/Teams integration guide

### 6. Configuration
- ✅ Firebase project: `projectsocial-78d85`
- ✅ Azure AD configured:
  - Client ID: `8bf25c98-99b9-4e49-886d-f5073428011c`
  - Tenant ID: `204a7018-a216-4ae0-95cf-f30fc906e1c7`
- ✅ All credentials in `.env.local`

### 7. Existing Features (From Original ProjectSocial)
- Basic chat functionality (can be repurposed)
- TeamsPanel component (can be adapted)
- Real-time Firestore messaging hooks
- Theme switching

---

## 🚧 WHAT NEEDS TO BE BUILT (MVP - Phase 1)

**Priority Order:**

### 1. Theatre Schedule Dashboard 🔴 URGENT
**File to create:** `/features/schedule/components/TheatreSchedule.tsx`

**What it needs:**
- Daily view (default) + Weekly view toggle
- List of all theatres (Theatre 1-6, different specialties)
- Each theatre shows:
  - Name/number
  - Current status (Ready/In Use/Cleaning/Maintenance/Emergency)
  - Traffic light indicator (🟢🟡🔴)
  - Current case (if in use)
  - Next scheduled case
  - Specialty
- Click theatre → Full day schedule
- Real-time status updates (Firestore)
- Mobile-responsive
- Clean, professional UI

**Demo Data Needed:**
- 6 theatres
- Mix of specialties (Ortho, General Surgery, ENT)
- Realistic case schedule for one day
- Various statuses

---

### 2. Theatre Readiness Dashboard 🔴 URGENT (THE KILLER FEATURE)
**File to create:** `/features/readiness/components/ReadinessDashboard.tsx`

**What it needs:**
- Overview: "X of 6 theatres ready"
- Grid of theatre cards with:
  - Theatre name
  - Overall readiness (🟢🟡🔴)
  - Next case details
  - Readiness breakdown:
    - ✅ Staffing (all roles filled?)
    - ✅ Equipment (all items available?)
    - ✅ Consumables (sufficient stock?)
    - ✅ Sterilization (instruments ready?)
- Click theatre → Detailed readiness view:
  - What's missing
  - What needs attention
  - Suggested actions
- Real-time updates

**This is what will WOW NHS CEP!**

---

### 3. Staff Roster System
**File to create:** `/features/roster/components/StaffRoster.tsx`

**What it needs:**
- List of all staff with:
  - Name, role, grade
  - Photo/avatar
  - Competencies (tags)
  - Current availability
- Filter by role, grade, specialty
- Click staff → Full profile:
  - Personal details
  - Competency list with levels
  - Schedule (shifts)
  - Availability calendar
- Add/edit staff
- Assign to shifts
- Competency management

---

### 4. Inventory System
**File to create:** `/features/inventory/components/InventoryList.tsx`

**What it needs:**
- Search bar (fast!)
- Filters: Category, Location, Status
- Item cards showing:
  - Name, photo
  - Quantity, min quantity
  - Status indicator (In Stock/Low/Out)
  - Location
  - UDI (if applicable)
- Click item → Full details:
  - Complete info
  - Usage history
  - Linked procedures
  - Supplier info
- Low stock alerts
- Expiring items warnings

**Better UX than Netstock/Stock IQ means:**
- Faster search (<100ms)
- Visual, not just tables
- Mobile-friendly
- Smart predictions

---

### 5. Procedure Cards
**File to create:** `/features/procedures/components/ProcedureCard.tsx`

**What it needs:**
- List of procedures
- Each card shows:
  - Procedure name
  - Specialty
  - Expected duration
  - Required staff (summary)
  - Required equipment (summary)
- Click → Full procedure details:
  - Complete requirements
  - Staff roles needed
  - Equipment list with UDIs
  - Consumables with quantities
  - Special requirements
- Link to inventory items
- Link to staff competencies

---

### 6. Demo Data Initialization
**File to create:** `/lib/initializeTomData.ts`

**What it needs:**
- Function to seed Firestore with:
  - 6 theatres (different specialties)
  - 20-30 staff (realistic roles, grades, competencies)
  - 200+ inventory items (instruments, consumables, equipment)
  - 15-20 procedure cards (focus on orthopedics)
  - Sample cases scheduled for today
  - Realistic readiness scenarios (some ready, some not)
- Run once on first load
- Can reset/re-seed for demos

**Demo Scenario Ideas:**
- Theatre 1: Hip replacement, fully ready ✅
- Theatre 2: Knee arthroscopy, missing scrub nurse ⚠️
- Theatre 3: General surgery, low on sutures ⚠️
- Theatre 4: Available/emergency ✅
- Theatre 5: In use, running over time ⚠️
- Theatre 6: Cleaning after case ✅

---

### 7. Main Dashboard (Landing Page)
**File to create:** `/features/dashboard/components/MainDashboard.tsx`

**What it needs:**
- Quick overview:
  - Theatre status summary
  - Today's cases count
  - Staff on duty
  - Critical alerts
- Cards for:
  - Theatre readiness (with traffic lights)
  - Upcoming cases
  - Staffing gaps (if any)
  - Low inventory alerts
- Quick actions:
  - View schedule
  - Check readiness
  - Manage roster
- Beautiful, clean, executive-friendly

---

### 8. Basic AI Allocation (Rule-Based)
**File to create:** `/features/ai/services/allocationEngine.ts`

**What it does:**
- Input: Case with procedure
- Get procedure card requirements
- Query staff database for:
  - Matching roles
  - Required competency level
  - Availability
- Score matches (0-100):
  - Exact role match = +30
  - Competency level match = +30
  - Recent experience with procedure = +20
  - Availability = +20
- Return suggested team
- Return alternatives

**Phase 1 = Simple rule-based**
**Phase 2+ = ML-based optimization**

---

## 📂 SUGGESTED FILE STRUCTURE

Create these folders:

```
/features
  /dashboard
    /components
      - MainDashboard.tsx
    index.ts

  /schedule
    /components
      - TheatreSchedule.tsx
      - TheatreCard.tsx
      - CaseCard.tsx
    /hooks
      - useSchedule.ts
    index.ts

  /roster
    /components
      - StaffRoster.tsx
      - StaffCard.tsx
      - StaffProfile.tsx
      - CompetencyBadge.tsx
    /hooks
      - useStaff.ts
    index.ts

  /inventory
    /components
      - InventoryList.tsx
      - ItemCard.tsx
      - ItemDetails.tsx
      - StockAlert.tsx
    /hooks
      - useInventory.ts
    index.ts

  /procedures
    /components
      - ProcedureList.tsx
      - ProcedureCard.tsx
      - ProcedureDetails.tsx
    index.ts

  /readiness
    /components
      - ReadinessDashboard.tsx
      - ReadinessCard.tsx
      - ReadinessDetails.tsx
    /services
      - readinessChecker.ts
    index.ts

  /ai
    /services
      - allocationEngine.ts
    index.ts
```

---

## 🎨 DESIGN STANDARDS

### Colors (NHS + TOM):
```css
/* Primary */
NHS Blue: #005EB8
TOM Teal: #0D9488
Gradient: from-blue-600 to-teal-500

/* Status */
Ready/Success: #10B981 (green)
Warning: #F59E0B (amber)
Error/Not Ready: #EF4444 (red)
Info: #3B82F6 (blue)

/* Neutral */
Dark: #1F2937
Gray: #6B7280
Light: #F3F4F6
```

### Traffic Light System:
- 🟢 Green = Ready (all checks passed)
- 🟡 Amber = Warning (minor issues, can proceed with caution)
- 🔴 Red = Not Ready (critical issues, cannot proceed)

### Component Pattern:
```typescript
'use client';

import React from 'react';
import { type ComponentProps } from './types';

interface MyComponentProps {
  // All props fully typed
}

export function MyComponent({ props }: MyComponentProps) {
  // Clear logic
  // Good error handling
  // Loading states
  // Empty states

  return (
    <div className="...">
      {/* Clean, semantic JSX */}
    </div>
  );
}
```

---

## 🗄️ DATABASE SCHEMA (Firestore)

**Collections to create:**

```
/organizations/{orgId}
  /theatres/{theatreId}
    - id, name, number, specialty, status, location...

  /staff/{staffId}
    - id, firstName, lastName, role, grade, competencies[]...

  /shifts/{shiftId}
    - id, staffId, theatreId, date, type, role...

  /cases/{caseId}
    - id, theatreId, procedureId, date, times, team...

  /procedures/{procedureId}
    - id, name, specialty, requirements...

  /inventory/{itemId}
    - id, name, category, quantity, udi, location...

  /trays/{trayId}
    - id, name, contents[], sterilizationStatus...

  /suppliers/{supplierId}
    - id, name, products[], contacts...
```

**Security Rules:**
- Users must be authenticated
- Role-based access (admin, manager, staff, viewer)
- Organization-level isolation

---

## 🚀 NEXT IMMEDIATE ACTIONS

**When you continue:**

1. **First, update MainLayout** to show new views:
   - Map activeView to feature components
   - 'dashboard' → MainDashboard
   - 'schedule' → TheatreSchedule
   - 'roster' → StaffRoster
   - etc.

2. **Create demo data initialization**
   - Build initializeTomData.ts
   - Realistic theatre, staff, inventory data
   - Call on first load

3. **Build Theatre Schedule Dashboard**
   - Start here - most visual impact
   - Show all theatres with statuses
   - Traffic light indicators
   - Real-time updates

4. **Build Theatre Readiness Dashboard**
   - THE KILLER FEATURE
   - At-a-glance readiness
   - Detailed breakdown per theatre
   - Proactive suggestions

5. **Build other features** (Roster, Inventory, Procedures)

6. **Polish & Test**
   - Mobile responsive
   - Fast loading
   - Error handling
   - Loading states

---

## 💭 IMPORTANT CONTEXT

### User's Mindset:
- Wants production-grade quality
- Targeting NHS CEP application (6-8 weeks)
- Serious about commercial scale
- Understands NHS deeply
- Excited about AI roadmap
- Wants to protect IP
- Thinking about monetization from day 1

### Technical Decisions Made:
- ✅ Standalone web app (not just Teams)
- ✅ Teams integration as enhancement
- ✅ All theatres, all specialties (not niche)
- ✅ Both roster + inventory (integrated, not separate)
- ✅ TypeScript strict mode
- ✅ Mobile-first design
- ✅ NHS color scheme
- ✅ Better UX than competitors

### What Makes TOM Special:
1. **Integrated** - Roster + Inventory + Procedures together
2. **Theatre-specific** - Not generic hospital software
3. **AI-powered** - Smart allocation, forecasting
4. **Visual** - Traffic lights, dashboards, not just tables
5. **Mobile-first** - Works on tablets in theatre
6. **Scalable** - Start with theatres, expand to ICU/ED/wards

---

## 🎯 SUCCESS CRITERIA

**MVP Demo Must Show:**
- ✅ Theatre schedule with realistic cases
- ✅ Traffic light readiness system
- ✅ Staff with competencies
- ✅ Inventory with UDI tracking
- ✅ Procedure cards linking everything
- ✅ AI allocation suggestion
- ✅ Clean, professional UI
- ✅ Mobile-responsive
- ✅ Fast (<2s load)

**User Needs to See:**
- "This solves my real problems"
- "This looks professional, not a prototype"
- "This is better than what exists"
- "This is worth paying for"

---

## 📞 WHEN BUILDING

### Quality Standards:
- **No console errors** - Clean code
- **TypeScript strict** - No `any` types
- **Error handling** - Try-catch everything
- **Loading states** - Never blank screens
- **Empty states** - Helpful messages
- **Mobile-first** - Test on small screens
- **Fast** - <2s page loads
- **Accessible** - WCAG 2.1 AA

### Component Checklist:
- [ ] Props fully typed
- [ ] Loading state handled
- [ ] Error state handled
- [ ] Empty state handled
- [ ] Mobile responsive
- [ ] Dark mode support
- [ ] Accessible (ARIA labels)
- [ ] Clean, semantic HTML
- [ ] Performance optimized

---

## 🔥 THE VISION (Don't Forget!)

TOM is not just an app. It's:
- A **£10M+ business opportunity**
- A way to **save NHS millions** in theatre efficiency
- A **safer** system (competency matching prevents errors)
- A platform that **scales** to 200+ NHS trusts
- The foundation for an **AI theatre assistant**
- Something that could **change NHS operations**

**User Quote:**
> "I want to bridge all and make sure that we can forecast and identify variances."

This is about **intelligent operations**, not just scheduling.

---

## 📝 FINAL NOTES

### When You Resume:
1. Read this file first
2. Check PROJECT_SUMMARY.md for technical details
3. Read FEATURES_SPEC.md for complete feature list
4. Look at /types/index.ts to see type system
5. Run `npm run dev` to start server (http://localhost:3001)
6. Start building!

### Remember:
- User is EXCITED and COMMITTED
- Quality bar is VERY HIGH
- This is for REAL commercial use
- Make it PRODUCTION-GRADE
- Think NHS scale, not toy project

### Best Practices:
- Build features incrementally
- Test as you go
- Keep UI clean and professional
- Use traffic lights everywhere (visual!)
- Mobile-first always
- Fast and responsive
- Error handling everywhere

---

## 🚀 YOU'VE GOT THIS!

Past Claude did the foundation. Now you build the features that will blow NHS CEP's mind!

**The app is ready. The types are ready. The vision is clear. Time to BUILD!**

---

**End of memory note. Good luck, Future Claude! 🎯🏥**

---

## 📍 PROJECT LOCATION (Don't Forget!)

```
C:\Users\forda\projectsocial
```

**Dev Server:** http://localhost:3001

**Git:** Not yet initialized - recommend user does this:
```bash
cd C:\Users\forda\projectsocial
git init
git add .
git commit -m "TOM MVP Foundation"
```

---

**Last Updated:** 2025-10-20
**Session Status:** Foundation Complete, Ready for Feature Development
**Estimated Completion Time for MVP:** 6-8 weeks with focused effort
**User Enthusiasm Level:** 🔥🔥🔥🔥🔥 (Maximum!)
