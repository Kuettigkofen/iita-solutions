-- Create images table for solution visuals
-- Run this in your Supabase SQL Editor

CREATE TABLE solution_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  solution_id UUID NOT NULL REFERENCES solutions(id) ON DELETE CASCADE,
  image_type TEXT NOT NULL CHECK (image_type IN ('title_image', 'problem_image', 'solution_image')),
  image_url TEXT NOT NULL,
  image_caption TEXT,
  image_alt_text TEXT,
  image_source TEXT,
  image_credits TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add external references field to solutions table
ALTER TABLE solutions
ADD COLUMN external_references TEXT[];

-- Create indexes for better performance
CREATE INDEX idx_solution_images_solution_id ON solution_images (solution_id);
CREATE INDEX idx_solution_images_type ON solution_images (image_type);

-- Enable Row Level Security
ALTER TABLE solution_images ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Enable read access for all users" ON solution_images FOR SELECT USING (true);

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_solution_images_updated_at
    BEFORE UPDATE ON solution_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();