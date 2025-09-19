-- Insert real TAAT-Africa.org images for all 13 IITA solutions
-- Each solution gets 3 images: title_image, problem_image, solution_image

-- First, get the solution IDs (we'll need to run this to see the actual UUIDs)
-- SELECT id, solution_title FROM solutions ORDER BY solution_title;

-- For now, using placeholder UUIDs - these need to be replaced with actual solution IDs from database

-- 1. KABANA 6H Banana (Climate Score: 7/10)
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'REPLACE_WITH_KABANA_UUID', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/lHUXwF1Le1Kt6J20MfYcVGyOu6yTxhnovYegHL66.png', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_KABANA_UUID', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_KABANA_UUID', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/lHUXwF1Le1Kt6J20MfYcVGyOu6yTxhnovYegHL66.png', NOW(), NOW());

-- 2. Yam Leaf-bud Cuttings (Climate Score: 9/10)
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'REPLACE_WITH_YAM_UUID', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/8uSiLKmmpCzWnzyTiCGUd42U5a1WXH17yU0TZUwt.jpg', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_YAM_UUID', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_YAM_UUID', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/8uSiLKmmpCzWnzyTiCGUd42U5a1WXH17yU0TZUwt.jpg', NOW(), NOW());

-- 3. NoduMax Soybean Inoculant (Climate Score: 8/10)
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'REPLACE_WITH_NODUMAX_UUID', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/rosLd1HekOVsB9ayoHphr1G2VzJ7MRvUnbXrmA7j.jpg', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_NODUMAX_UUID', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/QfnFnWeZVCarkSpqfbHjp9S6hacWr4MloDxBXS7u.png', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_NODUMAX_UUID', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/rosLd1HekOVsB9ayoHphr1G2VzJ7MRvUnbXrmA7j.jpg', NOW(), NOW());

-- 4. BASICS Cassava Model (Climate Score: 8/10)
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'REPLACE_WITH_BASICS_UUID', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_BASICS_UUID', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_BASICS_UUID', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW());

-- 5. Cassava EGS Model (Climate Score: 8/10)
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'REPLACE_WITH_EGS_UUID', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/oI1SiMo1Bis4tBs0qqKvScqAq6OyZCFVEwOaFxVb.jpg', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_EGS_UUID', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_EGS_UUID', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/oI1SiMo1Bis4tBs0qqKvScqAq6OyZCFVEwOaFxVb.jpg', NOW(), NOW());

-- 6. Improved Cassava Varieties (Climate Score: 8/10)
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'REPLACE_WITH_VARIETIES_UUID', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_VARIETIES_UUID', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_VARIETIES_UUID', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png', NOW(), NOW());

-- 7. MandiPlus Treatment (Climate Score: 7/10)
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'REPLACE_WITH_MANDIPLUS_UUID', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/3c7kHU1Bnp28LkxPZgyoufx6XVvDGm7nqOBAKmFo.png', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_MANDIPLUS_UUID', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_MANDIPLUS_UUID', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/3c7kHU1Bnp28LkxPZgyoufx6XVvDGm7nqOBAKmFo.png', NOW(), NOW());

-- 8. ME-CASS Monitoring (Climate Score: 7/10)
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'REPLACE_WITH_MECASS_UUID', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/H9NreYaPllkwbQPJESHLMaMDQg5ZqVWgxZEe6gsG.jpg', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_MECASS_UUID', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_MECASS_UUID', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/H9NreYaPllkwbQPJESHLMaMDQg5ZqVWgxZEe6gsG.jpg', NOW(), NOW());

-- 9. Marketing Strategies (Climate Score: 7/10)
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'REPLACE_WITH_MARKETING_UUID', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/oI1SiMo1Bis4tBs0qqKvScqAq6OyZCFVEwOaFxVb.jpg', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_MARKETING_UUID', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_MARKETING_UUID', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/oI1SiMo1Bis4tBs0qqKvScqAq6OyZCFVEwOaFxVb.jpg', NOW(), NOW());

-- 10. CSAM Networks (Climate Score: 7/10)
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'REPLACE_WITH_CSAM_UUID', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_CSAM_UUID', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_CSAM_UUID', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW());

-- 11. CSE Business Model (Climate Score: 7/10)
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'REPLACE_WITH_CSE_UUID', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/oI1SiMo1Bis4tBs0qqKvScqAq6OyZCFVEwOaFxVb.jpg', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_CSE_UUID', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_CSE_UUID', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/oI1SiMo1Bis4tBs0qqKvScqAq6OyZCFVEwOaFxVb.jpg', NOW(), NOW());

-- 12. Seed Field Multiplication (Climate Score: 7/10)
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'REPLACE_WITH_SEEDFIELD_UUID', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_SEEDFIELD_UUID', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_SEEDFIELD_UUID', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png', NOW(), NOW());

-- 13. SeedTracker Digital Tool (Climate Score: 7/10)
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'REPLACE_WITH_SEEDTRACKER_UUID', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/H9NreYaPllkwbQPJESHLMaMDQg5ZqVWgxZEe6gsG.jpg', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_SEEDTRACKER_UUID', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'REPLACE_WITH_SEEDTRACKER_UUID', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/H9NreYaPllkwbQPJESHLMaMDQg5ZqVWgxZEe6gsG.jpg', NOW(), NOW());

-- Note: Before running this script, you need to:
-- 1. Get the actual solution UUIDs by running: SELECT id, solution_title FROM solutions ORDER BY solution_title;
-- 2. Replace all "REPLACE_WITH_*_UUID" placeholders with the actual UUIDs
-- 3. Clear existing solution_images if needed: DELETE FROM solution_images;