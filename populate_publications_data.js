const XLSX = require('xlsx');
const https = require('https');

// Function to search CrossRef API
function searchCrossRef(title, authors, year) {
  return new Promise((resolve, reject) => {
    // Clean up title for search
    const cleanTitle = title
      .replace(/â€"/g, '-')
      .replace(/â€œ|â€�/g, '"')
      .replace(/â€™/g, "'")
      .replace(/[^\w\s-]/g, ' ')
      .trim();

    // Encode the search query
    const query = encodeURIComponent(cleanTitle);
    const url = `https://api.crossref.org/works?query.title=${query}&rows=5`;

    https.get(url, {
      headers: {
        'User-Agent': 'IITA-Solutions-Research/1.0 (mailto:research@iita.org)'
      }
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

// Function to calculate title similarity (simple word overlap)
function calculateSimilarity(title1, title2) {
  const normalize = (str) => {
    return str
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ');
  };

  const words1 = new Set(normalize(title1));
  const words2 = new Set(normalize(title2));

  // Calculate Jaccard similarity
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

// Function to extract best match from CrossRef results
function findBestMatch(results, originalTitle, year) {
  if (!results.message || !results.message.items || results.message.items.length === 0) {
    return null;
  }

  const items = results.message.items;
  let bestMatch = null;
  let bestScore = 0;

  for (const item of items) {
    if (!item.title || !item.title[0]) continue;

    const similarity = calculateSimilarity(originalTitle, item.title[0]);

    // Check if year matches (if available)
    const yearMatch = !item.published ||
                      !item.published['date-parts'] ||
                      !item.published['date-parts'][0] ||
                      item.published['date-parts'][0][0] === year;

    // Boost score if year matches
    const finalScore = yearMatch ? similarity * 1.1 : similarity;

    if (finalScore > bestScore && similarity >= 0.7) { // 70% base similarity threshold
      bestScore = finalScore;
      bestMatch = item;
    }
  }

  return bestScore >= 0.7 ? bestMatch : null; // Only return if >= 70% similar
}

// Main processing function
async function processPublications() {
  console.log('Reading Excel file...');
  const workbook = XLSX.readFile('IITA climate publications.xlsx');
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  console.log(`Found ${data.length} publications to process\n`);

  // Add new columns
  const updatedData = [];
  let successCount = 0;
  let notFoundCount = 0;
  let lowConfidenceCount = 0;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    console.log(`[${i + 1}/${data.length}] Processing: ${row.TITLE.substring(0, 60)}...`);

    try {
      // Search CrossRef
      const results = await searchCrossRef(row.TITLE, row.AUTHORS, row.YEAR);
      const match = findBestMatch(results, row.TITLE, row.YEAR);

      if (match) {
        const similarity = calculateSimilarity(row.TITLE, match.title[0]);
        console.log(`  ✓ Found match (${(similarity * 100).toFixed(1)}% confidence)`);
        console.log(`  - Matched title: ${match.title[0].substring(0, 80)}...`);

        row.DOI = match.DOI || '';
        row.Abstract = match.abstract || '';
        row.Keywords = match.subject ? match.subject.join(', ') : '';

        if (row.DOI) console.log(`  - DOI: ${row.DOI}`);
        if (row.Abstract) console.log(`  - Abstract: ${row.Abstract.substring(0, 60)}...`);
        if (row.Keywords) console.log(`  - Keywords: ${row.Keywords}`);

        successCount++;
      } else {
        console.log(`  ✗ No confident match found`);
        row.DOI = '';
        row.Abstract = '';
        row.Keywords = '';
        notFoundCount++;
      }
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
      row.DOI = '';
      row.Abstract = '';
      row.Keywords = '';
      notFoundCount++;
    }

    updatedData.push(row);

    // Add delay to be respectful to API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Create new workbook
  console.log('\n=== Summary ===');
  console.log(`Total processed: ${data.length}`);
  console.log(`Successfully matched: ${successCount}`);
  console.log(`Not found: ${notFoundCount}`);

  const newWorkbook = XLSX.utils.book_new();
  const newWorksheet = XLSX.utils.json_to_sheet(updatedData);
  XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Publications');

  const outputFile = 'IITA climate publications - POPULATED.xlsx';
  XLSX.writeFile(newWorkbook, outputFile);
  console.log(`\n✓ Saved results to: ${outputFile}`);
}

// Run the script
processPublications().catch(console.error);
