-- Update data types for climate_potential and key_agroeco columns
-- Run this in your Supabase SQL Editor

ALTER TABLE solutions
ALTER COLUMN climate_potential TYPE INTEGER USING climate_potential::INTEGER,
ALTER COLUMN key_agroeco TYPE TEXT[] USING string_to_array(key_agroeco, ',');