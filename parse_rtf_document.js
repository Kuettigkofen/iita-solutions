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

class RTFDocumentParser {
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

      // Role-specific summary sentences section
      role_summary_section: /ROLE-SPECIFIC SUMMARY SENTENCE[S]?\s*:?\s*\n((?:.|\n)*?)(?=\n\n[A-Z][A-Z\s-]+\n|$)/i,

      // Role-specific content section
      role_content_section: /ROLE-SPECIFIC CONTENT\s*:?\s*\n((?:.|\n)*?)(?=\n\n[A-Z][A-Z\s-]+\n|$)/i,
    };
  }

  async parseDocument(filePath) {
    try {
      console.log(`📄 Parsing RTF document: ${filePath}`);

      // Read RTF file as text
      const rtfContent = fs.readFileSync(filePath, 'utf8');
      console.log(`📝 RTF file loaded: ${rtfContent.length} characters`);

      // Clean RTF content to extract plain text and hyperlinks
      const { text, hyperlinks } = this.cleanRTFContent(rtfContent);
      console.log(`🔗 Found ${hyperlinks.length} hyperlinks in RTF`);

      // Parse the document structure
      const solution = this.extractSolutionData(text, hyperlinks);

      return solution;
    } catch (error) {
      console.error('❌ Error parsing document:', error.message);
      throw error;
    }
  }

  cleanRTFContent(rtfContent) {
    console.log('🧹 Cleaning RTF content and extracting hyperlinks...');

    // Extract hyperlinks from RTF
    const hyperlinkPattern = /HYPERLINK\s+"([^"]+)"[^}]*}[^}]*}[^{]*{[^}]*}([^}]*)/g;
    const hyperlinks = [];
    let match;

    while ((match = hyperlinkPattern.exec(rtfContent)) !== null) {
      const url = match[1];
      const text = match[2] ? match[2].replace(/\\[a-z]+\d*\s*/g, '').trim() : url;
      hyperlinks.push({ url, text });
    }

    // Clean RTF to get plain text
    let text = rtfContent
      // Remove RTF control sequences
      .replace(/\\[a-z]+\d*\s*/g, ' ')
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      // Remove RTF formatting
      .replace(/[{}]/g, '')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .replace(/\n\s+/g, '\n')
      .trim();

    console.log(`✅ Extracted ${hyperlinks.length} hyperlinks and cleaned text (${text.length} chars)`);
    hyperlinks.forEach((link, i) => {
      console.log(`  ${i + 1}. "${link.text}" → ${link.url}`);
    });

    return { text, hyperlinks };
  }

  extractSolutionData(text, hyperlinks) {
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

      // Resources (with hyperlink integration)
      resources_technicalguides: this.processFieldWithHyperlinks(text, this.patterns.technical_guides, hyperlinks),
      resources_digitaltools: this.processFieldWithHyperlinks(text, this.patterns.digital_tools, hyperlinks),
      resources_researchpublications: this.processFieldWithHyperlinks(text, this.patterns.research_publications, hyperlinks),
      resources_trainingmaterials: this.processFieldWithHyperlinks(text, this.patterns.training_materials, hyperlinks),
      impact_text: this.processFieldWithHyperlinks(text, this.patterns.impact, hyperlinks),

      // Role-specific content
      ...this.extractRoleSummarySentences(text),
      ...this.extractRoleContentText(text, hyperlinks),
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

  processFieldWithHyperlinks(text, pattern, hyperlinks) {
    const field = this.extractField(text, pattern);
    return this.addHyperlinksToText(field, hyperlinks);
  }

  addHyperlinksToText(text, hyperlinks) {
    if (!text || !hyperlinks.length) return text;

    let result = text;
    hyperlinks.forEach(link => {
      if (text.includes(link.text)) {
        result = result.replace(new RegExp(link.text, 'g'),
          `<a href="${link.url}" target="_blank">${link.text}</a>`);
      }
    });

    return result;
  }

  extractRoleSummarySentences(text) {
    console.log('\n🔍 Extracting Role Summary Sentences...');
    const summarySection = this.extractField(text, this.patterns.role_summary_section);
    const roleSummaries = {};

    if (summarySection) {
      console.log(`✅ Found ROLE-SPECIFIC SUMMARY SENTENCE section (${summarySection.length} chars)`);

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

  extractRoleContentText(text, hyperlinks) {
    console.log('\n🔍 Extracting Role Content Text...');
    const contentSection = this.extractField(text, this.patterns.role_content_section);
    const roleTexts = {};

    if (contentSection) {
      console.log(`✅ Found ROLE-SPECIFIC CONTENT section (${contentSection.length} chars)`);

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
        const rolePattern = new RegExp(`(${role.patterns.join('|')})\\s*:\\s*(.*?)(?=\\n(?:Funder|Policymaker|Farmer|Student|Extension|Researcher|Development|Business)\\s*:|$)`, 'is');
        const match = contentSection.match(rolePattern);
        const rawText = match ? match[2].trim() : '';
        const textWithLinks = this.addHyperlinksToText(rawText, hyperlinks);
        roleTexts[role.key] = textWithLinks;

        console.log(`  ${rawText ? '✅' : '❌'} ${role.key}:`);
        if (rawText) {
          const linkCount = (textWithLinks.match(/<a href=/g) || []).length;
          console.log(`    📝 Raw: ${rawText.substring(0, 100)}${rawText.length > 100 ? '...' : ''}`);
          if (linkCount > 0) {
            console.log(`    🔗 Added ${linkCount} hyperlinks`);
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

async function parseRTFDocument(filePath) {
  try {
    const parser = new RTFDocumentParser();

    // Parse the document
    const solution = await parser.parseDocument(filePath);

    console.log('\n📋 Extracted Solution Data:');
    console.log('═'.repeat(50));
    console.log(`Title: ${solution.solution_title}`);
    console.log(`Countries: ${solution.applicable_countries.join(', ')}`);
    console.log(`Challenges: ${solution.applicable_challenges.join(', ')}`);
    console.log(`Climate Potential: ${solution.climate_potential}/10`);

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

      // Save as JSON for review
      const jsonFile = filePath.replace(/\.(rtf)$/i, '_parsed.json');
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
  console.error('❌ Please provide an RTF document file path');
  console.log('Usage: node parse_rtf_document.js document.rtf');
  process.exit(1);
}

parseRTFDocument(filename);