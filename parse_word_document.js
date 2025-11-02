const mammoth = require('mammoth');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client with service role for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ Missing Supabase URL');
  process.exit(1);
}

// Use service role key if available (bypasses RLS), fallback to anon key
const supabaseKey = supabaseServiceKey || supabaseAnonKey;
if (!supabaseKey) {
  console.error('❌ Missing Supabase keys');
  process.exit(1);
}

console.log(`🔑 Using ${supabaseServiceKey ? 'service role' : 'anonymous'} key for database operations`);
const supabase = createClient(supabaseUrl, supabaseKey);

class WordDocumentParser {
  constructor() {
    this.patterns = {
      // Core fields
      title: /(?:title|name|solution):\s*(.+?)(?:\n|$)/i,
      countries: /(?:countries|locations?|regions?):\s*(.+?)(?:\n|$)/i,
      challenges: /(?:challenges?|problems?|issues?):\s*(.+?)(?:\n|$)/i,
      climate_potential: /(?:climate (?:potential|score|rating)|impact):\s*(\d+)/i,
      agroecology: /(?:agroecology|agro.ecological|key agroeco|agroeco zones?):\s*(.+?)(?:\n|$)/i,

      // Problem section
      executive_summary: /(?:executive summary|summary|overview):\s*((?:.|\n)*?)(?:\n\n|\n[A-Z])/i,
      problem_title: /(?:problem title|main (?:problem|challenge)):\s*(.+?)(?:\n|$)/i,
      problem_bullets: /(?:problem|challenges?)(?:\s+(?:bullets?|points?))?\s*:?\s*\n((?:\s*[-•*]\s*.+\n?)+)/i,

      // Solution section
      solution_title: /(?:solution title|intervention):\s*(.+?)(?:\n|$)/i,
      solution_bullets: /(?:solution|interventions?)(?:\s+(?:bullets?|points?))?\s*:?\s*\n((?:\s*[-•*]\s*.+\n?)+)/i,

      // Resources
      technical_guides: /(?:technical guides?|manuals?):\s*((?:.|\n)*?)(?:\n\n|\n[A-Z])/i,
      digital_tools: /(?:digital tools?|apps?|software):\s*((?:.|\n)*?)(?:\n\n|\n[A-Z])/i,
      research_publications: /(?:research|publications?|papers?):\s*((?:.|\n)*?)(?:\n\n|\n[A-Z])/i,
      training_materials: /(?:training|education|materials?):\s*((?:.|\n)*?)(?:\n\n|\n[A-Z])/i,
      impact: /(?:impact|results?|outcomes?):\s*((?:.|\n)*?)(?:\n\n|\n[A-Z])/i,

      // Role-specific content
      funder: /(?:funder|funding|investment):\s*((?:.|\n)*?)(?:\n\n|\n[A-Z])/i,
      policymaker: /(?:policymaker|policy|government):\s*((?:.|\n)*?)(?:\n\n|\n[A-Z])/i,
      farmer: /(?:farmer|agriculture|farming):\s*((?:.|\n)*?)(?:\n\n|\n[A-Z])/i,
      student: /(?:student|education|learning):\s*((?:.|\n)*?)(?:\n\n|\n[A-Z])/i,
      extension: /(?:extension|training|outreach):\s*((?:.|\n)*?)(?:\n\n|\n[A-Z])/i,
      researcher: /(?:researcher?|research|science):\s*((?:.|\n)*?)(?:\n\n|\n[A-Z])/i,
      developer: /(?:development|practitioner|ngo):\s*((?:.|\n)*?)(?:\n\n|\n[A-Z])/i,
      business: /(?:business|entrepreneur|market):\s*((?:.|\n)*?)(?:\n\n|\n[A-Z])/i,

      // Role-specific summary sentences section
      role_summary_section: /ROLE-SPECIFIC SUMMARY SENTENCE[S]?\s*:?\s*\n((?:.|\n)*?)(?=\n\n[A-Z][A-Z\s-]+\n|$)/i,

      // Role-specific content section
      role_content_section: /ROLE-SPECIFIC CONTENT\s*:?\s*\n((?:.|\n)*?)(?=\n\n[A-Z][A-Z\s-]+\n|$)/i,
    };
  }

