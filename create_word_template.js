const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const fs = require('fs');

async function createWordTemplate() {
  console.log('📄 Creating Word document template...');

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title
        new Paragraph({
          children: [
            new TextRun({
              text: "IITA Solution Template",
              bold: true,
              size: 32,
            }),
          ],
          heading: HeadingLevel.TITLE,
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Use this template to document agricultural solutions. The parser will automatically extract data from the sections below and import it into the database.",
              italics: true,
            }),
          ],
        }),

        new Paragraph({ text: "" }), // Empty line

        // Core Information Section
        new Paragraph({
          children: [
            new TextRun({
              text: "CORE INFORMATION",
              bold: true,
              size: 28,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Title: ", bold: true }),
            new TextRun({ text: "KABANA 6H High-Yielding Disease-Resistant Banana Variety" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Countries: ", bold: true }),
            new TextRun({ text: "Nigeria, Ghana, Cameroon, Kenya, Uganda" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Challenges: ", bold: true }),
            new TextRun({ text: "banana, disease_resistance, climate_resilience, yield_improvement" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Climate Potential: ", bold: true }),
            new TextRun({ text: "7" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Key Agroecology: ", bold: true }),
            new TextRun({ text: "Tropic - warm subhumid, Subtropical - cool humid" }),
          ],
        }),

        new Paragraph({ text: "" }),

        // Executive Summary
        new Paragraph({
          children: [
            new TextRun({
              text: "EXECUTIVE SUMMARY",
              bold: true,
              size: 28,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Executive Summary: ", bold: true }),
            new TextRun({
              text: "KABANA 6H is a high-yielding, disease-resistant banana variety developed by IITA to address food security and climate challenges in Sub-Saharan Africa. This solution provides farmers with sustainable income opportunities while building resilience against bacterial wilt and changing weather patterns."
            }),
          ],
        }),

        new Paragraph({ text: "" }),

        // Problem Section
        new Paragraph({
          children: [
            new TextRun({
              text: "PROBLEM DEFINITION",
              bold: true,
              size: 28,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Problem Title: ", bold: true }),
            new TextRun({ text: "Banana Bacterial Wilt and Climate Vulnerability" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Problem Bullets:", bold: true }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "• Rising temperatures and irregular rainfall affecting banana production across East and West Africa" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "• Banana bacterial wilt disease destroying entire plantations, causing 70% yield losses" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "• Limited access to climate-resilient banana varieties for smallholder farmers" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "• Declining farmer incomes due to crop losses and poor market access" }),
          ],
        }),

        new Paragraph({ text: "" }),

        // Solution Section
        new Paragraph({
          children: [
            new TextRun({
              text: "SOLUTION DESCRIPTION",
              bold: true,
              size: 28,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Solution Title: ", bold: true }),
            new TextRun({ text: "KABANA 6H Integrated Banana Production System" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Solution Bullets:", bold: true }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "• Deploy KABANA 6H variety with enhanced disease resistance and climate tolerance" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "• Implement climate-smart cultivation practices including mulching and water management" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "• Establish community-based seed multiplication systems for sustainable access" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "• Provide farmer training on integrated pest management and post-harvest handling" }),
          ],
        }),

        new Paragraph({ text: "" }),

        // Resources Section
        new Paragraph({
          children: [
            new TextRun({
              text: "RESOURCES & EVIDENCE",
              bold: true,
              size: 28,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Technical Guides: ", bold: true }),
            new TextRun({ text: "IITA Banana Breeding Manual, Climate-Smart Agriculture Guidelines, Disease Management Protocols" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Digital Tools: ", bold: true }),
            new TextRun({ text: "IITA Banana App for pest monitoring, Digital planting calendar, Weather information systems" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Research Publications: ", bold: true }),
            new TextRun({ text: "CGIAR banana research studies, Impact assessment papers, Breeding program documentation" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Training Materials: ", bold: true }),
            new TextRun({ text: "Farmer field school curricula, Extension officer training modules, Video demonstrations" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Impact: ", bold: true }),
            new TextRun({ text: "Increased farmer incomes by 40%, improved food security for 15,000 households, 60% reduction in crop losses from bacterial wilt" }),
          ],
        }),

        new Paragraph({ text: "" }),

        // Role-Specific Content
        new Paragraph({
          children: [
            new TextRun({
              text: "ROLE-SPECIFIC CONTENT",
              bold: true,
              size: 28,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Funder: ", bold: true }),
            new TextRun({ text: "ROI of 4:1 within 3 years, scalable across West and East Africa, eligible for climate finance mechanisms. Strong potential for impact investment with proven track record of farmer adoption and income improvement." }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Policymaker: ", bold: true }),
            new TextRun({ text: "Supports national food security policies and agricultural transformation agendas. Contributes to climate adaptation strategies and smallholder farmer empowerment goals." }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Farmer: ", bold: true }),
            new TextRun({ text: "Higher yields with reduced disease risk, improved income stability, and better market access. Simple adoption process with proven benefits for farming families." }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Student: ", bold: true }),
            new TextRun({ text: "Research opportunities in banana genetics and climate adaptation. Hands-on agricultural training and exposure to innovative breeding programs." }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Extension: ", bold: true }),
            new TextRun({ text: "Comprehensive training modules on disease management and climate-smart practices. Farmer demonstration plots and field day curricula available." }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Researcher: ", bold: true }),
            new TextRun({ text: "Research gaps in climate adaptation mechanisms and breeding program optimization. Opportunities for collaborative studies on variety performance." }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Development: ", bold: true }),
            new TextRun({ text: "Partnership opportunities with farmer cooperatives and scaling through existing development networks. Integration with nutrition and value chain programs." }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Business: ", bold: true }),
            new TextRun({ text: "Market opportunities in certified planting material business and banana value chain development. Proven demand for disease-resistant varieties." }),
          ],
        }),

        new Paragraph({ text: "" }),

        // Instructions
        new Paragraph({
          children: [
            new TextRun({
              text: "INSTRUCTIONS FOR USE",
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "1. Replace the example content above with your solution data" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "2. Keep the section headers and field labels (e.g., 'Title:', 'Countries:') intact" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "3. Use comma-separated values for countries, challenges, key agroecology, and other list fields" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "4. Save the document and run: npm run parse-word filename.docx" }),
          ],
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "5. Review the extracted data and confirm database import when prompted" }),
          ],
        }),
      ],
    }],
  });

  // Write the document
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('IITA_Solution_Template.docx', buffer);

  console.log('✅ Word template created: IITA_Solution_Template.docx');
  console.log('');
  console.log('📝 Template includes:');
  console.log('  - Example solution data (KABANA 6H)');
  console.log('  - Proper section headers and field labels');
  console.log('  - Role-specific content examples');
  console.log('  - Usage instructions');
  console.log('');
  console.log('🚀 To use:');
  console.log('  1. Open IITA_Solution_Template.docx');
  console.log('  2. Replace example content with your solution data');
  console.log('  3. Save and run: npm run parse-word filename.docx');
}

createWordTemplate().catch(console.error);