import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { StaffProfile } from '../types/marketplace';

// Firebase config - loaded from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// London Hospitals with full address data
const hospitals = [
  // Central London
  {
    name: "Royal London Hospital",
    address: "Whitechapel Rd, Whitechapel",
    postcode: "E1 1FR",
    coordinates: { lat: 51.5176, lng: -0.0599 }
  },
  {
    name: "St Thomas' Hospital",
    address: "Westminster Bridge Rd, Lambeth",
    postcode: "SE1 7EH",
    coordinates: { lat: 51.4989, lng: -0.1183 }
  },
  {
    name: "Guy's Hospital",
    address: "Great Maze Pond, Southwark",
    postcode: "SE1 9RT",
    coordinates: { lat: 51.5031, lng: -0.0874 }
  },
  {
    name: "King's College Hospital",
    address: "Denmark Hill, Camberwell",
    postcode: "SE5 9RS",
    coordinates: { lat: 51.4681, lng: -0.0935 }
  },
  {
    name: "University College Hospital",
    address: "235 Euston Rd, Fitzrovia",
    postcode: "NW1 2BU",
    coordinates: { lat: 51.5266, lng: -0.1341 }
  },
  {
    name: "St Mary's Hospital",
    address: "Praed St, Paddington",
    postcode: "W2 1NY",
    coordinates: { lat: 51.5174, lng: -0.1755 }
  },
  {
    name: "Chelsea and Westminster Hospital",
    address: "369 Fulham Rd, Chelsea",
    postcode: "SW10 9NH",
    coordinates: { lat: 51.4808, lng: -0.1881 }
  },
  {
    name: "St George's Hospital",
    address: "Blackshaw Rd, Tooting",
    postcode: "SW17 0QT",
    coordinates: { lat: 51.4276, lng: -0.1733 }
  },
  // North London
  {
    name: "Whittington Hospital",
    address: "Magdala Ave, Archway",
    postcode: "N19 5NF",
    coordinates: { lat: 51.5649, lng: -0.1386 }
  },
  {
    name: "North Middlesex Hospital",
    address: "Sterling Way, Edmonton",
    postcode: "N18 1QX",
    coordinates: { lat: 51.6098, lng: -0.0659 }
  },
  {
    name: "Barnet Hospital",
    address: "Wellhouse Ln, Barnet",
    postcode: "EN5 3DJ",
    coordinates: { lat: 51.6493, lng: -0.2033 }
  },
  // South London
  {
    name: "Lewisham Hospital",
    address: "High St, Lewisham",
    postcode: "SE13 6LH",
    coordinates: { lat: 51.4639, lng: -0.0131 }
  },
  {
    name: "Queen Elizabeth Hospital Woolwich",
    address: "Stadium Rd, Woolwich",
    postcode: "SE18 4QH",
    coordinates: { lat: 51.4894, lng: 0.0594 }
  },
  {
    name: "Croydon University Hospital",
    address: "530 London Rd, Croydon",
    postcode: "CR7 7YE",
    coordinates: { lat: 51.3798, lng: -0.0961 }
  },
  // East London
  {
    name: "Newham University Hospital",
    address: "Glen Rd, Plaistow",
    postcode: "E13 8SL",
    coordinates: { lat: 51.5294, lng: 0.0253 }
  },
  {
    name: "Homerton Hospital",
    address: "Homerton Row, Hackney",
    postcode: "E9 6SR",
    coordinates: { lat: 51.5516, lng: -0.0426 }
  },
  // West London
  {
    name: "Ealing Hospital",
    address: "Uxbridge Rd, Southall",
    postcode: "UB1 3HW",
    coordinates: { lat: 51.5131, lng: -0.3745 }
  },
  {
    name: "West Middlesex Hospital",
    address: "Twickenham Rd, Isleworth",
    postcode: "TW7 6AF",
    coordinates: { lat: 51.4771, lng: -0.3264 }
  },
  // Outskirts
  {
    name: "Hillingdon Hospital",
    address: "Pield Heath Rd, Uxbridge",
    postcode: "UB8 3NN",
    coordinates: { lat: 51.5344, lng: -0.4622 }
  },
  {
    name: "Epsom Hospital",
    address: "Dorking Rd, Epsom",
    postcode: "KT18 7EG",
    coordinates: { lat: 51.3263, lng: -0.2719 }
  },
  {
    name: "Kingston Hospital",
    address: "Galsworthy Rd, Kingston upon Thames",
    postcode: "KT2 7QB",
    coordinates: { lat: 51.4119, lng: -0.2968 }
  },
  {
    name: "Watford General Hospital",
    address: "Vicarage Rd, Watford",
    postcode: "WD18 0HB",
    coordinates: { lat: 51.6513, lng: -0.3916 }
  },
  {
    name: "Princess Royal Hospital Bromley",
    address: "Farnborough Common, Orpington",
    postcode: "BR6 8ND",
    coordinates: { lat: 51.3486, lng: 0.0789 }
  },
  {
    name: "Darent Valley Hospital",
    address: "Darenth Wood Rd, Dartford",
    postcode: "DA2 8DA",
    coordinates: { lat: 51.4389, lng: 0.2594 }
  },
];

