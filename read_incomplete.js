const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('IITA climate publications - UPDATED.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet);

// Filter incomplete publications
const incomplete = data.filter(pub => {
  const hasNoDOI = !pub.DOI || pub.DOI === '' || pub.DOI === 'N/A';
  const hasNoAbstract = !pub.Abstract || pub.Abstract === '' || pub.Abstract === 'N/A';
  const hasNoKeywords = !pub.Keywords || pub.Keywords === '' || pub.Keywords === 'N/A';
  return hasNoDOI || hasNoAbstract || hasNoKeywords;
});

console.log(JSON.stringify({
  total: data.length,
  incomplete: incomplete.length,
  complete: data.length - incomplete.length,
  publications: incomplete
}, null, 2));
