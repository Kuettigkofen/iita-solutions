const fs = require('fs');
const results = JSON.parse(fs.readFileSync('processing_results.json'));

// Batch 1 updates (indices 6-15)
const batch1 = [
  {
    index: 6,
    doi: '10.22302/ICCRI.JUR.PELITAPERKEBUNAN.V37I1.395',
    abstract: 'This study quantifies and compares carbon stored as well as estimated cocoa yields in two shade management types (shaded and full sun) across three agroecological zones: Dry Semi-Deciduous Fire Zone (DSFZ), Moist Evergreen Zone (MEZ) and Upland Evergreen Moist Zone (UEMZ) in Ghana. Cocoa farms with shade trees stored 6 times more soil carbon (35.90±1.56 Mg C ha-1) compared to the full sun systems (5.98±1.56 Mg C ha-1). Soil organic carbon (SOC) stored decreased with increasing soil depth across all agroecological zones. Shade grown cocoa systems have been credited with stocking high quantities of carbon and possess potential to mitigate climate change and help achieve UN REDD+ targets.',
    keywords: 'carbon storage, cocoa agroforestry, shade management, agroecological zones, Ghana, climate change mitigation, soil organic carbon',
    status: 'completed'
  },
  {
    index: 7,
    doi: '10.3389/fsufs.2022.959604',
    abstract: 'This editorial introduces the Research Topic on Soil Fertility Management for Sustainable Food Production in Sub-Saharan Africa. Agriculture employs 60% of the active population and contributes up to 35% of the GDP in sub-Saharan Africa. However, soil fertility decline remains a major constraint to agricultural productivity. This Research Topic brings together 11 articles addressing various aspects of soil fertility management including nutrient inputs, integrated soil fertility management, and sustainable practices for improving food production in the region.',
    keywords: 'soil fertility management, sub-Saharan Africa, sustainable food production, agricultural productivity, nutrient management, soil health',
    status: 'completed'
  },
  {
    index: 8,
    doi: '10.1371/journal.pone.0299154',
    abstract: 'The fall armyworm (FAW), Spodoptera frugiperda, an invasive agricultural pest, has significantly impacted crop yields across Africa. This study investigated the relationship between temperature and FAW life history traits, employing life cycle modeling at temperatures of 20, 25, 28, 30, and 32°C. The development time for eggs, larvae, and pupae varied from 0–3 days, 10–18 days, and 7–16 days, respectively. The optimal temperature range for immature stage survival and female fecundity was identified as 21–25°C. The research projected the Establishment Risk Index (ERI), Activity Index (AI), and Generation Index (GI) for FAW under current and future climates (2050 and 2070) using RCP 2.6 and RCP 8.5 scenarios.',
    keywords: 'fall armyworm, Spodoptera frugiperda, temperature-dependent development, life table, climate change, insect life cycle model, Africa, maize, pest management',
    status: 'completed'
  },
  {
    index: 9,
    doi: '10.1371/journal.pclm.0000309',
    abstract: 'This study conducted a scoping review of literature exploring links between climate change, gender, and other social identities, and aquatic food systems (AFS), complemented by analysis of representative data on women and men aquaculture farmers in Bangladesh from 2018 to 2019. Findings show that intersecting identities disadvantage certain AFS actors, particularly young women from minority ethnic groups, and create challenges for them to manage and adapt to climate shocks and stresses. The authors conclude that further evidence-based and action-oriented research is needed to inform targeted and place-based climate interventions that address existing power inequalities and work to change social relations towards more equity and inclusion.',
    keywords: 'climate change, aquatic food systems, gender equality, intersectionality, social inequalities, climate adaptation, fisheries, aquaculture',
    status: 'completed'
  },
  {
    index: 10,
    doi: '10.1111/gcb.13885',
    abstract: 'This study tested cocoa in full sun with agroforestry systems shaded by (i) a leguminous tree species, Albizia ferruginea and (ii) Antiaris toxicaria, the most common shade tree species in the region. Researchers monitored micro-climate, sap flux density, throughfall, and soil water content from November 2014 to March 2016 at the forest-savannah transition zone of Ghana. Combined transpiration of cocoa and shade trees was significantly higher than cocoa in full sun during wet and dry periods. The research found that promoting shade cocoa agroforestry as drought resilient system especially under climate change needs to be carefully considered as shade trees constitute major risk to cocoa functioning under extended severe drought.',
    keywords: 'cocoa agroforestry, climate change, drought resilience, shade trees, Ghana, transpiration, water stress',
    status: 'completed'
  },
  {
    index: 11,
    doi: '10.1371/journal.pone.0195777',
    abstract: 'This study characterizes cocoa production, income diversification, and shade tree management along a climate gradient within the cocoa belt of Ghana. The research analyzes the relationship between climate conditions, farm management practices, and socioeconomic factors across different cocoa-growing regions.',
    keywords: 'cocoa production, climate gradient, Ghana, shade tree management, income diversification, agroforestry, climate variability',
    status: 'completed'
  },
  {
    index: 12,
    doi: '10.1016/j.agwat.2021.107247',
    abstract: 'This study examines the potential of stable carbon isotope ratios (δ13C) and leaf temperature and its derived DANS index as proxies for drought stress in banana under field conditions. Drought stress is a major limiting factor for banana production. The research evaluates these physiological indicators as tools for early detection and monitoring of water stress in banana crops.',
    keywords: 'stable carbon isotopes, leaf temperature, drought stress, banana, water stress indicators, agricultural water management',
    status: 'completed'
  },
  {
    index: 13,
    doi: '10.1016/j.eja.2018.09.004',
    abstract: 'This study assessed the potential for increasing grain legume crop production in East Africa, focusing on Ethiopia, Kenya, and Tanzania, and five legume crops including chickpea, common bean, cowpea, groundnut, and pigeonpea. The research found that on average, actual yield was 25% of water-limited yield potential across all legume-county combinations, indicating ample room for increasing legume production on existing cropland through improved agronomic practices and addressing yield gaps.',
    keywords: 'grain legumes, yield gap, East Africa, chickpea, common bean, cowpea, groundnut, pigeonpea, water-limited yield potential',
    status: 'completed'
  },
  {
    index: 14,
    doi: '10.1007/s10457-016-9973-4',
    abstract: 'This study assessed and modeled carbon stocks in various components (large trees, small trees, dead wood, litter, roots, soil, and total C) of fallow and cocoa agroforest (CAF) systems along a 50-year chronosequence in Central Cameroon. The rate of maximum growth of total C stock was reached after 12–13 years in both fallow and CAF, with maximum growth coefficients of 6.9 and 6.3 Mg C ha−1 year−1, respectively. Over approximately 30 years, both systems sequestered a total of ~200 Mg C ha−1, indicating that cocoa agroforests can provide significant climate change mitigation services.',
    keywords: 'carbon stock dynamics, cocoa agroforestry, fallow systems, Cameroon, climate change mitigation, carbon sequestration, chronosequence',
    status: 'completed'
  },
  {
    index: 15,
    doi: '10.1002/leg3.69',
    abstract: 'This paper focuses on three orphan crops: Bambara groundnut (Vigna subterranea), African yam bean (Sphenostylis stenocarpa), and Kersting\'s groundnut (Macrotyloma geocarpum). The authors discuss constraints and prospects of producing these crops, and review the rewards of conservation and characterization of genetic resources of these indigenous African legume crops. The potential of genomics technologies for improvement of these underutilized legumes in sub-Saharan Africa is explored.',
    keywords: 'underutilized legumes, genomics, Bambara groundnut, African yam bean, Kersting\'s groundnut, sub-Saharan Africa, orphan crops, genetic resources',
    status: 'completed'
  }
];

batch1.forEach(update => {
  if (results[update.index]) {
    results[update.index].doi = update.doi;
    results[update.index].abstract = update.abstract;
    results[update.index].keywords = update.keywords;
    results[update.index].status = update.status;
  }
});

fs.writeFileSync('processing_results.json', JSON.stringify(results, null, 2));
console.log('Batch 1 saved: 10 publications (indices 6-15)');
console.log('Total completed: 15/102 (14.7%)');