// Staff roles
const roles = [
  'Scrub Nurse',
  'Anaesthetic Nurse',
  'ODP',
  'HCA',
  'Recovery Nurse',
  'Theatre Nurse'
] as const;

// Bands
const bands = [
  'Band 3',
  'Band 4',
  'Band 5',
  'Band 6',
  'Band 7',
  'Band 8a',
  'Band 8b'
] as const;

// First names
const firstNames = [
  'Sarah', 'Emma', 'James', 'David', 'Michael', 'Jennifer', 'Robert', 'Lisa',
  'John', 'Maria', 'Mohammed', 'Aisha', 'Peter', 'Rachel', 'Daniel', 'Rebecca',
  'Thomas', 'Hannah', 'Christopher', 'Sophie', 'Andrew', 'Emily', 'Matthew', 'Olivia',
  'Mark', 'Grace', 'Paul', 'Charlotte', 'Adam', 'Amelia', 'Luke', 'Jessica',
  'Benjamin', 'Chloe', 'Samuel', 'Megan', 'Alexander', 'Lauren', 'Ryan', 'Zoe',
  'Joseph', 'Ella', 'Jack', 'Lucy', 'Joshua', 'Katie', 'Oliver', 'Amy'
];

// Last names
const lastNames = [
  'Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Taylor', 'Davies', 'Wilson',
  'Evans', 'Thomas', 'Roberts', 'Walker', 'Robinson', 'Thompson', 'White', 'Hughes',
  'Edwards', 'Green', 'Lewis', 'Wood', 'Harris', 'Martin', 'Jackson', 'Clarke',
  'Turner', 'Hill', 'Scott', 'Cooper', 'Morris', 'Ward', 'Moore', 'King',
  'Watson', 'Baker', 'Harrison', 'Morgan', 'Patel', 'Khan', 'Ali', 'Ahmed',
  'Shah', 'Hussein', 'Lee', 'Chen', 'Wong', 'Singh', 'Kumar', 'Rodriguez'
];

// Specialties and procedures
const specialties = {
  'Trauma & Orthopaedics': [
    'Total Hip Replacement',
    'Total Knee Replacement',
    'Hip Fracture (NOF) Fixation',
    'Shoulder Arthroscopy',
    'ACL Reconstruction',
    'Spinal Decompression',
    'Complex Pelvic Fracture',
    'Hand Surgery',
  ],
  'Cardiac': [
    'Coronary Artery Bypass Graft (CABG)',
    'Valve Replacement',
    'Valve Repair',
    'Aortic Aneurysm Repair',
    'Pacemaker Insertion',
    'Cardiac Catheterization',
  ],
  'General Surgery': [
    'Laparoscopic Cholecystectomy',
    'Appendicectomy',
    'Hernia Repair',
    'Bowel Resection',
    'Thyroidectomy',
    'Mastectomy',
  ],
  'Neurosurgery': [
    'Craniotomy',
    'Spinal Fusion',
    'Brain Tumour Resection',
    'Aneurysm Clipping',
    'Ventriculoperitoneal Shunt',
  ],
  'Vascular': [
    'Carotid Endarterectomy',
    'Femoral-Popliteal Bypass',
    'AAA Repair',
    'Varicose Vein Surgery',
  ],
  'Urology': [
    'Transurethral Resection of Prostate (TURP)',
    'Nephrectomy',
    'Cystectomy',
    'Robotic Prostatectomy',
  ],
  'Gynaecology': [
    'Hysterectomy',
    'Ovarian Cystectomy',
    'Laparoscopic Sterilisation',
    'Caesarean Section',
  ],
  'ENT': [
    'Tonsillectomy',
    'Septoplasty',
    'Thyroidectomy',
    'Mastoidectomy',
  ],
};

