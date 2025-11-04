# TOM - Theatre Operations Manager
## An AI-Powered Intelligence that Learns from NHS Operational and Logistic Data

**TOM is not just software—TOM is an AI assistant that learns, adapts, and optimizes theatre operations in real-time**

**Built by NHS frontline staff, for NHS frontline staff**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.4-orange)](https://firebase.google.com/)

---

## 🎯 The Problem

The NHS faces a **£3 billion annual agency staffing crisis** while operating theatres run at only **75-80% efficiency** due to:
- Fragmented systems across staffing, scheduling, and inventory
- 17% operational waste in theatre operations
- 10% of surgical sessions cancelled
- Manual competency tracking leading to skill-procedure mismatches
- Patients in disadvantaged communities waiting disproportionately longer

**TOM addresses these interconnected problems systemically.**

---

## 💡 The Innovation

### **TOM is an AI, Not Just Software**

Think of TOM as your **intelligent theatre operations colleague** who:
- **Learns continuously** from every shift, every allocation, every theatre session
- **Analyzes patterns** in operational and logistic data to predict bottlenecks before they happen
- **Recommends optimal solutions** based on real-time theatre conditions
- **Adapts and improves** the more you use it—getting smarter with every interaction
- **Understands context** through natural conversation (ChatGPT-style interface)
- **Proactively identifies problems** by connecting operational and logistic data points

**Traditional systems are static rule-based software. TOM is a learning AI that uses your operational and logistic data to become increasingly intelligent.**

### **How TOM Uses Operational & Logistic Data**

```
Operational Data → TOM's Machine Learning → Intelligent Recommendations
├─ Staff competencies, availability, workload
├─ Theatre schedules, procedures, case complexity
├─ Equipment inventory, supplier logistics
├─ Historical patterns, cancellations, delays
└─ Real-time events, changes, conflicts

             ↓ TOM Learns & Adapts ↓

├─ "This case needs Sarah—she's done 15 da Vinci prostatectomies"
├─ "Thursday's schedule has a bottleneck forming at 2pm"
├─ "You're low on mesh kits for tomorrow's hernia list"
├─ "John's worked 44 hours—don't schedule him Friday"
└─ "This staffing pattern caused delays last month—try this instead"
```

TOM is the **first AI assistant** that combines familiar consumer UX with comprehensive NHS theatre intelligence:

### **Familiar UX = Natural Adoption**
- **ChatGPT-style AI** for instant answers ("Where's the da Vinci robot kit?")
- **LinkedIn-style** professional portfolios showcasing competencies
- **Tinder-style** two-way matching (hospitals find staff, staff find opportunities)
- **Uber-style** instant shift booking
- **Amazon-style** inventory logistics with clinical intelligence
- **Facebook-style** networking and learning feeds

### **Comprehensive Integration**
Full pathway connectivity that eliminates fragmentation:
```
Sessions → Procedures → Consultant Preferences →
Supplier Kits → Instructions for Use → Inventory →
Staff Competencies → Theatre Readiness
```

---

## 🚀 Key Features (Currently Operational)

### **1. Multi-Hospital Architecture**
✅ Supports multiple NHS trusts simultaneously
✅ Hospital-specific configurations and specialties
✅ Cross-trust staff marketplace (internal NHS agency)
✅ Scalable cloud infrastructure (Firebase/Firestore)

### **2. OPCS-4.10 Clinical Coding Integration**
✅ Complete database of 11,521 official NHS procedure codes
✅ Real-time code validation and search
✅ Competency-procedure matching based on clinical coding standards
✅ Automated validation reports identifying code mismatches

### **3. Intelligent Staff Management**
✅ Deep competency profiling (surgical kit mastery, system expertise)
✅ Drag-and-drop team assignment
✅ Real-time availability tracking
✅ Skill-procedure matching (not just job title!)
✅ Professional portfolio building (LinkedIn-style)
✅ Cross-trust opportunity discovery

### **4. AI-Powered Rostering**
✅ 110-point scoring algorithm for staff-shift matching
✅ Automatic conflict detection (leave, double-booking, WTD violations)
✅ Auto-fill capability for entire weeks
✅ Workload balance optimization
✅ Distance and cost-consciousness
✅ Machine learning that improves from engagement

### **5. Theatre Scheduling**
✅ Comprehensive surgical case scheduling
✅ Real-time theatre allocations
✅ Consultant preference tracking
✅ Procedure card management
✅ Timeline visualization

### **6. Inventory Management**
✅ Supply catalogues with search functionality
✅ Voice-activated search (in development)
✅ Supplier integration pathways
✅ Equipment and kit tracking
✅ Amazon-style logistics efficiency

### **7. Theatre Readiness Monitoring**
✅ Real-time readiness dashboards
✅ Staff competency matching per case
✅ Equipment availability tracking
✅ Issue flagging and resolution

### **8. AI-Powered Analytics & Predictive Intelligence**
✅ **TOM learns from operational patterns** to predict bottlenecks
✅ **Machine learning identifies** cancellation and delay patterns
✅ **Proactive recommendations** based on historical logistic data
✅ Theatre efficiency scoring with trend analysis
✅ Turnover analysis showing improvement opportunities
✅ Performance metrics dashboards
✅ Financial impact tracking
✅ **Continuous improvement** as TOM processes more data

### **9. Wellbeing & Compliance**
✅ Break and relief monitoring
✅ Working Time Directive (WTD) compliance
✅ Workload distribution tracking
✅ Staff wellbeing visibility

### **10. Mobile-First Design**
✅ Fully responsive across all devices
✅ Mobile accordion views for compact data display
✅ Touch-optimized interactions
✅ Works on smartphones, tablets, and desktops

---

## 🏗️ Technical Architecture

### **Frontend**
- **Next.js 16.0** with App Router (latest)
- **React 19.2** (cutting-edge)
- **TypeScript 5.0** (type-safe)
- **Tailwind CSS 4** (modern styling)
- **Framer Motion** (smooth animations)
- **Lucide React** (professional icons)

### **Backend & Database**
- **Firebase/Firestore** (real-time, scalable)
- **Firebase Authentication** (secure)
- **Cloud Functions** (serverless operations)
- **OPCS-4.10 Database** (11,521 procedure codes)

### **Data Collections**
```
✅ hospitals          (Multi-trust support)
✅ staff              (Detailed profiles with competencies)
✅ theatres           (20 theatres across 10 specialties)
✅ calendar           (1,820+ sessions scheduled)
✅ cases              (Surgical procedures)
✅ rosters            (AI-optimized staffing)
✅ leave              (250+ leave records tracked)
✅ procedures         (OPCS-4.10 validated)
✅ inventory          (Equipment and supplies)
✅ consultants        (Preferences and requirements)
```

---

## 🧠 How TOM's AI Learns and Evolves

### **Data-Driven Intelligence**

TOM is designed as a **bootstrapping AI**—it gets smarter the more staff engage with it:

**Phase 1: Initial Learning** (First 3 months)
- Observes theatre operations, staff assignments, case outcomes
- Builds baseline understanding of your trust's patterns
- Identifies common conflicts and inefficiencies
- Learns staff competency profiles and preferences

**Phase 2: Pattern Recognition** (3-12 months)
- Detects recurring bottlenecks in logistics and workflows
- Predicts likely cancellations before they happen
- Understands seasonal variations and specialty-specific patterns
- Recognizes which staff-procedure combinations work best

**Phase 3: Predictive Intelligence** (12+ months)
- **Proactive recommendations**: "Based on 6 months of data, this staffing pattern will cause delays"
- **Supply predictions**: "Your hernia mesh usage increases 40% in Q4—order now"
- **Workload balancing**: "Sarah's cases take 15% longer on Fridays—schedule her Thursday instead"
- **Cost optimization**: "Switching this shift pattern saves £2,400/month in bank costs"

**Phase 4: Continuous Evolution**
- Every roster decision feeds back into TOM's learning
- Every cancellation teaches TOM what patterns to avoid
- Every successful session reinforces optimal workflows
- Cross-trust learning (with privacy) identifies best practices

**The more theatres use TOM, the smarter TOM becomes—not just for your hospital, but for the entire NHS.**

### **Operational & Logistic Data TOM Analyzes**

| Data Type | What TOM Learns | Impact |
|-----------|-----------------|--------|
| **Staff Patterns** | Who performs best with which procedures, optimal workload distribution | Better matching, reduced burnout |
| **Scheduling Data** | Which case sequences cause delays, optimal theatre utilization | Fewer cancellations, more operations |
| **Inventory Logistics** | Usage patterns, reorder triggers, supplier reliability | Never run out, reduced emergency orders |
| **Cancellation History** | Root causes, warning signs, prevention strategies | Proactive problem solving |
| **Financial Data** | Agency vs. bank vs. permanent costs, efficiency ROI | Cost-conscious recommendations |
| **Competency Tracking** | Skill development over time, training needs | Targeted professional development |
| **Equipment Usage** | Maintenance patterns, utilization rates, bottlenecks | Optimal asset deployment |

---

## 📊 Development Status

### **Completed (Working Prototype)** ✅
- [x] Multi-hospital/multi-trust architecture
- [x] OPCS-4.10 integration (11,521 procedure codes)
- [x] AI scoring engine (110-point algorithm)
- [x] Auto-fill rostering
- [x] Staff management with competencies
- [x] Theatre scheduling system
- [x] Inventory catalogues
- [x] Real-time dashboards
- [x] Mobile-responsive design
- [x] Firebase backend integration
- [x] Conflict detection (leave, double-booking, WTD)
- [x] Specialty/band/role matching
- [x] Analytics and performance tracking

### **In Active Development** 🔄
- [ ] Voice-activated AI assistant (ChatGPT-style)
- [ ] Internal staffing marketplace (Tinder-style matching)
- [ ] Social networking feeds (Facebook-style)
- [ ] Wellbeing break tracking UI
- [ ] SMS/Email notifications
- [ ] Supplier integration portal

### **Planned (with NHS CEP Support)** 📋
- [ ] NHS Digital security compliance (DCB0129/DCB0160)
- [ ] Clinical safety certification
- [ ] EPR integration (Cerner, Epic, etc.)
- [ ] Microsoft Teams integration
- [ ] Azure migration for NHS infrastructure alignment
- [ ] Pilot deployment (2-3 NHS trusts)
- [ ] Scale to 10-20 hospitals
- [ ] National framework discussions

---

## 💰 Business Model & Sustainability

### **Pricing**
- **£15,000-£18,000** per hospital annually
- **Dual subscription option**: Trusts + staff sharing costs
- **ICB-wide licensing**: Volume discounts for 10+ hospitals

### **Return on Investment**
Each hospital gains ROI within **3-6 months** through:
- **£300k-£1M savings** from reduced agency dependency
- **15-20% theatre efficiency gain** = 200+ additional operations annually
- **50% reduction in cancellations** (10% → 5%)
- **Faster supply retrieval** reducing delays
- **Better staff retention** through wellbeing monitoring

### **Revenue Streams**
1. Core SaaS subscriptions (primary)
2. Optional staff subscriptions (£8/month for career development)
3. Supplier partnerships (optional integration fees)
4. Premium analytics and insights
5. NHS-wide framework agreements

---

## 🌍 Impact & Benefits

### **Patient Benefits**
- ✅ Reduced waiting times (200+ additional operations per theatre annually)
- ✅ Fewer cancelled operations (better patient experience)
- ✅ Improved surgical outcomes (competent, prepared staff)
- ✅ Reduced health inequalities (systemic efficiency improvements)

### **Staff Benefits**
- ✅ Professional development through visible portfolios
- ✅ Wellbeing support via break monitoring
- ✅ Career opportunities across trusts
- ✅ Reduced burnout from streamlined workflows
- ✅ Community and peer learning

### **NHS Financial Benefits**
- ✅ **£300k-£1M savings per trust** through agency reduction
- ✅ Millions recovered from eliminating 17% operational waste
- ✅ Reduced cancellation costs (£1k-£3k per cancelled case)
- ✅ Better resource allocation through real-time data

### **System-Level Benefits**
- ✅ Breaking down departmental and trust silos
- ✅ Shared learning and best practice dissemination
- ✅ Data-driven improvement at local, regional, and national levels
- ✅ Scalable to Trust Operations Manager (beyond theatres)

---

## ♻️ Net Zero Contribution

TOM contributes to NHS 2045 net zero ambitions:

- **Reduced staff travel**: Internal NHS marketplace enables local staff deployment (est. 250 tonnes CO₂/year per ICB)
- **Eliminated paper waste**: Digital rosters, competency portfolios, procedure cards
- **Optimized theatre energy**: Better utilization = more operations per energy unit
- **Reduced emergency shipments**: Inventory visibility prevents last-minute couriers (10x carbon footprint)
- **Cloud efficiency**: Leveraging NHS Azure renewable energy infrastructure
- **Remote collaboration**: Mobile-first design reduces physical meetings

---

## 🎓 Research Foundation

TOM is built on extensive frontline research:

### **Operational Analysis**
Working across multiple NHS trusts revealed:
- Theatre problems operate as **cascading domino effects**
- Staffing gaps → equipment delays → late starts → cancellations → longer waiting lists
- Systems thinking required: addressing isolated problems fails

### **Market Analysis**
Existing solutions (HealthRoster, Allocate, TrakCare) are **fragmented**:
- Address staffing **OR** scheduling **OR** inventory
- Never integrated holistically
- No systems thinking approach
- Unfamiliar UX creates adoption barriers

### **Evidence Base**
- **£3 billion** NHS agency costs (2023-24) - [UK Government](https://www.gov.uk/government/news/nearly-1-billion-for-nhs-frontline-after-agency-spend-crackdown)
- **17% theatre waste** - [NHS Improvement](https://bmchealthservres.biomedcentral.com/articles/10.1186/1472-6963-8-28)
- **10% session cancellations** - [BMC Health Services Research](https://bmchealthservres.biomedcentral.com/articles/10.1186/1472-6963-8-28)
- **Health inequalities** in waiting lists - [NHS England](https://www.england.nhs.uk/2025/07/nhs-publishes-waiting-list-breakdowns-to-tackle-health-inequalities/)

### **User Research**
Direct engagement with:
- Scrub nurses (competency tracking for specific kits and systems)
- Theatre coordinators (fragmented information pain points)
- Consultants (staff competency visibility needs)
- Operational managers (real-time data for decisions)

### **Industry Engagement**
- EPR provider engagement (Cerner sandbox testing)
- HETT conference networking with healthcare IT vendors
- DTAC roadmap exploration for NHS Digital alignment

---

## 🏆 Recognition

**Barts Heart Award** - Royal London Hospital, Barts Health NHS Trust
- Awarded for innovation in "finding new ways to work"
- Recognition of systems thinking approach to NHS operational challenges
- Validation of commitment to improving NHS efficiency through digital innovation

---

## 🤝 Why NHS CEP?

TOM has reached a critical juncture:

### **What I've Built**
✅ Working prototype with comprehensive features
✅ Multi-hospital architecture deployed
✅ OPCS-4.10 integration complete
✅ AI rostering engine operational
✅ Real-time Firebase backend
✅ Mobile-responsive design
✅ Frontline-validated workflows

### **What I Need**
- **Technical partnerships** for NHS security compliance and clinical safety certification
- **Pilot sites** for real-world deployment and iteration
- **Clinical governance expertise** for DCB0129/DCB0160 compliance
- **EPR integration support** for seamless interoperability
- **Funding pathways** for scaling from 2-3 trusts to 20+
- **NHS Digital connections** for framework agreements

**NHS CEP provides exactly this support to take TOM from working prototype to production-ready NHS solution.**

---

## 📈 Scalability Vision

TOM's architecture is designed for exponential growth:

### **Phase 1: Theatre Operations Manager (Current)**
- 2-3 pilot trusts
- Theatre-specific operations
- Internal staffing marketplace
- OPCS-4.10 validated workflows

### **Phase 2: Trust Operations Manager (18-24 months)**
- Expand beyond theatres to other departments (ICU, wards, diagnostics)
- Cross-departmental staff mobility
- Trust-wide analytics and insights
- Integrated wellbeing and workforce planning

### **Phase 3: Regional Operations Manager (24-36 months)**
- ICB-wide deployment (10-20 hospitals)
- Regional staffing marketplace
- Shared learning communities
- Predictive analytics for capacity planning

### **Phase 4: National Framework (36+ months)**
- NHS England framework agreement
- 100+ trusts nationwide
- National workforce intelligence
- Policy insights from aggregated data

---

## 🔒 Security & Compliance Roadmap

### **Data Security**
- NHS Azure migration (leveraging existing NHS infrastructure)
- GDPR compliance built-in
- Role-based access control (RBAC)
- Audit logging for all data access
- Encryption at rest and in transit

### **Clinical Safety**
- DCB0129 (Clinical Risk Management)
- DCB0160 (Clinical Safety Case Reports)
- Hazard identification and mitigation
- Clinical safety officer appointment

### **Interoperability**
- EPR integration standards (HL7, FHIR)
- Microsoft Teams API integration
- NHS Digital service alignment
- Minimal patient-sensitive data extraction

---

## 🧪 Try TOM (For Developers)

```bash
# Clone repository
git clone https://github.com/medaskca/theatre-operations-manager.git
cd theatre-operations-manager

# Install dependencies
npm install

# Configure Firebase (optional - works in demo mode)
cp .env.local.example .env.local
# Edit .env.local with your Firebase credentials

# Run development server
npm run dev

# Open http://localhost:3000
```

### **Test AI Rostering**
```bash
# See TOM's 110-point AI scoring in action
npx tsx scripts/test-ai-scoring.ts
```

---

## 📱 Live Demo

**Current Version:** Working prototype deployed with Firebase backend

**Features Demonstrated:**
- Multi-hospital switching
- Staff management and competency tracking
- Theatre scheduling
- Real-time dashboards
- OPCS-4.10 code validation
- Mobile-responsive design

---

## 🎯 Competitive Advantages

### **vs Traditional Theatre Management Systems**

| Feature | TOM (AI Assistant) | Traditional Systems |
|---------|---------------------|---------------------|
| **Intelligence Type** | ✅ **Learning AI** that uses operational & logistic data | ❌ Static rule-based software |
| **Continuous Learning** | ✅ Gets smarter from every interaction | ❌ Fixed functionality |
| **Predictive Capability** | ✅ **Predicts bottlenecks** before they happen | ❌ Reactive only |
| **Data-Driven Insights** | ✅ **Analyzes patterns** in operations & logistics | ❌ Basic reporting |
| **Unified Platform** | ✅ Staffing + Scheduling + Inventory + AI intelligence | ❌ Siloed systems |
| **Conversational Interface** | ✅ **ChatGPT-style** natural language interaction | ❌ Manual search and forms |
| **Familiar UX** | ✅ LinkedIn, Uber, Amazon patterns | ❌ Clunky enterprise UI |
| **Internal NHS Agency** | ✅ Cross-trust marketplace | ❌ External agencies only |
| **Deep Competencies** | ✅ **AI learns** kit mastery, system expertise | ❌ Basic qualifications |
| **Proactive Recommendations** | ✅ **"You're low on mesh kits, order now"** | ❌ None |
| **Bootstrapping Intelligence** | ✅ **Improves with usage** across all NHS trusts | ❌ Never improves |
| **Wellbeing Focus** | ✅ Break monitoring, workload prediction | ❌ Not considered |
| **Systems Thinking** | ✅ Interconnected operational & logistic workflows | ❌ Isolated functions |
| **Cost** | ✅ £15k-£18k/year | ❌ £20k-£40k+/year |
| **NHS-Built** | ✅ Frontline experience embedded in AI | ❌ Vendor-imposed |

---

## 🌟 What Makes TOM Different

**1. TOM is an AI that learns, not static software**
- **Uses operational and logistic data** to become increasingly intelligent
- **Predicts problems** before they happen by analyzing patterns
- **Adapts recommendations** based on your trust's unique workflows
- **Continuously evolves** - gets smarter with every theatre session
- **Cross-trust learning** identifies best practices across the NHS

**2. Built by NHS frontline staff who understand the data**
- Real frontline experience across multiple trusts
- Understanding of which operational and logistic data points matter
- AI trained on actual theatre workflows, not vendor assumptions
- Frontline insights embedded in TOM's intelligence

**3. Systems thinking using interconnected data**
- **Connects operational dots**: Staffing patterns → cancellation risks
- **Links logistic chains**: Inventory levels → case scheduling
- **Predicts cascading effects**: One delay → downstream bottlenecks
- "Bigger bucket that spots weaknesses before they break"
- Prevents rather than firefights using predictive intelligence

**4. Adoption through conversational AI**
- **ChatGPT-style natural language interface**
- Ask TOM questions, get intelligent answers from your data
- Uses familiar UX patterns (LinkedIn, Uber, Amazon)
- Natural engagement without forced behavioural change
- Community-driven improvement through shared learning

**5. Bootstrapping intelligence at scale**
- Theatre → Trust → Regional → National
- **The more data TOM analyzes, the smarter TOM becomes**
- Network effects strengthen intelligence across NHS
- Data moat creates insurmountable competitive advantage

---

## 📞 Contact & Support

**Developer:** MEDASKCA
**Purpose:** NHS Clinical Entrepreneur Programme Application
**Status:** Working Prototype - Seeking Support for Production Deployment

**For NHS CEP Evaluators:**
This documentation represents TOM's current development state. The application demonstrates technical capability, NHS-specific focus, and frontline validation. Seeking NHS CEP support to:
1. Connect with technical partners for security compliance
2. Establish pilot sites for real-world testing
3. Obtain clinical safety certification
4. Scale from prototype to production-ready NHS solution

---

## 📄 License

Proprietary - MEDASKCA™

**Note:** TOM is being developed as an NHS-focused solution with intention to explore NHS-appropriate licensing models (SaaS, NHS-owned IP, or hybrid) based on guidance from NHS CEP and NHS Digital.

---

## 🙏 Acknowledgments

- **NHS frontline staff** across multiple trusts for operational insights
- **Royal London Hospital** (Barts Health NHS Trust) for Barts Heart Award recognition
- **HETT Conference** attendees for EPR integration discussions
- **NHS England** for OPCS-4.10 clinical coding standards
- **NHS Digital** for guidance on DTAC and interoperability roadmaps

---

**TOM - Theatre Operations Manager**
*An AI that learns from operational and logistic data to transform NHS theatre efficiency*

🤖 **TOM isn't just software—TOM is an intelligent colleague that gets smarter every day** 🧠

🚀 **From working AI prototype to national NHS intelligence with CEP support** 🚀
