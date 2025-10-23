// ============================================================================
// SYNERGY TRAK → FIREBASE - TRAYS ONLY (NO CHECKLISTS)
// ============================================================================
// Fast extraction - just basic tray info, no clicking into details
// ============================================================================

console.log('Initializing Firebase connection...');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8_xzxNFMAUWZ9Oc8SHkNoE9WExhI-sfE",
  authDomain: "projectsocial-78d85.firebaseapp.com",
  projectId: "projectsocial-78d85",
  storageBucket: "projectsocial-78d85.firebasestorage.app",
  messagingSenderId: "151855352255",
  appId: "1:151855352255:web:8e838a5e205924ab90390a"
};

// Load Firebase SDK dynamically
async function loadFirebase() {
  if (typeof firebase === 'undefined') {
    console.log('Loading Firebase SDK...');

    // Load Firebase App
    await new Promise((resolve, reject) => {
      const script1 = document.createElement('script');
      script1.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js';
      script1.onload = resolve;
      script1.onerror = reject;
      document.head.appendChild(script1);
    });

    // Load Firestore
    await new Promise((resolve, reject) => {
      const script2 = document.createElement('script');
      script2.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js';
      script2.onload = resolve;
      script2.onerror = reject;
      document.head.appendChild(script2);
    });

    console.log('Firebase SDK loaded!');
  }

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  return firebase.firestore();
}

// Statistics
let stats = {
  totalProcessed: 0,
  totalUploaded: 0,
  errors: 0,
  startTime: new Date()
};

// Extract trays from current page
function extractTraysFromPage() {
  let trays = [];
  let rows = document.querySelectorAll('table tbody tr');

  rows.forEach(row => {
    let cells = row.querySelectorAll('td');
    if (cells.length < 8) return;

    let rawName = cells[2]?.innerText?.trim() || '';
    let physicalRefMatch = rawName.match(/\(([A-Z]{2}\d{4})\)/);

    trays.push({
      instanceId: cells[0]?.innerText?.trim(),
      trayRef: cells[1]?.innerText?.trim(),
      name: rawName,
      physicalRef: physicalRefMatch ? physicalRefMatch[1] : null,
      type: cells[3]?.innerText?.trim(),
      deliveryPoint: cells[4]?.innerText?.trim(),
      status: cells[6]?.innerText?.trim(),
      facility: cells[7]?.innerText?.trim()
    });
  });

  return trays;
}

// Upload tray to Firebase
async function uploadToFirebase(db, trayData) {
  try {
    // Use trayRef as document ID, or generate one
    const docId = trayData.trayRef || trayData.instanceId || db.collection('inventory').doc().id;

    // Map status
    let firestoreStatus = 'available';
    if (trayData.status && trayData.status.toLowerCase().includes('in use')) {
      firestoreStatus = 'in_use';
    } else if (trayData.status && trayData.status.toLowerCase().includes('steril')) {
      firestoreStatus = 'sterilizing';
    }

    await db.collection('inventory').doc(docId).set({
      id: docId,
      name: trayData.name,
      physicalRef: trayData.physicalRef || null,
      trayRef: trayData.trayRef,
      instanceId: trayData.instanceId,
      category: 'Instrument Trays',
      specialty: trayData.type || 'General',
      location: trayData.deliveryPoint || 'Unknown',
      quantity: 1,
      status: firestoreStatus,
      facility: trayData.facility || 'Main Hospital',
      trayType: trayData.type,
      notes: 'Imported from Synergy Trak',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    stats.totalUploaded++;
    return true;
  } catch (error) {
    console.error('Upload error for', trayData.name, ':', error);
    stats.errors++;
    return false;
  }
}

// Process current page
async function processBatch(db) {
  console.log('');
  console.log('Extracting trays from current page...');

  let trays = extractTraysFromPage();
  console.log('Found ' + trays.length + ' trays');

  if (trays.length === 0) {
    console.log('ERROR: No trays found!');
    return;
  }

  console.log('Uploading to Firebase...');

  // Upload all trays
  for (let i = 0; i < trays.length; i++) {
    let tray = trays[i];
    let uploaded = await uploadToFirebase(db, tray);

    stats.totalProcessed++;

    if ((i + 1) % 10 === 0) {
      console.log('  Progress: ' + (i + 1) + '/' + trays.length);
    }
  }

  console.log('');
  console.log('='.repeat(50));
  console.log('Batch complete!');
  console.log('  Processed: ' + stats.totalProcessed);
  console.log('  Uploaded: ' + stats.totalUploaded);
  console.log('  Errors: ' + stats.errors);
  console.log('='.repeat(50));
  console.log('');
  console.log('NEXT STEPS:');
  console.log('1. Click NEXT button in Synergy Trak');
  console.log('2. Wait for page to load');
  console.log('3. Press UP arrow + ENTER to continue');
  console.log('');

  if (stats.totalProcessed >= 1000) {
    let elapsed = (new Date() - stats.startTime) / 1000 / 60;
    console.log('Total time: ' + elapsed.toFixed(1) + ' minutes');
  }
}

// Main function
async function startExtraction() {
  console.log('');
  console.log('='.repeat(60));
  console.log('SYNERGY TRAK → FIREBASE - TRAYS ONLY');
  console.log('='.repeat(60));
  console.log('');

  try {
    const db = await loadFirebase();
    console.log('✓ Connected to Firebase!');
    console.log('');

    await processBatch(db);
  } catch (error) {
    console.error('FATAL ERROR:', error);
  }
}

// Auto-start
console.log('Starting in 3 seconds...');
setTimeout(startExtraction, 3000);