// Equipment
const equipment = [
  { name: 'Stryker Operating Table 1042', manufacturer: 'Stryker', type: 'operating-table' as const },
  { name: 'Maquet Alphastar', manufacturer: 'Maquet', type: 'operating-table' as const },
  { name: 'Dräger Primus', manufacturer: 'Dräger', type: 'anaesthetic-machine' as const },
  { name: 'GE Aisys CS2', manufacturer: 'GE Healthcare', type: 'anaesthetic-machine' as const },
  { name: 'Karl Storz Laparoscopy Tower', manufacturer: 'Karl Storz', type: 'laparoscopy-tower' as const },
  { name: 'Olympus Visera Elite II', manufacturer: 'Olympus', type: 'laparoscopy-tower' as const },
  { name: 'Valleylab FT10', manufacturer: 'Medtronic', type: 'diathermy' as const },
  { name: 'ERBE VIO 3', manufacturer: 'ERBE', type: 'diathermy' as const },
];

// Surgical systems
const surgicalSystems = [
  { name: 'Da Vinci Xi', manufacturer: 'Intuitive Surgical', specialty: 'Robotic Surgery' },
  { name: 'Da Vinci Si', manufacturer: 'Intuitive Surgical', specialty: 'Robotic Surgery' },
  { name: 'Mako Robot', manufacturer: 'Stryker', specialty: 'Orthopaedics' },
  { name: 'Zimmer Rosa Knee', manufacturer: 'Zimmer Biomet', specialty: 'Orthopaedics' },
  { name: 'Stryker Hip System', manufacturer: 'Stryker', specialty: 'Orthopaedics' },
];

// Mandatory training modules
const mandatoryTraining = [
  { name: 'Basic Life Support', category: 'statutory' as const },
  { name: 'Immediate Life Support', category: 'statutory' as const },
  { name: 'Fire Safety', category: 'statutory' as const },
  { name: 'Manual Handling', category: 'statutory' as const },
  { name: 'Infection Prevention & Control', category: 'mandatory' as const },
  { name: 'Safeguarding Adults Level 2', category: 'mandatory' as const },
  { name: 'Safeguarding Children Level 2', category: 'mandatory' as const },
  { name: 'Information Governance', category: 'mandatory' as const },
  { name: 'Health & Safety', category: 'mandatory' as const },
  { name: 'Equality & Diversity', category: 'mandatory' as const },
  { name: 'Scrub Practitioner Course', category: 'role-specific' as const },
  { name: 'Anaesthetic Practitioner Course', category: 'role-specific' as const },
];

// Immunisations
const immunisations = [
  'Hepatitis B',
  'MMR',
  'Varicella',
  'COVID-19',
  'Seasonal Influenza',
  'TB (BCG)',
];

// Random helper functions
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

// Generate a unique registration ID
function generateRegistrationId(index: number): string {
  return `TOM-NHS-2024-${String(index + 4000).padStart(4, '0')}`;
}

