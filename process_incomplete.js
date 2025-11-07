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
const incompleteData = incomplete.map((pub, index) => {
    // Get first author
    const authors = pub.AUTHORS || '';
    const firstAuthor = authors.split(',')[0].trim() || authors.split(';')[0].trim() || '';

    return {
        index: index + 1,
        rowNumber: pub['#'] || '',
        id: pub.ID || '',
        title: pub.TITLE || '',
        authors: pub.AUTHORS || '',
        firstAuthor: firstAuthor,
        year: pub.YEAR || '',
        journal: pub.JOURNAL || '',
        missingDOI: !pub.DOI || pub.DOI.trim() === '',
        missingAbstract: !pub.Abstract || pub.Abstract.trim() === '',
        missingKeywords: !pub.Keywords || pub.Keywords.trim() === '',
        currentDOI: pub.DOI || '',
        currentAbstract: pub.Abstract || '',
        currentKeywords: pub.Keywords || ''
    };
});

fs.writeFileSync('incomplete_to_process.json', JSON.stringify(incompleteData, null, 2));
console.log(`\nSaved ${incompleteData.length} incomplete publications to incomplete_to_process.json`);

// Statistics
const missingDOIOnly = incompleteData.filter(p => p.missingDOI && !p.missingAbstract && !p.missingKeywords).length;
const missingAbstractOnly = incompleteData.filter(p => !p.missingDOI && p.missingAbstract && !p.missingKeywords).length;
const missingKeywordsOnly = incompleteData.filter(p => !p.missingDOI && !p.missingAbstract && p.missingKeywords).length;
const missingAll = incompleteData.filter(p => p.missingDOI && p.missingAbstract && p.missingKeywords).length;

console.log('\nStatistics:');
console.log(`  Missing only DOI: ${missingDOIOnly}`);
console.log(`  Missing only Abstract: ${missingAbstractOnly}`);
console.log(`  Missing only Keywords: ${missingKeywordsOnly}`);
console.log(`  Missing all three: ${missingAll}`);

// Show first 10 incomplete publications
console.log('\nFirst 10 incomplete publications:');
incompleteData.slice(0, 10).forEach(pub => {
    console.log(`\n${pub.index}. ${pub.title.substring(0, 100)}`);
    console.log(`   First Author: ${pub.firstAuthor}`);
    console.log(`   Year: ${pub.year}`);
    console.log(`   Missing: ${pub.missingDOI ? 'DOI ' : ''}${pub.missingAbstract ? 'Abstract ' : ''}${pub.missingKeywords ? 'Keywords' : ''}`);
});
