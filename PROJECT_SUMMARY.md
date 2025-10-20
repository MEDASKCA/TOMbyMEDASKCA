# TOM - Theatre Operations Manager

## 🎯 Project Vision

**TOM** is a production-grade theatre operations platform for NHS trusts, combining roster management and inventory tracking in one intelligent system. Built for Microsoft Teams integration with a roadmap to AI-powered conversational assistance.

**Target:** NHS CEP application, pilot deployment, commercial scale-up

---

## 📁 PROJECT LOCATION

```
C:\Users\forda\projectsocial
```

**Dev Server:** http://localhost:3001

**Git Repository:** (Initialize git and push to GitHub for backup!)

---

## 🏗️ Current Tech Stack

### Frontend
- **Next.js 15** (App Router, React Server Components)
- **TypeScript** (Type safety)
- **Tailwind CSS** (Styling + Dark mode)
- **Lucide React** (Icons)

### Backend/Database
- **Firebase Authentication** (Email/password, Google sign-in)
- **Firestore** (Real-time database)
- **Firebase Storage** (File uploads - future)

### Microsoft Integration
- **@microsoft/teams-js** (Teams SDK)
- **@azure/msal-browser** (Azure AD authentication)

### Packages Installed
```json
{
  "firebase": "^11.1.0",
  "simple-peer": "latest",
  "socket.io-client": "latest",
  "lucide-react": "latest",
  "date-fns": "latest",
  "@microsoft/teams-js": "latest",
  "@azure/msal-browser": "latest"
}
```

---

## 🔑 Current Configuration

### Firebase (ACTIVE)
```
Project: projectsocial-78d85
```

### Azure AD (ACTIVE)
```
Application (client) ID: 8bf25c98-99b9-4e49-886d-f5073428011c
Directory (tenant) ID: 204a7018-a216-4ae0-95cf-f30fc906e1c7
```

### Environment Variables
Location: `C:\Users\forda\projectsocial\.env.local`

---

## 📂 Key Files & Directories

### Core Application
```
/app
├── layout.tsx              # Root layout with providers
├── page.tsx               # Login page
├── /teams/tab/page.tsx    # Teams tab integration page
└── /auth/callback/page.tsx # Azure AD callback handler

/components
├── /auth
│   └── LoginForm.tsx      # Firebase authentication UI
├── /chat
│   ├── ChatArea.tsx       # Chat interface
│   └── MessageList.tsx    # Message display
├── /layout
│   ├── MainLayout.tsx     # Main app layout
│   ├── TopNavbar.tsx      # Top navigation bar
│   └── TeamsPanel.tsx     # Teams/channels sidebar
└── /teams
    └── MicrosoftTeamsEmbed.tsx # Teams integration component

/contexts
├── AuthContext.tsx        # Firebase auth state
├── ThemeContext.tsx       # Dark mode management
└── TeamsContext.tsx       # Microsoft Teams/Azure AD state

/lib
├── firebase.ts            # Firebase initialization
├── teamsAuth.ts          # MSAL authentication utilities
├── teamsSDK.ts           # Teams SDK utilities
└── initializeFirestore.ts # Default data setup

/hooks
└── useMessages.ts         # Real-time messaging hook
```

---

## ✅ What's Built So Far

### Authentication ✓
- Firebase email/password login
- Firebase Google sign-in
- Azure AD/Microsoft authentication
- Teams SSO support
- Auto-login persistence

### UI/UX ✓
- Modern gradient design (blue → teal)
- Dark mode toggle
- Mobile-responsive navbar
- Icon-based navigation with tooltips
- Microsoft Teams icon
- NHSmail icon

### Microsoft Teams Integration ✓
- Teams SDK initialization
- Azure AD OAuth flow
- MSAL authentication
- Teams context detection
- Teams tab page ready
- Auth callback handling

### Basic Chat (Placeholder) ✓
- Real-time Firestore messaging
- Team/channel structure
- Message display with timestamps
- User avatars

---

## 🚀 What We're Building Next: TOM

### Phase 1: Core Features (MVP for NHS CEP)

