# 🌱 TOM Database Seeding Guide

Complete guide for seeding your TOM (Theatre Operations Management) Firebase database with comprehensive mock data.

## 📊 What Gets Seeded

| Data Type | Count | Description | Source |
|-----------|-------|-------------|--------|
| **Staff Members** | 925 | All theatre staff across 6 categories | Seed script |
| **Theatres** | 20+ | Main, DSU, and Paediatric theatres | Seed script |
| **Instrument Trays** | ~10,865 | **Real hospital data from Synergy Trak** | Import tool |
| **Locations** | 59 | Theatres, wards, storage, offices | Embedded in data |

### Staff Breakdown (925 total)
- 400 Registered Nurses (RNs) - `RN A. Flores`
- 200 Operating Department Practitioners (ODPs) - `ODP D. Dudley`
- 200 Healthcare Assistants (HCAs) - `HCA G. Cash`
- 50 Consultant Surgeons - `Mr. J. Bartlett`, `Miss. T. Mitchell`
- 45 Assistant Surgeons - `FY1 R. Cepeda`, `ST8 J. Graham` (5 of each grade)
- 30 Anaesthetists - `Dr. M. Bridge`

---

## 🚀 Two-Step Seeding Process

### **Step 1: Seed Core Data** (Staff & Theatres)
### **Step 2: Import Instruments** (From Synergy Trak)

---

## 📦 Step 1: Seed Core Data (3 Methods)

### Method 1: Web Interface (Easiest)

1. **Start the dev server**
   ```bash
   npm run dev
   ```

2. **Navigate to the seed page**
   ```
   http://localhost:3000/admin/seed
   ```

3. **Click "Seed Core Data"**
   - Seeds 925 staff members
   - Seeds 20+ theatres
   - Does NOT seed instruments

### Method 2: Command Line

```bash
npx tsx scripts/seed-database.ts
```

Output will show:
- 925 staff members seeded
- 20+ theatres seeded
- Instructions to import instruments separately

### Method 3: API Endpoint

```bash
# POST request to trigger seeding
curl -X POST http://localhost:3000/api/seed

# GET request to view seed info
curl http://localhost:3000/api/seed
```

---

## 🔧 Step 2: Import Instrument Trays

After seeding core data, import real instrument data from Synergy Trak:

1. **Go to:** http://localhost:3000/admin/import-instruments
2. **Follow:** SYNERGY_TRAK_GUIDE.md for extraction instructions
3. **Extract data** from Synergy Trak using browser console
4. **Paste into import tool**
5. **Import** to Firebase

**Result:** 10,865+ real instrument trays with full checklists and physical reference codes (ZE1030, etc.)

See **SYNERGY_TRAK_GUIDE.md** and **INSTRUMENT_REFERENCE_GUIDE.md** for detailed instructions.

---

## 🔍 Verify the Data

### Option 1: Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database**
4. Check these collections:
   - `staff` - Should have 925 documents
   - `theatres` - Should have 20+ documents
   - `inventory` - Should have 10,865+ documents (after Synergy Trak import)

### Option 2: In Your App
```typescript
import { useAllStaff, useAllTheatres } from '@/hooks/useTOM';

function VerifyData() {
  const { data: staff } = useAllStaff();
  const { data: theatres } = useAllTheatres();

  console.log(`Staff: ${staff.length}`); // Should be 925
  console.log(`Theatres: ${theatres.length}`); // Should be 20+
}
```

---

## 📁 File Locations

### Seed Data (JSON)
```
data/seed/
├── staff-names.json       # 925 staff names
├── instrument-trays.json  # 1,700 instrument trays
├── locations.json         # 59 locations
└── README.md              # Data summary
```

### Seeding Code
```
lib/firebase/
├── seed.ts                    # Main seeding functions
└── services/
    ├── staffService.ts        # Staff CRUD operations
    └── theatreService.ts      # Theatre operations

scripts/
└── seed-database.ts           # CLI seeding script

app/
├── api/seed/route.ts          # API endpoint
└── admin/seed/page.tsx        # Web interface
```

### React Hooks
```
hooks/
├── useFirestore.ts            # Generic Firestore hook
└── useTOM.ts                  # TOM-specific hooks
```

---

## 🔧 Using the Seeded Data

