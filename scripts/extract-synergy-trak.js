// =========================================================
// SYNERGY TRAK - EXTRACT ALL TRAYS WITH INSTRUMENT DETAILS
// Enhanced to extract physical reference codes (e.g., ZE1030)
// =========================================================

let allTraysWithInstruments = [];

// Extract physical reference code from tray name (e.g., ZE1030)
function extractPhysicalRef(name) {
  // Matches patterns like (ZE1030), (ZO1002), (ZT1001), etc.
  let match = name.match(/\(([A-Z]{2}\d{4})\)/);
  return match ? match[1] : null;
}

// Clean up tray name (remove serial numbers, IDs)
function cleanTrayName(name) {
  // Remove S/N numbers and extra identifiers
  let cleaned = name.replace(/S\/N\s+[\w\s]+$/i, '').trim();
  return cleaned;
}

// Extract main table rows (tray list)
function getTrayRows() {
  return Array.from(document.querySelectorAll('table tbody tr')).filter(row => {
    return row.querySelectorAll('td').length >= 8;
  });
}

// Extract basic tray info from table row
function extractTrayBasicInfo(row) {
  let cells = row.querySelectorAll('td');
  let rawName = cells[2]?.innerText?.trim() || '';

  return {
    instanceId: cells[0]?.innerText?.trim(),
    trayRef: cells[1]?.innerText?.trim(),              // System ID (U029310755121)
    physicalRef: extractPhysicalRef(rawName),          // Physical code (ZE1030)
    name: cleanTrayName(rawName),                      // Cleaned name
    rawName: rawName,                                   // Original full name
    type: cells[3]?.innerText?.trim(),
    deliveryPoint: cells[4]?.innerText?.trim(),
    turnaroundId: cells[5]?.innerText?.trim(),
    status: cells[6]?.innerText?.trim(),
    facility: cells[7]?.innerText?.trim(),
    instruments: []
  };
}

// Extract instrument details from detail view
function extractInstrumentDetails() {
  let instruments = [];
  let currentCategory = null;

  // Look for all rows in the detail table
  document.querySelectorAll('table tbody tr').forEach(row => {
    let cells = row.querySelectorAll('td');
    let cellText = cells[0]?.innerText?.trim() || '';

    // Check if this is a category header
    // Categories: "Instruments", "Consumables", "Containers/Inserts", "****** WRAP *****"
    if (cells.length <= 2 && (
      cellText === 'Instruments' ||
      cellText === 'Consumables' ||
      cellText === 'Containers/Inserts' ||
      cellText.includes('WRAP') ||
      cellText.includes('******')
    )) {
      currentCategory = cellText.replace(/\*/g, '').trim();
      return;
    }

    // Extract instrument data (4 columns: Item ID, Item, Type, Quantity)
    if (cells.length >= 4) {
      let itemId = cells[0]?.innerText?.trim();
      let itemName = cells[1]?.innerText?.trim();
      let itemType = cells[2]?.innerText?.trim();
      let quantity = cells[3]?.innerText?.trim();

      // Skip empty rows or headers
      if (itemId && itemId !== 'Item ID' && itemName && itemName !== 'Item') {
        instruments.push({
          itemId: itemId,
          name: itemName,
          type: itemType,
          quantity: parseInt(quantity) || 1,
          category: currentCategory || 'Uncategorized'
        });
      }
    }
  });

  return instruments;
}

// Find and click the close button to return to main list
function closeDetailView() {
  // Try multiple methods to close
  let closeButton = document.querySelector('button[aria-label="Close"]') ||
                   document.querySelector('.modal-close') ||
                   document.querySelector('.close') ||
                   document.querySelector('[title="Close"]');

  if (closeButton) {
    closeButton.click();
    return true;
  }

  // Try pressing Escape key
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27 }));
  return true;
}

