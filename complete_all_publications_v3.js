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
    crossrefSuccess: 0,
    websiteSuccess: 0,
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
    const doiMatch = text.match(/10\.\d{4,}\/[^\s,;]+/);
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

// Try CrossRef API for DOI metadata
async function fetchFromCrossRef(doi) {
    try {
        const cleanDoi = extractDOI(doi);
        if (!cleanDoi) return null;

        const url = `https://api.crossref.org/works/${cleanDoi}`;
        log(`  Trying CrossRef API: ${url}`);

        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'IITA-Climate-Research-Analysis/1.0 (mailto:research@iita.org)'
            }
        });

        if (response.data && response.data.message) {
            const data = response.data.message;
            let abstract = '';
            let keywords = [];

            // Get abstract
            if (data.abstract) {
                abstract = cleanText(data.abstract);
            }

            // Get keywords/subjects
            if (data.subject && Array.isArray(data.subject)) {
                keywords = data.subject;
            }

            return {
                doi: cleanDoi,
                abstract: abstract,
                keywords: keywords.join(', ')
            };
        }

        return null;
    } catch (error) {
        log(`  CrossRef API error: ${error.message}`);
        return null;
    }
}

// Try direct website scraping with multiple user agents
async function fetchFromWebsite(doi) {
    const url = getUrlFromDOI(doi);
    if (!url) return null;

    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];

    for (const userAgent of userAgents) {
        try {
            log(`  Trying direct access: ${url}`);

            const response = await axios.get(url, {
                timeout: 15000,
                headers: {
                    'User-Agent': userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1'
                },
                maxRedirects: 5,
                validateStatus: (status) => status < 500 // Accept all non-5xx responses
            });

            if (response.status === 403 || response.status === 401) {
                continue; // Try next user agent
            }

            const html = response.data;
            const $ = cheerio.load(html);

            let abstract = '';
            let keywords = '';
            let foundDoi = extractDOI(doi);

            // Try multiple abstract selectors
            const abstractSelectors = [
                'meta[name="citation_abstract"]',
                'meta[name="DC.Description"]',
                'meta[property="og:description"]',
                'meta[name="description"]',
                '#abstract',
                '.abstract',
                '.abstractSection',
                'section[class*="abstract"]',
                'div[class*="abstract"]',
                'p[class*="abstract"]',
                '[data-testid="abstract"]',
                'section:contains("Abstract")',
                'div:contains("Abstract")'
            ];

            for (const selector of abstractSelectors) {
                if (!abstract) {
                    if (selector.startsWith('meta')) {
                        abstract = $(selector).attr('content');
                    } else {
                        abstract = $(selector).first().text().trim();
                    }
                    if (abstract) break;
                }
            }

            // Try multiple keyword selectors
            const keywordSelectors = [
                'meta[name="citation_keywords"]',
                'meta[name="keywords"]',
                'meta[name="DC.Subject"]',
                '.keywords',
                '.kwd-group',
                '[class*="keyword"]'
            ];

            for (const selector of keywordSelectors) {
                if (!keywords) {
                    if (selector.startsWith('meta')) {
                        keywords = $(selector).attr('content');
                    } else {
                        keywords = $(selector).text().replace(/^Keywords:?\s*/i, '').trim();
                    }
                    if (keywords) break;
                }
            }

            // Verify abstract quality
            if (abstract) {
                abstract = cleanText(abstract);
                const lowQualityPhrases = [
                    'download pdf', 'click here', 'read more', 'view abstract',
                    'full text available', 'this page', 'browse by', 'search results',
                    'javascript is disabled', 'cookies', 'enable javascript', 'sign in',
                    'access denied', 'forbidden'
                ];
                const isLowQuality = lowQualityPhrases.some(phrase =>
                    abstract.toLowerCase().includes(phrase)
                ) || abstract.length < 50;

                if (isLowQuality) {
                    abstract = '';
                }
            }

            // Clean keywords
            if (keywords) {
                keywords = cleanText(keywords)
                    .split(/[;,\n]/)
                    .map(k => k.trim())
                    .filter(k => k.length > 0 && k.length < 100)
                    .slice(0, 15) // Max 15 keywords
                    .join(', ');
            }

            if (abstract || keywords) {
                return { doi: foundDoi, abstract, keywords };
            }

        } catch (error) {
            log(`  Website access error (${userAgent.substring(0, 20)}...): ${error.message}`);
            continue;
        }
    }

    return null;
}

