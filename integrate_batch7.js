const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
console.log('🎯 INTEGRATING BATCH 7 - The Final Push!');
console.log('═══════════════════════════════════════════════════\n');

const workbook = XLSX.readFile('IITA climate publications - COMPLETE.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`Loaded ${data.length} publications from Excel`);

// Read batch 7 data
console.log('\nReading batch7_correct_completions.json...');
const batchData = JSON.parse(fs.readFileSync('batch7_correct_completions.json', 'utf8'));
const newData = batchData.publications;
console.log(`Loaded ${newData.length} publications with correct row numbers\n`);

// Match and update using row numbers
let updatedCount = 0;
let alreadyComplete = 0;

newData.forEach(newPub => {
  const index = data.findIndex(row => row['#'] === newPub.row_number);

  if (index >= 0) {
    const existingPub = data[index];

    // Check if already complete
    if (existingPub.DOI && existingPub.Abstract && existingPub.Keywords) {
      alreadyComplete++;
      console.log(`  ✓ Already complete [Row ${newPub.row_number}]`);
    } else {
      // Update the publication
      data[index].DOI = newPub.doi;
      data[index].Abstract = newPub.abstract;
      data[index].Keywords = newPub.keywords;
      updatedCount++;
      console.log(`  ✅ Updated [Row ${newPub.row_number}]`);
    }
  }
});

// Count final completions
const complete = data.filter(r => r.DOI && r.Abstract && r.Keywords);
const completionRate = (complete.length / data.length * 100).toFixed(1);

console.log('\n═══════════════════════════════════════════════════');
console.log('📊 BATCH 7 INTEGRATION SUMMARY');
console.log('═══════════════════════════════════════════════════');
console.log(`Newly updated: ${updatedCount}`);
console.log(`Already complete: ${alreadyComplete}`);
console.log(`\n🎉 UPDATED COMPLETION STATUS:`);
console.log(`Complete: ${complete.length}/${data.length} (${completionRate}%)`);
console.log(`Remaining: ${data.length - complete.length}`);

// Save updated Excel
console.log('\n💾 Saving updated Excel file...');
const newWorkbook = XLSX.utils.book_new();
const newWorksheet = XLSX.utils.json_to_sheet(data);
XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Publications');

const outputFile = 'IITA climate publications - COMPLETE.xlsx';
XLSX.writeFile(newWorkbook, outputFile);
console.log(`✅ Saved: ${outputFile}`);

console.log(`\n${'█'.repeat(50)}`);
console.log(`\n📈 PROGRESS:`);
console.log(`${'█'.repeat(Math.floor(complete.length/154*50))}${'░'.repeat(50-Math.floor(complete.length/154*50))} ${completionRate}%`);
console.log(`\n📊 SESSION JOURNEY:`);
console.log(`   • Started:   52 complete (33.8%)`);
console.log(`   • Current:   ${complete.length} complete (${completionRate}%)`);
console.log(`   • Added:     ${complete.length - 52} publications`);
console.log(`   • Remaining: ${data.length - complete.length} publications`);
console.log(`\n${'█'.repeat(50)}\n`);
