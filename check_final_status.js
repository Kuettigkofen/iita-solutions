const XLSX = require('xlsx');

const wb = XLSX.readFile('IITA climate publications - COMPLETE.xlsx');
const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

const complete = data.filter(r => r.DOI && r.Abstract && r.Keywords);
const incomplete = data.filter(r => !r.DOI || !r.Abstract || !r.Keywords);

console.log('═══════════════════════════════════════');
console.log('📊 FINAL STATUS CHECK');
console.log('═══════════════════════════════════════\n');
console.log('Total publications:', data.length);
console.log('✅ Complete:', complete.length, `(${(complete.length/154*100).toFixed(1)}%)`);
console.log('❌ Incomplete:', incomplete.length, `(${(incomplete.length/154*100).toFixed(1)}%)`);

console.log('\n📋 REMAINING INCOMPLETE PUBLICATIONS:\n');
incomplete.forEach((r, i) => {
  console.log(`${i+1}. [Row ${r['#']}] ${r.TITLE.substring(0, 70)}...`);
  console.log(`   Author: ${r.AUTHORS?.split(',')[0] || 'Unknown'}`);
  console.log(`   Year: ${r.YEAR}`);
  const missing = [];
  if (!r.DOI) missing.push('DOI');
  if (!r.Abstract) missing.push('Abstract');
  if (!r.Keywords) missing.push('Keywords');
  console.log(`   Missing: ${missing.join(', ')}\n`);
});
