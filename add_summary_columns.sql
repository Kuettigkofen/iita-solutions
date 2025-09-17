-- Add summary sentence columns for each role
-- Run this in your Supabase SQL Editor after clearing the sample data

	ALTER TABLE solutions
	ADD COLUMN funder_summarysentence TEXT,
	ADD COLUMN policymaker_summarysentence TEXT,
	ADD COLUMN farmer_summarysentence TEXT,
	ADD COLUMN student_summarysentence TEXT,
	ADD COLUMN extensionofficer_summarysentence TEXT,
	ADD COLUMN researcher_summarysentence TEXT,
	ADD COLUMN devpractitioner_summarysentence TEXT;