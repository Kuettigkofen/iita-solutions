const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('IITA climate publications - FINAL.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`Total publications: ${data.length}`);

// Identify incomplete publications
const incomplete = data.filter(pub => {
    const missingDOI = !pub.DOI || pub.DOI.trim() === '';
    const missingAbstract = !pub.Abstract || pub.Abstract.trim() === '';
    const missingKeywords = !pub.Keywords || pub.Keywords.trim() === '';
    return missingDOI || missingAbstract || missingKeywords;
});

console.log(`Incomplete publications: ${incomplete.length}`);
console.log(`Complete publications: ${data.length - incomplete.length}`);

// Show first 10 incomplete for reference
console.log('\nFirst 10 incomplete publications:');
incomplete.slice(0, 10).forEach((pub, idx) => {
    console.log(`\n${idx + 1}. ${pub.Title}`);
    console.log(`   Year: ${pub.Year}`);
    console.log(`   Authors: ${pub.Authors?.substring(0, 100)}...`);
    console.log(`   Missing: ${!pub.DOI ? 'DOI ' : ''}${!pub.Abstract ? 'Abstract ' : ''}${!pub.Keywords ? 'Keywords' : ''}`);
});

// Export incomplete to JSON for processing
fs.writeFileSync('incomplete_publications.json', JSON.stringify(incomplete, null, 2));
console.log(`\nExported ${incomplete.length} incomplete publications to incomplete_publications.json`);

// Create a CSV of incomplete publications for easier viewing
const incompleteCSV = incomplete.map(pub => ({
    Title: pub.Title,
    Year: pub.Year,
    Authors: pub.Authors?.split(';')[0] || 'Unknown', // First author
    'Missing Fields': `${!pub.DOI ? 'DOI ' : ''}${!pub.Abstract ? 'Abstract ' : ''}${!pub.Keywords ? 'Keywords' : ''}`.trim()
}));

const ws = XLSX.utils.json_to_sheet(incompleteCSV);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Incomplete');
XLSX.writeFile(wb, 'incomplete_publications.csv');
console.log('Exported incomplete publications to incomplete_publications.csv');
