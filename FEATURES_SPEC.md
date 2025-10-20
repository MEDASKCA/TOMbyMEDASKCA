# TOM - Complete Feature Specification

## 🎯 THE VISION

**TOM (Theatre Operations Manager)** is a comprehensive theatre management ecosystem that bridges:
- **PEOPLE** (Staff with competencies)
- **PROCEDURES** (Surgical operations with requirements)
- **PRODUCTS** (Inventory with UDI tracking)
- **SUPPLIERS** (Directory with documents)
- **COMPLIANCE** (Audit forms and sterilization tracking)

**Goal:** Forecast demand, identify variances, optimize operations, and ensure safety.

---

## 📋 COMPLETE FEATURE LIST

### **PHASE 1: MVP (6-8 weeks) - For NHS CEP**

#### 1. Theatre Schedule Dashboard ✓ IN PROGRESS
**Purpose:** Visual overview of all theatre activity

**Features:**
- Daily/weekly calendar view
- Multi-specialty support (Ortho, General, ENT, etc.)
- Traffic light status per theatre:
  - 🟢 Green = Ready
  - 🟡 Amber = Minor issues
  - 🔴 Red = Not ready
- Case details: procedure, surgeon, team, times
- Drag-and-drop scheduling
- Real-time status updates
- Click theatre → Full details view

**Demo Data:** 4 theatres, 2-3 specialties, realistic case mix

---

#### 2. Staff Roster with Competency Mapping ✓ IN PROGRESS
**Purpose:** Match right staff to right procedures

**Features:**
- Staff profiles with:
  - Role (Surgeon, Anesthetist, Scrub Nurse, ODP, etc.)
  - Grade (Consultant, Registrar, etc.)
  - Specialties
  - Competency levels per procedure (Learning/Assisted/Competent/Expert)
  - Equipment familiarity
  - Supplier product training
- Shift scheduling (Early/Late/Long-day/On-call)
- Availability calendar
- Shift swap requests/approvals
- Visual staffing gaps
- Skills matrix view

**AI Integration:** Suggest optimal team based on competencies

**Demo Data:** 20-30 staff across roles with varied competencies

---

#### 3. Inventory System with UDI Tracking ✓ IN PROGRESS
**Purpose:** Better than Netstock/Stock IQ for theatres

**Features:**
- Product catalog:
  - Instruments (individual + trays)
  - Consumables (sutures, swabs, etc.)
  - Equipment (scopes, monitors, etc.)
  - Drugs (anesthesia)
  - Implants (hip prosthesis, plates, etc.)

- For each item:
  - UDI (Universal Device Identifier)
  - Catalog number, batch number
  - Manufacturer/supplier
  - Quantity, min quantity
  - Location tracking
  - Cost
  - Expiry date
  - Sterilization status
  - Linked procedures

- **Instrument Trays:**
  - Tray catalog (Hip Set, Lap Set, etc.)
  - Contents checklist
  - Sterilization tracking
  - Condition status
  - Maintenance history

- **Smart Features:**
  - Fast search (better UX than competitors)
  - Low stock alerts
  - Expiring soon warnings
  - Usage logging per case
  - Predictive reordering (Phase 2)

**Demo Data:** 200+ items across categories, realistic NHS inventory

---

#### 4. Procedure Cards System ✓ IN PROGRESS
**Purpose:** Link procedures to everything they need

**Each Procedure Card Contains:**
- Procedure name, specialty, OPCS code
- Expected duration
- Required staff (roles, grades, count, competency level)
- Required instruments/trays
- Required consumables (with quantities)
- Required implants (if applicable)
- Special equipment needed
- Anesthesia type
- Risk level
- Special requirements
- Post-op care notes

**Links:**
- To products (with UDI references)
- To staff competencies
- To cases (when scheduled)

**Demo Data:** 15-20 common procedures (hip replacement, lap chole, etc.)

---

#### 5. Theatre Readiness Dashboard ✓ IN PROGRESS
**Purpose:** THE KILLER FEATURE - "Is Theatre X ready?"

**Real-time Checks:**
- ✅ Staffing: All roles filled with competent staff?
- ✅ Equipment: All items available and functional?
- ✅ Consumables: Sufficient stock?
- ✅ Sterilization: Instruments sterile and ready?
- ✅ Environment: Theatre cleaned and prepared?