  async parseDocument(filePath) {
    try {
      console.log(`📄 Parsing Word document: ${filePath}`);

      // Extract text with hyperlinks preserved
      const result = await mammoth.convertToHtml({
        path: filePath,
        convertImage: mammoth.images.ignoreImages,
        styleMap: [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
        ]
      });
      const html = result.value;

      // Also get raw text for pattern matching
      const textResult = await mammoth.extractRawText({ path: filePath });
      const text = textResult.value;

      console.log(`📝 Extracted ${text.length} characters of text with hyperlinks preserved`);
      console.log(`🔗 HTML length: ${html.length} characters (includes hyperlinks)`);

      // Parse the document structure
      const solution = this.extractSolutionData(text, html);

      return solution;
    } catch (error) {
      console.error('❌ Error parsing document:', error.message);
      throw error;
    }
  }

  extractSolutionData(text, html = '') {
    const solution = {
      // Core fields
      solution_title: this.extractField(text, this.patterns.title) || 'Untitled Solution',
      applicable_countries: this.extractArrayField(text, this.patterns.countries),
      applicable_challenges: this.extractArrayField(text, this.patterns.challenges),
      climate_potential: parseInt(this.extractField(text, this.patterns.climate_potential)) || 5,
      key_agroeco: this.extractArrayField(text, this.patterns.agroecology),
      external_references: [],

      // Problem/Solution
      executive_summary_text: this.extractField(text, this.patterns.executive_summary),
      problem_title: this.extractField(text, this.patterns.problem_title),
      solution_title_field: this.extractField(text, this.patterns.solution_title),

      // Resources (with hyperlink conversion)
      resources_technicalguides: this.processFieldWithHyperlinks(text, this.patterns.technical_guides),
      resources_digitaltools: this.processFieldWithHyperlinks(text, this.patterns.digital_tools),
      resources_researchpublications: this.processFieldWithHyperlinks(text, this.patterns.research_publications),
      resources_trainingmaterials: this.processFieldWithHyperlinks(text, this.patterns.training_materials),
      impact_text: this.processFieldWithHyperlinks(text, this.patterns.impact),

      // Role-specific content (summary sentences from dedicated section)
      ...this.extractRoleSummarySentences(text),

      // Role-specific detailed text (from dedicated section with hyperlink conversion)
      ...this.extractRoleContentText(text, html),
    };

    // Extract bullet points
    const problemBullets = this.extractBulletPoints(text, this.patterns.problem_bullets);
    const solutionBullets = this.extractBulletPoints(text, this.patterns.solution_bullets);

    // Assign bullet points to numbered fields
    for (let i = 1; i <= 4; i++) {
      solution[`problem_bulletpoint_${i}`] = problemBullets[i - 1] || '';
      solution[`solution_bulletpoint_${i}`] = solutionBullets[i - 1] || '';
    }

    return solution;
  }

  extractField(text, pattern) {
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
  }

