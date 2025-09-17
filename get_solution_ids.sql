-- Get solution IDs for creating image records
-- Run this first to get the UUIDs needed for insert_real_solution_images.sql

SELECT
    id,
    solution_title,
    CASE
        WHEN solution_title ILIKE '%KABANA%' OR solution_title ILIKE '%banana%' THEN 'KABANA'
        WHEN solution_title ILIKE '%yam%' OR solution_title ILIKE '%leaf%' THEN 'YAM'
        WHEN solution_title ILIKE '%nodumax%' OR solution_title ILIKE '%soybean%' THEN 'NODUMAX'
        WHEN solution_title ILIKE '%BASICS%' AND solution_title ILIKE '%cassava%' THEN 'BASICS'
        WHEN solution_title ILIKE '%EGS%' OR solution_title ILIKE '%early generation%' THEN 'EGS'
        WHEN solution_title ILIKE '%improved%' AND solution_title ILIKE '%cassava%' AND solution_title ILIKE '%varieties%' THEN 'VARIETIES'
        WHEN solution_title ILIKE '%mandiplus%' OR solution_title ILIKE '%treatment%' THEN 'MANDIPLUS'
        WHEN solution_title ILIKE '%ME-CASS%' OR solution_title ILIKE '%monitoring%' THEN 'MECASS'
        WHEN solution_title ILIKE '%marketing%' THEN 'MARKETING'
        WHEN solution_title ILIKE '%CSAM%' THEN 'CSAM'
        WHEN solution_title ILIKE '%CSE%' OR solution_title ILIKE '%entrepreneur%' THEN 'CSE'
        WHEN solution_title ILIKE '%seed%' AND solution_title ILIKE '%field%' THEN 'SEEDFIELD'
        WHEN solution_title ILIKE '%seedtracker%' OR solution_title ILIKE '%digital%' THEN 'SEEDTRACKER'
        WHEN solution_title ILIKE '%virus%' OR solution_title ILIKE '%indexing%' THEN 'VIRUS'
        ELSE 'OTHER'
    END as technology_type
FROM solutions
ORDER BY solution_title;