// Generate email
function generateEmail(firstName: string, lastName: string): string {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@nhs.net`;
}

// Generate phone number
function generatePhone(): string {
  return `+44 ${randomInt(7000, 7999)} ${randomInt(100000, 999999)}`;
}

// Generate NHS number
function generateNHSNumber(): string {
  return `${randomInt(100, 999)} ${randomInt(100, 999)} ${randomInt(1000, 9999)}`;
}

// Generate NMC/HCPC registration number
function generateProfessionalRegNumber(role: string): string {
  if (role === 'ODP') {
    return `OD${randomInt(10000, 99999)}E`; // HCPC
  }
  return `${randomInt(90, 99)}A${randomInt(1000, 9999)}E`; // NMC
}

// Generate procedure competencies
function generateProcedureCompetencies(selectedSpecialties: string[]): any[] {
  const competencies: any[] = [];

  selectedSpecialties.forEach(specialty => {
    const procedures = specialties[specialty as keyof typeof specialties] || [];
    const procedureCount = randomInt(Math.floor(procedures.length * 0.5), procedures.length);
    const selectedProcedures = randomItems(procedures, procedureCount);

    selectedProcedures.forEach(procedure => {
      const level = randomItem(['competent', 'proficient', 'expert'] as const);
      const timesPerformed = level === 'expert' ? randomInt(100, 500) :
                            level === 'proficient' ? randomInt(30, 100) :
                            randomInt(10, 30);

      competencies.push({
        id: `proc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        procedureName: procedure,
        specialty,
        level,
        timesPerformed,
        lastPerformed: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
        verifiedBy: 'verified',
        verifiedByName: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
        verifiedDate: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
        notes: 'Competency verified through direct observation and portfolio review'
      });
    });
  });

  return competencies;
}

// Generate equipment competencies
function generateEquipmentCompetencies(): any[] {
  const count = randomInt(4, 8);
  const selectedEquipment = randomItems(equipment, count);

  return selectedEquipment.map(eq => {
    const level = randomItem(['basic', 'advanced', 'expert'] as const);
    const certified = Math.random() > 0.3;
    const certDate = certified ? randomDate(new Date(2020, 0, 1), new Date(2023, 0, 1)) : null;

    const competency: any = {
      id: `equip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      equipmentName: eq.name,
      manufacturer: eq.manufacturer,
      type: eq.type,
      level,
      certified,
      verifiedBy: 'verified',
      verifiedByName: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
      verifiedDate: new Date().toISOString(),
    };

    // Only add certification dates if certified
    if (certified && certDate) {
      competency.certificationDate = certDate.toISOString();
      competency.expiryDate = addYears(certDate, 3).toISOString();
    }

    return competency;
  });
}

// Generate surgical system competencies
function generateSystemCompetencies(): any[] {
  const hasSystems = Math.random() > 0.6; // 40% have surgical system training
  if (!hasSystems) return [];

  const count = randomInt(1, 3);
  const selectedSystems = randomItems(surgicalSystems, count);

  return selectedSystems.map(sys => {
    const certDate = randomDate(new Date(2020, 0, 1), new Date(2023, 0, 1));

    return {
      id: `sys-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      systemName: sys.name,
      manufacturer: sys.manufacturer,
      specialty: sys.specialty,
      certified: true,
      certificationDate: certDate.toISOString(),
      expiryDate: addYears(certDate, 2).toISOString(),
      certificateNumber: `CERT-${randomInt(100000, 999999)}`,
      verifiedBy: 'verified',
      verifiedByName: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
    };
  });
}

// Generate compliance data
function generateCompliance(role: string): any {
  const dbsDate = randomDate(new Date(2021, 0, 1), new Date(2023, 0, 1));
  const regDate = randomDate(new Date(2020, 0, 1), new Date(2024, 0, 1));
  const ohDate = randomDate(new Date(2023, 6, 1), new Date());

  return {
    dbs: {
      status: 'valid',
      expiryDate: addYears(dbsDate, 3).toISOString(),
      certificateNumber: `DBS${randomInt(100000000000, 999999999999)}`,
      updateService: true,
    },
    professionalRegistration: {
      body: role === 'ODP' ? 'HCPC' : 'NMC',
      registrationNumber: generateProfessionalRegNumber(role),
      expiryDate: addYears(regDate, 3).toISOString(),
      status: 'active',
    },
    mandatoryTraining: mandatoryTraining.map(training => {
      const completionDate = randomDate(new Date(2023, 0, 1), new Date());
      return {
        name: training.name,
        category: training.category,
        completed: true,
        completionDate: completionDate.toISOString(),
        expiryDate: addYears(completionDate, training.category === 'statutory' ? 1 : 3).toISOString(),
        certificateUrl: `https://example.com/cert/${Math.random().toString(36).substr(2, 9)}`,
      };
    }),
    occupationalHealth: {
      status: 'fit',
      lastAssessment: ohDate.toISOString(),
      nextDue: addYears(ohDate, 2).toISOString(),
      restrictions: [],
      immunisations: immunisations.map(imm => {
        const immDate = randomDate(new Date(2018, 0, 1), new Date(2022, 0, 1));
        return {
          name: imm,
          date: immDate.toISOString(),
          boosterDue: imm === 'Seasonal Influenza' ? addYears(immDate, 1).toISOString() :
                     imm === 'COVID-19' ? addYears(immDate, 1).toISOString() :
                     addYears(immDate, 10).toISOString(),
          status: 'current',
        };
      }),
    },
    indemnityInsurance: {
      provider: randomItem(['RCN Indemnity', 'UNISON', 'Medical Defence Union', 'Medical Protection Society']),
      policyNumber: `POL${randomInt(100000, 999999)}`,
      expiryDate: addYears(new Date(), 1).toISOString(),
    },
  };
}

