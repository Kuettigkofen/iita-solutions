const XLSX = require('xlsx');

// Read the Excel file
const workbook = XLSX.readFile('IITA climate publications - UPDATED.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Get the range
const range = XLSX.utils.decode_range(worksheet['!ref']);
console.log(`Sheet: ${sheetName}`);
console.log(`Range: ${worksheet['!ref']}`);
console.log(`Rows: ${range.e.r + 1}`);

// Get first row (headers)
console.log('\nColumn headers:');
for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    const cell = worksheet[cellAddress];
    if (cell && cell.v) {
        console.log(`  ${String.fromCharCode(65 + col)}: ${cell.v}`);
    }
}

// Get first data row
console.log('\nFirst data row (row 2):');
for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 1, c: col });
    const cell = worksheet[cellAddress];
    const headerCell = worksheet[XLSX.utils.encode_cell({ r: 0, c: col })];
    if (headerCell && headerCell.v) {
        const value = cell && cell.v ? String(cell.v).substring(0, 100) : '(empty)';
        console.log(`  ${headerCell.v}: ${value}`);
    }
}

// Convert to JSON and check
const data = XLSX.utils.sheet_to_json(worksheet);
console.log(`\nTotal rows parsed: ${data.length}`);

if (data.length > 0) {
    console.log('\nFirst record keys:', Object.keys(data[0]));
    console.log('\nFirst complete record:');
    const completeRecord = data.find(rec => rec.Title && rec.DOI && rec.Abstract);
    if (completeRecord) {
        console.log('Title:', completeRecord.Title ? completeRecord.Title.substring(0, 100) : '(empty)');
        console.log('Authors:', completeRecord.Authors ? completeRecord.Authors.substring(0, 100) : '(empty)');
        console.log('Year:', completeRecord.Year);
        console.log('DOI:', completeRecord.DOI ? completeRecord.DOI.substring(0, 100) : '(empty)');
        console.log('Has Abstract:', !!completeRecord.Abstract);
        console.log('Has Keywords:', !!completeRecord.Keywords);
    }
}
