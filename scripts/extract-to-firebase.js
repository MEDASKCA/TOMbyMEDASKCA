// ============================================================================
// SYNERGY TRAK → FIREBASE DIRECT UPLOAD SCRIPT
// ============================================================================
// This script extracts tray data and uploads directly to Firebase
// Run this in the Synergy Trak browser console
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

// Extract instruments from tray detail page
function extractInstrumentChecklist() {
  let instruments = [];
  let tables = document.querySelectorAll('table');
  let contentsTable = null;

  // Find table with "Item ID" header
  for (let table of tables) {
    let headers = table.querySelectorAll('th');
    let headerText = Array.from(headers).map(h => h.innerText.trim().toLowerCase()).join(' ');

    if (headerText.includes('item id') && headerText.includes('item') && headerText.includes('quantity')) {
      contentsTable = table;
      break;
    }
  }

  if (!contentsTable) {
    return [];
  }

  let rows = contentsTable.querySelectorAll('tbody tr');

  rows.forEach(row => {
    let cells = row.querySelectorAll('td');

    if (cells.length >= 4) {
      let itemId = cells[0]?.innerText?.trim() || '';
      let itemName = cells[1]?.innerText?.trim() || '';
      let itemType = cells[2]?.innerText?.trim() || 'Instrument';
      let quantity = cells[3]?.innerText?.trim() || '1';

      // Only valid Item IDs
      if (itemId && itemName && itemId.match(/^[A-Z0-9]+$/i) && itemId.length >= 4) {
        let category = 'Instruments';
        if (itemType.toLowerCase().includes('consumable') || itemType.toLowerCase().includes('non-clinical')) {
          category = 'Consumables';
        } else if (itemType.toLowerCase().includes('wrap')) {
          category = 'Wrap';
        } else if (itemType.toLowerCase().includes('container') || itemType.toLowerCase().includes('insert')) {
          category = 'Containers/Inserts';
        }

        instruments.push({
          itemId: itemId,
          name: itemName,
          type: itemType,
          quantity: parseInt(quantity) || 1,
          category: category
        });
      }
    }
  });

  return instruments;
}

// Collect tray links from current page
function collectTrayLinks() {
  let trayLinks = [];
  let rows = document.querySelectorAll('table tbody tr');

  rows.forEach((row, index) => {
    let cells = row.querySelectorAll('td');
    if (cells.length < 8) return;

    let link = row.querySelector('a');
    if (link) {
      let rawName = cells[2]?.innerText?.trim() || '';
      let physicalRefMatch = rawName.match(/\(([A-Z]{2}\d{4})\)/);

      trayLinks.push({
        link: link,
        data: {
          instanceId: cells[0]?.innerText?.trim(),
          trayRef: cells[1]?.innerText?.trim(),
          name: rawName,
          physicalRef: physicalRefMatch ? physicalRefMatch[1] : null,
          type: cells[3]?.innerText?.trim(),
          deliveryPoint: cells[4]?.innerText?.trim(),
          status: cells[6]?.innerText?.trim(),
          facility: cells[7]?.innerText?.trim()
        }
      });
    }
  });

  return trayLinks;
}

// Upload tray to Firebase
async function uploadToFirebase(db, trayData) {
  try {
    // Use trayRef as document ID, or generate one
    const docId = trayData.trayRef || trayData.instanceId || db.collection('inventory').doc().id;

    await db.collection('inventory').doc(docId).set({
      id: docId,
      name: trayData.name,
      physicalRef: trayData.physicalRef,
      trayRef: trayData.trayRef,
      instanceId: trayData.instanceId,
      category: 'Instrument Trays',
      specialty: trayData.type || 'General',
      location: trayData.deliveryPoint || 'Unknown',
      quantity: 1,
      status: trayData.status === 'In Use' ? 'in_use' : 'available',
      facility: trayData.facility,
      trayType: trayData.type,
      instruments: trayData.instruments || [],
      instrumentCount: (trayData.instruments || []).length,
      notes: 'Imported from Synergy Trak',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    stats.totalUploaded++;
    return true;
  } catch (error) {
    console.error('Upload error:', error);
    stats.errors++;
    return false;
  }
}

// Process one tray
async function processTray(db, trayInfo, index, total) {
  console.log('  [' + (index + 1) + '/' + total + '] ' + trayInfo.data.name);

  trayInfo.link.click();
  await new Promise(resolve => setTimeout(resolve, 1500));

  let instruments = extractInstrumentChecklist();

  let completeTray = {
    ...trayInfo.data,
    instruments: instruments,
    instrumentCount: instruments.length
  };

  console.log('      ✓ ' + instruments.length + ' instruments');

  let uploaded = await uploadToFirebase(db, completeTray);
  if (uploaded) {
    console.log('      ✓ Uploaded to Firebase');
  } else {
    console.log('      ✗ Upload failed');
  }

  stats.totalProcessed++;

  window.history.back();
  await new Promise(resolve => setTimeout(resolve, 1200));
}

// Process current page
async function processBatch(db) {
  console.log('');
  console.log('Starting batch extraction...');

  let trayLinks = collectTrayLinks();
  console.log('Found ' + trayLinks.length + ' trays on this page');

  if (trayLinks.length === 0) {
    console.log('ERROR: No trays found!');
    return;
  }

  for (let i = 0; i < trayLinks.length; i++) {
    await processTray(db, trayLinks[i], i, trayLinks.length);
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
}

// Main function
async function startExtraction() {
  console.log('');
  console.log('='.repeat(60));
  console.log('SYNERGY TRAK → FIREBASE EXTRACTION');
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
