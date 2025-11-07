const XLSX = require('xlsx');
const fs = require('fs');

console.log('🎯 FINAL INTEGRATION - Last 3 Publications!');
console.log('═══════════════════════════════════════════════════\n');

const wb = XLSX.readFile('IITA climate publications - COMPLETE.xlsx');
const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

console.log(`Loaded ${data.length} publications from Excel\n`);

// Read final 3 data
const finalData = JSON.parse(fs.readFileSync('final_3_publications.json', 'utf8'));
const pubs = finalData.publications;

let updatedCount = 0;
let skippedCount = 0;

// Process each publication
pubs.forEach(pub => {
  if (pub.rowNumber === 27) {
    // Skip Row 27 - behind paywall
    console.log(`  ⊘ Skipped [Row 27] - Behind paywall, no DOI/abstract accessible`);
    skippedCount++;
  } else if (pub.rowNumber === 22) {
    // Update Row 22 - Savala/Engoke publication
    const index = data.findIndex(r => r['#'] === 22);
    if (index >= 0) {
      data[index].DOI = pub.actual_publication_found.doi;
      data[index].Abstract = pub.abstract;
      data[index].Keywords = pub.keywords.join(', ');
      updatedCount++;
      console.log(`  ✅ Updated [Row 22] - Savala et al. 2021`);
      console.log(`     DOI: ${pub.actual_publication_found.doi}`);
    }
  } else if (pub.rowNumber === 'undefined') {
    // Find Mukasa 2025 by title match
    const index = data.findIndex(r =>
      r.TITLE && r.TITLE.toLowerCase().includes('stepwise') &&
      r.YEAR === 2025
    );
    if (index >= 0) {
      data[index].DOI = pub.doi;
      data[index].Abstract = pub.abstract;
      data[index].Keywords = pub.keywords.join(', ');
      updatedCount++;
      console.log(`  ✅ Updated [Row ${data[index]['#']}] - Mukasa et al. 2025`);
      console.log(`     DOI: ${pub.doi}`);
    }
  }
});

// Count final status
const complete = data.filter(r => r.DOI && r.Abstract && r.Keywords);
const completionRate = (complete.length / data.length * 100).toFixed(1);

console.log('\n═══════════════════════════════════════════════════');
console.log('📊 FINAL INTEGRATION SUMMARY');
console.log('═══════════════════════════════════════════════════');
console.log(`Newly updated: ${updatedCount}`);
console.log(`Skipped (paywall): ${skippedCount}`);
console.log(`\n🎊 FINAL COMPLETION STATUS:`);
console.log(`Complete: ${complete.length}/${data.length} (${completionRate}%)`);
console.log(`Incomplete: ${data.length - complete.length}`);

// Save final Excel
console.log('\n💾 Saving final Excel file...');
const newWb = XLSX.utils.book_new();
const newWs = XLSX.utils.json_to_sheet(data);
XLSX.utils.book_append_sheet(newWb, newWs, 'Publications');

const outputFile = 'IITA climate publications - COMPLETE.xlsx';
XLSX.writeFile(newWb, outputFile);
console.log(`✅ Saved: ${outputFile}`);

console.log(`\n${'🎊'.repeat(25)}`);
console.log(`\n🏆 FINAL STATUS`);
console.log(`\nProgress: ${'█'.repeat(Math.floor(complete.length/154*50))}${'░'.repeat(50-Math.floor(complete.length/154*50))} ${completionRate}%`);
console.log(`\n📈 COMPLETE SESSION JOURNEY:`);
console.log(`   • Started:      52 complete (33.8%)`);
console.log(`   • Final:        ${complete.length} complete (${completionRate}%)`);
console.log(`   • Total Added:  ${complete.length - 52} publications`);
console.log(`   • Increase:     +${(parseFloat(completionRate) - 33.8).toFixed(1)} percentage points`);
console.log(`   • Remaining:    ${data.length - complete.length} (behind paywall)`);
console.log(`\n${'🎊'.repeat(25)}\n`);
