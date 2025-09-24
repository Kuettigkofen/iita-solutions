const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importExcelData(filename = 'IITA_Solutions_Template.xlsx') {
  try {
    console.log(`📂 Reading Excel file: ${filename}`);

    // Read the workbook
    const workbook = XLSX.readFile(filename);

    // Get Solutions sheet
    const solutionsSheet = workbook.Sheets['Solutions'];
    if (!solutionsSheet) {
      throw new Error('Solutions sheet not found in Excel file');
    }

    // Convert to JSON (skip header row)
    const solutionsData = XLSX.utils.sheet_to_json(solutionsSheet);

    // Get Images sheet
    const imagesSheet = workbook.Sheets['Images'];
    let imagesData = [];
    if (imagesSheet) {
      imagesData = XLSX.utils.sheet_to_json(imagesSheet);
    }

    console.log(`📊 Found ${solutionsData.length} solutions and ${imagesData.length} images`);

    // Process each solution
    for (let i = 0; i < solutionsData.length; i++) {
      const row = solutionsData[i];

      console.log(`\n🔄 Processing solution ${i + 1}: ${row.solution_title}`);

      // Convert array fields (comma-separated strings to arrays)
      const processedRow = {
        ...row,
        applicable_countries: row.applicable_countries ?
          row.applicable_countries.split(',').map(s => s.trim()) : [],
        applicable_challenges: row.applicable_challenges ?
          row.applicable_challenges.split(',').map(s => s.trim()) : [],
        key_agroeco: row.key_agroeco ?
          row.key_agroeco.split(',').map(s => s.trim()) : [],
        external_references: row.external_references ?
          row.external_references.split(',').map(s => s.trim()) : [],
        climate_potential: parseInt(row.climate_potential) || 5
      };

      // Insert solution
      const { data: solution, error: solutionError } = await supabase
        .from('solutions')
        .insert(processedRow)
        .select('id')
        .single();

      if (solutionError) {
        console.error(`❌ Error inserting solution: ${solutionError.message}`);
        continue;
      }

      console.log(`✅ Solution inserted with ID: ${solution.id}`);

      // Process images for this solution
      const solutionImages = imagesData.filter(img =>
        img.solution_title === row.solution_title
      );

      if (solutionImages.length > 0) {
        console.log(`📷 Processing ${solutionImages.length} images for this solution`);

        const imageRecords = solutionImages.map(img => ({
          solution_id: solution.id,
          image_type: img.image_type,
          image_url: img.image_url,
          image_caption: img.image_caption || null,
          image_alt_text: img.image_alt_text || null,
          image_source: img.image_source || null,
          image_credits: img.image_credits || null
        }));

        const { error: imageError } = await supabase
          .from('solution_images')
          .insert(imageRecords);

        if (imageError) {
          console.error(`❌ Error inserting images: ${imageError.message}`);
        } else {
          console.log(`✅ ${imageRecords.length} images inserted`);
        }
      }
    }

    console.log('\n🎉 Import completed successfully!');
    console.log(`📈 Summary:`);
    console.log(`   - Solutions processed: ${solutionsData.length}`);
    console.log(`   - Images processed: ${imagesData.length}`);

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Run the import
const filename = process.argv[2] || 'IITA_Solutions_Template.xlsx';
importExcelData(filename);