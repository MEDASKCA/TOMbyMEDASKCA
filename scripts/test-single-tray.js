console.log('Testing extraction on first tray...');

// Click first tray
let firstRow = document.querySelector('table tbody tr');
let link = firstRow.querySelector('a');

console.log('Clicking:', link.innerText);
link.click();

setTimeout(() => {
  console.log('');
  console.log('=== EXTRACTING INSTRUMENTS ===');

  // Find all tables
  let tables = document.querySelectorAll('table');
  console.log('Total tables found:', tables.length);

  // Look for table with "Item ID" header
  let contentsTable = null;

  for (let i = 0; i < tables.length; i++) {
    let table = tables[i];
    let headers = table.querySelectorAll('th');
    let headerText = Array.from(headers).map(h => h.innerText.trim().toLowerCase()).join(' ');

    console.log('Table', i, 'headers:', headerText);

    if (headerText.includes('item id') && headerText.includes('item') && headerText.includes('quantity')) {
      console.log('  -> FOUND CONTENTS TABLE!');
      contentsTable = table;
      break;
    }
  }

  if (!contentsTable) {
    console.log('ERROR: Could not find contents table');
    return;
  }

  console.log('');
  console.log('Extracting rows...');

  let rows = contentsTable.querySelectorAll('tbody tr');
  console.log('Total rows:', rows.length);

  let instruments = [];

  rows.forEach((row, idx) => {
    let cells = row.querySelectorAll('td');

    if (cells.length >= 4) {
      let itemId = cells[0]?.innerText?.trim() || '';
      let itemName = cells[1]?.innerText?.trim() || '';
      let itemType = cells[2]?.innerText?.trim() || '';
      let quantity = cells[3]?.innerText?.trim() || '';

      console.log('Row', idx, ':', itemId, '|', itemName.substring(0, 30), '|', itemType, '|', quantity);

      // Check if matches pattern
      let isValid = itemId && itemName && itemId.match(/^[A-Z0-9]+$/i) && itemId.length >= 4;
      console.log('  Valid?', isValid);

      if (isValid) {
        instruments.push({
          itemId: itemId,
          name: itemName,
          type: itemType,
          quantity: parseInt(quantity) || 1
        });
      }
    }
  });

  console.log('');
  console.log('='.repeat(50));
  console.log('TOTAL INSTRUMENTS EXTRACTED:', instruments.length);
  console.log('='.repeat(50));
  console.log('');
  console.log('Sample (first 5):');
  instruments.slice(0, 5).forEach(inst => {
    console.log(' ', inst.itemId, '-', inst.name);
  });

  console.log('');
  console.log('Go back when ready: window.history.back()');

}, 2000);
