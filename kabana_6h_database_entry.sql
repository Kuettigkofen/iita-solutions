-- KABANA 6H/NARITA7 Banana Hybrid Database Entry
-- Complete solution data for Supabase insertion

INSERT INTO solutions (
  solution_title,
  applicable_countries,
  applicable_challenges,
  executive_summary_text,
  problem_title,
  problem_bulletpoint_1,
  problem_bulletpoint_2,
  problem_bulletpoint_3,
  problem_bulletpoint_4,
  solution_title_field,
  solution_bulletpoint_1,
  solution_bulletpoint_2,
  solution_bulletpoint_3,
  solution_bulletpoint_4,
  resources_technicalguides,
  resources_digitaltools,
  resources_researchpublications,
  resources_trainingmaterials,
  impact_text,
  climate_potential,
  key_agroeco,
  external_references,

  -- Role-specific summary sentences
  funder_summarysentence,
  policymaker_summarysentence,
  farmer_summarysentence,
  student_summarysentence,
  extensionofficer_summarysentence,
  researcher_summarysentence,
  devpractitioner_summarysentence,
  businessowner_summarysentence,

  -- Role-specific detailed text
  funder_text,
  policymaker_text,
  farmer_text,
  student_text,
  extensionofficer_text,
  researcher_text,
  devpractitioner_text,
  businessowner_text

) VALUES (
  'KABANA 6H/NARITA7 Hybrid: High-Yielding and Disease-Tolerant Banana',

  ARRAY['Uganda', 'Tanzania', 'Kenya'],

  ARRAY['banana'],

  'The KABANA 6H variety delivers exceptional yields of 57.7 kg per bunch with strong resistance to major banana diseases including Black Sigatoka, banana weevils, and nematodes. [Role-specific relevance placeholder for targeted audience engagement.]',

  'Banana Production Threatened by Disease and Low Yields',

  '[Black Sigatoka disease](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana) can reduce yields by up to 76% if left untreated, devastating farmer incomes',

  '[Banana weevils and nematodes](https://cgspace.cgiar.org/handle/10568/76186) cause significant crop losses across East Africa, with farmers struggling to control infestations',

  '[Traditional banana varieties](https://cgspace.cgiar.org/items/3e00c893-4bdb-4d79-b2c0-0470ceefd1fe) average only 7 tons/ha/year, far below the productivity needed for food security and economic viability',

  '[Climate change](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana) is increasing pest and disease pressure while farmers lack access to improved varieties',

  'KABANA 6H: Climate-Smart Disease-Resistant Banana Hybrid',

  '[Deploy disease-resistant KABANA 6H variety](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana) with 249% yield increase over traditional varieties',

  '[Implement integrated pest management](https://cgspace.cgiar.org/items/9278b701-a747-4ad3-bf2d-e57ac958040c) combining varietal resistance with good agricultural practices',

  '[Follow 10-step planting protocol](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana) including proper spacing, soil preparation, and nutrient management',

  '[Scale through farmer field schools](https://cgspace.cgiar.org/items/3e00c893-4bdb-4d79-b2c0-0470ceefd1fe) and participatory evaluation with 572 farmers across 5 sites validating acceptability',

  '[IITA Banana Breeding Manual](https://cgspace.cgiar.org/collections/e6b5719e-7637-40d5-affc-99ce76cca0bc), [Trainer''s manual: setting up and running a banana tissue culture nursery](https://cgspace.cgiar.org/collections/2bb4b114-89c0-4013-810e-370cb70363c5), [Macropropagation of banana and plantain training manual](https://cgspace.cgiar.org/collections/2bb4b114-89c0-4013-810e-370cb70363c5)',

  '[TAAT Technology Catalog](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana), [Banana Breeding Tracking Tool (BTracT)](https://cgspace.cgiar.org/collections/e6b5719e-7637-40d5-affc-99ce76cca0bc)',

  '[Selection of cooking banana genotypes for yield and black Sigatoka resistance](https://cgspace.cgiar.org/handle/10568/76186), [Consumer acceptability tests of NARITA hybrids](https://cgspace.cgiar.org/items/3e00c893-4bdb-4d79-b2c0-0470ceefd1fe), [Gene editing for banana disease resistance](https://cgspace.cgiar.org/items/9278b701-a747-4ad3-bf2d-e57ac958040c)',

  '[Rapid multiplication of plantain and banana: macropropagation techniques](https://cgspace.cgiar.org/collections/2bb4b114-89c0-4013-810e-370cb70363c5), [Morphology and growth of plantain and banana: IITA research guide](https://cgspace.cgiar.org/collections/2bb4b114-89c0-4013-810e-370cb70363c5)',

  '[57.7 kg per bunch yield](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana) with potential 60 tons/ha/year versus 7 tons/ha average for local varieties. [47.8% ROI](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana) with $4,800 economic return per hectare annually. [572 farmers](https://cgspace.cgiar.org/items/3e00c893-4bdb-4d79-b2c0-0470ceefd1fe) validated acceptability across Uganda and Tanzania. [Scaling readiness 9/9 idea maturity](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana), 8/9 level of use.',

  7,

  ARRAY['Tropic - warm subhumid', 'Tropic - warm humid', 'Subtropic - warm subhumid'],

  ARRAY['https://www.iita.org/partnerships/training/', 'https://cgspace.cgiar.org/communities/0074d1e1-d1a0-4fa2-ae90-f9bfbd09ea7d', 'https://www.naro.go.ug/', 'https://taat-africa.org/'],

  -- Role-specific summary sentences
  'Proven 47.8% ROI with $4,800 annual returns per hectare makes KABANA 6H a highly attractive investment for agricultural development funding.',

  'KABANA 6H directly supports national food security and poverty reduction goals while advancing SDG 1 (No Poverty) and SDG 2 (Zero Hunger).',

  'Farmers earn significantly higher incomes with 249% yield increases and strong disease resistance reducing crop losses and input costs.',

  'KABANA 6H breeding represents cutting-edge agricultural science combining traditional breeding with modern gene editing research for disease resistance.',

  'This validated variety provides extension officers with a proven technology backed by 572 farmer evaluations and comprehensive training materials.',

  'Rigorous research spanning 30+ years of IITA-NARO collaboration demonstrates exceptional scientific methodology and breeding innovation.',

  'Successful partnerships between IITA, NARO, and multiple African countries showcase effective scaling strategies and implementation models.',

  'KABANA 6H offers agribusiness opportunities in seed production, value chain development, and agricultural services with proven market demand.',

  -- Role-specific detailed text
  'KABANA 6H offers exceptional investment returns with [47.8% ROI](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana) and [$4,800 annual revenue per hectare](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana). The technology demonstrates [scaling readiness scores of 9/9 for idea maturity](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana), indicating fully validated performance in real-world conditions. With proven adoption across [Uganda, Tanzania, and Kenya](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana), the variety represents a mature technology ready for large-scale investment. [IITA''s 30+ year breeding program](https://cgspace.cgiar.org/items/3e00c893-4bdb-4d79-b2c0-0470ceefd1fe) provides strong institutional backing for sustained impact.',

  'KABANA 6H directly advances [SDG 1 (No Poverty) and SDG 2 (Zero Hunger)](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana) by dramatically improving smallholder farmer productivity and incomes. The variety supports national food security strategies through [249% yield increases](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana) over traditional cultivars, reducing import dependency and strengthening domestic production. Policy frameworks can leverage KABANA 6H''s [proven climate adaptability](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana) to meet climate adaptation commitments while improving agricultural resilience. The technology''s success across [multiple East African countries](https://cgspace.cgiar.org/items/3e00c893-4bdb-4d79-b2c0-0470ceefd1fe) demonstrates potential for regional policy coordination and harmonized seed systems.',

  'Farmers benefit from dramatically higher incomes with [57.7 kg bunch weights](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana) compared to traditional varieties averaging much lower yields. The variety''s [resistance to Black Sigatoka, banana weevils, and nematodes](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana) reduces pesticide costs and crop losses. Implementation follows a [straightforward 10-step process](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana) from site selection through harvest, making adoption accessible to smallholder farmers. Known locally as ["Kiwangaazi" (long-lasting)](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana), farmers have already validated its superior performance and cooking quality.',

  'Are you interested in dedicating your career to transforming African agriculture? KABANA 6H represents cutting-edge plant breeding combining [traditional hybridization with modern gene editing research](https://cgspace.cgiar.org/items/9278b701-a747-4ad3-bf2d-e57ac958040c) for enhanced disease resistance. Students can explore research opportunities in [crop improvement, disease resistance mechanisms, and participatory breeding approaches](https://cgspace.cgiar.org/items/3e00c893-4bdb-4d79-b2c0-0470ceefd1fe) that directly impact food security. [IITA offers comprehensive training programs](https://www.iita.org/partnerships/training/) including graduate fellowships, internships, and research collaborations in banana breeding and tropical agriculture.',

  'Extension officers can confidently promote KABANA 6H backed by [comprehensive evaluation with 572 farmers](https://cgspace.cgiar.org/items/3e00c893-4bdb-4d79-b2c0-0470ceefd1fe) across five sites validating farmer acceptance and cooking quality. Training materials include [detailed guides on banana tissue culture nursery establishment](https://cgspace.cgiar.org/collections/2bb4b114-89c0-4013-810e-370cb70363c5) and [macropropagation techniques](https://cgspace.cgiar.org/collections/2bb4b114-89c0-4013-810e-370cb70363c5) for scaling seed systems. The variety''s [249% yield advantage](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana) provides compelling evidence for farmer adoption, while disease resistance reduces the complexity of pest management recommendations. [Proven scaling approaches](https://cgspace.cgiar.org/handle/10568/76186) through farmer field schools and participatory evaluation ensure effective technology transfer.',

  'KABANA 6H demonstrates exceptional research rigor through [30+ years of IITA-NARO collaboration](https://cgspace.cgiar.org/items/3e00c893-4bdb-4d79-b2c0-0470ceefd1fe) combining traditional breeding with cutting-edge molecular approaches. Recent advances include [gene editing techniques targeting susceptibility genes](https://cgspace.cgiar.org/items/9278b701-a747-4ad3-bf2d-e57ac958040c) for enhanced disease resistance, representing frontier research in crop improvement. [Systematic multi-location evaluations](https://cgspace.cgiar.org/handle/10568/76186) across diverse agro-ecological zones validate performance stability and environmental adaptation. Future research opportunities include developing next-generation varieties with enhanced climate resilience and expanding resistance to emerging diseases like Fusarium Tropical Race 4.',

  'KABANA 6H showcases successful development partnerships between [IITA, NARO, and national research systems](https://cgspace.cgiar.org/items/3e00c893-4bdb-4d79-b2c0-0470ceefd1fe) across Uganda, Tanzania, and Kenya. The technology demonstrates effective scaling through [systematic farmer participatory evaluation](https://cgspace.cgiar.org/items/3e00c893-4bdb-4d79-b2c0-0470ceefd1fe) engaging 572 farmers to ensure market acceptance before release. Implementation strategies leverage existing seed systems and farmer networks, reducing barriers to adoption and enabling rapid dissemination. [TAAT''s technology catalog platform](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana) provides a replicable model for documenting and sharing agricultural innovations across Africa.',

  'KABANA 6H presents compelling business opportunities across the banana value chain with [proven farmer demand](https://cgspace.cgiar.org/items/3e00c893-4bdb-4d79-b2c0-0470ceefd1fe) validated by 572 farmers and demonstrated market acceptance. Seed production enterprises can capitalize on the variety''s [$2,542 per hectare production cost](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana) while delivering superior value through disease resistance and yield advantages. Processing businesses benefit from [consistent high-quality fruit production](https://e-catalogs.taat-africa.org/com/technologies/kabana-6hnarita7-hybrid-high-yielding-and-disease-tolerant-banana) with 57.7 kg bunch weights enabling reliable supply chains. [Agricultural service providers](https://cgspace.cgiar.org/collections/2bb4b114-89c0-4013-810e-370cb70363c5) can develop training and technical support offerings around the comprehensive cultivation protocols and tissue culture propagation methods.'
);