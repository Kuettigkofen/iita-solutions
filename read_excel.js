const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('/home/user/iita-solutions/IITA climate publications - COMPLETE.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet);

// Output as JSON for analysis
console.log(JSON.stringify(data, null, 2));

// Also save to a file
fs.writeFileSync('/home/user/iita-solutions/publications_data.json', JSON.stringify(data, null, 2));

console.error(`\n\nTotal publications: ${data.length}`);
const incomplete = data.filter(row => !row.DOI || !row.Abstract || !row.Keywords);
console.error(`Incomplete publications: ${incomplete.length}`);
const complete = data.filter(row => row.DOI && row.Abstract && row.Keywords);
console.error(`Complete publications: ${complete.length}`);
