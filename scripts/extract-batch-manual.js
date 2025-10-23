if (typeof allTrays === 'undefined') {
  allTrays = [];
  console.log('Created new allTrays array');
}

let currentBatch = [];
document.querySelectorAll('table tbody tr').forEach(row => {
  let cells = row.querySelectorAll('td');
  if (cells.length < 8) return;
  let name = cells[2]?.innerText?.trim() || '';
  let match = name.match(/\(([A-Z]{2}\d{4})\)/);
  currentBatch.push({
    name: name,
    physicalRef: match ? match[1] : null,
    deliveryPoint: cells[4]?.innerText?.trim(),
    status: cells[6]?.innerText?.trim(),
    facility: cells[7]?.innerText?.trim()
  });
});

allTrays = allTrays.concat(currentBatch);
console.log('Batch:', currentBatch.length, 'trays | Total:', allTrays.length, 'trays');
console.log('Click NEXT, then press UP arrow + ENTER to continue');

if (allTrays.length >= 1000) {
  console.log('');
  console.log('YOU HAVE 1000+ TRAYS!');
  console.log('Run this to get your data:');
  console.log('console.log(JSON.stringify(allTrays, null, 2))');
}
