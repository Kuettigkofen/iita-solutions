const XLSX = require('xlsx');

// Create a new workbook
const wb = XLSX.utils.book_new();

// 1. SOLUTIONS SHEET - Main data entry sheet
const solutionsHeaders = [
  // Core Information
  'solution_title',
  'applicable_countries',
  'applicable_challenges',
  'climate_potential',
  'key_agroeco',

  // Problem Definition
  'executive_summary_text',
  'problem_title',
  'problem_bulletpoint_1',
  'problem_bulletpoint_2',
  'problem_bulletpoint_3',
  'problem_bulletpoint_4',

  // Solution Description
  'solution_title_field',
  'solution_bulletpoint_1',
  'solution_bulletpoint_2',
  'solution_bulletpoint_3',
  'solution_bulletpoint_4',

  // Resources & Evidence
  'resources_technicalguides',
  'resources_digitaltools',
  'resources_researchpublications',
  'resources_trainingmaterials',
  'impact_text',
  'external_references',

  // Role-Specific Summary Sentences
  'funder_summarysentence',
  'policymaker_summarysentence',
  'farmer_summarysentence',
  'student_summarysentence',
  'extensionofficer_summarysentence',
  'researcher_summarysentence',
  'devpractitioner_summarysentence',
  'businessowner_summarysentence',

  // Role-Specific Detailed Text
  'funder_text',
  'policymaker_text',
  'farmer_text',
  'student_text',
  'extensionofficer_text',
  'researcher_text',
  'devpractitioner_text',
  'businessowner_text'
];

// Create example row with descriptions
const solutionExample = [
  'KABANA 6H Banana Variety',
  'Nigeria, Ghana, Cameroon',
  'banana, disease_resistance, climate_resilience',
  '7',
  'Tropic - warm subhumid, Subtropical - cool subhumid',

  'High-yielding, disease-resistant banana variety developed by IITA for climate resilience. Provides farmers with sustainable income opportunities while adapting to changing weather patterns.',
  'Banana Bacterial Wilt and Climate Stress',
  'Rising temperatures and irregular rainfall affecting banana production',
  'Bacterial wilt disease destroying entire plantations',
  'Limited access to climate-resilient banana varieties',
  'Declining farmer incomes due to crop losses',

  'KABANA 6H Climate-Resilient Banana System',
  'Deploy KABANA 6H variety with enhanced disease resistance',
  'Implement climate-smart cultivation practices',
  'Establish community-based seed multiplication systems',
  'Provide farmer training on integrated pest management',

  'IITA Banana Breeding Manual, Climate-Smart Agriculture Guidelines',
  'IITA Banana App, Digital pest monitoring tools',
  'CGIAR banana research publications, Impact assessment studies',
  'Farmer field school curricula, Extension officer training materials',
  'Increased farmer incomes by 40%, improved climate resilience for 15,000 farmers',
  'FAO banana guidelines, CGIAR research papers',

  'ROI of 4:1 within 3 years, scalable across West Africa, eligible for climate finance',
  'Supports national food security policies, enhances agricultural productivity',
  'Higher yields, reduced disease risk, improved income stability',
  'Research opportunities in banana genetics, hands-on agricultural training',
  'Training modules on disease management, farmer demonstration plots',
  'Research gaps in climate adaptation, breeding program methodologies',
  'Partnership opportunities with farmer cooperatives, scaling strategies',
  'Market opportunities in banana value chain, certified planting material business'
];

// Create solutions worksheet
const solutionsData = [solutionsHeaders, solutionExample];
const solutionsWS = XLSX.utils.aoa_to_sheet(solutionsData);

// Set column widths for better readability
const solutionsColWidths = solutionsHeaders.map(header => {
  if (header.includes('_text') || header.includes('_bulletpoint')) return { wch: 50 };
  if (header.includes('summary')) return { wch: 40 };
  if (header.includes('resources')) return { wch: 45 };
  return { wch: 25 };
});
solutionsWS['!cols'] = solutionsColWidths;

