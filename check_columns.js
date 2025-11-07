const XLSX = require('xlsx');

// Read the Excel file
const workbook = XLSX.readFile('IITA climate publications - FINAL.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('Column names:');
if (data.length > 0) {
    console.log(Object.keys(data[0]));
    console.log('\nFirst publication sample:');
    console.log(JSON.stringify(data[0], null, 2));
}
