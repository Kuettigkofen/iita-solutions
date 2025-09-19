-- Fix solution_images with working TAAT-Africa.org URLs
-- Replace broken URLs with the verified working ones

-- First, let's see the current solution mappings
-- SELECT s.id, s.solution_title FROM solutions s ORDER BY s.solution_title;

-- Update images for Yam Leaf-bud Cuttings
UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/8uSiLKmmpCzWnzyTiCGUd42U5a1WXH17yU0TZUwt.jpg'
WHERE solution_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
AND image_type IN ('title_image', 'solution_image');

UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg'
WHERE solution_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
AND image_type = 'problem_image';

-- Update images for NoduMax Soybean
UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/rosLd1HekOVsB9ayoHphr1G2VzJ7MRvUnbXrmA7j.jpg'
WHERE solution_id = 'b2c3d4e5-f6a7-8b01-bcde-f23456789012'
AND image_type IN ('title_image', 'solution_image');

UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/QfnFnWeZVCarkSpqfbHjp9S6hacWr4MloDxBXS7u.png'
WHERE solution_id = 'b2c3d4e5-f6a7-8b01-bcde-f23456789012'
AND image_type = 'problem_image';

-- Update images for BASICS Cassava Model
UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg'
WHERE solution_id = 'c3d4e5f6-a7b8-9c12-cdef-345678901234'
AND image_type IN ('title_image', 'solution_image');

UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png'
WHERE solution_id = 'c3d4e5f6-a7b8-9c12-cdef-345678901234'
AND image_type = 'problem_image';

-- Update images for MandiPlus Treatment
UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/3c7kHU1Bnp28LkxPZgyoufx6XVvDGm7nqOBAKmFo.png'
WHERE solution_id = 'a7b8c9d0-e1f2-3056-0123-789012345678'
AND image_type IN ('title_image', 'solution_image');

UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png'
WHERE solution_id = 'a7b8c9d0-e1f2-3056-0123-789012345678'
AND image_type = 'problem_image';

-- Update images for Cassava EGS Model
UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/oI1SiMo1Bis4tBs0qqKvScqAq6OyZCFVEwOaFxVb.jpg'
WHERE solution_id = 'e5f6a7b8-c9d0-1e34-ef01-567890123456'
AND image_type IN ('title_image', 'solution_image');

UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png'
WHERE solution_id = 'e5f6a7b8-c9d0-1e34-ef01-567890123456'
AND image_type = 'problem_image';

-- Update images for SeedTracker Digital Tool
UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/H9NreYaPllkwbQPJESHLMaMDQg5ZqVWgxZEe6gsG.jpg'
WHERE solution_id = 'a3b4c5d6-e7f8-9012-5678-345678901234'
AND image_type IN ('title_image', 'solution_image');

UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg'
WHERE solution_id = 'a3b4c5d6-e7f8-9012-5678-345678901234'
AND image_type = 'problem_image';

-- Update images for ME-CASS Monitoring
UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/H9NreYaPllkwbQPJESHLMaMDQg5ZqVWgxZEe6gsG.jpg'
WHERE solution_id = 'b8c9d0e1-f2a3-4567-0123-890123456789'
AND image_type IN ('title_image', 'solution_image');

UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg'
WHERE solution_id = 'b8c9d0e1-f2a3-4567-0123-890123456789'
AND image_type = 'problem_image';

-- Update images for Improved Cassava Varieties
UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png'
WHERE solution_id = 'f6a7b8c9-d0e1-2f45-f012-678901234567'
AND image_type IN ('title_image', 'solution_image');

UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg'
WHERE solution_id = 'f6a7b8c9-d0e1-2f45-f012-678901234567'
AND image_type = 'problem_image';

-- Update images for Smart Marketing Strategies
UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/oI1SiMo1Bis4tBs0qqKvScqAq6OyZCFVEwOaFxVb.jpg'
WHERE solution_id = 'c9d0e1f2-a3b4-5678-1234-901234567890'
AND image_type IN ('title_image', 'solution_image');

UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg'
WHERE solution_id = 'c9d0e1f2-a3b4-5678-1234-901234567890'
AND image_type = 'problem_image';

-- Update images for CSE Business Model
UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/oI1SiMo1Bis4tBs0qqKvScqAq6OyZCFVEwOaFxVb.jpg'
WHERE solution_id = 'e1f2a3b4-c5d6-7890-3456-123456789012'
AND image_type IN ('title_image', 'solution_image');

UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg'
WHERE solution_id = 'e1f2a3b4-c5d6-7890-3456-123456789012'
AND image_type = 'problem_image';

-- Update images for CSAM Networks
UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg'
WHERE solution_id = 'd0e1f2a3-b4c5-6789-2345-012345678901'
AND image_type IN ('title_image', 'solution_image');

UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png'
WHERE solution_id = 'd0e1f2a3-b4c5-6789-2345-012345678901'
AND image_type = 'problem_image';

-- Update images for Seed Field Multiplication
UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png'
WHERE solution_id = 'f2a3b4c5-d6e7-8901-4567-234567890123'
AND image_type IN ('title_image', 'solution_image');

UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg'
WHERE solution_id = 'f2a3b4c5-d6e7-8901-4567-234567890123'
AND image_type = 'problem_image';

-- Update images for Cassava Virus Indexing
UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png'
WHERE solution_id = 'd4e5f6a7-b8c9-0d23-def0-456789012345'
AND image_type IN ('title_image', 'solution_image');

UPDATE solution_images
SET image_url = 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg'
WHERE solution_id = 'd4e5f6a7-b8c9-0d23-def0-456789012345'
AND image_type = 'problem_image';

-- Update the updated_at timestamp
UPDATE solution_images SET updated_at = NOW();

-- Verify the updates
SELECT COUNT(*) as total_images FROM solution_images;
SELECT DISTINCT image_url FROM solution_images ORDER BY image_url;