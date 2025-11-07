const fs = require('fs');
const results = JSON.parse(fs.readFileSync('processing_results.json'));

// Update first 5 results
const updates = [
  {
    index: 0,
    doi: '10.1088/1748-9326/ac61c8',
    abstract: 'This study provides a systematic review of the impact of climate change on major staple crops in West Africa. The researchers systematically searched two databases for literature published between 2005 and 2020 and identified 35 relevant studies, analyzing yield changes of major staple crops (maize, sorghum, rice, millet, yam, cassava and groundnuts) caused by different climate change and field management scenarios. Yields declined by a median of 6% (−8% to +2% depending on the crop) due to climate change in all scenarios analyzed. Common adaptation strategies could increase crop yields affected by climate change by 13% (−4% to +19% depending on the strategy) as compared to business-as-usual field management practices, and optimized planting dates and cultivars with longer crop cycle duration could offset the negative effects of climate change on crop yields.',
    keywords: 'climate change adaptation, climate change impacts, crop productivity, West Africa',
    status: 'completed',
    notes: 'Found via ResearchGate and IOPscience'
  },
  {
    index: 2,
    doi: '10.1111/agec.12367',
    abstract: 'This study uses the agent-based simulation package MPMAS to capture non-separable production and consumption decisions at household level in Ethiopia. The research finds the promotion of new maize and wheat varieties to be an effective adaptation option, especially when accompanied by policy interventions such as credit and fertilizer subsidy. The paper is one of the first to employ agent-based modeling for quantifying both current climate and price variability effects in Sub-Saharan Africa.',
    keywords: 'agent-based modeling, climate variability, Ethiopia, policy interventions, maize, wheat varieties, smallholder farmers',
    status: 'completed',
    notes: 'Found via ResearchGate PDF'
  },
  {
    index: 3,
    doi: '10.1002/ece3.3668',
    abstract: 'The primary aim is to determine whether historical climate change has impacted the evolutionary history of African Aedes mosquitoes, using a comparative phylogeographic approach to investigate the population histories of four species of Aedes (Stegomyia) mosquitoes. This study examines how historical climate change impacted the evolutionary history of Ae. africanus, Ae. bromeliae, Ae. hansfordi, and Ae. lilii within Africa.',
    keywords: 'Aedes mosquitoes, African phylogeography, biodiversity, climate change, comparative biology, population genetics–empirical',
    status: 'completed',
    notes: 'Found via PubMed Central PMC5838080'
  },
  {
    index: 4,
    doi: '10.3390/agriculture12111853',
    abstract: 'Climate change is negatively affecting agricultural production in the Sahel region. Climate-Smart Agricultural Technologies (CSATs) are disseminated to reduce these negative effects, and particularly those on resource-poor farm households. This article investigates the distributional impacts of the adoption of CSAT on-farm households\' welfare using a dataset that covers four regions, 32 communes, 320 villages, and 2240 households in Mali. Using an instrumental variable quantile treatment effects model, the paper addresses the potential endogeneity arising from the selection bias and the heterogeneity of the effect across the quantiles of the outcome variables\' distribution. The results show that the adoption of CSAT is positively associated with improved households\' welfare, with farmers\' decisions influenced by access to credit, contact with extension agents, participation in training, access to information through television, and organizational membership.',
    keywords: 'Climate-Smart Agricultural Technologies, quantile regression, endogeneity, Sahel region, Mali',
    status: 'completed',
    notes: 'Found via MDPI open access'
  },
  {
    index: 5,
    doi: '10.1016/j.eja.2024.127137',
    abstract: 'Sub-Saharan Africa\'s (SSA) demand for cereals is projected to more than double by 2050. Climate change is generally assumed to add to the future challenges of the needed productivity increase. This study aimed to assess (i) the potential climate change impact on four key rainfed cereals (maize, millet, sorghum and wheat) in ten SSA countries namely Burkina Faso, Ghana, Mali, Niger, Nigeria, Ethiopia, Kenya, Tanzania, Uganda, and Zambia using local data and national expertise, and (ii) the potential of cultivar adaptation to climate change for the four crops. We assessed effects on rainfed potential cereal yields per crop and aggregated these to regional level in West (WA), East and Southern Africa (ESA). We made use of a rigorous agronomic dataset for 120 locations in the ten countries and performed simulations of rainfed potential yield using bias-corrected climate data from five GCMs, three time periods (1995–2014 as baseline, 2040–2059, and 2080–2099) and two scenarios. By 2050, climate change impact on rainfed potential yields was insignificant in West and modest in East and Southern Africa. By 2090, average impacts were much higher in West than in East and Southern Africa.',
    keywords: 'climate change, rainfed cereals, sub-Saharan Africa, crop adaptation, maize, millet, sorghum, wheat',
    status: 'completed',
    notes: 'Found via ScienceDirect and CGSpace'
  }
];

updates.forEach(update => {
  if (results[update.index]) {
    results[update.index].doi = update.doi;
    results[update.index].abstract = update.abstract;
    results[update.index].keywords = update.keywords;
    results[update.index].status = update.status;
    results[update.index].notes = update.notes;
  }
});

fs.writeFileSync('processing_results.json', JSON.stringify(results, null, 2));
console.log('Updated 5 publications successfully');
console.log('Progress: 5/102 completed (4.9%)');
