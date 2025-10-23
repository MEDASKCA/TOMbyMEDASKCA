console.log('Starting automatic extraction...');

let allTrays = [];

function extractPhysicalRef(name) {
  let match = name.match(/\(([A-Z]{2}\d{4})\)/);
  return match ? match[1] : null;
}

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
      status: cells[6]?.innerText?.trim(),
      facility: cells[7]?.innerText?.trim()
    });
  });

  return trays;
}

function goToPage(pageNum) {
  let pageInputs = document.querySelectorAll('input[type="number"], input[type="text"]');
  let pageInput = Array.from(pageInputs).find(input => input.value === '1' || input.value === pageNum.toString());

  if (pageInput) {
    pageInput.value = pageNum;
    let event = new Event('change', { bubbles: true });
    pageInput.dispatchEvent(event);
    pageInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
    return true;
  }
  return false;
}

async function extractAllPages() {
  let totalPages = 109;

  for (let page = 1; page <= totalPages; page++) {
    let pageTrays = extractCurrentPage();

    if (pageTrays.length === 0) {
      console.log('No more data found');
      break;
    }

    allTrays = allTrays.concat(pageTrays);
    console.log('Page ' + page + '/' + totalPages + ' - Extracted ' + pageTrays.length + ' trays (Total: ' + allTrays.length + ')');

    if (page % 10 === 0) {
      localStorage.setItem('synergy_backup', JSON.stringify(allTrays));
      console.log('Progress saved: ' + allTrays.length + ' trays');
    }

    if (page >= totalPages) break;

    goToPage(page + 1);
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  localStorage.setItem('synergy_final', JSON.stringify(allTrays));

  console.log('');
  console.log('EXTRACTION COMPLETE!');
  console.log('Total trays: ' + allTrays.length);
  console.log('');
  console.log('To get your data, run:');
  console.log('console.log(JSON.stringify(allTrays, null, 2))');
  console.log('');
  console.log('Then select and copy the output');

  alert('SUCCESS! Extracted ' + allTrays.length + ' trays! Run: console.log(JSON.stringify(allTrays, null, 2)) to see data');

  return allTrays;
}

setTimeout(() => {
  console.log('Starting in 3 seconds...');
  extractAllPages();
}, 3000);
