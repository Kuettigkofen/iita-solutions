-- Add business owner role columns to solutions table
-- Run this in your Supabase SQL Editor

ALTER TABLE solutions
ADD COLUMN businessowner_summarysentence TEXT,
ADD COLUMN businessowner_text TEXT;