  extractArrayField(text, pattern) {
    const field = this.extractField(text, pattern);
    if (!field) return [];

    return field.split(/[,;]/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  extractBulletPoints(text, pattern) {
    const match = text.match(pattern);
    if (!match) return [];

    return match[1]
      .split('\n')
      .map(line => line.replace(/^\s*[-•*]\s*/, '').trim())
      .filter(line => line.length > 0);
  }

  extractRoleSummary(text, pattern) {
    const fullText = this.extractField(text, pattern);
    if (!fullText) return '';

    // Extract first sentence as summary
    const sentences = fullText.split(/[.!?]+/);
    return sentences[0] ? sentences[0].trim() + '.' : '';
  }

  convertUrlsToHyperlinks(text) {
    if (!text) return '';

    console.log(`      🔗 Converting URLs to hyperlinks in text (${text.length} chars)...`);

    // If text already contains HTML links, skip processing to avoid double-encoding
    if (text.includes('<a href=')) {
      console.log(`      ℹ️  Text already contains HTML links, skipping conversion`);
      return text;
    }

    // Pattern to match URLs
    const urlPattern = /(https?:\/\/[^\s\)]+)/g;

    // Pattern to match text with URL in parentheses like "Manual (https://example.com)"
    const textWithUrlPattern = /([^(]+)\s*\((https?:\/\/[^\s\)]+)\)/g;

    // Pattern to match Word field codes like { HYPERLINK "https://example.com" }
    const fieldCodePattern = /\{\s*HYPERLINK\s+"([^"]+)"\s*\}/g;

    // Pattern to match Word field codes with display text like { HYPERLINK "https://example.com" \o "Display Text" }
    const fieldCodeWithTextPattern = /\{\s*HYPERLINK\s+"([^"]+)"\s*\\o\s+"([^"]+)"\s*\}/g;

    let linkCount = 0;

    // First, handle Word field codes with display text
    let result = text.replace(fieldCodeWithTextPattern, (match, url, displayText) => {
      linkCount++;
      console.log(`        📎 Converting field code: { HYPERLINK "${url}" \\o "${displayText}" } → hyperlink`);
      return `<a href="${url}" target="_blank">${displayText}</a>`;
    });

    // Then handle simple Word field codes
    result = result.replace(fieldCodePattern, (match, url) => {
      linkCount++;
      console.log(`        📎 Converting field code: { HYPERLINK "${url}" } → hyperlink`);
      return `<a href="${url}" target="_blank">${url}</a>`;
    });

    // Then handle text with URLs in parentheses - convert to proper hyperlinks
    result = result.replace(textWithUrlPattern, (match, linkText, url) => {
      linkCount++;
      console.log(`        📎 Converting: "${linkText.trim()} (${url})" → hyperlink`);
      return `<a href="${url}" target="_blank">${linkText.trim()}</a>`;
    });

    // Finally handle any remaining standalone URLs that haven't been processed
    const processedUrls = new Set();
    result = result.replace(urlPattern, (match) => {
      // Skip if we already processed this URL
      if (processedUrls.has(match)) {
        return match;
      }

      processedUrls.add(match);
      linkCount++;
      console.log(`        🌐 Converting standalone URL: ${match} → hyperlink`);
      return `<a href="${match}" target="_blank">${match}</a>`;
    });

    if (linkCount > 0) {
      console.log(`      ✅ Converted ${linkCount} URLs to hyperlinks`);
    } else {
      console.log(`      ℹ️  No URLs found to convert`);
    }

    return result;
  }

  processFieldWithHyperlinks(text, pattern) {
    const field = this.extractField(text, pattern);
    return this.convertUrlsToHyperlinks(field);
  }

  extractRoleSummarySentences(text) {
    console.log('\n🔍 Extracting Role Summary Sentences...');
    const summarySection = this.extractField(text, this.patterns.role_summary_section);
    const roleSummaries = {};

    if (summarySection) {
      console.log(`✅ Found ROLE-SPECIFIC SUMMARY SENTENCE section (${summarySection.length} chars)`);
      console.log(`📄 Full section content:`);
      console.log(`"${summarySection}"`);
      console.log(`📄 Section preview: ${summarySection.substring(0, 200)}...`);

      const roles = [
        { key: 'funder_summarysentence', patterns: ['Funder'] },
        { key: 'policymaker_summarysentence', patterns: ['Policymaker'] },
        { key: 'farmer_summarysentence', patterns: ['Farmer'] },
        { key: 'student_summarysentence', patterns: ['Student'] },
        { key: 'extensionofficer_summarysentence', patterns: ['Extension'] },
        { key: 'researcher_summarysentence', patterns: ['Researcher'] },
        { key: 'devpractitioner_summarysentence', patterns: ['Development'] },
        { key: 'businessowner_summarysentence', patterns: ['Business'] }
      ];

      roles.forEach(role => {
        const rolePattern = new RegExp(`(?:${role.patterns.join('|')})\\s*:?\\s*(.+?)(?:\\n|$)`, 'i');
        const match = summarySection.match(rolePattern);
        const extracted = match ? match[1].trim() : '';
        roleSummaries[role.key] = extracted;

        console.log(`  ${extracted ? '✅' : '❌'} ${role.key}: ${extracted || 'NOT FOUND'}`);
      });
    } else {
      console.log('❌ ROLE-SPECIFIC SUMMARY SENTENCE section not found');
    }

    return roleSummaries;
  }