XLSX.utils.book_append_sheet(wb, solutionsWS, 'Solutions');

// 2. IMAGES SHEET - For solution images
const imagesHeaders = [
  'solution_title', // Reference to link with solutions sheet
  'image_type', // title_image, problem_image, solution_image
  'image_url',
  'image_caption',
  'image_alt_text',
  'image_source',
  'image_credits'
];

const imagesExample = [
  'KABANA 6H Banana Variety',
  'title_image',
  'https://e-catalogs.taat-africa.org/images/preview/lHUXwF1Le1Kt6J20MfYcVGyOu6yTxhnovYegHL66.png',
  'KABANA 6H banana plants showing disease resistance',
  'Healthy KABANA 6H banana plantation with green leaves',
  'TAAT Africa e-catalog',
  'IITA/TAAT Program'
];

const imagesData = [imagesHeaders, imagesExample];
const imagesWS = XLSX.utils.aoa_to_sheet(imagesData);

// Set column widths
imagesWS['!cols'] = [
  { wch: 30 }, // solution_title
  { wch: 15 }, // image_type
  { wch: 60 }, // image_url
  { wch: 40 }, // image_caption
  { wch: 40 }, // image_alt_text
  { wch: 25 }, // image_source
  { wch: 25 }  // image_credits
];

XLSX.utils.book_append_sheet(wb, imagesWS, 'Images');

// 3. COUNTRIES REFERENCE SHEET
const countriesData = [
  ['Country Name'],
  ['Nigeria'], ['Ghana'], ['Kenya'], ['Tanzania'], ['Uganda'],
  ['Ethiopia'], ['Rwanda'], ['Burundi'], ['South Africa'], ['Zimbabwe'],
  ['Zambia'], ['Botswana'], ['Namibia'], ['Angola'], ['Mozambique'],
  ['Madagascar'], ['Cameroon'], ['Chad'], ['Central African Republic'],
  ['Democratic Republic of Congo'], ['Mali'], ['Burkina Faso'], ['Sudan'],
  ['South Sudan']
];

const countriesWS = XLSX.utils.aoa_to_sheet(countriesData);
countriesWS['!cols'] = [{ wch: 25 }];
XLSX.utils.book_append_sheet(wb, countriesWS, 'Countries Reference');

// 4. CHALLENGES REFERENCE SHEET
const challengesData = [
  ['Challenge Type'],
  ['agroecology'], ['agroforestry'], ['aquaculture'], ['banana'], ['beans'],
  ['beekeeping'], ['biofortification'], ['cassava'], ['climate_information'],
  ['climate_resilience'], ['cocoa'], ['coffee'], ['cotton'], ['digital_services'],
  ['farmer_training'], ['greenhouse'], ['livestock'], ['maize'], ['mushroom'],
  ['nutrition'], ['pest_management'], ['plantain'], ['processing'], ['rice'],
  ['seed_systems'], ['soil_health'], ['soybean'], ['sweet_potato'], ['tomato'],
  ['vegetables'], ['water_management'], ['yam']
];

const challengesWS = XLSX.utils.aoa_to_sheet(challengesData);
challengesWS['!cols'] = [{ wch: 20 }];
XLSX.utils.book_append_sheet(wb, challengesWS, 'Challenges Reference');

// 5. ROLES REFERENCE SHEET
const rolesData = [
  ['Role Type'],
  ['funder'], ['policymaker'], ['farmer'], ['student'],
  ['extensionofficer'], ['researcher'], ['devpractitioner'], ['businessowner']
];

const rolesWS = XLSX.utils.aoa_to_sheet(rolesData);
rolesWS['!cols'] = [{ wch: 20 }];
XLSX.utils.book_append_sheet(wb, rolesWS, 'Roles Reference');

