# 📊 TOM Data Strategy - Updated

## ✅ Changes Made

Mock instrument data has been **removed** from the seeding process. Real Synergy Trak data will be used instead.

---

## 🎯 Current Data Strategy

### **Core Data (Seed Script)**
Seeds generic/foundational data:
- ✅ **925 Staff Members** - Generic names for testing
- ✅ **20+ Theatres** - Based on location data
- ❌ **No Instruments** - Removed from seed script

### **Instrument Data (Import Tool)**
Real hospital data from Synergy Trak:
- ✅ **~10,865 Real Trays** - Actual hospital inventory
- ✅ **Physical References** - ZE1030, ZO1002, etc. (what's on walls)
- ✅ **Full Checklists** - Every instrument in each tray
- ✅ **Real Locations** - RLH DAY CARE THEATRES, etc.
- ✅ **Item Categories** - Instruments, Consumables, Containers, Wrap

---

## 📁 File Changes

### **Modified Files:**

1. **`lib/firebase/seed.ts`**
   - Removed `seedInventory()` function
   - Removed import of `instrument-trays.json`
   - Updated `seedAllData()` to only seed staff & theatres
   - Added instructions to import from Synergy Trak

2. **`app/admin/seed/page.tsx`**
   - Removed "1,700 Instrument Trays" display
   - Added notice about Synergy Trak import
   - Added link to `/admin/import-instruments`

3. **`app/api/seed/route.ts`**
   - Updated response messages
   - Removed instrument count from summary

4. **`SEEDING_GUIDE.md`**
   - Updated to two-step process
   - Step 1: Seed core data
   - Step 2: Import from Synergy Trak

### **New Files:**

5. **`scripts/extract-synergy-trak.js`**
   - Browser console script for data extraction
   - Extracts physical references (ZE1030)
   - Extracts full instrument checklists
   - Auto-saves progress

6. **`types/tom.ts`** (Updated)
   - Added `InstrumentItem` interface
   - Added `physicalRef` field to `InventoryItem`
   - Added `instruments` array for checklists

7. **`INSTRUMENT_REFERENCE_GUIDE.md`**
   - Explains physical vs system references
   - Documents reference code patterns
   - Shows how TOM handles both IDs

8. **`app/admin/import-instruments/page.tsx`**
   - Import UI for Synergy Trak data
   - Supports CSV, JSON, plain text
   - Preview before import

9. **`app/api/import-instruments/route.ts`**
   - API endpoint for bulk import
   - Handles Firestore batch limits
   - Normalizes field names

---

## 🚀 Workflow

### **For Development:**

```bash
# Step 1: Seed core data
npm run dev
# Visit: http://localhost:3000/admin/seed
# Click: "Run Seed Script"
# Result: 925 staff + 20 theatres

# Step 2: Import instruments
# Visit: http://localhost:3000/admin/import-instruments
# Paste data from Synergy Trak
# Click: "Import to Firebase"
# Result: 10,865+ real trays with checklists
```

### **For Extraction (At Work):**

```bash
# 1. Login to Synergy Trak
# 2. Navigate to inventory table
# 3. Set "Results per page" to maximum
# 4. Open browser console (F12)
# 5. Paste extraction script from:
#    scripts/extract-synergy-trak.js
# 6. Run: extractAllTraysWithDetails()
# 7. Data copied to clipboard automatically
# 8. Paste into import tool at home
```

---

## 💾 Data Comparison

| Aspect | Mock Data (Removed) | Real Data (Synergy Trak) |
|--------|---------------------|--------------------------|
| **Count** | 1,700 | 10,865+ |
| **Names** | "Orthopaedic Tray 1" | "RLH PHACO HANDPIECE (ZE1030)" |
| **References** | None | ZE1030, ZO1002, ZT1001, etc. |
| **Checklists** | ❌ No | ✅ Full instrument lists |
| **Locations** | Generic | Real (RLH DAY CARE THEATRES) |
| **Categories** | Basic | Instruments, Consumables, Wrap |
| **Production Ready** | ❌ No | ✅ Yes |
| **Searchable** | Generic | By ref code, name, specialty |

---

## 🔍 Why This Change?

### **Problems with Mock Data:**
- ❌ Not realistic for production
- ❌ No physical reference codes
- ❌ No instrument checklists
- ❌ Staff wouldn't recognize tray names
- ❌ Couldn't test real workflows

### **Benefits of Real Data:**
- ✅ Production-ready from day 1
- ✅ Staff recognize tray names/codes
- ✅ Full checklists for count verification
- ✅ Real locations and workflows
- ✅ Can test actual use cases
- ✅ Physical refs match wall labels

---

## 📋 Next Steps

1. ✅ **Seed core data** (staff & theatres)
2. 🔄 **Extract from Synergy Trak** (at work)
3. ⏳ **Import instrument data** (at home)
4. ⏳ **Verify in Firebase Console**
5. ⏳ **Test in TOM application**

---

## 🎯 Production Readiness

### **What's Production-Ready:**
- ✅ Staff data structure
- ✅ Theatre configuration
- ✅ Instrument data (when imported)
- ✅ Physical reference system
- ✅ Checklist functionality

### **What Still Needs Work:**
- ⏳ Procedure scheduling
- ⏳ Real-time tracking integration
- ⏳ Authentication/authorization
- ⏳ User roles and permissions
- ⏳ Mobile optimizations

---

## 📚 Documentation References

- **SEEDING_GUIDE.md** - How to seed core data
- **SYNERGY_TRAK_GUIDE.md** - How to extract from Synergy Trak
- **INSTRUMENT_REFERENCE_GUIDE.md** - Physical vs system references
- **lib/firebase/README.md** - Firebase integration details

---

## ✨ Summary

You now have a **hybrid seeding strategy**:
- Generic seed data for staff/theatres (testing)
- Real hospital data for instruments (production)

This gives you the best of both worlds:
- Quick setup for development
- Real data where it matters most
- Production-ready instrument tracking

**Next:** Extract your Synergy Trak data and import it! 🚀