  extractRoleContentText(text, html = '') {
    console.log('\n🔍 Extracting Role Content Text...');
    const contentSection = this.extractField(text, this.patterns.role_content_section);

    // Also try to extract from HTML to preserve hyperlinks
    const htmlContentSection = html ? this.extractField(html, this.patterns.role_content_section) : '';

    const roleTexts = {};

    if (contentSection) {
      console.log(`✅ Found ROLE-SPECIFIC CONTENT section (${contentSection.length} chars)`);
      console.log(`📄 Full section content:`);
      console.log(`"${contentSection}"`);
      console.log(`📄 Section preview: ${contentSection.substring(0, 200)}...`);

      if (htmlContentSection) {
        console.log(`🔗 HTML section found (${htmlContentSection.length} chars) - will preserve hyperlinks`);
      }

      const roles = [
        { key: 'funder_text', patterns: ['Funder'] },
        { key: 'policymaker_text', patterns: ['Policymaker'] },
        { key: 'farmer_text', patterns: ['Farmer'] },
        { key: 'student_text', patterns: ['Student'] },
        { key: 'extensionofficer_text', patterns: ['Extension'] },
        { key: 'researcher_text', patterns: ['Researcher'] },
        { key: 'devpractitioner_text', patterns: ['Development'] },
        { key: 'businessowner_text', patterns: ['Business'] }
      ];

      roles.forEach(role => {
        // Pattern that matches role name followed by content until next role or end
        const rolePattern = new RegExp(`(${role.patterns.join('|')})\\s*:\\s*(.*?)(?=\\n(?:Funder|Policymaker|Farmer|Student|Extension|Researcher|Development|Business)\\s*:|$)`, 'is');

        // Try HTML first (preserves hyperlinks), fallback to text
        let rawText = '';
        let hasHyperlinks = false;

        if (htmlContentSection) {
          const htmlMatch = htmlContentSection.match(rolePattern);
          if (htmlMatch) {
            rawText = htmlMatch[2].trim();
            hasHyperlinks = rawText.includes('<a href=');
          }
        }

        // Fallback to text extraction if HTML didn't work
        if (!rawText) {
          const textMatch = contentSection.match(rolePattern);
          rawText = textMatch ? textMatch[2].trim() : '';
        }

        // Only run URL conversion if we don't already have HTML links
        const finalText = hasHyperlinks ? rawText : this.convertUrlsToHyperlinks(rawText);
        roleTexts[role.key] = finalText;

        console.log(`  ${rawText ? '✅' : '❌'} ${role.key}:`);
        if (rawText) {
          console.log(`    📝 Raw: ${rawText.substring(0, 100)}${rawText.length > 100 ? '...' : ''}`);
          if (hasHyperlinks) {
            console.log(`    🔗 HTML hyperlinks preserved`);
          } else if (finalText !== rawText) {
            console.log(`    🔗 With links: ${finalText.substring(0, 100)}${finalText.length > 100 ? '...' : ''}`);
          }
        }
      });
    } else {
      console.log('❌ ROLE-SPECIFIC CONTENT section not found');
    }

    return roleTexts;
  }

  async saveToDatabase(solution) {
    try {
      console.log(`💾 Saving solution to database: ${solution.solution_title}`);

      const { data, error } = await supabase
        .from('solutions')
        .insert(solution)
        .select('id')
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      console.log(`✅ Solution saved with ID: ${data.id}`);

      // Create images for the solution if they exist locally
      await this.createSolutionImages(data.id, solution.solution_title);

      return data.id;
    } catch (error) {
      console.error('❌ Error saving to database:', error.message);
      throw error;
    }
  }

