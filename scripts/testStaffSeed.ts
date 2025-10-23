import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';

// Firebase config
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

// Create a minimal staff profile for testing
const testProfile = {
  registrationId: 'TOM-NHS-2024-TEST001', // Renamed from 'id' to avoid conflict
  firstName: 'Test',
  lastName: 'Nurse',
  email: 'test.nurse@nhs.net',
  phone: '+44 7000 123456',
  nhsNumber: '123 456 7890',
  role: 'Scrub Nurse',
  band: 'Band 6',
  employmentType: 'permanent',
  yearsExperience: 5,
  currentTrust: 'Royal London Hospital',
  currentDepartment: 'Main Theatres',
  location: {
    address: 'Whitechapel Rd, Whitechapel',
    postcode: 'E1 1FR',
    coordinates: { lat: 51.5176, lng: -0.0599 }
  },
  availability: {
    preferredRadius: 20,
    preferredShifts: ['early', 'late'],
    preferredSpecialties: ['General Surgery', 'Trauma & Orthopaedics'],
    unavailableDates: [],
    maxHoursPerWeek: 40,
    minHourlyRate: 35,
  },
  performance: {
    totalShifts: 100,
    completedShifts: 98,
    cancelledShifts: 2,
    rating: 4.8,
    reviews: [],
    endorsements: [],
  },
  notifications: {
    email: true,
    sms: true,
    push: true,
    distanceAlerts: true,
    instantBook: true,
  },
  profileComplete: true,
  verified: true,
  isActive: true,
};

async function testSeed() {
  try {
    console.log('Testing Firebase save with minimal profile...\n');
    console.log('Profile data:', JSON.stringify(testProfile, null, 2));

    const profileWithTimestamp = {
      ...testProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Try using setDoc with a specific ID instead of addDoc
    const docId = 'test-staff-001';
    await setDoc(doc(db, 'staff', docId), profileWithTimestamp);
    console.log('\n✅ Successfully saved test profile with ID:', docId);
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Error:', error);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    process.exit(1);
  }
}

testSeed();
