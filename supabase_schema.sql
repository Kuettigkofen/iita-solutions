-- IITA Solutions Database Schema
-- Run these commands in your Supabase SQL Editor

-- Table for storing solution data with role-specific content
CREATE TABLE solutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  solution_title TEXT NOT NULL,
  applicable_countries TEXT[] NOT NULL DEFAULT '{}',
  applicable_challenges TEXT[] NOT NULL DEFAULT '{}',
  executive_summary_text TEXT,
  problem_title TEXT,
  problem_bulletpoint_1 TEXT,
  problem_bulletpoint_2 TEXT,
  problem_bulletpoint_3 TEXT,
  problem_bulletpoint_4 TEXT,
  solution_title_field TEXT,
  solution_bulletpoint_1 TEXT,
  solution_bulletpoint_2 TEXT,
  solution_bulletpoint_3 TEXT,
  solution_bulletpoint_4 TEXT,
  resources_technicalguides TEXT,
  resources_digitaltools TEXT,
  resources_researchpublications TEXT,
  resources_trainingmaterials TEXT,
  impact_text TEXT,

  -- Role-specific content fields
  funder_text TEXT,
  policymaker_text TEXT,
  farmer_text TEXT,
  student_text TEXT,
  extensionofficer_text TEXT,
  researcher_text TEXT,
  devpractitioner_text TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table for country neighbor relationships
CREATE TABLE countries_neighbors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_name TEXT NOT NULL UNIQUE,
  neighbor_countries TEXT[] NOT NULL DEFAULT '{}',
  region TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table for tracking user selections (optional - for analytics)
CREATE TABLE user_selections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role_type TEXT,
  challenge_type TEXT,
  location_type TEXT,
  custom_role_text TEXT,
  custom_challenge_text TEXT,
  custom_location_text TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert country neighbor data for Sub-Saharan Africa
INSERT INTO countries_neighbors (country_name, neighbor_countries, region) VALUES
-- West Africa
('Nigeria', ARRAY['Ghana', 'Cameroon', 'Niger', 'Benin'], 'West_Africa'),
('Ghana', ARRAY['Nigeria', 'Burkina Faso', 'Mali', 'Togo', 'Cote dIvoire'], 'West_Africa'),
('Mali', ARRAY['Ghana', 'Burkina Faso', 'Niger', 'Senegal', 'Guinea'], 'West_Africa'),
('Burkina Faso', ARRAY['Ghana', 'Mali', 'Niger', 'Togo', 'Benin'], 'West_Africa'),
('Cameroon', ARRAY['Nigeria', 'Chad', 'Central African Republic', 'Equatorial Guinea'], 'Central_Africa'),

-- East Africa
('Kenya', ARRAY['Tanzania', 'Uganda', 'Ethiopia', 'Somalia', 'South Sudan'], 'East_Africa'),
('Tanzania', ARRAY['Kenya', 'Uganda', 'Rwanda', 'Burundi', 'Mozambique', 'Zambia'], 'East_Africa'),
('Uganda', ARRAY['Kenya', 'Tanzania', 'Rwanda', 'South Sudan', 'Democratic Republic of Congo'], 'East_Africa'),
('Ethiopia', ARRAY['Kenya', 'Sudan', 'South Sudan', 'Somalia'], 'East_Africa'),
('Rwanda', ARRAY['Uganda', 'Tanzania', 'Burundi', 'Democratic Republic of Congo'], 'East_Africa'),
('Burundi', ARRAY['Rwanda', 'Tanzania', 'Democratic Republic of Congo'], 'East_Africa'),