**Display:**
- At-a-glance dashboard: "4 of 6 theatres ready"
- Traffic light per theatre
- Click → Detailed breakdown
- Proactive suggestions: "Assign scrub nurse to be ready"
- Time-based readiness: "Theatre 2 ready for 2pm case"

**Alerts:**
- Critical gaps (missing staff/equipment)
- Warnings (minor issues)
- Recommended actions

---

#### 6. Basic AI Allocation Engine ✓ IN PROGRESS
**Purpose:** Intelligent team suggestions

**How It Works:**
```
INPUT: Scheduled case (e.g., Total Hip Replacement)

AI PULLS:
1. Procedure card → Required roles, equipment, consumables
2. Staff database → Who's available + competent
3. Inventory → What's in stock + location
4. Historical data → Typical duration, past teams

OUTPUT:
- Optimal team assignment
- Match scores (0-100)
- Alternative options
- Warnings/conflicts
```

**Phase 1 = Rule-based matching:**
- Match role requirements
- Check competency levels
- Verify availability
- Consider workload balance

**Phase 2/3 = ML-based optimization** (future)

---

#### 7. Session Planning ✓ TO BUILD
**Purpose:** Link to elective waiting lists

**Features:**
- Session templates by specialty
- Expected duration vs. actual tracking
- Patient flow coordination
- Procedure scheduling with dependencies

---

#### 8. Bed Management Integration ✓ TO BUILD
**Purpose:** Coordinate patient flow

**Features:**
- Pre-op bed availability
- Recovery bed status
- ICU bed check (for major cases)
- Patient ready indicator
- Discharge coordination

---

### **PHASE 2: Extended Features (Post-CEP, 3-6 months)**

#### 9. Sterilization Unit Tracker
**Purpose:** Compliance and traceability

**Features:**
- Track sterilization cycles:
  - Autocycle ID and number
  - Date/time, duration
  - Temperature, pressure
  - Items sterilized (tray IDs)
  - Pass/fail status
  - Operator
  - Test results
- Link to instrument trays
- Expiry tracking
- Compliance documentation
- Batch tracking for recalls

---

#### 10. Supplier Data Upload & Directory
**Purpose:** Central supplier management

**Features:**
- Supplier directory:
  - Contact details
  - Product catalog
  - Representatives
  - Contracts
  - Payment terms

- Upload forms from suppliers:
  - Product specifications
  - MHRA certificates
  - Instructions for use (IFU)
  - Material safety data sheets (MSDS)
  - Invoices

- Auto-extract data to product catalog
- Link products to UDI database
- Track training/certifications

---

#### 11. Invoice Links & Cost Tracking
**Purpose:** Financial intelligence

**Features:**
- Link invoices to:
  - Products used
  - Cases performed
  - Cost per procedure
  - Supplier payments

- Budget tracking
- Cost variance analysis
- Spending patterns
- Contract compliance

---

#### 12. Analytics & Forecasting
**Purpose:** Intelligence layer for optimization

**Operational Analytics:**
- Theatre utilization rates
- Case duration variance (expected vs actual)
- Cancellation reasons and trends
- Staff efficiency metrics
- First-case start delays
- Turnover times

**Inventory Analytics:**
- Usage patterns by procedure
- Reorder predictions
- Cost analysis
- Waste reduction opportunities
- Stock-out incidents

**Forecasting:**
- Predict staffing needs
- Predict inventory requirements
- Identify variance root causes
- Optimization recommendations

**Dashboards:**
- Executive summary
- Department-specific views
- Trend analysis
- Benchmark comparisons

---

#### 13. Audit Form Builder
**Purpose:** Digital compliance audits

**Features:**
- Create custom audit forms:
  - WHO surgical safety checklist
  - Infection control audits
  - Equipment safety checks
  - Compliance inspections
  - Custom checklists

- Question types:
  - Yes/No
  - Text/number
  - Multiple choice
  - Photo evidence
  - Checklist

- Distribution:
  - Send links via NHS mail
  - Assign to specific staff/roles
  - Schedule recurring audits

- Response collection:
  - Mobile-friendly forms
  - Offline capability
  - Photo uploads

- Reporting:
  - Completion rates
  - Issues identified
  - Trend analysis
  - Action tracking

