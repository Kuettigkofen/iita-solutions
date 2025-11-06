const XLSX = require('xlsx');

// Read the Excel file
const workbook = XLSX.readFile('/home/user/iita-solutions/IITA climate publications.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert to JSON to inspect structure
const data = XLSX.utils.sheet_to_json(sheet);

console.log('Total rows:', data.length);
console.log('\nColumn headers:', Object.keys(data[0]));
console.log('\nFirst 3 rows sample:');
data.slice(0, 3).forEach((row, idx) => {
  console.log(`\n--- Row ${idx + 1} ---`);
  console.log('Title:', row.TITLE || row.Title || row.title);
  console.log('Authors:', row.AUTHORS || row.Authors || row.authors);
  console.log('Year:', row.YEAR || row.Year || row.year);
  console.log('Journal:', row.JOURNAL || row.Journal || row.journal);
});