// Main metadata fetching with multiple strategies
async function fetchMetadata(doi) {
    // Strategy 1: Try CrossRef API first (most reliable)
    const crossrefData = await fetchFromCrossRef(doi);
    if (crossrefData && (crossrefData.abstract || crossrefData.keywords)) {
        log(`  ✓ CrossRef API SUCCESS`);
        stats.crossrefSuccess++;
        return crossrefData;
    }

    // Strategy 2: Try direct website access
    const websiteData = await fetchFromWebsite(doi);
    if (websiteData && (websiteData.abstract || websiteData.keywords)) {
        log(`  ✓ Website scraping SUCCESS`);
        stats.websiteSuccess++;
        return websiteData;
    }

    // Nothing worked
    return { doi: null, abstract: '', keywords: '' };
}

// Delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main processing function
async function processAllPublications() {
    log('='.repeat(80));
    log('STARTING FINAL COMPLETE PROCESSING OF ALL IITA CLIMATE PUBLICATIONS');
    log('Using multi-strategy approach: CrossRef API + Website Scraping');
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

        log(`${progress} Row ${pub.rowNumber}: ${pub.title.substring(0, 60)}...`);
        log(`  DOI: ${pub.doi}`);
        stats.attemptedProcessing++;

        try {
            // Fetch metadata using multi-strategy approach
            const metadata = await fetchMetadata(pub.doi);

            // Update row with new data
            const row = worksheet.getRow(pub.rowNumber);
            let updated = false;

            // Update abstract if we found a better one
            if (metadata.abstract && metadata.abstract.length > pub.currentAbstract.length) {
                row.getCell(colAbstract).value = metadata.abstract;
                log(`  ✓ Abstract: ${metadata.abstract.length} chars (was ${pub.currentAbstract.length})`);
                updated = true;
            } else if (pub.currentAbstract && pub.currentAbstract.length > 50) {
                log(`  - Abstract: Already exists (${pub.currentAbstract.length} chars)`);
            } else {
                log(`  ✗ Abstract: Not found`);
            }

            // Update keywords if we found better ones
            if (metadata.keywords && metadata.keywords.length > pub.currentKeywords.length) {
                row.getCell(colKeywords).value = metadata.keywords;
                log(`  ✓ Keywords: ${metadata.keywords.substring(0, 50)}${metadata.keywords.length > 50 ? '...' : ''}`);
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
            const currentComplete = stats.alreadyComplete + stats.successfullyPopulated;
            const currentRate = Math.round((currentComplete / stats.totalPublications) * 100);
            log(`━━━ PROGRESS SAVED ━━━`);
            log(`  Processed: ${i + 1}/${incompletePublications.length}`);
            log(`  Newly populated: ${stats.successfullyPopulated}`);
            log(`  Current completion: ${currentComplete}/${stats.totalPublications} (${currentRate}%)`);
            log(`  CrossRef successes: ${stats.crossrefSuccess}`);
            log(`  Website scraping successes: ${stats.websiteSuccess}`);
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
    log('SUCCESS BREAKDOWN:');
    log(`  CrossRef API successes: ${stats.crossrefSuccess}`);
    log(`  Website scraping successes: ${stats.websiteSuccess}`);
    log('');
    const finalComplete = stats.alreadyComplete + stats.successfullyPopulated;
    const completionRate = Math.round((finalComplete / stats.totalPublications) * 100);
    log(`FINAL COMPLETION: ${finalComplete}/${stats.totalPublications} (${completionRate}%)`);
    log(`  Complete with DOI: ${finalComplete}`);
    log(`  Missing DOI (cannot complete): ${stats.noUrlAvailable}`);
    log(`  Remaining incomplete: ${stats.totalPublications - finalComplete}`);
    log(`  Processing time: ${duration.toFixed(1)} minutes`);
    log('');
    log(`✓ Output saved to: ${OUTPUT_FILE}`);
    log(`✓ Log saved to: ${LOG_FILE}`);
    log('');
    log('='.repeat(80));
    log('Processing complete! Review the log file for detailed results.');
    log('='.repeat(80));
}

// Run the script
processAllPublications().catch(error => {
    log(`FATAL ERROR: ${error.message}`);
    console.error(error);
    process.exit(1);
});