---

### **PHASE 3: Enterprise Features (6-12 months)**

#### 14. Advanced AI Capabilities
- Machine learning predictions
- Pattern recognition
- Anomaly detection
- Natural language queries: "TOM, who can cover Thursday afternoon?"
- Conversational interface
- Proactive recommendations

---

#### 15. Multi-Trust Deployment
- Organization hierarchy
- Trust-level vs national data
- Shared supplier directory
- Benchmarking across trusts
- Best practice sharing

---

#### 16. Mobile App (PWA)
- Offline capability
- Push notifications
- Quick status checks
- Accept/decline shifts on mobile
- Emergency alerts
- Barcode/QR scanning

---

#### 17. ERP Integration
- Link to finance systems
- Link to HR systems
- Link to patient management systems
- HL7/FHIR compatibility
- API for third-party tools

---

## 🎨 UI/UX PRINCIPLES

**Better than Netstock/Stock IQ means:**
1. **Faster:** Search results in <100ms
2. **Intuitive:** No training needed
3. **Visual:** Traffic lights, color coding, icons
4. **Mobile-first:** Works perfectly on tablets/phones
5. **Smart:** Predictive, not just reactive
6. **Theatre-specific:** Not generic warehouse software

**NHS Compliance:**
- WCAG 2.1 AA accessibility
- NHS color scheme support
- NHS branding guidelines
- Mobile-responsive
- Fast loading (<2s)

---

## 📊 SUCCESS METRICS

### For NHS CEP Demo:
- ✅ All Phase 1 features working
- ✅ Realistic demo data
- ✅ 3-5 minute video walkthrough
- ✅ Clear value proposition
- ✅ Roadmap to Phase 2/3

### Post-CEP Goals:
- 1 NHS trust pilot
- 10+ active users
- 95%+ uptime
- Measurable time savings
- Positive user feedback

### Commercial Goals (12-18 months):
- 3-5 paying NHS trusts
- £50k-£150k ARR
- DSPT compliance achieved
- G-Cloud framework approved
- Case studies with metrics

---

## 💰 MARKET POSITIONING

**Current Solutions:**
- HealthRoster: £100k+/year, roster only, clunky
- Netstock/Stock IQ: Inventory only, not theatre-specific
- Separate procedure card systems
- Excel spreadsheets (most common!)

**TOM Advantages:**
- ✅ All-in-one integrated system
- ✅ Theatre-specific design
- ✅ AI-powered allocation
- ✅ Better UX than competitors
- ✅ Lower cost (£20k-50k/trust for Phase 1)
- ✅ Scalable pricing model
- ✅ Microsoft Teams integration
- ✅ Mobile-first

**Value Proposition:**
> "TOM saves NHS trusts £100k-500k annually through:
> - Reduced theatre cancellations (better readiness)
> - Optimized staff allocation (right skills, right time)
> - Lower inventory costs (better forecasting)
> - Improved safety (competency matching)
> - Regulatory compliance (UDI tracking, audit trails)"

---

## 🚀 NEXT ACTIONS

**Immediate (This Session if Tokens Allow):**
1. ✅ Rebrand to TOM - DONE
2. ✅ Create TypeScript types - DONE
3. 🔄 Build database initialization with demo data - IN PROGRESS
4. ⏳ Create Theatre Schedule Dashboard
5. ⏳ Create Staff Roster view
6. ⏳ Create Inventory system
7. ⏳ Create Procedure Cards
8. ⏳ Create Readiness Dashboard

**Next Session:**
- Build out all Phase 1 features
- Add demo data for orthopedics
- Create comprehensive UI components
- Implement real-time updates
- Add mobile responsiveness

**Week 2-3:**
- Polish UI/UX
- Add notifications
- Implement basic AI allocation
- Performance optimization

**Week 4-6:**
- User testing
- Bug fixes
- Demo video creation
- NHS CEP application preparation

---

## 📞 WHEN YOU RETURN

Tell Claude:

> "Continue building TOM at C:\Users\forda\projectsocial. Read FEATURES_SPEC.md for the complete vision. We've rebranded to TOM and created comprehensive TypeScript types. Now let's build the core features starting with [specific feature]. The app runs at http://localhost:3001."

---

**THIS IS GOING TO BE INCREDIBLE!** 🚀🏥
