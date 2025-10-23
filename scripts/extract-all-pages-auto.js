// =========================================================
// SYNERGY TRAK - EXTRACT ALL PAGES AUTOMATICALLY
// This will automatically click through all pages
// =========================================================

console.log('🚀 Starting AUTOMATIC extraction of ALL pages...');
console.log('⏳ This will take some time. DO NOT close the browser!');
console.log('');

let allTrays = [];
let currentPage = 1;

// Extract physical reference code
function extractPhysicalRef(name) {
  let match = name.match(/\(([A-Z]{2}\d{4})\)/);
  return match ? match[1] : null;
}

// Extract visible trays from current page
function extractCurrentPage() {
  let trays = [];
  let rows = document.querySelectorAll('table tbody tr');

  rows.forEach(row => {
    let cells = row.querySelectorAll('td');
    if (cells.length < 8) return;

    let rawName = cells[2]?.innerText?.trim() || '';
    trays.push({
      instanceId: cells[0]?.innerText?.trim(),
      trayRef: cells[1]?.innerText?.trim(),
      name: rawName,
      physicalRef: extractPhysicalRef(rawName),
      type: cells[3]?.innerText?.trim(),
      deliveryPoint: cells[4]?.innerText?.trim(),
      turnaroundId: cells[5]?.innerText?.trim(),
      status: cells[6]?.innerText?.trim(),
      facility: cells[7]?.innerText?.trim()
    });
  });

  return trays;
}

// Find and click the Next button
function clickNextPage() {
  // Try multiple selectors for the Next button
  let nextButton =
    document.querySelector('button[aria-label="Next page"]') ||
    document.querySelector('button:has(span:contains("Next"))') ||
    document.querySelector('a[aria-label="Next page"]') ||
    document.querySelector('.pagination button:last-child') ||
    document.querySelector('[class*="next"]') ||
    Array.from(document.querySelectorAll('button')).find(btn =>
      btn.innerText.toLowerCase().includes('next') ||
      btn.innerText.includes('›') ||
      btn.innerText.includes('→')
    );

  if (nextButton && !nextButton.disabled) {
    nextButton.click();
    return true;
  }
  return false;
}

// Main extraction loop
async function extractAllPages() {
  let totalPages = 109; // 10,865 trays ÷ 100 per page

  for (let page = 1; page <= totalPages; page++) {
    // Extract current page
    let pageTrays = extractCurrentPage();

    if (pageTrays.length === 0) {
      console.log('❌ No more trays found. Stopping.');
      break;
    }

    allTrays = allTrays.concat(pageTrays);
    console.log(`✅ Page ${page}/${totalPages} - Extracted ${pageTrays.length} trays (Total: ${allTrays.length})`);

    // Save progress every 10 pages
    if (page % 10 === 0) {
      localStorage.setItem('synergy_backup', JSON.stringify(allTrays));
      console.log(`💾 Progress saved: ${allTrays.length} trays`);
    }

    // Stop if we've processed all pages
    if (page >= totalPages) break;

    // Click next page
    let hasNext = clickNextPage();
    if (!hasNext) {
      console.log('⚠️ No next button found. Stopping.');
      break;
    }

    // Wait for page to load (adjust timing if needed)
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Final save
  localStorage.setItem('synergy_final', JSON.stringify(allTrays));
  copy(JSON.stringify(allTrays, null, 2));

  console.log('');
  console.log('✅ ========================================');
  console.log(`✅ EXTRACTION COMPLETE!`);
  console.log(`✅ Total trays extracted: ${allTrays.length}`);
  console.log('✅ ========================================');
  console.log('');
  console.log('📋 Data copied to clipboard!');
  console.log('💾 Also saved in browser storage (in case clipboard fails)');
  console.log('');
  console.log('To retrieve from storage if needed:');
  console.log('  let data = JSON.parse(localStorage.getItem("synergy_final"));');
  console.log('  copy(JSON.stringify(data, null, 2));');

  alert(`✅ SUCCESS!\n\nExtracted ${allTrays.length} trays!\n\nData copied to clipboard and saved to browser storage.\n\nYou can now import to TOM.`);

  return allTrays;
}

// Add function to retrieve saved data
window.getSavedTrays = function() {
  let data = JSON.parse(localStorage.getItem('synergy_final') || localStorage.getItem('synergy_backup') || '[]');
  if (data.length > 0) {
    copy(JSON.stringify(data, null, 2));
    console.log(`✅ Retrieved ${data.length} trays from storage and copied to clipboard!`);
  } else {
    console.log('❌ No saved data found');
  }
  return data;
};

// Start extraction
console.log('⚠️ IMPORTANT: Make sure "Results per page" is set to 100!');
console.log('');
console.log('Starting in 3 seconds...');
setTimeout(() => {
  console.log('🚀 GO!');
  extractAllPages();
}, 3000);
