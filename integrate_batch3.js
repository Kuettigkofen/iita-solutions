const XLSX = require('xlsx');
const fs = require('fs');

// Read the existing Excel file
console.log('Reading existing Excel file...');
const workbook = XLSX.readFile('IITA climate publications - UPDATED.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`Loaded ${data.length} publications from Excel`);

// Read the new batch data
console.log('\nReading batch_new_population_results.json...');
const newData = JSON.parse(fs.readFileSync('batch_new_population_results.json', 'utf8'));
console.log(`Loaded ${newData.length} new publications`);

// Match and update using row numbers
let updatedCount = 0;
let alreadyComplete = 0;
let notFound = 0;

newData.forEach(newPub => {
  // Find by row number (most accurate)
  const matchingRow = data.find(row => row['#'] === newPub.rowNumber);

  if (matchingRow) {
    // Check if already complete
    if (matchingRow.DOI && matchingRow.Abstract && matchingRow.Keywords) {
      alreadyComplete++;
      console.log(`  ✓ Already complete [Row ${newPub.rowNumber}]: ${matchingRow.TITLE.substring(0, 60)}...`);
    } else {
      // Update the publication
      const index = data.findIndex(row => row['#'] === newPub.rowNumber);
      data[index].DOI = newPub.DOI;
      data[index].Abstract = newPub.Abstract;
      data[index].Keywords = newPub.Keywords;
      updatedCount++;
      console.log(`  ✓ Updated [Row ${newPub.rowNumber}]: ${matchingRow.TITLE.substring(0, 60)}...`);
      console.log(`    Status: ${newPub.status}`);
      console.log(`    DOI: ${newPub.DOI}`);
    }
  } else {
    notFound++;
    console.log(`  ✗ Row ${newPub.rowNumber} not found: ${newPub.title.substring(0, 60)}...`);
  }
});

// Count current completions
const complete = data.filter(r => r.DOI && r.Abstract && r.Keywords);
const partialComplete = data.filter(r => r.DOI && r.Abstract && !r.Keywords);

console.log('\n=== INTEGRATION SUMMARY ===');
console.log(`Newly updated: ${updatedCount}`);
console.log(`Already complete: ${alreadyComplete}`);
console.log(`Not found/matched: ${notFound}`);
console.log(`\nTotal complete (DOI + Abstract + Keywords): ${complete.length}/${data.length} (${(complete.length/data.length*100).toFixed(1)}%)`);
console.log(`Partial complete (DOI + Abstract, missing Keywords): ${partialComplete.length}`);
console.log(`Remaining incomplete: ${data.length - complete.length - partialComplete.length}`);

// Save updated Excel
console.log('\nSaving updated Excel file...');
const newWorkbook = XLSX.utils.book_new();
const newWorksheet = XLSX.utils.json_to_sheet(data);
XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Publications');

const outputFile = 'IITA climate publications - UPDATED.xlsx';
XLSX.writeFile(newWorkbook, outputFile);
console.log(`✓ Saved: ${outputFile}`);

console.log(`\n📊 FINAL STATUS`);
console.log(`═══════════════════════════════════════════════════`);
console.log(`Total publications:     ${data.length}`);
console.log(`Complete (all fields):  ${complete.length} (${(complete.length/data.length*100).toFixed(1)}%)`);
console.log(`Partial (no keywords):  ${partialComplete.length} (${(partialComplete.length/data.length*100).toFixed(1)}%)`);
console.log(`Incomplete:             ${data.length - complete.length - partialComplete.length} (${((data.length - complete.length - partialComplete.length)/data.length*100).toFixed(1)}%)`);
console.log(`\nProgress: ${'█'.repeat(Math.floor(complete.length/154*50))}${'░'.repeat(50-Math.floor(complete.length/154*50))} ${(complete.length/154*100).toFixed(1)}%`);
