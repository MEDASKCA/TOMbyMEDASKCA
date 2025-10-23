# TOM Seed Data Summary

## 📊 Data Generated

### ✅ Staff (Total: 925 unique names)
- **400 Registered Nurses (RNs)** - Format: `RN A. Flores`
- **200 Operating Department Practitioners (ODPs)** - Format: `ODP D. Dudley`
- **200 Healthcare Assistants (HCAs)** - Format: `HCA G. Cash`
- **50 Consultant Surgeons** - Format: `Mr. J. Bartlett` / `Miss. T. Mitchell`
- **45 Assistant Surgeons** - By grade:
  - 5x FY1 (Foundation Year 1) - e.g., `FY1 R. Cepeda`
  - 5x FY2 (Foundation Year 2)
  - 5x CT1 (Core Training 1)
  - 5x CT2 (Core Training 2)
  - 5x ST3 (Specialist Training 3)
  - 5x ST4, 5x ST5, 5x ST6, 5x ST7
  - 5x ST8 - e.g., `ST8 J. Graham`
- **30 Anaesthetists** - Format: `Dr. M. Bridge`

### ✅ Instrument Trays (Total: 1,700 trays)
100 trays per specialty across 17 specialties:
1. **Orthopaedic** - Orthopaedic Instrument Tray 1-100
2. **Neurology** - Neurology Instrument Tray 1-100
3. **HPB** (Hepato-Pancreato-Biliary) - HPB Instrument Tray 1-100
4. **General Surgery** - General Surgery Instrument Tray 1-100
5. **Robotic** - Robotic Instrument Tray 1-100
6. **Upper GI** - Upper GI Instrument Tray 1-100
7. **Gynaecology** - Gynaecology Instrument Tray 1-100
8. **Urology** - Urology Instrument Tray 1-100
9. **Plastics** - Plastics Instrument Tray 1-100
10. **Dermatology** - Dermatology Instrument Tray 1-100
11. **OMFS** (Oral & Maxillofacial Surgery) - OMFS Instrument Tray 1-100
12. **ENT** (Ear, Nose & Throat) - ENT Instrument Tray 1-100
13. **Ortho Trauma** - Ortho Trauma Instrument Tray 1-100
14. **Neuro Trauma** - Neuro Trauma Instrument Tray 1-100
15. **Maxfax Trauma** - Maxfax Trauma Instrument Tray 1-100
16. **Emergency** - Emergency Instrument Tray 1-100
17. **Obstetrics** - Obstetrics Instrument Tray 1-100

### ✅ Locations (Total: 59 locations)

**Clinical Areas:**
- Main Theatres: Main Theatre 1-12
- DSU Theatres: DSU Theatre 1-8
- Paediatric Theatres
- Recovery Area
- Day Surgery Recovery Area

**Wards & Critical Care:**
- ITU (Intensive Therapy Unit)
- HDU (High Dependency Unit)
- Ward 3A, Ward 4B, Ward 10F, Ward 6E, Ward 8W
- Renal Ward
- Day Surgery Ward

**Storage & Services:**
- Storage A, B, C, D
- Sterile Services
- Equipment Room
- Specimen Room
- Pharmacy Cupboard

**Support Services:**
- Radiology
- Blood Bank

**Staff Areas:**
- Coffee Room
- Tea and Coffee Room
- Relaxation Room
- Meeting Room 1-10

**Administrative:**
- CPE's Office
- Matron's Office
- Floor Coordinator Office
- Manager's Office
- Security Office

## 📁 File Structure

```
data/seed/
├── staff-names.json          # All 925 staff names organized by role
├── instrument-trays.json     # All 1,700 instrument trays by specialty
├── locations.json            # All 59 locations
└── README.md                 # This file
```

## 🔄 Next Steps

1. **Create Seeding Script** - Utility to populate Firestore with this data
2. **Assign Data** - Distribute staff to departments, shifts, and theatres
3. **Generate Procedures** - Create mock surgical procedures using this staff
4. **Inventory Setup** - Assign instrument trays to locations with stock levels

## 💡 Usage

This seed data will be used to populate the TOM Firebase database for development and testing. All data is realistic but fictional, following NHS theatre operations naming conventions.