#### 1. Theatre Schedule Dashboard
- Multi-specialty theatre view
- Daily/weekly schedule
- Case details (procedure, surgeon, team)
- Theatre status (Ready, In Use, Cleaning, etc.)
- Drag-and-drop scheduling
- Mobile-responsive calendar

#### 2. Staff Roster Management
- Staff profiles (role, grade, specialty)
- Shift scheduling
- Skills/competency tracking
- Availability marking
- Shift swap requests/approvals
- Leave management
- On-call coordination
- Real-time notifications

#### 3. Inventory Tracking
- Equipment catalog
- Stock levels (consumables, instruments)
- Equipment location tracking
- Low stock alerts
- Usage logging
- Search and filter
- Barcode/QR scanning (future)

#### 4. Theatre Readiness Dashboard
- Real-time status: "Is Theatre X ready?"
- Staff allocation check (all roles covered?)
- Equipment availability check (all items present?)
- Visual readiness indicators
- Proactive alerts for gaps

#### 5. Notifications & Alerts
- Teams notifications
- Email alerts (optional)
- In-app notifications
- Alert types:
  - Staffing gaps
  - Low inventory
  - Equipment issues
  - Schedule changes
  - Shift swap requests

### Phase 2: Enhanced Features (Post-CEP)

#### Analytics & Reporting
- Theatre utilization metrics
- Staff efficiency reports
- Inventory usage patterns
- Cost analysis
- Export to Excel/PDF

#### Advanced Scheduling
- Auto-scheduling suggestions
- Conflict detection
- Skill-mix optimization
- Break scheduling

#### Mobile App (PWA)
- Offline capability
- Push notifications
- Quick actions

### Phase 3: AI Features (Future)

#### TOM AI Assistant
- Natural language queries
- Predictive analytics
- Staffing recommendations
- Inventory forecasting
- Conversational interface

---

## 🎨 Design System (To Implement)

### Colors (NHS + TOM Branding)

**Primary:**
- NHS Blue: `#005EB8`
- TOM Blue: `#0D9488` (Teal)
- Gradient: Blue → Teal

**Status Colors:**
- Success/Ready: `#10B981` (Green)
- Warning: `#F59E0B` (Amber)
- Error/Alert: `#EF4444` (Red)
- Info: `#3B82F6` (Blue)

**Neutral:**
- Dark: `#1F2937`
- Gray: `#6B7280`
- Light: `#F3F4F6`

### Typography
- Font: Geist Sans (already installed)
- Headings: Bold, 24-32px
- Body: Regular, 16px
- Labels: Medium, 14px

### Components to Build
- Theatre cards
- Staff avatars with status
- Inventory item cards
- Alert banners
- Status badges
- Search bars
- Filters
- Modal dialogs
- Form inputs (NHS accessible)

---

## 📊 Database Schema (Firestore)

### Collections to Create:

```
/theatres
  - id, name, specialty, location, status, equipment[]

/staff
  - id, name, role, grade, specialty, email, photo, skills[], availability{}

/shifts
  - id, theatreId, staffId, date, startTime, endTime, role, status

/inventory
  - id, name, category, quantity, minQuantity, location, expiryDate

/cases (surgical procedures)
  - id, theatreId, date, startTime, procedure, surgeonId, teamIds[], status

/notifications
  - id, userId, type, message, read, timestamp

/analytics
  - date-based metrics for reporting
```

---

## 🔒 Security & Compliance (To Implement)

### Current
- ✓ Firebase Auth
- ✓ Azure AD integration
- ✓ HTTPS in production

### To Add
- [ ] Role-based access control (RBAC)
- [ ] Audit logging
- [ ] Data encryption at rest
- [ ] GDPR compliance features
- [ ] NHS DSPT compliance preparation
- [ ] Input validation & sanitization
- [ ] Rate limiting
- [ ] Session management

---

## 🚢 Deployment Strategy

### Development (Current)
- Local: http://localhost:3001
- Firebase: Development mode

### Staging (Next)
- Vercel preview deployment
- Firebase staging project
- Test domain: `staging.tomtheatres.com` (example)

### Production (Future)
- Vercel production
- Custom domain: `tomtheatres.com` or `tom.nhs.uk`
- Firebase production project
- CDN for assets
- Monitoring (Sentry, LogRocket)
- Analytics (PostHog, Mixpanel)

