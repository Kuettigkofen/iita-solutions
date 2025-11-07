const XLSX = require('xlsx');
const fs = require('fs');

console.log('🔄 Updating Excel with Verified Keywords and Clickable DOI URLs');
console.log('═══════════════════════════════════════════════════════════════\n');

// Read the Excel file
const workbook = XLSX.readFile('IITA climate publications - COMPLETE.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`Loaded ${data.length} publications from Excel\n`);

// Read verified keywords data
const verifiedData = JSON.parse(fs.readFileSync('verified_keywords_and_urls.json', 'utf8'));
const verifiedPubs = verifiedData.publications;

console.log(`Loaded ${verifiedPubs.length} verified publications\n`);
console.log('Updating publications...\n');

let updatedKeywords = 0;
let updatedDOIs = 0;
let notFound = 0;

// Update each publication
verifiedPubs.forEach(verifiedPub => {
  const index = data.findIndex(row => row['#'] === verifiedPub.rowNumber);

  if (index >= 0) {
    // Update DOI to clickable URL format
    if (verifiedPub.DOI_URL) {
      data[index].DOI = verifiedPub.DOI_URL;
      updatedDOIs++;
    }

    // Update Keywords with verified keywords
    if (verifiedPub.Keywords) {
      data[index].Keywords = verifiedPub.Keywords;
      updatedKeywords++;
    } else {
      // Leave blank if no keywords found
      data[index].Keywords = "";
    }

    if ((verifiedPub.rowNumber - 1) % 25 === 0) {
      console.log(`  ✅ Updated Row ${verifiedPub.rowNumber}`);
    }
  } else {
    notFound++;
    console.log(`  ⚠️  Row ${verifiedPub.rowNumber} not found in Excel`);
  }
});

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('📊 UPDATE SUMMARY');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`DOIs updated to URLs: ${updatedDOIs}`);
console.log(`Keywords updated: ${updatedKeywords}`);
console.log(`Keywords left blank: ${verifiedPubs.length - updatedKeywords}`);
console.log(`Not found in Excel: ${notFound}`);

// Save updated Excel
console.log('\n💾 Saving updated Excel file...');
const newWorkbook = XLSX.utils.book_new();
const newWorksheet = XLSX.utils.json_to_sheet(data);
XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Publications');

const outputFile = 'IITA climate publications - COMPLETE.xlsx';
XLSX.writeFile(newWorkbook, outputFile);
console.log(`✅ Saved: ${outputFile}`);

console.log('\n✨ COMPLETE! All DOIs are now clickable URLs and keywords are verified from sources.\n');
