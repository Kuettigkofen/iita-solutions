-- Create drafts table for cross-computer draft storage
CREATE TABLE IF NOT EXISTS solution_drafts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    draft_name VARCHAR(100) NOT NULL,
    author_name VARCHAR(50) NOT NULL,
    draft_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_solution_drafts_author ON solution_drafts(author_name);
CREATE INDEX IF NOT EXISTS idx_solution_drafts_active ON solution_drafts(is_active);

-- Enable Row Level Security (optional)
ALTER TABLE solution_drafts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your security needs)
CREATE POLICY IF NOT EXISTS "Allow all operations on drafts" ON solution_drafts
    FOR ALL USING (true);