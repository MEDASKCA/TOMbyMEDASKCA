console.log('Batch extraction WITH instrument checklists');
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

// Step 2: Extract instruments from detail page
function extractInstrumentChecklist() {
  let instruments = [];
  let detailRows = document.querySelectorAll('table tbody tr');

  detailRows.forEach(row => {
    let cells = row.querySelectorAll('td');
    if (cells.length >= 2) {
      let itemName = cells[0]?.innerText?.trim();
      let itemType = cells[1]?.innerText?.trim() || 'Instrument';
      let quantity = cells[2]?.innerText?.trim();

      if (itemName && itemName !== '' && itemName.length > 2) {
        instruments.push({
          itemId: itemName.substring(0, 15).replace(/\s/g, '_').replace(/[^a-zA-Z0-9_]/g, ''),
          name: itemName,
          type: itemType,
          quantity: parseInt(quantity) || 1,
          category: itemType.toLowerCase().includes('consumable') ? 'Consumables' : 'Instruments'
        });
      }
    }
  });

  return instruments;
}

// Step 3: Process one tray
async function processTray(trayInfo, index, total) {
  console.log('  [' + (index + 1) + '/' + total + '] ' + trayInfo.data.name);

  trayInfo.link.click();
  await new Promise(resolve => setTimeout(resolve, 1500));

  let instruments = extractInstrumentChecklist();

  let completeTray = {
    ...trayInfo.data,
    instruments: instruments,
    instrumentCount: instruments.length
  };

  currentBatchData.push(completeTray);
  processedCount++;

  console.log('      ✓ ' + instruments.length + ' instruments');

  window.history.back();
  await new Promise(resolve => setTimeout(resolve, 1500));
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
