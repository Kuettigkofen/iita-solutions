const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
console.log('Reading Excel file...');
const workbook = XLSX.readFile('IITA climate publications - UPDATED.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(worksheet);

// Find incomplete publications
const incomplete = data.filter(r => !r.DOI || !r.Abstract || !r.Keywords);

console.log(`\n📊 STATUS CHECK`);
console.log(`═══════════════════════════════════════`);
console.log(`Total: ${data.length}`);
console.log(`Complete: ${data.length - incomplete.length}`);
console.log(`Incomplete: ${incomplete.length}`);

console.log(`\n📋 INCOMPLETE PUBLICATIONS (${incomplete.length}):\n`);

incomplete.forEach((pub, index) => {
  const missing = [];
  if (!pub.DOI) missing.push('DOI');
  if (!pub.Abstract) missing.push('Abstract');
  if (!pub.Keywords) missing.push('Keywords');

  console.log(`${index + 1}. [Row ${pub['#']}] ${pub.TITLE?.substring(0, 70)}...`);
  console.log(`   Author: ${pub.AUTHORS?.split(',')[0] || 'Unknown'}`);
  console.log(`   Year: ${pub.YEAR}`);
  console.log(`   Missing: ${missing.join(', ')}`);
  console.log('');
});

// Save to JSON for processing
const incompleteData = incomplete.map(pub => ({
  rowNumber: pub['#'],
  title: pub.TITLE,
  authors: pub.AUTHORS,
  year: pub.YEAR,
  journal: pub.JOURNAL,
  hasDOI: !!pub.DOI,
  hasAbstract: !!pub.Abstract,
  hasKeywords: !!pub.Keywords
}));

fs.writeFileSync('incomplete_to_process.json', JSON.stringify(incompleteData, null, 2));
console.log(`\n✓ Saved incomplete list to: incomplete_to_process.json`);
