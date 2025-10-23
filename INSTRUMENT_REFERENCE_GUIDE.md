# 🔖 Instrument Tray Reference System Guide

Understanding the difference between Synergy Trak system IDs and physical tray references.

---

## 📋 Two Reference Systems

### **1. Physical Reference (What Staff Use)**
**Format:** `ZE####`, `ZO####`, `ZT####`, `ZG####`

**Examples:**
- `ZE1030` - Phaco Handpiece Stellaris
- `ZE8457` - Duet Handles
- `ZO1002` - Bipolar Pack
- `ZT1001` - Cystoscopy Storz Tray
- `ZG1037` - Laparoscopy Diagnostic 5mm

**Where It's Used:**
- ✅ Written on storage wall labels
- ✅ Staff search/request by this code
- ✅ Verbal communication ("Get me ZE1030")
- ✅ Practical day-to-day operations

**Location in Synergy Trak:**
- Found inside parentheses in the "Name" field
- Example: "RLH PHACO: HANDPIECE STELLARIS **(ZE1030)** S/N 1275..."

---

### **2. System Reference (Synergy Trak Internal)**
**Format:** `U029310755121` (long alphanumeric)

**Examples:**
- `U029310755121` - System ID for ZE1030
- `U02931TR1021966` - System ID for ZE8457

**Where It's Used:**
- Database tracking only
- Internal Synergy Trak operations
- Barcode scanning
- Audit trails

**Location in Synergy Trak:**
- "Tray Ref" column
- Not visible on physical trays

---

## 🎯 How TOM Handles This

### **Primary Display: Physical Reference**

When displaying trays in TOM:
```
✅ ZE1030 - PHACO HANDPIECE STELLARIS
   Location: RLH DAY CARE THEATRES
   Status: Available
```

NOT:
```
❌ U029310755121 - RLH PHACO: HANDPIECE...
```

---

### **Search Functionality**

Staff can search by:
- ✅ Physical ref: "ZE1030"
- ✅ Tray name: "Phaco"
- ✅ Specialty: "Ophthalmology"

Not required to search by system ID.

---

### **Data Structure in Firebase**

```typescript
{
  id: "firestore-doc-id",
  name: "RLH PHACO: HANDPIECE STELLARIS",
  physicalRef: "ZE1030",        // ✅ PRIMARY for display/search
  trayRef: "U029310755121",     // Stored for reference
  instanceId: "U02931TR0755121001",
  specialty: "Ophthalmology",
  location: "RLH DAY CARE THEATRES",
  status: "available",
  instruments: [
    {
      itemId: "U1233975",
      name: "HANDPIECE PHACO: STELLARIS 1275",
      type: "Instrument",
      quantity: 1,
      category: "Instruments"
    },
    // ... more instruments
  ]
}
```

---

## 🔍 Reference Code Patterns

### **Common Prefix Meanings**
(Based on Royal London Hospital conventions)

| Prefix | Likely Specialty/Type |
|--------|----------------------|
| **ZE** | Equipment / Electronics (Phaco, Duet) |
| **ZO** | Orthopaedic |
| **ZT** | Therapeutic / Urology (Cystoscopy) |
| **ZG** | General Surgery (Laparoscopy) |
| **ZL** | Loan Trays |
| **SR** | Supplementary (Individual instruments) |
| **BO** | ? (Various) |
| **BN** | ? (Supplementary) |

Note: These patterns may vary by hospital/system.

---

## 📊 Why Both References Matter

### **Physical Reference (ZE####):**
- **For:** Clinical staff, daily operations
- **Why:** Easy to remember, quick to communicate
- **Display:** Primary in TOM interface

### **System Reference (U###...):**
- **For:** Tracking, audit trails, integration
- **Why:** Unique across entire system, machine-readable
- **Storage:** Kept in database for data integrity

---

## 🚀 Extraction Script Handling

The updated extraction script:

1. **Parses the Name field** to extract physical reference
   ```javascript
   extractPhysicalRef("RLH PHACO: HANDPIECE STELLARIS (ZE1030) S/N...")
   // Returns: "ZE1030"
   ```

2. **Stores both references**
   ```json
   {
     "physicalRef": "ZE1030",
     "trayRef": "U029310755121"
   }
   ```

3. **Prioritizes physical ref** for display

---

## 💡 Best Practices

### **For Display:**
```typescript
// ✅ GOOD
<div>{tray.physicalRef} - {tray.name}</div>
// Shows: "ZE1030 - PHACO HANDPIECE STELLARIS"

// ❌ BAD
<div>{tray.trayRef} - {tray.name}</div>
// Shows: "U029310755121 - RLH PHACO..."
```

### **For Search:**
```typescript
// Search by physical ref
const searchTrays = (query: string) => {
  return trays.filter(t =>
    t.physicalRef?.includes(query) ||
    t.name.toLowerCase().includes(query.toLowerCase())
  );
};
```

### **For Tracking:**
```typescript
// Use system ref for audit/history
const trackTrayMovement = (trayRef: string, location: string) => {
  // trayRef is unique and stable across instances
  logMovement(trayRef, location, timestamp);
};
```

---

## 📱 Example User Scenarios

### **Scenario 1: Finding a Tray**
**Staff:** "I need the phaco handpiece"
**TOM Search:** User types "ZE1030" or "phaco"
**Result:** Shows "ZE1030 - PHACO HANDPIECE" with location

### **Scenario 2: Checking Tray Contents**
**Staff:** Clicks on "ZE1030"
**TOM Shows:** Complete checklist:
- 1x HANDPIECE PHACO: STELLARIS
- 1x TRAY PLASTIC FOR PHACO
- 1x LID PLASTIC FOR PHACO
- 2x PAPER YELLOW/GREEN
- etc.

### **Scenario 3: Reporting Missing Tray**
**Staff:** "ZE1030 is missing"
**TOM:** Records against physical ref "ZE1030"
**Backend:** Also logs system ref for tracking

---

## 🔄 Data Migration Notes

When importing from Synergy Trak:

**Step 1:** Extract both references
```javascript
{
  trayRef: cells[1].innerText,           // U029310755121
  name: cells[2].innerText,               // Full name with (ZE1030)
  physicalRef: extractPhysicalRef(name)  // ZE1030
}
```

**Step 2:** Transform for TOM
```typescript
{
  name: cleanTrayName(rawName),     // Remove serial numbers
  physicalRef: "ZE1030",             // Extracted from name
  trayRef: "U029310755121",          // From Tray Ref column
  displayName: "ZE1030 - PHACO HANDPIECE STELLARIS"
}
```

**Step 3:** Store in Firestore
- Both references saved
- physicalRef indexed for fast search
- Display uses physicalRef by default

---

## ✅ Summary

| Aspect | Physical Ref | System Ref |
|--------|-------------|------------|
| **Format** | ZE1030 | U029310755121 |
| **Location** | Storage walls | Database only |
| **Usage** | Daily operations | System tracking |
| **Display** | Primary | Background |
| **Search** | Main method | Not used |
| **Staff Know** | ✅ Yes | ❌ No |
| **TOM Priority** | ⭐ HIGH | Background |

**Key Takeaway:** Always display and search by Physical Reference (ZE####), but store System Reference for data integrity.

---

Ready to extract your trays with proper reference handling! 🚀