// Main extraction function
async function extractAllTraysWithDetails() {
  console.log('🚀 Starting FULL extraction (trays + instruments)...');
  console.log('⏳ This will take a while. Please do not close the browser.');
  console.log('');

  // Get all tray rows
  let trayRows = getTrayRows();
  let totalTrays = trayRows.length;

  console.log(`📦 Found ${totalTrays} trays on this page`);
  console.log('💡 TIP: Increase "Results per page" to maximum first!');
  console.log('');

  for (let i = 0; i < trayRows.length; i++) {
    try {
      // Get current tray rows (need to refresh after each click)
      trayRows = getTrayRows();
      let row = trayRows[i];

      // Extract basic info
      let trayData = extractTrayBasicInfo(row);

      console.log(`📋 [${i + 1}/${totalTrays}] ${trayData.physicalRef || 'NO-REF'} - ${trayData.name.substring(0, 50)}...`);

      // Click the tray name to open details
      let trayNameCell = row.querySelectorAll('td')[2];
      if (trayNameCell) {
        trayNameCell.click();

        // Wait for detail view to load
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Extract instruments from detail view
        let instruments = extractInstrumentDetails();
        trayData.instruments = instruments;

        // Count by category
        let instrumentCount = instruments.filter(i => i.category === 'Instruments').length;
        let consumableCount = instruments.filter(i => i.category === 'Consumables').length;

        console.log(`   ✅ ${instruments.length} items (${instrumentCount} instruments, ${consumableCount} consumables)`);

        // Close detail view
        closeDetailView();

        // Wait for transition back to list
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Save to array
      allTraysWithInstruments.push(trayData);

      // Save progress every 10 trays
      if ((i + 1) % 10 === 0) {
        console.log(`💾 Progress saved: ${i + 1}/${totalTrays} trays`);
        localStorage.setItem('synergy_extraction_backup', JSON.stringify(allTraysWithInstruments));
      }

    } catch (error) {
      console.error(`❌ Error on tray ${i + 1}:`, error);
      // Continue with next tray
    }
  }

  console.log('');
  console.log('✅ ========================================');
  console.log(`✅ EXTRACTION COMPLETE!`);
  console.log(`✅ Extracted ${allTraysWithInstruments.length} trays with instruments`);
  console.log('✅ ========================================');
  console.log('');

  // Statistics
  let withPhysicalRef = allTraysWithInstruments.filter(t => t.physicalRef).length;
  let totalInstruments = allTraysWithInstruments.reduce((sum, t) => sum + t.instruments.length, 0);

  console.log(`📊 Statistics:`);
  console.log(`   - Trays with physical ref codes: ${withPhysicalRef}/${allTraysWithInstruments.length}`);
  console.log(`   - Total items extracted: ${totalInstruments}`);
  console.log('');

  // Copy to clipboard
  copy(JSON.stringify(allTraysWithInstruments, null, 2));

  // Also save to localStorage as backup
  localStorage.setItem('synergy_extraction_final', JSON.stringify(allTraysWithInstruments));

  alert(`✅ SUCCESS!\n\nExtracted ${allTraysWithInstruments.length} trays with full details!\n\n${withPhysicalRef} trays have physical reference codes (ZE####)\n${totalInstruments} total items\n\nData copied to clipboard and saved to browser storage.`);

  return allTraysWithInstruments;
}

// Add function to retrieve if interrupted
window.getSavedExtraction = function() {
  let backup = localStorage.getItem('synergy_extraction_backup');
  let final = localStorage.getItem('synergy_extraction_final');
  let data = JSON.parse(final || backup || '[]');

  console.log(`Retrieved ${data.length} trays from browser storage`);
  copy(JSON.stringify(data, null, 2));
  console.log('Copied to clipboard!');

  return data;
};

// Add function to export as CSV
window.exportAsCSV = function() {
  let data = getSavedExtraction();

  let csv = 'Physical Ref,Tray Name,Type,Location,Status,Instrument Count\n';
  data.forEach(tray => {
    let instrumentCount = tray.instruments.filter(i => i.category === 'Instruments').length;
    csv += `"${tray.physicalRef || ''}","${tray.name}","${tray.type}","${tray.deliveryPoint}","${tray.status}",${instrumentCount}\n`;
  });

  copy(csv);
  console.log('CSV copied to clipboard!');
  return csv;
};

console.log('');
console.log('🔧 ====================================');
console.log('📋 SYNERGY TRAK EXTRACTION TOOL');
console.log('🔧 ====================================');
console.log('');
console.log('⚠️  IMPORTANT: First set "Results per page" to MAXIMUM');
console.log('');
console.log('Commands:');
console.log('  extractAllTraysWithDetails()  - Start extraction');
console.log('  getSavedExtraction()         - Retrieve saved data');
console.log('  exportAsCSV()                - Export as CSV');
console.log('');
