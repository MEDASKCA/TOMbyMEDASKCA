console.log('Debugging instrument extraction...');

// Click first tray
let firstRow = document.querySelector('table tbody tr');
if (!firstRow) {
  console.log('ERROR: No rows found');
} else {
  let link = firstRow.querySelector('a');
  if (!link) {
    console.log('ERROR: No link found');
  } else {
    console.log('Clicking:', link.innerText);
    link.click();

    // Wait and then analyze
    setTimeout(() => {
      console.log('');
      console.log('=== ANALYZING PAGE ===');

      // Count all tables
      let tables = document.querySelectorAll('table');
      console.log('Total tables:', tables.length);

      // Analyze each table
      tables.forEach((table, idx) => {
        console.log('');
        console.log('--- TABLE', idx, '---');

        let headers = table.querySelectorAll('th');
        if (headers.length > 0) {
          let headerTexts = [];
          headers.forEach(h => headerTexts.push(h.innerText.trim()));
          console.log('Headers:', headerTexts.join(' | '));
        }

        let rows = table.querySelectorAll('tbody tr');
        console.log('Rows:', rows.length);

        // Show first 3 rows
        for (let i = 0; i < Math.min(3, rows.length); i++) {
          let cells = rows[i].querySelectorAll('td');
          let cellData = [];
          cells.forEach(c => cellData.push(c.innerText.trim()));
          console.log('  Row', i + ':', cellData.join(' | '));
        }
      });

      console.log('');
      console.log('Done! Analyze the output above.');
      console.log('Go back when ready: window.history.back()');

    }, 2000);
  }
}
