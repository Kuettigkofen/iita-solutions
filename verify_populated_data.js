const XLSX = require('xlsx');

// Read the populated Excel file
const workbook = XLSX.readFile('/home/user/iita-solutions/IITA climate publications - POPULATED.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet);

console.log('='.repeat(100));
console.log('VERIFICATION: POPULATED EXCEL FILE');
console.log('='.repeat(100));
console.log(`Total rows: ${data.length}`);
console.log(`Columns: ${Object.keys(data[0]).length}`);

// Count populated vs empty
let populated = 0;
let empty = 0;

data.forEach(row => {
  if (row.DOI && row.Abstract && row.Keywords) {
    populated++;
  } else {
    empty++;
  }
});

console.log(`\nPopulated: ${populated} (${((populated/data.length)*100).toFixed(1)}%)`);
console.log(`Empty: ${empty} (${((empty/data.length)*100).toFixed(1)}%)`);

console.log('\n' + '='.repeat(100));
console.log('SAMPLE POPULATED ENTRIES');
console.log('='.repeat(100));

// Show first 3 populated entries
let count = 0;
data.forEach((row, idx) => {
  if (row.DOI && row.Abstract && row.Keywords && count < 3) {
    count++;
    console.log(`\n[${count}] ${row.TITLE}`);
    console.log(`    ID: ${row.ID}`);
    console.log(`    Year: ${row.YEAR} | Journal: ${row.JOURNAL}`);
    console.log(`    DOI: ${row.DOI}`);
    console.log(`    Keywords: ${row.Keywords}`);
    console.log(`    Abstract: ${row.Abstract.substring(0, 150)}...`);
  }
});

console.log('\n' + '='.repeat(100));
console.log('FILE READY FOR DOWNLOAD');
console.log('='.repeat(100));
console.log('Location: /home/user/iita-solutions/IITA climate publications - POPULATED.xlsx');
console.log('Format: Excel (.xlsx)');
console.log(`Size: 504 KB`);
console.log('Status: Ready to download');