// Generate performance data
function generatePerformance(): any {
  const totalShifts = randomInt(50, 300);
  const completedShifts = totalShifts - randomInt(0, 5);
  const cancelledShifts = totalShifts - completedShifts;
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5-5.0

  return {
    totalShifts,
    completedShifts,
    cancelledShifts,
    rating: parseFloat(rating),
    reviews: [],
    endorsements: [],
  };
}

// Generate a single staff profile
function generateStaffProfile(index: number): any {
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);
  const role = randomItem(roles);
  const hospital = randomItem(hospitals);
  const yearsExperience = randomInt(2, 20);

  // Band based on experience and role
  let band: string;
  if (role === 'HCA') {
    band = randomItem(['Band 3', 'Band 4']);
  } else if (yearsExperience < 2) {
    band = randomItem(['Band 5']);
  } else if (yearsExperience < 5) {
    band = randomItem(['Band 5', 'Band 6']);
  } else if (yearsExperience < 10) {
    band = randomItem(['Band 6', 'Band 7']);
  } else {
    band = randomItem(['Band 7', 'Band 8a', 'Band 8b']);
  }

  // Specialties based on role
  const availableSpecialties = Object.keys(specialties);
  const specialtyCount = role === 'HCA' ? randomInt(1, 2) : randomInt(2, 4);
  const selectedSpecialties = randomItems(availableSpecialties, specialtyCount);

  // Min hourly rate based on band
  const minRates: Record<string, number> = {
    'Band 3': 18,
    'Band 4': 22,
    'Band 5': 28,
    'Band 6': 35,
    'Band 7': 42,
    'Band 8a': 50,
    'Band 8b': 58,
  };

  const profile: any = {
    registrationId: generateRegistrationId(index), // Changed from 'id' to 'registrationId'
    firstName,
    lastName,
    email: generateEmail(firstName, lastName),
    phone: generatePhone(),
    nhsNumber: generateNHSNumber(),
    role,
    band,
    employmentType: randomItem(['permanent', 'bank', 'agency', 'both']),
    yearsExperience,
    currentTrust: hospital.name,
    currentDepartment: randomItem(['Main Theatres', 'Day Surgery Unit', 'Cardiac Theatres', 'Neuro Theatres', 'Orthopaedic Theatres']),
    location: {
      address: hospital.address,
      postcode: hospital.postcode,
      coordinates: hospital.coordinates,
    },
    availability: {
      preferredRadius: randomInt(10, 30),
      preferredShifts: randomItems(['early', 'late', 'night', 'long-day'], randomInt(2, 4)),
      preferredSpecialties: selectedSpecialties,
      unavailableDates: [],
      maxHoursPerWeek: randomInt(37, 48),
      minHourlyRate: minRates[band],
    },
    competencies: {
      procedures: generateProcedureCompetencies(selectedSpecialties),
      equipment: generateEquipmentCompetencies(),
      surgicalSystems: generateSystemCompetencies(),
    },
    compliance: generateCompliance(role),
    performance: generatePerformance(),
    notifications: {
      email: true,
      sms: Math.random() > 0.3,
      push: true,
      distanceAlerts: true,
      instantBook: Math.random() > 0.5,
    },
    profileComplete: true,
    verified: Math.random() > 0.2, // 80% verified
    isActive: Math.random() > 0.1, // 90% active
    // Don't include createdAt/updatedAt here - will be added as serverTimestamp
  };

  return profile;
}

