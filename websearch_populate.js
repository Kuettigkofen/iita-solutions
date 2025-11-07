const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('IITA climate publications - FINAL.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`Total publications: ${data.length}`);

// Identify incomplete publications
const incomplete = data.filter(pub => {
    const missingDOI = !pub.DOI || pub.DOI.trim() === '';
    const missingAbstract = !pub.Abstract || pub.Abstract.trim() === '';
    const missingKeywords = !pub.Keywords || pub.Keywords.trim() === '';
    return missingDOI || missingAbstract || missingKeywords;
});

const complete = data.filter(pub => {
    const hasDOI = pub.DOI && pub.DOI.trim() !== '';
    const hasAbstract = pub.Abstract && pub.Abstract.trim() !== '';
    const hasKeywords = pub.Keywords && pub.Keywords.trim() !== '';
    return hasDOI && hasAbstract && hasKeywords;
});

console.log(`Complete publications: ${complete.length}`);
console.log(`Incomplete publications: ${incomplete.length}`);

// Display incomplete publications for WebSearch processing
console.log('\n========== INCOMPLETE PUBLICATIONS TO PROCESS ==========\n');
incomplete.forEach((pub, idx) => {
    const firstAuthor = pub.AUTHORS?.split(';')[0]?.split(',')[0]?.trim() || pub.AUTHORS?.split(',')[0]?.trim() || 'Unknown';
    console.log(`${idx + 1}. [${pub.YEAR}] ${pub.TITLE}`);
    console.log(`   First Author: ${firstAuthor}`);
    console.log(`   Missing: ${!pub.DOI ? 'DOI ' : ''}${!pub.Abstract ? 'Abstract ' : ''}${!pub.Keywords ? 'Keywords' : ''}`);
    console.log(`   WebSearch Query: "${pub.TITLE}" ${firstAuthor} ${pub.YEAR} cgspace DOI abstract`);
    console.log('');
});

// Export for reference
fs.writeFileSync('incomplete_publications.json', JSON.stringify(incomplete, null, 2));
console.log(`\nExported ${incomplete.length} incomplete publications to incomplete_publications.json`);
