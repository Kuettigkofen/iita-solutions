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
    noUrlAvailable: 0,
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

// Extract DOI from text
function extractDOI(text) {
    if (!text) return null;
    const doiMatch = text.match(/10\.\d{4,}\/[^\s]+/);
    return doiMatch ? doiMatch[0].replace(/[.,;]$/, '') : null;
}

// Get URL from DOI
function getUrlFromDOI(doi) {
    if (!doi) return null;
    const cleanDoi = extractDOI(doi) || doi;
    if (cleanDoi.startsWith('http')) {
        return cleanDoi;
    }
    return `https://doi.org/${cleanDoi}`;
}

// Fetch metadata from DOI
async function fetchMetadataFromDOI(doi) {
    try {
        const url = getUrlFromDOI(doi);
        if (!url) return { doi: null, abstract: '', keywords: '' };

        log(`  Fetching: ${url}`);

        const response = await axios.get(url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            maxRedirects: 5
        });

        const html = response.data;
        const $ = cheerio.load(html);

        let abstract = '';
        let keywords = '';
        let foundDoi = extractDOI(doi);

        // Try to find DOI if not already clean
        if (!foundDoi || !foundDoi.startsWith('10.')) {
            foundDoi = $('meta[name="citation_doi"]').attr('content') ||
                       $('meta[name="DC.Identifier"]').attr('content') ||
                       $('a[href*="doi.org"]').first().text().trim() ||
                       $('.doi').first().text().replace(/^DOI:?\s*/i, '').trim();

            if (foundDoi) {
                const extracted = extractDOI(foundDoi);
                foundDoi = extracted || foundDoi;
            }
        }

        // Try multiple abstract patterns
        abstract = $('meta[name="citation_abstract"]').attr('content') ||
                   $('meta[name="DC.Description"]').attr('content') ||
                   $('meta[property="og:description"]').attr('content') ||
                   $('meta[name="description"]').attr('content') ||
                   $('#abstract').text().trim() ||
                   $('.abstract').text().trim() ||
                   $('.abstractSection').text().trim() ||
                   $('section[class*="abstract"]').text().trim() ||
                   $('div[class*="abstract"]').first().text().trim() ||
                   $('p[class*="abstract"]').first().text().trim();

        // Try multiple keyword patterns
        keywords = $('meta[name="citation_keywords"]').attr('content') ||
                   $('meta[name="keywords"]').attr('content') ||
                   $('meta[name="DC.Subject"]').attr('content') ||
                   $('.keywords').text().replace(/^Keywords:?\s*/i, '').trim() ||
                   $('.kwd-group').text().trim() ||
                   $('[class*="keyword"]').text().trim();

        // Verify abstract quality
        if (abstract) {
            abstract = cleanText(abstract);
            // Check if abstract is actually useful
            const lowQualityPhrases = [
                'download pdf', 'click here', 'read more', 'view abstract',
                'full text available', 'this page', 'browse by', 'search results',
                'javascript is disabled', 'cookies', 'enable javascript'
            ];
            const isLowQuality = lowQualityPhrases.some(phrase =>
                abstract.toLowerCase().includes(phrase) && abstract.length < 200
            );

            if (isLowQuality || abstract.length < 50) {
                log(`  ⚠ Abstract too short or low quality (${abstract.length} chars)`);
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

        return { doi: foundDoi, abstract, keywords };

    } catch (error) {
        log(`  ERROR: ${error.message}`);
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

    // Find column indices (case insensitive)
    const headerRow = worksheet.getRow(1);
    const columns = {};
    headerRow.eachCell((cell, colNumber) => {
        const header = cell.value?.toString().trim().toUpperCase();
        if (header) columns[header] = colNumber;
    });

    log('Column mapping found:');
    Object.entries(columns).forEach(([name, index]) => {
        log(`  ${name}: Column ${index}`);
    });
    log('');

    // Map to actual column names
    const colTitle = columns['TITLE'];
    const colDOI = columns['DOI'];
    const colAbstract = columns['ABSTRACT'];
    const colKeywords = columns['KEYWORDS'];

    if (!colTitle || !colDOI || !colAbstract || !colKeywords) {
        log('ERROR: Missing required columns');
        log(`  TITLE: ${colTitle ? 'Found' : 'MISSING'}`);
        log(`  DOI: ${colDOI ? 'Found' : 'MISSING'}`);
        log(`  ABSTRACT: ${colAbstract ? 'Found' : 'MISSING'}`);
        log(`  KEYWORDS: ${colKeywords ? 'Found' : 'MISSING'}`);
        return;
    }

    // Collect all incomplete publications
    const incompletePublications = [];

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header

        const title = row.getCell(colTitle).value?.toString().trim();
        const doi = row.getCell(colDOI).value?.toString().trim();
        const abstract = row.getCell(colAbstract).value?.toString().trim();
        const keywords = row.getCell(colKeywords).value?.toString().trim();

        stats.totalPublications++;

        // Check if incomplete
        const hasAbstract = abstract && abstract.length > 50;
        const hasKeywords = keywords && keywords.length > 5;
        const isComplete = doi && hasAbstract && hasKeywords;

        if (isComplete) {
            stats.alreadyComplete++;
        } else if (doi && title) {
            // Only process if we have a DOI to work with
            incompletePublications.push({
                rowNumber,
                title: title || 'Unknown',
                doi,
                currentAbstract: abstract || '',
                currentKeywords: keywords || ''
            });
        } else if (!doi && title) {
            stats.noUrlAvailable++;
        }
    });

    log(`INITIAL STATUS:`);
    log(`  Total publications: ${stats.totalPublications}`);
    log(`  Already complete: ${stats.alreadyComplete}`);
    log(`  Missing DOI (cannot process): ${stats.noUrlAvailable}`);
    log(`  Incomplete with DOI (to process): ${incompletePublications.length}`);
    log('');

    if (incompletePublications.length === 0) {
        log('All publications with DOIs are already complete!');
        return;
    }

    // Process all incomplete publications
    log('BEGINNING COMPLETE PROCESSING...');
    log('');

    for (let i = 0; i < incompletePublications.length; i++) {
        const pub = incompletePublications[i];
        const progress = `[${i + 1}/${incompletePublications.length}]`;

        log(`${progress} Row ${pub.rowNumber}: ${pub.title.substring(0, 70)}...`);
        log(`  DOI: ${pub.doi}`);
        stats.attemptedProcessing++;

        try {
            // Fetch metadata
            const metadata = await fetchMetadataFromDOI(pub.doi);

            // Update row with new data
            const row = worksheet.getRow(pub.rowNumber);
            let updated = false;

            // Update abstract if we found a better one
            if (metadata.abstract && metadata.abstract.length > pub.currentAbstract.length) {
                row.getCell(colAbstract).value = metadata.abstract;
                log(`  ✓ Abstract: ${metadata.abstract.length} chars (improved from ${pub.currentAbstract.length})`);
                updated = true;
            } else if (pub.currentAbstract && pub.currentAbstract.length > 50) {
                log(`  - Abstract: Already exists (${pub.currentAbstract.length} chars)`);
            } else {
                log(`  ✗ Abstract: Not found or low quality`);
            }

            // Update keywords if we found better ones
            if (metadata.keywords && metadata.keywords.length > pub.currentKeywords.length) {
                row.getCell(colKeywords).value = metadata.keywords;
                log(`  ✓ Keywords: ${metadata.keywords.substring(0, 50)}...`);
                updated = true;
            } else if (pub.currentKeywords && pub.currentKeywords.length > 5) {
                log(`  - Keywords: Already exist`);
            } else {
                log(`  ✗ Keywords: Not found`);
            }

            if (updated) {
                stats.successfullyPopulated++;
                log(`  ✓ SUCCESS: Updated row ${pub.rowNumber}`);
            } else {
                stats.failed++;
                log(`  ✗ FAILED: No new data found`);
            }

        } catch (error) {
            stats.failed++;
            log(`  ✗ ERROR: ${error.message}`);
        }

        log('');

        // Save progress every batch
        if ((i + 1) % BATCH_SIZE === 0) {
            await workbook.xlsx.writeFile(OUTPUT_FILE);
            log(`✓ PROGRESS SAVED: ${i + 1}/${incompletePublications.length} processed`);
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
    log('FINAL STATISTICS:');
    log(`  Total publications in dataset: ${stats.totalPublications}`);
    log(`  Already complete at start: ${stats.alreadyComplete}`);
    log(`  Missing DOI (cannot process): ${stats.noUrlAvailable}`);
    log(`  Attempted to process: ${stats.attemptedProcessing}`);
    log(`  Successfully populated: ${stats.successfullyPopulated}`);
    log(`  Failed to populate: ${stats.failed}`);
    log('');
    const finalComplete = stats.alreadyComplete + stats.successfullyPopulated;
    const completionRate = Math.round((finalComplete / stats.totalPublications) * 100);
    log(`  FINAL COMPLETION: ${finalComplete}/${stats.totalPublications} (${completionRate}%)`);
    log(`  Remaining incomplete: ${stats.totalPublications - finalComplete}`);
    log(`  Processing time: ${duration.toFixed(1)} minutes`);
    log('');
    log(`✓ Output saved to: ${OUTPUT_FILE}`);
    log(`✓ Log saved to: ${LOG_FILE}`);
    log('');
    log('Processing complete! Review the log file for detailed results.');
}

// Run the script
processAllPublications().catch(error => {
    log(`FATAL ERROR: ${error.message}`);
    console.error(error);
    process.exit(1);
});