// Helper function to remove undefined values recursively and deeply
function removeUndefinedValues(obj: any): any {
  if (obj === null) {
    return null;
  }

  if (obj === undefined) {
    return undefined;
  }

  if (Array.isArray(obj)) {
    return obj
      .map(item => removeUndefinedValues(item))
      .filter(item => item !== undefined);
  }

  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const cleaned: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const cleanedValue = removeUndefinedValues(obj[key]);
        // Only add to cleaned object if value is not undefined
        if (cleanedValue !== undefined) {
          cleaned[key] = cleanedValue;
        }
      }
    }
    return cleaned;
  }

  return obj;
}

// Main seeding function
async function seedStaffProfiles() {
  try {
    console.log('🚀 Starting staff profile seeding...\n');

    // Generate 50 staff profiles (adjust as needed)
    const numberOfProfiles = 50;
    const profiles: any[] = [];

    // Ensure we have representatives from each role
    const rolesArray = Array.from(roles);
    const profilesPerRole = Math.floor(numberOfProfiles / rolesArray.length);

    for (let i = 0; i < numberOfProfiles; i++) {
      const profile = generateStaffProfile(i);

      // Ensure even distribution of roles
      if (i < rolesArray.length * profilesPerRole) {
        const roleIndex = Math.floor(i / profilesPerRole);
        profile.role = rolesArray[roleIndex];
      }

      profiles.push(profile);
    }

    console.log(`📋 Generated ${profiles.length} staff profiles\n`);
    console.log('Role Distribution:');
    rolesArray.forEach(role => {
      const count = profiles.filter(p => p.role === role).length;
      console.log(`  ${role}: ${count}`);
    });

    console.log('\nHospital Distribution:');
    const hospitalCounts: Record<string, number> = {};
    profiles.forEach(p => {
      hospitalCounts[p.currentTrust] = (hospitalCounts[p.currentTrust] || 0) + 1;
    });
    Object.entries(hospitalCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([hospital, count]) => {
        console.log(`  ${hospital}: ${count}`);
      });

    console.log('\n💾 Saving to Firebase Firestore...\n');

    // Save each profile to Firestore
    let savedCount = 0;
    for (const profile of profiles) {
      try {
        // Remove undefined values
        const cleanedProfile = removeUndefinedValues(profile);

        // Use server timestamp for created/updated dates
        const profileForFirestore = {
          ...cleanedProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await addDoc(collection(db, 'staff'), profileForFirestore);
        savedCount++;

        if (savedCount % 10 === 0) {
          console.log(`  Saved ${savedCount}/${profiles.length} profiles...`);
        }
      } catch (error: any) {
        console.error(`\n❌ Error saving profile for ${profile.firstName} ${profile.lastName}`);
        console.error(`Error code: ${error?.code}`);
        console.error(`Error message: ${error?.message}`);

        // Log profile data to debug
        console.error(`\nAttempted to save profile:`, JSON.stringify(cleanedProfile, null, 2).substring(0, 500));

        // Try to find undefined values in the cleaned profile
        const findUndefined = (obj: any, path = ''): string[] => {
          const results: string[] = [];
          for (const key in obj) {
            const newPath = path ? `${path}.${key}` : key;
            if (obj[key] === undefined) {
              results.push(newPath);
            } else if (typeof obj[key] === 'object' && obj[key] !== null && !(obj[key] instanceof Date)) {
              results.push(...findUndefined(obj[key], newPath));
            }
          }
          return results;
        };

        const undefinedPaths = findUndefined(cleanedProfile);
        if (undefinedPaths.length > 0) {
          console.error(`Found undefined values at: ${undefinedPaths.join(', ')}`);
        }

        console.error('---\n');
      }
    }

    console.log(`\n✅ Successfully saved ${savedCount} staff profiles to Firebase!`);
    console.log(`\n📊 Summary:`);
    console.log(`  Total profiles: ${savedCount}`);
    console.log(`  Hospitals covered: ${Object.keys(hospitalCounts).length}`);
    console.log(`  Roles covered: ${rolesArray.length}`);

  } catch (error) {
    console.error('❌ Error seeding staff profiles:', error);
    throw error;
  }
}

// Run the seeding
seedStaffProfiles()
  .then(() => {
    console.log('\n🎉 Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