// 6. AGRO-ECOLOGICAL ZONES REFERENCE SHEET
const agroEcoData = [
  ['Agro-Ecological Zone'],
  ['Tropic - warm arid'], ['Tropic - warm semi-arid'], ['Tropic - warm subhumid'],
  ['Tropic - warm humid'], ['Tropic - cool arid'], ['Tropic - cool semi-arid'],
  ['Tropic - cool subhumid'], ['Tropic - cool humid'], ['Subtropical - warm arid'],
  ['Subtropical - warm semi-arid'], ['Subtropical - warm subhumid'],
  ['Subtropical - warm humid'], ['Subtropical - cool arid'],
  ['Subtropical - cool semi-arid'], ['Subtropical - cool subhumid'],
  ['Subtropical - cool humid'], ['Temperate - warm arid'],
  ['Temperate - warm semi-arid'], ['Temperate - warm subhumid'],
  ['Temperate - warm humid'], ['Temperate - cool arid']
];

const agroEcoWS = XLSX.utils.aoa_to_sheet(agroEcoData);
agroEcoWS['!cols'] = [{ wch: 30 }];
XLSX.utils.book_append_sheet(wb, agroEcoWS, 'AgroEco Zones Reference');

// 7. INSTRUCTIONS SHEET
const instructionsData = [
  ['IITA Solutions Excel Template - Instructions'],
  [''],
  ['HOW TO USE THIS TEMPLATE:'],
  [''],
  ['1. SOLUTIONS SHEET (Main Data Entry)'],
  ['   - Fill one row per solution'],
  ['   - Use comma-separated values for arrays (countries, challenges, etc.)'],
  ['   - Climate potential: Enter number 0-10'],
  ['   - Reference other sheets for valid values'],
  [''],
  ['2. IMAGES SHEET'],
  ['   - Add 3 rows per solution (title_image, problem_image, solution_image)'],
  ['   - solution_title must match exactly with Solutions sheet'],
  ['   - image_type must be: title_image, problem_image, or solution_image'],
  [''],
  ['3. REFERENCE SHEETS'],
  ['   - Use these for valid values in dropdown fields'],
  ['   - Countries: Valid country names'],
  ['   - Challenges: Valid challenge types'],
  ['   - Roles: Valid role types for role-specific content'],
  ['   - AgroEco Zones: Valid agro-ecological zone names'],
  [''],
  ['IMPORTANT NOTES:'],
  ['- Keep solution_title consistent across Solutions and Images sheets'],
  ['- Use exact values from reference sheets'],
  ['- For arrays, separate multiple values with commas'],
  ['- Required fields: solution_title, applicable_countries, applicable_challenges'],
  ['- Climate potential must be 0-10'],
  ['- Each solution needs exactly 3 images'],
  [''],
  ['EXAMPLE FORMATS:'],
  ['Countries: "Nigeria, Ghana, Kenya"'],
  ['Challenges: "banana, climate_resilience, pest_management"'],
  ['AgroEco: "Tropic - warm subhumid, Subtropical - cool humid"'],
  ['External References: "FAO guidelines, CGIAR papers"']
];

const instructionsWS = XLSX.utils.aoa_to_sheet(instructionsData);
instructionsWS['!cols'] = [{ wch: 80 }];
XLSX.utils.book_append_sheet(wb, instructionsWS, 'Instructions');

// Write the file
XLSX.writeFile(wb, 'IITA_Solutions_Template.xlsx');

console.log('✅ Excel template created: IITA_Solutions_Template.xlsx');
console.log('');
console.log('📊 Sheets included:');
console.log('  1. Solutions - Main data entry (39 columns)');
console.log('  2. Images - Solution images (7 columns)');
console.log('  3. Countries Reference - Valid country names');
console.log('  4. Challenges Reference - Valid challenge types');
console.log('  5. Roles Reference - Valid role types');
console.log('  6. AgroEco Zones Reference - Valid zones');
console.log('  7. Instructions - How to use the template');
console.log('');
console.log('💡 Next steps:');
console.log('  1. Open IITA_Solutions_Template.xlsx');
console.log('  2. Fill in your solution data');
console.log('  3. Use the import script to load into database');