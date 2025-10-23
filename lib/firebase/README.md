# TOM Firebase Integration

This directory contains Firebase/Firestore setup, services, and seeding utilities for the TOM (Theatre Operations Management) system.

## 📁 Structure

```
lib/firebase/
├── config.ts          # Firebase initialization and configuration
├── seed.ts            # Database seeding functions
├── services/
│   ├── staffService.ts    # Staff CRUD operations
│   └── theatreService.ts  # Theatre and procedure operations
└── README.md          # This file
```

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 2. Seed the Database

**Option A: Web Interface (Recommended)**
```bash
npm run dev
# Navigate to http://localhost:3000/admin/seed
# Click "Run Seed Script"
```

**Option B: Command Line**
```bash
npx tsx scripts/seed-database.ts
```

**Option C: API Endpoint**
```bash
curl -X POST http://localhost:3000/api/seed
```

### 3. Verify Data

1. Open Firebase Console
2. Navigate to Firestore Database
3. Check collections:
   - `staff` - 925 members
   - `theatres` - 20+ theatres
   - `inventory` - 1,700 instrument trays

## 📊 Seeded Data

| Collection | Count | Description |
|------------|-------|-------------|
| **staff** | 925 | RNs, ODPs, HCAs, Surgeons, Anaesthetists |
| **theatres** | 20+ | Main, DSU, and Paediatric theatres |
| **inventory** | 1,700 | Instrument trays across 17 specialties |

### Staff Breakdown
- 400 Registered Nurses (RNs)
- 200 Operating Department Practitioners (ODPs)
- 200 Healthcare Assistants (HCAs)
- 50 Consultant Surgeons
- 45 Assistant Surgeons (FY1-ST8)
- 30 Anaesthetists

### Specialties Covered
Orthopaedic, Neurology, HPB, General Surgery, Robotic, Upper GI, Gynaecology, Urology, Plastics, Dermatology, OMFS, ENT, Ortho Trauma, Neuro Trauma, Maxfax Trauma, Emergency, Obstetrics

## 🔧 Using Firebase Services

### Import Services
```typescript
import {
  getAllStaff,
  addStaff,
  updateStaff,
  deleteStaff
} from '@/lib/firebase/services/staffService';

import {
  getAllTheatres,
  getProceduresForTheatre,
  updateProcedureStatus
} from '@/lib/firebase/services/theatreService';
```

### Using React Hooks
```typescript
import {
  useAllStaff,
  useActiveReliefRequests,
  useProceduresForDate,
  useDashboardData
} from '@/hooks/useTOM';

function MyComponent() {
  const { data: staff, loading, error } = useAllStaff();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{staff.length} staff members</div>;
}
```

### Manual Operations
```typescript
// Add new staff member
const staffId = await addStaff({
  name: 'RN J. Smith',
  role: 'Registered Nurse',
  department: 'Nursing',
  competencies: ['Basic Theatre', 'Scrub'],
  status: 'available'
});

// Update staff
await updateStaff(staffId, {
  status: 'on_break',
  currentLocation: 'Coffee Room'
});

// Get active procedures
const procedures = await getProceduresForTheatre('theatre-id', '2025-10-22');
```

## 📝 Collections

### Core Collections
- `staff` - Staff members and their current status
- `theatres` - Theatre configuration and status
- `procedures` - Surgical procedures and timeline
- `inventory` - Equipment and instrument trays

### Operational Collections
- `staff_breaks` - Staff break scheduling
- `relief_requests` - Relief staff requests
- `sick_leave` - Sick leave records
- `late_arrivals` - Late arrival tracking
- `vacant_shifts` - Open shift positions
- `theatre_efficiency` - Performance metrics

## 🔐 Security Rules

Remember to set up Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Development: Allow all (CHANGE FOR PRODUCTION!)
    match /{document=**} {
      allow read, write: if true;
    }

    // Production example:
    // match /staff/{staffId} {
    //   allow read: if request.auth != null;
    //   allow write: if request.auth.token.role == 'admin';
    // }
  }
}
```

## 🧪 Testing

To test Firebase integration:

1. Seed the database
2. Navigate to http://localhost:3000/modern
3. Check staff, procedures, and metrics are loading
4. Use browser DevTools to monitor Firestore requests

## 📚 Documentation

- [Firebase Setup](https://firebase.google.com/docs/web/setup)
- [Firestore Data Model](https://firebase.google.com/docs/firestore/data-model)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [TOM Types](../../types/tom.ts)

## ⚠️ Important Notes

1. **Development Only**: Current seed data is for development/testing
2. **Security Rules**: Update Firestore rules before production deployment
3. **Batch Limits**: Firestore has a 500 document limit per batch operation
4. **Real-time Listeners**: Remember to unsubscribe from listeners to prevent memory leaks (hooks handle this automatically)
5. **Safe Updates**: Always use `updateDoc` with partial data, never overwrite entire documents unless intentional

## 🔄 Re-seeding

To re-seed the database:

1. Delete collections in Firebase Console (or use clear function)
2. Run the seed script again
3. Verify data in Firebase Console

## 🐛 Troubleshooting

**Error: "Failed to fetch"**
- Check `.env.local` has correct Firebase credentials
- Verify Firebase project is active
- Check network connectivity

**Error: "Permission denied"**
- Update Firestore security rules
- Ensure Firebase project has Firestore enabled

**Seed script hangs**
- Check Firebase Console for errors
- Verify batch operations aren't exceeding limits
- Check console logs for detailed error messages

## 📞 Support

For issues with Firebase integration, check:
1. Firebase Console for errors
2. Browser DevTools Console for client-side errors
3. Next.js terminal for server-side errors