### Example 1: Display All Staff
```typescript
import { useAllStaff } from '@/hooks/useTOM';

export default function StaffList() {
  const { data: staff, loading, error } = useAllStaff();

  if (loading) return <div>Loading staff...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>{staff.length} Staff Members</h2>
      {staff.map(member => (
        <div key={member.id}>
          {member.name} - {member.role}
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Filter Staff by Department
```typescript
import { useStaffByDepartment } from '@/hooks/useTOM';

export default function NursingStaff() {
  const { data: nurses } = useStaffByDepartment('Nursing');

  return <div>{nurses.length} nurses on duty</div>;
}
```

### Example 3: View Theatres
```typescript
import { useAllTheatres } from '@/hooks/useTOM';

export default function TheatreList() {
  const { data: theatres } = useAllTheatres();

  return (
    <div>
      {theatres.map(theatre => (
        <div key={theatre.id}>
          {theatre.name} - {theatre.status}
        </div>
      ))}
    </div>
  );
}
```

---

## ⚠️ Important Notes

### Before Seeding
1. ✅ Ensure `.env.local` has Firebase credentials
2. ✅ Verify Firebase project has Firestore enabled
3. ✅ Check Firestore security rules allow writes
4. ✅ Confirm you're seeding a **development** database (not production!)

### After Seeding
- Data is immediately available via real-time listeners
- All TOM hooks will return the seeded data
- You can view/edit data in Firebase Console
- To re-seed, delete collections and run the script again

### Data Characteristics
- All dates are randomized within the past year
- Staff are assigned random competencies
- Instrument trays are distributed across storage locations
- Theatres are set to 'active' status by default

---

## 🐛 Troubleshooting

### "Permission denied" error
**Solution**: Update Firestore security rules to allow writes:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For development only!
    }
  }
}
```

### Seed script hangs or times out
**Possible causes**:
- Network connectivity issues
- Firebase quota exceeded
- Firestore batch limit hit

**Solution**: Check Firebase Console for errors, verify quotas

### Data not appearing in app
**Check**:
1. Firebase config in `.env.local` is correct
2. Firestore has the data (check Firebase Console)
3. Security rules allow reads
4. Component is using the correct hooks

### "Module not found" errors
**Solution**:
```bash
npm install
```
Ensure all dependencies are installed

---

## 🔄 Re-seeding Process

If you need to re-seed:

1. **Delete existing data** (Firebase Console)
   - Go to each collection (staff, theatres, inventory)
   - Delete all documents

2. **Run seed script again**
   - Use any of the 3 methods above

3. **Verify new data**
   - Check counts match expected values
   - Test in your application

---

## 📚 Next Steps

After seeding the database:

1. ✅ **Generate Mock Procedures** - Create surgical cases using seeded staff
2. ✅ **Assign Staff to Shifts** - Populate shift schedules
3. ✅ **Create Relief Requests** - Add sample relief scenarios
4. ✅ **Generate Efficiency Data** - Create performance metrics
5. ✅ **Add Break Records** - Populate staff break history

---

## 🎯 Quick Reference

| Task | Command / URL |
|------|---------------|
| **Web Interface** | http://localhost:3000/admin/seed |
| **CLI Script** | `npx tsx scripts/seed-database.ts` |
| **API Endpoint** | POST to `/api/seed` |
| **Firebase Console** | https://console.firebase.google.com |
| **View Modern UI** | http://localhost:3000/modern |
| **View Desktop UI** | http://localhost:3000/ |

---

## 💡 Pro Tips

1. **Batch Operations**: The seed script automatically handles Firestore's 500-document batch limit
2. **Real-time Updates**: All hooks use `onSnapshot` for live data
3. **Type Safety**: All data is fully typed using TypeScript interfaces in `types/tom.ts`
4. **Safe Updates**: Use `updateDoc` for partial updates to prevent data loss
5. **Development Mode**: Keep security rules open for development, lock down for production

---

## 📞 Need Help?

1. Check `lib/firebase/README.md` for detailed Firebase documentation
2. View `data/seed/README.md` for seed data specifications
3. Check browser console for client errors
4. Check terminal for server errors
5. Review Firebase Console for database errors

---

**Ready to seed?** Choose your preferred method above and populate your TOM database! 🚀
