const ExcelJS = require('exceljs');
const axios = require('axios');
const cheerio = require('cheerio');

// Configuration
const INPUT_FILE = 'IITA climate publications - COMPLETE.xlsx';
const OUTPUT_FILE = 'IITA climate publications - FINAL.xlsx';
const LOG_FILE = 'final_processing_log.txt';
const BATCH_SIZE = 10;
const DELAY_MS = 2000;

// Statistics
const stats = {
    totalPublications: 0,
    alreadyComplete: 0,
    attemptedProcessing: 0,
    successfullyPopulated: 0,
    failed: 0,
    startTime: new Date()
};

// Logging
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    require('fs').appendFileSync(LOG_FILE, logMessage);
}

// Clean text
function cleanText(text) {
    if (!text) return '';
    return text.replace(/[\n\r\t]+/g, ' ')
               .replace(/\s+/g, ' ')
               .trim()
               .substring(0, 32000);
}

// Extract DOI from URL
function extractDOI(url) {
    if (!url) return null;
    const doiMatch = url.match(/10\.\d{4,}\/[^\s]+/);
    return doiMatch ? doiMatch[0] : null;
}

// Fetch metadata from URL
async function fetchMetadata(url, title) {
    try {
        log(`  Fetching: ${url}`);
        const response = await axios.get(url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        let doi = extractDOI(url);
        let abstract = '';
        let keywords = '';

        // Try multiple DOI patterns
        if (!doi) {
            doi = $('meta[name="citation_doi"]').attr('content') ||
                  $('meta[name="DC.Identifier"]').attr('content') ||
                  $('a[href*="doi.org"]').first().text().trim() ||
                  $('.doi').first().text().replace(/^DOI:?\s*/i, '').trim();

            if (doi && !doi.startsWith('10.')) {
                const extracted = extractDOI(doi);
                doi = extracted || doi;
            }
        }

        // Try multiple abstract patterns
        abstract = $('meta[name="citation_abstract"]').attr('content') ||
                   $('meta[name="DC.Description"]').attr('content') ||
                   $('meta[property="og:description"]').attr('content') ||
                   $('meta[name="description"]').attr('content') ||
                   $('#abstract').text().trim() ||
                   $('.abstract').text().trim() ||
                   $('[class*="abstract"]').first().text().trim() ||
                   $('div:contains("Abstract")').next().text().trim();

        // Try multiple keyword patterns
        keywords = $('meta[name="citation_keywords"]').attr('content') ||
                   $('meta[name="keywords"]').attr('content') ||
                   $('meta[name="DC.Subject"]').attr('content') ||
                   $('.keywords').text().replace(/^Keywords:?\s*/i, '').trim() ||
                   $('[class*="keyword"]').text().trim();

        // Verify abstract quality
        if (abstract) {
            abstract = cleanText(abstract);
            // Check if abstract is actually useful (not just "Download PDF" etc)
            const lowQualityPhrases = [
                'download pdf', 'click here', 'read more', 'view abstract',
                'full text', 'this page', 'browse by', 'search results'
            ];
            const isLowQuality = lowQualityPhrases.some(phrase =>
                abstract.toLowerCase().includes(phrase) && abstract.length < 200
            );

            if (isLowQuality || abstract.length < 50) {
                abstract = '';
            }
        }

        // Clean keywords
        if (keywords) {
            keywords = cleanText(keywords)
                .split(/[;,\n]/)
                .map(k => k.trim())
                .filter(k => k.length > 0 && k.length < 100)
                .join(', ');
        }

        return { doi, abstract, keywords };

    } catch (error) {
        log(`  ERROR fetching ${url}: ${error.message}`);
        return { doi: null, abstract: '', keywords: '' };
    }
}

// Delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main processing function
async function processAllPublications() {
    log('='.repeat(80));
    log('STARTING FINAL COMPLETE PROCESSING OF ALL IITA CLIMATE PUBLICATIONS');
    log('='.repeat(80));
    log('');

    // Clear previous log
    require('fs').writeFileSync(LOG_FILE, '');

    // Load workbook
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(INPUT_FILE);
    const worksheet = workbook.getWorksheet(1);

    // Find column indices
    const headerRow = worksheet.getRow(1);
    const columns = {};
    headerRow.eachCell((cell, colNumber) => {
        const header = cell.value?.toString().trim();
        if (header) columns[header] = colNumber;
    });

    log('Column mapping:');
    Object.entries(columns).forEach(([name, index]) => {
        log(`  ${name}: Column ${index}`);
    });
    log('');

    // Required columns
    const requiredColumns = ['Title', 'URL', 'DOI', 'Abstract', 'Keywords'];
    const missingColumns = requiredColumns.filter(col => !columns[col]);

    if (missingColumns.length > 0) {
        log(`ERROR: Missing required columns: ${missingColumns.join(', ')}`);
        return;
    }

    // Collect all incomplete publications
    const incompletePublications = [];

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header

        const title = row.getCell(columns['Title']).value?.toString().trim();
        const url = row.getCell(columns['URL']).value?.toString().trim();
        const doi = row.getCell(columns['DOI']).value?.toString().trim();
        const abstract = row.getCell(columns['Abstract']).value?.toString().trim();
        const keywords = row.getCell(columns['Keywords']).value?.toString().trim();

        stats.totalPublications++;

        // Check if incomplete
        const isComplete = doi && abstract && keywords;

        if (isComplete) {
            stats.alreadyComplete++;
        } else if (url && title) {
            incompletePublications.push({
                rowNumber,
                title,
                url,
                currentDOI: doi || '',
                currentAbstract: abstract || '',
                currentKeywords: keywords || ''
            });
        }
    });

    log(`INITIAL STATUS:`);
    log(`  Total publications: ${stats.totalPublications}`);
    log(`  Already complete: ${stats.alreadyComplete}`);
    log(`  Incomplete (to process): ${incompletePublications.length}`);
    log('');

    // Process all incomplete publications
    log('BEGINNING COMPLETE PROCESSING...');
    log('');

    for (let i = 0; i < incompletePublications.length; i++) {
        const pub = incompletePublications[i];
        const progress = `[${i + 1}/${incompletePublications.length}]`;

        log(`${progress} Processing Row ${pub.rowNumber}: ${pub.title.substring(0, 80)}...`);
        stats.attemptedProcessing++;

        try {
            // Fetch metadata
            const metadata = await fetchMetadata(pub.url, pub.title);

            // Update row with new data (only if we found better data)
            const row = worksheet.getRow(pub.rowNumber);
            let updated = false;

            if (metadata.doi && !pub.currentDOI) {
                row.getCell(columns['DOI']).value = metadata.doi;
                log(`  ✓ DOI: ${metadata.doi}`);
                updated = true;
            } else if (pub.currentDOI) {
                log(`  - DOI: (already exists)`);
            } else {
                log(`  ✗ DOI: Not found`);
            }

            if (metadata.abstract && metadata.abstract.length > (pub.currentAbstract?.length || 0)) {
                row.getCell(columns['Abstract']).value = metadata.abstract;
                log(`  ✓ Abstract: ${metadata.abstract.length} chars`);
                updated = true;
            } else if (pub.currentAbstract) {
                log(`  - Abstract: (already exists)`);
            } else {
                log(`  ✗ Abstract: Not found`);
            }

            if (metadata.keywords && metadata.keywords.length > (pub.currentKeywords?.length || 0)) {
                row.getCell(columns['Keywords']).value = metadata.keywords;
                log(`  ✓ Keywords: ${metadata.keywords.substring(0, 60)}...`);
                updated = true;
            } else if (pub.currentKeywords) {
                log(`  - Keywords: (already exists)`);
            } else {
                log(`  ✗ Keywords: Not found`);
            }

            if (updated) {
                stats.successfullyPopulated++;
                log(`  SUCCESS: Updated ${pub.rowNumber}`);
            } else {
                stats.failed++;
                log(`  FAILED: No new data found`);
            }

        } catch (error) {
            stats.failed++;
            log(`  ERROR: ${error.message}`);
        }

        log('');

        // Save progress every 10 publications
        if ((i + 1) % BATCH_SIZE === 0) {
            await workbook.xlsx.writeFile(OUTPUT_FILE);
            log(`PROGRESS SAVED: ${i + 1}/${incompletePublications.length} processed`);
            log('');
        }

        // Delay between requests
        if (i < incompletePublications.length - 1) {
            await delay(DELAY_MS);
        }
    }

    // Final save
    await workbook.xlsx.writeFile(OUTPUT_FILE);

    // Final statistics
    const endTime = new Date();
    const duration = (endTime - stats.startTime) / 1000 / 60; // minutes

    log('='.repeat(80));
    log('FINAL PROCESSING COMPLETE');
    log('='.repeat(80));
    log('');
    log('STATISTICS:');
    log(`  Total publications in dataset: ${stats.totalPublications}`);
    log(`  Already complete at start: ${stats.alreadyComplete}`);
    log(`  Attempted to process: ${stats.attemptedProcessing}`);
    log(`  Successfully populated: ${stats.successfullyPopulated}`);
    log(`  Failed to populate: ${stats.failed}`);
    log(`  Final complete: ${stats.alreadyComplete + stats.successfullyPopulated}/${stats.totalPublications} (${Math.round((stats.alreadyComplete + stats.successfullyPopulated) / stats.totalPublications * 100)}%)`);
    log(`  Remaining incomplete: ${stats.totalPublications - stats.alreadyComplete - stats.successfullyPopulated}`);
    log(`  Processing time: ${duration.toFixed(1)} minutes`);
    log('');
    log(`Output saved to: ${OUTPUT_FILE}`);
    log(`Log saved to: ${LOG_FILE}`);
}

// Run the script
processAllPublications().catch(error => {
    log(`FATAL ERROR: ${error.message}`);
    console.error(error);
    process.exit(1);
});
