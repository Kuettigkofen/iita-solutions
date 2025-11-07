const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('/home/user/iita-solutions/IITA climate publications - COMPLETE.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet);

// Filter for incomplete publications (missing DOI, Abstract, or Keywords)
const incomplete = data.filter(row => {
  const hasDOI = row.DOI && row.DOI.trim() !== '';
  const hasAbstract = row.Abstract && row.Abstract.trim() !== '';
  const hasKeywords = row.Keywords && row.Keywords.trim() !== '';
  return !hasDOI || !hasAbstract || !hasKeywords;
});

// Output incomplete publications with essential info
const incompleteInfo = incomplete.map((pub, index) => ({
  index: index + 1,
  originalIndex: data.indexOf(pub),
  title: pub.TITLE,
  authors: pub.AUTHORS,
  year: pub.YEAR,
  journal: pub.JOURNAL,
  hasDOI: !!(pub.DOI && pub.DOI.trim() !== ''),
  hasAbstract: !!(pub.Abstract && pub.Abstract.trim() !== ''),
  hasKeywords: !!(pub.Keywords && pub.Keywords.trim() !== ''),
  // Check if there's an ABSTRACT field that could be used for Abstract
  hasALTAbstract: !!(pub.ABSTRACT && pub.ABSTRACT.trim() !== ''),
  hasKEYWORDS: !!(pub.KEYWORDS && pub.KEYWORDS.trim() !== '')
}));

// Save to file for processing
fs.writeFileSync('/home/user/iita-solutions/incomplete_publications.json', JSON.stringify(incompleteInfo, null, 2));

console.log(`Total incomplete: ${incomplete.length}`);
console.log(`\nFirst 20 incomplete publications:`);
incompleteInfo.slice(0, 20).forEach(pub => {
  console.log(`\n${pub.index}. ${pub.title}`);
  console.log(`   Authors: ${pub.authors || 'N/A'}`);
  console.log(`   Year: ${pub.year || 'N/A'}`);
  console.log(`   Journal: ${pub.journal || 'N/A'}`);
  console.log(`   Missing: ${[
    !pub.hasDOI ? 'DOI' : null,
    !pub.hasAbstract ? 'Abstract' : null,
    !pub.hasKeywords ? 'Keywords' : null
  ].filter(x => x).join(', ')}`);
  if (pub.hasALTAbstract) console.log(`   Note: Has ABSTRACT field that could be copied`);
  if (pub.hasKEYWORDS) console.log(`   Note: Has KEYWORDS field that could be copied`);
});
