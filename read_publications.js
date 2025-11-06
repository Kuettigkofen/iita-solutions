const XLSX = require('xlsx');

// Read the Excel file
const workbook = XLSX.readFile('IITA climate publications.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('Total publications:', data.length);
console.log('\nColumn names:', Object.keys(data[0] || {}));
console.log('\nFirst 3 rows:');
console.log(JSON.stringify(data.slice(0, 3), null, 2));

// Check which rows need data
let needsDOI = 0;
let needsAbstract = 0;
let needsKeywords = 0;

data.forEach(row => {
  if (!row.DOI) needsDOI++;
  if (!row.Abstract) needsAbstract++;
  if (!row.Keywords) needsKeywords++;
});

console.log('\n=== Data Status ===');
console.log('Rows needing DOI:', needsDOI);
console.log('Rows needing Abstract:', needsAbstract);
console.log('Rows needing Keywords:', needsKeywords);
