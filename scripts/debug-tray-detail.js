console.log('DEBUG: Tray Detail Page Structure');
console.log('');

// First, let's click into the first tray
let firstRow = document.querySelector('table tbody tr');
if (firstRow) {
  let link = firstRow.querySelector('a');
  if (link) {
    console.log('Clicking first tray:', link.innerText);
    link.click();

    // Wait for page to load, then inspect
    setTimeout(() => {
      console.log('');
      console.log('=== PAGE CONTENT ===');

      // Look for all tables
      let tables = document.querySelectorAll('table');
      console.log('Total tables found:', tables.length);

      tables.forEach((table, i) => {
        console.log('');
        console.log('TABLE', i);
        let rows = table.querySelectorAll('tbody tr');
        console.log('  Rows:', rows.length);

        if (rows.length > 0 && rows.length < 50) {
          console.log('  Sample data:');
          rows.forEach((row, j) => {
            if (j < 5) {
              let cells = row.querySelectorAll('td');
              let cellData = [];
              cells.forEach(cell => cellData.push(cell.innerText.trim()));
              console.log('    Row', j, ':', cellData.join(' | '));
            }
          });
        }
      });

      // Look for headings
      console.log('');
      console.log('=== HEADINGS ===');
      let headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(h => {
        console.log(h.tagName + ':', h.innerText);
      });

      // Look for labels
      console.log('');
      console.log('=== LABELS/DIVS WITH TEXT ===');
      let labels = document.querySelectorAll('label, div.label, span.label');
      labels.forEach((label, i) => {
        if (i < 20 && label.innerText.trim() !== '') {
          console.log(label.innerText.trim());
        }
      });

      console.log('');
      console.log('Done! Now manually go back and analyze the output.');

    }, 2000);
  } else {
    console.log('ERROR: No link found in first row');
  }
} else {
  console.log('ERROR: No table rows found');
}
