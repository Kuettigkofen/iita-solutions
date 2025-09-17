-- Verify and Update Database Schema for 13 TAAT Technologies
-- Run this BEFORE importing the complete_13_taat_technologies.sql file

-- Step 1: Check if solutions table exists and has correct structure
-- If you get errors, the table might need to be recreated

-- Step 2: Ensure solutions table has UUID primary key
-- This will add the id column if it doesn't exist
ALTER TABLE solutions
ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid();

-- Step 3: Verify all required columns exist in solutions table
-- Core fields
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS solution_title TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS applicable_countries TEXT[];
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS applicable_challenges TEXT[];

-- Problem/Solution fields
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS executive_summary_text TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS problem_title TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS problem_bulletpoint_1 TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS problem_bulletpoint_2 TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS problem_bulletpoint_3 TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS problem_bulletpoint_4 TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS solution_title_field TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS solution_bulletpoint_1 TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS solution_bulletpoint_2 TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS solution_bulletpoint_3 TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS solution_bulletpoint_4 TEXT;

-- Resources fields
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS resources_technicalguides TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS resources_digitaltools TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS resources_researchpublications TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS resources_trainingmaterials TEXT;

-- Impact fields
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS impact_text TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS climate_potential INTEGER;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS key_agroeco TEXT[];
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS external_references TEXT[];

-- Role-specific summary sentences (8 roles)
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS funder_summarysentence TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS policymaker_summarysentence TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS farmer_summarysentence TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS student_summarysentence TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS extensionofficer_summarysentence TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS researcher_summarysentence TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS devpractitioner_summarysentence TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS businessowner_summarysentence TEXT;

-- Role-specific detailed text (8 roles)
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS funder_text TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS policymaker_text TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS farmer_text TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS student_text TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS extensionofficer_text TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS researcher_text TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS devpractitioner_text TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS businessowner_text TEXT;

-- Step 4: Ensure solution_images table exists with correct structure
CREATE TABLE IF NOT EXISTS solution_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solution_id UUID REFERENCES solutions(id) ON DELETE CASCADE,
  image_type TEXT NOT NULL,
  image_url TEXT,
  image_caption TEXT,
  image_alt_text TEXT,
  image_source TEXT,
  image_credits TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Enable Row Level Security (if not already enabled)
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE solution_images ENABLE ROW LEVEL SECURITY;

-- Step 6: Create policies for public read access (if not already created)
DROP POLICY IF EXISTS "Enable read access for all users" ON solutions;
CREATE POLICY "Enable read access for all users" ON solutions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON solution_images;
CREATE POLICY "Enable read access for all users" ON solution_images
  FOR SELECT USING (true);

-- Verification queries - run these to check the schema
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'solutions' ORDER BY column_name;
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'solution_images' ORDER BY column_name;