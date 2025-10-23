# Staff Profile Seeding Script

This script generates and seeds comprehensive NHS staff profiles to Firebase Firestore.

## What it does

- Generates 50 diverse staff profiles across all theatre roles
- Includes complete address and geolocation data for 24 London hospitals
- Creates realistic competencies, compliance data, and performance metrics
- Links profiles to the MobileProfile UI structure

## Staff Roles Generated

- **Scrub Nurse** - Specialist theatre scrub practitioners
- **Anaesthetic Nurse** - Anaesthetic/recovery specialists
- **ODP** - Operating Department Practitioners
- **HCA** - Healthcare Assistants
- **Recovery Nurse** - Post-operative recovery specialists
- **Theatre Nurse** - General theatre nurses

## Hospitals Covered

### Central London
- Royal London Hospital
- St Thomas' Hospital
- Guy's Hospital
- King's College Hospital
- University College Hospital
- St Mary's Hospital
- Chelsea and Westminster Hospital
- St George's Hospital

### North London
- Whittington Hospital
- North Middlesex Hospital
- Barnet Hospital

### South London
- Lewisham Hospital
- Queen Elizabeth Hospital Woolwich
- Croydon University Hospital

### East London
- Newham University Hospital
- Homerton Hospital

### West London
- Ealing Hospital
- West Middlesex Hospital

### Outskirts
- Hillingdon Hospital
- Epsom Hospital
- Kingston Hospital
- Watford General Hospital
- Princess Royal Hospital Bromley
- Darent Valley Hospital

## Data Generated

Each profile includes:

### Basic Information
- Name, email, phone, NHS number
- Registration ID (TOM-NHS-2024-XXXX format)
- Role and band
- Years of experience

### Location
- Current hospital with full address
- Postcode for geolocation
- GPS coordinates (lat/lng)

### Competencies
- **Procedures**: Specialty-specific surgical procedures with competency levels
- **Equipment**: Theatre equipment proficiency (tables, anaesthetic machines, laparoscopy, diathermy)
- **Surgical Systems**: Robotic and advanced systems (Da Vinci, Mako, etc.)

### Compliance
- DBS certification with update service
- Professional registration (NMC/HCPC)
- Mandatory training (12+ modules)
- Occupational health and immunizations
- Indemnity insurance

### Performance
- Total shifts worked
- Completion rate
- Ratings and reviews
- Cancellation history

### Availability Preferences
- Preferred radius
- Preferred shift types
- Preferred specialties
- Minimum hourly rate (band-based)

## How to Run

Make sure your Firebase configuration is set in `.env.local`, then run:

```bash
npm run seed:staff
```

The script will:
1. Generate 50 staff profiles
2. Show distribution by role and hospital
3. Save all profiles to the `staff` collection in Firestore
4. Display progress and summary

## Firebase Setup

Ensure your `.env.local` contains:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Output

The script provides detailed console output showing:
- Number of profiles generated
- Distribution by role (8-9 per role)
- Distribution by hospital
- Save progress (updates every 10 profiles)
- Final summary with success count

## Notes

- Profiles are generated with realistic variation in experience, competencies, and preferences
- 80% of profiles are marked as verified
- 90% are marked as active
- All have complete compliance documentation
- Geolocation data is real and accurate for all hospitals
