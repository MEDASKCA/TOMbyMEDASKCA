console.log('Batch extraction WITH instrument checklists (via Contents)');
console.log('This will take ~3-4 minutes per 100 trays');

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

// Step 2: Find and click "Navigate to Contents" button/link
function clickNavigateToContents() {
  // Try finding by text content
  let allLinks = document.querySelectorAll('a, button');
  let contentsLink = null;

  for (let link of allLinks) {
    let text = link.innerText.trim().toLowerCase();
    if (text.includes('contents') || text.includes('navigate to contents')) {
      contentsLink = link;
      break;
    }
  }

  if (contentsLink) {
    contentsLink.click();
    return true;
  }

  return false;
}

// Step 3: Extract instruments from contents page
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

// Step 4: Process one tray
async function processTray(trayInfo, index, total) {
  console.log('  [' + (index + 1) + '/' + total + '] ' + trayInfo.data.name);

  // Click tray name
  trayInfo.link.click();
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Click "Navigate to Contents"
  let foundContents = clickNavigateToContents();
  if (!foundContents) {
    console.log('      ⚠ Could not find "Navigate to Contents" button');
    // Go back and skip this tray
    window.history.back();
    await new Promise(resolve => setTimeout(resolve, 1000));
    return;
  }

  await new Promise(resolve => setTimeout(resolve, 1500));

  // Extract instruments
  let instruments = extractInstrumentChecklist();

  let completeTray = {
    ...trayInfo.data,
    instruments: instruments,
    instrumentCount: instruments.length
  };

  currentBatchData.push(completeTray);
  processedCount++;

  console.log('      ✓ ' + instruments.length + ' instruments');

  // Go back twice (from contents to tray detail, then to list)
  window.history.back();
  await new Promise(resolve => setTimeout(resolve, 1000));
  window.history.back();
  await new Promise(resolve => setTimeout(resolve, 1500));
}

// Step 5: Process all trays on current page
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
