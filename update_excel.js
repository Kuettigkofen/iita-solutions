const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const inputFile = '/home/user/iita-solutions/IITA climate publications - POPULATED.xlsx';
const workbook = XLSX.readFile(inputFile);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

// Read the found data
const foundDataPath = '/home/user/iita-solutions/all_found_data.json';
let foundData = {};
if (fs.existsSync(foundDataPath)) {
  foundData = JSON.parse(fs.readFileSync(foundDataPath, 'utf8'));
}

let updateCount = 0;
let logEntries = [];

// Update the data
data.forEach((row, index) => {
  const rowIndex = index.toString();
  if (foundData[rowIndex]) {
    const found = foundData[rowIndex];
    let updated = false;
    
    if (found.doi && (!row.DOI || row.DOI.trim() === '')) {
      row.DOI = found.doi;
      updated = true;
    }
    if (found.abstract && (!row.Abstract || row.Abstract.trim() === '')) {
      row.Abstract = found.abstract;
      updated = true;
    }
    if (found.keywords && (!row.Keywords || row.Keywords.trim() === '')) {
      row.Keywords = found.keywords;
      updated = true;
    }
    
    if (updated) {
      updateCount++;
      logEntries.push({
        row: index + 2,
        title: row.TITLE?.substring(0, 60) + '...',
        doi: found.doi || 'N/A',
        hasAbstract: !!found.abstract,
        hasKeywords: !!found.keywords
      });
    }
  }
});

// Convert back to worksheet
const newWorksheet = XLSX.utils.json_to_sheet(data);
workbook.Sheets[sheetName] = newWorksheet;

// Save the updated file
const outputFile = '/home/user/iita-solutions/IITA climate publications - COMPLETE.xlsx';
XLSX.writeFile(workbook, outputFile);

console.log(JSON.stringify({
  success: true,
  updatedRows: updateCount,
  totalProcessed: data.length,
  outputFile: outputFile,
  updates: logEntries
}, null, 2));
