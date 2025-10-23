// =========================================================
// SYNERGY TRAK - EXTRACT VISIBLE TRAYS (SIMPLE VERSION)
// Just extracts what's on the current page
// =========================================================

console.log('🚀 Starting extraction of visible trays...');

// Extract physical reference code from tray name (e.g., ZE1030)
function extractPhysicalRef(name) {
  let match = name.match(/\(([A-Z]{2}\d{4})\)/);
  return match ? match[1] : null;
}

// Extract all visible trays from the table
function extractVisibleTrays() {
  let trays = [];

  // Find all table rows
  let rows = document.querySelectorAll('table tbody tr');

  console.log(`Found ${rows.length} rows in table`);

  rows.forEach((row, index) => {
    let cells = row.querySelectorAll('td');

    // Skip if not enough cells (header rows, etc.)
    if (cells.length < 8) return;

    let rawName = cells[2]?.innerText?.trim() || '';

    let tray = {
      instanceId: cells[0]?.innerText?.trim(),
      trayRef: cells[1]?.innerText?.trim(),
      name: rawName,
      physicalRef: extractPhysicalRef(rawName),
      type: cells[3]?.innerText?.trim(),
      deliveryPoint: cells[4]?.innerText?.trim(),
      turnaroundId: cells[5]?.innerText?.trim(),
      status: cells[6]?.innerText?.trim(),
      facility: cells[7]?.innerText?.trim()
    };

    trays.push(tray);
  });

  return trays;
}

// Run extraction
let extractedTrays = extractVisibleTrays();

console.log('');
console.log('✅ ========================================');
console.log(`✅ EXTRACTED ${extractedTrays.length} TRAYS`);
console.log('✅ ========================================');
console.log('');

// Show sample
if (extractedTrays.length > 0) {
  console.log('Sample tray:');
  console.log(extractedTrays[0]);
  console.log('');
}

// Copy to clipboard
let jsonData = JSON.stringify(extractedTrays, null, 2);
copy(jsonData);

alert(`✅ SUCCESS!\n\nExtracted ${extractedTrays.length} trays from this page.\n\nData has been copied to clipboard!\n\nYou can now paste it into the import tool.`);

console.log('📋 Data copied to clipboard!');
console.log('');
console.log('Next steps:');
console.log('1. Go to http://localhost:3000/admin/import-instruments');
console.log('2. Select JSON format');
console.log('3. Paste the data (Ctrl+V)');
console.log('4. Click Preview, then Import');
