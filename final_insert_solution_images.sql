-- Insert real TAAT-Africa.org images for all 13 IITA solutions
-- Using actual solution UUIDs from database

-- Clear existing solution_images if needed
-- DELETE FROM solution_images;

-- 1. BASICS Model: Blueprint for Sustainable Cassava Seed Systems
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'c3d4e5f6-a7b8-9c12-cdef-345678901234', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'c3d4e5f6-a7b8-9c12-cdef-345678901234', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png', NOW(), NOW()),
(gen_random_uuid(), 'c3d4e5f6-a7b8-9c12-cdef-345678901234', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW());

-- 2. Cassava EGS Model: Early Generation Seed Production
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'e5f6a7b8-c9d0-1e34-ef01-567890123456', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/oI1SiMo1Bis4tBs0qqKvScqAq6OyZCFVEwOaFxVb.jpg', NOW(), NOW()),
(gen_random_uuid(), 'e5f6a7b8-c9d0-1e34-ef01-567890123456', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png', NOW(), NOW()),
(gen_random_uuid(), 'e5f6a7b8-c9d0-1e34-ef01-567890123456', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/oI1SiMo1Bis4tBs0qqKvScqAq6OyZCFVEwOaFxVb.jpg', NOW(), NOW());

-- 3. Cassava Virus Indexing: Molecular Diagnostics for Seed Health Certification
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'd4e5f6a7-b8c9-0d23-def0-456789012345', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png', NOW(), NOW()),
(gen_random_uuid(), 'd4e5f6a7-b8c9-0d23-def0-456789012345', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'd4e5f6a7-b8c9-0d23-def0-456789012345', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/H9NreYaPllkwbQPJESHLMaMDQg5ZqVWgxZEe6gsG.jpg', NOW(), NOW());

-- 4. CSAM Networks: Cassava Seed Agro-entrepreneur Development
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'd0e1f2a3-b4c5-6789-2345-012345678901', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'd0e1f2a3-b4c5-6789-2345-012345678901', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png', NOW(), NOW()),
(gen_random_uuid(), 'd0e1f2a3-b4c5-6789-2345-012345678901', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/oI1SiMo1Bis4tBs0qqKvScqAq6OyZCFVEwOaFxVb.jpg', NOW(), NOW());

-- 5. CSE Business Model: Commercial Cassava Seed Enterprise Development
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'e1f2a3b4-c5d6-7890-3456-123456789012', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/oI1SiMo1Bis4tBs0qqKvScqAq6OyZCFVEwOaFxVb.jpg', NOW(), NOW()),
(gen_random_uuid(), 'e1f2a3b4-c5d6-7890-3456-123456789012', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'e1f2a3b4-c5d6-7890-3456-123456789012', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/oI1SiMo1Bis4tBs0qqKvScqAq6OyZCFVEwOaFxVb.jpg', NOW(), NOW());

-- 6. Improved Cassava Varieties: Market-driven Breeding and Promotion System
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'f6a7b8c9-d0e1-2f45-f012-678901234567', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png', NOW(), NOW()),
(gen_random_uuid(), 'f6a7b8c9-d0e1-2f45-f012-678901234567', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'f6a7b8c9-d0e1-2f45-f012-678901234567', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png', NOW(), NOW());

-- 7. Leaf-bud Cuttings: Rapid Yam Multiplication Method
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/8uSiLKmmpCzWnzyTiCGUd42U5a1WXH17yU0TZUwt.jpg', NOW(), NOW()),
(gen_random_uuid(), 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/8uSiLKmmpCzWnzyTiCGUd42U5a1WXH17yU0TZUwt.jpg', NOW(), NOW());

-- 8. MandiPlus: Cutting Treatment for Cassava Whitefly Management
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'a7b8c9d0-e1f2-3056-0123-789012345678', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/3c7kHU1Bnp28LkxPZgyoufx6XVvDGm7nqOBAKmFo.png', NOW(), NOW()),
(gen_random_uuid(), 'a7b8c9d0-e1f2-3056-0123-789012345678', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png', NOW(), NOW()),
(gen_random_uuid(), 'a7b8c9d0-e1f2-3056-0123-789012345678', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/3c7kHU1Bnp28LkxPZgyoufx6XVvDGm7nqOBAKmFo.png', NOW(), NOW());

-- 9. ME-CASS: Cassava Monitoring and Evaluation Platform
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'b8c9d0e1-f2a3-4567-0123-890123456789', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/H9NreYaPllkwbQPJESHLMaMDQg5ZqVWgxZEe6gsG.jpg', NOW(), NOW()),
(gen_random_uuid(), 'b8c9d0e1-f2a3-4567-0123-890123456789', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'b8c9d0e1-f2a3-4567-0123-890123456789', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/H9NreYaPllkwbQPJESHLMaMDQg5ZqVWgxZEe6gsG.jpg', NOW(), NOW());

-- 10. NoduMax: Rhizobium Inoculant for Enhanced Soybean Nitrogen Fixation
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'b2c3d4e5-f6a7-8b01-bcde-f23456789012', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/rosLd1HekOVsB9ayoHphr1G2VzJ7MRvUnbXrmA7j.jpg', NOW(), NOW()),
(gen_random_uuid(), 'b2c3d4e5-f6a7-8b01-bcde-f23456789012', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/QfnFnWeZVCarkSpqfbHjp9S6hacWr4MloDxBXS7u.png', NOW(), NOW()),
(gen_random_uuid(), 'b2c3d4e5-f6a7-8b01-bcde-f23456789012', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/rosLd1HekOVsB9ayoHphr1G2VzJ7MRvUnbXrmA7j.jpg', NOW(), NOW());

-- 11. Seed Field Multiplication: Certified Cassava Seed Production Protocols
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'f2a3b4c5-d6e7-8901-4567-234567890123', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png', NOW(), NOW()),
(gen_random_uuid(), 'f2a3b4c5-d6e7-8901-4567-234567890123', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'f2a3b4c5-d6e7-8901-4567-234567890123', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/95Z8Q3Pm1NUnIv13CrSlqRMo0bejLrKfdrU7Tf9G.png', NOW(), NOW());

-- 12. SeedTracker: Digital Governance and Certification System
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'a3b4c5d6-e7f8-9012-5678-345678901234', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/H9NreYaPllkwbQPJESHLMaMDQg5ZqVWgxZEe6gsG.jpg', NOW(), NOW()),
(gen_random_uuid(), 'a3b4c5d6-e7f8-9012-5678-345678901234', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'a3b4c5d6-e7f8-9012-5678-345678901234', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/H9NreYaPllkwbQPJESHLMaMDQg5ZqVWgxZEe6gsG.jpg', NOW(), NOW());

-- 13. Smart Marketing Strategies for Climate-Resilient Seed Systems
INSERT INTO solution_images (id, solution_id, image_type, image_url, created_at, updated_at) VALUES
(gen_random_uuid(), 'c9d0e1f2-a3b4-5678-1234-901234567890', 'title_image', 'https://e-catalogs.taat-africa.org/images/preview/oI1SiMo1Bis4tBs0qqKvScqAq6OyZCFVEwOaFxVb.jpg', NOW(), NOW()),
(gen_random_uuid(), 'c9d0e1f2-a3b4-5678-1234-901234567890', 'problem_image', 'https://e-catalogs.taat-africa.org/images/preview/CgRcbj1LFzFOPGHvukFiiD1S4AW4E6iekCvYkPT4.jpg', NOW(), NOW()),
(gen_random_uuid(), 'c9d0e1f2-a3b4-5678-1234-901234567890', 'solution_image', 'https://e-catalogs.taat-africa.org/images/preview/oI1SiMo1Bis4tBs0qqKvScqAq6OyZCFVEwOaFxVb.jpg', NOW(), NOW());

-- Verify the inserts
-- SELECT COUNT(*) FROM solution_images;