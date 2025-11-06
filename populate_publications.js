const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
console.log('Reading Excel file...');
const workbook = XLSX.readFile('/home/user/iita-solutions/IITA climate publications.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(sheet);
console.log(`Total publications: ${data.length}\n`);

// Add new columns
data.forEach(row => {
  row.DOI = '';
  row.Abstract = '';
  row.Keywords = '';
});

// Save the results with new columns (will be populated by external process)
function saveResults() {
  const newWorkbook = XLSX.utils.book_new();
  const newSheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Publications');
  XLSX.writeFile(newWorkbook, '/home/user/iita-solutions/IITA climate publications - POPULATED.xlsx');
}

// Export data for processing
fs.writeFileSync('/home/user/iita-solutions/publications_data.json', JSON.stringify(data, null, 2));
console.log('Exported publication data to publications_data.json');
console.log('Ready for processing...\n');

// Display first few entries for verification
console.log('Sample entries:');
data.slice(0, 3).forEach((pub, idx) => {
  console.log(`\n[${idx + 1}] ${pub.TITLE}`);
  console.log(`    Authors: ${pub.AUTHORS}`);
  console.log(`    Year: ${pub.YEAR}, Journal: ${pub.JOURNAL}`);
});

saveResults();
console.log('\n✓ Created template file: IITA climate publications - POPULATED.xlsx');
