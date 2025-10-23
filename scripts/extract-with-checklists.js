console.log('Starting comprehensive extraction with instrument checklists...');
console.log('This will take longer as it clicks into each tray for details.');

if (typeof allTraysComplete === 'undefined') {
  allTraysComplete = [];
  console.log('Created new allTraysComplete array');
}

let currentPageData = [];
let trayLinks = [];

// Step 1: Get all tray links from current page
function collectTrayLinks() {
  trayLinks = [];
  let rows = document.querySelectorAll('table tbody tr');

  rows.forEach((row, index) => {
    let cells = row.querySelectorAll('td');
    if (cells.length < 8) return;

    // Find the clickable link in the row (usually in the name or tray ref column)
    let link = row.querySelector('a');
    if (link) {
      let rawName = cells[2]?.innerText?.trim() || '';
      let physicalRefMatch = rawName.match(/\(([A-Z]{2}\d{4})\)/);

      trayLinks.push({
        index: index,
        link: link,
        basicData: {
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

// Step 2: Extract instrument checklist from detail page
function extractInstrumentChecklist() {
  let instruments = [];

  // Look for instrument table on detail page
  let detailRows = document.querySelectorAll('table tbody tr');

  detailRows.forEach(row => {
    let cells = row.querySelectorAll('td');
    if (cells.length >= 3) {
      let itemName = cells[0]?.innerText?.trim();
      let itemType = cells[1]?.innerText?.trim();
      let quantity = cells[2]?.innerText?.trim();

      if (itemName && itemName !== '') {
        instruments.push({
          itemId: itemName.substring(0, 10).replace(/\s/g, '_'),
          name: itemName,
          type: itemType || 'Instrument',
          quantity: parseInt(quantity) || 1,
          category: 'Instruments'
        });
      }
    }
  });

  return instruments;
}

// Step 3: Process one tray (click, extract, go back)
async function processTray(trayData, index, total) {
  console.log('Processing tray ' + (index + 1) + '/' + total + ': ' + trayData.basicData.name);

  // Click the tray link
  trayData.link.click();

  // Wait for page to load
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Extract instrument checklist
  let instruments = extractInstrumentChecklist();

  // Combine basic data with instruments
  let completeTray = {
    ...trayData.basicData,
    instruments: instruments,
    instrumentCount: instruments.length
  };

  currentPageData.push(completeTray);
  console.log('  ✓ Extracted ' + instruments.length + ' instruments');

  // Go back to list
  window.history.back();

  // Wait for list to reload
  await new Promise(resolve => setTimeout(resolve, 1500));
}

// Step 4: Process all trays on current page
async function processCurrentPage() {
  let count = collectTrayLinks();

  if (count === 0) {
    console.log('No trays found on this page');
    return 0;
  }

  currentPageData = [];

  for (let i = 0; i < trayLinks.length; i++) {
    await processTray(trayLinks[i], i, trayLinks.length);
  }

  // Add to master collection
  allTraysComplete = allTraysComplete.concat(currentPageData);

  console.log('');
  console.log('Page complete! Extracted ' + currentPageData.length + ' trays with checklists');
  console.log('Total accumulated: ' + allTraysComplete.length + ' trays');
  console.log('');
  console.log('NEXT STEPS:');
  console.log('1. Click NEXT button to go to next page');
  console.log('2. Wait for page to load');
  console.log('3. Press UP arrow + ENTER to run script again');
  console.log('');

  return currentPageData.length;
}

// Start processing
processCurrentPage();
