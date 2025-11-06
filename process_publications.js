const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const inputFile = '/home/user/iita-solutions/IITA climate publications - POPULATED.xlsx';
const workbook = XLSX.readFile(inputFile);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

// Track publications needing work
const needsWork = [];

for (let i = 0; i < data.length; i++) {
  const pub = data[i];
  const needsDOI = !pub.DOI || pub.DOI.trim() === '';
  const needsAbstract = !pub.Abstract || pub.Abstract.trim() === '';
  const needsKeywords = !pub.Keywords || pub.Keywords.trim() === '';
  
  if (needsDOI || needsAbstract || needsKeywords) {
    needsWork.push({
      rowIndex: i,
      excelRow: i + 2, // Excel row number (1-indexed + header)
      title: pub.TITLE || '',
      authors: pub.AUTHORS || '',
      year: pub.YEAR || '',
      needsDOI,
      needsAbstract,
      needsKeywords
    });
  }
}

console.log(JSON.stringify({
  total: data.length,
  complete: data.length - needsWork.length,
  needsWork: needsWork.length,
  publications: needsWork
}, null, 2));
