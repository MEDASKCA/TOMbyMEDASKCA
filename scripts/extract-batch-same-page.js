console.log('Batch extraction - single page version');
console.log('This will take ~2-3 minutes per 100 trays');

if (typeof allTraysComplete === 'undefined') {
  allTraysComplete = [];
  console.log('Created new allTraysComplete array');
}

let trayLinks = [];
let currentBatchData = [];
let processedCount = 0;

// Step 1: Collect all tray links on current page
function collectTrayLinks() {
  trayLinks = [];
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

  console.log('Found ' + trayLinks.length + ' trays on this page');
  return trayLinks.length;
}

// Step 2: Extract instruments from the page (after clicking tray)
function extractInstrumentChecklist() {
  let instruments = [];

  // Get ALL tables on the page
  let tables = document.querySelectorAll('table');

  // The instrument list is likely in the second or third table
  tables.forEach((table, tableIndex) => {
    let rows = table.querySelectorAll('tbody tr');

    // Look for tables with instrument-like data
    rows.forEach(row => {
      let cells = row.querySelectorAll('td');

      // Try different column structures
      if (cells.length >= 2) {
        let col1 = cells[0]?.innerText?.trim() || '';
        let col2 = cells[1]?.innerText?.trim() || '';
        let col3 = cells[2]?.innerText?.trim() || '';

        // Skip if it looks like the main inventory table
        if (col1.match(/^\d{10,}$/)) return; // Skip instance IDs
        if (col1.toLowerCase().includes('instance')) return;

        // If first column has meaningful text (instrument name)
        if (col1.length > 3 && !col1.match(/^\d+$/)) {
          instruments.push({
            itemId: col1.substring(0, 15).replace(/\s/g, '_').replace(/[^a-zA-Z0-9_]/g, ''),
            name: col1,
            type: col2 || 'Instrument',
            quantity: parseInt(col3) || 1,
            category: (col2 && col2.toLowerCase().includes('consumable')) ? 'Consumables' : 'Instruments'
          });
        }
      }
    });
  });

  // Remove duplicates
  let uniqueInstruments = [];
  let seen = new Set();

  instruments.forEach(inst => {
    if (!seen.has(inst.name)) {
      seen.add(inst.name);
      uniqueInstruments.push(inst);
    }
  });

  return uniqueInstruments;
}

// Step 3: Process one tray
async function processTray(trayInfo, index, total) {
  console.log('  [' + (index + 1) + '/' + total + '] ' + trayInfo.data.name);

  // Click tray name
  trayInfo.link.click();

  // Wait for page content to load/update
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Extract instruments from the page
  let instruments = extractInstrumentChecklist();

  let completeTray = {
    ...trayInfo.data,
    instruments: instruments,
    instrumentCount: instruments.length
  };

  currentBatchData.push(completeTray);
  processedCount++;

  console.log('      ✓ ' + instruments.length + ' instruments');

  // Go back to list
  window.history.back();
  await new Promise(resolve => setTimeout(resolve, 1200));
}

// Step 4: Process all trays on current page
async function processBatch() {
  console.log('');
  console.log('Starting batch extraction...');

  let count = collectTrayLinks();
  if (count === 0) {
    console.log('ERROR: No trays found!');
    return;
  }

  currentBatchData = [];
  processedCount = 0;

  for (let i = 0; i < trayLinks.length; i++) {
    await processTray(trayLinks[i], i, trayLinks.length);
  }

  allTraysComplete = allTraysComplete.concat(currentBatchData);

  console.log('');
  console.log('='.repeat(50));
  console.log('Batch complete!');
  console.log('  This batch: ' + currentBatchData.length + ' trays');
  console.log('  Total accumulated: ' + allTraysComplete.length + ' trays');
  console.log('='.repeat(50));
  console.log('');
  console.log('NEXT STEPS:');
  console.log('1. Click NEXT button in Synergy Trak');
  console.log('2. Wait for page to load');
  console.log('3. Press UP arrow + ENTER to continue');
  console.log('');

  if (allTraysComplete.length >= 1000) {
    console.log('You have 1000+ trays! You can retrieve data anytime:');
    console.log('console.log(JSON.stringify(allTraysComplete, null, 2))');
    console.log('');
  }
}

// Start processing
processBatch();