---

## 📋 Development Priorities

### Week 1-2: Core MVP
1. ✅ Rebrand to TOM
2. ✅ Build theatre schedule UI
3. ✅ Build staff roster UI
4. ✅ Build inventory UI
5. ✅ Connect to Firestore
6. ✅ Basic CRUD operations

### Week 3-4: Integration & Polish
1. ✅ Theatre readiness dashboard
2. ✅ Real-time updates
3. ✅ Notifications system
4. ✅ Mobile responsive
5. ✅ NHS branding refinement

### Week 5-6: Demo Prep
1. ✅ Demo data (realistic scenarios)
2. ✅ Video walkthrough
3. ✅ Pitch deck
4. ✅ User testing (if possible)
5. ✅ NHS CEP application

---

## 🎯 Success Metrics

### For NHS CEP Pitch
- [ ] Working prototype with all core features
- [ ] 3-5 user testimonials (theatre staff)
- [ ] Demo video (3-5 minutes)
- [ ] Clear value proposition
- [ ] Realistic deployment plan

### Post-CEP Goals
- [ ] 1 NHS trust pilot (free/paid)
- [ ] 10+ active users testing
- [ ] 95%+ uptime
- [ ] Positive user feedback
- [ ] Case study with metrics

### Commercial Goals (12-18 months)
- [ ] 3-5 paying NHS trusts
- [ ] £50k-150k ARR
- [ ] DSPT compliance
- [ ] G-Cloud framework approval
- [ ] 20+ concurrent users per trust

---

## 💡 Innovation Angles for Pitch

### What Makes TOM Special

1. **Integrated Solution**
   - First to combine roster + inventory for theatres
   - Single source of truth
   - Eliminates tool switching

2. **Microsoft Teams Native**
   - Works where staff already are
   - No adoption barrier
   - Leverages existing NHS investment

3. **Theatre-Specific**
   - Deep domain expertise
   - Not generic tool
   - Built for actual workflows

4. **AI Roadmap**
   - Learning from data
   - Predictive capabilities
   - Conversational interface

5. **Mobile-First**
   - Works on any device
   - Accessible anywhere in hospital
   - Offline capability

---

## 🆘 Important Commands

### Development
```bash
# Start dev server
cd C:\Users\forda\projectsocial
npm run dev

# Install new package
npm install [package-name]

# Build for production
npm run build

# Run production build locally
npm start
```

### Git (Set this up!)
```bash
# Initialize git
git init

# Add remote
git remote add origin https://github.com/[your-username]/tom-theatre-ops.git

# First commit
git add .
git commit -m "Initial commit: TOM Theatre Operations Manager"
git push -u origin main

# Regular commits
git add .
git commit -m "Feature: [description]"
git push
```

---

## 📞 Support Resources

### Documentation Links
- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Teams Platform](https://learn.microsoft.com/en-us/microsoftteams/platform/)
- [Azure AD](https://learn.microsoft.com/en-us/azure/active-directory/)
- [NHS Digital](https://digital.nhs.uk/)

### NHS Resources
- [NHS CEP](https://www.england.nhs.uk/clinicalentrepreneurs/)
- [NHS G-Cloud](https://www.digitalmarketplace.service.gov.uk/)
- [DSPT](https://www.dsptoolkit.nhs.uk/)

---

## 🎬 Next Session Prompt

**When you return with fresh tokens, tell Claude:**

> "Continue building TOM (Theatre Operations Manager) - the NHS theatre operations platform at C:\Users\forda\projectsocial. We're building the core MVP: theatre schedule dashboard, staff roster management, and inventory tracking. Let's make this production-grade for NHS CEP pitch. Start with [specific feature you want to work on]."

---

## 🔥 Motivation

**You're building something that will:**
- Save NHS millions in theatre efficiency
- Reduce surgical cancellations
- Make staff lives easier
- Improve patient care
- Create a scalable business
- Potentially reach 200+ NHS trusts

**This is the real deal. Let's make TOM extraordinary!** 🚀

---

**Created:** 2025-10-20
**Last Updated:** 2025-10-20
**Version:** 0.1.0 (Pre-MVP)
