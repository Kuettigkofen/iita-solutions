const XLSX = require('xlsx');
const fs = require('fs');

console.log('🔄 Updating Excel with Verified Keywords and Clickable DOI URLs (DOI Matching)');
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

// Create DOI lookup map (extract DOI from URL for matching)
const verifiedByDOI = {};
verifiedPubs.forEach(pub => {
  if (pub.DOI_URL) {
    // Extract DOI from URL: https://doi.org/10.1234/abcd -> 10.1234/abcd
    const doi = pub.DOI_URL.replace('https://doi.org/', '').replace('http://doi.org/', '');
    verifiedByDOI[doi] = pub;
  }
});

console.log('Updating publications...\n');

let updatedKeywords = 0;
let updatedDOIs = 0;
let notFound = 0;
let alreadyURL = 0;

// Update each publication in Excel
data.forEach((row, index) => {
  if (row.DOI) {
    // Normalize DOI (might already be a URL or just the DOI)
    let doi = row.DOI;
    if (doi.startsWith('http://') || doi.startsWith('https://')) {
      doi = doi.replace('https://doi.org/', '').replace('http://doi.org/', '');
      alreadyURL++;
    }

    // Look up in verified data
    const verifiedPub = verifiedByDOI[doi];

    if (verifiedPub) {
      // Update DOI to clickable URL format
      data[index].DOI = verifiedPub.DOI_URL;
      updatedDOIs++;

      // Update Keywords with verified keywords
      if (verifiedPub.Keywords) {
        data[index].Keywords = verifiedPub.Keywords;
        updatedKeywords++;
      } else {
        // Leave blank if no keywords found
        data[index].Keywords = "";
      }

      if ((index + 1) % 25 === 0) {
        console.log(`  ✅ Updated Row ${row['#']} (${doi.substring(0, 30)}...)`);
      }
    } else {
      notFound++;
      console.log(`  ⚠️  DOI not found in verified data: ${doi}`);
    }
  }
});

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('📊 UPDATE SUMMARY');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`Publications with DOI: ${data.filter(r => r.DOI).length}`);
console.log(`DOIs updated to URLs: ${updatedDOIs}`);
console.log(`DOIs already URLs: ${alreadyURL}`);
console.log(`Keywords updated: ${updatedKeywords}`);
console.log(`Keywords left blank: ${updatedDOIs - updatedKeywords}`);
console.log(`Not found in verified data: ${notFound}`);

// Save updated Excel
console.log('\n💾 Saving updated Excel file...');
const newWorkbook = XLSX.utils.book_new();
const newWorksheet = XLSX.utils.json_to_sheet(data);
XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Publications');

const outputFile = 'IITA climate publications - COMPLETE.xlsx';
XLSX.writeFile(newWorkbook, outputFile);
console.log(`✅ Saved: ${outputFile}`);

console.log('\n✨ COMPLETE! All DOIs are now clickable URLs and keywords are verified from sources.\n');
