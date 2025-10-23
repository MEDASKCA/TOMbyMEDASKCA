# 📋 Synergy Trak Data Capture Guide

Quick guide for extracting instrument tray data from Synergy Trak to import into TOM.

## 🎯 What Data to Capture

### Essential Fields:
- ✅ **Tray Name/ID** - e.g., "Orthopaedic Basic Set 1"
- ✅ **Specialty** - e.g., "Orthopaedic", "General Surgery"
- ✅ **Location** - Current storage location
- ✅ **Quantity** - Number of this tray available

### Optional Fields (if available):
- Individual instruments in each tray
- Instrument counts
- Tray status (available, in use, sterilizing)
- Notes or specifications

---

## 📸 Method 1: Screenshot + Manual Entry

1. **Take screenshots** of tray listings in Synergy Trak
2. **Save to your phone/drive**
3. **Manually type data** into import tool at home

---

## 📄 Method 2: Copy Table Data

### If Synergy Trak shows data in a table:

1. **Select all table rows** (click and drag)
2. **Copy** (Ctrl+C or Cmd+C)
3. **Paste into Excel/Notepad**
4. **Save as CSV** or copy text
5. **Import at home** via http://localhost:3000/admin/import-instruments

---

## 📊 Method 3: Export Function

### If Synergy Trak has Export/Download:

1. Look for buttons like:
   - "Export to CSV"
   - "Download Data"
   - "Export to Excel"
   - "Print" (can save as PDF)

2. **Download the file**
3. **Save to USB/email to yourself**
4. **Import at home**

---

## 📝 Quick Data Template

If manually typing, use this format:

### CSV Format (easiest):
```csv
Tray Name,Specialty,Location,Quantity
Orthopaedic Basic Set 1,Orthopaedic,Sterile Services,2
General Surgery Set 5,General Surgery,Main Theatre 3,1
Neurology Micro Set 2,Neurology,Storage A,3
```

### Simple Text (one per line):
```
Orthopaedic Basic Set 1
General Surgery Set 5
Neurology Micro Set 2
```

---

## 🔍 What to Look For in Synergy Trak

Common menu locations:
- **Inventory** → Instrument Trays
- **Equipment** → Tray Management
- **Reports** → Inventory Lists
- **Search** → Browse all trays

---

## ⚡ Quick Capture Strategy

**Priority 1** (Most Important):
- Tray names for YOUR specialty (Orthopaedic, etc.)
- Common trays you use daily

**Priority 2** (Nice to have):
- All specialties
- Detailed instrument lists

**Priority 3** (Advanced):
- Individual instrument counts
- Tray specifications
- Usage history

---

## 🏠 At Home Import Process

1. Go to: **http://localhost:3000/admin/import-instruments**
2. Select format (CSV/JSON/Text)
3. Paste your data
4. Click "Preview"
5. Verify data looks correct
6. Click "Import to Firebase"
7. Done! ✅

---

## 💡 Tips

- **Start small**: Capture 10-20 trays first to test
- **Phone photos work**: Take clear photos, type later
- **Email yourself**: Quick way to get data home
- **USB drive**: If allowed, save CSV files
- **Notes app**: Type directly into phone notes

---

## 🚨 Important

- ✅ Only capture **non-sensitive** operational data
- ✅ Don't capture patient information
- ✅ Follow your hospital's data policies
- ✅ This is for YOUR development/learning tool

---

## 📞 Current Status

You're logged into Synergy Trak now!

**Next steps:**
1. Navigate to instrument tray section
2. Look for export/copy options
3. Let me know what you see - I can help guide you through extraction

---

Ready to capture? Tell me what you see in Synergy Trak and I'll help you get the data! 🚀