  async createSolutionImages(solutionId, solutionTitle) {
    try {
      console.log(`🖼️ Creating images for solution: ${solutionTitle}`);

      // Extract the key term for folder name (e.g., "Banana" from "Climate Smart Package: Banana and Plantains")
      const folderName = this.extractFolderName(solutionTitle);
      const basePath = `/Users/sledermann/Development/iita_solutions/images of solutions/${folderName}`;

      const fs = require('fs');
      const path = require('path');

      const images = [];

      // Check for each image type
      const imageTypes = [
        { type: 'title_image', filename: 'title.png', color: '4F46E5' },
        { type: 'problem_image', filename: 'problem.jpg', color: 'DC2626' },
        { type: 'solution_image', filename: 'solution.jpg', color: '059669' }
      ];

      for (const imageType of imageTypes) {
        const imagePath = path.join(basePath, imageType.filename);

        let imageUrl;
        if (fs.existsSync(imagePath)) {
          // Use local file path for now - could be updated to upload to cloud storage later
          imageUrl = imagePath;
          console.log(`  ✅ Found local image: ${imagePath}`);
        } else {
          // Fallback to placeholder
          imageUrl = `https://via.placeholder.com/600x400/${imageType.color}/FFFFFF?text=${encodeURIComponent(imageType.type.replace('_', ' '))}`;
          console.log(`  ⚠️ Local image not found, using placeholder: ${imagePath}`);
        }

        images.push({
          solution_id: solutionId,
          image_url: imageUrl,
          image_type: imageType.type
        });
      }

      const { error } = await supabase
        .from('solution_images')
        .insert(images);

      if (error) {
        console.warn(`⚠️ Warning: Could not create images: ${error.message}`);
      } else {
        console.log(`✅ Created ${images.length} images for solution`);
      }
    } catch (error) {
      console.warn(`⚠️ Warning: Error creating images: ${error.message}`);
    }
  }

  extractFolderName(solutionTitle) {
    // Extract key terms from solution title for folder naming
    // e.g., "Climate Smart Package: Banana and Plantains" -> "Banana"
    const title = solutionTitle.toLowerCase();

    if (title.includes('banana')) return 'Banana';
    if (title.includes('cassava')) return 'Cassava';
    if (title.includes('yam')) return 'Yam';
    if (title.includes('soybean')) return 'Soybean';

    // Default: use first word after colon or first significant word
    const parts = solutionTitle.split(':');
    if (parts.length > 1) {
      const afterColon = parts[1].trim().split(' ')[0];
      return afterColon.charAt(0).toUpperCase() + afterColon.slice(1);
    }

    return solutionTitle.split(' ')[0];
  }
}

async function parseWordDocument(filePath) {
  try {
    const parser = new WordDocumentParser();

    // Parse the document
    const solution = await parser.parseDocument(filePath);

    console.log('\n📋 Extracted Solution Data:');
    console.log('═'.repeat(50));
    console.log(`Title: ${solution.solution_title}`);
    console.log(`Countries: ${solution.applicable_countries.join(', ')}`);
    console.log(`Challenges: ${solution.applicable_challenges.join(', ')}`);
    console.log(`Climate Potential: ${solution.climate_potential}/10`);
    console.log(`Executive Summary: ${solution.executive_summary_text?.substring(0, 100)}...`);

    // Ask user if they want to save to database
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      readline.question('\n💾 Save this solution to database? (y/n): ', resolve);
    });

    readline.close();

    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      const solutionId = await parser.saveToDatabase(solution);
      console.log(`\n🎉 Solution successfully imported with ID: ${solutionId}`);
    } else {
      console.log('\n📄 Solution data extracted but not saved to database.');

      // Optionally save as JSON for review
      const jsonFile = filePath.replace(/\.(docx?|doc)$/i, '_parsed.json');
      fs.writeFileSync(jsonFile, JSON.stringify(solution, null, 2));
      console.log(`💾 Solution data saved as: ${jsonFile}`);
    }

  } catch (error) {
    console.error('❌ Parse failed:', error.message);
    process.exit(1);
  }
}

// Run the parser
const filename = process.argv[2];
if (!filename) {
  console.error('❌ Please provide a Word document file path');
  console.log('Usage: node parse_word_document.js document.docx');
  process.exit(1);
}

parseWordDocument(filename);