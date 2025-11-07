const XLSX = require('xlsx');
const fs = require('fs');

// Read the existing Excel file
console.log('Reading existing Excel file...');
const workbook = XLSX.readFile('IITA climate publications - UPDATED.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`Loaded ${data.length} publications from Excel`);

// Read the new collected data
console.log('\nReading newly populated publications data...');
const newData = JSON.parse(fs.readFileSync('newly_populated_publications.json', 'utf8'));
console.log(`Loaded ${newData.length} new publications`);

// Match and update
let updatedCount = 0;
let alreadyComplete = 0;
let notFound = 0;

newData.forEach(newPub => {
  // Find matching publication in Excel by title similarity and year
  const normalizeTitle = (str) => str.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const newTitleNorm = normalizeTitle(newPub.title);

  let found = false;
  for (let i = 0; i < data.length; i++) {
    const existingPub = data[i];
    const existingTitleNorm = normalizeTitle(existingPub.TITLE || '');

    // Check if titles match (at least 75% similarity by word overlap)
    const newWords = new Set(newTitleNorm.split(/\s+/));
    const existingWords = new Set(existingTitleNorm.split(/\s+/));
    const intersection = new Set([...newWords].filter(x => existingWords.has(x)));
    const similarity = intersection.size / Math.max(newWords.size, existingWords.size);

    // Match if similarity is high (or use rowNumber if available)
    const matchByRow = newPub.rowNumber && existingPub['#'] === newPub.rowNumber;
    const matchByTitle = similarity >= 0.70;

    if (matchByRow || matchByTitle) {
      // Check if already complete
      if (existingPub.DOI && existingPub.Abstract && existingPub.Keywords) {
        alreadyComplete++;
        console.log(`  ✓ Already complete: ${existingPub.TITLE.substring(0, 60)}...`);
        found = true;
        break;
      }

      // Update the publication
      data[i].DOI = newPub.DOI;
      data[i].Abstract = newPub.Abstract;
      data[i].Keywords = newPub.Keywords;
      updatedCount++;
      console.log(`  ✓ Updated [Row ${existingPub['#']}]: ${existingPub.TITLE.substring(0, 60)}...`);
      console.log(`    DOI: ${newPub.DOI}`);
      found = true;
      break;
    }
  }

  if (!found) {
    notFound++;
    console.log(`  ✗ Not found: ${newPub.title.substring(0, 60)}...`);
  }
});

// Count current completions
const complete = data.filter(r => r.DOI && r.Abstract && r.Keywords);

console.log('\n=== INTEGRATION SUMMARY ===');
console.log(`Newly updated: ${updatedCount}`);
console.log(`Already complete: ${alreadyComplete}`);
console.log(`Not found/matched: ${notFound}`);
console.log(`Total complete now: ${complete.length}/${data.length} (${(complete.length/data.length*100).toFixed(1)}%)`);
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
console.log(`Total publications: ${data.length}`);
console.log(`Complete: ${complete.length} (${(complete.length/data.length*100).toFixed(1)}%)`);
console.log(`Incomplete: ${data.length - complete.length}`);
console.log(`Progress bar: ${'█'.repeat(Math.floor(complete.length/154*50))}${'░'.repeat(50-Math.floor(complete.length/154*50))} ${(complete.length/154*100).toFixed(1)}%`);
