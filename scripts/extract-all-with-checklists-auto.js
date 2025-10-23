console.log('='.repeat(60));
console.log('AUTOMATIC SYNERGY TRAK EXTRACTION WITH CHECKLISTS');
console.log('='.repeat(60));
console.log('');
console.log('This will extract ALL trays with instrument checklists');
console.log('Estimated time: 4-5 hours for 10,865 trays');
console.log('(~1.5 seconds per tray)');
console.log('');
console.log('Starting in 5 seconds...');
console.log('');

let allTraysComplete = [];
let currentPage = 1;
let totalPages = 109;
let totalExtracted = 0;

// Extract instrument checklist from detail page
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

// Process one tray
async function processTray(link, basicData, index, total) {
  link.click();
  await new Promise(resolve => setTimeout(resolve, 1500));

  let instruments = extractInstrumentChecklist();

  let completeTray = {
    ...basicData,
    instruments: instruments,
    instrumentCount: instruments.length
  };

  allTraysComplete.push(completeTray);
  totalExtracted++;

  if (totalExtracted % 10 === 0) {
    console.log('  Progress: ' + totalExtracted + ' trays extracted...');
  }

  window.history.back();
  await new Promise(resolve => setTimeout(resolve, 1500));

  return completeTray;
}

// Process current page
async function processCurrentPage() {
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

  console.log('Page ' + currentPage + '/' + totalPages + ' - Found ' + trayLinks.length + ' trays');

  for (let i = 0; i < trayLinks.length; i++) {
    await processTray(trayLinks[i].link, trayLinks[i].data, i, trayLinks.length);
  }

  return trayLinks.length;
}

// Navigate to next page
function goToNextPage() {
  let inputs = document.querySelectorAll('input');
  let pageInput = inputs[5];

  if (pageInput) {
    currentPage++;
    pageInput.value = currentPage;
    pageInput.dispatchEvent(new Event('change', { bubbles: true }));
    pageInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
    return true;
  }
  return false;
}

// Main extraction loop
async function extractAllPages() {
  console.log('Starting extraction at page ' + currentPage);

  for (let page = currentPage; page <= totalPages; page++) {
    let extracted = await processCurrentPage();

    if (extracted === 0) {
      console.log('No more data found');
      break;
    }

    console.log('✓ Page ' + currentPage + ' complete - Total: ' + allTraysComplete.length + ' trays');

    // Save progress every 5 pages
    if (page % 5 === 0) {
      localStorage.setItem('synergy_backup', JSON.stringify(allTraysComplete));
      console.log('  Backup saved (' + allTraysComplete.length + ' trays)');
    }

    if (page >= totalPages) break;

    // Go to next page
    goToNextPage();
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Final save
  localStorage.setItem('synergy_final_complete', JSON.stringify(allTraysComplete));

  console.log('');
  console.log('='.repeat(60));
  console.log('EXTRACTION COMPLETE!');
  console.log('='.repeat(60));
  console.log('Total trays extracted: ' + allTraysComplete.length);
  console.log('Data saved to localStorage as: synergy_final_complete');
  console.log('');
  console.log('To retrieve your data, run:');
  console.log('console.log(JSON.stringify(allTraysComplete, null, 2))');
  console.log('');
  console.log('Or retrieve from localStorage:');
  console.log('console.log(localStorage.getItem("synergy_final_complete"))');
  console.log('');

  alert('SUCCESS! Extracted ' + allTraysComplete.length + ' trays with instrument checklists!');

  return allTraysComplete;
}

// Start after delay
setTimeout(() => {
  extractAllPages();
}, 5000);
