const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('IITA climate publications - UPDATED.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`Total publications: ${data.length}`);

// Find incomplete publications (missing DOI, Abstract, or Keywords)
const incomplete = data.filter(pub => {
    const missingDOI = !pub.DOI || pub.DOI.trim() === '';
    const missingAbstract = !pub.Abstract || pub.Abstract.trim() === '';
    const missingKeywords = !pub.Keywords || pub.Keywords.trim() === '';
    return missingDOI || missingAbstract || missingKeywords;
});

console.log(`Incomplete publications: ${incomplete.length}`);
console.log(`Complete publications: ${data.length - incomplete.length}`);

// Save incomplete publications to JSON for processing
const incompleteData = incomplete.map((pub, index) => ({
    index: index + 1,
    title: pub.Title || '',
    authors: pub.Authors || '',
    year: pub.Year || '',
    journal: pub['Journal/Source'] || '',
    missingDOI: !pub.DOI || pub.DOI.trim() === '',
    missingAbstract: !pub.Abstract || pub.Abstract.trim() === '',
    missingKeywords: !pub.Keywords || pub.Keywords.trim() === '',
    currentDOI: pub.DOI || '',
    currentAbstract: pub.Abstract || '',
    currentKeywords: pub.Keywords || ''
}));

fs.writeFileSync('incomplete_to_process.json', JSON.stringify(incompleteData, null, 2));
console.log(`\nSaved ${incompleteData.length} incomplete publications to incomplete_to_process.json`);

// Show first 5 incomplete publications
console.log('\nFirst 5 incomplete publications:');
incompleteData.slice(0, 5).forEach(pub => {
    console.log(`\n${pub.index}. ${pub.title}`);
    console.log(`   Authors: ${pub.authors}`);
    console.log(`   Year: ${pub.year}`);
    console.log(`   Missing: ${pub.missingDOI ? 'DOI ' : ''}${pub.missingAbstract ? 'Abstract ' : ''}${pub.missingKeywords ? 'Keywords' : ''}`);
});