-- Southern Africa
('South Africa', ARRAY['Zimbabwe', 'Botswana', 'Namibia', 'Mozambique'], 'Southern_Africa'),
('Zimbabwe', ARRAY['South Africa', 'Botswana', 'Zambia', 'Mozambique'], 'Southern_Africa'),
('Zambia', ARRAY['Zimbabwe', 'Tanzania', 'Angola', 'Namibia', 'Botswana', 'Democratic Republic of Congo'], 'Southern_Africa'),
('Botswana', ARRAY['South Africa', 'Zimbabwe', 'Zambia', 'Namibia'], 'Southern_Africa'),
('Namibia', ARRAY['South Africa', 'Botswana', 'Zambia', 'Angola'], 'Southern_Africa'),
('Angola', ARRAY['Namibia', 'Zambia', 'Democratic Republic of Congo'], 'Southern_Africa'),
('Mozambique', ARRAY['South Africa', 'Zimbabwe', 'Tanzania', 'Zambia'], 'Southern_Africa'),
('Madagascar', ARRAY['Mozambique'], 'Southern_Africa'),

-- Central Africa
('Democratic Republic of Congo', ARRAY['Uganda', 'Rwanda', 'Burundi', 'Tanzania', 'Zambia', 'Angola', 'Central African Republic', 'Chad', 'Cameroon'], 'Central_Africa'),
('Central African Republic', ARRAY['Democratic Republic of Congo', 'Chad', 'Sudan', 'South Sudan', 'Cameroon'], 'Central_Africa'),
('Chad', ARRAY['Central African Republic', 'Democratic Republic of Congo', 'Sudan', 'Niger', 'Nigeria', 'Cameroon'], 'Central_Africa'),
('Sudan', ARRAY['Ethiopia', 'South Sudan', 'Central African Republic', 'Chad'], 'East_Africa'),
('South Sudan', ARRAY['Sudan', 'Ethiopia', 'Kenya', 'Uganda', 'Democratic Republic of Congo', 'Central African Republic'], 'East_Africa');

-- Create indexes for better query performance
CREATE INDEX idx_solutions_countries ON solutions USING GIN (applicable_countries);
CREATE INDEX idx_solutions_challenges ON solutions USING GIN (applicable_challenges);
CREATE INDEX idx_countries_neighbors_name ON countries_neighbors (country_name);
CREATE INDEX idx_countries_neighbors_region ON countries_neighbors (region);

-- Enable Row Level Security (optional - for future user authentication)
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries_neighbors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_selections ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access for now
CREATE POLICY "Enable read access for all users" ON solutions FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON countries_neighbors FOR SELECT USING (true);

-- Sample solution data for testing
INSERT INTO solutions (
  solution_title,
  applicable_countries,
  applicable_challenges,
  executive_summary_text,
  problem_title,
  problem_bulletpoint_1,
  problem_bulletpoint_2,
  solution_title_field,
  solution_bulletpoint_1,
  solution_bulletpoint_2,
  resources_technicalguides,
  impact_text,
  funder_text,
  policymaker_text,
  farmer_text,
  student_text,
  extensionofficer_text,
  researcher_text,
  devpractitioner_text
) VALUES (
  'Climate-Resilient Cocoa Farming Systems',
  ARRAY['Ghana', 'Nigeria', 'Cameroon'],
  ARRAY['cocoa'],
  'Integrated approach to building climate resilience in West African cocoa production through improved varieties, agroforestry, and sustainable farming practices.',
  'Climate Change Threatens Cocoa Production',
  'Rising temperatures reducing cocoa yields by 15-20% annually',
  'Increased pest and disease pressure from changing weather patterns',
  'Integrated Climate-Smart Cocoa Systems',
  'Deploy heat-tolerant cocoa varieties developed by IITA',
  'Implement agroforestry systems with shade trees for temperature regulation',
  'IITA Cocoa Breeding Manual, Climate-Smart Agriculture Guidelines',
  'Increased farmer incomes by 30%, improved climate resilience for 50,000 farmers',
  'ROI of 3:1 within 5 years, scalable across West Africa, eligible for climate finance',
  'Supports national climate adaptation plans, enhances food security policies',
  'Higher yields, reduced climate risk, improved income stability, better farm sustainability',
  'Hands-on learning in climate-smart agriculture, research opportunities in crop adaptation',
  'Training modules on climate-resilient practices, farmer field school curricula',
  'Research gaps in varietal adaptation, impact assessment methodologies',
  'Partnership opportunities with farmer cooperatives, implementation through existing networks'
);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_solutions_updated_at
    BEFORE UPDATE ON solutions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();