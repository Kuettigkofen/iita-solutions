const XLSX = require('xlsx');
const fs = require('fs');

// Read the existing Excel file
console.log('Reading existing Excel file...');
const workbook = XLSX.readFile('IITA climate publications - UPDATED.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`Loaded ${data.length} publications from Excel`);

// Read batch 5 data
console.log('\nReading batch5_new_completions.json...');
const newData = JSON.parse(fs.readFileSync('batch5_new_completions.json', 'utf8'));
console.log(`Loaded ${newData.length} new publications`);

// Match and update using row numbers
let updatedCount = 0;
let skipped = 0;

newData.forEach(newPub => {
  // Find by row number
  const index = data.findIndex(row => row['#'] === newPub.rowNumber);

  if (index >= 0) {
    const existingPub = data[index];

    // Skip if no DOI found
    if (!newPub.DOI || newPub.DOI === "" || newPub.DOI === "Not available") {
      skipped++;
      console.log(`  ⊘ Skipped [Row ${newPub.rowNumber}]: No DOI`);
    } else {
      // Update the publication
      data[index].DOI = newPub.DOI;
      data[index].Abstract = newPub.Abstract || "";
      data[index].Keywords = newPub.Keywords || "";
      updatedCount++;
      console.log(`  ✓ Updated [Row ${newPub.rowNumber}]`);
      console.log(`    ${newPub.status}`);
    }
  }
});

// Count current completions
const complete = data.filter(r => r.DOI && r.Abstract && r.Keywords);

console.log('\n=== INTEGRATION SUMMARY ===');
console.log(`Newly updated: ${updatedCount}`);
console.log(`Skipped (no DOI): ${skipped}`);
console.log(`\nTotal complete (all fields): ${complete.length}/${data.length} (${(complete.length/data.length*100).toFixed(1)}%)`);
console.log(`Remaining: ${data.length - complete.length}`);

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
console.log(`Incomplete:             ${data.length - complete.length} (${((data.length - complete.length)/data.length*100).toFixed(1)}%)`);
console.log(`\nProgress: ${'█'.repeat(Math.floor(complete.length/154*50))}${'░'.repeat(50-Math.floor(complete.length/154*50))} ${(complete.length/154*100).toFixed(1)}%`);
console.log(`\n🎉 SESSION SUMMARY:`);
console.log(`• Started:  52 complete (33.8%)`);
console.log(`• Now:      ${complete.length} complete (${(complete.length/154*100).toFixed(1)}%)`);
console.log(`• Added:    ${complete.length - 52} publications`);
console.log(`• Increase: +${(complete.length/154*100 - 33.8).toFixed(1)} percentage points`);
