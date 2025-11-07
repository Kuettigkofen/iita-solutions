const XLSX = require('xlsx');
const fs = require('fs');

// Read the existing Excel file
console.log('Reading existing Excel file...');
const workbook = XLSX.readFile('IITA climate publications - COMPLETE.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`Loaded ${data.length} publications from Excel`);

// Read the new collected data
console.log('\nReading collected publications data...');
const newData = JSON.parse(fs.readFileSync('collected_publications_data.json', 'utf8'));
console.log(`Loaded ${newData.length} new publications`);

// Match and update
let updatedCount = 0;
let alreadyComplete = 0;

newData.forEach(newPub => {
  // Find matching publication in Excel by title similarity and year
  const normalizeTitle = (str) => str.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const newTitleNorm = normalizeTitle(newPub.title);

  for (let i = 0; i < data.length; i++) {
    const existingPub = data[i];
    const existingTitleNorm = normalizeTitle(existingPub.TITLE || '');

    // Check if titles match (at least 80% similarity by word overlap)
    const newWords = new Set(newTitleNorm.split(/\s+/));
    const existingWords = new Set(existingTitleNorm.split(/\s+/));
    const intersection = new Set([...newWords].filter(x => existingWords.has(x)));
    const similarity = intersection.size / Math.max(newWords.size, existingWords.size);

    // Match if similarity is high and year matches
    if (similarity >= 0.75 && existingPub.YEAR === newPub.year) {
      // Check if already complete
      if (existingPub.DOI && existingPub.Abstract && existingPub.Keywords) {
        alreadyComplete++;
        console.log(`  ✓ Already complete: ${existingPub.TITLE.substring(0, 60)}...`);
        break;
      }

      // Update the publication
      data[i].DOI = newPub.doi;
      data[i].Abstract = newPub.abstract;
      data[i].Keywords = newPub.keywords;
      updatedCount++;
      console.log(`  ✓ Updated: ${existingPub.TITLE.substring(0, 60)}...`);
      console.log(`    DOI: ${newPub.doi}`);
      break;
    }
  }
});

// Count current completions
const complete = data.filter(r => r.DOI && r.Abstract && r.Keywords);

console.log('\n=== INTEGRATION SUMMARY ===');
console.log(`Newly updated: ${updatedCount}`);
console.log(`Already complete: ${alreadyComplete}`);
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
console.log(`\nTotal publications: ${data.length}`);
console.log(`Complete: ${complete.length} (${(complete.length/data.length*100).toFixed(1)}%)`);
console.log(`Incomplete: ${data.length - complete.length}`);
